'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Loader2 } from 'lucide-react'

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
  created_at: string
}

interface LogsTableProps {
  logs: LogEntry[]
  isLoading: boolean
  onLogClick: (log: LogEntry) => void
}

function getLevelColor(level: string): string {
  switch (level) {
    case 'ERROR':
    case 'CRITICAL':
      return 'bg-red-100 text-red-800'
    case 'WARNING':
      return 'bg-yellow-100 text-yellow-800'
    case 'INFO':
      return 'bg-blue-100 text-blue-800'
    case 'DEBUG':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

function getSourceColor(source: string): string {
  return source === 'frontend' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
}

export function LogsTable({ logs, isLoading, onLogClick }: LogsTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    )
  }

  if (logs.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No logs found
      </div>
    )
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Timestamp</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Level</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Endpoint</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id} className="cursor-pointer hover:bg-gray-50">
              <TableCell className="font-mono text-xs">
                {new Date(log.created_at).toLocaleString()}
              </TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getSourceColor(log.source)}`}>
                  {log.source}
                </span>
              </TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getLevelColor(log.level)}`}>
                  {log.level}
                </span>
              </TableCell>
              <TableCell className="text-sm">{log.category}</TableCell>
              <TableCell className="max-w-md truncate text-sm">{log.message}</TableCell>
              <TableCell className="font-mono text-xs">
                {log.method && log.endpoint ? `${log.method} ${log.endpoint}` : '-'}
              </TableCell>
              <TableCell>
                {log.status_code ? (
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    log.status_code >= 500 ? 'bg-red-100 text-red-800' :
                    log.status_code >= 400 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {log.status_code}
                  </span>
                ) : (
                  '-'
                )}
              </TableCell>
              <TableCell className="text-sm">
                {log.duration_ms ? `${log.duration_ms}ms` : '-'}
              </TableCell>
              <TableCell>
                <button
                  onClick={() => onLogClick(log)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
