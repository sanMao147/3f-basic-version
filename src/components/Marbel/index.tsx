import { KeyboardControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Experience } from './Experience'
import Interface from './Interface'

export default function MarbelBasic() {
  return (
    <div className='w-full h-screen overflow-hidden'>
      <KeyboardControls
        map={[
          { name: 'forward', keys: ['ArrowUp', 'KeyW'] }, // W 或上箭头 → forward
          { name: 'backward', keys: ['ArrowDown', 'KeyS'] }, // S 或下箭头 → back
          { name: 'leftward', keys: ['ArrowLeft', 'KeyA'] }, // A 或左箭头 → left
          { name: 'rightward', keys: ['ArrowRight', 'KeyD'] }, // D 或右箭头 → right
          { name: 'jump', keys: ['Space'] }, // 空格 → jump
        ]}
      >
        <Canvas
          shadows
          camera={{ fov: 45, near: 0.1, far: 200, position: [2.5, 4, 6] }}
        >
          <Experience />
        </Canvas>
        <Interface />
      </KeyboardControls>
    </div>
  )
}
