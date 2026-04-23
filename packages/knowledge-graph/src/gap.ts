import type { KnowledgeNode } from '@mastery-os/types'
import type { Domain } from '@mastery-os/types'

export function computeGapScore(node: KnowledgeNode): number {
  return node.interviewFrequency * (1 - node.confidence / 5)
}

export function prioritizeGaps(nodes: KnowledgeNode[]): (KnowledgeNode & { gapScore: number })[] {
  return nodes
    .map((n) => ({ ...n, gapScore: computeGapScore(n) }))
    .sort((a, b) => b.gapScore - a.gapScore)
}

export function getDomainCoverage(nodes: KnowledgeNode[], domain: Domain): number {
  const domainNodes = nodes.filter((n) => n.domain === domain)
  if (domainNodes.length === 0) return 0
  const avg = domainNodes.reduce((sum, n) => sum + n.confidence, 0) / domainNodes.length
  return avg / 5
}

export function getAllDomainCoverage(nodes: KnowledgeNode[]): Record<Domain, number> {
  const domains: Domain[] = ['algorithms', 'ml', 'deeplearning', 'systems', 'quant', 'biology']
  return Object.fromEntries(
    domains.map((d) => [d, getDomainCoverage(nodes, d)])
  ) as Record<Domain, number>
}

export function getFrontierNodes(nodes: KnowledgeNode[]): KnowledgeNode[] {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]))
  return nodes.filter((node) => {
    if (node.confidence < 3) return false
    return node.unlocks.some((id) => {
      const target = nodeMap.get(id)
      return target && target.confidence < 2
    })
  })
}
