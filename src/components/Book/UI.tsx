import pageflipaudio from '@/assets/audios/page-flip-01a.mp3'
import { useBookStore } from '@/store/useBookStore'
import { useEffect, useRef } from 'react'

const ScrollContent = () => {
  return (
    <>
      <h1 className='shrink-0 text-white text-10xl font-black '>Charlie Liu</h1>
      <h2 className='shrink-0 text-white text-8xl italic font-light'>
        React Three Fiber
      </h2>

      <h2 className='shrink-0 text-transparent text-12xl font-bold italic outline-text'>
        Extremely
      </h2>
      <h2 className='shrink-0 text-white text-9xl font-medium'>Outstanding</h2>
      <h2 className='shrink-0 text-white text-9xl font-extralight italic'>
        Amazing
      </h2>
      <h2 className='shrink-0 text-white text-13xl font-bold'>Practice</h2>
      <h2 className='shrink-0 text-transparent text-13xl font-bold outline-text italic'>
        Piece
      </h2>
    </>
  )
}
export const UI = () => {
  const { page, setPage, pages } = useBookStore()
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // 优化音频播放逻辑
  useEffect(() => {
    // 初始化音频实例（只创建一次）
    if (!audioRef.current) {
      audioRef.current = new Audio(pageflipaudio)
      audioRef.current.volume = 0.5 // 可选：调整音量
    }
    const playAudio = async () => {
      if (!audioRef.current) return
      try {
        // 停止之前的播放（避免重叠）
        if (!audioRef.current.paused) {
          audioRef.current.currentTime = 0
        }
        await audioRef.current.play()
      } catch (err) {
        console.log('音频播放失败（浏览器限制）:', err)
      }
    }

    // 页面变化时播放（排除初始加载时的播放）
    if (page !== 0 || audioRef.current) {
      playAudio()
    }

    // 组件卸载时销毁音频实例（类型安全）
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [page])

  // 安全设置页面（避免 page 越界）
  const safeSetPage = (targetPage: number) => {
    const maxPage = pages.length // Back Cover 对应 pages.length
    if (targetPage >= 0 && targetPage <= maxPage) {
      setPage(targetPage)
    }
  }

  return (
    <>
      <main className='pointer-events-none select-none z-10 fixed inset-0 flex justify-between flex-col'>
        <a
          className='pointer-events-auto mt-10 ml-10 drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]'
          href='https://github.com/sanMao147'
          target='_blank' // 新增：新窗口打开链接
          rel='noopener noreferrer'
        >
          <svg
            height='32'
            aria-hidden='true'
            viewBox='0 0 24 24'
            version='1.1'
            width='32'
            data-view-component='true'
            fill='#ffffff'
          >
            <path d='M12 1C5.923 1 1 5.923 1 12c0 4.867 3.149 8.979 7.521 10.436.55.096.756-.233.756-.522 0-.262-.013-1.128-.013-2.049-2.764.509-3.479-.674-3.699-1.292-.124-.317-.66-1.293-1.127-1.554-.385-.207-.936-.715-.014-.729.866-.014 1.485.797 1.691 1.128.99 1.663 2.571 1.196 3.204.907.096-.715.385-1.196.701-1.471-2.448-.275-5.005-1.224-5.005-5.432 0-1.196.426-2.186 1.128-2.956-.111-.275-.496-1.402.11-2.915 0 0 .921-.288 3.024 1.128a10.193 10.193 0 0 1 2.75-.371c.936 0 1.871.123 2.75.371 2.104-1.43 3.025-1.128 3.025-1.128.605 1.513.221 2.64.111 2.915.701.77 1.127 1.747 1.127 2.956 0 4.222-2.571 5.157-5.019 5.432.399.344.743 1.004.743 2.035 0 1.471-.014 2.654-.014 3.025 0 .289.206.632.756.522C19.851 20.979 23 16.854 23 12c0-6.077-4.922-11-11-11Z'></path>
          </svg>
        </a>

        <div className='w-full overflow-auto pointer-events-auto flex justify-center'>
          <div className='overflow-auto flex items-center gap-4 max-w-full p-4 md:p-10'>
            {/* 页面切换按钮 */}
            {pages.map((_, index) => (
              <button
                key={index}
                className={`border-transparent hover:border-white transition-all duration-300 px-3 md:px-4 py-2 md:py-3 rounded-full text-sm md:text-lg uppercase shrink-0 border ${
                  index === page
                    ? 'bg-white/90 text-black'
                    : 'bg-black/30 text-white hover:bg-black/50'
                }`}
                onClick={() => safeSetPage(index)}
              >
                {index === 0 ? 'Cover' : `Page ${index}`}
              </button>
            ))}
            {/* 封底按钮 */}
            <button
              className={`border-transparent hover:border-white transition-all duration-300 px-3 md:px-4 py-2 md:py-3 rounded-full text-sm md:text-lg uppercase shrink-0 border ${
                page === pages.length
                  ? 'bg-white/90 text-black'
                  : 'bg-black/30 text-white hover:bg-black/50'
              }`}
              onClick={() => safeSetPage(pages.length)}
            >
              Back Cover
            </button>
          </div>
        </div>
      </main>

      <div className='fixed inset-0 flex items-center overflow-hidden -rotate-2 select-none'>
        <div className='flex items-center whitespace-nowrap'>
          <div className='bg-transparent animate-horizontalScroll flex items-center gap-8 w-max px-8'>
            <ScrollContent />
          </div>
          <div className='bg-transparent animate-horizontalScroll-2 flex items-center gap-8 w-max px-8'>
            <ScrollContent />
          </div>
        </div>
      </div>
    </>
  )
}
