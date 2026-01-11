'use client'

import { useState, useRef, useEffect } from 'react'
import { AppLayout } from '@/components/layout/app-layout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Upload, Table2, File, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAgents } from '@/hooks/use-agents'
import { useQuery } from '@tanstack/react-query'
import { apiClient, endpoints } from '@/lib/api'
import { useClientId } from '@/lib/clerk-auth-client'
import { formatPhoneNumber } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import * as XLSX from 'xlsx'

export default function NewCampaignPage() {
  const router = useRouter()
  const clientId = useClientId()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [batchName, setBatchName] = useState('Untitled Batch')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [selectedAgent, setSelectedAgent] = useState('')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [parsedData, setParsedData] = useState<{ columns: string[]; rows: Record<string, any>[] } | null>(null)
  const [isParsing, setIsParsing] = useState(false)
  
  // Fetch agents from database
  const { data: agents = [], isLoading: agentsLoading } = useAgents()
  
  // Fetch phone numbers from database
  const { data: phoneNumbersData, isLoading: phoneNumbersLoading } = useQuery({
    queryKey: ['phone-numbers', clientId],
    queryFn: async () => {
      const response = await apiClient.get<Array<{ id: string; phone_number: string; label?: string }>>(endpoints.telephony.numbers)
      // Backend returns { data: [...], meta: {...}, pagination: {...} }
      return Array.isArray(response.data) ? response.data : []
    },
    enabled: !!clientId,
  })
  
  const phoneNumbers = phoneNumbersData || []

  // Validate file type
  const isValidFileType = (file: File): boolean => {
    const validTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ]
    const validExtensions = ['.csv', '.xls', '.xlsx']
    const extension = '.' + file.name.split('.').pop()?.toLowerCase()
    return validTypes.includes(file.type) || validExtensions.includes(extension)
  }

  // Handle file selection
  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return

    const file = files[0]

    if (!isValidFileType(file)) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a CSV, XLS, or XLSX file',
        variant: 'destructive',
      })
      return
    }

    setUploadedFile(file)
    toast({
      title: 'File selected',
      description: `${file.name} has been selected`,
    })
  }

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files)
    // Reset input so same file can be selected again
    if (e.target) {
      e.target.value = ''
    }
  }

  // Handle button click to trigger file input
  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  // Handle remove file
  const handleRemoveFile = () => {
    setUploadedFile(null)
    setParsedData(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Parse CSV line handling quoted fields
  const parseCSVLine = (line: string): string[] => {
    const result: string[] = []
    let current = ''
    let inQuotes = false
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      const nextChar = line[i + 1]
      
      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // Escaped quote
          current += '"'
          i++ // Skip next quote
        } else {
          // Toggle quote state
          inQuotes = !inQuotes
        }
      } else if (char === ',' && !inQuotes) {
        // End of field
        result.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    
    // Add last field
    result.push(current.trim())
    return result
  }

  // Parse CSV file
  const parseCSV = async (file: File): Promise<{ columns: string[]; rows: Record<string, any>[] }> => {
    const text = await file.text()
    const lines = text.split(/\r?\n/).filter(line => line.trim())
    
    if (lines.length === 0) {
      throw new Error('CSV file is empty')
    }

    // Parse header
    const columns = parseCSVLine(lines[0]).map(col => col.replace(/^"|"$/g, ''))
    
    // Parse rows (first 20 rows)
    const rows: Record<string, any>[] = []
    for (let i = 1; i < Math.min(lines.length, 21); i++) {
      const values = parseCSVLine(lines[i]).map(val => val.replace(/^"|"$/g, ''))
      const row: Record<string, any> = {}
      columns.forEach((col, index) => {
        row[col] = values[index] !== undefined ? values[index] : ''
      })
      rows.push(row)
    }

    return { columns, rows }
  }

  // Parse XLSX file
  const parseXLSX = async (file: File): Promise<{ columns: string[]; rows: Record<string, any>[] }> => {
    const arrayBuffer = await file.arrayBuffer()
    const workbook = XLSX.read(arrayBuffer, { type: 'array' })
    
    // Get first sheet
    const firstSheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[firstSheetName]
    
    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][]
    
    if (jsonData.length === 0) {
      throw new Error('Excel file is empty')
    }

    // First row is header
    const columns = (jsonData[0] || []).map(col => String(col || '').trim())
    
    // Get first 20 rows
    const rows: Record<string, any>[] = []
    for (let i = 1; i < Math.min(jsonData.length, 21); i++) { // First 20 rows (plus header)
      const rowData = jsonData[i] || []
      const row: Record<string, any> = {}
      columns.forEach((col, index) => {
        row[col] = rowData[index] !== undefined ? String(rowData[index] || '').trim() : ''
      })
      rows.push(row)
    }

    return { columns, rows }
  }

  // Parse uploaded file
  useEffect(() => {
    const parseFile = async () => {
      if (!uploadedFile) {
        setParsedData(null)
        return
      }

      setIsParsing(true)
      try {
        const fileExtension = uploadedFile.name.split('.').pop()?.toLowerCase()
        let data: { columns: string[]; rows: Record<string, any>[] }

        if (fileExtension === 'csv') {
          data = await parseCSV(uploadedFile)
        } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
          data = await parseXLSX(uploadedFile)
        } else {
          throw new Error('Unsupported file type')
        }

        setParsedData(data)
      } catch (error) {
        console.error('Error parsing file:', error)
        toast({
          title: 'Error parsing file',
          description: error instanceof Error ? error.message : 'Failed to parse file',
          variant: 'destructive',
        })
        setParsedData(null)
      } finally {
        setIsParsing(false)
      }
    }

    parseFile()
  }, [uploadedFile, toast])

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  return (
    <AppLayout>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 pb-6 border-b border-gray-200 dark:border-gray-900">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => router.push('/campaigns')}
            className="rounded-lg"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create a batch call</h1>
        </div>

        {/* Main Content */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 py-6 overflow-hidden">
          {/* Left Form */}
          <div className="space-y-6 overflow-y-auto pr-4">
            {/* Batch Name */}
            <div className="space-y-2 ml-[10px]">
              <Label className="text-sm font-medium text-gray-900 dark:text-white">Batch name</Label>
              <Input
                value={batchName}
                onChange={(e) => setBatchName(e.target.value)}
                className="w-full"
                required
                placeholder="Enter batch name"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-2 ml-[10px]">
              <Label className="text-sm font-medium text-gray-900 dark:text-white">Phone Number</Label>
              <Select value={phoneNumber} onValueChange={setPhoneNumber} disabled={phoneNumbersLoading}>
                <SelectTrigger>
                  <SelectValue placeholder={phoneNumbersLoading ? "Loading..." : phoneNumbers.length === 0 ? "No phone numbers available" : "Please add a phone number to start batch calling"} />
                </SelectTrigger>
                {phoneNumbers.length > 0 && (
                  <SelectContent>
                    {phoneNumbers.map((phone) => (
                      <SelectItem key={phone.id} value={phone.phone_number}>
                        {phone.label ? `${phone.label} - ${formatPhoneNumber(phone.phone_number)}` : formatPhoneNumber(phone.phone_number)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                )}
              </Select>
            </div>

            {/* Select Agent */}
            <div className="space-y-2 ml-[10px]">
              <Label className="text-sm font-medium text-gray-900 dark:text-white">Select Agent</Label>
              <Select value={selectedAgent} onValueChange={setSelectedAgent} disabled={agentsLoading || agents.length === 0}>
                <SelectTrigger>
                  <SelectValue placeholder={agentsLoading ? "Loading..." : agents.length === 0 ? "No agents available" : "Select an agent"} />
                </SelectTrigger>
                {agents.length > 0 && (
                  <SelectContent>
                    {agents.filter(agent => agent.status === 'active').map((agent) => (
                      <SelectItem key={agent.id} value={agent.id}>
                        {agent.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                )}
              </Select>
            </div>

            {/* Recipients */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-gray-900 dark:text-white">Recipients</Label>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900">
                    CSV
                  </Badge>
                  <Badge variant="secondary" className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900">
                    XLS
                  </Badge>
                </div>
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xls,.xlsx,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                onChange={handleFileInputChange}
                className="hidden"
              />

              {/* Upload area */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                    : 'border-gray-200 dark:border-gray-800'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {uploadedFile ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <File className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        <div className="text-left">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {uploadedFile.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {(uploadedFile.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleRemoveFile}
                          className="h-6 w-6 rounded-full hover:bg-red-100 dark:hover:bg-red-900"
                        >
                          <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        </Button>
                      </div>
                    </div>
                    <Button variant="outline" onClick={handleUploadClick}>
                      <Upload className="h-4 w-4 mr-2" />
                      Replace File
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                          Drop your file here or click to browse
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          CSV, XLS, or XLSX files only
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" onClick={handleUploadClick}>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload File
                    </Button>
                  </div>
                )}
              </div>

              {/* Formatting Info */}
              <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 space-y-2">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Formatting</h4>
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <p>
                    {!selectedAgent ? (
                      <>
                        The <span className="font-mono text-gray-900 dark:text-white">full_name</span> and <span className="font-mono text-gray-900 dark:text-white">phone_number</span> columns are required. You can also pass certain{' '}
                        <span className="font-medium text-gray-900 dark:text-white">overrides</span>. Any other columns will be passed as dynamic variables.
                      </>
                    ) : (
                      <>
                        The <span className="font-mono text-gray-900 dark:text-white">phone_number</span> column is required. You can also pass certain{' '}
                        <span className="font-medium text-gray-900 dark:text-white">overrides</span>. Any other columns will be passed as dynamic variables.
                      </>
                    )}
                  </p>
                  <div className="mt-3 flex gap-4 text-xs">
                    <div>
                      <div className="font-medium text-gray-700 dark:text-gray-300 mb-1">full_name</div>
                      <div className="space-y-0.5 text-gray-600 dark:text-gray-400">
                        <div>Nav Smith</div>
                        <div>Avbay Johnson</div>
                        <div>Thor Williams</div>
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-700 dark:text-gray-300 mb-1">phone_number</div>
                      <div className="space-y-0.5 text-gray-600 dark:text-gray-400">
                        <div>+12125551234</div>
                        <div>+442071234567</div>
                        <div>+81812345678</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Preview */}
          <div className="hidden lg:flex flex-col bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-[25px] min-h-0">
            {isParsing ? (
              <div className="flex items-center justify-center flex-1">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Parsing file...</p>
                </div>
              </div>
            ) : parsedData && parsedData.rows.length > 0 ? (
              <div className="flex flex-col h-full min-h-0">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Preview (First 20 rows)
                </h3>
                <div className="flex-1 min-h-0 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
                  <div className="h-full w-full overflow-auto [scrollbar-width:thin] [scrollbar-color:transparent_transparent] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded">
                    <table className="w-full border-collapse min-w-full">
                      <thead className="sticky top-0 bg-gray-50 dark:bg-gray-900 z-10">
                        <tr>
                          {parsedData.columns.map((column, index) => (
                            <th
                              key={index}
                              className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-800 whitespace-nowrap"
                            >
                              {column}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-black divide-y divide-gray-200 dark:divide-gray-800">
                        {parsedData.rows.map((row, rowIndex) => (
                          <tr key={rowIndex} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                            {parsedData.columns.map((column, colIndex) => (
                              <td
                                key={colIndex}
                                className="px-4 py-3 text-sm text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-900 whitespace-nowrap"
                              >
                                {row[column] || ''}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center flex-1">
                <div className="text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-white dark:bg-black border border-gray-200 dark:border-gray-800 mx-auto mb-4">
                    <Table2 className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No recipients yet
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm">
                    Upload a CSV or XLSX to start adding recipients to this batch call
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-900">
          <Button variant="outline">
            Test call
          </Button>
          <Button 
            className={batchName.trim() ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-400 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-600 text-white cursor-not-allowed"} 
            disabled={!batchName.trim()}
          >
            Submit a Batch Call
          </Button>
        </div>
      </div>
    </AppLayout>
  )
}

