'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X, Copy, Check } from 'lucide-react'

interface LogEntry {
  id: string
  source: 'frontend' | 'backend'
  level: 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL'
  category: string
  message: string
  request_id?: string
  client_id?: string
  user_id?: string
  endpoint?: string
  method?: string
  status_code?: number
  duration_ms?: number
  context?: Record<string, any>
  error_details?: Record<string, any>
  ip_address?: string
  user_agent?: string
  created_at: string
}

interface RelatedLog {
  id: string
  level: string
  category: string
  message: string
  created_at: string
}

interface LogDetailModalProps {
  log: LogEntry
  onClose: () => void
}

export function LogDetailModal({ log, onClose }: LogDetailModalProps) {
  const [relatedLogs, setRelatedLogs] = useState<RelatedLog[]>([])
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (log.request_id) {
      loadRelatedLogs()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [log.request_id])

  async function loadRelatedLogs() {
    try {
      const response = await fetch(`/api/logs/${log.id}`)
      if (!response.ok) throw new Error('Failed to fetch related logs')

      const data = await response.json()
      setRelatedLogs(data.data.related_logs || [])
    } catch (error) {
      const rawError = error instanceof Error ? error : new Error(String(error))
      console.error('[ADMIN] [LOG_DETAIL] Error loading related logs (RAW ERROR)', {
        error: rawError,
        errorMessage: rawError.message,
        errorStack: rawError.stack,
        errorName: rawError.name,
        errorCause: (rawError as any).cause,
        fullErrorObject: JSON.stringify(rawError, Object.getOwnPropertyNames(rawError), 2),
        logId: log.id,
      })
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(JSON.stringify(log, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Log Details</CardTitle>
            <CardDescription>
              {new Date(log.created_at).toLocaleString()}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Source</label>
              <div className="mt-1">{log.source}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Level</label>
              <div className="mt-1">{log.level}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Category</label>
              <div className="mt-1">{log.category}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Message</label>
              <div className="mt-1 font-mono text-sm">{log.message}</div>
            </div>
            {log.request_id && (
              <div>
                <label className="text-sm font-medium text-gray-500">Request ID</label>
                <div className="mt-1 font-mono text-xs">{log.request_id}</div>
              </div>
            )}
            {log.client_id && (
              <div>
                <label className="text-sm font-medium text-gray-500">Client ID</label>
                <div className="mt-1 font-mono text-xs">{log.client_id}</div>
              </div>
            )}
            {log.user_id && (
              <div>
                <label className="text-sm font-medium text-gray-500">User ID</label>
                <div className="mt-1 font-mono text-xs">{log.user_id}</div>
              </div>
            )}
            {log.endpoint && (
              <div>
                <label className="text-sm font-medium text-gray-500">Endpoint</label>
                <div className="mt-1 font-mono text-sm">{log.method} {log.endpoint}</div>
              </div>
            )}
            {log.status_code && (
              <div>
                <label className="text-sm font-medium text-gray-500">Status Code</label>
                <div className="mt-1">{log.status_code}</div>
              </div>
            )}
            {log.duration_ms && (
              <div>
                <label className="text-sm font-medium text-gray-500">Duration</label>
                <div className="mt-1">{log.duration_ms}ms</div>
              </div>
            )}
            {log.ip_address && (
              <div>
                <label className="text-sm font-medium text-gray-500">IP Address</label>
                <div className="mt-1 font-mono text-sm">{log.ip_address}</div>
              </div>
            )}
          </div>

          {log.context && Object.keys(log.context).length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-500">Context</label>
              <pre className="mt-1 p-3 bg-gray-50 rounded text-xs overflow-x-auto">
                {JSON.stringify(log.context, null, 2)}
              </pre>
            </div>
          )}

          {log.error_details && Object.keys(log.error_details).length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-500">Error Details</label>
              <pre className="mt-1 p-3 bg-red-50 rounded text-xs overflow-x-auto">
                {JSON.stringify(log.error_details, null, 2)}
              </pre>
            </div>
          )}

          {log.user_agent && (
            <div>
              <label className="text-sm font-medium text-gray-500">User Agent</label>
              <div className="mt-1 font-mono text-xs break-all">{log.user_agent}</div>
            </div>
          )}

          {relatedLogs.length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-500">Related Logs ({relatedLogs.length})</label>
              <div className="mt-2 space-y-2">
                {relatedLogs.map((relatedLog) => (
                  <div key={relatedLog.id} className="p-2 bg-gray-50 rounded text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{relatedLog.level}</span>
                      <span className="text-gray-500">
                        {new Date(relatedLog.created_at).toLocaleString()}
                      </span>
                    </div>
                    <div className="mt-1 text-gray-700">{relatedLog.message}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
