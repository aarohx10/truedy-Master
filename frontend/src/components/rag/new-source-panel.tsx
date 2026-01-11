'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

interface NewSourcePanelProps {
  isOpen: boolean
  onClose: () => void
}

export function NewSourcePanel({ isOpen, onClose }: NewSourcePanelProps) {
  const [sourceType, setSourceType] = useState<'web' | 'document'>('web')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [url, setUrl] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewText, setPreviewText] = useState<string>('')
  const [isParsing, setIsParsing] = useState(false)
  const [isContentAccessible, setIsContentAccessible] = useState(false)

  // Parse text from file
  const parseFile = async (file: File) => {
    if (!file) {
      setPreviewText('')
      return
    }

    setIsParsing(true)
    setPreviewText('') // Clear previous preview while parsing
    
    try {
      const fileExtension = file.name.split('.').pop()?.toLowerCase()
      
      if (fileExtension === 'txt') {
        const text = await file.text()
        setPreviewText(text || '(File appears to be empty)')
      } else if (fileExtension === 'pdf') {
        // For PDF, we'll show a message that parsing happens on backend
        // In a real implementation, you'd use a PDF parsing library
        setPreviewText('[PDF Content]\n\nPDF parsing will be processed on the server. The full text content will be extracted and indexed after upload.')
      } else if (fileExtension === 'docx' || fileExtension === 'doc') {
        // For DOCX/DOC, similar message
        setPreviewText('[Document Content]\n\nDocument parsing will be processed on the server. The full text content will be extracted and indexed after upload.')
      } else {
        setPreviewText('Unsupported file type. Please upload a .txt, .pdf, .doc, or .docx file.')
      }
    } catch (error) {
      console.error('Error parsing file:', error)
      setPreviewText(`Error parsing file: ${error instanceof Error ? error.message : 'Unknown error'}\n\nPlease try uploading the file again.`)
    } finally {
      setIsParsing(false)
    }
  }

  // Check if URL is a Google Docs URL
  const isGoogleDocsUrl = (url: string): boolean => {
    return url.includes('docs.google.com/document/')
  }

  // Clean text content - remove UI elements and navigation
  const cleanTextContent = (text: string): string => {
    // Remove common UI elements and navigation text patterns
    const uiPatterns = [
      /Tab\s+/gi,
      /External\s+/gi,
      /Share\s*/gi,
      /Sign\s+in\s*/gi,
      /File\s*/gi,
      /Edit\s*/gi,
      /View\s*/gi,
      /Tools\s*/gi,
      /Help\s*/gi,
      /Accessibility\s*/gi,
      /Debug\s*/gi,
      /Insert\s*/gi,
      /Format\s*/gi,
      /Extensions\s*/gi,
      /Menu\s*/gi,
      /Undo\s*/gi,
      /Redo\s*/gi,
      /Print\s*/gi,
      /Copy\s+format\s*/gi,
      /Normal\s+text\s*/gi,
      /Arial\s*/gi,
      /Bold\s*/gi,
      /Italic\s*/gi,
      /Underline\s*/gi,
      /Align\s*/gi,
      /Line\s+spacing\s*/gi,
      /Checklist\s*/gi,
      /Bullet\s+points\s*/gi,
      /Numbered\s+list\s*/gi,
      /Indent\s*/gi,
      /Outdent\s*/gi,
      /Clear\s+formatting\s*/gi,
      /Version\s+history\s*/gi,
      /Comment\s*/gi,
      /Video\s+call\s*/gi,
      /Editing\s*/gi,
      /Document\s+tabs\s*/gi,
      /Tab\s+\d+\s*/gi,
      /Headings\s+that\s+you\s+add\s+to\s+the\s+document\s+will\s+appear\s+here\.\s*/gi,
    ]

    let cleaned = text
    uiPatterns.forEach(pattern => {
      cleaned = cleaned.replace(pattern, '')
    })

    // Remove excessive whitespace and normalize
    cleaned = cleaned
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n\s*\n+/g, '\n\n')
      .trim()

    return cleaned
  }

  // Parse text from web URL
  const parseWebUrl = async (urlToParse: string) => {
    if (!urlToParse || !urlToParse.startsWith('http')) {
      setPreviewText('')
      setIsContentAccessible(false)
      return
    }

    setIsParsing(true)
    setIsContentAccessible(false)
    
    try {
      const isGoogleDocs = isGoogleDocsUrl(urlToParse)
      
      const response = await fetch(urlToParse, {
        mode: 'cors',
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
      })
      
      if (!response.ok) {
        if (response.status === 403 || response.status === 401) {
          if (isGoogleDocs) {
            setPreviewText('⚠️ This Google Doc is restricted and not accessible.\n\nPlease make sure the document has at least "Viewer" access granted to "Anyone with the link" in the sharing settings.\n\nTo fix this:\n1. Open the Google Doc\n2. Click "Share" button\n3. Change access to "Anyone with the link" with "Viewer" permission\n4. Then paste the link here again')
            setIsContentAccessible(false)
          } else {
            setPreviewText(`⚠️ This document is restricted and not accessible.\n\nPlease ensure the document has public viewing access or is accessible without authentication.`)
            setIsContentAccessible(false)
          }
          setIsParsing(false)
          return
        }
        throw new Error(`Failed to fetch: ${response.statusText}`)
      }

      const html = await response.text()
      
      // Extract text from HTML
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, 'text/html')
      
      // Remove all script, style, and navigation elements
      const elementsToRemove = doc.querySelectorAll(
        'script, style, noscript, nav, header, footer, [role="navigation"], [role="banner"], [role="contentinfo"], .navbar, .header, .footer, .menu, .toolbar, button, [class*="menu"], [class*="nav"], [class*="toolbar"], [id*="menu"], [id*="nav"], [id*="toolbar"]'
      )
      elementsToRemove.forEach(el => el.remove())
      
      // For Google Docs, try to use export format to get actual content
      let text = ''
      if (isGoogleDocs) {
        // Extract document ID from URL
        const docIdMatch = urlToParse.match(/\/document\/d\/([a-zA-Z0-9-_]+)/)
        if (docIdMatch && docIdMatch[1]) {
          const docId = docIdMatch[1]
          // Try to fetch as plain text export (works for public docs)
          try {
            const exportUrl = `https://docs.google.com/document/d/${docId}/export?format=txt`
            const exportResponse = await fetch(exportUrl, {
              mode: 'cors',
              method: 'GET',
            })
            
            if (exportResponse.ok) {
              const exportText = await exportResponse.text()
              if (exportText && exportText.trim().length > 0) {
                text = exportText.trim()
              }
            }
          } catch (exportError) {
            // Export failed, fall back to HTML parsing
            console.log('Export format not available, using HTML parsing')
          }
        }
        
        // If export didn't work, try HTML parsing strategies
        if (!text || text.length < 3) {
          // Strategy 1: Look for meta description
          const metaDesc = doc.querySelector('meta[name="description"], meta[property="og:description"]')
          if (metaDesc) {
            const metaText = metaDesc.getAttribute('content') || ''
            if (metaText && metaText.length > 5) {
              text = metaText
            }
          }
          
          // Strategy 2: Extract from body and filter intelligently
          if (!text || text.length < 3) {
            const bodyText = doc.body?.textContent || doc.documentElement?.textContent || ''
            
            // Remove all known UI patterns and get remaining text
            const uiPattern = /\b(File|Edit|View|Insert|Format|Tools|Extensions|Help|Sign in|Share|Tab|External|Menu|Undo|Redo|Print|Copy format|Normal text|Arial|Bold|Italic|Underline|Align|Line spacing|Checklist|Bullet points|Numbered list|Indent|Outdent|Clear formatting|Version history|Comment|Video call|Editing|Document tabs|Tab \d+|Headings that you add to the document will appear here|Accessibility|Debug)\b/gi
            
            // Split by UI patterns and find meaningful segments
            const segments = bodyText.split(uiPattern)
            let bestSegment = ''
            
            for (const segment of segments) {
              const trimmed = segment.trim()
              // Look for segments that have actual words (not just single characters or UI)
              if (trimmed.length > bestSegment.length && 
                  trimmed.length >= 2 &&
                  /[a-zA-Z]{2,}/.test(trimmed)) { // Has at least one 2+ letter word
                bestSegment = trimmed
              }
            }
            
            if (bestSegment.length >= 2) {
              text = bestSegment
            } else {
              // Try to extract any text that looks like content
              const allText = bodyText.replace(uiPattern, ' ').trim()
              if (allText.length >= 2 && /[a-zA-Z]{2,}/.test(allText)) {
                text = allText
              }
            }
          }
        }
      } else {
        // For other sites, get main content
        const mainContent = doc.querySelector('main, article, [role="main"], .content, .main-content')
        if (mainContent) {
          text = mainContent.textContent || ''
        } else {
          text = doc.body?.textContent || doc.documentElement?.textContent || ''
        }
      }
      
      // Clean the text to remove UI elements
      const cleanedText = cleanTextContent(text)
      
      // For Google Docs, validate we have real content
      if (isGoogleDocs) {
        // Check if we have meaningful content
        const hasContent = cleanedText && 
                          cleanedText.trim().length >= 2 && 
                          /[a-zA-Z0-9]{2,}/.test(cleanedText) // Has at least some alphanumeric content
        
        if (hasContent) {
          setPreviewText(cleanedText)
          setIsContentAccessible(true)
        } else {
          // Even if we can't preview, allow saving (backend will parse it properly)
          setPreviewText('📄 Google Doc detected and accessible.\n\nThe document content will be fully parsed and indexed on the server after saving.\n\nNote: Preview is limited for Google Docs due to dynamic content loading.')
          setIsContentAccessible(true) // Allow saving - backend will handle parsing
        }
      } else {
        if (!cleanedText || cleanedText.trim().length === 0) {
          setPreviewText('No text content found on this page.')
          setIsContentAccessible(false)
        } else {
          setPreviewText(cleanedText)
          setIsContentAccessible(true)
        }
      }
    } catch (error) {
      // Handle CORS and other errors
      if (error instanceof TypeError && (error.message.includes('fetch') || error.message.includes('CORS'))) {
        const isGoogleDocs = isGoogleDocsUrl(urlToParse)
        if (isGoogleDocs) {
          setPreviewText('⚠️ Unable to access this Google Doc due to access restrictions.\n\nPlease make sure the document has at least "Viewer" access granted to "Anyone with the link" in the sharing settings.\n\nTo fix this:\n1. Open the Google Doc\n2. Click "Share" button\n3. Change access to "Anyone with the link" with "Viewer" permission\n4. Then paste the link here again')
        } else {
          setPreviewText('⚠️ Unable to fetch content from this URL.\n\nThis may be due to:\n- CORS restrictions\n- Access restrictions\n- Invalid URL\n\nThe content will be parsed on the server after saving.')
        }
        setIsContentAccessible(false)
      } else {
        setPreviewText(`Error fetching URL: ${error instanceof Error ? error.message : 'Unknown error'}`)
        setIsContentAccessible(false)
      }
    } finally {
      setIsParsing(false)
    }
  }

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setSelectedFile(file)
    if (file) {
      parseFile(file)
      setIsContentAccessible(true) // Files are accessible once selected
    } else {
      setPreviewText('')
      setIsContentAccessible(false)
    }
  }

  // Handle URL change
  useEffect(() => {
    if (sourceType === 'web' && url) {
      const timeoutId = setTimeout(() => {
        parseWebUrl(url)
      }, 500) // Debounce URL parsing
      return () => clearTimeout(timeoutId)
    } else if (sourceType === 'web') {
      setPreviewText('')
      setIsContentAccessible(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, sourceType])

  // Reset preview when switching source types
  useEffect(() => {
    if (sourceType === 'document' && selectedFile) {
      parseFile(selectedFile)
      setIsContentAccessible(true) // Files are always accessible once parsed
    } else if (sourceType === 'document' && !selectedFile) {
      setPreviewText('')
      setIsContentAccessible(false)
    } else if (sourceType === 'web') {
      if (url) {
        parseWebUrl(url)
      } else {
        setPreviewText('')
        setIsContentAccessible(false)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceType, selectedFile, url])

  const handleSave = () => {
    // Only save the cleaned preview text (not error messages or UI elements)
    const textToSave = isContentAccessible && previewText && !previewText.startsWith('⚠️') 
      ? previewText 
      : ''
    
    // Handle save logic here
    console.log({ 
      name, 
      description, 
      sourceType, 
      url, 
      file: selectedFile, 
      previewText: textToSave, // Only save valid content
      isContentAccessible 
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Universal Overlay - covers entire viewport including sidebar */}
      <div
        className="fixed inset-0 z-[70] bg-white/50 dark:bg-black/50 backdrop-blur-[12px] transition-opacity pointer-events-auto"
        onClick={onClose}
      />

      {/* Centered Modal - above overlay to prevent blur */}
      <div className="fixed inset-0 z-[80] flex items-center justify-center p-[25px] pointer-events-none">
        <div
          className={cn(
            'relative w-[800px] h-[800px] bg-white dark:bg-black rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-900',
            'transition-all duration-300 pointer-events-auto',
            isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-[25px] py-4 border-b border-gray-200 dark:border-gray-900 bg-white dark:bg-black rounded-t-2xl flex-shrink-0">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">New Source</h2>
            <button
              onClick={onClose}
              className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-900"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content - Not scrollable */}
          <div className="flex-1 flex flex-col overflow-hidden px-[25px] py-[25px]">
            <div className="flex flex-col gap-4 h-full">
              {/* Name */}
              <div className="space-y-2 flex-shrink-0">
                <Label htmlFor="name" className="text-sm font-medium text-gray-900 dark:text-white">
                  Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Employee Handbook"
                  className="bg-white dark:bg-black border-gray-300 dark:border-gray-800 rounded-lg"
                />
              </div>

              {/* Description */}
              <div className="space-y-2 flex-shrink-0">
                <Label htmlFor="description" className="text-sm font-medium text-gray-900 dark:text-white">
                  Description <span className="text-gray-500 dark:text-gray-500 font-normal">(Optional)</span>
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Hours, services, and contact information can be found here."
                  rows={3}
                  className="bg-white dark:bg-black border-gray-300 dark:border-gray-800 resize-none rounded-lg"
                />
              </div>

              {/* Source Type Tabs */}
              <div className="space-y-3 flex-shrink-0">
                <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800">
                  <button
                    onClick={() => setSourceType('web')}
                    className={cn(
                      'px-4 py-2 text-sm font-medium transition-colors border-b-2 rounded-t-lg',
                      sourceType === 'web'
                        ? 'border-gray-900 dark:border-white text-gray-900 dark:text-white'
                        : 'border-transparent text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    )}
                  >
                    Web
                  </button>
                  <button
                    onClick={() => setSourceType('document')}
                    className={cn(
                      'px-4 py-2 text-sm font-medium transition-colors border-b-2 rounded-t-lg',
                      sourceType === 'document'
                        ? 'border-gray-900 dark:border-white text-gray-900 dark:text-white'
                        : 'border-transparent text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    )}
                  >
                    Document
                  </button>
                </div>

                {/* Source Type Content */}
                <div className="pt-2">
                  {sourceType === 'web' ? (
                    <div className="space-y-2">
                      <Label htmlFor="url" className="text-sm font-medium text-gray-900 dark:text-white">
                        URL
                      </Label>
                      <Input
                        id="url"
                        type="url"
                        placeholder="https://example.com"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="bg-white dark:bg-black border-gray-300 dark:border-gray-800 rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="file" className="text-sm font-medium text-gray-900 dark:text-white">
                        Upload Document
                      </Label>
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 text-center hover:border-gray-400 dark:hover:border-gray-600 transition-colors cursor-pointer bg-white dark:bg-black">
                        <Input
                          id="file"
                          type="file"
                          className="hidden"
                          accept=".pdf,.doc,.docx,.txt"
                          onChange={handleFileSelect}
                        />
                        <label htmlFor="file" className="cursor-pointer">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            PDF, DOC, DOCX, TXT (max. 10MB)
                          </p>
                          {selectedFile && (
                            <p className="text-xs text-primary mt-2 font-medium">
                              Selected: {selectedFile.name}
                            </p>
                          )}
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Preview Section */}
              <div className="flex-1 flex flex-col min-h-0 space-y-2">
                <Label className="text-sm font-medium text-gray-900 dark:text-white">
                  Preview
                </Label>
                <div className="flex-1 border border-gray-300 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-950 overflow-hidden min-h-[200px]">
                  <div className="h-full overflow-y-auto px-4 py-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    {isParsing ? (
                      <div className="flex items-center justify-center h-full min-h-[150px]">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Parsing content...</p>
                      </div>
                    ) : previewText ? (
                      <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words font-sans leading-relaxed">
                        {previewText}
                      </pre>
                    ) : (
                      <div className="flex items-center justify-center h-full min-h-[150px]">
                        <p className="text-sm text-gray-400 dark:text-gray-500">
                          {sourceType === 'web' 
                            ? 'Enter a URL to preview content' 
                            : 'Upload a document to preview content'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer - Fixed at bottom */}
          <div className="px-[25px] py-4 border-t border-gray-200 dark:border-gray-900 bg-white dark:bg-black rounded-b-2xl flex-shrink-0">
            <Button
              onClick={handleSave}
              disabled={
                sourceType === 'web' 
                  ? !url || !isContentAccessible || isParsing
                  : !selectedFile || isParsing
              }
              className="w-full bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black font-medium disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

