import FundamentalWave from '../../classes/fundamentalwave'
import { PianoKeyProps } from '../../types/props/propstypes'
import { PianoKeyStyled } from './styles'

const PianoKey = ({ ...props }: PianoKeyProps) => {
  const fundamental = new FundamentalWave(44100)
  const intensities = [1, 0.3, 0.2, 0.1]
  fundamental.setIntensities(intensities)
  fundamental.createSawThoothContext(props.pitch)
  const wave = fundamental.getWave()

  const audioCtx = new AudioContext()
  const buffer = audioCtx.createBuffer(1, wave.length - 1, 44100)
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
      // currentSource = null
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
