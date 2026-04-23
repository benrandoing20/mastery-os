export type Domain = 'algorithms' | 'ml' | 'deeplearning' | 'systems' | 'quant' | 'biology'
export type Tier = 1 | 2 | 3 | 4
export type SessionType = 'journal' | 'problem' | 'paper' | 'interview' | 'project'
export type ChallengeType = 'mock_interview' | 'quiz' | 'system_design' | 'invariant_test'
export type TargetRole = 'quant_research' | 'ai_lab' | 'clinical_ai' | 'general'
export type QuestionTier = 1 | 2 | 3 | 4 | 5

export const DOMAINS: Domain[] = ['algorithms', 'ml', 'deeplearning', 'systems', 'quant', 'biology']

export const DOMAIN_LABELS: Record<Domain, string> = {
  algorithms: 'Algorithms',
  ml: 'Machine Learning',
  deeplearning: 'Deep Learning',
  systems: 'AI Systems',
  quant: 'Quant Finance',
  biology: 'Digital Biology',
}

export const QUESTION_TIER_LABELS: Record<QuestionTier, string> = {
  1: 'Explain',
  2: 'Apply',
  3: 'Defend',
  4: 'Connect',
  5: 'Invent',
}
