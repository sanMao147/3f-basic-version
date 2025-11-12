import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { RapierRigidBody, RigidBody, euler, quat } from '@react-three/rapier'
import { useRef, useState } from 'react'

// 定义 Box 组件的 Props 类型
interface BoxProps {
  size?: [number, number, number]
  color?: string
  position?: [number, number, number] // 可选的位置属性
}

const Box = ({
  size = [1, 1, 1],
  color = 'limegreen',
  position = [0, -0.1, 0], // 默认位置
}: BoxProps) => {
  return (
    <mesh
      position={position}
      receiveShadow
    >
      <boxGeometry args={[...size]} /> {/* 解构数组确保类型匹配 */}
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

// 定义基础块组件的 Props 类型（复用位置属性）
interface BlockProps {
  position?: [number, number, number]
}

const BlockStart = ({ position = [0, 0, 0] }: BlockProps) => {
  return (
    <>
      <group position={position}>
        <Box size={[4, 0.2, 4]} />
      </group>
    </>
  )
}

const BlockSpinner = ({ position = [0, 0, 0] }: BlockProps) => {
  const obstacleRef = useRef<RapierRigidBody>(null!)
  const [speed] = useState(
    () => (Math.random() + 0.2) * Math.sign(Math.random() - 0.5)
  )
  // Math.sign(Math.random() - 0.5) 会根据这个值返回 -1 或 1。
  // 如果值小于 0，返回 -1；
  // 如果值大于或等于 0，返回 1。
  useFrame((state) => {
    if (!obstacleRef.current) return
    const time = state.clock.elapsedTime
    const rotationEuler = euler().set(0, time * speed, 0) // 旋转欧拉角
    const rotationQuaternion = quat().setFromEuler(rotationEuler) // 目标旋转四元数
    obstacleRef.current.setNextKinematicRotation(rotationQuaternion)
  })

  return (
    <>
      <group position={position}>
        <Box
          size={[4, 0.2, 4]}
          color='yellow'
        />
        <RigidBody
          ref={obstacleRef}
          type='kinematicPosition'
          position={[0, 0.3, 0]}
          restitution={0.2}
          friction={0}
        >
          <Box
            size={[3.5, 0.3, 0.2]}
            color='red'
          />
        </RigidBody>
      </group>
    </>
  )
}
const BlockLimbo = ({ position = [0, 0, 0] }: BlockProps) => {
  const obstacleRef = useRef<RapierRigidBody>(null!)
  const [timeOffset] = useState(() => Math.random() * Math.PI * 2)
  useFrame((state) => {
    if (!obstacleRef.current) return
    const time = state.clock.elapsedTime
    const y = Math.sin(time + timeOffset) + 1.15
    obstacleRef.current.setNextKinematicTranslation({
      x: position[0],
      y,
      z: position[2],
    })
  })

  return (
    <>
      <group position={position}>
        <Box
          size={[4, 0.2, 4]}
          color='yellow'
        />
        <RigidBody
          ref={obstacleRef}
          type='kinematicPosition'
          position={[0, 0.3, 0]}
          restitution={0.2}
          friction={0}
        >
          <Box
            size={[3.5, 0.5, 0.2]}
            color='red'
          />
        </RigidBody>
      </group>
    </>
  )
}
const BlockAxe = ({ position = [0, 0, 0] }: BlockProps) => {
  const obstacleRef = useRef<RapierRigidBody>(null!)
  useFrame((state) => {
    if (!obstacleRef.current) return
    const time = state.clock.elapsedTime
    const x = Math.sin(time) * 1.25
    obstacleRef.current.setNextKinematicTranslation({
      x,
      y: position[1] + 1.5,
      z: position[2],
    })
  })

  return (
    <>
      <group position={position}>
        <Box
          size={[4, 0.2, 4]}
          color='yellow'
        />
        <RigidBody
          ref={obstacleRef}
          type='kinematicPosition'
          position={[0, 0.3, 0]}
          restitution={0.2}
          friction={0}
        >
          <Box
            size={[1.5, 2.5, 0.3]}
            color='red'
          />
        </RigidBody>
      </group>
    </>
  )
}
const BlockEnd = ({ position = [0, 0, 0] }: BlockProps) => {
  const hamburger = useGLTF('./model/hamburger.glb')
  hamburger.scene.children.forEach((mesh) => {
    mesh.castShadow = true
  })
  return (
    <>
      <group position={position}>
        <Box size={[4, 0.2, 4]} />
        <RigidBody
          type='fixed'
          colliders='hull'
          position={[0, 0.25, 0]}
          restitution={0.2}
          friction={0}
        >
          <primitive
            object={hamburger.scene}
            scale={0.2}
          />
        </RigidBody>
      </group>
    </>
  )
}
export const Level = () => {
  return (
    <>
      <BlockStart position={[0, 0, 16]} />
      <BlockSpinner position={[0, 0, 12]} />
      <BlockLimbo position={[0, 0, 8]} />
      <BlockAxe position={[0, 0, 4]} />
      <BlockEnd position={[0, 0, 0]} />
    </>
  )
}
