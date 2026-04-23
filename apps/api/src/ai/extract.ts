import { groq, MODEL } from '../lib/anthropic.js'
import type { ExtractionResult } from '@mastery-os/types'

export async function extractConcepts(journalText: string, systemContext: string): Promise<ExtractionResult> {
  const prompt = `You are analyzing a study session journal entry. Extract every distinct technical concept the user studied.

For each concept, assess their confidence level based on HOW they describe it:
- 5: Deeply understood, can derive from first principles
- 4: Solid understanding, minor gaps
- 3: Decent grasp, some uncertainty
- 2: Surface-level, noticeable confusion
- 1: Barely touched, mostly confused
- 0: Mentioned but clearly not understood

Assign domains: algorithms | ml | deeplearning | systems | quant | biology

JOURNAL ENTRY:
${journalText}

Return ONLY valid JSON matching this exact schema (no markdown, no explanation):
{
  "concepts": [
    {
      "title": "exact concept name",
      "domain": "one of the 6 domains",
      "confidence": 0-5,
      "notes": "one sentence: what they got right or where their gap is"
    }
  ],
  "gapIdentified": "The single most important gap revealed by this session",
  "targetedQuestion": "One precise question that would probe this exact gap",
  "nextResource": "One specific resource (paper, chapter, problem, video) to close this gap"
}`

  const response = await groq.chat.completions.create({
    model: MODEL,
    max_tokens: 2048,
    messages: [
      { role: 'system', content: systemContext },
      { role: 'user', content: prompt },
    ],
  })

  const text = response.choices[0].message.content ?? ''

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON in response')
    return JSON.parse(jsonMatch[0]) as ExtractionResult
  } catch {
    return {
      concepts: [],
      gapIdentified: 'Could not parse extraction result',
    }
  }
}
