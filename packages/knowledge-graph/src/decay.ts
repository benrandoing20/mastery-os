import type { KnowledgeNode } from '@mastery-os/types'

const LAMBDA = 0.05

export function decayConfidence(original: number, daysSinceReview: number): number {
  return original * Math.exp(-LAMBDA * daysSinceReview)
}

export function getDaysSince(dateString: string | null): number {
  if (!dateString) return 30
  const diff = Date.now() - new Date(dateString).getTime()
  return Math.max(0, diff / (1000 * 60 * 60 * 24))
}

export function applyDecayToNodes(nodes: KnowledgeNode[]): KnowledgeNode[] {
  return nodes.map((node) => ({
    ...node,
    confidence: decayConfidence(node.confidence, getDaysSince(node.lastReviewedAt)),
  }))
}
