import type { SupabaseClient } from '@supabase/supabase-js'
import { applyDecayToNodes, prioritizeGaps } from '@mastery-os/knowledge-graph'
import { dbNodeToNode, buildSystemContext } from '../ai/context.js'
import { generateBriefing } from '../ai/brief.js'

export async function getOrCreateTodaysBriefing(userId: string, supabase: SupabaseClient) {
  const today = new Date().toISOString().split('T')[0]

  const { data: existing } = await supabase
    .from('daily_briefings')
    .select('*')
    .eq('user_id', userId)
    .eq('date', today)
    .single()

  if (existing) {
    const { data: reviewNodes } = await supabase
      .from('knowledge_nodes')
      .select('*')
      .in('id', (existing.nodes_due_for_review as string[]) || [])
    return {
      briefing: existing,
      reviewNodes: (reviewNodes || []).map((r) => dbNodeToNode(r as Record<string, unknown>)),
    }
  }

  const { data: rawNodes } = await supabase
    .from('knowledge_nodes')
    .select('*')
    .or(`user_id.eq.${userId},user_id.is.null`)

  const nodes = applyDecayToNodes((rawNodes || []).map((r) => dbNodeToNode(r as Record<string, unknown>)))
  const gaps = prioritizeGaps(nodes)
  const reviewNodes = gaps.slice(0, 10)

  const systemContext = await buildSystemContext(userId, supabase)
  const content = await generateBriefing(reviewNodes, systemContext)

  const nodesDueIds = content.reviewItems.map((r) => r.nodeId).filter(Boolean)

  const { data: briefing, error } = await supabase
    .from('daily_briefings')
    .insert({
      user_id: userId,
      date: today,
      nodes_due_for_review: nodesDueIds,
      challenge_questions: [content.challengeQuestion],
      recommendations: content.reviewItems,
      completed: false,
    })
    .select()
    .single()

  if (error) throw error
  return { briefing, reviewNodes: reviewNodes.slice(0, 3) }
}
