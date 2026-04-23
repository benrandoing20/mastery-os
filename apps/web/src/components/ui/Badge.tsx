import { clsx } from 'clsx'
import type { Domain } from '@mastery-os/types'

const DOMAIN_COLORS: Record<Domain, string> = {
  algorithms: 'bg-purple-900/50 text-purple-300 border-purple-700',
  ml: 'bg-cyan-900/50 text-cyan-300 border-cyan-700',
  deeplearning: 'bg-amber-900/50 text-amber-300 border-amber-700',
  systems: 'bg-emerald-900/50 text-emerald-300 border-emerald-700',
  quant: 'bg-red-900/50 text-red-300 border-red-700',
  biology: 'bg-pink-900/50 text-pink-300 border-pink-700',
}

const DOMAIN_LABELS: Record<Domain, string> = {
  algorithms: 'Algorithms',
  ml: 'ML',
  deeplearning: 'Deep Learning',
  systems: 'Systems',
  quant: 'Quant',
  biology: 'Biology',
}

interface BadgeProps {
  domain?: Domain
  label?: string
  className?: string
}

export function Badge({ domain, label, className }: BadgeProps) {
  if (domain) {
    return (
      <span
        className={clsx(
          'inline-flex items-center px-2 py-0.5 rounded text-xs border',
          DOMAIN_COLORS[domain],
          className
        )}
      >
        {DOMAIN_LABELS[domain]}
      </span>
    )
  }
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2 py-0.5 rounded text-xs border border-gray-700 bg-gray-800 text-gray-300',
        className
      )}
    >
      {label}
    </span>
  )
}
