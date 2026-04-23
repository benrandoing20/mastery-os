import express from 'express'
import cors from 'cors'
import { authMiddleware } from './middleware/auth.js'
import { journalRouter } from './routes/journal.routes.js'
import { graphRouter } from './routes/graph.routes.js'
import { challengeRouter } from './routes/challenge.routes.js'
import { briefingRouter } from './routes/briefing.routes.js'
import { statsRouter } from './routes/stats.routes.js'

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json({ limit: '10mb' }))

app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }))

app.use(authMiddleware)

app.use('/api/journal', journalRouter)
app.use('/api/graph', graphRouter)
app.use('/api/challenge', challengeRouter)
app.use('/api/briefing', briefingRouter)
app.use('/api/stats', statsRouter)

app.listen(PORT, () => {
  console.log(`Mastery OS API running on port ${PORT}`)
})

export default app
