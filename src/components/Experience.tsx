import { OrbitControls } from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import { Level } from './Level'
import { Light } from './Light'
export const Experience = () => {
  return (
    <>
      {/* <Perf position='top-left' /> */}
      <OrbitControls />
      <Physics>
        <Light />
        <Level />
      </Physics>
    </>
  )
}
