/**
 * 棱界 (Prism) 核心共享数据类型定义
 */

export interface ProxyConfig {
  enabled: boolean
  type: 'http' | 'https' | 'socks5'
  host: string
  port: number
  username?: string
  password?: string
}

export interface EnvironmentOverrides {
  timezoneId?: string
  locale?: string
  geolocation?: {
    latitude: number
    longitude: number
    accuracy: number
  }
  userAgent?: string
}

/**
 * 容器实体定义
 */
export interface ContainerDefinition {
  id: string
  name: string
  color: string
  icon: string
  partition: string
  isPrivate: boolean
  isCollapsed?: boolean
  proxyConfig?: ProxyConfig
  environmentOverrides?: EnvironmentOverrides
  downloadSubpath?: string
  createdAt: number
}

/**
 * 标签页实体定义
 */
export interface TabDefinition {
  id: string
  containerId: string
  url: string
  title: string
  faviconUrl?: string
  isLoading: boolean
  canGoBack: boolean
  canGoForward: boolean
  isPinned: boolean
  isHibernated: boolean
  lastAccessedAt: number
}

/**
 * 视窗几何边界载荷
 */
export interface LayoutBoundsPayload {
  x: number
  y: number
  width: number
  height: number
}

/**
 * 书签定义
 */
export interface BookmarkItem {
  id: string
  title: string
  url: string
  faviconUrl?: string
  containerId?: string // 绑定的容器 ID，若为空则为全局书签
  parentId?: string
}

/**
 * 前端暴露给 window.prismAPI 的统一接口
 */
export interface PrismAPI {
  // 容器接口
  getContainers: () => Promise<ContainerDefinition[]>
  createContainer: (def: Omit<ContainerDefinition, 'partition' | 'createdAt'>) => Promise<ContainerDefinition>
  updateContainer: (id: string, updates: Partial<ContainerDefinition>) => Promise<ContainerDefinition>
  deleteContainer: (id: string) => Promise<boolean>
  clearContainerData: (id: string) => Promise<boolean>

  // 标签接口
  getTabs: () => Promise<TabDefinition[]>
  createTab: (containerId: string, url?: string) => Promise<TabDefinition>
  switchTab: (tabId: string) => Promise<boolean>
  closeTab: (tabId: string) => Promise<boolean>
  navigateTab: (tabId: string, url: string) => Promise<boolean>
  reloadTab: (tabId: string) => Promise<boolean>
  goBackTab: (tabId: string) => Promise<boolean>
  goForwardTab: (tabId: string) => Promise<boolean>

  // 视窗边界同步
  updateContentBounds: (bounds: LayoutBoundsPayload) => void

  // 事件监听
  onContainersUpdated: (callback: (containers: ContainerDefinition[]) => void) => () => void
  onTabsUpdated: (callback: (tabs: TabDefinition[]) => void) => () => void
  onActiveTabChanged: (callback: (activeTabId: string | null) => void) => () => void
}
