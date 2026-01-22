'use client'

import { useState, useCallback } from 'react'
import { AppLayout } from '@/components/layout/app-layout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { AddCustomVoiceModal } from '@/components/voice/add-custom-voice-modal'
import { AgentIcon } from '@/components/agent-icon'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Search, 
  MoreVertical, 
  Mic, 
  Play, 
  ChevronDown,
  ArrowUpDown,
  Filter,
  X,
  Plus,
  Users,
  Info,
  Sparkles,
  Wand2,
  Lock,
  Shuffle,
  Trash2,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { useExploreVoices, useMyVoices, useDeleteVoice, useCreateVoice } from '@/hooks/use-voices'
import { useToast } from '@/hooks/use-toast'
import { Voice } from '@/types'
import { useAuthClient } from '@/lib/clerk-auth-client'
import { apiClient, endpoints } from '@/lib/api'
import { logger } from '@/lib/logger'


// Community voices library - empty until backend endpoint is implemented
const mockVoices: any[] = []

import { VoiceListItemSkeleton } from '@/components/ui/list-skeleton'

export default function VoiceCloningPage() {
  const { toast } = useToast()
  const { isLoading: authLoading, clientId } = useAuthClient() // Initialize auth
  const { data: exploreVoices, isLoading: exploreLoading, error: exploreError, isFetching: exploreFetching, isFetched: exploreFetched } = useExploreVoices()
  const { data: myVoices, isLoading: myVoicesLoading, error: myVoicesError, isFetching: myVoicesFetching, isFetched: myVoicesFetched } = useMyVoices()
  const deleteVoiceMutation = useDeleteVoice()
  const createVoiceMutation = useCreateVoice()
  const [activeTab, setActiveTab] = useState('explore')
  const [searchQuery, setSearchQuery] = useState('')
  const [createVoiceDialogOpen, setCreateVoiceDialogOpen] = useState(false)
  const [filtersDialogOpen, setFiltersDialogOpen] = useState(false)
  const [deletingVoiceId, setDeletingVoiceId] = useState<string | null>(null)
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null)
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)
  
  // Ensure we have safe defaults
  const safeExploreVoices = exploreVoices || []
  const safeMyVoices = myVoices || []
  
  // Consolidated filter state
  const [filters, setFilters] = useState({
    language: '',
    accent: '',
    categories: [] as string[],
    quality: 'Any',
    gender: 'Any',
    age: 'Any',
    noticePeriod: 'Any',
    customRates: 'Include',
    liveModerationEnabled: 'Include',
  })
  
  // Calculate filter count directly
  const filterCount = Object.values(filters).filter(v => 
    v && v !== 'Any' && v !== 'Include' && (Array.isArray(v) ? v.length > 0 : true)
  ).length


  // Simple filter logic - no memoization needed
  const filteredVoices = safeExploreVoices.filter(voice => {
    if (searchQuery && !voice.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !voice.description?.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !voice.provider.toLowerCase().includes(searchQuery.toLowerCase())) return false
    if (filters.language && voice.language && !voice.language.toLowerCase().includes(filters.language.toLowerCase())) return false
    if (filters.accent && !voice.description?.toLowerCase().includes(filters.accent.toLowerCase()) && 
        !voice.name.toLowerCase().includes(filters.accent.toLowerCase())) return false
    if (filters.categories.length > 0) {
      const voiceText = `${voice.name} ${voice.description || ''}`.toLowerCase()
      if (!filters.categories.some(cat => voiceText.includes(cat.toLowerCase()))) return false
    }
    if (filters.gender !== 'Any') {
      const voiceText = `${voice.name} ${voice.description || ''}`.toLowerCase()
      if (filters.gender === 'Male' && (!voiceText.includes('male') || voiceText.includes('female'))) return false
      if (filters.gender === 'Female' && !voiceText.includes('female')) return false
      if (filters.gender === 'Neutral' && (voiceText.includes('male') || voiceText.includes('female'))) return false
    }
    if (filters.age !== 'Any') {
      const voiceText = `${voice.name} ${voice.description || ''}`.toLowerCase()
      if (filters.age === 'Young' && !voiceText.match(/young|child|teen/)) return false
      if (filters.age === 'Middle Aged' && !voiceText.match(/middle|adult/)) return false
      if (filters.age === 'Old' && !voiceText.match(/old|senior|elderly/)) return false
    }
    return true
  })

  const filteredMyVoices = safeMyVoices.filter(voice => {
    if (searchQuery && !voice.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !voice.provider.toLowerCase().includes(searchQuery.toLowerCase())) return false
    if (filters.language && voice.language && !voice.language.toLowerCase().includes(filters.language.toLowerCase())) return false
    return true
  })
  
  // Simple loading and empty state logic
  const isLoading = authLoading || exploreLoading || myVoicesLoading
  const showEmpty = activeTab === 'explore' 
    ? (exploreFetched && !exploreLoading && !exploreError && safeExploreVoices.length === 0)
    : (myVoicesFetched && !myVoicesLoading && !myVoicesError && safeMyVoices.length === 0)

  // Handle delete voice
  const handleDeleteVoice = useCallback(async (voiceId: string, voiceName: string) => {
    if (!confirm(`Are you sure you want to delete "${voiceName}"? This action cannot be undone.`)) {
      return
    }
    
    logger.logUserAction('voice_delete_clicked', { voiceId, voiceName })
    setDeletingVoiceId(voiceId)
    try {
      await deleteVoiceMutation.mutateAsync(voiceId)
      toast({
        title: 'Voice deleted',
        description: `"${voiceName}" has been deleted successfully.`,
      })
    } catch (error) {
      toast({
        title: 'Error deleting voice',
        description: error instanceof Error ? error.message : 'Failed to delete voice. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setDeletingVoiceId(null)
    }
  }, [deleteVoiceMutation, toast])

  // Handle play voice preview
  const handlePlayVoice = useCallback(async (voice: Voice) => {
    logger.logUserAction('voice_play_clicked', { voiceId: voice.id, voiceName: voice.name })
    
    // Stop any currently playing audio
    if (audioElement) {
      audioElement.pause()
      audioElement.currentTime = 0
      setAudioElement(null)
    }

    // If clicking the same voice, just stop it
    if (playingVoiceId === voice.id) {
      setPlayingVoiceId(null)
      return
    }

    // Check if voice is active (only for custom voices - Ultravox voices don't have status)
    // For custom voices, check status; for Ultravox voices (no status field), allow preview
    if (voice.status && voice.status !== 'active') {
      toast({
        title: 'Voice not ready',
        description: 'Voice must be active to preview. Please wait for training to complete.',
        variant: 'destructive',
      })
      return
    }

    setPlayingVoiceId(voice.id)
    
    try {
      console.log('Playing voice:', {
        voiceId: voice.id,
        voiceName: voice.name,
        provider: voice.provider,
        ultravoxVoiceId: voice.ultravox_voice_id,
        status: voice.status
      })
      
      // Fetch audio from backend (using Ultravox preview endpoint - no text parameter needed)
      const previewUrl = endpoints.voices.preview(voice.id)
      console.log('Fetching audio from:', previewUrl)
      
      const audioBlob = await apiClient.getAudioBlob(previewUrl)
      
      if (!audioBlob || audioBlob.size === 0) {
        throw new Error('Received empty audio response from server')
      }
      
      console.log('Audio blob received:', { size: audioBlob.size, type: audioBlob.type })
      
      // Create audio element and play
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)
      
      audio.onended = () => {
        console.log('Audio playback ended')
        setPlayingVoiceId(null)
        setAudioElement(null)
        URL.revokeObjectURL(audioUrl)
      }
      
      audio.onerror = (e) => {
        console.error('Audio playback error:', e)
        setPlayingVoiceId(null)
        setAudioElement(null)
        URL.revokeObjectURL(audioUrl)
        toast({
          title: 'Playback error',
          description: 'Failed to play voice preview. The audio file may be corrupted.',
          variant: 'destructive',
        })
      }
      
      audio.onloadstart = () => console.log('Audio loading started')
      audio.oncanplay = () => console.log('Audio can play')
      audio.oncanplaythrough = () => console.log('Audio can play through')
      
      setAudioElement(audio)
      
      try {
        await audio.play()
        console.log('Audio playback started successfully')
      } catch (playError) {
        console.error('Error playing audio:', playError)
        throw new Error('Failed to start audio playback. Please check your browser audio settings.')
      }
    } catch (error) {
      console.error('Error in handlePlayVoice:', error)
      setPlayingVoiceId(null)
      
      let errorMessage = 'Failed to generate voice preview.'
      let errorTitle = 'Preview failed'
      
      if (error instanceof Error) {
        errorMessage = error.message
        console.error('Error details:', errorMessage)
        
        // Check for specific error types
        if (errorMessage.includes('Ultravox API key') || errorMessage.includes('not configured')) {
          errorTitle = 'Ultravox Configuration Error'
          errorMessage = 'Ultravox API key is not configured. Please contact support.'
        } else if (errorMessage.includes('404') || errorMessage.includes('not found')) {
          errorTitle = 'Voice Not Found'
          errorMessage = 'The voice was not found. Please verify the voice ID is correct.'
        } else if (errorMessage.includes('Failed to fetch') || errorMessage.includes('Network')) {
          errorTitle = 'Network Error'
          errorMessage = 'Failed to connect to the server. Please check your internet connection and try again.'
        }
      }
      
      toast({
        title: errorTitle,
        description: errorMessage,
        variant: 'destructive',
        duration: 8000,
      })
    }
  }, [playingVoiceId, audioElement, toast])

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      case 'training':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'failed':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
    }
  }

  // Convert string ID to number for AgentIcon component
  const getNumericId = (id: string): number => {
    let hash = 0
    for (let i = 0; i < id.length; i++) {
      const char = id.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash)
  }

  // Reset all filters
  const resetAllFilters = useCallback(() => {
    setFilters({
      language: '',
      accent: '',
      categories: [],
      quality: 'Any',
      gender: 'Any',
      age: 'Any',
      noticePeriod: 'Any',
      customRates: 'Include',
      liveModerationEnabled: 'Include',
    })
  }, [])

  const handleAddVoice = async (voiceData: { name: string; source: 'voice-clone' | 'community-voices'; provider?: string }) => {
    try {
      logger.logUserAction('voice_added', { voiceName: voiceData.name, source: voiceData.source, provider: voiceData.provider })
      
      // Voice clone and community voices are now both handled inside the modal
      // This callback is just for closing and refreshing
      
      // Close modal first
      setCreateVoiceDialogOpen(false)
      
      // Switch to My Voices tab to show the newly added voice
      setActiveTab('my-voices')
      // Clear search to show all voices
      setSearchQuery('')
      
      // Mutation's onSuccess already invalidates queries
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      })
    }
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Top Navigation and Actions */}
        <div className="flex items-center justify-between">
          {/* Tabs */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => {
                logger.logUserAction('voice_tab_changed', { tab: 'explore' })
                setActiveTab('explore')
              }}
              className={`flex items-center gap-2 text-sm font-medium pb-1 border-b-2 transition-all duration-200 ${
                activeTab === 'explore'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-primary hover:border-primary/40'
              }`}
            >
              <Mic className="h-4 w-4" />
              Explore
            </button>
            <button
              onClick={() => {
                logger.logUserAction('voice_tab_changed', { tab: 'my-voices' })
                setActiveTab('my-voices')
              }}
              className={`flex items-center gap-2 text-sm font-medium pb-1 border-b-2 transition-all duration-200 ${
                activeTab === 'my-voices'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-primary hover:border-primary/40'
              }`}
            >
              My Voices
              {!isLoading && safeMyVoices.length > 0 && (
                <span className="ml-1 text-xs bg-gray-200 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                  {safeMyVoices.length}
                </span>
              )}
              {activeTab === 'my-voices' && myVoicesFetching && !isLoading && (
                <Loader2 className="h-3 w-3 animate-spin text-gray-400 ml-1" />
              )}
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1 max-w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
          <Input
              placeholder={
                activeTab === 'my-voices' 
                  ? 'Search My Voices...' 
                  : 'Search library voices...'
              }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 focus:ring-2 focus:ring-primary focus:border-primary"
            disabled={isLoading}
          />
          {((activeTab === 'explore' && exploreFetching && !exploreLoading && filteredVoices.length > 0) || 
            (activeTab === 'my-voices' && myVoicesFetching && !myVoicesLoading && filteredMyVoices.length > 0)) && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
            </div>
          )}
        </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {activeTab === 'explore' && (
              <>
                <Button variant="ghost" className="gap-2 hidden md:flex">
                  <ArrowUpDown className="h-4 w-4" />
                  <span className="hidden lg:inline">Trending</span>
                </Button>
              </>
            )}
            {activeTab === 'my-voices' && (
              <Button variant="ghost" className="gap-2 hidden sm:flex">
                <ArrowUpDown className="h-4 w-4" />
                <span className="hidden lg:inline">Latest</span>
              </Button>
            )}
            {activeTab === 'explore' && (
              <Button 
                variant="ghost" 
                className="gap-2 flex-shrink-0"
                onClick={() => setFiltersDialogOpen(true)}
              >
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
                {activeTab === 'explore' && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {filterCount}
                  </Badge>
                )}
              </Button>
            )}
            <Button 
              onClick={() => {
                logger.logUserAction('voice_create_dialog_opened')
                setCreateVoiceDialogOpen(true)
              }}
              size="sm"
              className="bg-primary hover:bg-primary/90 text-white gap-2 flex-shrink-0"
              disabled={isLoading}
            >
              <Plus className="h-4 w-4" />
              Add Voice
            </Button>
          </div>
        </div>

        {/* Explore Tab Content */}
        {activeTab === 'explore' && (
          <>
            {/* Active Filters */}
            {filterCount > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                {/* Language Chip */}
                {filters.language && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 dark:bg-primary/20 text-primary rounded-full text-xs font-medium">
                    <span>Language: {filters.language.toUpperCase()}</span>
                    <button onClick={() => setFilters({...filters, language: ''})} className="hover:bg-primary/20 rounded-full p-0.5">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                {filters.accent && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 dark:bg-primary/20 text-primary rounded-full text-xs font-medium">
                    <span>Accent: {filters.accent}</span>
                    <button onClick={() => setFilters({...filters, accent: ''})} className="hover:bg-primary/20 rounded-full p-0.5">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                {filters.gender !== 'Any' && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 dark:bg-primary/20 text-primary rounded-full text-xs font-medium">
                    <span>Gender: {filters.gender}</span>
                    <button onClick={() => setFilters({...filters, gender: 'Any'})} className="hover:bg-primary/20 rounded-full p-0.5">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                {filters.age !== 'Any' && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 dark:bg-primary/20 text-primary rounded-full text-xs font-medium">
                    <span>Age: {filters.age}</span>
                    <button onClick={() => setFilters({...filters, age: 'Any'})} className="hover:bg-primary/20 rounded-full p-0.5">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                {filters.categories.map((category) => (
                  <div key={category} className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 dark:bg-primary/20 text-primary rounded-full text-xs font-medium">
                    <span>{category}</span>
                    <button
                      onClick={() => setFilters({...filters, categories: filters.categories.filter(c => c !== category)})}
                      className="hover:bg-primary/20 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}

                {/* Reset Button */}
                <button 
                  className="text-xs text-primary hover:text-primary/80 underline font-medium ml-1"
                  onClick={resetAllFilters}
                >
                  Reset all
                </button>
              </div>
            )}

            {/* Results Header */}
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Results</h2>
              {exploreFetching && !exploreLoading && filteredVoices.length > 0 && (
                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
              )}
            </div>

            {/* Error Message */}
            {exploreError && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-lg flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800 dark:text-red-300">Error loading voices</p>
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {exploreError instanceof Error ? exploreError.message : 'Failed to load voices'}
                  </p>
                  <p className="text-xs text-red-500 dark:text-red-500 mt-1">
                    {!clientId && 'Client ID not available. Please ensure you are signed in.'}
                    {clientId && 'Check backend connection and authentication.'}
                  </p>
                </div>
              </div>
            )}

            {/* Voices List */}
            {(activeTab === 'explore' && (exploreLoading || !exploreFetched)) ? (
              <>
                {[...Array(8)].map((_, i) => (
                  <VoiceListItemSkeleton key={`explore-skeleton-${i}`} />
                ))}
              </>
            ) : (activeTab === 'explore' && showEmpty) ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="mb-4 flex justify-center">
                  <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                    <Mic className="h-8 w-8 text-gray-400 dark:text-gray-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No voices found
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center max-w-md">
                  {searchQuery 
                    ? 'Try adjusting your search terms to find what you\'re looking for.'
                    : 'No voices are available right now. Please try again later.'
                  }
                </p>
              </div>
            ) : (
            <div className="space-y-3">
              {filteredVoices.map((voice) => (
                <div
                  key={voice.id}
                  className="flex items-center gap-4 p-4 bg-white dark:bg-black border border-gray-200 dark:border-gray-900 rounded-lg hover:bg-primary/5 hover:border-primary/40 transition-all"
                >
                  {/* Avatar */}
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white text-sm">
                      {voice.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  {/* Voice Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {voice.name}
                    </h3>
                    {voice.description && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate mt-1">
                        {voice.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {voice.provider}
                      </Badge>
                      <span>{voice.language}</span>
                      <span>•</span>
                      <span>{voice.type === 'custom' ? 'Custom' : 'Reference'}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button 
                      onClick={() => handlePlayVoice(voice)}
                      disabled={playingVoiceId === voice.id && audioElement !== null}
                      className="h-8 w-8 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {playingVoiceId === voice.id ? (
                        <Loader2 className="h-4 w-4 text-gray-700 dark:text-gray-300 animate-spin" />
                      ) : (
                        <Play className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                      )}
                    </button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-900">
                          <MoreVertical className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white dark:bg-black border-gray-200 dark:border-gray-900">
                        <DropdownMenuItem className="text-gray-700 dark:text-gray-300 hover:bg-primary/5">Add to Agent</DropdownMenuItem>
                        <DropdownMenuItem className="text-gray-700 dark:text-gray-300 hover:bg-primary/5">View Details</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
            )}
          </>
        )}

        {/* My Voices Tab Content */}
        {activeTab === 'my-voices' && (
          <>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">My Voices</h2>
              {myVoicesFetching && !myVoicesLoading && filteredMyVoices.length > 0 && (
                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
              )}
            </div>
            
            {/* Error Message */}
            {(exploreError || myVoicesError) && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-lg flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800 dark:text-red-300">Error loading voices</p>
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {activeTab === 'explore' && exploreError instanceof Error ? exploreError.message : 
                     activeTab === 'my-voices' && myVoicesError instanceof Error ? myVoicesError.message : 
                     'Failed to load voices'}
                  </p>
                  <p className="text-xs text-red-500 dark:text-red-500 mt-1">
                    {!clientId && 'Client ID not available. Please ensure you are signed in.'}
                    {clientId && 'Check backend connection and authentication.'}
                  </p>
                </div>
              </div>
            )}

            {(activeTab === 'my-voices' && (myVoicesLoading || !myVoicesFetched)) ? (
              <>
                {[...Array(5)].map((_, i) => (
                  <VoiceListItemSkeleton key={`skeleton-${i}`} />
                ))}
              </>
            ) : !clientId ? (
              <div className="flex flex-col items-center justify-center py-20">
                <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Authentication required
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">
                  Please sign in to view your voices.
                </p>
              </div>
            ) : (activeTab === 'my-voices' && showEmpty) ? (
              /* Empty State */
              <div className="flex flex-col items-center justify-center py-20">
                <div className="mb-4 flex justify-center">
                  <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                    <Mic className="h-8 w-8 text-gray-400 dark:text-gray-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {searchQuery ? 'No voices found' : 'No voices added yet'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center max-w-md">
                  {searchQuery 
                    ? 'Try adjusting your search terms to find what you\'re looking for.'
                    : 'No voices are added right now. Please create or add a voice to get started.'
                  }
                </p>
                {!searchQuery && (
                  <Button 
                    onClick={() => setCreateVoiceDialogOpen(true)}
                    className="bg-primary hover:bg-primary/90 text-white gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Create your first voice
                  </Button>
                )}
              </div>
            ) : (
              /* Voices List */
              <div className="space-y-3">
                {filteredMyVoices.map((voice) => {
                  const createdDate = voice.created_at 
                    ? new Date(voice.created_at).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric'
                      })
                    : 'Unknown'
                  
                  return (
                  <div
                    key={voice.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white dark:bg-black border border-gray-200 dark:border-gray-900 rounded-lg hover:bg-primary/5 hover:border-primary/40 transition-all"
                  >
                    {/* Top Row - Mobile */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {/* Voice Icon - using AgentIcon with unique gradient */}
                      <AgentIcon agentId={getNumericId(voice.id)} size={40} />

                      {/* Voice Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {voice.name}
                        </h3>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(voice.status)}`}>
                            {voice.status === 'training' && (
                              <span className="mr-1 h-1 w-1 animate-pulse rounded-full bg-current" />
                            )}
                            {voice.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                          {voice.type === 'custom' ? 'Custom voice' : 'Reference voice'} • {voice.provider}
                        </p>
                        {/* Mobile: Show language and status inline */}
                        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mt-1 sm:hidden">
                          <span>{voice.language}</span>
                          <span>•</span>
                          <span>{createdDate}</span>
                        </div>
                      </div>

                      {/* Actions - Mobile */}
                      <div className="flex items-center gap-1 sm:hidden flex-shrink-0">
                        <button 
                          onClick={() => handlePlayVoice(voice)}
                          disabled={playingVoiceId === voice.id && audioElement !== null}
                          className="h-8 w-8 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {playingVoiceId === voice.id ? (
                            <Loader2 className="h-4 w-4 text-gray-700 dark:text-gray-300 animate-spin" />
                          ) : (
                            <Play className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                          )}
                        </button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-900">
                              <MoreVertical className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-white dark:bg-black border-gray-200 dark:border-gray-900">
                            <DropdownMenuItem className="text-gray-700 dark:text-gray-300 hover:bg-primary/5">Add to Agent</DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950"
                              onClick={() => handleDeleteVoice(voice.id, voice.name)}
                              disabled={deletingVoiceId === voice.id}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              {deletingVoiceId === voice.id ? 'Deleting...' : 'Delete'}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {/* Desktop/Tablet Additional Info */}
                    <div className="hidden sm:flex items-center gap-4 flex-shrink-0">
                      {/* Status */}
                      <div className="min-w-[100px]">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(voice.status)}`}>
                          {voice.status === 'training' && (
                            <span className="mr-1.5 h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
                          )}
                          {voice.status}
                        </span>
                      </div>

                      {/* Language */}
                      <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 min-w-[140px]">
                        <div>
                          <div className="font-medium">{voice.language}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-500">{voice.type === 'custom' ? 'Custom' : 'Reference'}</div>
                        </div>
                      </div>

                      {/* Provider */}
                      <div className="hidden lg:block text-sm text-gray-700 dark:text-gray-300 min-w-[120px]">
                        {voice.provider}
                      </div>

                      {/* Created Date */}
                      <div className="hidden lg:block text-sm text-gray-600 dark:text-gray-400 min-w-[120px]">
                        {createdDate}
                      </div>

                      {/* Training Progress (if training) */}
                      {voice.status === 'training' && voice.training_info?.progress !== undefined && (
                        <div className="text-sm text-gray-600 dark:text-gray-400 min-w-[80px]">
                          {voice.training_info.progress}%
                      </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handlePlayVoice(voice)}
                          disabled={playingVoiceId === voice.id && audioElement !== null}
                          className="h-8 w-8 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {playingVoiceId === voice.id ? (
                            <Loader2 className="h-4 w-4 text-gray-700 dark:text-gray-300 animate-spin" />
                          ) : (
                            <Play className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                          )}
                        </button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-900">
                              <MoreVertical className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-white dark:bg-black border-gray-200 dark:border-gray-900">
                            <DropdownMenuItem className="text-gray-700 dark:text-gray-300 hover:bg-primary/5">Add to Agent</DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-gray-200 dark:border-gray-900" />
                            <DropdownMenuItem 
                              className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950"
                              onClick={() => handleDeleteVoice(voice.id, voice.name)}
                              disabled={deletingVoiceId === voice.id}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              {deletingVoiceId === voice.id ? 'Deleting...' : 'Delete'}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                  )
                })}
              </div>
            )}
          </>
        )}


        {/* Add Custom Voice Modal */}
        <AddCustomVoiceModal
          isOpen={createVoiceDialogOpen}
          onClose={() => {
            setCreateVoiceDialogOpen(false)
            // Mutation's onSuccess already invalidates queries
          }}
          onSave={handleAddVoice}
        />


        {/* Voice Filters Dialog */}
        <Dialog open={filtersDialogOpen} onOpenChange={setFiltersDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-black border-gray-200 dark:border-gray-900">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-white">
                <Filter className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                Voice Filters
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Languages and Accent */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900 dark:text-white">Languages</label>
                  <Select value={filters.language} onValueChange={(v) => setFilters({...filters, language: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose languages" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="it">Italian</SelectItem>
                      <SelectItem value="pt">Portuguese</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900 dark:text-white">Accent</label>
                  <Select value={filters.accent} onValueChange={(v) => setFilters({...filters, accent: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose accent" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="american">American</SelectItem>
                      <SelectItem value="british">British</SelectItem>
                      <SelectItem value="australian">Australian</SelectItem>
                      <SelectItem value="canadian">Canadian</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Category */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-900 dark:text-white">Category</label>
                <div className="flex flex-wrap gap-2">
                  {['Narrative & Story', 'Conversational', 'Characters & Animation', 'Social Media', 'Entertainment & TV', 'Advertisement', 'Informative & Educational'].map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        if (filters.categories.includes(category)) {
                          setFilters({...filters, categories: filters.categories.filter(c => c !== category)})
                        } else {
                          setFilters({...filters, categories: [...filters.categories, category]})
                        }
                      }}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        filters.categories.includes(category)
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white hover:bg-primary/10'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-900 dark:text-white">Quality</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setFilters({...filters, quality: 'Any'})}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filters.quality === 'Any'
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white hover:bg-primary/10'
                    }`}
                  >
                    Any
                  </button>
                  <button
                    onClick={() => setFilters({...filters, quality: 'High-Quality'})}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filters.quality === 'High-Quality'
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white hover:bg-primary/10'
                    }`}
                  >
                    High-Quality
                  </button>
                </div>
              </div>

              {/* Gender */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-900 dark:text-white">Gender</label>
                <div className="grid grid-cols-4 gap-3">
                  {['Any', 'Male', 'Female', 'Neutral'].map((gender) => (
                    <button
                      key={gender}
                      onClick={() => setFilters({...filters, gender})}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filters.gender === gender
                          ? 'bg-gray-900 dark:bg-white text-white dark:text-black'
                          : 'bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800'
                      }`}
                    >
                      {gender === 'Male' && '♂ '}
                      {gender === 'Female' && '♀ '}
                      {gender}
                    </button>
                  ))}
                </div>
              </div>

              {/* Age */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-900 dark:text-white">Age</label>
                <div className="grid grid-cols-4 gap-3">
                  {['Any', 'Young', 'Middle Aged', 'Old'].map((age) => (
                    <button
                      key={age}
                      onClick={() => setFilters({...filters, age})}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filters.age === age
                          ? 'bg-gray-900 dark:bg-white text-white dark:text-black'
                          : 'bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800'
                      }`}
                    >
                      {age}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notice period */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-900 dark:text-white">Notice period</label>
                <div className="grid grid-cols-6 gap-2">
                  {['Any', '30 days', '90 days', '180 days', '1 year', '2 years'].map((period) => (
                    <button
                      key={period}
                      onClick={() => setSelectedNoticePeriod(period)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filters.noticePeriod === period
                          ? 'bg-gray-900 dark:bg-white text-white dark:text-black'
                          : 'bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800'
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom rates */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-900 dark:text-white">Custom rates</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setFilters({...filters, customRates: 'Include'})}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filters.customRates === 'Include'
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white hover:bg-primary/10'
                    }`}
                  >
                    Include
                  </button>
                  <button
                    onClick={() => setFilters({...filters, customRates: 'Exclude'})}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filters.customRates === 'Exclude'
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white hover:bg-primary/10'
                    }`}
                  >
                    Exclude
                  </button>
                </div>
              </div>

              {/* Live moderation enabled */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-900 dark:text-white">Live moderation enabled</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setFilters({...filters, liveModerationEnabled: 'Include'})}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filters.liveModerationEnabled === 'Include'
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white hover:bg-primary/10'
                    }`}
                  >
                    Include
                  </button>
                  <button
                    onClick={() => setFilters({...filters, liveModerationEnabled: 'Exclude'})}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filters.liveModerationEnabled === 'Exclude'
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white hover:bg-primary/10'
                    }`}
                  >
                    Exclude
                  </button>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-900">
              <Button 
                variant="outline"
                onClick={() => {
                  resetAllFilters()
                }}
              >
                Reset all
              </Button>
                <Button 
                className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/30"
                onClick={() => {
                  setFiltersDialogOpen(false)
                }}
              >
                Apply filters
                </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  )
}

