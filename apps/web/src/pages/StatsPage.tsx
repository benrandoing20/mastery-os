import { useEffect } from 'react'
import { useStatsStore } from '../stores/statsStore'
import { StreakDisplay } from '../components/stats/StreakDisplay'
import { DomainCoverageChart } from '../components/stats/DomainCoverageChart'
import { Spinner } from '../components/ui/Spinner'
import type { TargetRole } from '@mastery-os/types'

const ROLE_LABELS: Record<TargetRole, string> = {
  quant_research: 'Quant Research',
  ai_lab: 'AI Lab',
  clinical_ai: 'Clinical AI',
  general: 'General ML',
}

const ROLE_SUBTITLES: Record<TargetRole, string> = {
  quant_research: 'Two Sigma, Citadel, HRT',
  ai_lab: 'Anthropic, OpenAI, DeepMind',
  clinical_ai: 'Health AI, Biotech',
  general: 'Applied ML roles',
}

export function StatsPage() {
  const { stats, loading, fetchStats } = useStatsStore()

  useEffect(() => { fetchStats() }, [fetchStats])

  if (loading && !stats) {
    return <div className="flex justify-center py-12"><Spinner size="lg" /></div>
  }

  if (!stats) {
    return <div className="text-gray-600 text-center py-12">No stats available yet.</div>
  }

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-bold text-white">Stats</h1>

      <StreakDisplay
        streak={stats.streak}
        bestStreak={stats.bestStreak}
        totalSessions={stats.totalSessions}
        totalMinutes={stats.totalMinutes}
      />

      <div>
        <div className="text-xs text-gray-500 uppercase tracking-wide mb-3">Domain Coverage</div>
        <DomainCoverageChart coverage={stats.domainCoverage} />
      </div>

      <div>
        <div className="text-xs text-gray-500 uppercase tracking-wide mb-3">Interview Readiness</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(Object.keys(ROLE_LABELS) as TargetRole[]).map((role) => {
            const score = stats.interviewReadiness[role] ?? 0
            const color =
              score >= 70 ? '#22c55e' : score >= 40 ? '#f59e0b' : '#ef4444'
            return (
              <div key={role} className="bg-gray-900 rounded-lg border border-gray-800 p-4">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <div className="text-sm font-medium text-white">{ROLE_LABELS[role]}</div>
                    <div className="text-xs text-gray-600">{ROLE_SUBTITLES[role]}</div>
                  </div>
                  <div className="text-2xl font-bold" style={{ color }}>
                    {score}
                  </div>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${score}%`, backgroundColor: color }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
