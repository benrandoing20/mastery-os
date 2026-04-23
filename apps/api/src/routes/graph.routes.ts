import { Router } from 'express'
import { supabaseForUser } from '../lib/supabase.js'
import {
  getGraphForUser,
  getGapsForUser,
  addCustomNode,
  updateNodeConfidence,
} from '../services/graph.service.js'
import type { KnowledgeNode } from '@mastery-os/types'

export const graphRouter = Router()

graphRouter.get('/', async (req, res) => {
  try {
    const supabase = supabaseForUser(req.headers.authorization!.replace('Bearer ', ''))
    const graph = await getGraphForUser(req.userId, supabase)
    res.json(graph)
  } catch (err) {
    console.error('GET /graph:', err)
    res.status(500).json({ error: 'Failed to fetch graph' })
  }
})

graphRouter.get('/gaps', async (req, res) => {
  try {
    const supabase = supabaseForUser(req.headers.authorization!.replace('Bearer ', ''))
    const gaps = await getGapsForUser(req.userId, supabase)
    res.json(gaps)
  } catch (err) {
    console.error('GET /graph/gaps:', err)
    res.status(500).json({ error: 'Failed to compute gaps' })
  }
})

graphRouter.post('/nodes', async (req, res) => {
  try {
    const supabase = supabaseForUser(req.headers.authorization!.replace('Bearer ', ''))
    const node = await addCustomNode(req.userId, req.body as Partial<KnowledgeNode>, supabase)
    res.status(201).json(node)
  } catch (err) {
    console.error('POST /graph/nodes:', err)
    res.status(500).json({ error: 'Failed to add node' })
  }
})

graphRouter.patch('/nodes/:id', async (req, res) => {
  try {
    const { confidence } = req.body as { confidence: number }
    const supabase = supabaseForUser(req.headers.authorization!.replace('Bearer ', ''))
    const result = await updateNodeConfidence(req.params.id, req.userId, confidence, null, supabase)
    res.json(result)
  } catch (err) {
    console.error('PATCH /graph/nodes/:id:', err)
    res.status(500).json({ error: 'Failed to update node' })
  }
})
