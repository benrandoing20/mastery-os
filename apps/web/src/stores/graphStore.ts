import { create } from 'zustand'
import { apiGet, apiPatch } from '../lib/api'
import { applyDecayToNodes, buildGraphEdges } from '@mastery-os/knowledge-graph'
import type { KnowledgeNode, GraphEdge, Domain } from '@mastery-os/types'

interface GraphStore {
  nodes: KnowledgeNode[]
  edges: GraphEdge[]
  selectedNodeId: string | null
  domainFilter: Domain | null
  loading: boolean
  error: string | null
  fetchGraph: () => Promise<void>
  selectNode: (id: string | null) => void
  setDomainFilter: (domain: Domain | null) => void
  updateNodeConfidence: (nodeId: string, confidence: number) => Promise<void>
}

export const useGraphStore = create<GraphStore>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  domainFilter: null,
  loading: false,
  error: null,
  fetchGraph: async () => {
    set({ loading: true, error: null })
    try {
      const data = await apiGet<{ nodes: KnowledgeNode[]; edges: GraphEdge[] }>('/api/graph')
      const decayed = applyDecayToNodes(data.nodes)
      const edges = buildGraphEdges(decayed)
      set({ nodes: decayed, edges, loading: false })
    } catch (err) {
      set({ loading: false, error: String(err) })
    }
  },
  selectNode: (id) => set({ selectedNodeId: id }),
  setDomainFilter: (domain) => set({ domainFilter: domain }),
  updateNodeConfidence: async (nodeId, confidence) => {
    await apiPatch(`/api/graph/nodes/${nodeId}`, { confidence })
    await get().fetchGraph()
  },
}))
