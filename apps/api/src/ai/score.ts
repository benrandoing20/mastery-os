import { groq, MODEL } from '../lib/anthropic.js'
import type { KnowledgeNode, ScoreResult } from '@mastery-os/types'

export async function scoreAnswer(
  question: string,
  answer: string,
  node: KnowledgeNode,
  systemContext: string
): Promise<ScoreResult> {
  const prompt = `Evaluate this answer to a technical question. Be honest and demanding — this person wants to get hired at a top company.

CONCEPT: ${node.title} (domain: ${node.domain}, stated confidence: ${node.confidence.toFixed(1)}/5)
QUESTION: ${question}
ANSWER: ${answer}

Score on 4 dimensions (0-5 each, where 5 = would impress a top-company interviewer):
- accuracy: Is the technical content correct? Any errors?
- depth: Did they go beyond surface level? Show understanding of mechanics?
- seniorThinking: Did they discuss tradeoffs, edge cases, failure modes, broader implications?
- communication: Was the explanation clear, structured, and precise?

confidenceDelta: Based on this answer quality, how should we update their confidence for this concept?
  - Strong answer: +1 or +2
  - Average answer: 0
  - Weak/wrong answer: -1

Return ONLY valid JSON:
{
  "accuracy": 0-5,
  "depth": 0-5,
  "seniorThinking": 0-5,
  "communication": 0-5,
  "confidenceDelta": integer from -1 to 2,
  "feedback": "2-3 sentences. Be specific: what was good, what was wrong or missing, what they must study to improve."
}`

  const response = await groq.chat.completions.create({
    model: MODEL,
    max_tokens: 1024,
    messages: [
      { role: 'system', content: systemContext },
      { role: 'user', content: prompt },
    ],
  })

  const text = response.choices[0].message.content ?? ''
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    return jsonMatch
      ? JSON.parse(jsonMatch[0])
      : { accuracy: 0, depth: 0, seniorThinking: 0, communication: 0, feedback: text, confidenceDelta: 0 }
  } catch {
    return { accuracy: 0, depth: 0, seniorThinking: 0, communication: 0, feedback: text, confidenceDelta: 0 }
  }
}
