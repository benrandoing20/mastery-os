import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useSessionStore } from '../stores/sessionStore'
import { SessionCard } from '../components/journal/SessionCard'
import { Button } from '../components/ui/Button'
import { Spinner } from '../components/ui/Spinner'
import type { StudySession } from '@mastery-os/types'

function useDebounce<T>(value: T, ms: number): T {
  const [dv, setDv] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDv(value), ms)
    return () => clearTimeout(t)
  }, [value, ms])
  return dv
}

export function JournalPage() {
  const { sessions, total, loading, fetchSessions, searchSessions } = useSessionStore()
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState<StudySession[] | null>(null)
  const debounced = useDebounce(query, 300)

  useEffect(() => { fetchSessions() }, [fetchSessions])

  useEffect(() => {
    if (!debounced.trim()) { setSearchResults(null); return }
    searchSessions(debounced).then(setSearchResults)
  }, [debounced, searchSessions])

  const displayed = searchResults ?? sessions

  const loadMore = useCallback(() => {
    fetchSessions(sessions.length)
  }, [fetchSessions, sessions.length])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Journal</h1>
        <Link to="/journal/new">
          <Button size="sm">+ New Entry</Button>
        </Link>
      </div>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search sessions..."
        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-blue-500"
      />

      {loading && sessions.length === 0 ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : displayed.length === 0 ? (
        <div className="text-center py-12 text-gray-600">
          {query ? 'No results.' : 'No sessions yet. Write your first entry.'}
        </div>
      ) : (
        <div className="space-y-3">
          {displayed.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}

          {!searchResults && sessions.length < total && (
            <div className="flex justify-center pt-2">
              <Button variant="secondary" onClick={loadMore} disabled={loading}>
                {loading ? <Spinner size="sm" /> : 'Load more'}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
