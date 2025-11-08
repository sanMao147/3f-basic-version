import { Loader } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { Experience } from './components/Experience'
function App() {
  return (
    <>
      {/* <UI /> */}
      <Loader />
      <Canvas
        shadows
        camera={{ position: [10, 10, 6], fov: 45 }}
      >
        <group position-y={0}>
          <Suspense fallback={null}>
            <Experience />
          </Suspense>
        </group>
      </Canvas>
    </>
  )
}

export default App
