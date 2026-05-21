import { useEffect, useRef } from 'react'

type Flower = {
  x: number
  y: number
  size: number
  delay: number
  duration: number
  rotation: number
  spin: number
  drift: number
  color: string
  light: string
  center: string
}

const palettes = [
  ['#d78482', '#fff0ea', '#a4664e'],
  ['#e0a07c', '#fff4df', '#a4664e'],
  ['#e8c49d', '#fffaf0', '#a77954'],
  ['#c56c78', '#f8e6ee', '#8c5362'],
  ['#b9c58b', '#f0f4d6', '#718255'],
]

export function FlowerFinale({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!active || !canvas) {
      return undefined
    }

    const context = canvas.getContext('2d', { alpha: true })
    if (!context) {
      return undefined
    }

    let width = 0
    let height = 0
    let ratio = 1
    let frame = 0
    let start = performance.now()
    let flowers: Flower[] = []

    const createFlower = (): Flower => {
      const palette = palettes[Math.floor(Math.random() * palettes.length)]

      return {
        x: Math.random(),
        y: Math.random(),
        size: 22 + Math.random() * 46,
        delay: Math.random() * 1.2,
        duration: 4.6 + Math.random() * 2.3,
        rotation: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 1.4,
        drift: -36 - Math.random() * 78,
        color: palette[0],
        light: palette[1],
        center: palette[2],
      }
    }

    const resize = () => {
      ratio = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.floor(width * ratio)
      canvas.height = Math.floor(height * ratio)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      flowers = Array.from({ length: Math.min(34, Math.max(20, Math.floor(width / 30))) }, createFlower)
    }

    const easeOut = (value: number) => 1 - Math.pow(1 - value, 3)
    const drawFlower = (flower: Flower, progress: number) => {
      const open = easeOut(Math.min(progress * 3.4, 1))
      const fade = progress < 0.74 ? 1 : Math.max(0, 1 - (progress - 0.74) / 0.26)
      const x = flower.x * width + Math.sin(progress * Math.PI * 2 + flower.rotation) * 18
      const y = flower.y * height + flower.drift * progress
      const size = flower.size * (0.2 + open * 0.86)

      context.save()
      context.translate(x, y)
      context.rotate(flower.rotation + flower.spin * progress)
      context.globalAlpha = fade * Math.min(1, open * 1.25)

      for (let index = 0; index < 6; index += 1) {
        context.save()
        context.rotate((Math.PI * 2 * index) / 6)
        const gradient = context.createRadialGradient(0, -size * 0.34, 1, 0, -size * 0.34, size)
        gradient.addColorStop(0, flower.light)
        gradient.addColorStop(0.62, flower.color)
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
        context.fillStyle = gradient
        context.beginPath()
        context.ellipse(0, -size * 0.36, size * 0.22, size * 0.52, 0, 0, Math.PI * 2)
        context.fill()
        context.restore()
      }

      context.fillStyle = flower.center
      context.beginPath()
      context.arc(0, 0, size * 0.13, 0, Math.PI * 2)
      context.fill()
      context.restore()
    }

    const render = (timeStamp: number) => {
      const elapsed = (timeStamp - start) / 1000
      context.clearRect(0, 0, width, height)

      const glow = Math.max(0, 1 - elapsed / 6)
      context.save()
      context.globalAlpha = Math.min(0.26, glow * 0.26)
      context.fillStyle = '#fff2e4'
      context.fillRect(0, 0, width, height)
      context.restore()

      for (const flower of flowers) {
        const localTime = elapsed - flower.delay
        if (localTime < 0) {
          continue
        }

        drawFlower(flower, Math.min(localTime / flower.duration, 1))
      }

      if (elapsed < 7.2) {
        frame = window.requestAnimationFrame(render)
      } else {
        context.clearRect(0, 0, width, height)
      }
    }

    resize()
    start = performance.now()
    frame = window.requestAnimationFrame(render)
    window.addEventListener('resize', resize)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
    }
  }, [active])

  if (!active) {
    return null
  }

  return <canvas className="flower-finale" ref={canvasRef} aria-hidden="true" />
}
