import { clsx } from 'clsx'
import type { Domain } from '@mastery-os/types'
import { DOMAIN_LABELS, DOMAINS } from '@mastery-os/types'

const DOMAIN_ACTIVE: Record<Domain, string> = {
  algorithms: 'bg-purple-900/60 text-purple-300 border-purple-600',
  ml: 'bg-cyan-900/60 text-cyan-300 border-cyan-600',
  deeplearning: 'bg-amber-900/60 text-amber-300 border-amber-600',
  systems: 'bg-emerald-900/60 text-emerald-300 border-emerald-600',
  quant: 'bg-red-900/60 text-red-300 border-red-600',
  biology: 'bg-pink-900/60 text-pink-300 border-pink-600',
}

interface DomainFilterProps {
  selected: Domain | null
  onSelect: (d: Domain | null) => void
}

export function DomainFilter({ selected, onSelect }: DomainFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect(null)}
        className={clsx(
          'px-3 py-1 rounded text-xs border transition-colors',
          selected === null
            ? 'bg-blue-900/60 text-blue-300 border-blue-600'
            : 'bg-gray-800 text-gray-400 border-gray-700 hover:text-gray-200'
        )}
      >
        All
      </button>
      {DOMAINS.map((domain) => (
        <button
          key={domain}
          onClick={() => onSelect(domain === selected ? null : domain)}
          className={clsx(
            'px-3 py-1 rounded text-xs border transition-colors',
            selected === domain
              ? DOMAIN_ACTIVE[domain]
              : 'bg-gray-800 text-gray-400 border-gray-700 hover:text-gray-200'
          )}
        >
          {DOMAIN_LABELS[domain]}
        </button>
      ))}
    </div>
  )
}
