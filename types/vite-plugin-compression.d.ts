declare module 'vite-plugin-compression' {
  import type { PluginOption } from 'vite'

  export interface ViteCompressionOptions {
    readonly filename?: string | ((path: string) => string)
    readonly algorithm?: 'gzip' | 'brotliCompress' | ((buffer: Buffer, options: any, callback: any) => void)
    readonly threshold?: number
    readonly deleteOriginFile?: boolean
    readonly compressionOptions?: Record<string, unknown>
    readonly ext?: string
    readonly filter?: (file: string) => boolean
  }

  export default function viteCompression(options?: ViteCompressionOptions): PluginOption
}

