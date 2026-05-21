import { useEffect, useRef } from 'react'

type Petal = {
  x: number
  y: number
  size: number
  drift: number
  speed: number
  spin: number
  phase: number
  alpha: number
  tint: string
}

const petalTints = ['#ead1cf', '#f3ded7', '#d9aca9', '#f7e8df', '#c88984']

export function PetalCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return undefined
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const context = canvas.getContext('2d', { alpha: true })
    if (!context) {
      return undefined
    }

    let width = 0
    let height = 0
    let ratio = 1
    let frame = 0
    let petals: Petal[] = []

    const createPetal = (index: number): Petal => ({
      x: Math.random() * width,
      y: Math.random() * height - height,
      size: 9 + Math.random() * 18,
      drift: 0.16 + Math.random() * 0.5,
      speed: 0.28 + Math.random() * 0.7,
      spin: (Math.random() - 0.5) * 0.026,
      phase: Math.random() * Math.PI * 2 + index,
      alpha: 0.24 + Math.random() * 0.32,
      tint: petalTints[Math.floor(Math.random() * petalTints.length)],
    })

    const resize = () => {
      ratio = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.floor(width * ratio)
      canvas.height = Math.floor(height * ratio)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      const count = reducedMotion.matches ? 14 : Math.min(48, Math.floor(width / 18))
      petals = Array.from({ length: count }, (_, index) => createPetal(index))
    }

    const drawPetal = (petal: Petal, time: number) => {
      const wobble = Math.sin(time * petal.drift + petal.phase) * 22
      const rotation = time * petal.spin + Math.sin(time * 0.7 + petal.phase) * 0.9

      context.save()
      context.translate(petal.x + wobble, petal.y)
      context.rotate(rotation)
      context.globalAlpha = petal.alpha

      const gradient = context.createRadialGradient(0, 0, 1, 0, 0, petal.size)
      gradient.addColorStop(0, '#fff8f3')
      gradient.addColorStop(0.52, petal.tint)
      gradient.addColorStop(1, 'rgba(172, 96, 92, 0)')
      context.fillStyle = gradient

      context.beginPath()
      context.moveTo(0, -petal.size * 0.62)
      context.bezierCurveTo(
        petal.size * 0.58,
        -petal.size * 0.42,
        petal.size * 0.78,
        petal.size * 0.22,
        0,
        petal.size * 0.72,
      )
      context.bezierCurveTo(
        -petal.size * 0.68,
        petal.size * 0.22,
        -petal.size * 0.46,
        -petal.size * 0.44,
        0,
        -petal.size * 0.62,
      )
      context.fill()

      context.strokeStyle = 'rgba(128, 79, 75, 0.12)'
      context.lineWidth = 0.8
      context.beginPath()
      context.moveTo(0, -petal.size * 0.38)
      context.lineTo(0, petal.size * 0.42)
      context.stroke()
      context.restore()
    }

    const render = (timeStamp: number) => {
      const time = timeStamp / 1000
      context.clearRect(0, 0, width, height)

      for (const petal of petals) {
        petal.y += petal.speed
        petal.x += Math.sin(time * 0.45 + petal.phase) * 0.07

        if (petal.y > height + 48) {
          Object.assign(petal, createPetal(Math.floor(timeStamp)))
          petal.y = -40 - Math.random() * 140
        }

        drawPetal(petal, time)
      }

      frame = window.requestAnimationFrame(render)
    }

    resize()
    frame = window.requestAnimationFrame(render)
    window.addEventListener('resize', resize)
    reducedMotion.addEventListener('change', resize)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      reducedMotion.removeEventListener('change', resize)
    }
  }, [])

  return <canvas className="petal-canvas" ref={canvasRef} aria-hidden="true" />
}
