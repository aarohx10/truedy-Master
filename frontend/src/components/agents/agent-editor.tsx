'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AppLayout } from '@/components/layout/app-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { useAgent, useUpdateAgent, usePartialUpdateAgent } from '@/hooks/use-agents'
import { useToast } from '@/hooks/use-toast'
import { useDebounce } from '@/hooks/use-debounce'
import { 
  Agent, 
  CreateAgentData, 
  UpdateAgentData,
  GreetingSettings,
  InactivityMessage,
  VADSettings,
  MessageMedium,
} from '@/types'
import { VoiceSelector } from '@/components/agents/selectors/voice-selector'
import { ToolsSelector } from '@/components/agents/selectors/tools-selector'
import { RAGSelector } from '@/components/agents/selectors/rag-selector'
import { PromptTab } from '@/components/agents/agent-form-sections/prompt-tab'
import { GreetingTab } from '@/components/agents/agent-form-sections/greeting-tab'
import { InactivityMessagesTab } from '@/components/agents/agent-form-sections/inactivity-messages-tab'
import { SettingsTab } from '@/components/agents/agent-form-sections/settings-tab'
import { PhoneNumbersTab } from '@/components/agents/agent-form-sections/phone-numbers-tab'
import { AIAssistancePanel } from '@/components/agents/ai-assistance-panel'
import { TestAgentPanel } from '@/components/agents/test-agent-panel'
import { Sparkles, Save, Loader2, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface AgentEditorProps {
  agentId: string
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

export function AgentEditor({ agentId }: AgentEditorProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  // Hooks
  const { data: agent, isLoading, error } = useAgent(agentId)
  const partialUpdateMutation = usePartialUpdateAgent()
  const updateMutation = useUpdateAgent()
  const showTest = searchParams.get('test') === 'true'
  
  // Form state
  const [name, setName] = useState('')
  const [systemPrompt, setSystemPrompt] = useState('')
  const [voiceId, setVoiceId] = useState('')
  const [tools, setTools] = useState<string[]>([])
  const [knowledgeBases, setKnowledgeBases] = useState<string[]>([])
  const [greetingSettings, setGreetingSettings] = useState<GreetingSettings>({
    first_speaker: 'agent',
  })
  const [inactivityMessages, setInactivityMessages] = useState<InactivityMessage[]>([])
  const [recordingEnabled, setRecordingEnabled] = useState(false)
  const [model, setModel] = useState('ultravox-v0.6')
  const [initialOutputMedium, setInitialOutputMedium] = useState<MessageMedium>('MESSAGE_MEDIUM_VOICE')
  const [joinTimeout, setJoinTimeout] = useState('')
  const [maxDuration, setMaxDuration] = useState('')
  const [timeExceededMessage, setTimeExceededMessage] = useState('')
  const [temperature, setTemperature] = useState(0.7)
  const [languageHint, setLanguageHint] = useState('en-US')
  const [vadSettings, setVadSettings] = useState<VADSettings>({})
  
  // UI state
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  
  // Track if form has been initialized from agent data
  const isInitializedRef = useRef(false)
  const initializationCompleteRef = useRef(false)
  const agentIdRef = useRef<string | null>(null)
  const previousFormDataRef = useRef<UpdateAgentData | null>(null)
  const isSavingRef = useRef(false) // Prevent infinite loops
  
  // Reset initialization when agentId changes
  useEffect(() => {
    if (agentIdRef.current !== agentId) {
      isInitializedRef.current = false
      initializationCompleteRef.current = false
      previousFormDataRef.current = null
      agentIdRef.current = agentId
    }
  }, [agentId])
  
  // Initialize form from agent data
  useEffect(() => {
    if (agent && !isInitializedRef.current) {
      try {
        // Ensure all values are properly initialized with safe defaults
        setName(agent.name || '')
        setSystemPrompt(agent.system_prompt || '')
        setVoiceId(agent.voice_id || '')
        setTools(Array.isArray(agent.tools) ? agent.tools : [])
        setKnowledgeBases(Array.isArray(agent.knowledge_bases) ? agent.knowledge_bases : [])
        setGreetingSettings(agent.greeting_settings && typeof agent.greeting_settings === 'object' 
          ? { first_speaker: 'agent', ...agent.greeting_settings }
          : { first_speaker: 'agent' })
        setInactivityMessages(Array.isArray(agent.inactivity_messages) ? agent.inactivity_messages : [])
        setRecordingEnabled(agent.recording_enabled ?? false)
        setModel(agent.model || 'ultravox-v0.6')
        setInitialOutputMedium((agent.initial_output_medium as MessageMedium) || 'MESSAGE_MEDIUM_VOICE')
        setJoinTimeout(agent.join_timeout || '')
        setMaxDuration(agent.max_duration || '')
        setTimeExceededMessage(agent.time_exceeded_message || '')
        // Ensure temperature is a valid number
        const tempValue = typeof agent.temperature === 'number' ? agent.temperature : 
                         (agent.temperature !== null && agent.temperature !== undefined ? Number(agent.temperature) : 0.7)
        setTemperature(isNaN(tempValue) ? 0.7 : Math.max(0, Math.min(1, tempValue)))
        setLanguageHint(agent.language_hint || 'en-US')
        setVadSettings(agent.vad_settings && typeof agent.vad_settings === 'object' ? agent.vad_settings : {})
        isInitializedRef.current = true
      } catch (error) {
        console.error('Error initializing form from agent data:', error)
      }
    }
  }, [agent])
  
  // Prepare update data
  const prepareUpdateData = useCallback((): UpdateAgentData => {
    return {
      name: name.trim(),
      system_prompt: systemPrompt.trim(),
      voice_id: voiceId,
      tools,
      knowledge_bases: knowledgeBases,
      greeting_settings: greetingSettings,
      inactivity_messages: inactivityMessages,
      recording_enabled: recordingEnabled,
      model,
      initial_output_medium: initialOutputMedium,
      join_timeout: joinTimeout || undefined,
      max_duration: maxDuration || undefined,
      time_exceeded_message: timeExceededMessage || undefined,
      temperature,
      language_hint: languageHint || undefined,
      vad_settings: vadSettings,
    }
  }, [
    name,
    systemPrompt,
    voiceId,
    tools,
    knowledgeBases,
    greetingSettings,
    inactivityMessages,
    recordingEnabled,
    model,
    initialOutputMedium,
    joinTimeout,
    maxDuration,
    timeExceededMessage,
    temperature,
    languageHint,
    vadSettings,
  ])
  
  // Debounced auto-save - only debounce the actual form data, not the function call
  const formData = prepareUpdateData()
  const debouncedFormData = useDebounce(formData, 500)
  
  // Mark initialization as complete and set initial previous data
  useEffect(() => {
    if (isInitializedRef.current && !initializationCompleteRef.current) {
      // Set the previous data to current form data after initialization
      // This prevents auto-save from triggering immediately after load
      const timer = setTimeout(() => {
        previousFormDataRef.current = formData
        initializationCompleteRef.current = true
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [isInitializedRef.current, formData])
  
  // Auto-save effect
  useEffect(() => {
    if (!agent || !isInitializedRef.current) return
    if (!initializationCompleteRef.current) return
    if (!name.trim() || !systemPrompt.trim() || !voiceId) return
    if (isSavingRef.current) return // Prevent concurrent saves
    if (isSaving) return // Prevent concurrent saves
    if (isLoading) return // Don't auto-save while loading/refetching
    if (partialUpdateMutation.isPending) return // Don't trigger if mutation is already in progress
    
    // Skip if form data hasn't changed
    const currentDataStr = JSON.stringify(debouncedFormData)
    const previousDataStr = previousFormDataRef.current ? JSON.stringify(previousFormDataRef.current) : null
    
    if (currentDataStr === previousDataStr) return
    
    // Skip if this matches the original agent data (no actual changes)
    const agentDataStr = JSON.stringify({
      name: agent.name || '',
      system_prompt: agent.system_prompt || '',
      voice_id: agent.voice_id || '',
      tools: Array.isArray(agent.tools) ? agent.tools : [],
      knowledge_bases: Array.isArray(agent.knowledge_bases) ? agent.knowledge_bases : [],
      greeting_settings: agent.greeting_settings || { first_speaker: 'agent' },
      inactivity_messages: Array.isArray(agent.inactivity_messages) ? agent.inactivity_messages : [],
      recording_enabled: agent.recording_enabled ?? false,
      model: agent.model || 'ultravox-v0.6',
      initial_output_medium: agent.initial_output_medium || 'MESSAGE_MEDIUM_VOICE',
      join_timeout: agent.join_timeout || '',
      max_duration: agent.max_duration || '',
      time_exceeded_message: agent.time_exceeded_message || '',
      temperature: agent.temperature ?? 0.7,
      language_hint: agent.language_hint || 'en-US',
      vad_settings: agent.vad_settings || {},
    })
    
    if (currentDataStr === agentDataStr) {
      previousFormDataRef.current = debouncedFormData
      return
    }
    
    // Set flags to prevent concurrent saves
    isSavingRef.current = true
    setSaveStatus('saving')
    setIsSaving(true)
    
    partialUpdateMutation.mutate(
      { id: agentId, data: debouncedFormData },
      {
        onSuccess: () => {
          setSaveStatus('saved')
          setLastSaved(new Date())
          setIsSaving(false)
          isSavingRef.current = false
          previousFormDataRef.current = debouncedFormData
          // Reset to idle after 3 seconds
          setTimeout(() => {
            setSaveStatus('idle')
          }, 3000)
        },
        onError: (error) => {
          setSaveStatus('error')
          setIsSaving(false)
          isSavingRef.current = false
          console.error('Auto-save failed:', error)
        },
      }
    )
  }, [debouncedFormData, agentId, agent, name, systemPrompt, voiceId, isSaving, isLoading])
  
  // Manual save handler
  const handleSave = useCallback(async () => {
    if (!agent) return
    if (!name.trim() || !systemPrompt.trim() || !voiceId) {
      toast({
        title: 'Validation Error',
        description: 'Name, system prompt, and voice are required.',
        variant: 'destructive',
      })
      return
    }
    
    setIsSaving(true)
    setSaveStatus('saving')
    
    try {
      const updateData = prepareUpdateData()
      await updateMutation.mutateAsync({ id: agentId, data: updateData })
      setSaveStatus('saved')
      setLastSaved(new Date())
      toast({
        title: 'Saved',
        description: 'Agent has been saved successfully.',
      })
      // Reset to idle after 3 seconds
      setTimeout(() => {
        setSaveStatus('idle')
      }, 3000)
    } catch (error) {
      setSaveStatus('error')
      const errorMessage = error instanceof Error ? error.message : 'Failed to save agent'
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }, [agent, agentId, name, systemPrompt, voiceId, prepareUpdateData, updateMutation, toast])
  
  // Loading state
  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </AppLayout>
    )
  }
  
  // Error state
  if (error) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-screen gap-4">
          <p className="text-red-500">Failed to load agent. Please try again.</p>
          <Button onClick={() => router.back()} variant="outline">
            Go Back
          </Button>
        </div>
      </AppLayout>
    )
  }
  
  // No agent found or agent data is incomplete
  if (!agent || !agent.id) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-screen gap-4">
          <p className="text-gray-500">Agent not found.</p>
          <Button onClick={() => router.back()} variant="outline">
            Go Back
          </Button>
        </div>
      </AppLayout>
    )
  }
  
  // Ensure agent has all required fields with safe defaults
  const existingAgent: Agent = {
    ...agent,
    name: agent.name || '',
    system_prompt: agent.system_prompt || '',
    voice_id: agent.voice_id || '',
    tools: Array.isArray(agent.tools) ? agent.tools : [],
    knowledge_bases: Array.isArray(agent.knowledge_bases) ? agent.knowledge_bases : [],
    greeting_settings: agent.greeting_settings && typeof agent.greeting_settings === 'object' 
      ? agent.greeting_settings 
      : { first_speaker: 'agent' },
    inactivity_messages: Array.isArray(agent.inactivity_messages) ? agent.inactivity_messages : [],
    recording_enabled: agent.recording_enabled ?? false,
    model: agent.model || 'ultravox-v0.6',
    initial_output_medium: (agent.initial_output_medium as MessageMedium) || 'MESSAGE_MEDIUM_VOICE',
    join_timeout: agent.join_timeout || '',
    max_duration: agent.max_duration || '',
    time_exceeded_message: agent.time_exceeded_message || '',
    temperature: typeof agent.temperature === 'number' ? agent.temperature : 
                 (agent.temperature !== null && agent.temperature !== undefined ? Number(agent.temperature) : 0.7),
    language_hint: agent.language_hint || 'en-US',
    vad_settings: agent.vad_settings && typeof agent.vad_settings === 'object' ? agent.vad_settings : {},
  }

  return (
    <AppLayout>
      <div className="flex h-[calc(100vh-4rem)] gap-6 p-2">
        {/* Left Panel - Agent Configuration */}
        <div className={`flex flex-col min-w-0 transition-all duration-300 ${isRightPanelOpen ? 'flex-1' : 'w-full'}`}>
          {/* Header Area */}
          <div className="flex flex-col gap-4 pb-4">
            <div className="flex items-center justify-between gap-4">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Untitled Agent"
                className="text-3xl font-bold bg-transparent border-none px-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-300 dark:placeholder:text-gray-700 h-auto rounded-none"
              />
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
                  className="hidden md:flex gap-2 rounded-xl"
                >
                  <Sparkles className="h-4 w-4 text-primary" />
                  {isRightPanelOpen ? 'Hide AI Assist' : 'AI Assist'}
                </Button>
                
                <Button
                  onClick={handleSave}
                  disabled={isSaving || !name.trim() || !systemPrompt.trim() || !voiceId}
                  className="gap-2 rounded-xl shadow-lg shadow-primary/20"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Selectors Row */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="w-64">
                <VoiceSelector value={voiceId} onValueChange={setVoiceId} />
              </div>
              <div className="w-auto min-w-[200px]">
                <ToolsSelector value={tools} onValueChange={setTools} />
              </div>
              <div className="w-auto min-w-[200px]">
                <RAGSelector value={knowledgeBases} onValueChange={setKnowledgeBases} />
              </div>
              
              <div className="flex-1" />
              
              {/* Save Status Indicator */}
              <div className="text-xs font-medium text-gray-400 dark:text-gray-500 flex items-center gap-2 bg-gray-50 dark:bg-gray-900 px-3 py-1.5 rounded-full">
                {saveStatus === 'saving' && (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Saving...
                  </>
                )}
                {saveStatus === 'saved' && lastSaved && (
                  <>
                    <Clock className="h-3 w-3" />
                    Saved {formatDistanceToNow(lastSaved, { addSuffix: true })}
                  </>
                )}
                {saveStatus === 'error' && (
                  <span className="text-red-500">Save failed</span>
                )}
              </div>
            </div>
          </div>

          {/* Main Content Area - Tabs */}
          <div className="flex-1 min-h-0 bg-white dark:bg-gray-950 rounded-3xl border border-gray-100 dark:border-gray-900 shadow-sm overflow-hidden flex flex-col">
            <Tabs defaultValue="prompt" className="flex-1 flex flex-col min-h-0">
              <div className="px-6 pt-4 pb-2">
                <TabsList className="w-full max-w-2xl grid grid-cols-5 bg-gray-100/50 dark:bg-gray-900/50 p-1 rounded-xl">
                  <TabsTrigger 
                    value="prompt" 
                    className="rounded-lg text-gray-600 dark:text-gray-400 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm data-[state=active]:!text-gray-900 dark:data-[state=active]:!text-white data-[state=active]:font-semibold"
                  >
                    Prompt
                  </TabsTrigger>
                  <TabsTrigger 
                    value="greeting" 
                    className="rounded-lg text-gray-600 dark:text-gray-400 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm data-[state=active]:!text-gray-900 dark:data-[state=active]:!text-white data-[state=active]:font-semibold"
                  >
                    Greeting
                  </TabsTrigger>
                  <TabsTrigger 
                    value="inactivity" 
                    className="rounded-lg text-gray-600 dark:text-gray-400 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm data-[state=active]:!text-gray-900 dark:data-[state=active]:!text-white data-[state=active]:font-semibold"
                  >
                    Inactivity
                  </TabsTrigger>
                  <TabsTrigger 
                    value="settings" 
                    className="rounded-lg text-gray-600 dark:text-gray-400 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm data-[state=active]:!text-gray-900 dark:data-[state=active]:!text-white data-[state=active]:font-semibold"
                  >
                    Settings
                  </TabsTrigger>
                  <TabsTrigger 
                    value="phone-numbers" 
                    className="rounded-lg text-gray-600 dark:text-gray-400 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm data-[state=active]:!text-gray-900 dark:data-[state=active]:!text-white data-[state=active]:font-semibold"
                  >
                    Phone Numbers
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-1 overflow-y-auto px-6 pb-6">
                <TabsContent value="prompt" className="mt-2 h-full">
                  <PromptTab
                    systemPrompt={systemPrompt}
                    onSystemPromptChange={setSystemPrompt}
                  />
                </TabsContent>

                <TabsContent value="greeting" className="mt-2 h-full">
                  <GreetingTab
                    greetingSettings={greetingSettings}
                    onGreetingSettingsChange={setGreetingSettings}
                  />
                </TabsContent>

                <TabsContent value="inactivity" className="mt-2 h-full">
                  <InactivityMessagesTab
                    inactivityMessages={inactivityMessages}
                    onInactivityMessagesChange={setInactivityMessages}
                  />
                </TabsContent>

                <TabsContent value="settings" className="mt-2 h-full">
                  <SettingsTab
                    recordingEnabled={recordingEnabled}
                    onRecordingEnabledChange={setRecordingEnabled}
                    model={model || 'ultravox-v0.6'}
                    onModelChange={setModel}
                    initialOutputMedium={initialOutputMedium || 'MESSAGE_MEDIUM_VOICE'}
                    onInitialOutputMediumChange={setInitialOutputMedium}
                    joinTimeout={joinTimeout || ''}
                    onJoinTimeoutChange={setJoinTimeout}
                    maxDuration={maxDuration || ''}
                    onMaxDurationChange={setMaxDuration}
                    timeExceededMessage={timeExceededMessage || ''}
                    onTimeExceededMessageChange={setTimeExceededMessage}
                    temperature={typeof temperature === 'number' && !isNaN(temperature) ? Math.max(0, Math.min(1, temperature)) : 0.7}
                    onTemperatureChange={(val) => setTemperature(typeof val === 'number' && !isNaN(val) ? Math.max(0, Math.min(1, val)) : 0.7)}
                    languageHint={languageHint || 'en-US'}
                    onLanguageHintChange={setLanguageHint}
                    vadSettings={vadSettings || {}}
                    onVADSettingsChange={setVadSettings}
                  />
                </TabsContent>
                <TabsContent value="phone-numbers" className="mt-2 h-full">
                  <PhoneNumbersTab agentId={agentId} />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>

        {/* Right Panel - AI Assistance + Test */}
        <div 
          className={`flex-shrink-0 border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-black transition-all duration-300 ease-in-out overflow-hidden ${
            isRightPanelOpen 
              ? 'w-[400px] opacity-100' 
              : 'w-0 opacity-0'
          }`}
        >
          <div 
            className={`flex flex-col h-full gap-6 pl-6 pr-2 py-2 w-[400px] transition-transform duration-300 ease-in-out ${
              isRightPanelOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="flex-1 min-h-0 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-gray-100 dark:border-gray-800 p-4 shadow-sm overflow-hidden">
              <AIAssistancePanel agentContext={existingAgent} />
            </div>
            {showTest && (
              <div className="flex-1 min-h-0 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-gray-100 dark:border-gray-800 p-4 shadow-sm overflow-hidden">
                <TestAgentPanel agentId={agentId} />
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
