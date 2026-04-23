import type { Domain } from '@mastery-os/types'
import { DOMAIN_LABELS, DOMAINS } from '@mastery-os/types'

const DOMAIN_BG: Record<Domain, string> = {
  algorithms: 'bg-purple-900/30',
  ml: 'bg-cyan-900/30',
  deeplearning: 'bg-amber-900/30',
  systems: 'bg-emerald-900/30',
  quant: 'bg-red-900/30',
  biology: 'bg-pink-900/30',
}

const DOMAIN_BAR: Record<Domain, string> = {
  algorithms: 'bg-purple-500',
  ml: 'bg-cyan-500',
  deeplearning: 'bg-amber-500',
  systems: 'bg-emerald-500',
  quant: 'bg-red-500',
  biology: 'bg-pink-500',
}

interface DomainCoverageChartProps {
  coverage: Record<Domain, number>
}

export function DomainCoverageChart({ coverage }: DomainCoverageChartProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {DOMAINS.map((domain) => {
        const pct = Math.round((coverage[domain] ?? 0) * 100)
        return (
          <div key={domain} className={`rounded-lg p-3 ${DOMAIN_BG[domain]}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-300">{DOMAIN_LABELS[domain]}</span>
              <span className="text-sm font-bold text-white">{pct}%</span>
            </div>
            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${DOMAIN_BAR[domain]}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
