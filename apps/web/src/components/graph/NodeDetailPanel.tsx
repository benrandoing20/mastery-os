import type { KnowledgeNode } from '@mastery-os/types'
import { Badge } from '../ui/Badge'
import { ConfidenceBar } from '../ui/ConfidenceBar'
import { Button } from '../ui/Button'
import { useDecay } from '../../hooks/useDecay'

interface NodeDetailPanelProps {
  node: KnowledgeNode | null
  allNodes: KnowledgeNode[]
  onClose: () => void
}

function NodeInfo({ node, allNodes }: { node: KnowledgeNode; allNodes: KnowledgeNode[] }) {
  const { percentRetained, daysSinceReview } = useDecay(node)
  const prereqNodes = allNodes.filter((n) => node.prerequisites.includes(n.id))
  const unlocksNodes = allNodes.filter((n) => node.unlocks.includes(n.id))

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <h2 className="text-base font-semibold text-white leading-tight">{node.title}</h2>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <Badge domain={node.domain} />
          <Badge label={`Tier ${node.tier}`} />
        </div>
        <ConfidenceBar value={node.confidence} />
      </div>

      <div className="text-xs text-gray-500 space-y-1">
        <div>
          Last reviewed:{' '}
          {node.lastReviewedAt ? new Date(node.lastReviewedAt).toLocaleDateString() : 'Never'}
        </div>
        <div>{daysSinceReview} days ago · {percentRetained}% retained</div>
        <div>Interview freq: {(node.interviewFrequency * 100).toFixed(0)}%</div>
      </div>

      {node.description && (
        <p className="text-sm text-gray-400 leading-relaxed">{node.description}</p>
      )}

      {prereqNodes.length > 0 && (
        <div>
          <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Prerequisites</div>
          <div className="space-y-1">
            {prereqNodes.map((n) => (
              <div key={n.id} className="flex items-center gap-2">
                <ConfidenceBar value={n.confidence} size="sm" className="flex-1" />
                <span className="text-xs text-gray-400 w-32 truncate">{n.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {unlocksNodes.length > 0 && (
        <div>
          <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Unlocks</div>
          <div className="space-y-1">
            {unlocksNodes.map((n) => (
              <div key={n.id} className="flex items-center gap-2">
                <ConfidenceBar value={n.confidence} size="sm" className="flex-1" />
                <span className="text-xs text-gray-400 w-32 truncate">{n.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {node.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {node.tags.map((tag) => (
            <Badge key={tag} label={tag} />
          ))}
        </div>
      )}
    </div>
  )
}

export function NodeDetailPanel({ node, allNodes, onClose }: NodeDetailPanelProps) {
  return (
    <div
      className={`
        fixed right-0 top-0 h-full w-72 bg-gray-900 border-l border-gray-800 z-30
        flex flex-col shadow-2xl transition-transform duration-200
        ${node ? 'translate-x-0' : 'translate-x-full'}
      `}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <span className="text-xs text-gray-500 uppercase tracking-wide">Node Detail</span>
        <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
      </div>
      {node ? (
        <NodeInfo node={node} allNodes={allNodes} />
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-600 text-sm">
          Select a node
        </div>
      )}
    </div>
  )
}
