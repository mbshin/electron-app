import { useState } from "react"


declare global {
  interface Window {
    api: { ping: () => string }
  }
}

export default function App() {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')


   const [result, setResult] = useState("")

  const handleClick = async () => {
    // example: call Electron preload API
    const res = await window.api?.ping()
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
    </div>

      
    </>
  )
}
