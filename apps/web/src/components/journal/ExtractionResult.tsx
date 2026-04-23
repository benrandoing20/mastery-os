import type { JournalSubmitResult } from '../../stores/sessionStore'
import { Badge } from '../ui/Badge'
import { ConfidenceBar } from '../ui/ConfidenceBar'
import { Card } from '../ui/Card'

interface ExtractionResultProps {
  result: JournalSubmitResult
}

export function ExtractionResult({ result }: ExtractionResultProps) {
  const { extraction } = result
  if (!extraction) return null

  return (
    <div className="space-y-4 mt-4">
      <div className="text-xs text-gray-500 uppercase tracking-wide">Extracted Concepts</div>

      {extraction.concepts && extraction.concepts.length > 0 ? (
        <div className="space-y-2">
          {extraction.concepts.map((concept, i) => (
            <div key={i} className="bg-gray-900 rounded-lg border border-gray-800 px-3 py-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm text-white">{concept.title}</span>
                <Badge domain={concept.domain} />
              </div>
              <ConfidenceBar value={concept.confidence} size="sm" />
              {concept.notes && (
                <p className="text-xs text-gray-500 mt-1">{concept.notes}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-600">No concepts extracted.</p>
      )}

      {extraction.gapIdentified && (
        <Card className="border-yellow-800/50 bg-yellow-950/20">
          <div className="text-xs text-yellow-500 uppercase tracking-wide mb-1">Gap Identified</div>
          <p className="text-sm text-yellow-200">{extraction.gapIdentified}</p>
        </Card>
      )}

      {extraction.targetedQuestion && (
        <Card className="border-blue-800/50 bg-blue-950/20">
          <div className="text-xs text-blue-500 uppercase tracking-wide mb-1">Targeted Question</div>
          <p className="text-sm text-blue-200">{extraction.targetedQuestion}</p>
        </Card>
      )}

      {extraction.nextResource && (
        <Card>
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Next Resource</div>
          <p className="text-sm text-gray-300">{extraction.nextResource}</p>
        </Card>
      )}
    </div>
  )
}
