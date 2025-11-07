import { OrbitControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Perf } from 'r3f-perf'
import { useRef } from 'react'
import { Group, Mesh } from 'three'
import { Light } from './Light'
export const Experience = () => {
  const cubeRef = useRef<Mesh>(null!)
  const groupRef = useRef<Group>(null!)
  useFrame((state, delta) => {
    console.log(state)
    cubeRef.current.rotation.y += delta
  })
  return (
    <>
      <Perf position='top-left'></Perf>

      <OrbitControls />
      <Light />
      <mesh
        position={[0, -1, -2]}
        rotation-x={-Math.PI * 0.5}
        scale={5}
      >
        <planeGeometry></planeGeometry>
        <meshBasicMaterial color='green'></meshBasicMaterial>
      </mesh>
      <group ref={groupRef}>
        <mesh
          position-x={1}
          scale={0.5}
          ref={cubeRef}
        >
          <boxGeometry></boxGeometry>
          <meshStandardMaterial color='red'></meshStandardMaterial>
        </mesh>
        <mesh
          position-x={-1}
          scale={0.5}
        >
          <sphereGeometry></sphereGeometry>
          <meshStandardMaterial color='pink'></meshStandardMaterial>
        </mesh>
      </group>
    </>
  )
}
