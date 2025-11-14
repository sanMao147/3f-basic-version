import { Float, Text, useGLTF, useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import {
  CuboidCollider,
  RapierRigidBody,
  RigidBody,
  euler,
  quat,
} from '@react-three/rapier'
import { useMemo, useRef, useState } from 'react'
import type { Texture } from 'three'
// 定义 Box 组件的 Props 类型
interface BoxProps {
  size?: [number, number, number]
  color?: string
  position?: [number, number, number] // 可选的位置属性
  texture?: Texture
}

const Box = ({
  size = [1, 1, 1],
  color = 'limegreen',
  position = [0, -0.1, 0], // 默认位置
  texture,
}: BoxProps) => {
  const floorBase = useTexture('textures/asphalt_diff.jpg')
  const textureMap = texture ? texture : floorBase
  return (
    <mesh
      position={position}
      receiveShadow
    >
      <boxGeometry args={[...size]} /> {/* 解构数组确保类型匹配 */}
      <meshStandardMaterial
        color={color}
        map={textureMap}
      />
    </mesh>
  )
}

// 定义基础块组件的 Props 类型（复用位置属性）
interface BlockProps {
  position?: [number, number, number]
  texture?: Texture
}

const BlockStart = ({ position = [0, 0, 0] }: BlockProps) => {
  return (
    <>
      <group position={position}>
        <Float
          floatIntensity={0.25}
          rotationIntensity={0.25}
        >
          <Text
            scale={0.5}
            maxWidth={0.25}
            lineHeight={0.7}
            textAlign='right'
            position={[0.75, 0.65, 0]}
            rotation-y={0.25}
          >
            Marble Race
            <meshBasicMaterial toneMapped={false}></meshBasicMaterial>
          </Text>
        </Float>
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
const Bounds = ({ length = 1 }) => {
  const wallBase = useTexture('textures/wall_diff.jpg')
  return (
    <>
      <RigidBody
        type='fixed'
        restitution={0.2}
        friction={0}
      >
        <Box
          size={[0.3, 5.5, 4 * length]}
          color='slategrey'
          position={[2.15, 0.75, -(length * 2) + 2]}
          texture={wallBase}
        />
        <Box
          size={[0.3, 5.5, 4 * length]}
          color='slategrey'
          position={[-2.15, 0.75, -(length * 2) + 2]}
          texture={wallBase}
        />
        <Box
          size={[4, 5.5, 0.3]}
          color='slategrey'
          position={[0, 0.75, -(length * 4) + 2]}
          texture={wallBase}
        />
        <CuboidCollider
          args={[2, 0.1, 2 * length]}
          position={[0, -0.1, -(length * 2) + 2]}
          restitution={0.2}
          friction={1}
        />
      </RigidBody>
    </>
  )
}
export const Level = ({
  count = 3,
  types = [BlockSpinner, BlockAxe, BlockLimbo],
  seed = 0,
}) => {
  const blocks = useMemo(() => {
    const blocks = []
    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)]
      blocks.push(type)
    }
    return blocks
  }, [count, types, seed])

  return (
    <>
      <BlockStart position={[0, 0, 0]} />
      {blocks.map((Block, index) => (
        <Block
          key={index}
          position={[0, 0, -(index + 1) * 4]}
        />
      ))}

      <BlockEnd position={[0, 0, -(count + 1) * 4]} />
      <Bounds length={count + 2} />
    </>
  )
}
