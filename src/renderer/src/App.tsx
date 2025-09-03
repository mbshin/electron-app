import { JSX, useEffect, useState } from 'react'

type LoadState =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'error'; msg: string }
  | { kind: 'ready'; cfg: any }

export default function App(): JSX.Element {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  const [result, setResult] = useState('')
  const [state, setState] = useState<LoadState>({ kind: 'idle' })

  useEffect(() => {
    let mounted = true
    ;(async () => {
      setState({ kind: 'loading' })
      const res = await window.api.readConfig()
      if (!mounted) return
      if (res.ok) setState({ kind: 'ready', cfg: res.data })
      else setState({ kind: 'error', msg: res.error })
    })()
    return () => {
      mounted = false
    }
  }, [])

  const handleClick = async () : Promise<void> => {
    // example: call Electron preload API
    const res = window.api?.ping()
    // if (res.ok) {
    //   setResult(JSON.stringify(res.data))
    // } else {
    setResult(res)
  }

  return (
    <>
      <div>
        <button onClick={handleClick}>Load Config</button>
        <p>{result}</p>
        {JSON.stringify(state, null, 2)}
      </div>
    </>
  )
}
