import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import YAML from 'yaml'

function configPath() {
  // In dev: read from repo's ./config/config.yaml
  // In prod (packaged): place config next to app resources or under userData.
  if (!app.isPackaged) {
    return path.resolve(process.cwd(), 'config', 'config.yaml')
  }
  // Option A (read-only, bundled/next to resources):
  //   Put your file next to process.resourcesPath (e.g., in extraResources during packaging)
  //   return path.join(process.resourcesPath, 'config', 'config.yaml')

  // Option B (mutable, user-overridable):
  return path.join(app.getPath('userData'), 'config.yaml')
}

let win: BrowserWindow | null = null

async function readYamlConfig(): Promise<any> {
  const fp = configPath()
  const raw = await fs.readFile(fp, 'utf-8')
  return YAML.parse(raw)
}

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  ipcMain.handle('config:read', async () => {
    try {
      return { ok: true, data: await readYamlConfig() }
    } catch (err: any) {
      return { ok: false, error: err?.message ?? String(err) }
    }
  })
  
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// ipcMain.handle("ping", async  () => {
// console.log('pong11')
// return "pong20"
// });


ipcMain.handle('ping', async (_event, msg) => {
  console.log(msg)
  return `pong: ${msg}`
})