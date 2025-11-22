import { create } from 'zustand'

export interface PageData {
  front: string
  back: string
}

const pictures = [
  'DSC00680',
  'DSC00933',
  'DSC00966',
  'DSC00983',
  'DSC01011',
  'DSC01040',
  'DSC01064',
  'DSC01071',
  'DSC01103',
  'DSC01145',
  'DSC01420',
  'DSC01461',
  'DSC01489',
  'DSC02031',
  'DSC02064',
  'DSC02069',
]

const initialPages: PageData[] = [
  {
    front: 'book-cover',
    back: pictures[0],
  },
]

for (let i = 1; i < pictures.length - 1; i += 2) {
  initialPages.push({
    front: pictures[i % pictures.length],
    back: pictures[(i + 1) % pictures.length],
  })
}

initialPages.push({
  front: pictures[pictures.length - 1],
  back: 'book-back',
})

export const useBookStore = create<{
  page: number
  setPage: (newPage: number) => void
  pages: PageData[]
}>((set) => ({
  page: 0,
  setPage: (newPage: number) => {
    const total = initialPages.length
    set({ page: Math.max(0, Math.min(newPage, total)) })
  },
  pages: initialPages,
}))
