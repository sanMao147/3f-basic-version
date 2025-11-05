import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { Group, Mesh } from 'three'
export const Experience = () => {
  const cubeRef = useRef<Mesh>(null!)
  const groupRef = useRef<Group>(null!)
  useFrame((state, delta) => {
    console.log(state)
    cubeRef.current.rotation.y += delta
  })
  return (
    <>
      {/* <OrbitControls></OrbitControls> */}
      <axesHelper />
      <mesh position={[0, -1, -2]} rotation-x={-Math.PI * 0.5} scale={5}>
        <planeGeometry></planeGeometry>
        <meshBasicMaterial color='green'></meshBasicMaterial>
      </mesh>
      <group ref={groupRef}>
        <mesh position-x={1} scale={0.5} ref={cubeRef}>
          <boxGeometry></boxGeometry>
          <meshBasicMaterial color='red'></meshBasicMaterial>
        </mesh>
        <mesh position-x={-1} scale={0.5}>
          <sphereGeometry></sphereGeometry>
          <meshBasicMaterial color='pink'></meshBasicMaterial>
        </mesh>
      </group>
    </>
  )
}
