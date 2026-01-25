'use client'

import { AgentEditor } from '@/components/agents/agent-editor'
import { useParams } from 'next/navigation'

export default function EditAgentPage() {
  const params = useParams()
  const agentId = params.id as string

  return <AgentEditor agentId={agentId} />
}
