import { useMarbleGame } from '@/store/useMarbleGame'
import { useKeyboardControls } from '@react-three/drei'
import { addEffect } from '@react-three/fiber'
import { useEffect, useState } from 'react'

const Interface = () => {
  const [time, setTime] = useState<string>('0.00')
  const restart = useMarbleGame((state) => state.restart)
  const phase = useMarbleGame((stata) => stata.phase)
  const forward = useKeyboardControls((state) => state.forward)
  const backward = useKeyboardControls((state) => state.backward)
  const leftward = useKeyboardControls((state) => state.leftward)
  const rightward = useKeyboardControls((state) => state.rightward)
  const jump = useKeyboardControls((state) => state.jump)
  const state = useMarbleGame.getState()

  useEffect(() => {
    const unsubscribeEffect = addEffect(() => {
      let elapsedTime = 0
      if (state.phase === 'playing') elapsedTime = Date.now() - state.startTime
      else if (state.phase === 'ended')
        elapsedTime = state.endTime - state.startTime
      elapsedTime /= 1000
      setTime(elapsedTime.toFixed(2))
    })
    return () => unsubscribeEffect()
  }, [state])

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none font-['Bebas_Neue',cursive]">
      {/* Time 时间显示 */}
      <div className='absolute top-[15%] left-0 w-full text-white text-[6vh] bg-black/20 py-1.5 text-center'>
        {time}
      </div>

      {/* Restart 重启按钮（仅结束时显示） */}
      {phase === 'ended' && (
        <div
          className='absolute top-[40%] left-0 w-full flex justify-center text-white text-[80px] bg-black/20 py-2.5 pointer-events-auto cursor-pointer'
          onClick={restart}
        >
          Restart
        </div>
      )}

      {/* Controls 控制按键 */}
      <div className='absolute bottom-[10%] left-0 w-full'>
        {/* 上方向键 */}
        <div className='flex justify-center mb-1'>
          <div
            className={`w-10 h-10 mx-1 border-2 border-white bg-white/25 ${
              forward ? 'bg-white/60' : ''
            }`}
          ></div>
        </div>
        {/* 左/后/右方向键 */}
        <div className='flex justify-center mb-1'>
          <div
            className={`w-10 h-10 mx-1 border-2 border-white bg-white/25 ${
              leftward ? 'bg-white/60' : ''
            }`}
          ></div>
          <div
            className={`w-10 h-10 mx-1 border-2 border-white bg-white/25 ${
              backward ? 'bg-white/60' : ''
            }`}
          ></div>
          <div
            className={`w-10 h-10 mx-1 border-2 border-white bg-white/25 ${
              rightward ? 'bg-white/60' : ''
            }`}
          ></div>
        </div>
        {/* 跳跃键（大尺寸） */}
        <div className='flex justify-center'>
          <div
            className={`w-36 h-10 mx-1 border-2 border-white bg-white/25 ${
              jump ? 'bg-white/60' : ''
            }`}
          ></div>
        </div>
      </div>
    </div>
  )
}
export default Interface
