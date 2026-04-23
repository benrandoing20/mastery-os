import type { DailyBriefing, KnowledgeNode } from '@mastery-os/types'
import { ConfidenceBar } from '../ui/ConfidenceBar'
import { Button } from '../ui/Button'
import { apiPatch } from '../../lib/api'

interface BriefingCardProps {
  briefing: DailyBriefing
  reviewNodes: KnowledgeNode[]
  onComplete?: () => void
}

export function BriefingCard({ briefing, reviewNodes, onComplete }: BriefingCardProps) {
  const date = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  const handleComplete = async () => {
    await apiPatch(`/api/briefing/${briefing.id}/complete`, {})
    onComplete?.()
  }

  const challengeQ = briefing.challengeQuestions?.[0]

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-800 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500 uppercase tracking-wide">{date}</div>
          <div className="text-base font-semibold text-white mt-0.5">Today's Briefing</div>
        </div>
        {!briefing.completed && (
          <Button variant="secondary" size="sm" onClick={handleComplete}>
            Mark done
          </Button>
        )}
        {briefing.completed && (
          <span className="text-xs text-green-500">✓ Complete</span>
        )}
      </div>

      {reviewNodes.length > 0 && (
        <div>
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">Review These</div>
          <div className="space-y-2">
            {reviewNodes.slice(0, 3).map((node) => {
              const rec = (briefing.recommendations as { nodeId: string; reason: string }[])?.find(
                (r) => r.nodeId === node.id
              )
              return (
                <div key={node.id} className="flex items-start gap-3 p-2 bg-gray-800 rounded">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white">{node.title}</div>
                    {rec?.reason && (
                      <div className="text-xs text-gray-500 mt-0.5">{rec.reason}</div>
                    )}
                    <ConfidenceBar value={node.confidence} size="sm" className="mt-1" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {challengeQ && (
        <div className="p-3 border border-blue-800/50 bg-blue-950/20 rounded-lg">
          <div className="text-xs text-blue-500 uppercase tracking-wide mb-1">Today's Challenge</div>
          <p className="text-sm text-blue-200">{challengeQ.question}</p>
        </div>
      )}
    </div>
  )
}
