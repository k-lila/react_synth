import FundamentalWave from '../../classes/fundamentalwave'
import Keyboard from '../../classes/keyboard'
import SynthWave from '../../components/synthwave'
import PianoKeyboard from '../pianokeyboard'
import { HarenatorStyled } from './styles'

const afinacao = 440

const Harenator = () => {
  const notes = new Keyboard(afinacao)
  const note = notes.keyboard.natural[2][5]
  const fundamental = new FundamentalWave(44100)
  const intensities = [1, 0.3, 0.2, 0.1]
  fundamental.setIntensities(intensities)
  // fundamental.createSinContext(note)
  // fundamental.createSquareContext(note)
  fundamental.createSawThoothContext(note)
  // fundamental.createSinContext(note)

  const wave = fundamental.getWave()
  console.log(wave.length)

  const audioCtx = new AudioContext()
  const buffer = audioCtx.createBuffer(1, wave.length - 1, 44100)
  const nowBuffering = buffer.getChannelData(0)
  for (let i = 0; i < buffer.length; i++) {
    nowBuffering[i] = wave[i]
  }
  console.log(buffer.length)

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
    <HarenatorStyled>
      <button
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
      >
        PLAYA
      </button>
      <SynthWave datavisualization={wave} />
      <PianoKeyboard />
    </HarenatorStyled>
  )
}

export default Harenator
