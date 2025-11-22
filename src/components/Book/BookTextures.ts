// 导入所有纹理（从 src/assets/textures/book 目录）
import bookBack from '@/assets/textures/book/book-back.jpg'
import bookCoverRoughness from '@/assets/textures/book/book-cover-roughness.jpg'
import bookCover from '@/assets/textures/book/book-cover.jpg'
import DSC00680 from '@/assets/textures/book/DSC00680.jpg'
import DSC00933 from '@/assets/textures/book/DSC00933.jpg'
import DSC00966 from '@/assets/textures/book/DSC00966.jpg'
import DSC00983 from '@/assets/textures/book/DSC00983.jpg'
import DSC00993 from '@/assets/textures/book/DSC00993.jpg'
import DSC01011 from '@/assets/textures/book/DSC01011.jpg'
import DSC01040 from '@/assets/textures/book/DSC01040.jpg'
import DSC01064 from '@/assets/textures/book/DSC01064.jpg'
import DSC01071 from '@/assets/textures/book/DSC01071.jpg'
import DSC01103 from '@/assets/textures/book/DSC01103.jpg'
import DSC01145 from '@/assets/textures/book/DSC01145.jpg'
import DSC01420 from '@/assets/textures/book/DSC01420.jpg'
import DSC01461 from '@/assets/textures/book/DSC01461.jpg'
import DSC01489 from '@/assets/textures/book/DSC01489.jpg'
import DSC02031 from '@/assets/textures/book/DSC02031.jpg'
import DSC02064 from '@/assets/textures/book/DSC02064.jpg'
import DSC02069 from '@/assets/textures/book/DSC02069.jpg'

// 纹理映射表
export const TextureMap = {
  'book-cover': bookCover,
  'book-back': bookBack,
  'book-cover-roughness': bookCoverRoughness,
  DSC00680,
  DSC00933,
  DSC00966,
  DSC00983,
  DSC00993,
  DSC01011,
  DSC01040,
  DSC01064,
  DSC01071,
  DSC01103,
  DSC01145,
  DSC01420,
  DSC01461,
  DSC01489,
  DSC02031,
  DSC02064,
  DSC02069,
} as const

// 类型定义
export type TextureKey = keyof typeof TextureMap

// 获取纹理路径（用于useTexture）
export const getTexturePath = (key: TextureKey): string => {
  return TextureMap[key] as string
}

// 导出所有纹理路径（供预加载）
export const AllTexturePaths = Object.values(TextureMap) as string[]
