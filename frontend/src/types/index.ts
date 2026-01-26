// User and Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'org_admin' | 'workspace_admin' | 'member';

// Workspace Types
export interface Workspace {
  id: string;
  name: string;
  organizationId: string;
  settings: WorkspaceSettings;
  credits: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkspaceSettings {
  timezone: string;
  defaultVoice?: string;
  webhookUrl?: string;
  customDomain?: string;
  recordCalls?: boolean;
}

// Voice Types (matching backend schema)
export interface Voice {
  id: string;
  client_id: string;
  name: string;
  provider: string; // 'elevenlabs', 'google', 'azure', 'openai'
  type: 'custom' | 'reference';
  language: string;
  status: VoiceStatus;
  description?: string;
  training_info?: {
    progress?: number;
    message?: string;
    started_at?: string;
    completed_at?: string;
    error_at?: string;
    estimated_completion?: string;
    updated_at?: string;
  };
  provider_voice_id?: string; // ElevenLabs voice ID for external voices
  ultravox_voice_id?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Voice status lifecycle:
 * - 'training': Voice is being cloned/trained (background processing)
 * - 'active': Voice is ready to use
 * - 'failed': Voice creation/training failed
 */
export type VoiceStatus = 'training' | 'active' | 'failed';

export interface VoiceSettings {
  stability?: number;
  similarityBoost?: number;
  style?: number;
  useSpeakerBoost?: boolean;
}

// Tool Types
export interface Tool {
  id: string;
  name: string;
  description: string;
  type: ToolType;
  config: ToolConfig;
  enabled: boolean;
}

export type ToolType = 'api' | 'webhook' | 'function' | 'database';

export interface ToolConfig {
  endpoint?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  params?: Record<string, any>;
  authentication?: {
    type: 'bearer' | 'basic' | 'apikey';
    credentials: string;
  };
}

// Campaign Types (matching backend schema)
export interface Campaign {
  id: string;
  client_id: string;
  agent_id?: string;
  name: string;
  schedule_type: 'immediate' | 'scheduled';
  scheduled_at?: string;
  timezone: string;
  max_concurrent_calls: number;
  status: CampaignStatus;
  stats?: CampaignStats;
  created_at: string;
  updated_at: string;
}

export type CampaignStatus = 'draft' | 'scheduled' | 'active' | 'completed' | 'failed' | 'cancelled';

export interface CampaignSchedule {
  startDate: Date;
  endDate?: Date;
  timezone: string;
  workingHours: {
    start: string;
    end: string;
  };
  workingDays: number[]; // 0-6 (Sunday-Saturday)
  retryAttempts: number;
  retryDelay: number; // minutes
}

export interface CampaignSettings {
  maxConcurrentCalls: number;
  callTimeout: number; // seconds
  leaveVoicemail: boolean;
  voicemailMessage?: string;
  transferNumber?: string;
  customGreeting?: string;
}

export interface CampaignStats {
  totalContacts: number;
  completed: number;
  successful: number;
  failed: number;
  pending: number;
  totalDuration: number; // seconds
  averageDuration: number; // seconds
  totalCost: number;
  averageCost: number;
}

// Call Types (matching backend schema)
export interface Call {
  id: string;
  client_id: string;
  agent_id?: string;
  ultravox_call_id?: string;
  phone_number: string;
  direction: 'inbound' | 'outbound';
  status: CallStatus;
  started_at?: string;
  ended_at?: string;
  duration_seconds?: number;
  cost_usd?: number;
  created_at: string;
}

export type CallStatus = 'queued' | 'ringing' | 'in_progress' | 'completed' | 'failed' | 'no_answer' | 'busy' | 'voicemail';

export interface CallRecording {
  url: string;
  duration: number;
  size: number;
}

export interface CallTranscript {
  speaker: 'agent' | 'contact';
  text: string;
  timestamp: number;
  confidence: number;
}

// Voice Cloning Types
export interface VoiceClone {
  id: string;
  workspaceId: string;
  name: string;
  description?: string;
  status: VoiceCloneStatus;
  audioSamples: AudioSample[];
  settings: VoiceCloneSettings;
  trainingProgress?: number;
  voiceId?: string;
  sampleUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type VoiceCloneStatus = 'draft' | 'training' | 'ready' | 'failed';

export interface AudioSample {
  id: string;
  name: string;
  url: string;
  duration: number;
  size: number;
  uploadedAt: Date;
}

export interface VoiceCloneSettings {
  language: string;
  gender?: 'male' | 'female' | 'neutral';
  age?: 'young' | 'middle_aged' | 'old';
  accent?: string;
  style?: string;
}

// Analytics Types
export interface Analytics {
  overview: OverviewStats;
  calls: CallAnalytics;
  campaigns: CampaignAnalytics;
  costs: CostAnalytics;
  timeRange: TimeRange;
}

export interface OverviewStats {
  totalCalls: number;
  totalMinutes: number;
  totalCost: number;
  successRate: number;
  averageCallDuration: number;
  activeCampaigns: number;
  activeAgents: number;
  creditsRemaining: number;
}

export interface CallAnalytics {
  byStatus: Record<CallStatus, number>;
  byHour: Array<{ hour: number; count: number }>;
  byDay: Array<{ date: string; count: number }>;
  averageDuration: number;
  successRate: number;
}

export interface CampaignAnalytics {
  topPerforming: Array<{ campaignId: string; name: string; stats: CampaignStats }>;
  completion: number;
  activeCount: number;
}


export interface CostAnalytics {
  byDay: Array<{ date: string; cost: number }>;
  byCampaign: Array<{ campaignId: string; name: string; cost: number }>;
  projectedMonthlyCost: number;
}

export interface TimeRange {
  start: Date;
  end: Date;
  period: 'day' | 'week' | 'month' | 'year' | 'custom';
}

// API Response Types (matching backend format)
// Note: Backend uses {data, meta} format - see lib/api.ts for BackendResponse
export interface ApiResponse<T> {
  data: T;
  meta?: {
    request_id?: string;
    ts?: string;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form Types (matching backend schema)
export interface CreateCampaignData {
  name: string;
  agent_id?: string;
  schedule_type: 'immediate' | 'scheduled';
  scheduled_at?: string;
  timezone?: string; // Default: 'UTC'
  max_concurrent_calls?: number; // Default: 10
}

export interface UpdateCampaignData {
  name?: string;
  agent_id?: string;
  schedule_type?: 'immediate' | 'scheduled';
  scheduled_at?: string;
  timezone?: string;
  max_concurrent_calls?: number;
}

export interface CampaignContact {
  phone_number: string; // E.164 format: +12125550123
  first_name?: string;
  last_name?: string;
  email?: string;
  custom_fields?: Record<string, any>;
}

export interface CampaignContactsUpload {
  storage_key?: string;
  contacts?: CampaignContact[];
}

// Contact Management Types
export interface ContactFolder {
  id: string;
  client_id: string;
  name: string;
  description?: string;
  contact_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Contact {
  id: string;
  client_id: string;
  folder_id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number: string;
  // New standard fields
  company_name?: string;
  industry?: string;
  location?: string;
  pin_code?: string;
  keywords?: string[];
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  folder?: {
    id: string;
    name: string;
  };
}

export interface CreateContactFolderData {
  name: string;
  description?: string;
}

export interface UpdateContactFolderData {
  name?: string;
  description?: string;
}

export interface CreateContactData {
  folder_id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number: string;
  // New standard fields
  company_name?: string;
  industry?: string;
  location?: string;
  pin_code?: string;
  keywords?: string[];
  metadata?: Record<string, any>;
}

export interface UpdateContactData {
  folder_id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  // New standard fields
  company_name?: string;
  industry?: string;
  location?: string;
  pin_code?: string;
  keywords?: string[];
  metadata?: Record<string, any>;
}

export interface ContactImportRequest {
  folder_id: string;
  file_key?: string; // Legacy
  contacts?: CreateContactData[]; // Legacy
  // New: Base64 CSV file upload
  base64_file?: string;
  filename?: string;
  // New: Mapping configuration for dynamic field mapping
  mapping_config?: Record<string, string>; // Format: {'csv_header': 'standard_field'}
}

export interface ContactImportResponse {
  successful: number;
  failed: number;
  errors?: Array<{ row: number; error: string }>;
}

export interface CreateVoiceCloneData {
  name: string;
  description?: string;
  settings: VoiceCloneSettings;
}

// Knowledge Base Types
export interface KnowledgeBase {
  id: string;
  client_id: string;
  name: string;
  description?: string;
  content?: string; // Extracted text
  file_type?: string;
  file_size?: number;
  file_name?: string;
  status: 'creating' | 'ready' | 'failed';
  ultravox_tool_id?: string;
  created_at: string;
  updated_at: string;
}

export interface FileData {
  filename: string;
  data: string; // Base64 encoded file data
  content_type: string;
}

export interface CreateKnowledgeBaseData {
  name: string;
  description?: string;
  file: File; // Frontend passes File, hook converts to base64
}

export interface UpdateKnowledgeBaseData {
  name?: string;
  description?: string;
  content?: string;
}

// Notification Types
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  data?: Record<string, any>;
}

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

// Agent Types (matching backend schema)
export interface Agent {
  id: string;
  client_id: string;
  ultravox_agent_id?: string;
  name: string;
  description?: string;
  voice_id: string;
  system_prompt: string;
  model: string;
  tools: string[]; // Array of tool IDs
  knowledge_bases: string[]; // Array of knowledge base IDs
  status: AgentStatus;
  created_at: string;
  updated_at: string;
  
  // Call template fields
  call_template_name?: string;
  greeting_settings?: GreetingSettings;
  inactivity_messages?: InactivityMessage[];
  temperature?: number;
  language_hint?: string;
  time_exceeded_message?: string;
  recording_enabled?: boolean;
  join_timeout?: string;
  max_duration?: string;
  initial_output_medium?: MessageMedium;
  vad_settings?: VADSettings;
  template_id?: string;
  
  // Legacy fields
  configuration?: Record<string, any>;
  success_criteria?: string;
  extraction_schema?: Record<string, any>;
  crm_webhook_url?: string;
  crm_webhook_secret?: string;
}

export type AgentStatus = 'creating' | 'active' | 'failed';

export type MessageMedium = 'MESSAGE_MEDIUM_VOICE' | 'MESSAGE_MEDIUM_TEXT' | 'MESSAGE_MEDIUM_UNSPECIFIED';

export type FirstSpeaker = 'agent' | 'user';

export interface GreetingSettings {
  first_speaker: FirstSpeaker;
  text?: string;
  prompt?: string;
  delay?: string;
  uninterruptible?: boolean;
  fallback_delay?: string;
  fallback_text?: string;
  fallback_prompt?: string;
}

export type EndBehavior = 'END_BEHAVIOR_UNSPECIFIED' | 'END_BEHAVIOR_HANG_UP_SOFT' | 'END_BEHAVIOR_HANG_UP_STRICT';

export interface InactivityMessage {
  duration: string; // e.g., "30s"
  message: string;
  endBehavior?: EndBehavior;
}

export interface VADSettings {
  turn_endpoint_delay?: string; // e.g., "500ms"
  minimum_turn_duration?: string; // e.g., "200ms"
  minimum_interruption_duration?: string; // e.g., "100ms"
  frame_activation_threshold?: number; // 0-1
}

// Agent Template Types
export interface AgentTemplate {
  id: string;
  name: string;
  description?: string;
  system_prompt: string;
  category?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Agent Form Data Types
export interface CreateAgentData {
  name: string;
  description?: string;
  voice_id: string;
  system_prompt: string;
  model?: string;
  tools?: string[];
  knowledge_bases?: string[];
  template_id?: string;
  
  // Call template fields
  call_template_name?: string;
  greeting_settings?: GreetingSettings;
  inactivity_messages?: InactivityMessage[];
  temperature?: number;
  language_hint?: string;
  time_exceeded_message?: string;
  recording_enabled?: boolean;
  join_timeout?: string;
  max_duration?: string;
  initial_output_medium?: MessageMedium;
  vad_settings?: VADSettings;
  
  // Legacy fields
  success_criteria?: string;
  extraction_schema?: Record<string, any>;
  crm_webhook_url?: string;
  crm_webhook_secret?: string;
}

export interface UpdateAgentData {
  name?: string;
  description?: string;
  voice_id?: string;
  system_prompt?: string;
  model?: string;
  tools?: string[];
  knowledge_bases?: string[];
  
  // Call template fields
  call_template_name?: string;
  greeting_settings?: GreetingSettings;
  inactivity_messages?: InactivityMessage[];
  temperature?: number;
  language_hint?: string;
  time_exceeded_message?: string;
  recording_enabled?: boolean;
  join_timeout?: string;
  max_duration?: string;
  initial_output_medium?: MessageMedium;
  vad_settings?: VADSettings;
  
  // Legacy fields
  success_criteria?: string;
  extraction_schema?: Record<string, any>;
  crm_webhook_url?: string;
  crm_webhook_secret?: string;
}

// Agent Test Call Types
export interface AgentTestCallResponse {
  call_id: string;
  join_url: string;
  agent_id: string;
  created_at: string;
}

// Agent AI Assistance Types
export interface AgentAIAssistRequest {
  prompt: string;
  context?: Partial<Agent>;
  action?: 'improve_prompt' | 'suggest_greeting' | string;
}

export interface AgentAIAssistResponse {
  suggestion: string;
  improved_content?: string;
}

