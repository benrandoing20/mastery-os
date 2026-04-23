import { useMemo } from 'react'
import { useGraphStore } from '../stores/graphStore'
import { prioritizeGaps, getFrontierNodes, getAllDomainCoverage } from '@mastery-os/knowledge-graph'

export function useGraph() {
  const { nodes, edges, domainFilter } = useGraphStore()

  const filteredNodes = useMemo(
    () => (domainFilter ? nodes.filter((n) => n.domain === domainFilter) : nodes),
    [nodes, domainFilter]
  )

  const gapNodes = useMemo(() => prioritizeGaps(filteredNodes).slice(0, 20), [filteredNodes])
  const frontierNodes = useMemo(() => getFrontierNodes(nodes), [nodes])
  const domainCoverage = useMemo(() => getAllDomainCoverage(nodes), [nodes])

  return { nodes: filteredNodes, allNodes: nodes, edges, gapNodes, frontierNodes, domainCoverage }
}
