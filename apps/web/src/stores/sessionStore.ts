import { create } from 'zustand'
import { apiGet, apiPost, apiDelete } from '../lib/api'
import type { StudySession, ExtractedConcept } from '@mastery-os/types'

export interface JournalSubmitResult {
  session: StudySession
  extraction: {
    concepts: ExtractedConcept[]
    gapIdentified?: string
    targetedQuestion?: string
    nextResource?: string
  }
}

interface SessionStore {
  sessions: StudySession[]
  total: number
  loading: boolean
  extracting: boolean
  lastExtraction: JournalSubmitResult | null
  fetchSessions: (offset?: number) => Promise<void>
  createSession: (rawText: string, durationMinutes: number, sessionType: string) => Promise<JournalSubmitResult>
  deleteSession: (id: string) => Promise<void>
  searchSessions: (query: string) => Promise<StudySession[]>
  clearExtraction: () => void
}

export const useSessionStore = create<SessionStore>((set, get) => ({
  sessions: [],
  total: 0,
  loading: false,
  extracting: false,
  lastExtraction: null,
  fetchSessions: async (offset = 0) => {
    set({ loading: true })
    try {
      const data = await apiGet<{ sessions: StudySession[]; total: number }>(
        `/api/journal?limit=20&offset=${offset}`
      )
      set({
        sessions: offset === 0 ? data.sessions : [...get().sessions, ...data.sessions],
        total: data.total,
        loading: false,
      })
    } catch {
      set({ loading: false })
    }
  },
  createSession: async (rawText, durationMinutes, sessionType) => {
    set({ extracting: true })
    try {
      const result = await apiPost<JournalSubmitResult>('/api/journal', {
        rawText,
        durationMinutes,
        sessionType,
      })
      set({ extracting: false, lastExtraction: result })
      await get().fetchSessions()
      return result
    } catch (err) {
      set({ extracting: false })
      throw err
    }
  },
  deleteSession: async (id) => {
    await apiDelete(`/api/journal/${id}`)
    set({ sessions: get().sessions.filter((s) => s.id !== id) })
  },
  searchSessions: async (query) => {
    if (!query.trim()) return get().sessions
    return apiGet<StudySession[]>(`/api/journal/search?q=${encodeURIComponent(query)}`)
  },
  clearExtraction: () => set({ lastExtraction: null }),
}))
