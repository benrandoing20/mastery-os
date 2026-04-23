import type { SupabaseClient } from '@supabase/supabase-js'
import { applyDecayToNodes, prioritizeGaps } from '@mastery-os/knowledge-graph'
import type { KnowledgeNode } from '@mastery-os/types'

export function dbNodeToNode(row: Record<string, unknown>): KnowledgeNode {
  return {
    id: row.id as string,
    userId: row.user_id as string | null,
    domain: row.domain as KnowledgeNode['domain'],
    tier: row.tier as KnowledgeNode['tier'],
    title: row.title as string,
    description: row.description as string,
    confidence: row.confidence as number,
    lastReviewedAt: row.last_reviewed_at as string | null,
    interviewFrequency: row.interview_frequency as number,
    prerequisites: (row.prerequisites as string[]) || [],
    unlocks: (row.unlocks as string[]) || [],
    tags: (row.tags as string[]) || [],
    isSeeded: row.is_seeded as boolean,
    createdAt: row.created_at as string,
  }
}

function computeStreak(timestamps: string[]): number {
  if (timestamps.length === 0) return 0
  const days = [...new Set(timestamps.map((t) => new Date(t).toDateString()))]
  let streak = 0
  const today = new Date()
  for (let i = 0; i < days.length; i++) {
    const expected = new Date(today)
    expected.setDate(today.getDate() - i)
    if (days[i] === expected.toDateString()) streak++
    else break
  }
  return streak
}

export async function buildSystemContext(userId: string, supabase: SupabaseClient): Promise<string> {
  const [{ data: rawNodes }, { data: sessions }, { data: sessionDates }] = await Promise.all([
    supabase
      .from('knowledge_nodes')
      .select('*')
      .or(`user_id.eq.${userId},user_id.is.null`)
      .limit(200),
    supabase
      .from('study_sessions')
      .select('raw_text, session_type, created_at, duration_minutes')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('study_sessions')
      .select('created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(60),
  ])

  const nodes: KnowledgeNode[] = (rawNodes || []).map(dbNodeToNode)
  const decayed = applyDecayToNodes(nodes)
  const gaps = prioritizeGaps(decayed)
  const top20 = [...decayed].sort((a, b) => b.interviewFrequency - a.interviewFrequency).slice(0, 20)
  const bottom10 = gaps.slice(0, 10)
  const streak = computeStreak((sessionDates || []).map((s) => s.created_at as string))

  return `ROLE: You are a brutally honest technical intelligence coach. Push the user toward world-class technical depth. Do not flatter. Identify gaps. Demand precision.

CURRENT STREAK: ${streak} days

TOP PRIORITY NODES (by interview frequency):
${top20.map((n) => `- ${n.title} (${n.domain}, confidence: ${n.confidence.toFixed(1)}/5, last reviewed: ${n.lastReviewedAt ? new Date(n.lastReviewedAt).toLocaleDateString() : 'never'})`).join('\n')}

BIGGEST GAPS (by priority score = interview_frequency × (1 - confidence/5)):
${bottom10.map((n, i) => `${i + 1}. ${n.title} (${n.domain}, confidence: ${n.confidence.toFixed(1)}/5)`).join('\n')}

RECENT STUDY SESSIONS:
${(sessions || []).map((s) => `- [${s.session_type}] ${new Date(s.created_at as string).toLocaleDateString()}: ${(s.raw_text as string).slice(0, 150)}...`).join('\n')}`
}
