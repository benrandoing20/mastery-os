import { useEffect } from 'react'
import { useGraphStore } from '../stores/graphStore'
import { KnowledgeGraph } from '../components/graph/KnowledgeGraph'
import { NodeDetailPanel } from '../components/graph/NodeDetailPanel'
import { DomainFilter } from '../components/graph/DomainFilter'
import { GapList } from '../components/graph/GapList'
import { Spinner } from '../components/ui/Spinner'
import { useGraph } from '../hooks/useGraph'
import type { Domain } from '@mastery-os/types'

export function GraphPage() {
  const { fetchGraph, selectNode, setDomainFilter, selectedNodeId, domainFilter, loading } = useGraphStore()
  const { nodes, allNodes, edges, gapNodes } = useGraph()

  useEffect(() => { fetchGraph() }, [fetchGraph])

  const selectedNode = allNodes.find((n) => n.id === selectedNodeId) ?? null

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] -mx-4 -my-6">
      {/* Top: Domain filter */}
      <div className="px-4 py-3 border-b border-gray-800 bg-gray-950">
        <DomainFilter
          selected={domainFilter}
          onSelect={(d) => setDomainFilter(d as Domain | null)}
        />
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Gap list */}
        <div className="w-56 border-r border-gray-800 flex flex-col overflow-hidden">
          <div className="px-3 py-2 border-b border-gray-800">
            <span className="text-xs text-gray-500 uppercase tracking-wide">Top Gaps</span>
          </div>
          <div className="flex-1 overflow-y-auto py-1">
            <GapList
              gaps={gapNodes}
              onSelectNode={selectNode}
            />
          </div>
        </div>

        {/* Center: Graph */}
        <div className="flex-1 relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-950/80 z-10">
              <Spinner size="lg" />
            </div>
          )}
          {nodes.length > 0 ? (
            <KnowledgeGraph
              nodes={nodes}
              edges={edges}
              selectedNodeId={selectedNodeId}
              onNodeClick={selectNode}
            />
          ) : !loading ? (
            <div className="flex items-center justify-center h-full text-gray-600 text-sm">
              No nodes. Run the seed script to populate the knowledge graph.
            </div>
          ) : null}
        </div>
      </div>

      {/* Right: Node detail panel */}
      <NodeDetailPanel
        node={selectedNode}
        allNodes={allNodes}
        onClose={() => selectNode(null)}
      />
    </div>
  )
}
