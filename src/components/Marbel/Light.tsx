import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { DirectionalLight } from 'three'

export const Light = () => {
  const light = useRef<DirectionalLight>(null!)
  useFrame((state) => {
    light.current.position.z = state.camera.position.z + 3
    light.current.target.position.z = state.camera.position.z - 4
    light.current.target.updateMatrixWorld()
  })
  return (
    <>
      <directionalLight
        ref={light}
        position={[1, 2, 5]}
        intensity={1.25}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={10}
        shadow-camera-top={10}
        shadow-camera-right={10}
        shadow-camera-bottom={-10}
        shadow-camera-left={-10}
      />
      <ambientLight intensity={1.5} />
    </>
  )
}
