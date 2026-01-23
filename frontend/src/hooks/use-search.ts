'use client'

import { useState, useEffect, useMemo } from 'react'

interface SearchResult {
  id: string
  title: string
  description: string
  type: 'agent' | 'campaign' | 'contact' | 'call' | 'analytics' | 'voice-clone'
  href: string
  metadata?: {
    status?: string
    date?: string
    count?: number
    color?: string
  }
}

interface UseSearchOptions {
  debounceMs?: number
  maxResults?: number
}

export function useSearch(searchTerm: string, options: UseSearchOptions = {}) {
  const { debounceMs = 150, maxResults = 50 } = options
  const [debouncedTerm, setDebouncedTerm] = useState(searchTerm)
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm)
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [searchTerm, debounceMs])

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('trudy-recent-searches')
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved))
      } catch (error) {
        const rawError = error instanceof Error ? error : new Error(String(error))
        console.error('[USE_SEARCH] Failed to parse recent searches (RAW ERROR)', {
          saved,
          error: rawError,
          errorMessage: rawError.message,
          errorStack: rawError.stack,
          errorName: rawError.name,
          fullErrorObject: JSON.stringify(rawError, Object.getOwnPropertyNames(rawError), 2),
        })
      }
    }
  }, [])

  // Save search term to recent searches
  const addToRecentSearches = (term: string) => {
    if (!term.trim()) return

    setRecentSearches(prev => {
      const updated = [term, ...prev.filter(t => t !== term)].slice(0, 10)
      localStorage.setItem('trudy-recent-searches', JSON.stringify(updated))
      return updated
    })
  }

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('trudy-recent-searches')
  }

  return {
    debouncedTerm,
    recentSearches,
    addToRecentSearches,
    clearRecentSearches
  }
}

// Search analytics for tracking
export function useSearchAnalytics() {
  const trackSearch = (query: string, resultCount: number) => {
    // In a real app, you'd send this to your analytics service
    console.log('Search tracked:', { query, resultCount, timestamp: new Date().toISOString() })
  }

  const trackSearchClick = (query: string, resultId: string, position: number) => {
    console.log('Search click tracked:', { query, resultId, position, timestamp: new Date().toISOString() })
  }

  return {
    trackSearch,
    trackSearchClick
  }
}
