import type { ExtractedConcept, ChallengeScore } from './models'

export enum AIPromptType {
  EXTRACT = 'EXTRACT',
  CHALLENGE = 'CHALLENGE',
  INTERVIEW = 'INTERVIEW',
  ANALYZE = 'ANALYZE',
  RECOMMEND = 'RECOMMEND',
  SCORE = 'SCORE',
  CONNECT = 'CONNECT',
  BRIEF = 'BRIEF',
}

export interface ExtractionResult {
  concepts: ExtractedConcept[]
  gapIdentified?: string
  targetedQuestion?: string
  nextResource?: string
}

export interface ScoreResult extends ChallengeScore {
  feedback: string
  confidenceDelta: number
}

export interface BriefingContent {
  reviewItems: { nodeId: string; nodeTitle: string; reason: string }[]
  challengeQuestion: { question: string; nodeId: string; tier: number }
  motivationalNote: string
}
