import { Router } from 'express'
import { supabaseForUser } from '../lib/supabase.js'
import {
  createSessionWithExtraction,
  getSessionsForUser,
  searchSessions,
  deleteSession,
} from '../services/session.service.js'
import type { SessionType } from '@mastery-os/types'

export const journalRouter = Router()

journalRouter.post('/', async (req, res) => {
  try {
    const { rawText, durationMinutes = 0, sessionType = 'journal' } = req.body as {
      rawText: string
      durationMinutes?: number
      sessionType?: SessionType
    }
    if (!rawText?.trim()) {
      res.status(400).json({ error: 'rawText is required' })
      return
    }
    const supabase = supabaseForUser(req.headers.authorization!.replace('Bearer ', ''))
    const result = await createSessionWithExtraction(
      req.userId,
      rawText,
      durationMinutes,
      sessionType,
      supabase
    )
    res.json(result)
  } catch (err) {
    console.error('POST /journal:', err)
    res.status(500).json({ error: 'Failed to create session' })
  }
})

journalRouter.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20
    const offset = parseInt(req.query.offset as string) || 0
    const supabase = supabaseForUser(req.headers.authorization!.replace('Bearer ', ''))
    const result = await getSessionsForUser(req.userId, limit, offset, supabase)
    res.json(result)
  } catch (err) {
    console.error('GET /journal:', err)
    res.status(500).json({ error: 'Failed to fetch sessions' })
  }
})

journalRouter.get('/search', async (req, res) => {
  try {
    const query = req.query.q as string
    if (!query?.trim()) { res.json([]); return }
    const supabase = supabaseForUser(req.headers.authorization!.replace('Bearer ', ''))
    const results = await searchSessions(req.userId, query, supabase)
    res.json(results)
  } catch (err) {
    console.error('GET /journal/search:', err)
    res.status(500).json({ error: 'Search failed' })
  }
})

journalRouter.delete('/:id', async (req, res) => {
  try {
    const supabase = supabaseForUser(req.headers.authorization!.replace('Bearer ', ''))
    await deleteSession(req.params.id, req.userId, supabase)
    res.json({ success: true })
  } catch (err) {
    console.error('DELETE /journal/:id:', err)
    res.status(500).json({ error: 'Failed to delete session' })
  }
})
