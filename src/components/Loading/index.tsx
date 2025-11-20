/**
 * Tailwind 风格的加载组件
 * 包含：旋转图标 + 加载文字 + 淡入动画
 */
const Loading = () => {
  return (
    <div className='fixed inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-50 animate-fadeIn'>
      {/* 旋转加载图标（Tailwind 原生动画 + 自定义颜色） */}
      <div className='w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4'></div>

      {/* 加载文字（渐变色 + 轻微缩放动画） */}
      <p className='text-lg font-medium bg-clip-text text-transparent bg-linear-to-r from-blue-500 to-purple-500 animate-pulse'>
        加载中...
      </p>
    </div>
  )
}

export default Loading
