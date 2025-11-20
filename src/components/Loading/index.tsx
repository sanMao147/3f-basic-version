// loading.tsx
const Loading = () => {
  return (
    <div
      className='fixed inset-0 flex flex-col items-center justify-center 
                    bg-[#232323]/70 backdrop-blur-md z-50 animate-fadeIn'
    >
      {/* 增强辨识度的旋转加载图标（三层结构 + 高亮主色） */}
      <div className='w-16 h-16 relative mb-6'>
        {/* 外层光晕（增强轮廓识别） */}
        <div className='absolute inset-0 rounded-full animate-spin [animation-duration:2s]'>
          <div className='w-full h-full rounded-full bg-linear-to-t from-transparent via-[#5a47ce]/40 to-[#5a47ce] opacity-90'></div>
        </div>
        {/* 中层实线旋转框（核心识别元素） */}
        <div className='absolute inset-2 rounded-full border-4 border-[#5a47ce] border-t-transparent animate-spin [animation-duration:1s]'></div>
        {/* 中心高亮圆点（聚焦视觉） */}
        <div className='absolute inset-4 rounded-full bg-[#5a47ce]/30 flex items-center justify-center'>
          <div className='w-4 h-4 rounded-full bg-[#5a47ce] shadow-[0_0_10px_rgba(90,71,206,0.8)]'></div>
        </div>
      </div>

      {/* 高亮加载文字（增强文字辨识度） */}
      <p
        className='text-xl font-semibold bg-clip-text text-transparent 
                    bg-linear-to-r from-[#9992c7] to-[#c2b6ff] 
                    animate-pulse [animation-duration:1.8s] 
                    shadow-[0_0_8px_rgba(90,71,206,0.3)] px-4 py-1 rounded-md'
      >
        加载中...
      </p>

      {/* 底部动态进度点（强化加载状态识别） */}
      <div className='flex gap-2 mt-7'>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className='w-2.5 h-2.5 rounded-full bg-linear-to-r from-[#5a47ce] to-[#c2b6ff] animate-bounce'
            style={{
              animationDelay: `${i * 0.2}s`,
              animationDuration: '1.5s',
            }}
          ></div>
        ))}
      </div>
    </div>
  )
}

export default Loading
