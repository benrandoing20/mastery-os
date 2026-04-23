import { Link } from 'react-router-dom'
import { JournalEditor } from '../components/journal/JournalEditor'
import { ExtractionResult } from '../components/journal/ExtractionResult'
import { useSessionStore } from '../stores/sessionStore'
import { Button } from '../components/ui/Button'

export function NewJournalPage() {
  const { createSession, extracting, lastExtraction, clearExtraction } = useSessionStore()

  const handleSubmit = async (text: string, duration: number, sessionType: string) => {
    clearExtraction()
    await createSession(text, duration, sessionType)
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">New Journal Entry</h1>
          <p className="text-sm text-gray-500 mt-1">Write naturally. The AI extracts the rest.</p>
        </div>
        <Link to="/journal">
          <Button variant="ghost" size="sm">View all entries</Button>
        </Link>
      </div>

      <JournalEditor onSubmit={handleSubmit} isLoading={extracting} />

      {lastExtraction && (
        <ExtractionResult result={lastExtraction} />
      )}
    </div>
  )
}
