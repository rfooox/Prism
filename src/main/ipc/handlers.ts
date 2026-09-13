import { ipcMain, WebContents } from 'electron'
import { ContainerManager } from '../container/ContainerManager'
import { TabManager } from '../tab/TabManager'
import { LayoutManager } from '../layout/LayoutManager'
import { LayoutBoundsPayload } from '@shared/types'

export function registerIpcHandlers(
  getRendererWebContents: () => WebContents | null,
  containerManager: ContainerManager,
  tabManager: TabManager,
  layoutManager: LayoutManager
): void {
  // ---- 容器相关 IPC ----
  ipcMain.handle('container:list', () => {
    return containerManager.getAllContainers()
  })

  ipcMain.handle('container:create', (_, def) => {
    return containerManager.createContainer(def)
  })

  ipcMain.handle('container:update', (_, id, updates) => {
    return containerManager.updateContainer(id, updates)
  })

  ipcMain.handle('container:delete', async (_, id) => {
    return await containerManager.deleteContainer(id)
  })

  ipcMain.handle('container:clear-data', async (_, id) => {
    return await containerManager.clearContainerData(id)
  })

  // ---- 标签相关 IPC ----
  ipcMain.handle('tab:list', () => {
    return tabManager.getAllTabs()
  })

  ipcMain.handle('tab:create', async (_, containerId, initialUrl) => {
    return await tabManager.createTab(containerId, initialUrl)
  })

  ipcMain.handle('tab:switch', async (_, tabId) => {
    return await tabManager.switchTab(tabId)
  })

  ipcMain.handle('tab:close', async (_, tabId) => {
    return await tabManager.closeTab(tabId)
  })

  ipcMain.handle('tab:navigate', async (_, tabId, url) => {
    return await tabManager.navigateTab(tabId, url)
  })

  ipcMain.handle('tab:reload', (_, tabId) => {
    return tabManager.reloadTab(tabId)
  })

  ipcMain.handle('tab:go-back', (_, tabId) => {
    return tabManager.goBackTab(tabId)
  })

  ipcMain.handle('tab:go-forward', (_, tabId) => {
    return tabManager.goForwardTab(tabId)
  })

  // ---- 视窗几何同步 IPC ----
  ipcMain.on('layout:update-bounds', (_, bounds: LayoutBoundsPayload) => {
    layoutManager.updateBounds(bounds)
  })

  // ---- 主进程向渲染进程广播更新 ----
  containerManager.onContainersChange((containers) => {
    const wc = getRendererWebContents()
    if (wc && !wc.isDestroyed()) {
      wc.send('container:updated', containers)
    }
  })

  tabManager.onTabsChange((tabs) => {
    const wc = getRendererWebContents()
    if (wc && !wc.isDestroyed()) {
      wc.send('tab:updated', tabs)
    }
  })

  tabManager.onActiveTabChange((activeId) => {
    const wc = getRendererWebContents()
    if (wc && !wc.isDestroyed()) {
      wc.send('tab:active-changed', activeId)
    }
  })
}
