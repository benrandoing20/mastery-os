import { useState } from 'react'
import { Button } from '../ui/Button'
import { Spinner } from '../ui/Spinner'

const SESSION_TYPES = [
  { value: 'journal', label: 'General Study' },
  { value: 'problem', label: 'Problem Solving' },
  { value: 'paper', label: 'Paper Reading' },
  { value: 'interview', label: 'Interview Prep' },
  { value: 'project', label: 'Project Work' },
]

interface JournalEditorProps {
  onSubmit: (text: string, duration: number, sessionType: string) => Promise<void>
  isLoading: boolean
}

export function JournalEditor({ onSubmit, isLoading }: JournalEditorProps) {
  const [text, setText] = useState('')
  const [showDetails, setShowDetails] = useState(false)
  const [duration, setDuration] = useState(30)
  const [sessionType, setSessionType] = useState('journal')

  const handleSubmit = async () => {
    if (!text.trim() || isLoading) return
    await onSubmit(text, duration, sessionType)
    setText('')
    setShowDetails(false)
    setDuration(30)
    setSessionType('journal')
  }

  return (
    <div className="space-y-3">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What did you study today? Write naturally — concepts you worked on, problems you solved, papers you read, what clicked and what didn't..."
        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-4 text-sm text-gray-100 placeholder-gray-600 resize-none focus:outline-none focus:border-blue-500 min-h-48 leading-relaxed"
        disabled={isLoading}
      />
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          {showDetails ? '▼' : '▶'} Add details
        </button>
        <span className="text-xs text-gray-700">{text.length} chars</span>
      </div>

      {showDetails && (
        <div className="grid grid-cols-2 gap-3 p-3 bg-gray-900 rounded-lg border border-gray-800">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Session type</label>
            <select
              value={sessionType}
              onChange={(e) => setSessionType(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-sm text-gray-200 focus:outline-none focus:border-blue-500"
            >
              {SESSION_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Duration: {duration} min
            </label>
            <input
              type="range"
              min={5}
              max={240}
              step={5}
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>
        </div>
      )}

      <Button
        onClick={handleSubmit}
        disabled={!text.trim() || isLoading}
        size="lg"
        className="w-full"
      >
        {isLoading ? (
          <>
            <Spinner size="sm" />
            Extracting concepts...
          </>
        ) : (
          'Extract & Save'
        )}
      </Button>
    </div>
  )
}
