import type { SupabaseClient } from '@supabase/supabase-js'
import { applyDecayToNodes, buildGraphEdges, prioritizeGaps, getAllDomainCoverage } from '@mastery-os/knowledge-graph'
import { dbNodeToNode } from '../ai/context.js'
import type { KnowledgeNode } from '@mastery-os/types'

export async function getGraphForUser(userId: string, supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from('knowledge_nodes')
    .select('*')
    .or(`user_id.eq.${userId},user_id.is.null`)

  if (error) throw error

  const nodes: KnowledgeNode[] = (data || []).map(dbNodeToNode)
  const decayed = applyDecayToNodes(nodes)
  const edges = buildGraphEdges(decayed)
  return { nodes: decayed, edges }
}

export async function getGapsForUser(userId: string, supabase: SupabaseClient) {
  const { nodes } = await getGraphForUser(userId, supabase)
  const gaps = prioritizeGaps(nodes)
  const domainCoverage = getAllDomainCoverage(nodes)
  return { gaps, domainCoverage }
}

export async function updateNodeConfidence(
  nodeId: string,
  _userId: string,
  newConfidence: number,
  sessionId: string | null,
  supabase: SupabaseClient
) {
  const { data: existing } = await supabase
    .from('knowledge_nodes')
    .select('confidence')
    .eq('id', nodeId)
    .single()

  const confidenceBefore = (existing?.confidence as number) ?? 0
  const clamped = Math.max(0, Math.min(5, newConfidence))

  const { error: updateError } = await supabase
    .from('knowledge_nodes')
    .update({ confidence: clamped, last_reviewed_at: new Date().toISOString() })
    .eq('id', nodeId)

  if (updateError) throw updateError

  if (sessionId) {
    await supabase.from('concept_updates').insert({
      node_id: nodeId,
      session_id: sessionId,
      confidence_before: confidenceBefore,
      confidence_after: clamped,
    })
  }

  return { confidenceBefore, confidenceAfter: clamped }
}

export async function addCustomNode(
  userId: string,
  node: Partial<KnowledgeNode>,
  supabase: SupabaseClient
) {
  const { data, error } = await supabase
    .from('knowledge_nodes')
    .insert({
      user_id: userId,
      domain: node.domain,
      tier: node.tier ?? 1,
      title: node.title,
      description: node.description ?? '',
      confidence: 0,
      interview_frequency: 0.5,
      prerequisites: node.prerequisites ?? [],
      unlocks: node.unlocks ?? [],
      tags: node.tags ?? [],
      is_seeded: false,
    })
    .select()
    .single()

  if (error) throw error
  return dbNodeToNode(data as Record<string, unknown>)
}
