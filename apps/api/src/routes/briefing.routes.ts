import { Router } from 'express'
import { supabaseForUser } from '../lib/supabase.js'
import { getOrCreateTodaysBriefing } from '../services/briefing.service.js'

export const briefingRouter = Router()

briefingRouter.get('/today', async (req, res) => {
  try {
    const supabase = supabaseForUser(req.headers.authorization!.replace('Bearer ', ''))
    const result = await getOrCreateTodaysBriefing(req.userId, supabase)
    res.json(result)
  } catch (err) {
    console.error('GET /briefing/today:', err)
    res.status(500).json({ error: 'Failed to get briefing' })
  }
})

briefingRouter.patch('/:id/complete', async (req, res) => {
  try {
    const supabase = supabaseForUser(req.headers.authorization!.replace('Bearer ', ''))
    const { error } = await supabase
      .from('daily_briefings')
      .update({ completed: true })
      .eq('id', req.params.id)
      .eq('user_id', req.userId)
    if (error) throw error
    res.json({ success: true })
  } catch (err) {
    console.error('PATCH /briefing/:id/complete:', err)
    res.status(500).json({ error: 'Failed to complete briefing' })
  }
})
