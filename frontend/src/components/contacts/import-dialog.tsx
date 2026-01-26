'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Upload, FileText, Loader2, CheckCircle2 } from 'lucide-react'
import { ContactFolder, ContactImportRequest } from '@/types'
import { apiClient, endpoints } from '@/lib/api'

interface ImportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  folders: ContactFolder[]
  onImportComplete: (result: { successful: number; failed: number }) => void
  folderId?: string // Optional folder ID to pre-select when importing into a specific folder
}

// Standard fields that can be mapped
const STANDARD_FIELDS = [
  { value: '__skip__', label: 'Skip / Put in Metadata' },
  { value: 'phone_number', label: 'Phone Number' },
  { value: 'email', label: 'Email' },
  { value: 'first_name', label: 'First Name' },
  { value: 'last_name', label: 'Last Name' },
  { value: 'company_name', label: 'Company Name' },
  { value: 'industry', label: 'Industry' },
  { value: 'location', label: 'Location' },
  { value: 'pin_code', label: 'Pin Code' },
  { value: 'keywords', label: 'Keywords (comma-separated)' },
]

// Simple CSV header parser
function parseCSVHeaders(csvContent: string): string[] {
  const lines = csvContent.split('\n').filter(line => line.trim())
  if (lines.length === 0) return []
  
  // Detect delimiter
  const delimiter = lines[0].includes(';') ? ';' : ','
  
  // Parse first line as headers
  const headers = lines[0]
    .split(delimiter)
    .map(h => h.trim().replace(/^"|"$/g, ''))
    .filter(h => h)
  
  return headers
}

// Simple CSV preview parser (first 5 rows)
function parseCSVPreview(csvContent: string, maxRows: number = 5): Record<string, string>[] {
  const lines = csvContent.split('\n').filter(line => line.trim())
  if (lines.length < 2) return []
  
  const delimiter = lines[0].includes(';') ? ';' : ','
  const headers = parseCSVHeaders(csvContent)
  
  const preview: Record<string, string>[] = []
  for (let i = 1; i < Math.min(lines.length, maxRows + 1); i++) {
    const values = lines[i].split(delimiter).map(v => v.trim().replace(/^"|"$/g, ''))
    const row: Record<string, string> = {}
    headers.forEach((header, idx) => {
      row[header] = values[idx] || ''
    })
    preview.push(row)
  }
  
  return preview
}

export function ImportDialog({
  open,
  onOpenChange,
  folders,
  onImportComplete,
  folderId,
}: ImportDialogProps) {
  const [selectedFolderId, setSelectedFolderId] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [csvHeaders, setCsvHeaders] = useState<string[]>([])
  const [mappingConfig, setMappingConfig] = useState<Record<string, string>>({})
  const [previewData, setPreviewData] = useState<Record<string, string>[]>([])
  const [currentStep, setCurrentStep] = useState<'upload' | 'mapping' | 'preview'>('upload')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  // Set folder ID when dialog opens if provided
  useEffect(() => {
    if (open && folderId) {
      setSelectedFolderId(folderId)
    }
  }, [open, folderId])

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setFile(null)
      // Don't reset selectedFolderId if folderId prop is provided (will be set again on open)
      if (!folderId) {
        setSelectedFolderId('')
      }
      setCsvHeaders([])
      setMappingConfig({})
      setPreviewData([])
      setCurrentStep('upload')
      setUploadProgress(0)
    }
  }, [open, folderId])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return
    
    // Accept CSV files
    if (!selectedFile.name.toLowerCase().endsWith('.csv') && selectedFile.type !== 'text/csv') {
      alert('Please select a CSV file')
      return
    }

    setFile(selectedFile)

    try {
      // Step 1: CSV Parse - Extract headers only
      const fileContent = await selectedFile.text()
      const headers = parseCSVHeaders(fileContent)
      
      if (headers.length === 0) {
        throw new Error('CSV file appears to be empty or invalid')
      }

      setCsvHeaders(headers)
      
      // Auto-map common headers
      const autoMapping: Record<string, string> = {}
      headers.forEach(header => {
        const normalized = header.toLowerCase().replace(/[^a-z0-9]/g, '_')
        if (normalized.includes('phone') || normalized.includes('mobile')) {
          autoMapping[header] = 'phone_number'
        } else if (normalized.includes('email')) {
          autoMapping[header] = 'email'
        } else if (normalized.includes('first') && !normalized.includes('last')) {
          autoMapping[header] = 'first_name'
        } else if (normalized.includes('last') || (normalized.includes('name') && !normalized.includes('first'))) {
          autoMapping[header] = 'last_name'
        } else if (normalized.includes('company')) {
          autoMapping[header] = 'company_name'
        } else if (normalized.includes('industry')) {
          autoMapping[header] = 'industry'
        } else if (normalized.includes('location') || normalized.includes('city')) {
          autoMapping[header] = 'location'
        } else if (normalized.includes('pin') || normalized.includes('postal')) {
          autoMapping[header] = 'pin_code'
        } else if (normalized.includes('keyword') || normalized.includes('tag')) {
          autoMapping[header] = 'keywords'
        }
      })
      
      setMappingConfig(autoMapping)
      
      // Generate preview
      const preview = parseCSVPreview(fileContent, 5)
      setPreviewData(preview)
      
      // Move to mapping step
      setCurrentStep('mapping')
    } catch (error) {
      console.error('Failed to parse CSV:', error)
      alert(`Failed to parse CSV: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setFile(null)
    }
  }

  const handleMappingChange = (csvHeader: string, standardField: string) => {
    setMappingConfig(prev => ({
      ...prev,
      [csvHeader]: standardField,
    }))
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!file || !selectedFolderId) {
      console.warn('Cannot submit: missing file or folder', { hasFile: !!file, selectedFolderId })
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Convert file to base64 (handle large files by chunking)
      const fileContent = await file.arrayBuffer()
      const bytes = new Uint8Array(fileContent)
      // Use chunking to avoid "Maximum call stack size exceeded" for large files
      let binary = ''
      const chunkSize = 8192
      for (let i = 0; i < bytes.length; i += chunkSize) {
        const chunk = bytes.slice(i, i + chunkSize)
        binary += String.fromCharCode(...chunk)
      }
      const base64Content = btoa(binary)
      
      setUploadProgress(30)

      // Step 3: Send base64 file with mapping config
      // Convert '__skip__' values to empty strings for backend
      const cleanedMappingConfig: Record<string, string> = {}
      Object.entries(mappingConfig).forEach(([key, value]) => {
        cleanedMappingConfig[key] = value === '__skip__' ? '' : value
      })

      const importData: ContactImportRequest = {
        folder_id: selectedFolderId,
        base64_file: base64Content,
        filename: file.name,
        mapping_config: cleanedMappingConfig,
      }

      setUploadProgress(60)

      const importResponse = await apiClient.post<{ successful: number; failed: number; errors?: any[] }>(
        endpoints.contacts.import,
        importData
      )

      setUploadProgress(100)
      
      // Handle response structure: 
      // Backend returns: { data: { successful, failed, errors }, meta: {...} }
      // apiClient returns: BackendResponse<T> = { data: T, meta: {...} }
      // So importResponse.data = { successful, failed, errors }
      const result = importResponse.data
      if (!result || typeof result.successful === 'undefined') {
        console.error('Unexpected response structure:', { importResponse, result })
        throw new Error('Invalid response format from server')
      }
      
      onImportComplete({
        successful: result.successful || 0,
        failed: result.failed || 0,
      })
      onOpenChange(false)
    } catch (error) {
      console.error('Import failed:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to import contacts'
      alert(`Import failed: ${errorMessage}`)
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Contacts</DialogTitle>
          <DialogDescription>
            Upload a CSV file and map columns to standard fields. Unmapped columns will be stored in metadata.
          </DialogDescription>
        </DialogHeader>

        {currentStep === 'upload' && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="folder">Folder *</Label>
              <Select
                value={selectedFolderId}
                onValueChange={setSelectedFolderId}
                disabled={isUploading}
              >
                <SelectTrigger id="folder">
                  <SelectValue placeholder="Select folder" />
                </SelectTrigger>
                <SelectContent>
                  {folders.map((folder) => (
                    <SelectItem key={folder.id} value={folder.id}>
                      {folder.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="file">CSV File *</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="file"
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  disabled={isUploading}
                  className="flex-1"
                />
                {file && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <FileText className="h-4 w-4" />
                    <span className="truncate max-w-[150px]">{file.name}</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Select a CSV file. You'll map columns in the next step.
              </p>
            </div>
            {csvHeaders.length > 0 && (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Found {csvHeaders.length} columns. Ready to map fields.</span>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => file && csvHeaders.length > 0 && setCurrentStep('mapping')}
                disabled={!file || !selectedFolderId || csvHeaders.length === 0}
              >
                Next: Map Fields
              </Button>
            </DialogFooter>
          </div>
        )}

        {currentStep === 'mapping' && csvHeaders.length > 0 && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Step 2: Map CSV Headers to Standard Fields</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Map each CSV column to a standard field. Unmapped columns will be stored in metadata.
              </p>
              <div className="space-y-2">
                <Label htmlFor="folder-mapping">Target Folder *</Label>
                <Select
                  value={selectedFolderId}
                  onValueChange={setSelectedFolderId}
                  disabled={isUploading || !!folderId}
                >
                  <SelectTrigger id="folder-mapping">
                    <SelectValue placeholder="Select folder" />
                  </SelectTrigger>
                  <SelectContent>
                    {folders.map((folder) => (
                      <SelectItem key={folder.id} value={folder.id}>
                        {folder.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {folderId && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Folder is pre-selected for this import.
                  </p>
                )}
              </div>
            </div>

            <div className="border rounded-lg max-h-[400px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">CSV Header</TableHead>
                    <TableHead>Map To Standard Field</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {csvHeaders.map((header) => (
                    <TableRow key={header}>
                      <TableCell className="font-medium">{header}</TableCell>
                      <TableCell>
                        <Select
                          value={mappingConfig[header] || '__skip__'}
                          onValueChange={(value) => handleMappingChange(header, value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select field..." />
                          </SelectTrigger>
                          <SelectContent>
                            {STANDARD_FIELDS.map((field) => (
                              <SelectItem key={field.value} value={field.value}>
                                {field.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Preview Table */}
            {previewData.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Preview (first 5 rows)</h3>
                <div className="border rounded-lg max-h-[200px] overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {csvHeaders.map((header) => (
                          <TableHead key={header} className="text-xs">
                            {header}
                            {mappingConfig[header] && (
                              <span className="ml-1 text-primary">→ {mappingConfig[header]}</span>
                            )}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {previewData.map((row, idx) => (
                        <TableRow key={idx}>
                          {csvHeaders.map((header) => (
                            <TableCell key={header} className="text-xs">
                              {row[header] || '-'}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {/* Debug panel - shows why button might be disabled */}
            <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border text-xs space-y-1">
              <div><strong>Button Status:</strong></div>
              <div>• File selected: {file ? `✅ ${file.name}` : '❌ No file'}</div>
              <div>• Folder selected: {selectedFolderId ? `✅ ${folders.find(f => f.id === selectedFolderId)?.name || selectedFolderId}` : '❌ No folder'}</div>
              <div>• Uploading: {isUploading ? '⏳ Yes' : '✅ No'}</div>
              <div>• Button enabled: {!(isUploading || !file || !selectedFolderId) ? '✅ YES' : '❌ NO'}</div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep('upload')}
                disabled={isUploading}
              >
                Back
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isUploading || !file || !selectedFolderId}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Import Contacts
                  </>
                )}
              </Button>
            </DialogFooter>
            {isUploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Importing...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
