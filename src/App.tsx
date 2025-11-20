import { Suspense } from 'react'
import { RouterProvider } from 'react-router-dom'
import Loading from './components/Loading'
import router from './routes/index'
function App() {
  return (
    <Suspense fallback={<Loading />}>
      <RouterProvider router={router} />

      {/* <UI /> */}
      {/* <Loader /> */}
      {/* 定义键盘映射：按键 -> 状态字段 */}
      {/* <KeyboardControls
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
          <Suspense fallback={null}>
            <Experience />
          </Suspense>
        </Canvas>
        <Interface />
      </KeyboardControls> */}
    </Suspense>
  )
}

export default App
