import { useMarbleGame } from '@/store/useMarbleGame'
import { Physics } from '@react-three/rapier'
import { Level } from './Level'
import { Light } from './Light'
import { Player } from './Player'

export const Experience = () => {
  const blocksCount = useMarbleGame((state) => state.blocksCount)
  return (
    <>
      {/* <Perf position='top-left' /> */}
      {/* <OrbitControls /> */}
      <Physics>
        <Light />
        <Level count={blocksCount} />
        <Player />
      </Physics>
    </>
  )
}
