import type { KnowledgeNode, StudySession, DailyBriefing, GraphEdge, ExtractedConcept, Stats, ChallengeScore } from './models'
import type { Domain, SessionType, QuestionTier } from './domain'

export interface JournalSubmitRequest {
  rawText: string
  durationMinutes?: number
  sessionType?: SessionType
}

export interface JournalSubmitResponse {
  session: StudySession
  extractedConcepts: ExtractedConcept[]
  gapIdentified?: string
  targetedQuestion?: string
  nextResource?: string
}

export interface GraphResponse {
  nodes: KnowledgeNode[]
  edges: GraphEdge[]
}

export interface GapResponse {
  gaps: (KnowledgeNode & { gapScore: number })[]
  domainCoverage: Record<Domain, number>
}

export interface ChallengeQuestionRequest {
  nodeId: string
  tier: QuestionTier
}

export interface ChallengeQuestionResponse {
  question: string
  expectedDepth: string
  nodeTitle: string
  tier: QuestionTier
}

export interface ChallengeAnswerRequest {
  question: string
  answer: string
  nodeId: string
  tier: QuestionTier
}

export interface ChallengeAnswerResponse {
  score: ChallengeScore
  feedback: string
  confidenceDelta: number
}

export interface StatsResponse {
  stats: Stats
}

export interface BriefingResponse {
  briefing: DailyBriefing
  reviewNodes: KnowledgeNode[]
}
