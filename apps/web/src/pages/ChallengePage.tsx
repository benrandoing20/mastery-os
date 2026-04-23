import { useEffect, useState } from 'react'
import { useGraphStore } from '../stores/graphStore'
import { useChallengeStore } from '../stores/challengeStore'
import { QuestionCard } from '../components/challenge/QuestionCard'
import { ScoreCard } from '../components/challenge/ScoreCard'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Spinner } from '../components/ui/Spinner'
import type { KnowledgeNode, QuestionTier } from '@mastery-os/types'
import { QUESTION_TIER_LABELS } from '@mastery-os/types'

export function ChallengePage() {
  const { nodes, fetchGraph } = useGraphStore()
  const { activeChallenge, lastResult, loading, fetchChallenge, submitAnswer, clearChallenge, fetchHistory, history } = useChallengeStore()
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null)
  const [tier, setTier] = useState<QuestionTier>(2)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (nodes.length === 0) fetchGraph()
    fetchHistory()
  }, [fetchGraph, fetchHistory, nodes.length])

  const filteredNodes = searchQuery
    ? nodes.filter((n) =>
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.domain.includes(searchQuery.toLowerCase())
      ).slice(0, 8)
    : nodes.slice(0, 8)

  const handleGenerate = async () => {
    if (!selectedNode) return
    await fetchChallenge(selectedNode.id, tier)
  }

  const handleAnswer = async (answer: string) => {
    await submitAnswer(answer)
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Challenge</h1>
        {(activeChallenge || lastResult) && (
          <Button variant="ghost" size="sm" onClick={clearChallenge}>New challenge</Button>
        )}
      </div>

      {!activeChallenge && !lastResult && (
        <div className="space-y-4">
          {/* Node selector */}
          <div>
            <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Select a concept</div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search concepts..."
              className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-blue-500 mb-2"
            />
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {filteredNodes.map((node) => (
                <button
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`w-full text-left px-3 py-2 rounded text-sm flex items-center gap-2 transition-colors ${
                    selectedNode?.id === node.id
                      ? 'bg-blue-900/40 text-blue-300 border border-blue-700'
                      : 'bg-gray-900 text-gray-300 hover:bg-gray-800 border border-gray-800'
                  }`}
                >
                  <Badge domain={node.domain} />
                  <span>{node.title}</span>
                  <span className="ml-auto text-xs text-gray-500">{node.confidence.toFixed(1)}/5</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tier selector */}
          <div>
            <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Question tier</div>
            <div className="flex gap-2">
              {([1, 2, 3, 4, 5] as QuestionTier[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTier(t)}
                  className={`flex-1 py-2 rounded text-xs border transition-colors ${
                    tier === t
                      ? 'bg-blue-900/60 text-blue-300 border-blue-600'
                      : 'bg-gray-900 text-gray-500 border-gray-700 hover:text-gray-300'
                  }`}
                >
                  <div className="font-bold">T{t}</div>
                  <div>{QUESTION_TIER_LABELS[t]}</div>
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={!selectedNode || loading}
            className="w-full"
            size="lg"
          >
            {loading ? <><Spinner size="sm" />Generating...</> : 'Generate Question'}
          </Button>
        </div>
      )}

      {activeChallenge && (
        <QuestionCard
          question={activeChallenge.question}
          tier={activeChallenge.tier}
          nodeTitle={activeChallenge.nodeTitle}
          onSubmit={handleAnswer}
          isLoading={loading}
        />
      )}

      {lastResult && (
        <ScoreCard
          score={lastResult}
          feedback={lastResult.feedback}
          confidenceDelta={lastResult.confidenceDelta}
        />
      )}

      {history.length > 0 && !activeChallenge && (
        <div>
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-3">Recent Challenges</div>
          <div className="space-y-2">
            {(history as Array<{ id: string; domain: string; score: { accuracy: number; depth: number; seniorThinking: number; communication: number }; created_at: string }>).slice(0, 5).map((h) => {
              const avg = (h.score.accuracy + h.score.depth + h.score.seniorThinking + h.score.communication) / 4
              return (
                <div key={h.id} className="flex items-center gap-3 px-3 py-2 bg-gray-900 rounded border border-gray-800 text-sm">
                  <Badge domain={h.domain as Parameters<typeof Badge>[0]['domain']} />
                  <span className="flex-1 text-gray-500">{new Date(h.created_at).toLocaleDateString()}</span>
                  <span className="text-white font-mono">{avg.toFixed(1)}/5</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
