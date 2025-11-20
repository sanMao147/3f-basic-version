import { useGame } from '@/store/useGame'
import { Physics } from '@react-three/rapier'
import { Level } from './Level'
import { Light } from './Light'
import { Player } from './Player'

export const Experience = () => {
  const blocksCount = useGame((state) => state.blocksCount)
  const blocksSeed = useGame((state) => state.blocksSeed)
  return (
    <>
      {/* <Perf position='top-left' /> */}
      {/* <OrbitControls /> */}
      <Physics>
        <Light />
        <Level
          count={blocksCount}
          seed={blocksSeed}
        />
        <Player />
      </Physics>
    </>
  )
}
