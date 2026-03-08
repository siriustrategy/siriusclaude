import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'

// ── Animação viral TikTok: "Pin Drop" ───────────────────────
// Branding Mappy — azul claro, saúde, localização

const PRIMARY = '#35B0FF'
const DARK = '#0A1628'

function PulseRing({ frame, startFrame, size }: { frame: number; startFrame: number; size: number }) {
  const progress = interpolate(frame, [startFrame, startFrame + 40], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const scale = interpolate(progress, [0, 1], [0.2, 1])
  const opacity = interpolate(progress, [0, 0.3, 1], [0.8, 0.6, 0])

  return (
    <div style={{
      position: 'absolute',
      width: size * scale,
      height: size * scale,
      borderRadius: '50%',
      border: `2px solid ${PRIMARY}`,
      opacity,
    }} />
  )
}

function CityPin({ name, x, y, frame, startFrame }: { name: string; x: number; y: number; frame: number; startFrame: number }) {
  const scale = spring({ frame: frame - startFrame, fps: 30, config: { damping: 10, stiffness: 120 } })
  const opacity = interpolate(frame, [startFrame, startFrame + 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  if (frame < startFrame) return null

  return (
    <div style={{
      position: 'absolute',
      left: x,
      top: y,
      transform: `translate(-50%, -100%) scale(${scale})`,
      opacity,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      {/* Pin */}
      <div style={{
        width: 32, height: 32, borderRadius: '50% 50% 50% 0',
        background: PRIMARY,
        transform: 'rotate(-45deg)',
        boxShadow: `0 4px 16px ${PRIMARY}88`,
        marginBottom: -4,
      }} />
      {/* Label */}
      <div style={{
        background: 'white',
        borderRadius: 8,
        padding: '4px 10px',
        fontSize: 20,
        fontWeight: 700,
        color: DARK,
        fontFamily: 'sans-serif',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        whiteSpace: 'nowrap',
      }}>
        {name}
      </div>
    </div>
  )
}

export const MappyPinDrop = () => {
  const frame = useCurrentFrame()
  const { width, height } = useVideoConfig()

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' })
  const titleY = interpolate(frame, [0, 20], [-30, 0], { extrapolateRight: 'clamp' })

  const counterValue = Math.floor(interpolate(frame, [60, 120], [0, 50000], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }))
  const counterOpacity = interpolate(frame, [55, 70], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  const ctaOpacity = interpolate(frame, [130, 145], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  const cities = [
    { name: 'São Paulo', x: width * 0.35, y: height * 0.38, startFrame: 25 },
    { name: 'Rio de Janeiro', x: width * 0.65, y: height * 0.45, startFrame: 38 },
    { name: 'Belo Horizonte', x: width * 0.42, y: height * 0.52, startFrame: 51 },
    { name: 'Salvador', x: width * 0.72, y: height * 0.32, startFrame: 40 },
    { name: 'Curitiba', x: width * 0.28, y: height * 0.58, startFrame: 55 },
  ]

  const pulseRings = [0, 1, 2].map(i => ({
    startFrame: 20 + i * 15,
    size: 200 + i * 80,
  }))

  return (
    <AbsoluteFill style={{ background: '#F5F7FA', overflow: 'hidden' }}>
      {/* Fundo mapa abstrato — linhas de grade */}
      <svg style={{ position: 'absolute', inset: 0, opacity: 0.08 }} width={width} height={height}>
        {Array.from({ length: 20 }).map((_, i) => (
          <line key={`h${i}`} x1={0} y1={i * (height / 20)} x2={width} y2={i * (height / 20)} stroke={DARK} strokeWidth={1} />
        ))}
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={`v${i}`} x1={i * (width / 12)} y1={0} x2={i * (width / 12)} y2={height} stroke={DARK} strokeWidth={1} />
        ))}
      </svg>

      {/* Título */}
      <div style={{
        position: 'absolute',
        top: height * 0.08,
        left: 0, right: 0,
        textAlign: 'center',
        opacity: titleOpacity,
        transform: `translateY(${titleY}px)`,
      }}>
        <div style={{
          fontFamily: 'sans-serif',
          fontWeight: 900,
          fontSize: 52,
          color: DARK,
          lineHeight: 1.1,
        }}>
          Saúde com sua marca.
        </div>
        <div style={{
          fontFamily: 'sans-serif',
          fontSize: 28,
          color: '#6B7280',
          marginTop: 8,
        }}>
          Em todo o Brasil.
        </div>
      </div>

      {/* Pulso central */}
      <div style={{
        position: 'absolute',
        top: height * 0.45,
        left: width * 0.5,
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {pulseRings.map((r, i) => (
          <PulseRing key={i} frame={frame} startFrame={r.startFrame} size={r.size} />
        ))}
        {/* Centro */}
        <div style={{
          width: 60, height: 60, borderRadius: '50%',
          background: PRIMARY,
          zIndex: 1,
          boxShadow: `0 0 0 8px ${PRIMARY}33, 0 0 40px ${PRIMARY}55`,
        }} />
      </div>

      {/* Pins das cidades */}
      {cities.map((c) => (
        <CityPin key={c.name} {...c} frame={frame} />
      ))}

      {/* Contador */}
      <div style={{
        position: 'absolute',
        top: height * 0.68,
        left: 0, right: 0,
        textAlign: 'center',
        opacity: counterOpacity,
      }}>
        <div style={{
          fontFamily: 'sans-serif',
          fontWeight: 900,
          fontSize: 88,
          color: PRIMARY,
          lineHeight: 1,
        }}>
          +{counterValue.toLocaleString('pt-BR')}
        </div>
        <div style={{
          fontFamily: 'sans-serif',
          fontSize: 28,
          color: '#6B7280',
          marginTop: 8,
        }}>
          atendimentos realizados
        </div>
      </div>

      {/* CTA */}
      <div style={{
        position: 'absolute',
        bottom: height * 0.1,
        left: 0, right: 0,
        textAlign: 'center',
        opacity: ctaOpacity,
      }}>
        <div style={{
          display: 'inline-block',
          background: PRIMARY,
          borderRadius: 50,
          padding: '16px 48px',
          fontFamily: 'sans-serif',
          fontWeight: 700,
          fontSize: 30,
          color: '#fff',
          boxShadow: `0 8px 32px ${PRIMARY}55`,
        }}>
          mappy.com.br
        </div>
        <div style={{ fontFamily: 'sans-serif', fontSize: 22, color: '#6B7280', marginTop: 12 }}>
          Pronto em 5 dias.
        </div>
      </div>
    </AbsoluteFill>
  )
}
