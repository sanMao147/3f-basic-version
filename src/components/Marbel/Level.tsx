import hamburgerGlb from '@/assets/model/marble/hamburger.glb'
import asphaltDiff from '@/assets/textures/marble/asphalt_diff.jpg'
import wallDiff from '@/assets/textures/marble/wall_diff.jpg'
import { Float, Text, useGLTF, useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import {
  CuboidCollider,
  RapierRigidBody,
  RigidBody,
  euler,
  quat,
} from '@react-three/rapier'
import { useEffect, useMemo, useRef } from 'react'
import type { Texture } from 'three'
import { RepeatWrapping } from 'three'

//  加载并缓存共享纹理
const useSharedTextures = () => {
  const [floorTexture, wallTexture] = useTexture([asphaltDiff, wallDiff])

  useEffect(() => {
    // 用useEffect替代useMemo
    floorTexture.wrapS = RepeatWrapping
    floorTexture.wrapT = RepeatWrapping
    floorTexture.repeat.set(1, 1)

    wallTexture.wrapS = RepeatWrapping
    wallTexture.wrapT = RepeatWrapping
    wallTexture.repeat.set(8, 8)
  }, [floorTexture, wallTexture])

  return { floorTexture, wallTexture }
}

// 定义 Box 组件的 Props 类型
interface BoxProps {
  size?: [number, number, number]
  color?: string | number
  position?: [number, number, number]
  texture?: Texture
  hasCollider?: boolean
  colliderSize?: [number, number, number]
}

const Box = ({
  size = [1, 1, 1],
  position = [0, -0.1, 0],
  texture,
  hasCollider = false,
  colliderSize = size.map((s) => s / 2) as [number, number, number],
  color,
}: BoxProps) => {
  const { floorTexture } = useSharedTextures()
  const textureMap = texture || floorTexture

  return (
    <mesh
      position={position}
      receiveShadow
      castShadow
    >
      <boxGeometry args={[...size]} />
      <meshStandardMaterial
        map={textureMap}
        color={color}
      />
      {hasCollider && (
        <CuboidCollider
          args={colliderSize}
          restitution={0.2}
          friction={1}
        />
      )}
    </mesh>
  )
}

// 定义基础块组件的 Props 类型
interface BlockProps {
  position?: [number, number, number]
  texture?: Texture
}

const BlockStart = ({ position = [0, 0, 0] }: BlockProps) => {
  return (
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
          <meshBasicMaterial toneMapped={false} />
        </Text>
      </Float>
      <Box
        size={[4, 0.2, 4]}
        hasCollider={true}
      />
    </group>
  )
}

const BlockSpinner = ({ position = [0, 0, 0] }: BlockProps) => {
  const obstacleRef = useRef<RapierRigidBody>(null!)
  const speed = useMemo(
    () => (Math.random() + 0.2) * Math.sign(Math.random() - 0.5),
    []
  )

  useFrame((state) => {
    if (!obstacleRef.current) return
    const time = state.clock.elapsedTime
    const rotationEuler = euler().set(0, time * speed, 0)
    const rotationQuaternion = quat().setFromEuler(rotationEuler)
    obstacleRef.current.setNextKinematicRotation(rotationQuaternion)
  })

  return (
    <group position={position}>
      <Box
        size={[4, 0.2, 4]}
        hasCollider={true}
      />
      <RigidBody
        ref={obstacleRef}
        type='kinematicVelocity'
        position={[0, 0.3, 0]}
        restitution={0.2}
        friction={0}
      >
        <Box
          size={[3.5, 0.3, 0.2]}
          color='red'
          hasCollider={true}
        />
      </RigidBody>
    </group>
  )
}

const BlockLimbo = ({ position = [0, 0, 0] }: BlockProps) => {
  const obstacleRef = useRef<RapierRigidBody>(null!)
  const timeOffset = useMemo(() => Math.random() * Math.PI * 2, [])

  useFrame((state) => {
    if (!obstacleRef.current) return
    const time = state.clock.elapsedTime
    const y = Math.sin(time + timeOffset) + 1.15
    obstacleRef.current.setNextKinematicTranslation({
      x: position[0],
      y: position[1] + y,
      z: position[2],
    })
  })

  return (
    <group position={position}>
      <Box
        size={[4, 0.2, 4]}
        hasCollider={true}
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
          hasCollider={true}
        />
      </RigidBody>
    </group>
  )
}

const BlockAxe = ({ position = [0, 0, 0] }: BlockProps) => {
  const obstacleRef = useRef<RapierRigidBody>(null!)

  useFrame((state) => {
    if (!obstacleRef.current) return
    const time = state.clock.elapsedTime
    const x = Math.sin(time) * 1.25
    obstacleRef.current.setNextKinematicTranslation({
      x: position[0] + x,
      y: position[1] + 0.75,
      z: position[2],
    })
  })

  return (
    <group position={position}>
      <Box
        size={[4, 0.2, 4]}
        hasCollider={true}
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
          hasCollider={true}
        />
      </RigidBody>
    </group>
  )
}

const BlockEnd = ({ position = [0, 0, 0] }: BlockProps) => {
  const hamburger = useGLTF(hamburgerGlb)
  const processedScene = useMemo(() => {
    hamburger.scene.children.forEach((mesh) => {
      mesh.castShadow = true
    })
    return hamburger.scene
  }, [hamburger])

  return (
    <group position={position}>
      <Text
        scale={0.5}
        position={[0, 2.25, 2]}
      >
        FINISH
        <meshBasicMaterial toneMapped={false} />
      </Text>
      <Box
        size={[4, 0.2, 4]}
        hasCollider={true}
      />
      <RigidBody
        type='fixed'
        colliders='hull'
        position={[0, 0.25, 0]}
        restitution={0.2}
        friction={0}
      >
        <primitive
          object={processedScene}
          scale={0.2}
        />
      </RigidBody>
    </group>
  )
}

const Bounds = ({ length = 1 }) => {
  const { wallTexture } = useSharedTextures()

  return (
    <RigidBody
      type='fixed'
      restitution={0.2}
      friction={0}
    >
      <Box
        size={[0.3, 5.5, 4 * length]}
        position={[2.15, 0.75, -(length * 2) + 2]}
        texture={wallTexture}
        hasCollider={true}
        colliderSize={[0.15, 2.75, 2 * length]}
      />
      <Box
        size={[0.3, 5.5, 4 * length]}
        position={[-2.15, 0.75, -(length * 2) + 2]}
        texture={wallTexture}
        hasCollider={true}
        colliderSize={[0.15, 2.75, 2 * length]}
      />
      <Box
        size={[4, 5.5, 0.3]}
        position={[0, 0.75, -(length * 4) + 2]}
        texture={wallTexture}
        hasCollider={true}
        colliderSize={[2, 2.75, 0.15]}
      />
    </RigidBody>
  )
}

export const Level = ({
  count = 3,
  types = [BlockSpinner, BlockAxe, BlockLimbo],
}) => {
  const blocks = useMemo(() => {
    const blocks = []

    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)]
      blocks.push(type)
    }

    return blocks
  }, [count, types])

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
