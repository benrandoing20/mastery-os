import { create } from 'zustand'
import { apiPost, apiGet } from '../lib/api'
import type { ChallengeScore, QuestionTier } from '@mastery-os/types'

export interface ActiveChallenge {
  question: string
  expectedDepth: string
  nodeId: string
  nodeTitle: string
  tier: QuestionTier
}

export interface ChallengeResult extends ChallengeScore {
  feedback: string
  confidenceDelta: number
}

interface ChallengeStore {
  activeChallenge: ActiveChallenge | null
  lastResult: ChallengeResult | null
  history: unknown[]
  loading: boolean
  fetchChallenge: (nodeId: string, tier: QuestionTier) => Promise<void>
  submitAnswer: (answer: string) => Promise<ChallengeResult>
  fetchHistory: () => Promise<void>
  clearChallenge: () => void
}

export const useChallengeStore = create<ChallengeStore>((set, get) => ({
  activeChallenge: null,
  lastResult: null,
  history: [],
  loading: false,
  fetchChallenge: async (nodeId, tier) => {
    set({ loading: true, lastResult: null, activeChallenge: null })
    try {
      const data = await apiPost<ActiveChallenge>('/api/challenge/question', { nodeId, tier })
      set({ activeChallenge: data, loading: false })
    } catch {
      set({ loading: false })
    }
  },
  submitAnswer: async (answer) => {
    const challenge = get().activeChallenge
    if (!challenge) throw new Error('No active challenge')
    const result = await apiPost<ChallengeResult>('/api/challenge/answer', {
      question: challenge.question,
      answer,
      nodeId: challenge.nodeId,
      tier: challenge.tier,
    })
    set({ lastResult: result, activeChallenge: null })
    return result
  },
  fetchHistory: async () => {
    const data = await apiGet<unknown[]>('/api/challenge/history')
    set({ history: data })
  },
  clearChallenge: () => set({ activeChallenge: null, lastResult: null }),
}))
