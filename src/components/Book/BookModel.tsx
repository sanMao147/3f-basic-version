import { useBookStore } from '@/store/useBookStore'
import { useCursor, useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { easing } from 'maath'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Bone,
  BoxGeometry,
  Color,
  Float32BufferAttribute,
  Group,
  MathUtils,
  MeshStandardMaterial,
  Skeleton,
  SkinnedMesh,
  SRGBColorSpace,
  Uint16BufferAttribute,
  Vector3,
} from 'three'
import { degToRad } from 'three/src/math/MathUtils.js'
import {
  AllTexturePaths,
  getTexturePath,
  type TextureKey,
} from './BookTextures'

const easingFactor = 0.5
const easingFactorFold = 0.3
const insideCurveStrength = 0.18
const outsideCurveStrength = 0.05
const turningCurveStrength = 0.09

const PAGE_WIDTH = 1.28
const PAGE_HEIGHT = 1.71
const PAGE_DEPTH = 0.003
const PAGE_SEGMENTS = 30
const SEGMENT_WIDTH = PAGE_WIDTH / PAGE_SEGMENTS

const pageGeometry = new BoxGeometry(
  PAGE_WIDTH,
  PAGE_HEIGHT,
  PAGE_DEPTH,
  PAGE_SEGMENTS,
  2
)

pageGeometry.translate(PAGE_WIDTH / 2, 0, 0)

const position = pageGeometry.attributes.position
const vertex = new Vector3()
const skinIndexes: number[] = []
const skinWeights: number[] = []

for (let i = 0; i < position.count; i++) {
  vertex.fromBufferAttribute(position, i)
  const x = vertex.x
  const skinIndex = Math.max(0, Math.floor(x / SEGMENT_WIDTH))
  const skinWeight = (x % SEGMENT_WIDTH) / SEGMENT_WIDTH

  skinIndexes.push(skinIndex, skinIndex + 1, 0, 0)
  skinWeights.push(1 - skinWeight, skinWeight, 0, 0)
}

pageGeometry.setAttribute(
  'skinIndex',
  new Uint16BufferAttribute(skinIndexes, 4)
)
pageGeometry.setAttribute(
  'skinWeight',
  new Float32BufferAttribute(skinWeights, 4)
)

const whiteColor = new Color('white')
const emissiveColor = new Color('orange')

const pageMaterials = [
  new MeshStandardMaterial({ color: whiteColor }),
  new MeshStandardMaterial({ color: '#111' }),
  new MeshStandardMaterial({ color: whiteColor }),
  new MeshStandardMaterial({ color: whiteColor }),
]

interface PageProps {
  number: number
  front: string
  back: string
  page: number
  opened: boolean
  bookClosed: boolean
  totalPages: number
}

const Page = ({
  number,
  front,
  back,
  page: delayedPage,
  opened,
  bookClosed,
  totalPages,
  ...props
}: PageProps) => {
  const [picture, picture2, pictureRoughness] = useTexture([
    getTexturePath(front as TextureKey),
    getTexturePath(back as TextureKey),
    ...(number === 0 || number === totalPages - 1
      ? [getTexturePath('book-cover-roughness')]
      : []),
  ])
  picture.colorSpace = picture2.colorSpace = SRGBColorSpace
  if (pictureRoughness) {
    pictureRoughness.colorSpace = SRGBColorSpace
  }

  const group = useRef<Group>(null)
  const turnedAt = useRef(0)
  const lastOpened = useRef(opened)
  const skinnedMeshRef = useRef<SkinnedMesh>(null)
  const [highlighted, setHighlighted] = useState(false)
  const { setPage } = useBookStore()

  const manualSkinnedMesh = useMemo(() => {
    const bones: Bone[] = []
    for (let i = 0; i <= PAGE_SEGMENTS; i++) {
      const bone = new Bone()
      bones.push(bone)
      if (i === 0) {
        bone.position.x = 0
      } else {
        bone.position.x = SEGMENT_WIDTH
      }
      if (i > 0) {
        bones[i - 1].add(bone)
      }
    }
    const skeleton = new Skeleton(bones)

    const materials = [
      ...pageMaterials,
      new MeshStandardMaterial({
        color: whiteColor,
        map: picture,
        ...(number === 0
          ? {
              roughnessMap: pictureRoughness,
            }
          : {
              roughness: 0.1,
            }),
        emissive: emissiveColor,
        emissiveIntensity: 0,
      }),
      new MeshStandardMaterial({
        color: whiteColor,
        map: picture2,
        ...(number === totalPages - 1
          ? {
              roughnessMap: pictureRoughness,
            }
          : {
              roughness: 0.1,
            }),
        emissive: emissiveColor,
        emissiveIntensity: 0,
      }),
    ]
    const mesh = new SkinnedMesh(pageGeometry, materials)
    mesh.castShadow = true
    mesh.receiveShadow = true
    mesh.frustumCulled = false
    mesh.add(skeleton.bones[0])
    mesh.bind(skeleton)
    return mesh
  }, [picture, picture2, pictureRoughness, number, totalPages])

  useFrame((_, delta) => {
    if (!skinnedMeshRef.current) {
      return
    }

    const emissiveIntensity = highlighted ? 0.22 : 0
    const materials = skinnedMeshRef.current.material
    if (Array.isArray(materials)) {
      const mat4 = materials[4] as MeshStandardMaterial
      const mat5 = materials[5] as MeshStandardMaterial
      mat4.emissiveIntensity = mat5.emissiveIntensity = MathUtils.lerp(
        mat4.emissiveIntensity,
        emissiveIntensity,
        0.1
      )
    }

    if (lastOpened.current !== opened) {
      turnedAt.current = +new Date()
      lastOpened.current = opened
    }
    let turningTime = Math.min(400, +new Date() - turnedAt.current) / 400
    turningTime = Math.sin(turningTime * Math.PI)

    let targetRotation = opened ? -Math.PI / 2 : Math.PI / 2
    if (!bookClosed) {
      targetRotation += degToRad(number * 0.8)
    }

    const bones = skinnedMeshRef.current.skeleton.bones
    for (let i = 0; i < bones.length; i++) {
      const target = i === 0 ? group.current : bones[i]
      if (!target) continue

      const insideCurveIntensity = i < 8 ? Math.sin(i * 0.2 + 0.25) : 0
      const outsideCurveIntensity = i >= 8 ? Math.cos(i * 0.3 + 0.09) : 0
      const turningIntensity =
        Math.sin(i * Math.PI * (1 / bones.length)) * turningTime
      let rotationAngle =
        insideCurveStrength * insideCurveIntensity * targetRotation -
        outsideCurveStrength * outsideCurveIntensity * targetRotation +
        turningCurveStrength * turningIntensity * targetRotation
      let foldRotationAngle = degToRad(Math.sign(targetRotation) * 2)
      if (bookClosed) {
        if (i === 0) {
          rotationAngle = targetRotation
          foldRotationAngle = 0
        } else {
          rotationAngle = 0
          foldRotationAngle = 0
        }
      }
      easing.dampAngle(target.rotation, 'y', rotationAngle, easingFactor, delta)

      const foldIntensity =
        i > 8
          ? Math.sin(i * Math.PI * (1 / bones.length) - 0.5) * turningTime
          : 0
      easing.dampAngle(
        target.rotation,
        'x',
        foldRotationAngle * foldIntensity,
        easingFactorFold,
        delta
      )
    }
  })

  useCursor(highlighted)

  return (
    <group
      {...props}
      ref={group}
      onPointerEnter={(e) => {
        e.stopPropagation()
        setHighlighted(true)
      }}
      onPointerLeave={(e) => {
        e.stopPropagation()
        setHighlighted(false)
      }}
      onClick={(e) => {
        e.stopPropagation()
        setPage(opened ? number : number + 1)
        setHighlighted(false)
      }}
    >
      <primitive
        object={manualSkinnedMesh}
        ref={skinnedMeshRef}
        position-z={-number * PAGE_DEPTH + delayedPage * PAGE_DEPTH}
      />
    </group>
  )
}

export const BookModel = ({ ...props }: React.ComponentProps<'group'>) => {
  const { page, pages } = useBookStore()
  const [delayedPage, setDelayedPage] = useState(page)

  // 预加载纹理
  useEffect(() => {
    AllTexturePaths.forEach((path) => {
      useTexture.preload(path)
    })
  }, [])

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined
    const goToPage = () => {
      setDelayedPage((prev) => {
        if (page === prev) {
          if (timeout) clearTimeout(timeout)
          return prev
        } else {
          timeout = setTimeout(
            () => {
              goToPage()
            },
            Math.abs(page - prev) > 2 ? 50 : 150
          )
          if (page > prev) {
            return prev + 1
          }
          if (page < prev) {
            return prev - 1
          }
          return prev
        }
      })
    }
    goToPage()
    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [page])

  return (
    <group
      {...props}
      rotation-y={-Math.PI / 2}
    >
      {pages.map((pageData, index) => (
        <Page
          key={index}
          page={delayedPage}
          number={index}
          opened={delayedPage > index}
          bookClosed={delayedPage === 0 || delayedPage === pages.length}
          totalPages={pages.length}
          {...pageData}
        />
      ))}
    </group>
  )
}
