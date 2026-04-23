import { useMemo } from 'react'
import { decayConfidence, getDaysSince } from '@mastery-os/knowledge-graph'
import type { KnowledgeNode } from '@mastery-os/types'

export function useDecay(node: KnowledgeNode) {
  return useMemo(() => {
    const days = getDaysSince(node.lastReviewedAt)
    const current = decayConfidence(node.confidence, days)
    const retained = node.confidence > 0 ? (current / node.confidence) * 100 : 0
    return {
      currentConfidence: current,
      percentRetained: Math.round(retained),
      daysSinceReview: Math.round(days),
    }
  }, [node.confidence, node.lastReviewedAt])
}
