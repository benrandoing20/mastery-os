import { create } from 'zustand'
import { apiGet } from '../lib/api'
import type { Stats } from '@mastery-os/types'

interface StatsStore {
  stats: Stats | null
  loading: boolean
  fetchStats: () => Promise<void>
}

export const useStatsStore = create<StatsStore>((set) => ({
  stats: null,
  loading: false,
  fetchStats: async () => {
    set({ loading: true })
    try {
      const data = await apiGet<{ stats: Stats }>('/api/stats')
      set({ stats: data.stats, loading: false })
    } catch {
      set({ loading: false })
    }
  },
}))
