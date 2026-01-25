import { useQuery } from '@tanstack/react-query'
import { apiClient, endpoints } from '@/lib/api'
import { authManager } from '@/lib/auth-manager'
import { useClientId, useAuthReady } from '@/lib/clerk-auth-client'

export interface DashboardStats {
  total_calls: number
  successful_calls: number
  failed_calls: number
  in_progress_calls: number
  average_call_duration_seconds: number
  total_call_cost_usd: number
  average_call_cost_usd: number
  total_campaigns: number
  active_campaigns: number
  completed_campaigns: number
  time_range: string
  start_date: string | null
  end_date: string
}

export function useDashboardStats(timeRange: string = 'last_month') {
  const clientId = useClientId()
  const isAuthReady = useAuthReady()
  
  return useQuery({
    queryKey: ['dashboard', 'stats', clientId, timeRange],
    queryFn: async () => {
      // Wait for auth before fetching
      if (!authManager.hasToken()) {
        await authManager.waitForAuth(5000)
        if (!authManager.hasToken()) {
          throw new Error('Not authenticated')
        }
      }
      
      const response = await apiClient.get<DashboardStats>(
        `${endpoints.dashboard.stats}?time_range=${timeRange}`
      )
      return response.data
    },
    enabled: isAuthReady && authManager.hasToken(),
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    gcTime: 1000 * 60 * 10, // Keep in cache for 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: (failureCount, error) => {
      if (error instanceof Error && 
          (error.message.includes('Session expired') || 
           error.message.includes('Not authenticated') ||
           error.message.includes('401'))) {
        return false
      }
      return failureCount < 2
    },
  })
}
