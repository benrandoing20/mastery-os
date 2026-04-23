import { useState } from 'react'
import { Button } from '../ui/Button'
import { Spinner } from '../ui/Spinner'
import { Badge } from '../ui/Badge'
import { QUESTION_TIER_LABELS } from '@mastery-os/types'
import type { QuestionTier } from '@mastery-os/types'

interface QuestionCardProps {
  question: string
  tier: QuestionTier
  nodeTitle: string
  onSubmit: (answer: string) => void
  isLoading: boolean
}

export function QuestionCard({ question, tier, nodeTitle, onSubmit, isLoading }: QuestionCardProps) {
  const [answer, setAnswer] = useState('')

  const handleSubmit = () => {
    if (!answer.trim() || isLoading) return
    onSubmit(answer)
    setAnswer('')
  }

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Badge label={`T${tier} · ${QUESTION_TIER_LABELS[tier]}`} />
        <span className="text-sm text-gray-400">{nodeTitle}</span>
      </div>

      <blockquote className="text-base text-white leading-relaxed border-l-2 border-blue-500 pl-4">
        {question}
      </blockquote>

      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Answer here. Think out loud. Be precise."
        className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm text-gray-100 placeholder-gray-600 resize-none focus:outline-none focus:border-blue-500 min-h-36"
        disabled={isLoading}
      />

      <Button
        onClick={handleSubmit}
        disabled={!answer.trim() || isLoading}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Spinner size="sm" />
            Scoring...
          </>
        ) : (
          'Submit Answer'
        )}
      </Button>
    </div>
  )
}
