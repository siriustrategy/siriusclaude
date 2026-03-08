import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'

// ── Animação viral TikTok: "Agente IA Ativado" ─────────────
// Branding Sirius Academy — escuro, estrelas, azul

const ACCENT = '#3B5BDB'
const ACCENT2 = '#7C3AED'

function Star({ x, y, delay, size }: { x: number; y: number; delay: number; size: number }) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const opacity = interpolate(frame, [delay, delay + 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const pulse = Math.sin((frame - delay) * 0.08) * 0.3 + 0.7

  if (frame < delay) return null

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: '50%',
        background: `rgba(180, 200, 255, ${opacity * pulse})`,
        boxShadow: `0 0 ${size * 3}px rgba(59,91,219,${opacity * 0.6})`,
      }}
    />
  )
}

function CodeLine({ text, frame, startFrame, color = '#a5b4fc' }: { text: string; frame: number; startFrame: number; color?: string }) {
  const chars = Math.floor(interpolate(frame, [startFrame, startFrame + 30], [0, text.length], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  }))
  const opacity = interpolate(frame, [startFrame, startFrame + 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  return (
    <div style={{ fontFamily: 'monospace', fontSize: 28, color, opacity, letterSpacing: 1, lineHeight: 1.6 }}>
      {text.slice(0, chars)}
      {chars < text.length && frame > startFrame ? (
        <span style={{ opacity: Math.sin(frame * 0.3) > 0 ? 1 : 0, color: ACCENT }}>|</span>
      ) : null}
    </div>
  )
}

export const SiriusAgentActivated = () => {
  const frame = useCurrentFrame()
  const { fps, width, height } = useVideoConfig()

  // Fundo escuro — fade in
  const bgOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' })

  // Logo aparece no frame 60
  const logoScale = spring({ frame: frame - 70, fps, config: { damping: 12, stiffness: 80 } })
  const logoOpacity = interpolate(frame, [70, 85], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  // Texto final aparece no frame 110
  const textOpacity = interpolate(frame, [110, 125], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const textY = interpolate(frame, [110, 125], [20, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  // Glow pulsa
  const glowSize = 300 + Math.sin(frame * 0.05) * 60

  const stars = [
    { x: 80, y: 200, delay: 5, size: 3 },
    { x: 920, y: 350, delay: 8, size: 4 },
    { x: 200, y: 700, delay: 12, size: 2 },
    { x: 850, y: 900, delay: 3, size: 3 },
    { x: 150, y: 1400, delay: 15, size: 2 },
    { x: 900, y: 1500, delay: 7, size: 4 },
    { x: 500, y: 300, delay: 10, size: 2 },
    { x: 600, y: 1700, delay: 6, size: 3 },
  ]

  return (
    <AbsoluteFill style={{ background: '#080C18', opacity: bgOpacity }}>
      {/* Estrelas de fundo */}
      {stars.map((s, i) => (
        <Star key={i} {...s} />
      ))}

      {/* Glow central */}
      <div style={{
        position: 'absolute',
        top: height * 0.35,
        left: width / 2,
        transform: 'translate(-50%, -50%)',
        width: glowSize,
        height: glowSize,
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(59,91,219,0.18) 0%, transparent 70%)`,
      }} />

      {/* Bloco de código */}
      <div style={{
        position: 'absolute',
        top: height * 0.12,
        left: 80,
        right: 80,
        fontFamily: 'monospace',
      }}>
        <CodeLine text="// initializing Sirius Agent..." frame={frame} startFrame={5} color="#4A5680" />
        <CodeLine text="import { SiriusAgent } from 'sirius'" frame={frame} startFrame={20} />
        <CodeLine text="const agent = await SiriusAgent.init()" frame={frame} startFrame={35} />
        <CodeLine text="agent.connect({ workspace: 'PRO' })" frame={frame} startFrame={50} />
        <CodeLine text="✓ Agent ready" frame={frame} startFrame={65} color="#10b981" />
      </div>

      {/* Logo Sirius */}
      <div style={{
        position: 'absolute',
        top: height * 0.42,
        left: '50%',
        transform: `translate(-50%, -50%) scale(${logoScale})`,
        opacity: logoOpacity,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
      }}>
        {/* Logo SVG */}
        <svg width="120" height="120" viewBox="0 0 38 38" fill="none">
          <line x1="19" y1="8" x2="28" y2="17" stroke="rgba(93,130,255,0.4)" strokeWidth="0.8" />
          <line x1="19" y1="8" x2="10" y2="17" stroke="rgba(93,130,255,0.4)" strokeWidth="0.8" />
          <line x1="28" y1="17" x2="24" y2="27" stroke="rgba(93,130,255,0.4)" strokeWidth="0.8" />
          <line x1="10" y1="17" x2="14" y2="27" stroke="rgba(93,130,255,0.4)" strokeWidth="0.8" />
          <line x1="14" y1="27" x2="24" y2="27" stroke="rgba(93,130,255,0.4)" strokeWidth="0.8" />
          <circle cx="10" cy="17" r="1.5" fill="#7B9FFF" />
          <circle cx="28" cy="17" r="1.5" fill="#7B9FFF" />
          <circle cx="14" cy="27" r="1.2" fill="#5C7FFF" />
          <circle cx="24" cy="27" r="1.2" fill="#5C7FFF" />
          <circle cx="19" cy="8" r="3.5" fill={ACCENT} />
          <circle cx="19" cy="8" r="1.8" fill="#E8EEFF" />
        </svg>

        <div style={{ fontFamily: 'sans-serif', fontWeight: 900, fontSize: 64, color: '#E8EEFF', letterSpacing: '-2px' }}>
          SIRIUS
        </div>
        <div style={{ fontFamily: 'sans-serif', fontWeight: 400, fontSize: 22, color: '#6B7A9E', letterSpacing: '10px' }}>
          ACADEMY
        </div>
      </div>

      {/* Texto final de impacto */}
      <div style={{
        position: 'absolute',
        bottom: height * 0.15,
        left: 60,
        right: 60,
        textAlign: 'center',
        opacity: textOpacity,
        transform: `translateY(${textY}px)`,
      }}>
        <div style={{
          fontFamily: 'sans-serif',
          fontWeight: 900,
          fontSize: 52,
          color: '#E8EEFF',
          lineHeight: 1.1,
          marginBottom: 20,
        }}>
          Seu agente de IA{'\n'}está ativado.
        </div>
        <div style={{
          display: 'inline-block',
          background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT2})`,
          borderRadius: 50,
          padding: '14px 40px',
          fontFamily: 'sans-serif',
          fontWeight: 700,
          fontSize: 28,
          color: '#fff',
        }}>
          siriusacademy.com.br
        </div>
      </div>
    </AbsoluteFill>
  )
}
