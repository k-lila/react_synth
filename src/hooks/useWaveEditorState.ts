import { useDispatch, useSelector } from 'react-redux'
import { RootReducer } from '../store'
import { useEffect, useState } from 'react'
import {
  adjustGain,
  adjustPhase,
  setWaveGain,
  setWavePhase
} from '../store/reducers/recipe'

/**
 * Estado local do editor de uma onda, sincronizado com o Redux a cada mudança.
 *
 * @param id - índice da onda em `recipe.waves`
 * @returns `gain`/`phase` editáveis (com seus setters), `selected`, `setSelected`
 *   e a `wave` atual
 * @remarks `selected` alterna o alvo da edição: `-1` edita o gain/phase **global**
 *   da onda; `>= 0` edita o parcial daquele índice em `amplitudes`/`phases`.
 */
function useWaveEditorState(id: number) {
  const dispatch = useDispatch()
  const wave = useSelector((state: RootReducer) => state.recipe).waves[id]
  const [gain, setGain] = useState(wave.amplitudes[0])
  const [phase, setPhase] = useState(wave.phases[0])
  const [selected, setSelected] = useState(-1)
  useEffect(() => {
    if (selected >= 0) {
      setGain(wave.amplitudes[selected])
      setPhase(wave.phases[selected])
    } else {
      setGain(wave.gain)
      setPhase(wave.phase)
    }
  }, [selected, wave.amplitudes, wave.gain, wave.phases, wave.phase])
  useEffect(() => {
    if (selected >= 0) {
      dispatch(
        adjustGain({ waveindex: id, amplitudeindex: selected, gain: gain })
      )
      dispatch(
        adjustPhase({ waveindex: id, phaseindex: selected, phase: phase })
      )
    } else {
      dispatch(setWaveGain({ waveid: id, gain: gain }))
      dispatch(setWavePhase({ waveid: id, phase: phase }))
    }
  }, [dispatch, id, gain, phase])
  return { gain, phase, selected, setGain, setPhase, setSelected, wave }
}

export default useWaveEditorState
