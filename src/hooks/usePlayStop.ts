import { useCallback, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { RootReducer } from '../store'

function usePlayStop(wave: number[], audioCtx: AudioContext) {
  const gain = useSelector((state: RootReducer) => state.recipe.gain)
  const attack = 0.01
  const release = 0.01
  const bufferRef = useRef<AudioBuffer | null>(null)
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)

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
      if (bufferRef.current.length != wave.length - 1) {
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
    if (audioCtx && bufferRef.current && !currentSourceRef.current) {
      const source = audioCtx.createBufferSource()
      const gainNode = audioCtx.createGain()
      source.loop = true
      source.buffer = bufferRef.current
      const now = audioCtx.currentTime
      gainNode.gain.cancelScheduledValues(now)
      gainNode.gain.setValueAtTime(0, now)
      gainNode.gain.linearRampToValueAtTime(gain, now + attack)
      source.connect(gainNode)
      gainNode.connect(audioCtx.destination)
      currentSourceRef.current = source
      gainNodeRef.current = gainNode
      source.start()
    }
  }

  const stop = () => {
    if (currentSourceRef.current && gainNodeRef.current) {
      const now = audioCtx.currentTime
      const gainNode = gainNodeRef.current
      gainNode.gain.cancelScheduledValues(now)
      gainNode.gain.setValueAtTime(gainNode.gain.value, now)
      gainNode.gain.linearRampToValueAtTime(0, now + release)
      setTimeout(() => {
        currentSourceRef.current?.stop()
        currentSourceRef.current?.disconnect()
        gainNode.disconnect()
        currentSourceRef.current = null
        gainNodeRef.current = null
      }, release * 1000)
    }
  }

  return { play, stop }
}

export default usePlayStop
