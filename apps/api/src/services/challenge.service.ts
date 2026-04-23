import type { SupabaseClient } from '@supabase/supabase-js'
import { buildSystemContext, dbNodeToNode } from '../ai/context.js'
import { generateChallenge } from '../ai/challenge.js'
import { scoreAnswer } from '../ai/score.js'
import { updateNodeConfidence } from './graph.service.js'
import type { QuestionTier } from '@mastery-os/types'

export async function createChallenge(
  userId: string,
  nodeId: string,
  tier: QuestionTier,
  supabase: SupabaseClient
) {
  const { data: rawNode, error } = await supabase
    .from('knowledge_nodes')
    .select('*')
    .eq('id', nodeId)
    .single()

  if (error || !rawNode) throw new Error('Node not found')

  const node = dbNodeToNode(rawNode as Record<string, unknown>)
  const systemContext = await buildSystemContext(userId, supabase)
  const challenge = await generateChallenge(node, tier, systemContext)

  return { ...challenge, nodeId, nodeTitle: node.title, tier }
}

export async function submitAnswer(
  userId: string,
  question: string,
  answer: string,
  nodeId: string,
  tier: QuestionTier,
  supabase: SupabaseClient
) {
  const { data: rawNode, error } = await supabase
    .from('knowledge_nodes')
    .select('*')
    .eq('id', nodeId)
    .single()

  if (error || !rawNode) throw new Error('Node not found')

  const node = dbNodeToNode(rawNode as Record<string, unknown>)
  const systemContext = await buildSystemContext(userId, supabase)
  const result = await scoreAnswer(question, answer, node, systemContext)

  const newConfidence = Math.max(0, Math.min(5, node.confidence + result.confidenceDelta))
  await updateNodeConfidence(nodeId, userId, newConfidence, null, supabase)

  await supabase.from('challenge_sessions').insert({
    user_id: userId,
    challenge_type: 'quiz',
    target_role: 'general',
    domain: node.domain,
    messages: [
      { role: 'assistant', content: question },
      { role: 'user', content: answer },
    ],
    score: {
      accuracy: result.accuracy,
      depth: result.depth,
      seniorThinking: result.seniorThinking,
      communication: result.communication,
    },
    gaps_identified: [],
    nodes_tested: [nodeId],
  })

  return result
}

export async function getChallengeHistory(userId: string, supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from('challenge_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) throw error
  return data || []
}
