'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface Filters {
  source?: string
  level?: string
  category?: string
  client_id?: string
  request_id?: string
  endpoint?: string
  start_date?: string
  end_date?: string
  search?: string
}

interface LogsFiltersProps {
  onFilterChange: (filters: Filters) => void
}

export function LogsFilters({ onFilterChange }: LogsFiltersProps) {
  const [filters, setFilters] = useState<Filters>({})

  function handleChange(key: keyof Filters, value: string) {
    const newFilters = { ...filters, [key]: value || undefined }
    setFilters(newFilters)
  }

  function handleApply() {
    onFilterChange(filters)
  }

  function handleClear() {
    const emptyFilters: Filters = {}
    setFilters(emptyFilters)
    onFilterChange(emptyFilters)
  }

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Source</label>
          <select
            className="w-full px-3 py-2 border rounded-md"
            value={filters.source || ''}
            onChange={(e) => handleChange('source', e.target.value)}
          >
            <option value="">All</option>
            <option value="frontend">Frontend</option>
            <option value="backend">Backend</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Level</label>
          <select
            className="w-full px-3 py-2 border rounded-md"
            value={filters.level || ''}
            onChange={(e) => handleChange('level', e.target.value)}
          >
            <option value="">All</option>
            <option value="DEBUG">DEBUG</option>
            <option value="INFO">INFO</option>
            <option value="WARNING">WARNING</option>
            <option value="ERROR">ERROR</option>
            <option value="CRITICAL">CRITICAL</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <Input
            placeholder="e.g., api_request, error"
            value={filters.category || ''}
            onChange={(e) => handleChange('category', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Client ID</label>
          <Input
            placeholder="Filter by client ID"
            value={filters.client_id || ''}
            onChange={(e) => handleChange('client_id', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Request ID</label>
          <Input
            placeholder="Filter by request ID"
            value={filters.request_id || ''}
            onChange={(e) => handleChange('request_id', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Endpoint</label>
          <Input
            placeholder="Filter by endpoint"
            value={filters.endpoint || ''}
            onChange={(e) => handleChange('endpoint', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <Input
            type="datetime-local"
            value={filters.start_date || ''}
            onChange={(e) => handleChange('start_date', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">End Date</label>
          <Input
            type="datetime-local"
            value={filters.end_date || ''}
            onChange={(e) => handleChange('end_date', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Search Message</label>
          <Input
            placeholder="Search in message text"
            value={filters.search || ''}
            onChange={(e) => handleChange('search', e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleApply}>Apply Filters</Button>
        <Button variant="outline" onClick={handleClear}>Clear</Button>
      </div>
    </div>
  )
}
