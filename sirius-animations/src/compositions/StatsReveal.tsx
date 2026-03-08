import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'

// ── Animação viral: Stats Reveal ────────────────────────────
// Genérico — personalize brand, cores e números

interface StatConfig {
  value: number
  suffix: string
  label: string
  color: string
  startFrame: number
}

const STATS: StatConfig[] = [
  { value: 300, suffix: '%', label: 'mais produtividade', color: '#3B5BDB', startFrame: 20 },
  { value: 10, suffix: 'x', label: 'mais rápido', color: '#7C3AED', startFrame: 55 },
  { value: 50000, suffix: '+', label: 'profissionais treinados', color: '#06b6d4', startFrame: 90 },
]

function StatItem({ stat, frame }: { stat: StatConfig; frame: number }) {
  const { fps } = useVideoConfig()
  const scale = spring({ frame: frame - stat.startFrame, fps, config: { damping: 12, stiffness: 80 } })
  const opacity = interpolate(frame, [stat.startFrame, stat.startFrame + 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const rawValue = interpolate(
    frame,
    [stat.startFrame, stat.startFrame + 45],
    [0, stat.value],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  )

  const displayValue = stat.value >= 1000
    ? Math.floor(rawValue).toLocaleString('pt-BR')
    : Math.floor(rawValue)

  if (frame < stat.startFrame) return null

  return (
    <div style={{
      opacity,
      transform: `scale(${scale})`,
      textAlign: 'center',
      padding: '0 24px',
    }}>
      <div style={{
        fontFamily: 'sans-serif',
        fontWeight: 900,
        fontSize: 110,
        lineHeight: 1,
        color: stat.color,
        textShadow: `0 0 40px ${stat.color}55`,
      }}>
        {displayValue}{stat.suffix}
      </div>
      <div style={{
        fontFamily: 'sans-serif',
        fontSize: 30,
        color: '#E8EEFF',
        marginTop: 8,
        opacity: 0.8,
      }}>
        {stat.label}
      </div>

      {/* Divider */}
      <div style={{
        width: 80, height: 3, borderRadius: 2,
        background: stat.color,
        margin: '16px auto 0',
        opacity: 0.7,
      }} />
    </div>
  )
}

export const StatsReveal = () => {
  const frame = useCurrentFrame()
  const { width, height } = useVideoConfig()

  const bgOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' })
  const ctaOpacity = interpolate(frame, [150, 165], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill style={{ background: '#080C18', opacity: bgOpacity }}>
      {/* Glow de fundo */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 700, height: 700,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59,91,219,0.12) 0%, transparent 70%)',
      }} />

      {/* Título */}
      <div style={{
        position: 'absolute',
        top: height * 0.07,
        left: 60, right: 60,
        textAlign: 'center',
        opacity: interpolate(frame, [0, 18], [0, 1], { extrapolateRight: 'clamp' }),
      }}>
        <div style={{
          fontFamily: 'sans-serif',
          fontSize: 32,
          fontWeight: 700,
          color: '#6B7A9E',
          letterSpacing: 4,
          textTransform: 'uppercase',
        }}>
          Sirius Academy
        </div>
        <div style={{
          fontFamily: 'sans-serif',
          fontSize: 44,
          fontWeight: 900,
          color: '#E8EEFF',
          marginTop: 8,
          lineHeight: 1.1,
        }}>
          Números que provam.
        </div>
      </div>

      {/* Stats */}
      <div style={{
        position: 'absolute',
        top: height * 0.28,
        left: 0, right: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        alignItems: 'center',
      }}>
        {STATS.map((stat) => (
          <StatItem key={stat.label} stat={stat} frame={frame} />
        ))}
      </div>

      {/* CTA final */}
      <div style={{
        position: 'absolute',
        bottom: height * 0.1,
        left: 0, right: 0,
        textAlign: 'center',
        opacity: ctaOpacity,
      }}>
        <div style={{
          display: 'inline-block',
          background: 'linear-gradient(135deg, #3B5BDB, #7C3AED)',
          borderRadius: 50,
          padding: '18px 56px',
          fontFamily: 'sans-serif',
          fontWeight: 700,
          fontSize: 30,
          color: '#fff',
        }}>
          Comece gratis agora
        </div>
      </div>
    </AbsoluteFill>
  )
}
