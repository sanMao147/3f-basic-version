import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

export type GameState = {
  blocksCount: number
  blocksSeed: number
  startTime: number
  endTime: number
  phase: 'ready' | 'playing' | 'ended' // 明确 phase 的可能值（联合类型）
  // 方法类型
  start: () => void
  restart: () => void
  end: () => void
}

export const useMarbleGame = create<GameState>()(
  subscribeWithSelector((set) => {
    return {
      blocksCount: 8,
      blocksSeed: 0,

      /**
       * Time
       */
      startTime: 0,
      endTime: 0,

      /**
       * Phases
       */
      phase: 'ready',

      start: () => {
        set((state) => {
          if (state.phase === 'ready')
            return { phase: 'playing', startTime: Date.now() }

          return {}
        })
      },

      restart: () => {
        set((state) => {
          if (state.phase === 'playing' || state.phase === 'ended')
            return {
              phase: 'ready',
              blocksSeed: Math.random(),
              startTime: 0,
              endTime: 0,
            }

          return {}
        })
      },

      end: () => {
        set((state) => {
          if (state.phase === 'playing')
            return { phase: 'ended', endTime: Date.now() }

          return {}
        })
      },
    }
  })
)
