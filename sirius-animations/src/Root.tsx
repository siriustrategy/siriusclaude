import { Composition } from 'remotion'
import { SiriusAgentActivated } from './compositions/SiriusAgentActivated'
import { MappyPinDrop } from './compositions/MappyPinDrop'
import { StatsReveal } from './compositions/StatsReveal'

export const RemotionRoot = () => {
  return (
    <>
      {/* ── Sirius Academy ── */}
      <Composition
        id="SiriusAgentActivated"
        component={SiriusAgentActivated}
        durationInFrames={150}  // 5s @ 30fps
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />

      {/* ── Mappy ── */}
      <Composition
        id="MappyPinDrop"
        component={MappyPinDrop}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />

      {/* ── Stats Reveal (genérico) ── */}
      <Composition
        id="StatsReveal"
        component={StatsReveal}
        durationInFrames={180}  // 6s
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
    </>
  )
}
