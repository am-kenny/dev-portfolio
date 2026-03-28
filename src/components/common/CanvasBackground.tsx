import { useCallback, useEffect, useRef } from 'react'
import { useTheme } from '../../context/ThemeContext'

/** Must match `index.css` `--theme-transition-duration` (0.45s → 450ms) */
const THEME_BLEND_MS = 450

/**
 * Light theme neural network colors (edges + nodes + pulses).
 * Change this one line to try another look:
 * - **darklite** — same cyan / blue / violet family as dark theme (default)
 * - **honey** — rich gold & amber (warm paper)
 * - **coral** — peach & soft rose (sunset warmth)
 * - **seaglass** — aqua & mint (fresh, calm)
 * - **lavender** — lilac & periwinkle (soft, premium)
 */
export type LightNeuralTheme =
  | 'darklite'
  | 'honey'
  | 'coral'
  | 'seaglass'
  | 'lavender'
export const LIGHT_NEURAL_THEME: LightNeuralTheme = 'darklite'

/** Maps simulation hue to a palette-friendly hue for light mode (no gray/black cores). */
function lightNeuralDisplayHue(
  nodeHue: number,
  theme: LightNeuralTheme
): number {
  const t = (((nodeHue % 360) + 360) % 360) / 360
  switch (theme) {
    case 'darklite':
      return ((nodeHue % 360) + 360) % 360
    case 'honey':
      // ~43–54° = true gold (less orange), still varied per node
      return 43 + t * 11
    case 'coral':
      return 6 + t * 26
    case 'seaglass':
      return 158 + t * 28
    case 'lavender':
      return 262 + t * 22
    default:
      return ((nodeHue % 360) + 360) % 360
  }
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

interface ThemeTransition {
  start: number
  from: number
  to: number
}

interface Node {
  x: number
  y: number
  vx: number
  vy: number
  baseRadius: number
  pulseOffset: number
  hue: number
}

interface Pulse {
  progress: number
  speed: number
  strength: number
}

interface Connection {
  from: number
  to: number
  pulses: Pulse[]
}

function createNodes(count: number, width: number, height: number): Node[] {
  const nodes: Node[] = []
  for (let i = 0; i < count; i++) {
    const layer = i < count * 0.3 ? 0 : i < count * 0.7 ? 1 : 2
    const hueBase = layer === 0 ? 190 : layer === 1 ? 220 : 280
    const radiusBase = layer === 0 ? 3.5 : layer === 1 ? 2.8 : 2.2

    nodes.push({
      x: width * (0.18 + Math.random() * 0.64),
      // allow nodes to live well above and below the viewport
      // so parallax scrolling never reveals an empty band of plain background
      y: height * (-0.4 + Math.random() * 2.2),
      vx: (Math.random() - 0.5) * 0.08,
      vy: (Math.random() - 0.5) * 0.08,
      baseRadius: radiusBase + Math.random() * 1.2,
      pulseOffset: Math.random() * Math.PI * 2,
      hue: hueBase + Math.random() * 18,
    })
  }
  return nodes
}

function createConnections(nodes: Node[], density = 0.22): Connection[] {
  const conns: Connection[] = []
  const n = nodes.length
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (Math.random() > density) continue
      const dx = nodes[i].x - nodes[j].x
      const dy = nodes[i].y - nodes[j].y
      const dist = Math.hypot(dx, dy)
      if (dist < 260) {
        conns.push({ from: i, to: j, pulses: [] })
      }
    }
  }
  return conns
}

function drawNeuralNetwork(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  nodes: Node[],
  connections: Connection[],
  time: number,
  pointerX: number,
  pointerY: number,
  scrollParallax: number,
  isDark: boolean
): void {
  ctx.save()

  ctx.translate(0, -scrollParallax)

  const radius = Math.max(width, height) * 1.8
  const centerY = height * 0.3 - scrollParallax * 0.3

  if (isDark) {
    const glowGradient = ctx.createRadialGradient(
      width * 0.5,
      centerY,
      0,
      width * 0.5,
      centerY,
      radius
    )
    glowGradient.addColorStop(0, 'rgba(15, 23, 42, 0.55)')
    glowGradient.addColorStop(0.45, 'rgba(15, 23, 42, 0.9)')
    glowGradient.addColorStop(1, 'rgba(2, 6, 23, 1)')

    const verticalGradient = ctx.createLinearGradient(0, -height, 0, height * 2)
    verticalGradient.addColorStop(0, '#020617')
    verticalGradient.addColorStop(0.4, '#020617')
    verticalGradient.addColorStop(1, '#020617')

    ctx.fillStyle = verticalGradient
    ctx.fillRect(-width, -height, width * 3, height * 3)
    ctx.fillStyle = glowGradient
    ctx.fillRect(-width, -height, width * 3, height * 3)
  } else if (LIGHT_NEURAL_THEME === 'darklite') {
    // Warm neutral paper — no blue/slate cast; neon graph provides the cool colors
    const verticalGradient = ctx.createLinearGradient(0, -height, 0, height * 2)
    verticalGradient.addColorStop(0, '#fffdfb')
    verticalGradient.addColorStop(0.45, '#faf7f3')
    verticalGradient.addColorStop(1, '#f0ebe6')

    const mistGlow = ctx.createRadialGradient(
      width * 0.5,
      height * 0.07,
      0,
      width * 0.5,
      height * 0.24,
      radius * 0.55
    )
    mistGlow.addColorStop(0, 'rgba(255, 237, 213, 0.35)')
    mistGlow.addColorStop(0.42, 'rgba(254, 215, 170, 0.12)')
    mistGlow.addColorStop(1, 'rgba(255, 253, 251, 0)')

    // No gray “corner depth” here — stone tints read as dirty on warm paper

    ctx.fillStyle = verticalGradient
    ctx.fillRect(-width, -height, width * 3, height * 3)
    ctx.fillStyle = mistGlow
    ctx.fillRect(-width, -height, width * 3, height * 3)
  } else {
    // Warm golden paper + honey atmosphere
    const verticalGradient = ctx.createLinearGradient(0, -height, 0, height * 2)
    verticalGradient.addColorStop(0, '#fffbf5')
    verticalGradient.addColorStop(0.42, '#fff5e8')
    verticalGradient.addColorStop(1, '#f0e4d4')

    const dawnGlow = ctx.createRadialGradient(
      width * 0.5,
      height * 0.06,
      0,
      width * 0.5,
      height * 0.22,
      radius * 0.5
    )
    dawnGlow.addColorStop(0, 'rgba(255, 228, 170, 0.5)')
    dawnGlow.addColorStop(0.45, 'rgba(251, 191, 106, 0.16)')
    dawnGlow.addColorStop(1, 'rgba(255, 251, 245, 0)')

    const cornerDepth = ctx.createRadialGradient(
      width * 0.92,
      height * 0.88,
      0,
      width * 0.55,
      height * 0.55,
      radius * 0.85
    )
    cornerDepth.addColorStop(0, 'rgba(196, 150, 80, 0.1)')
    cornerDepth.addColorStop(0.55, 'rgba(230, 200, 150, 0.06)')
    cornerDepth.addColorStop(1, 'rgba(250, 240, 228, 0)')

    ctx.fillStyle = verticalGradient
    ctx.fillRect(-width, -height, width * 3, height * 3)
    ctx.fillStyle = dawnGlow
    ctx.fillRect(-width, -height, width * 3, height * 3)
    ctx.fillStyle = cornerDepth
    ctx.fillRect(-width, -height, width * 3, height * 3)
  }

  const px = pointerX * width
  const py = pointerY * height - scrollParallax * 0.4

  // `lighter` only works on dark pixels; on warm paper it washes neon out — use source-over for light darklite
  ctx.globalCompositeOperation = isDark ? 'lighter' : 'source-over'
  ctx.lineCap = 'round'

  connections.forEach((conn) => {
    const from = nodes[conn.from]
    const to = nodes[conn.to]
    const dx = to.x - from.x
    const dy = to.y - from.y
    const dist = Math.hypot(dx, dy)
    if (dist <= 0.001) return

    const midX = (from.x + to.x) / 2
    const midY = (from.y + to.y) / 2
    const pdx = midX - px
    const pdy = midY - py
    const pinfluence = Math.max(0, 1 - Math.hypot(pdx, pdy) / 420)
    const baseAlpha = isDark
      ? 0.12 + pinfluence * 0.22
      : LIGHT_NEURAL_THEME === 'darklite'
        ? 0.2 + pinfluence * 0.32
        : 0.08 + pinfluence * 0.14
    const lineWidth =
      LIGHT_NEURAL_THEME === 'darklite' && !isDark
        ? 1.2 + pinfluence * 1.35
        : 1 + pinfluence * 1.1

    const hueAvg = (from.hue + to.hue) / 2
    const hue = isDark
      ? hueAvg
      : lightNeuralDisplayHue(hueAvg, LIGHT_NEURAL_THEME)
    const gradient = ctx.createLinearGradient(from.x, from.y, to.x, to.y)
    if (isDark) {
      gradient.addColorStop(0, `hsla(${hue}, 90%, 68%, ${baseAlpha})`)
      gradient.addColorStop(
        0.5,
        `hsla(${hue + 10}, 98%, 72%, ${baseAlpha * 1.3})`
      )
      gradient.addColorStop(1, `hsla(${hue + 20}, 90%, 68%, ${baseAlpha})`)
    } else if (LIGHT_NEURAL_THEME === 'darklite') {
      const a = baseAlpha
      gradient.addColorStop(0, `hsla(${hue}, 92%, 40%, ${a})`)
      gradient.addColorStop(0.5, `hsla(${hue + 10}, 96%, 36%, ${a * 1.12})`)
      gradient.addColorStop(1, `hsla(${hue + 18}, 90%, 44%, ${a})`)
    } else {
      const a = baseAlpha
      if (LIGHT_NEURAL_THEME === 'honey') {
        gradient.addColorStop(0, `hsla(${hue}, 95%, 46%, ${a * 1.08})`)
        gradient.addColorStop(0.5, `hsla(${hue + 5}, 98%, 40%, ${a * 1.12})`)
        gradient.addColorStop(1, `hsla(${hue + 10}, 92%, 50%, ${a})`)
      } else {
        gradient.addColorStop(0, `hsla(${hue}, 78%, 52%, ${a})`)
        gradient.addColorStop(0.5, `hsla(${hue + 12}, 88%, 46%, ${a * 1.08})`)
        gradient.addColorStop(1, `hsla(${hue + 22}, 78%, 54%, ${a})`)
      }
    }

    ctx.strokeStyle = gradient
    ctx.lineWidth = lineWidth
    ctx.beginPath()
    ctx.moveTo(from.x, from.y)
    ctx.lineTo(to.x, to.y)
    ctx.stroke()

    const now = time
    if (Math.random() < 0.00015 && conn.pulses.length < 3) {
      conn.pulses.push({
        progress: Math.random() * 0.3,
        speed: 0.00035 + Math.random() * 0.00045,
        strength: 0.6 + Math.random() * 0.6,
      })
    }

    conn.pulses = conn.pulses.filter((pulse) => pulse.progress < 1.2)
    conn.pulses.forEach((pulse) => {
      pulse.progress += pulse.speed * (11 + Math.sin(now * 0.001) * 4)
      const t = pulse.progress
      if (t < 0 || t > 1.05) return

      const ex = from.x + dx * t
      const ey = from.y + dy * t
      const size = 2.2 + pulse.strength * 4
      const alpha = (1 - Math.abs(t - 0.5) * 1.5) * pulse.strength

      const pulseGradient = ctx.createRadialGradient(
        ex,
        ey,
        0,
        ex,
        ey,
        size * 6
      )
      if (isDark) {
        pulseGradient.addColorStop(0, `hsla(${hue + 10}, 100%, 80%, ${alpha})`)
        pulseGradient.addColorStop(
          0.4,
          `hsla(${hue + 20}, 100%, 70%, ${alpha * 0.5})`
        )
        pulseGradient.addColorStop(1, 'transparent')
      } else if (LIGHT_NEURAL_THEME === 'darklite') {
        const p = alpha * 0.85
        pulseGradient.addColorStop(0, `hsla(${hue + 8}, 100%, 52%, ${p})`)
        pulseGradient.addColorStop(
          0.45,
          `hsla(${hue + 18}, 96%, 42%, ${p * 0.55})`
        )
        pulseGradient.addColorStop(
          0.82,
          `hsla(${hue + 10}, 70%, 94%, ${p * 0.08})`
        )
        pulseGradient.addColorStop(1, 'rgba(255, 253, 251, 0)')
      } else {
        const p = alpha * 0.55
        if (LIGHT_NEURAL_THEME === 'honey') {
          pulseGradient.addColorStop(
            0,
            `hsla(${hue + 2}, 100%, 58%, ${p * 1.12})`
          )
          pulseGradient.addColorStop(
            0.45,
            `hsla(${hue + 6}, 96%, 48%, ${p * 0.68})`
          )
        } else {
          pulseGradient.addColorStop(0, `hsla(${hue + 6}, 95%, 62%, ${p})`)
          pulseGradient.addColorStop(
            0.45,
            `hsla(${hue + 18}, 92%, 54%, ${p * 0.55})`
          )
        }
        pulseGradient.addColorStop(1, 'transparent')
      }

      ctx.fillStyle = pulseGradient
      ctx.beginPath()
      ctx.arc(ex, ey, size * 6, 0, Math.PI * 2)
      ctx.fill()
    })
  })

  nodes.forEach((node, index) => {
    const t = time * 0.0015 + node.pulseOffset
    const radius = node.baseRadius + Math.sin(t) * 1.1

    const dx = node.x - px
    const dy = node.y - py
    const dist = Math.hypot(dx, dy)
    const influence = Math.max(0, 1 - dist / 520)

    const glowRadius = radius * (5 + influence * 3.5)

    const gradient = ctx.createRadialGradient(
      node.x,
      node.y,
      0,
      node.x,
      node.y,
      glowRadius
    )

    const baseHue = node.hue + influence * 20
    const isHub = index % 7 === 0
    const hubBoost = isHub ? 1.4 : 1

    if (isDark) {
      gradient.addColorStop(
        0,
        `hsla(${baseHue}, 100%, ${72 * hubBoost}%, ${0.95})`
      )
      gradient.addColorStop(
        0.4,
        `hsla(${baseHue + 14}, 95%, ${60 * hubBoost}%, ${0.45})`
      )
      gradient.addColorStop(1, 'transparent')

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(node.x, node.y, glowRadius, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = `hsla(${baseHue}, 100%, 80%, 1)`
      ctx.beginPath()
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2)
      ctx.fill()
    } else if (LIGHT_NEURAL_THEME === 'darklite') {
      const bh = lightNeuralDisplayHue(baseHue, LIGHT_NEURAL_THEME)
      const glowCore = 0.55 + (hubBoost - 1) * 0.15
      const glowMid = 0.38 + (hubBoost - 1) * 0.1
      // Fade to paper (#fffdfb) — never use `transparent` (interpolates via gray/black and looks muddy)
      gradient.addColorStop(0, `hsla(${bh}, 100%, 58%, ${glowCore})`)
      gradient.addColorStop(0.3, `hsla(${bh + 10}, 92%, 70%, ${glowMid * 0.9})`)
      gradient.addColorStop(0.52, `hsla(${bh + 6}, 78%, 86%, ${glowMid * 0.5})`)
      gradient.addColorStop(0.74, `hsla(${bh}, 50%, 96%, 0.07)`)
      gradient.addColorStop(1, 'rgba(255, 253, 251, 0)')

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(node.x, node.y, glowRadius, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = `hsla(${bh}, 96%, 42%, 1)`
      ctx.beginPath()
      ctx.arc(node.x, node.y, radius * 1.05, 0, Math.PI * 2)
      ctx.fill()
    } else {
      const dh = lightNeuralDisplayHue(baseHue, LIGHT_NEURAL_THEME)
      const glowCore = 0.38 + (hubBoost - 1) * 0.12
      const glowMid = 0.24 + (hubBoost - 1) * 0.08
      if (LIGHT_NEURAL_THEME === 'honey') {
        gradient.addColorStop(0, `hsla(${dh}, 98%, 76%, ${glowCore * 1.08})`)
        gradient.addColorStop(
          0.42,
          `hsla(${dh + 8}, 95%, 64%, ${glowMid * 1.05})`
        )
        gradient.addColorStop(1, 'transparent')

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(node.x, node.y, glowRadius, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = `hsla(${dh}, 90%, 38%, 0.97)`
        ctx.beginPath()
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2)
        ctx.fill()
      } else {
        gradient.addColorStop(0, `hsla(${dh}, 96%, 72%, ${glowCore})`)
        gradient.addColorStop(0.42, `hsla(${dh + 16}, 92%, 62%, ${glowMid})`)
        gradient.addColorStop(1, 'transparent')

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(node.x, node.y, glowRadius, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = `hsla(${dh}, 82%, 44%, 0.96)`
        ctx.beginPath()
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  })

  ctx.restore()
}

export default function CanvasBackground(): JSX.Element {
  const { theme } = useTheme()
  /** 0 = light scene, 1 = dark scene — used for crossfading canvas draws */
  const themeBlendRef = useRef(theme === 'dark' ? 1 : 0)
  const themeTransitionRef = useRef<ThemeTransition | null>(null)

  useEffect(() => {
    const to = theme === 'dark' ? 1 : 0
    const from = themeBlendRef.current
    if (Math.abs(from - to) < 0.001) {
      themeTransitionRef.current = null
      return
    }
    themeTransitionRef.current = {
      start: performance.now(),
      from,
      to,
    }
  }, [theme])

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<number>(0)
  const pointerRef = useRef({ x: 0.5, y: 0.5 })
  const nodesRef = useRef<Node[]>([])
  const connectionsRef = useRef<Connection[]>([])
  // store raw scroll position for parallax
  const scrollRef = useRef(0)

  const initNetwork = useCallback((width: number, height: number) => {
    if (width <= 0 || height <= 0) return
    const count = Math.floor(40 + Math.min(width, height) * 0.06)
    const nodes = createNodes(count, width, height)
    const connections = createConnections(nodes)
    nodesRef.current = nodes
    connectionsRef.current = connections
  }, [])

  /** Full-viewport background is behind content (`-z-10`), so div `pointermove` never fires over the page — track on `window`. */
  const updatePointerFromClient = useCallback(
    (clientX: number, clientY: number) => {
      const el = containerRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const w = Math.max(rect.width, 1)
      const h = Math.max(rect.height, 1)
      pointerRef.current = {
        x: (clientX - rect.left) / w,
        y: (clientY - rect.top) / h,
      }
    },
    []
  )

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let time = 0

    const setSize = (): void => {
      if (!container.parentElement) return
      const rect = container.getBoundingClientRect()
      const w = Math.max(rect.width, 1)
      const h = Math.max(rect.height, 1)
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
        initNetwork(w, h)
      }
    }

    const onScroll = (): void => {
      scrollRef.current = window.scrollY || 0
    }

    window.addEventListener('scroll', onScroll, { passive: true })

    const onWindowPointerMove = (e: PointerEvent): void => {
      updatePointerFromClient(e.clientX, e.clientY)
    }
    window.addEventListener('pointermove', onWindowPointerMove, {
      passive: true,
    })

    const tick = (): void => {
      setSize()
      const delta = 16
      time += delta
      const width = canvas.width
      const height = canvas.height
      if (width <= 0 || height <= 0) {
        frameRef.current = requestAnimationFrame(tick)
        return
      }
      const { x: px, y: py } = pointerRef.current
      const scrollAmount = scrollRef.current
      // smaller, clamped parallax factor, since nodes now span far beyond viewport
      let scrollParallax = (scrollAmount / Math.max(height, 1)) * 24
      scrollParallax = Math.max(-120, Math.min(120, scrollParallax))

      const nodes = nodesRef.current
      const connections = connectionsRef.current

      // drift nodes very subtly for a living feel
      nodes.forEach((node) => {
        const t = time * 0.00012 + node.pulseOffset
        node.vx += Math.sin(t * 1.7) * 0.002
        node.vy += Math.cos(t * 1.3) * 0.002

        node.x += node.vx
        node.y += node.vy

        node.vx *= 0.985
        node.vy *= 0.985

        if (node.x < width * 0.1 || node.x > width * 0.9) node.vx *= -1
        if (node.y < height * 0.1 || node.y > height * 0.9) node.vy *= -1
      })

      let blend = themeBlendRef.current
      const tr = themeTransitionRef.current
      if (tr) {
        const elapsed = performance.now() - tr.start
        const t = Math.min(1, elapsed / THEME_BLEND_MS)
        const eased = easeInOutCubic(t)
        blend = tr.from + (tr.to - tr.from) * eased
        themeBlendRef.current = blend
        if (t >= 1) {
          themeTransitionRef.current = null
          themeBlendRef.current = tr.to
          blend = tr.to
        }
      }

      const EPS = 0.002
      if (blend <= EPS) {
        drawNeuralNetwork(
          ctx,
          width,
          height,
          nodes,
          connections,
          time,
          px,
          py,
          scrollParallax,
          false
        )
      } else if (blend >= 1 - EPS) {
        drawNeuralNetwork(
          ctx,
          width,
          height,
          nodes,
          connections,
          time,
          px,
          py,
          scrollParallax,
          true
        )
      } else {
        ctx.save()
        ctx.globalAlpha = 1 - blend
        drawNeuralNetwork(
          ctx,
          width,
          height,
          nodes,
          connections,
          time,
          px,
          py,
          scrollParallax,
          false
        )
        ctx.restore()
        ctx.save()
        ctx.globalAlpha = blend
        drawNeuralNetwork(
          ctx,
          width,
          height,
          nodes,
          connections,
          time,
          px,
          py,
          scrollParallax,
          true
        )
        ctx.restore()
      }

      frameRef.current = requestAnimationFrame(tick)
    }

    setSize()
    frameRef.current = requestAnimationFrame(tick)

    const resizeObserver = new ResizeObserver(() => setSize())
    resizeObserver.observe(container)

    return () => {
      resizeObserver.disconnect()
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pointermove', onWindowPointerMove)
    }
  }, [initNetwork, updatePointerFromClient])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10 overflow-hidden"
      aria-hidden
    >
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
    </div>
  )
}
