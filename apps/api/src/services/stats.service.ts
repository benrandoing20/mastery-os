import type { SupabaseClient } from '@supabase/supabase-js'
import { applyDecayToNodes, getAllDomainCoverage } from '@mastery-os/knowledge-graph'
import { dbNodeToNode } from '../ai/context.js'
import type { Stats, TargetRole } from '@mastery-os/types'

export async function getStatsForUser(userId: string, supabase: SupabaseClient): Promise<Stats> {
  const [{ data: sessions }, { data: rawNodes }] = await Promise.all([
    supabase
      .from('study_sessions')
      .select('created_at, duration_minutes')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(365),
    supabase
      .from('knowledge_nodes')
      .select('*')
      .or(`user_id.eq.${userId},user_id.is.null`),
  ])

  const nodes = applyDecayToNodes((rawNodes || []).map((r) => dbNodeToNode(r as Record<string, unknown>)))
  const domainCoverage = getAllDomainCoverage(nodes)

  const sessionDateStrings = [...new Set(
    (sessions || []).map((s) => new Date(s.created_at as string).toDateString())
  )]

  let streak = 0
  let bestStreak = 0
  let current = 0
  const today = new Date()

  for (let i = 0; i < sessionDateStrings.length; i++) {
    const expected = new Date(today)
    expected.setDate(today.getDate() - i)
    if (sessionDateStrings[i] === expected.toDateString()) {
      current++
      streak = current
    } else {
      bestStreak = Math.max(bestStreak, current)
      current = 0
    }
  }
  bestStreak = Math.max(bestStreak, streak)

  const totalMinutes = (sessions || []).reduce((sum, s) => sum + ((s.duration_minutes as number) || 0), 0)

  const roleWeights: Record<TargetRole, string[]> = {
    quant_research: ['algorithms', 'ml', 'quant'],
    ai_lab: ['deeplearning', 'ml', 'systems'],
    clinical_ai: ['ml', 'biology', 'systems'],
    general: ['algorithms', 'ml', 'deeplearning', 'systems'],
  }

  const interviewReadiness = {} as Record<TargetRole, number>
  for (const [role, domains] of Object.entries(roleWeights) as [TargetRole, string[]][]) {
    const relevant = nodes.filter((n) => domains.includes(n.domain))
    if (relevant.length === 0) { interviewReadiness[role] = 0; continue }
    const weighted = relevant.reduce((sum, n) => sum + (n.confidence / 5) * n.interviewFrequency, 0)
    const maxWeighted = relevant.reduce((sum, n) => sum + n.interviewFrequency, 0)
    interviewReadiness[role] = Math.round((weighted / maxWeighted) * 100)
  }

  return {
    streak,
    bestStreak,
    totalSessions: (sessions || []).length,
    totalMinutes,
    domainCoverage,
    interviewReadiness,
  }
}
