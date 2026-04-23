import { groq, MODEL } from '../lib/anthropic.js'
import type { KnowledgeNode, BriefingContent } from '@mastery-os/types'

export async function generateBriefing(
  reviewNodes: KnowledgeNode[],
  systemContext: string
): Promise<BriefingContent> {
  const nodeList = reviewNodes
    .slice(0, 8)
    .map(
      (n) =>
        `- id:${n.id} | "${n.title}" (${n.domain}, T${n.tier}, confidence: ${n.confidence.toFixed(1)}/5, last reviewed: ${n.lastReviewedAt ? new Date(n.lastReviewedAt).toLocaleDateString() : 'never'})`
    )
    .join('\n')

  const prompt = `Generate today's morning study briefing. Select the 3 most important nodes to review today and generate 1 challenge question.

CANDIDATE NODES:
${nodeList}

Selection criteria: prioritize nodes with high interview_frequency, low confidence, and long time since review.

Return ONLY valid JSON:
{
  "reviewItems": [
    { "nodeId": "exact-uuid-from-list", "nodeTitle": "exact title", "reason": "one sentence: why review today" },
    { "nodeId": "exact-uuid-from-list", "nodeTitle": "exact title", "reason": "one sentence: why review today" },
    { "nodeId": "exact-uuid-from-list", "nodeTitle": "exact title", "reason": "one sentence: why review today" }
  ],
  "challengeQuestion": {
    "question": "one sharp interview-quality question on the highest-priority gap",
    "nodeId": "exact-uuid-from-list",
    "tier": 1-5
  },
  "motivationalNote": "One sentence. Honest, not cheesy. About the stakes or what consistency builds."
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
      : {
          reviewItems: [],
          challengeQuestion: { question: '', nodeId: '', tier: 1 },
          motivationalNote: '',
        }
  } catch {
    return {
      reviewItems: [],
      challengeQuestion: { question: '', nodeId: '', tier: 1 },
      motivationalNote: '',
    }
  }
}
