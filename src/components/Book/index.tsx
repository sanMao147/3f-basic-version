import { Canvas } from '@react-three/fiber'
import { CanvasLoadingProgress } from '../Loading/CanvasProgress'
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
        <Experience />
        {/* <DisposeOnUnmount /> */}
      </Canvas>
      <CanvasLoadingProgress />
    </div>
  )
}
