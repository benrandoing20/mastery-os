import type { KnowledgeNode, GraphEdge } from '@mastery-os/types'

export function buildGraphEdges(nodes: KnowledgeNode[]): GraphEdge[] {
  const edges: GraphEdge[] = []
  const seen = new Set<string>()
  for (const node of nodes) {
    for (const prereqId of node.prerequisites) {
      const key = `${prereqId}->${node.id}`
      if (!seen.has(key)) {
        edges.push({ source: prereqId, target: node.id, type: 'prerequisite' })
        seen.add(key)
      }
    }
    for (const unlockId of node.unlocks) {
      const key = `${node.id}->${unlockId}`
      if (!seen.has(key)) {
        edges.push({ source: node.id, target: unlockId, type: 'unlocks' })
        seen.add(key)
      }
    }
  }
  return edges
}

export function getNodeById(nodes: KnowledgeNode[], id: string): KnowledgeNode | undefined {
  return nodes.find((n) => n.id === id)
}

export function getPrerequisiteChain(
  nodes: KnowledgeNode[],
  nodeId: string,
  visited = new Set<string>()
): KnowledgeNode[] {
  if (visited.has(nodeId)) return []
  visited.add(nodeId)
  const node = getNodeById(nodes, nodeId)
  if (!node) return []
  const prereqs = node.prerequisites.flatMap((id) => getPrerequisiteChain(nodes, id, visited))
  return [...prereqs, node]
}
