import { Router } from 'express'
import { supabaseForUser } from '../lib/supabase.js'
import { createChallenge, submitAnswer, getChallengeHistory } from '../services/challenge.service.js'
import type { QuestionTier } from '@mastery-os/types'

export const challengeRouter = Router()

challengeRouter.post('/question', async (req, res) => {
  try {
    const { nodeId, tier } = req.body as { nodeId: string; tier: QuestionTier }
    if (!nodeId || !tier) {
      res.status(400).json({ error: 'nodeId and tier are required' })
      return
    }
    const supabase = supabaseForUser(req.headers.authorization!.replace('Bearer ', ''))
    const challenge = await createChallenge(req.userId, nodeId, tier, supabase)
    res.json(challenge)
  } catch (err) {
    console.error('POST /challenge/question:', err)
    res.status(500).json({ error: 'Failed to generate challenge' })
  }
})

challengeRouter.post('/answer', async (req, res) => {
  try {
    const { question, answer, nodeId, tier } = req.body as {
      question: string
      answer: string
      nodeId: string
      tier: QuestionTier
    }
    if (!question || !answer || !nodeId || !tier) {
      res.status(400).json({ error: 'question, answer, nodeId, and tier are required' })
      return
    }
    const supabase = supabaseForUser(req.headers.authorization!.replace('Bearer ', ''))
    const result = await submitAnswer(req.userId, question, answer, nodeId, tier, supabase)
    res.json(result)
  } catch (err) {
    console.error('POST /challenge/answer:', err)
    res.status(500).json({ error: 'Failed to score answer' })
  }
})

challengeRouter.get('/history', async (req, res) => {
  try {
    const supabase = supabaseForUser(req.headers.authorization!.replace('Bearer ', ''))
    const history = await getChallengeHistory(req.userId, supabase)
    res.json(history)
  } catch (err) {
    console.error('GET /challenge/history:', err)
    res.status(500).json({ error: 'Failed to fetch challenge history' })
  }
})
