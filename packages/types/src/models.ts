import type { Domain, Tier, SessionType, ChallengeType, TargetRole } from './domain'

export interface User {
  id: string
  email: string
  createdAt: string
  targetRoles: TargetRole[]
  preferences: Record<string, unknown>
}

export interface KnowledgeNode {
  id: string
  userId: string | null
  domain: Domain
  tier: Tier
  title: string
  description: string
  confidence: number
  lastReviewedAt: string | null
  interviewFrequency: number
  prerequisites: string[]
  unlocks: string[]
  tags: string[]
  isSeeded: boolean
  createdAt: string
  embedding?: number[]
}

export interface ExtractedConcept {
  title: string
  domain: Domain
  confidence: number
  notes: string
}

export interface StudySession {
  id: string
  userId: string
  rawText: string
  extractedConcepts: ExtractedConcept[]
  durationMinutes: number
  sessionType: SessionType
  linkedNodeIds: string[]
  aiAnalysis: {
    gapIdentified?: string
    targetedQuestion?: string
    nextResource?: string
  }
  createdAt: string
}

export interface ConceptUpdate {
  id: string
  nodeId: string
  sessionId: string
  confidenceBefore: number
  confidenceAfter: number
  createdAt: string
}

export interface ChallengeScore {
  accuracy: number
  depth: number
  seniorThinking: number
  communication: number
}

export interface ChallengeSession {
  id: string
  userId: string
  challengeType: ChallengeType
  targetRole: TargetRole
  domain: Domain
  messages: { role: 'user' | 'assistant'; content: string }[]
  score: ChallengeScore
  gapsIdentified: string[]
  nodesTested: string[]
  createdAt: string
}

export interface DailyBriefing {
  id: string
  userId: string
  date: string
  nodesDueForReview: string[]
  challengeQuestions: { question: string; nodeId: string; tier: number }[]
  recommendations: { nodeId: string; reason: string }[]
  completed: boolean
  createdAt: string
}

export interface Resource {
  id: string
  nodeId: string
  type: 'paper' | 'problem' | 'video' | 'repo' | 'article'
  title: string
  url: string
  notes: string
  completed: boolean
  createdAt: string
}

export interface GraphEdge {
  source: string
  target: string
  type: 'prerequisite' | 'unlocks'
}

export interface Stats {
  streak: number
  bestStreak: number
  totalSessions: number
  totalMinutes: number
  domainCoverage: Record<Domain, number>
  interviewReadiness: Record<TargetRole, number>
}
