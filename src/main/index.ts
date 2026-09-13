import { app, BrowserWindow } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import { ContainerManager } from './container/ContainerManager'
import { LayoutManager } from './layout/LayoutManager'
import { TabManager } from './tab/TabManager'
import { registerIpcHandlers } from './ipc/handlers'

let mainWindow: BrowserWindow | null = null
let containerManager: ContainerManager | null = null
let tabManager: TabManager | null = null
let layoutManager: LayoutManager | null = null

function createWindow(): void {
  // 创建现代化主无边框视窗
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 650,
    show: false,
    autoHideMenuBar: true,
    titleBarStyle: 'hidden', // 沉浸式标题栏
    titleBarOverlay: {
      color: '#0f172a', // 深色 Slate 900
      symbolColor: '#94a3b8',
      height: 38
    },
    webPreferences: {
      preload: join(__dirname, '../preload/browser.js'),
      sandbox: false,
      contextIsolation: true
    }
  })

  // 初始化核心管理器
  containerManager = new ContainerManager()
  layoutManager = new LayoutManager(mainWindow)
  tabManager = new TabManager(mainWindow, containerManager, layoutManager)

  // 注册全量 IPC 通道
  registerIpcHandlers(
    () => (mainWindow ? mainWindow.webContents : null),
    containerManager,
    tabManager,
    layoutManager
  )

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
    // 首次启动时，默认在第一个容器 (工作主舱) 下打开初始标签
    const containers = containerManager?.getAllContainers() || []
    if (containers.length > 0 && tabManager) {
      tabManager.createTab(containers[0].id, 'https://www.google.com')
    }
  })

  // 窗口拉伸时自动触发边界同步
  mainWindow.on('resize', () => {
    layoutManager?.applyBounds()
  })

  // 加载渲染进程 UI
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
