import { useState } from 'react'

function useInfoBtn() {
  const [info, setInfo] = useState(0)
  const changeInfo = () => {
    setInfo(info + 1 == 4 ? 0 : info + 1)
  }
  return { info, changeInfo }
}

export default useInfoBtn
