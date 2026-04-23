import { useEffect, useState } from 'react'
import { BriefingCard } from '../components/briefing/BriefingCard'
import { DomainCoverageChart } from '../components/stats/DomainCoverageChart'
import { StreakDisplay } from '../components/stats/StreakDisplay'
import { GapList } from '../components/graph/GapList'
import { Spinner } from '../components/ui/Spinner'
import { useStatsStore } from '../stores/statsStore'
import { useGraphStore } from '../stores/graphStore'
import { useGraph } from '../hooks/useGraph'
import { apiGet } from '../lib/api'
import type { DailyBriefing, KnowledgeNode } from '@mastery-os/types'

interface BriefingData {
  briefing: DailyBriefing
  reviewNodes: KnowledgeNode[]
}

export function DashboardPage() {
  const { fetchStats, stats, loading: statsLoading } = useStatsStore()
  const { fetchGraph } = useGraphStore()
  const { gapNodes } = useGraph()
  const [briefingData, setBriefingData] = useState<BriefingData | null>(null)
  const [briefingLoading, setBriefingLoading] = useState(true)

  useEffect(() => {
    fetchStats()
    fetchGraph()
    apiGet<BriefingData>('/api/briefing/today')
      .then(setBriefingData)
      .catch(console.error)
      .finally(() => setBriefingLoading(false))
  }, [fetchStats, fetchGraph])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">
          {getGreeting()}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {briefingLoading ? (
        <div className="flex justify-center py-8"><Spinner /></div>
      ) : briefingData ? (
        <BriefingCard
          briefing={briefingData.briefing}
          reviewNodes={briefingData.reviewNodes}
          onComplete={() => {
            apiGet<BriefingData>('/api/briefing/today').then(setBriefingData)
          }}
        />
      ) : null}

      {statsLoading && !stats ? (
        <div className="flex justify-center py-8"><Spinner /></div>
      ) : stats ? (
        <>
          <StreakDisplay
            streak={stats.streak}
            bestStreak={stats.bestStreak}
            totalSessions={stats.totalSessions}
            totalMinutes={stats.totalMinutes}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-3">Domain Coverage</div>
              <DomainCoverageChart coverage={stats.domainCoverage} />
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-3">Top Gaps</div>
              <GapList gaps={gapNodes} onSelectNode={() => {}} maxItems={5} />
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning.'
  if (hour < 17) return 'Good afternoon.'
  return 'Good evening.'
}
