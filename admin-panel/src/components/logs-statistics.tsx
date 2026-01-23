'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, AlertTriangle, Server, Monitor } from 'lucide-react'

interface Statistics {
  total_logs: number
  error_count: number
  warning_count: number
  frontend_logs: number
  backend_logs: number
  error_rate: number
}

export function LogsStatistics() {
  const [stats, setStats] = useState<Statistics | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadStatistics()
    const interval = setInterval(loadStatistics, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  async function loadStatistics() {
    try {
      const response = await fetch('/api/logs/statistics')
      if (!response.ok) throw new Error('Failed to fetch statistics')

      const data = await response.json()
      setStats(data.data)
    } catch (error) {
      const rawError = error instanceof Error ? error : new Error(String(error))
      console.error('[ADMIN] [LOGS_STATISTICS] Error loading statistics (RAW ERROR)', {
        error: rawError,
        errorMessage: rawError.message,
        errorStack: rawError.stack,
        errorName: rawError.name,
        errorCause: (rawError as any).cause,
        fullErrorObject: JSON.stringify(rawError, Object.getOwnPropertyNames(rawError), 2),
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="h-20 bg-gray-200 animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
          <Activity className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total_logs.toLocaleString()}</div>
          <p className="text-xs text-gray-500 mt-1">Last 24 hours</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Errors</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{stats.error_count.toLocaleString()}</div>
          <p className="text-xs text-gray-500 mt-1">
            {stats.error_rate.toFixed(2)}% error rate
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Frontend Logs</CardTitle>
          <Monitor className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">{stats.frontend_logs.toLocaleString()}</div>
          <p className="text-xs text-gray-500 mt-1">
            {stats.total_logs > 0 ? ((stats.frontend_logs / stats.total_logs) * 100).toFixed(1) : 0}% of total
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Backend Logs</CardTitle>
          <Server className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.backend_logs.toLocaleString()}</div>
          <p className="text-xs text-gray-500 mt-1">
            {stats.total_logs > 0 ? ((stats.backend_logs / stats.total_logs) * 100).toFixed(1) : 0}% of total
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
