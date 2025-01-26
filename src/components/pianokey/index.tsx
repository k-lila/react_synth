import FundamentalWave from '../../classes/fundamentalwave'
import { PianoKeyProps } from '../../types/props/propstypes'
import { PianoKeyStyled } from './styles'

const PianoKey = ({ ...props }: PianoKeyProps) => {
  const audioCtx = new AudioContext()

  const fundamental = new FundamentalWave(audioCtx.sampleRate)
  const intensities = [1, 0.3, 0.2, 0.1]
  fundamental.setIntensities(intensities)
  fundamental.createSinContext(props.pitch)

  const wave = fundamental.getWave()
  const buffer = audioCtx.createBuffer(1, wave.length - 1, audioCtx.sampleRate)
  const nowBuffering = buffer.getChannelData(0)
  for (let i = 0; i < buffer.length; i++) {
    nowBuffering[i] = wave[i]
  }

  const play = () => {
    const source = audioCtx.createBufferSource()
    source.loop = true
    source.buffer = buffer
    source.connect(audioCtx.destination)
    return source
  }

  let currentSource: AudioBufferSourceNode

  const handleMouseDown = () => {
    currentSource = play()
    currentSource.start()
  }

  const handleMouseUp = () => {
    if (currentSource) {
      currentSource.stop()
      currentSource.disconnect()
    }
  }

  return (
    <PianoKeyStyled>
      <button
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
      >
        {Math.floor(props.pitch)}
      </button>
    </PianoKeyStyled>
  )
}

export default PianoKey
