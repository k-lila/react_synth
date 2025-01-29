import { useCallback, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { RootReducer } from '../store'

function usePlayStop(wave: number[], audioCtx: AudioContext) {

  const gain = useSelector((state: RootReducer) => state.recipe.gain)
  const bufferRef = useRef<AudioBuffer | null>(null)
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null)

  const addBufferData = useCallback(
    (wave: number[]) => {
      if (audioCtx && bufferRef.current) {
        const nowBuffering = bufferRef.current.getChannelData(0)
        for (let i = 0; i < bufferRef.current.length; i++) {
          nowBuffering[i] = wave[i] * 0.5
        }
      }
    },
    [audioCtx]
  )
  useEffect(() => {
    if (!bufferRef.current && audioCtx) {
      bufferRef.current = audioCtx.createBuffer(
        1,
        wave.length - 1,
        audioCtx.sampleRate
      )
    } else if (bufferRef.current) {
      if (bufferRef.current.length != (wave.length - 1)) {
        bufferRef.current = audioCtx.createBuffer(
          1,
          wave.length - 1,
          audioCtx.sampleRate
        )
      }
    }
  }, [wave.length, audioCtx])
  useEffect(() => {
    addBufferData(
      wave.map((m) => {
        return m * gain
      })
    )
  }, [wave, gain, addBufferData])
  const play = () => {
    if (audioCtx && bufferRef.current) {
      const source = audioCtx.createBufferSource()
      source.loop = true
      source.buffer = bufferRef.current
      source.connect(audioCtx.destination)
      currentSourceRef.current = source
      source.start()
    }
  }
  const stop = () => {
    if (currentSourceRef.current) {
      currentSourceRef.current.stop()
      currentSourceRef.current.disconnect()
      currentSourceRef.current = null
    }
  }
  return { play, stop }
}

export default usePlayStop
