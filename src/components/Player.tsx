import { useKeyboardControls, useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { RapierRigidBody, RigidBody, useRapier } from '@react-three/rapier'
import { useEffect, useRef, useState } from 'react'
import { Vector3 } from 'three'
import { useGame } from '../store/useGame'

export const Player = () => {
  const body = useRef<RapierRigidBody>(null!)
  const [subscribeKeys, getKeys] = useKeyboardControls()
  const { rapier, world } = useRapier()
  const [smoothedCameraPosition] = useState(() => new Vector3(10, 10, 10))
  const [smoothedCameraTarget] = useState(() => new Vector3())
  const start = useGame((state) => state.start)
  const end = useGame((state) => state.end)
  const restart = useGame((state) => state.restart)
  const blocksCount = useGame((state) => state.blocksCount)
  const [baseColor, normalMap, roughnessMap] = useTexture([
    'textures/marble_diff.jpg',
    'textures/marble_nor.jpg',
    'textures/marble_rough.jpg',
  ])

  const jump = () => {
    const origin = { ...body.current.translation() }
    origin.y -= 0.31
    const direction = { x: 0, y: -1, z: 0 }
    const ray = new rapier.Ray(origin, direction)
    const hit = world.castRay(ray, 10, true)

    if (hit && hit.timeOfImpact < 0.15) {
      body.current.applyImpulse({ x: 0, y: 0.5, z: 0 }, true) // 第二个参数表示是否在本地坐标系
    }
  }

  const reset = () => {
    body.current.setTranslation({ x: 0, y: 1, z: 0 }, true)
    body.current.setLinvel({ x: 0, y: 0, z: 0 }, true)
    body.current.setAngvel({ x: 0, y: 0, z: 0 }, true)
  }

  useEffect(() => {
    // 1. 合并订阅变量名，明确订阅目的
    // 订阅游戏阶段变化：当进入"ready"阶段时重置
    const unsubscribePhase = useGame.subscribe(
      (state) => state.phase,
      (phase) => {
        if (phase === 'ready') {
          reset()
        }
      }
    )

    // 2. 订阅跳跃按键：按下时执行跳跃
    const unsubscribeJump = subscribeKeys(
      (state) => state.jump,
      (isJumping) => {
        if (isJumping) {
          // 明确变量含义（是否正在跳跃）
          jump()
        }
      }
    )

    // 3. 订阅任意按键：按下时开始游戏（补充防抖动逻辑）
    let isStartCalled = false // 避免重复触发start()
    const unsubscribeAnyKey = subscribeKeys(() => {
      if (!isStartCalled) {
        isStartCalled = true
        start()
      }
    })

    // 4. 统一取消订阅，使用空函数兜底防错
    return () => {
      unsubscribePhase?.()
      unsubscribeJump?.()
      unsubscribeAnyKey?.()
    }
  })

  useFrame((state, delta) => {
    /**
     * Controls
     */
    const { forward, backward, leftward, rightward } = getKeys()

    const impulse = { x: 0, y: 0, z: 0 }
    const torque = { x: 0, y: 0, z: 0 }

    const impulseStrength = 0.4 * delta
    const torqueStrength = 0.2 * delta

    if (forward) {
      impulse.z -= impulseStrength
      torque.x -= torqueStrength
    }

    if (rightward) {
      impulse.x += impulseStrength
      torque.z -= torqueStrength
    }

    if (backward) {
      impulse.z += impulseStrength
      torque.x += torqueStrength
    }

    if (leftward) {
      impulse.x -= impulseStrength
      torque.z += torqueStrength
    }

    body.current.applyImpulse(impulse, true) //给刚体施加瞬时冲量，改变其平移运动状态
    body.current.applyTorqueImpulse(torque, true) //给刚体施加一个瞬时扭矩冲量，使刚体产生旋转运动

    /**
     * Camera
     */
    const bodyPosition = body.current.translation()

    const cameraPosition = new Vector3()
    cameraPosition.copy(bodyPosition)
    cameraPosition.z += 2.25
    cameraPosition.y += 0.65

    const cameraTarget = new Vector3()
    cameraTarget.copy(bodyPosition)
    cameraTarget.y += 0.25

    smoothedCameraPosition.lerp(cameraPosition, 5 * delta)
    smoothedCameraTarget.lerp(cameraTarget, 5 * delta)

    state.camera.position.copy(smoothedCameraPosition)
    state.camera.lookAt(smoothedCameraTarget)

    /**
     * Phases
     */
    if (bodyPosition.z < -(blocksCount * 4 + 2)) end()

    if (bodyPosition.y < -4) restart()
  })
  return (
    <RigidBody
      ref={body}
      canSleep={false}
      colliders='ball'
      restitution={0.2}
      friction={1}
      linearDamping={0.5}
      angularDamping={0.5}
      position={[0, 1, 0]}
    >
      <mesh castShadow>
        <sphereGeometry args={[0.3, 32, 16]}></sphereGeometry>
        <meshStandardMaterial
          map={baseColor}
          normalMap={normalMap}
          roughnessMap={roughnessMap}
        />
      </mesh>
    </RigidBody>
  )
}
