import type { SupabaseClient } from '@supabase/supabase-js'
import { buildSystemContext } from '../ai/context.js'
import { extractConcepts } from '../ai/extract.js'
import { updateNodeConfidence } from './graph.service.js'
import type { SessionType } from '@mastery-os/types'

export async function createSessionWithExtraction(
  userId: string,
  rawText: string,
  durationMinutes: number,
  sessionType: SessionType,
  supabase: SupabaseClient
) {
  const systemContext = await buildSystemContext(userId, supabase)
  const extraction = await extractConcepts(rawText, systemContext)

  const { data: session, error } = await supabase
    .from('study_sessions')
    .insert({
      user_id: userId,
      raw_text: rawText,
      extracted_concepts: extraction.concepts,
      duration_minutes: durationMinutes,
      session_type: sessionType,
      linked_node_ids: [],
      ai_analysis: {
        gapIdentified: extraction.gapIdentified,
        targetedQuestion: extraction.targetedQuestion,
        nextResource: extraction.nextResource,
      },
    })
    .select()
    .single()

  if (error) throw error

  const { data: allNodes } = await supabase
    .from('knowledge_nodes')
    .select('id, title, domain')
    .or(`user_id.eq.${userId},user_id.is.null`)

  const linkedNodeIds: string[] = []

  for (const concept of extraction.concepts) {
    const match = (allNodes || []).find(
      (n) =>
        (n.title as string).toLowerCase() === concept.title.toLowerCase() ||
        (n.title as string).toLowerCase().includes(concept.title.toLowerCase())
    )
    if (match) {
      linkedNodeIds.push(match.id as string)
      await updateNodeConfidence(match.id as string, userId, concept.confidence, session.id as string, supabase)
    }
  }

  if (linkedNodeIds.length > 0) {
    await supabase
      .from('study_sessions')
      .update({ linked_node_ids: linkedNodeIds })
      .eq('id', session.id)
  }

  return { session, extraction }
}

export async function getSessionsForUser(
  userId: string,
  limit: number,
  offset: number,
  supabase: SupabaseClient
) {
  const { data, error, count } = await supabase
    .from('study_sessions')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw error
  return { sessions: data || [], total: count ?? 0 }
}

export async function searchSessions(userId: string, query: string, supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from('study_sessions')
    .select('*')
    .eq('user_id', userId)
    .textSearch('search_vector', query, { type: 'websearch' })
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) throw error
  return data || []
}

export async function deleteSession(sessionId: string, userId: string, supabase: SupabaseClient) {
  const { error } = await supabase
    .from('study_sessions')
    .delete()
    .eq('id', sessionId)
    .eq('user_id', userId)
  if (error) throw error
}
