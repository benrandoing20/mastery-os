import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import * as dotenv from 'dotenv'

dotenv.config({ path: join(process.cwd(), '.env') })

const __dirname = dirname(fileURLToPath(import.meta.url))

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface SeedNode {
  id: string
  domain: string
  tier: number
  title: string
  description: string
  interviewFrequency: number
  prerequisites: string[]
  unlocks: string[]
  tags: string[]
}

async function seed() {
  const raw = readFileSync(join(__dirname, 'knowledge-graph.json'), 'utf-8')
  const nodes: SeedNode[] = JSON.parse(raw)

  console.log(`Seeding ${nodes.length} knowledge nodes...`)

  const rows = nodes.map((n) => ({
    id: n.id,
    user_id: null,
    domain: n.domain,
    tier: n.tier,
    title: n.title,
    description: n.description,
    confidence: 0,
    last_reviewed_at: null,
    interview_frequency: n.interviewFrequency,
    prerequisites: n.prerequisites,
    unlocks: n.unlocks,
    tags: n.tags,
    is_seeded: true,
  }))

  const BATCH_SIZE = 20
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE)
    const { error } = await supabase
      .from('knowledge_nodes')
      .upsert(batch, { onConflict: 'id' })

    if (error) {
      console.error(`Batch ${i / BATCH_SIZE + 1} failed:`, error)
      process.exit(1)
    }
    console.log(`Seeded nodes ${i + 1}–${Math.min(i + BATCH_SIZE, rows.length)}`)
  }

  console.log(`✓ Seeded ${rows.length} nodes successfully`)
}

seed().catch(console.error)
