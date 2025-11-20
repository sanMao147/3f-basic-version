// src/env.d.ts
/// <reference types="vite/client" />
/// <reference types="@react-three/fiber" />
/// <reference types="three" />

// GLB/GLTF 类型声明（关键）
declare module '*.glb' {
  const value: string // 导入后返回 URL 字符串
  export default value
}

declare module '*.gltf' {
  const value: string
  export default value
}

// 图片类型声明（保留）
declare module '*.jpg' {
  const value: string
  export default value
}
declare module '*.png' {
  const value: string
  export default value
}
