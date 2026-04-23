import { Router } from 'express'
import { supabaseForUser } from '../lib/supabase.js'
import { getStatsForUser } from '../services/stats.service.js'

export const statsRouter = Router()

statsRouter.get('/', async (req, res) => {
  try {
    const supabase = supabaseForUser(req.headers.authorization!.replace('Bearer ', ''))
    const stats = await getStatsForUser(req.userId, supabase)
    res.json({ stats })
  } catch (err) {
    console.error('GET /stats:', err)
    res.status(500).json({ error: 'Failed to fetch stats' })
  }
})
