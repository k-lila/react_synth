import { useState } from 'react'

/**
 * Estado do botão de informação, ciclando entre 4 modos (`info` ∈ [0, 3]).
 */
function useInfoBtn() {
  const [info, setInfo] = useState(0)
  const changeInfo = () => {
    setInfo(info + 1 == 4 ? 0 : info + 1)
  }
  return { info, changeInfo }
}

export default useInfoBtn
