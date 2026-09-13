import { contextBridge, ipcRenderer } from 'electron'
import { ContainerDefinition, TabDefinition, LayoutBoundsPayload, PrismAPI } from '../shared/types'

const api: PrismAPI = {
  // 容器接口
  getContainers: () => ipcRenderer.invoke('container:list'),
  createContainer: (def) => ipcRenderer.invoke('container:create', def),
  updateContainer: (id, updates) => ipcRenderer.invoke('container:update', id, updates),
  deleteContainer: (id) => ipcRenderer.invoke('container:delete', id),
  clearContainerData: (id) => ipcRenderer.invoke('container:clear-data', id),

  // 标签接口
  getTabs: () => ipcRenderer.invoke('tab:list'),
  createTab: (containerId, url) => ipcRenderer.invoke('tab:create', containerId, url),
  switchTab: (tabId) => ipcRenderer.invoke('tab:switch', tabId),
  closeTab: (tabId) => ipcRenderer.invoke('tab:close', tabId),
  navigateTab: (tabId, url) => ipcRenderer.invoke('tab:navigate', tabId, url),
  reloadTab: (tabId) => ipcRenderer.invoke('tab:reload', tabId),
  goBackTab: (tabId) => ipcRenderer.invoke('tab:go-back', tabId),
  goForwardTab: (tabId) => ipcRenderer.invoke('tab:go-forward', tabId),

  // 视窗边界更新
  updateContentBounds: (bounds: LayoutBoundsPayload) => {
    ipcRenderer.send('layout:update-bounds', bounds)
  },

  // 消息监听
  onContainersUpdated: (callback) => {
    const handler = (_: any, containers: ContainerDefinition[]): void => callback(containers)
    ipcRenderer.on('container:updated', handler)
    return () => {
      ipcRenderer.removeListener('container:updated', handler)
    }
  },

  onTabsUpdated: (callback) => {
    const handler = (_: any, tabs: TabDefinition[]): void => callback(tabs)
    ipcRenderer.on('tab:updated', handler)
    return () => {
      ipcRenderer.removeListener('tab:updated', handler)
    }
  },

  onActiveTabChanged: (callback) => {
    const handler = (_: any, activeId: string | null): void => callback(activeId)
    ipcRenderer.on('tab:active-changed', handler)
    return () => {
      ipcRenderer.removeListener('tab:active-changed', handler)
    }
  }
}

contextBridge.exposeInMainWorld('prismAPI', api)
