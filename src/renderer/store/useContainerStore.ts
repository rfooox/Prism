import { create } from 'zustand'
import { ContainerDefinition } from '@shared/types'

interface ContainerStoreState {
  containers: ContainerDefinition[]
  activeContainerId: string | null
  isSidebarCollapsed: boolean
  inspectingContainerId: string | null
  isLoading: boolean

  // Actions
  setContainers: (containers: ContainerDefinition[]) => void
  setActiveContainerId: (id: string | null) => void
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  openInspector: (containerId: string) => void
  closeInspector: () => void

  fetchContainers: () => Promise<void>
  createContainer: (def: Omit<ContainerDefinition, 'partition' | 'createdAt'>) => Promise<ContainerDefinition>
  updateContainer: (id: string, updates: Partial<ContainerDefinition>) => Promise<ContainerDefinition>
  deleteContainer: (id: string) => Promise<boolean>
  clearContainerData: (id: string) => Promise<boolean>
}

export const useContainerStore = create<ContainerStoreState>((set, get) => ({
  containers: [],
  activeContainerId: null,
  isSidebarCollapsed: false,
  inspectingContainerId: null,
  isLoading: true,

  setContainers: (containers) => set({ containers }),
  setActiveContainerId: (activeContainerId) => set({ activeContainerId }),
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  setSidebarCollapsed: (isSidebarCollapsed) => set({ isSidebarCollapsed }),
  openInspector: (containerId) => set({ inspectingContainerId: containerId }),
  closeInspector: () => set({ inspectingContainerId: null }),

  fetchContainers: async () => {
    try {
      if (window.prismAPI) {
        const list = await window.prismAPI.getContainers()
        set({
          containers: list,
          activeContainerId: get().activeContainerId || (list.length > 0 ? list[0].id : null),
          isLoading: false
        })
      }
    } catch (err) {
      console.error('获取容器列表失败:', err)
      set({ isLoading: false })
    }
  },

  createContainer: async (def) => {
    const created = await window.prismAPI.createContainer(def)
    await get().fetchContainers()
    return created
  },

  updateContainer: async (id, updates) => {
    const updated = await window.prismAPI.updateContainer(id, updates)
    await get().fetchContainers()
    return updated
  },

  deleteContainer: async (id) => {
    const ok = await window.prismAPI.deleteContainer(id)
    await get().fetchContainers()
    return ok
  },

  clearContainerData: async (id) => {
    return await window.prismAPI.clearContainerData(id)
  }
}))
