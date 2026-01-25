'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useTestAgentCall } from '@/hooks/use-agents'
import { useToast } from '@/hooks/use-toast'
import { Play, PhoneOff, Mic, MicOff, Volume2, VolumeX, Send, Loader2 } from 'lucide-react'
import { UltravoxSession } from 'ultravox-client'

interface TestAgentPanelProps {
  agentId: string
  onClose?: () => void
}

type SessionStatus = 'disconnected' | 'disconnecting' | 'connecting' | 'idle' | 'listening' | 'thinking' | 'speaking'

interface Transcript {
  text: string
  isFinal: boolean
  speaker: 'user' | 'agent'
  medium: 'voice' | 'text'
}

export function TestAgentPanel({ agentId, onClose }: TestAgentPanelProps) {
  const [session, setSession] = useState<UltravoxSession | null>(null)
  const [status, setStatus] = useState<SessionStatus>('disconnected')
  const [transcripts, setTranscripts] = useState<Transcript[]>([])
  const [textInput, setTextInput] = useState('')
  const [isMicMuted, setIsMicMuted] = useState(false)
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(false)
  const sessionRef = useRef<UltravoxSession | null>(null)
  const { toast } = useToast()
  const testCallMutation = useTestAgentCall()

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (sessionRef.current) {
        sessionRef.current.leaveCall().catch(console.error)
      }
    }
  }, [])

  const handleStartTest = async () => {
    try {
      // Create test call via backend
      const response = await testCallMutation.mutateAsync(agentId)
      const { join_url } = response

      if (!join_url) {
        throw new Error('No join URL received from server')
      }

      // Create Ultravox session
      const uvSession = new UltravoxSession()
      sessionRef.current = uvSession
      setSession(uvSession)

      // Set up event listeners
      uvSession.addEventListener('status', () => {
        const currentStatus = uvSession.status as SessionStatus
        setStatus(currentStatus)
      })

      uvSession.addEventListener('transcripts', () => {
        const currentTranscripts = uvSession.transcripts as Transcript[]
        setTranscripts([...currentTranscripts])
      })

      // Join the call
      uvSession.joinCall(join_url, 'trudy-web-app-v1.0')
      setStatus('connecting')

      toast({
        title: 'Test call started',
        description: 'Connecting to agent...',
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start test call'
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
    }
  }

  const handleEndCall = async () => {
    if (sessionRef.current) {
      try {
        await sessionRef.current.leaveCall()
        setStatus('disconnected')
        setTranscripts([])
        setSession(null)
        sessionRef.current = null
        toast({
          title: 'Call ended',
          description: 'Test call has been disconnected',
        })
        onClose?.()
      } catch (error) {
        console.error('Error ending call:', error)
      }
    }
  }

  const handleSendText = () => {
    if (!sessionRef.current || !textInput.trim()) return

    sessionRef.current.sendText(textInput)
    setTextInput('')
  }

  const handleToggleMic = () => {
    if (!sessionRef.current) return

    if (isMicMuted) {
      sessionRef.current.unmuteMic()
    } else {
      sessionRef.current.muteMic()
    }
    setIsMicMuted(!isMicMuted)
  }

  const handleToggleSpeaker = () => {
    if (!sessionRef.current) return

    if (isSpeakerMuted) {
      sessionRef.current.unmuteSpeaker()
    } else {
      sessionRef.current.muteSpeaker()
    }
    setIsSpeakerMuted(!isSpeakerMuted)
  }

  const getStatusColor = (status: SessionStatus) => {
    switch (status) {
      case 'idle':
      case 'listening':
        return 'bg-green-500'
      case 'thinking':
        return 'bg-yellow-500'
      case 'speaking':
        return 'bg-blue-500'
      case 'connecting':
        return 'bg-gray-500'
      default:
        return 'bg-gray-400'
    }
  }

  const getStatusLabel = (status: SessionStatus) => {
    switch (status) {
      case 'disconnected':
        return 'Disconnected'
      case 'connecting':
        return 'Connecting...'
      case 'idle':
        return 'Idle'
      case 'listening':
        return 'Listening'
      case 'thinking':
        return 'Thinking...'
      case 'speaking':
        return 'Speaking'
      default:
        return status
    }
  }

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          Test Agent
        </h3>
        {status !== 'disconnected' && (
          <Badge
            className={`${getStatusColor(status)} text-white`}
          >
            {getStatusLabel(status)}
          </Badge>
        )}
      </div>

      {/* Test Call Button or Controls */}
      {status === 'disconnected' ? (
        <Button
          onClick={handleStartTest}
          disabled={testCallMutation.isPending}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          {testCallMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Starting...
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Test Agent
            </>
          )}
        </Button>
      ) : (
        <>
          {/* Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleMic}
              className={isMicMuted ? 'bg-red-50 dark:bg-red-950' : ''}
            >
              {isMicMuted ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleSpeaker}
              className={isSpeakerMuted ? 'bg-red-50 dark:bg-red-950' : ''}
            >
              {isSpeakerMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleEndCall}
              className="flex-1"
            >
              <PhoneOff className="h-4 w-4 mr-2" />
              End Call
            </Button>
          </div>

          {/* Transcripts */}
          <div className="flex-1 overflow-y-auto space-y-2 min-h-0 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
            {transcripts.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p className="text-sm">No transcripts yet</p>
                <p className="text-xs mt-1">Start speaking or send a message</p>
              </div>
            ) : (
              transcripts.map((transcript, index) => (
                <div
                  key={index}
                  className={`p-2 rounded-md ${
                    transcript.speaker === 'user'
                      ? 'bg-blue-50 dark:bg-blue-950 ml-auto max-w-[80%]'
                      : 'bg-gray-50 dark:bg-gray-900 mr-auto max-w-[80%]'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      {transcript.speaker === 'user' ? 'You' : 'Agent'}
                    </span>
                    {!transcript.isFinal && (
                      <Badge variant="secondary" className="text-xs">
                        Typing...
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {transcript.text}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Text Input */}
          <div className="flex gap-2">
            <Input
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Type a message..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSendText()
                }
              }}
              disabled={status === 'disconnected'}
            />
            <Button
              onClick={handleSendText}
              disabled={!textInput.trim() || status === 'disconnected'}
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
