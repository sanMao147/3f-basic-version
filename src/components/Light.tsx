export const Light = () => {
  return (
    <>
      <directionalLight
        position={[1, 2, 5]}
        intensity={1.25}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
      />
      <ambientLight intensity={0.5} />
    </>
  )
}
