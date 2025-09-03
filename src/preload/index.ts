import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    //     contextBridge.exposeInMainWorld('api', {
    //   ping: () => {

    //     console.log("ping1")
    //       ipcRenderer.invoke("ping")
    //    return  'pong'
    // },
    // })
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}

contextBridge.exposeInMainWorld('api', {
  ping: async () => {
    return await ipcRenderer.invoke('ping', 'hello')
    // console.log("res" + ipcRenderer.invoke("ping"))
  },
  readConfig: async (): Promise<ReadConfigResult> => {
    return ipcRenderer.invoke('config:read')
  }
})

// const reply = await ipcRenderer.invoke('ping', 'hello')
// console.log(reply) // "pong: hello"
