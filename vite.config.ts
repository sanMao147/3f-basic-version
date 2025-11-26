import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'
import viteCompression from 'vite-plugin-compression'

const APP_BASE = '/3f-basic-version/'

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production'

  return {
    base: isProd ? APP_BASE : '/',
    plugins: [
      react(),
      tailwindcss(),
      viteCompression({
        algorithm: 'brotliCompress',
        filename: '[path][base].br',
        deleteOriginFile: false,
        threshold: 1024,
      }),
      viteCompression({
        algorithm: 'gzip',
        filename: '[path][base].gz',
        deleteOriginFile: false,
        threshold: 1024,
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    assetsInclude: ['**/*.glb', '**/*.gltf', '**/*.hdr'],
    server: {
      host: true,
      strictPort: true,
      port: 5173,
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'three',
        '@react-three/fiber',
        '@react-three/drei',
        '@react-three/rapier',
        'leva',
      ],
    },
    define: {
      __APP_ENV__: JSON.stringify(mode),
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: !isProd,
      target: 'es2019',
      cssTarget: 'chrome61',
      modulePreload: { polyfill: false },
      chunkSizeWarningLimit: 1500,
      assetsInlineLimit: 4096,
      esbuild: {
        drop: isProd ? ['console', 'debugger'] : [],
        legalComments: 'none',
      },
      reportCompressedSize: true,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom', 'react-router-dom'],
            three: [
              'three',
              '@react-three/fiber',
              '@react-three/drei',
              '@react-three/rapier',
              'maath',
              'r3f-perf',
            ],
          },
          assetFileNames: ({ name }) => {
            if (!name) return 'assets/[name]-[hash][extname]'
            if (/\.(glb|gltf)$/i.test(name)) return 'models/[name]-[hash][extname]'
            if (/\.(mp3|wav)$/i.test(name)) return 'audios/[name]-[hash][extname]'
            if (/\.(png|jpe?g|hdr)$/i.test(name)) return 'textures/[name]-[hash][extname]'
            return 'assets/[name]-[hash][extname]'
          },
        },
      },
    },
  }
})
