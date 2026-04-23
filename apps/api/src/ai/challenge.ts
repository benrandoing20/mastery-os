import { groq, MODEL } from '../lib/anthropic.js'
import type { KnowledgeNode, QuestionTier } from '@mastery-os/types'

const TIER_LABELS = ['', 'Explain', 'Apply', 'Defend', 'Connect', 'Invent'] as const

const TIER_INSTRUCTIONS: Record<QuestionTier, string> = {
  1: 'Ask the user to explain this concept clearly, as if teaching someone. Focus on definitions and core mechanisms.',
  2: 'Ask the user to apply this concept to a concrete problem or scenario.',
  3: 'Ask the user to defend a claim about this concept — present an edge case or common misconception they must address.',
  4: 'Ask the user to connect this concept to at least one other domain or concept and explain the relationship.',
  5: 'Ask the user to invent something new — design a variant, propose an improvement, or derive a novel insight.',
}

const ROLE_BY_DOMAIN: Record<string, string> = {
  quant: 'Two Sigma quant researcher',
  biology: 'clinical AI company interviewer',
  systems: 'senior ML systems engineer',
  deeplearning: 'top AI lab researcher',
  ml: 'staff ML scientist',
  algorithms: 'FAANG software engineer',
}

export async function generateChallenge(
  node: KnowledgeNode,
  tier: QuestionTier,
  systemContext: string
): Promise<{ question: string; expectedDepth: string }> {
  const role = ROLE_BY_DOMAIN[node.domain] ?? 'senior technical interviewer'
  const prompt = `Generate a Tier ${tier} (${TIER_LABELS[tier]}) challenge question for the concept: "${node.title}" (domain: ${node.domain}, current confidence: ${node.confidence.toFixed(1)}/5).

Tier ${tier} instruction: ${TIER_INSTRUCTIONS[tier]}

The question should feel like it came from a ${role}. Be specific, technical, and demanding.
A low-confidence score means the question should be more foundational. High confidence means push deeper.

Return ONLY valid JSON:
{
  "question": "the exact question to ask",
  "expectedDepth": "what a strong answer would cover in 2-3 sentences"
}`

  const response = await groq.chat.completions.create({
    model: MODEL,
    max_tokens: 512,
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
      : { question: text, expectedDepth: '' }
  } catch {
    return { question: text, expectedDepth: '' }
  }
}
