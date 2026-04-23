import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import type { KnowledgeNode, GraphEdge } from '@mastery-os/types'

const CONF_COLORS = ['#6b7280', '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6']
const DOMAIN_COLORS: Record<string, string> = {
  algorithms: '#8b5cf6',
  ml: '#06b6d4',
  deeplearning: '#f59e0b',
  systems: '#10b981',
  quant: '#ef4444',
  biology: '#ec4899',
}

function confColor(value: number): string {
  return CONF_COLORS[Math.max(0, Math.min(5, Math.round(value)))]
}

interface KnowledgeGraphProps {
  nodes: KnowledgeNode[]
  edges: GraphEdge[]
  selectedNodeId: string | null
  onNodeClick: (nodeId: string) => void
}

export function KnowledgeGraph({ nodes, edges, selectedNodeId, onNodeClick }: KnowledgeGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const width = svgRef.current.clientWidth || 800
    const height = svgRef.current.clientHeight || 600

    const g = svg.append('g')

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform.toString())
      })

    svg.call(zoom)

    const nodeMap = new Map(nodes.map((n) => [n.id, { ...n, x: 0, y: 0, vx: 0, vy: 0 }]))
    const simNodes = Array.from(nodeMap.values())
    const simLinks = edges
      .filter((e) => nodeMap.has(e.source) && nodeMap.has(e.target))
      .map((e) => ({ source: e.source, target: e.target, type: e.type }))

    const simulation = d3
      .forceSimulation(simNodes)
      .force('link', d3.forceLink(simLinks).id((d: d3.SimulationNodeDatum & { id: string }) => d.id).distance(60).strength(0.3))
      .force('charge', d3.forceManyBody().strength(-120))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide(14))

    const link = g.append('g')
      .selectAll('line')
      .data(simLinks)
      .join('line')
      .attr('stroke', '#374151')
      .attr('stroke-opacity', 0.4)
      .attr('stroke-width', 1)

    const nodeGroup = g.append('g')
      .selectAll('g')
      .data(simNodes)
      .join('g')
      .style('cursor', 'pointer')
      .on('click', (_event, d) => onNodeClick(d.id))
      .call(
        d3.drag<SVGGElement, typeof simNodes[0]>()
          .on('start', (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart()
            d.fx = d.x
            d.fy = d.y
          })
          .on('drag', (event, d) => {
            d.fx = event.x
            d.fy = event.y
          })
          .on('end', (event, d) => {
            if (!event.active) simulation.alphaTarget(0)
            d.fx = null
            d.fy = null
          })
      )

    nodeGroup.append('circle')
      .attr('r', (d) => d.id === selectedNodeId ? 11 : 8)
      .attr('fill', (d) => confColor(d.confidence))
      .attr('stroke', (d) => d.id === selectedNodeId ? '#ffffff' : (DOMAIN_COLORS[d.domain] ?? '#6b7280'))
      .attr('stroke-width', (d) => d.id === selectedNodeId ? 3 : 1.5)

    nodeGroup.append('title').text((d) => `${d.title}\n${d.domain} T${d.tier}\nConfidence: ${d.confidence.toFixed(1)}/5`)

    simulation.on('tick', () => {
      link
        .attr('x1', (d) => (d.source as d3.SimulationNodeDatum & { x: number }).x)
        .attr('y1', (d) => (d.source as d3.SimulationNodeDatum & { y: number }).y)
        .attr('x2', (d) => (d.target as d3.SimulationNodeDatum & { x: number }).x)
        .attr('y2', (d) => (d.target as d3.SimulationNodeDatum & { y: number }).y)

      nodeGroup.attr('transform', (d) => `translate(${d.x},${d.y})`)
    })

    return () => {
      simulation.stop()
    }
  }, [nodes, edges])

  useEffect(() => {
    if (!svgRef.current) return
    const svg = d3.select(svgRef.current)
    svg.selectAll('circle')
      .attr('r', function (d) {
        const node = d as KnowledgeNode & { id: string }
        return node.id === selectedNodeId ? 11 : 8
      })
      .attr('stroke', function (d) {
        const node = d as KnowledgeNode & { id: string }
        return node.id === selectedNodeId ? '#ffffff' : (DOMAIN_COLORS[node.domain] ?? '#6b7280')
      })
      .attr('stroke-width', function (d) {
        const node = d as KnowledgeNode & { id: string }
        return node.id === selectedNodeId ? 3 : 1.5
      })
  }, [selectedNodeId])

  return (
    <svg
      ref={svgRef}
      className="w-full h-full"
      style={{ background: 'transparent' }}
    />
  )
}
