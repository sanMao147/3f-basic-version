import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { Experience } from './Experience'
import { UI } from './UI'

export const Book = () => {
  return (
    <div className='w-full h-screen overflow-hidden'>
      <UI />
      <Canvas
        shadows
        camera={{
          position: [-0.5, 1, 4],
          fov: 45,
        }}
      >
        <Suspense fallback={null}>
          <Experience />
        </Suspense>
      </Canvas>
    </div>
  )
}
