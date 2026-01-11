import { useQuery } from '@tanstack/react-query'
import { apiClient, endpoints } from '@/lib/api'
import { useClientId } from '@/lib/clerk-auth-client'

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
  total_agents: number
  active_agents: number
  time_range: string
  start_date: string | null
  end_date: string
}

export function useDashboardStats(timeRange: string = 'last_month') {
  const clientId = useClientId()
  
  return useQuery({
    queryKey: ['dashboard', 'stats', clientId, timeRange],
    queryFn: async () => {
      const response = await apiClient.get<DashboardStats>(
        `${endpoints.dashboard.stats}?time_range=${timeRange}`
      )
      return response.data
    },
    enabled: !!clientId,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    gcTime: 1000 * 60 * 10, // Keep in cache for 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  })
}

