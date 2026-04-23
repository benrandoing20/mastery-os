import { useState } from 'react'
import type { StudySession } from '@mastery-os/types'
import { Badge } from '../ui/Badge'
import { ConfidenceBar } from '../ui/ConfidenceBar'
import { Button } from '../ui/Button'
import { useSessionStore } from '../../stores/sessionStore'
import type { Domain } from '@mastery-os/types'

interface SessionCardProps {
  session: StudySession
}

export function SessionCard({ session }: SessionCardProps) {
  const [expanded, setExpanded] = useState(false)
  const deleteSession = useSessionStore((s) => s.deleteSession)

  const date = new Date(session.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-800 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Badge label={session.sessionType} />
            <span className="text-xs text-gray-500">{date}</span>
            {session.durationMinutes > 0 && (
              <span className="text-xs text-gray-600">{session.durationMinutes}m</span>
            )}
            {session.extractedConcepts.length > 0 && (
              <span className="text-xs text-gray-600">
                {session.extractedConcepts.length} concepts
              </span>
            )}
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            {expanded ? session.rawText : session.rawText.slice(0, 200)}
            {!expanded && session.rawText.length > 200 && '...'}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? '▲' : '▼'}
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => deleteSession(session.id)}
          >
            ✕
          </Button>
        </div>
      </div>

      {expanded && session.extractedConcepts.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-800 space-y-2">
          <div className="text-xs text-gray-600 uppercase tracking-wide">Concepts</div>
          {session.extractedConcepts.map((c, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-sm text-gray-300 flex-1">{c.title}</span>
              <Badge domain={c.domain as Domain} />
              <ConfidenceBar value={c.confidence} size="sm" className="w-24" />
            </div>
          ))}
          {session.aiAnalysis?.gapIdentified && (
            <div className="mt-2 p-2 bg-yellow-950/20 rounded border border-yellow-900/50 text-xs text-yellow-300">
              Gap: {session.aiAnalysis.gapIdentified}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
