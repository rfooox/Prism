import { create } from 'zustand'
import { TabDefinition } from '@shared/types'
import { useContainerStore } from './useContainerStore'

interface TabStoreState {
  tabs: TabDefinition[]
  activeTabId: string | null
  isLoading: boolean

  // Actions
  setTabs: (tabs: TabDefinition[]) => void
  setActiveTabId: (id: string | null) => void

  fetchTabs: () => Promise<void>
  createTab: (containerId: string, url?: string) => Promise<TabDefinition>
  switchTab: (tabId: string) => Promise<boolean>
  closeTab: (tabId: string) => Promise<boolean>
  navigateTab: (tabId: string, url: string) => Promise<boolean>
  reloadTab: (tabId: string) => Promise<boolean>
  goBackTab: (tabId: string) => Promise<boolean>
  goForwardTab: (tabId: string) => Promise<boolean>

  getActiveTab: () => TabDefinition | undefined
  getTabsByContainer: (containerId: string) => TabDefinition[]
}

export const useTabStore = create<TabStoreState>((set, get) => ({
  tabs: [],
  activeTabId: null,
  isLoading: true,

  setTabs: (tabs) => set({ tabs }),
  setActiveTabId: (activeTabId) => {
    set({ activeTabId })
    // 同步更新活动容器 ID
    if (activeTabId) {
      const tab = get().tabs.find((t) => t.id === activeTabId)
      if (tab) {
        useContainerStore.getState().setActiveContainerId(tab.containerId)
      }
    }
  },

  fetchTabs: async () => {
    try {
      if (window.prismAPI) {
        const list = await window.prismAPI.getTabs()
        set({ tabs: list, isLoading: false })
      }
    } catch (err) {
      console.error('获取标签列表失败:', err)
      set({ isLoading: false })
    }
  },

  createTab: async (containerId, url) => {
    const tab = await window.prismAPI.createTab(containerId, url)
    set((state) => ({
      tabs: [...state.tabs, tab],
      activeTabId: tab.id
    }))
    useContainerStore.getState().setActiveContainerId(containerId)
    return tab
  },

  switchTab: async (tabId) => {
    const ok = await window.prismAPI.switchTab(tabId)
    if (ok) {
      get().setActiveTabId(tabId)
    }
    return ok
  },

  closeTab: async (tabId) => {
    const ok = await window.prismAPI.closeTab(tabId)
    if (ok) {
      set((state) => ({
        tabs: state.tabs.filter((t) => t.id !== tabId),
        activeTabId: state.activeTabId === tabId ? null : state.activeTabId
      }))
    }
    return ok
  },

  navigateTab: async (tabId, url) => {
    return await window.prismAPI.navigateTab(tabId, url)
  },

  reloadTab: async (tabId) => {
    return await window.prismAPI.reloadTab(tabId)
  },

  goBackTab: async (tabId) => {
    return await window.prismAPI.goBackTab(tabId)
  },

  goForwardTab: async (tabId) => {
    return await window.prismAPI.goForwardTab(tabId)
  },

  getActiveTab: () => {
    const { tabs, activeTabId } = get()
    return tabs.find((t) => t.id === activeTabId)
  },

  getTabsByContainer: (containerId: string) => {
    return get().tabs.filter((t) => t.containerId === containerId)
  }
}))
