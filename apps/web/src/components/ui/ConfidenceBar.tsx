import { clsx } from 'clsx'

const CONF_COLORS = ['#6b7280', '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6']

function getConfColor(value: number): string {
  const idx = Math.max(0, Math.min(5, Math.round(value)))
  return CONF_COLORS[idx]
}

interface ConfidenceBarProps {
  value: number
  size?: 'sm' | 'md'
  showLabel?: boolean
  className?: string
}

export function ConfidenceBar({ value, size = 'md', showLabel = true, className }: ConfidenceBarProps) {
  const clamped = Math.max(0, Math.min(5, value))
  const pct = (clamped / 5) * 100
  const color = getConfColor(clamped)

  return (
    <div className={clsx('flex items-center gap-2', className)}>
      <div
        className={clsx(
          'flex-1 bg-gray-800 rounded-full overflow-hidden',
          size === 'sm' ? 'h-1.5' : 'h-2'
        )}
      >
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-mono w-6 text-right" style={{ color }}>
          {clamped.toFixed(1)}
        </span>
      )}
    </div>
  )
}
