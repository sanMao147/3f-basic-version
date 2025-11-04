import { create } from 'zustand'

interface PageState {
  pageNum: number
  setPageNum: (newPageNum: number) => void
}

export const usePageStore = create<PageState>((set) => ({
  pageNum: 1,
  setPageNum: (newPageNum) => set({ pageNum: newPageNum }),
}))
