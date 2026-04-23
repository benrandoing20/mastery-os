import type { KnowledgeNode } from '@mastery-os/types'
import { Badge } from '../ui/Badge'
import { ConfidenceBar } from '../ui/ConfidenceBar'

interface GapListProps {
  gaps: (KnowledgeNode & { gapScore: number })[]
  onSelectNode: (id: string) => void
  maxItems?: number
}

export function GapList({ gaps, onSelectNode, maxItems }: GapListProps) {
  const items = maxItems ? gaps.slice(0, maxItems) : gaps

  if (items.length === 0) {
    return (
      <div className="text-sm text-gray-600 text-center py-8">
        No gaps found — either your graph is empty or everything is strong.
      </div>
    )
  }

  return (
    <div className="space-y-1">
      {items.map((node, i) => (
        <button
          key={node.id}
          onClick={() => onSelectNode(node.id)}
          className="w-full text-left px-3 py-2 rounded hover:bg-gray-800 transition-colors group"
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-gray-600 w-4">{i + 1}</span>
            <span className="text-sm text-gray-200 group-hover:text-white flex-1 leading-tight">
              {node.title}
            </span>
            <Badge domain={node.domain} />
          </div>
          <div className="pl-6">
            <ConfidenceBar value={node.confidence} size="sm" />
          </div>
        </button>
      ))}
    </div>
  )
}
