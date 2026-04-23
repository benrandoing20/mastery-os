import type { ChallengeScore } from '@mastery-os/types'
import { ConfidenceBar } from '../ui/ConfidenceBar'

interface ScoreCardProps {
  score: ChallengeScore
  feedback: string
  confidenceDelta: number
}

const SCORE_LABELS: (keyof ChallengeScore)[] = ['accuracy', 'depth', 'seniorThinking', 'communication']
const SCORE_DISPLAY: Record<keyof ChallengeScore, string> = {
  accuracy: 'Accuracy',
  depth: 'Depth',
  seniorThinking: 'Senior Thinking',
  communication: 'Communication',
}

function avg(score: ChallengeScore): number {
  return (score.accuracy + score.depth + score.seniorThinking + score.communication) / 4
}

export function ScoreCard({ score, feedback, confidenceDelta }: ScoreCardProps) {
  const overall = avg(score)

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-400 uppercase tracking-wide">Score</div>
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-white">{overall.toFixed(1)}</span>
          <span className="text-gray-600 text-sm">/5</span>
          {confidenceDelta !== 0 && (
            <span
              className={`text-xs px-2 py-0.5 rounded ${
                confidenceDelta > 0
                  ? 'bg-green-900/50 text-green-300'
                  : 'bg-red-900/50 text-red-300'
              }`}
            >
              {confidenceDelta > 0 ? '+' : ''}{confidenceDelta} confidence
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {SCORE_LABELS.map((key) => (
          <div key={key} className="flex items-center gap-3">
            <span className="text-xs text-gray-500 w-32">{SCORE_DISPLAY[key]}</span>
            <ConfidenceBar value={score[key]} size="sm" className="flex-1" />
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-gray-800">
        <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Feedback</div>
        <p className="text-sm text-gray-300 leading-relaxed">{feedback}</p>
      </div>
    </div>
  )
}
