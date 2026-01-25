'use client'

import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Upload, Cloud, X, Loader2, Bug } from 'lucide-react'
import { useCreateVoice } from '@/hooks/use-voices'
import { apiClient, API_URL } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import { useAuthClient } from '@/lib/clerk-auth-client'

interface AddCustomVoiceModalProps {
  isOpen: boolean
  onClose: () => void
  onSave?: (voiceData: { name: string; source: 'voice-clone' | 'community-voices'; provider?: string }) => void
}

interface UploadedFile {
  file: File
  duration: number
  text: string
}

export function AddCustomVoiceModal({ isOpen, onClose, onSave }: AddCustomVoiceModalProps) {
  const [activeTab, setActiveTab] = useState('voice-clone')
  const [voiceName, setVoiceName] = useState('')
  const [hasAgreed, setHasAgreed] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState('')
  const [providerVoiceId, setProviderVoiceId] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [debugLogs, setDebugLogs] = useState<string[]>([])
  const [showDebugPanel, setShowDebugPanel] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isProcessingRef = useRef(false) // Prevent multiple simultaneous calls
  const { toast } = useToast()
  const createVoiceMutation = useCreateVoice()
  const { getToken } = useAuthClient()

  const addDebugLog = (message: string, data?: any) => {
    const timestamp = new Date().toISOString()
    const logEntry = `[${timestamp}] ${message}${data ? ` | ${JSON.stringify(data, null, 2)}` : ''}`
    console.log(`[VOICE_DEBUG] ${logEntry}`)
    setDebugLogs((prev) => [...prev, logEntry])
  }

  // Get audio duration from file
  const getAudioDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const audio = new Audio()
      const url = URL.createObjectURL(file)
      
      const timeout = setTimeout(() => {
        URL.revokeObjectURL(url)
        reject(new Error('Timeout loading audio metadata'))
      }, 10000)
      
      const cleanup = () => {
        clearTimeout(timeout)
        URL.revokeObjectURL(url)
      }
      
      audio.addEventListener('loadedmetadata', () => {
        const duration = audio.duration
        cleanup()
        if (duration && !isNaN(duration) && isFinite(duration)) {
          resolve(duration)
        } else {
          reject(new Error('Invalid audio duration'))
        }
      })
      
      audio.addEventListener('error', (e) => {
        cleanup()
        reject(new Error(`Failed to load audio: ${audio.error?.message || 'Unknown error'}`))
      })
      
      audio.src = url
      audio.load()
    })
  }

  // Handle file selection
  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return
    
    addDebugLog(`Files selected`, {
      count: files.length,
      files: Array.from(files).map(f => ({ name: f.name, size: f.size, type: f.type }))
    })

    const validFiles = Array.from(files).filter(file => {
      // Check file size first
      if (file.size === 0) {
        toast({
          title: 'Invalid file',
          description: `${file.name} is empty (0 bytes). Please select a valid audio file.`,
          variant: 'destructive',
        })
        return false
      }
      
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: `${file.name} is ${(file.size / 1024 / 1024).toFixed(2)} MB. Maximum size is 10 MB.`,
          variant: 'destructive',
        })
        return false
      }

      // Check file extension (more reliable for downloaded files)
      const extension = '.' + file.name.split('.').pop()?.toLowerCase()
      const validExtensions = ['.wav', '.mp3', '.mpeg', '.webm', '.ogg', '.m4a', '.aac', '.flac']
      
      // Check MIME type (may be empty for downloaded files)
      const validTypes = [
        'audio/wav', 'audio/wave', 'audio/x-wav',
        'audio/mpeg', 'audio/mp3', 'audio/mpeg3',
        'audio/webm', 'audio/ogg', 'audio/vorbis',
        'audio/mp4', 'audio/m4a', 'audio/aac',
        'audio/flac', 'audio/x-flac'
      ]
      
      // Accept if extension is valid OR MIME type is valid OR MIME type is empty (downloaded files often have empty type)
      const isValid = validExtensions.includes(extension) || 
             validTypes.includes(file.type) || 
             (file.type === '' && validExtensions.includes(extension))
      
      if (!isValid) {
        toast({
          title: 'Invalid file type',
          description: `${file.name} is not a supported audio format. Please use WAV, MP3, WebM, OGG, M4A, AAC, or FLAC.`,
          variant: 'destructive',
        })
      }
      
      return isValid
    })

    if (validFiles.length === 0) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload audio files (WAV, MP3, WebM, OGG)',
        variant: 'destructive',
      })
      return
    }

    if (validFiles.length > 10) {
      toast({
        title: 'Too many files',
        description: 'Please upload maximum 10 files',
        variant: 'destructive',
      })
      return
    }

    // SIMPLIFIED: Just store files, no upload until Save
    if (validFiles.length + uploadedFiles.length > 10) {
      toast({
        title: 'Too many files',
        description: 'Please upload maximum 10 files',
        variant: 'destructive',
      })
      return
    }

    // Store files directly - upload happens when user clicks Save
    const newFiles: UploadedFile[] = []
    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i]
      let duration = 0
      
      // Try to get duration (non-blocking)
      try {
        duration = await getAudioDuration(file)
      } catch (error) {
        // Estimate duration if we can't calculate it
        duration = Math.max(5, Math.round((file.size / 1024 / 1024) * 60))
      }
      
      newFiles.push({
        file,
        duration,
        text: `Sample ${uploadedFiles.length + i + 1}`,
      })
    }

    setUploadedFiles(prev => [...prev, ...newFiles])
    
    addDebugLog(`Files processed and added`, {
      newFilesCount: newFiles.length,
      totalFilesCount: uploadedFiles.length + newFiles.length
    })
    
    toast({
      title: 'Files added',
      description: `Added ${newFiles.length} file(s). Click Save to create voice.`,
    })
  }, [toast])

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Handle drag and drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    handleFileSelect(e.dataTransfer.files)
  }, [handleFileSelect])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  // Remove uploaded file
  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  // Update sample text
  const updateSampleText = (index: number, text: string) => {
    setUploadedFiles(prev => prev.map((file, i) => i === index ? { ...file, text } : file))
  }

  // Handle save/create voice
  const handleSave = async () => {
    // Prevent multiple simultaneous calls
    if (isCreating || isProcessingRef.current) {
      return
    }

    if (!voiceName || !hasAgreed) {
      return
    }

    // Set processing flag
    isProcessingRef.current = true

    // For import (external), create voice directly with provider_voice_id
    if (activeTab === 'import') {
      if (!selectedProvider) {
        toast({
          title: 'Provider required',
          description: 'Please select a provider',
          variant: 'destructive',
        })
        isProcessingRef.current = false
        return
      }

      // Voice ID is required for all providers
      if (!providerVoiceId.trim()) {
        const providerName = selectedProvider === 'elevenlabs' ? 'ElevenLabs' : 
                            selectedProvider === 'cartesia' ? 'Cartesia' : 'LMNT'
        toast({
          title: 'Voice ID required',
          description: `Please enter the ${providerName} voice ID`,
          variant: 'destructive',
        })
        isProcessingRef.current = false
        return
      }

      setIsCreating(true)
      const voiceData = {
        name: voiceName,
        strategy: 'external' as const,
        source: {
          type: 'external' as const,
          provider_voice_id: providerVoiceId.trim() || undefined,
        },
        provider_overrides: {
          provider: selectedProvider,
        },
      }
      
      console.log('[VOICE_IMPORT] Starting voice import', {
        voiceName,
        selectedProvider,
        providerVoiceId: providerVoiceId.trim(),
        voiceData,
        fullVoiceData: JSON.stringify(voiceData, null, 2),
      })
      
      try {
        const result = await createVoiceMutation.mutateAsync(voiceData)
        
        console.log('[VOICE_IMPORT] Voice import successful (RAW RESPONSE)', {
          voiceName,
          result,
          fullResult: JSON.stringify(result, null, 2),
        })

        toast({
          title: 'Voice created',
          description: `"${voiceName}" has been created successfully.`,
        })

        if (onSave) {
          onSave({
            name: voiceName,
            source: 'community-voices',
            provider: selectedProvider,
          })
        }

        resetForm()
      } catch (error) {
        // Log RAW error with full details
        const rawError = error instanceof Error ? error : new Error(String(error))
        console.error('[VOICE_IMPORT] Error importing voice (RAW ERROR)', {
          voiceName,
          selectedProvider,
          providerVoiceId: providerVoiceId.trim(),
          error: rawError,
          errorMessage: rawError.message,
          errorStack: rawError.stack,
          errorName: rawError.name,
          errorCause: (rawError as any).cause,
          fullErrorObject: JSON.stringify(rawError, Object.getOwnPropertyNames(rawError), 2),
        })
        
        toast({
          title: 'Error creating voice',
          description: rawError.message || 'Failed to create voice',
          variant: 'destructive',
          duration: 10000, // Show longer for debugging
        })
      } finally {
        setIsCreating(false)
        isProcessingRef.current = false
        console.log('[VOICE_IMPORT] Voice import finished', {
          voiceName,
          isCreating: false,
        })
      }
      return
    }

    // Voice Clone Tab - Simple implementation based on test_voice_clone.py
    if (activeTab === 'voice-clone') {
      if (uploadedFiles.length === 0) {
        toast({
          title: 'Files required',
          description: 'Please upload at least one audio file for voice cloning',
          variant: 'destructive',
        })
        isProcessingRef.current = false
        return
      }

      setIsCreating(true)
      setDebugLogs([])
      setShowDebugPanel(true)
      
      addDebugLog('=== Starting Voice Cloning Process ===')
      addDebugLog('✅ Validation passed', {
        voiceName,
        filesCount: uploadedFiles.length,
        activeTab
      })

      try {
        // Convert files to base64 - much more reliable than FormData!
        addDebugLog('📦 Converting files to base64...')
        
        const convertFileToBase64 = (file: File): Promise<string> => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => {
              const result = reader.result as string
              // Remove data URL prefix (e.g., "data:audio/mpeg;base64,")
              const base64 = result.split(',')[1] || result
              resolve(base64)
            }
            reader.onerror = () => reject(new Error('Failed to read file'))
            reader.readAsDataURL(file)
          })
        }

        const filesData = await Promise.all(
          uploadedFiles.map(async (uploadedFile, index) => {
            addDebugLog(`  Converting file ${index + 1}...`, {
              name: uploadedFile.file.name,
              size: uploadedFile.file.size,
              type: uploadedFile.file.type
            })
            const base64Data = await convertFileToBase64(uploadedFile.file)
            addDebugLog(`  ✅ File ${index + 1} converted`, {
              name: uploadedFile.file.name,
              base64Length: base64Data.length
            })
            return {
              filename: uploadedFile.file.name,
              data: base64Data,
              content_type: uploadedFile.file.type || 'audio/mpeg'
            }
          })
        )
        
        addDebugLog(`✅ All ${uploadedFiles.length} file(s) converted to base64`)

        // Build JSON payload
        const payload = {
          name: voiceName,
          files: filesData
        }
        
        addDebugLog('📦 JSON payload built', {
          name: voiceName,
          filesCount: filesData.length,
          payloadSize: JSON.stringify(payload).length
        })

        // Get token
        const token = await getToken()
        if (!token) {
          throw new Error('No authentication token available')
        }
        addDebugLog('✅ Token retrieved')

        // Call voice clone endpoint with JSON (much more reliable!)
        const apiUrl = `${API_URL}/voice-clone`
        addDebugLog('🌐 Calling voice clone endpoint with JSON', { apiUrl })

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })

        if (!response.ok) {
          const errorText = await response.text()
          let errorMessage = 'Failed to create voice clone'
          try {
            const errorData = JSON.parse(errorText)
            errorMessage = errorData?.error?.message || errorData?.detail || errorMessage
          } catch {
            errorMessage = errorText || response.statusText || errorMessage
          }
          throw new Error(errorMessage)
        }

        const result = await response.json()
        addDebugLog('✅ Voice clone created successfully!', { result })

        toast({
          title: 'Voice cloned',
          description: `"${voiceName}" has been cloned successfully.`,
        })

        if (onSave) {
          onSave({
            name: voiceName,
            source: 'voice-clone',
          })
        }

        resetForm()
      } catch (error) {
        const rawError = error instanceof Error ? error : new Error(String(error))
        addDebugLog('❌ Error occurred', {
          error: rawError.message,
          stack: rawError.stack
        })
        
        toast({
          title: 'Error cloning voice',
          description: rawError.message || 'Failed to clone voice',
          variant: 'destructive',
        })
      } finally {
        setIsCreating(false)
        isProcessingRef.current = false
      }
      return
    }
  }

  const resetForm = () => {
    setVoiceName('')
    setHasAgreed(false)
    setSelectedProvider('')
    setProviderVoiceId('')
    setUploadedFiles([])
    isProcessingRef.current = false
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-[95vw] sm:w-full bg-white dark:bg-black border-gray-200 dark:border-gray-900 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
              {activeTab === 'voice-clone' ? 'Clone Voice' : 'Import Voice'}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setShowDebugPanel(!showDebugPanel)}
              title="Toggle Debug Panel"
            >
              <Bug className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-5 py-2 sm:py-4">
          {/* Tabs: Voice Clone or Import */}
          <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800">
            <button
              onClick={() => setActiveTab('voice-clone')}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'voice-clone'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Voice Clone
            </button>
            <button
              onClick={() => setActiveTab('import')}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'import'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Import Voice
            </button>
          </div>

          {/* Debug Panel */}
          {showDebugPanel && (
            <div className="border-2 border-blue-500 rounded-lg p-3 bg-black text-green-400 font-mono text-xs max-h-64 overflow-y-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold">Debug Logs</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const logsText = debugLogs.join('\n')
                    navigator.clipboard.writeText(logsText)
                    addDebugLog('📋 Debug logs copied to clipboard')
                  }}
                  className="h-6 text-xs"
                >
                  Copy
                </Button>
              </div>
              {debugLogs.length === 0 ? (
                <div className="text-gray-500">No debug logs yet. Click Save to see logs.</div>
              ) : (
                <div className="space-y-1">
                  {debugLogs.map((log, index) => (
                    <div key={index} className="whitespace-pre-wrap break-words">
                      {log}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Voice Name Input */}
          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">Voice Name</label>
            <Input
              value={voiceName}
              onChange={(e) => setVoiceName(e.target.value)}
              placeholder="Enter a voice name"
              className="w-full text-sm"
            />
          </div>

          {/* File Upload Section - Only for Voice Clone tab */}
          {activeTab === 'voice-clone' && (
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">Upload Audio Files</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*,.wav,.mp3,.mpeg,.webm,.ogg"
                multiple
                onChange={handleFileInputChange}
                className="hidden"
                disabled={isCreating}
              />
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => !isCreating && fileInputRef.current?.click()}
                className={`border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 sm:p-6 text-center hover:border-primary dark:hover:border-primary transition-colors ${
                  isCreating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
              >
                <div className="flex flex-col items-center space-y-2 sm:space-y-3">
                  <div className="p-2 sm:p-3 bg-primary/10 dark:bg-primary/20 rounded-full">
                    <Upload className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                      Choose files or drag & drop here
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      Audio formats (WAV, MP3, WebM, OGG), up to 10 MB each, max 10 files
                    </p>
                  </div>
                </div>
              </div>

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-2 mt-3">
                  {uploadedFiles.map((uploadedFile, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                          {uploadedFile.file.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {Math.round(uploadedFile.duration)}s • {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Provider Selection (for Import tab) */}
          {activeTab === 'import' && (
            <div className="space-y-2 sm:space-y-3">
              <label className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">Select Provider</label>
              <div className="grid grid-cols-1 gap-2 sm:gap-3">
                <button
                  onClick={() => setSelectedProvider('elevenlabs')}
                  className={`p-3 sm:p-4 border-2 rounded-lg text-left transition-colors ${
                    selectedProvider === 'elevenlabs'
                      ? 'border-primary bg-primary/10 dark:bg-primary/20'
                      : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-black dark:bg-white rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white dark:text-black text-xs font-bold">E</span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">ElevenLabs</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">High-quality AI voices</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedProvider('cartesia')}
                  className={`p-3 sm:p-4 border-2 rounded-lg text-left transition-colors ${
                    selectedProvider === 'cartesia'
                      ? 'border-primary bg-primary/10 dark:bg-primary/20'
                      : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">C</span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">Cartesia</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Ultra-fast voice synthesis</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedProvider('lmnt')}
                  className={`p-3 sm:p-4 border-2 rounded-lg text-left transition-colors ${
                    selectedProvider === 'lmnt'
                      ? 'border-primary bg-primary/10 dark:bg-primary/20'
                      : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">L</span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">LMNT</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Real-time voice generation</p>
                    </div>
                  </div>
                </button>
              </div>
              
              {/* Provider Voice ID Input - Show for all providers */}
              {selectedProvider && (
                <div className="space-y-1.5 sm:space-y-2 mt-3">
                  <label className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                    {selectedProvider === 'elevenlabs' ? 'ElevenLabs' : 
                     selectedProvider === 'cartesia' ? 'Cartesia' : 'LMNT'} Voice ID <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={providerVoiceId}
                    onChange={(e) => setProviderVoiceId(e.target.value)}
                    placeholder={
                      selectedProvider === 'elevenlabs' ? 'e.g., pNInz6obpgDQGcFmaJgB' :
                      selectedProvider === 'cartesia' ? 'e.g., a0e99841-438c-4a64-b679-ae501e7d6091' :
                      'e.g., lily or your custom voice ID'
                    }
                    className="w-full text-sm"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {selectedProvider === 'elevenlabs' 
                      ? 'Enter the ElevenLabs voice ID from your ElevenLabs dashboard.'
                      : selectedProvider === 'cartesia'
                      ? 'Enter the Cartesia voice ID from your Cartesia dashboard.'
                      : 'Enter the LMNT voice ID from your LMNT dashboard.'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Confirmation Checkbox */}
          <div className="flex items-start space-x-2 sm:space-x-3">
            <input
              type="checkbox"
              id="agreement"
              checked={hasAgreed}
              onChange={(e) => setHasAgreed(e.target.checked)}
              className="mt-0.5 sm:mt-1 h-4 w-4 text-primary border-gray-300 dark:border-gray-700 rounded focus:ring-primary dark:focus:ring-primary flex-shrink-0"
            />
            <label htmlFor="agreement" className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              I hereby confirm that I have all necessary rights or consents to {activeTab === 'voice-clone' ? 'clone' : 'import'} this voice and that I will not use the platform-generated content for any illegal, fraudulent, or harmful purpose.
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 sm:space-x-0 pt-2 sm:pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full sm:w-auto bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-800 text-sm"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={
                !voiceName || 
                !hasAgreed || 
                isCreating ||
                (activeTab === 'import' && (!selectedProvider || !providerVoiceId.trim())) ||
                (activeTab === 'voice-clone' && uploadedFiles.length === 0)
              }
              className="w-full sm:w-auto bg-gray-600 dark:bg-gray-300 hover:bg-gray-700 dark:hover:bg-gray-400 text-white dark:text-black disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isCreating ? (
                <>
                  {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {activeTab === 'voice-clone' ? 'Cloning...' : 'Creating...'}
                </>
              ) : (
                activeTab === 'voice-clone' ? 'Clone Voice' : 'Import Voice'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
