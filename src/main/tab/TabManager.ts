import { BaseWindow, WebContentsView } from 'electron'
import { TabDefinition } from '@shared/types'
import { ContainerManager } from '../container/ContainerManager'
import { LayoutManager } from '../layout/LayoutManager'

export class TabManager {
  private window: BaseWindow
  private containerManager: ContainerManager
  private layoutManager: LayoutManager
  private tabs: Map<string, TabDefinition> = new Map()
  private views: Map<string, WebContentsView> = new Map()
  private activeTabId: string | null = null
  private onTabsChangeCallbacks: Array<(tabs: TabDefinition[]) => void> = []
  private onActiveTabChangeCallbacks: Array<(activeId: string | null) => void> = []

  constructor(window: BaseWindow, containerManager: ContainerManager, layoutManager: LayoutManager) {
    this.window = window
    this.containerManager = containerManager
    this.layoutManager = layoutManager
  }

  /**
   * 获取所有标签列表
   */
  public getAllTabs(): TabDefinition[] {
    return Array.from(this.tabs.values())
  }

  /**
   * 获取当前激活的标签 ID
   */
  public getActiveTabId(): string | null {
    return this.activeTabId
  }

  /**
   * 创建新标签页
   */
  public async createTab(containerId: string, initialUrl: string = 'https://www.google.com'): Promise<TabDefinition> {
    const tabId = `tab_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
    const sess = this.containerManager.getOrCreateSession(containerId)

    // 创建专属的底层 WebContentsView
    const view = new WebContentsView({
      webPreferences: {
        session: sess,
        sandbox: true,
        contextIsolation: true
      }
    })

    const newTab: TabDefinition = {
      id: tabId,
      containerId,
      url: initialUrl,
      title: '新标签页',
      isLoading: true,
      canGoBack: false,
      canGoForward: false,
      isPinned: false,
      isHibernated: false,
      lastAccessedAt: Date.now()
    }

    this.tabs.set(tabId, newTab)
    this.views.set(tabId, view)

    // 绑定网页事件监听
    this.setupViewListeners(tabId, view)

    // 导航到初始 URL
    view.webContents.loadURL(initialUrl).catch((err) => {
      console.warn(`加载 URL 失败 [${initialUrl}]:`, err.message)
    })

    // 立即激活该标签
    await this.switchTab(tabId)

    this.notifyTabsChange()
    return newTab
  }

  /**
   * 切换当前激活标签
   */
  public async switchTab(tabId: string): Promise<boolean> {
    if (!this.tabs.has(tabId) || !this.views.has(tabId)) {
      return false
    }

    const prevView = this.activeTabId ? this.views.get(this.activeTabId) : null
    const nextView = this.views.get(tabId)!

    // 移除旧视窗，挂载新视窗
    if (prevView && prevView !== nextView) {
      try {
        this.window.contentView.removeChildView(prevView)
      } catch {
        // ignore
      }
    }

    try {
      this.window.contentView.addChildView(nextView)
      this.layoutManager.setActiveView(nextView)
    } catch (err) {
      console.error('挂载 WebContentsView 失败:', err)
      return false
    }

    this.activeTabId = tabId
    const tab = this.tabs.get(tabId)!
    tab.lastAccessedAt = Date.now()

    this.notifyActiveTabChange()
    this.notifyTabsChange()
    return true
  }

  /**
   * 关闭指定标签
   */
  public async closeTab(tabId: string): Promise<boolean> {
    const view = this.views.get(tabId)
    if (!view) return false

    // 如果当前正在展示该标签，先解绑
    if (this.activeTabId === tabId) {
      try {
        this.window.contentView.removeChildView(view)
      } catch {
        // ignore
      }
      this.layoutManager.setActiveView(null)
    }

    // 彻底销毁 WebContents
    try {
      ;(view.webContents as any).destroy()
    } catch {
      // ignore
    }

    this.views.delete(tabId)
    this.tabs.delete(tabId)

    // 若关闭的是活动标签，自动切换到相邻标签
    if (this.activeTabId === tabId) {
      const remaining = Array.from(this.tabs.values())
      if (remaining.length > 0) {
        const next = remaining[remaining.length - 1]
        await this.switchTab(next.id)
      } else {
        this.activeTabId = null
        this.notifyActiveTabChange()
      }
    }

    this.notifyTabsChange()
    return true
  }

  /**
   * 网页导航
   */
  public async navigateTab(tabId: string, url: string): Promise<boolean> {
    const view = this.views.get(tabId)
    if (!view) return false

    let formattedUrl = url.trim()
    if (!/^https?:\/\//i.test(formattedUrl)) {
      if (formattedUrl.includes('.') && !formattedUrl.includes(' ')) {
        formattedUrl = 'https://' + formattedUrl
      } else {
        formattedUrl = `https://www.google.com/search?q=${encodeURIComponent(formattedUrl)}`
      }
    }

    try {
      await view.webContents.loadURL(formattedUrl)
      return true
    } catch (err) {
      console.warn(`导航至 ${formattedUrl} 失败:`, err)
      return false
    }
  }

  public reloadTab(tabId: string): boolean {
    const view = this.views.get(tabId)
    if (!view) return false
    view.webContents.reload()
    return true
  }

  public goBackTab(tabId: string): boolean {
    const view = this.views.get(tabId)
    if (!view) return false
    const canGoBack = view.webContents.navigationHistory?.canGoBack() ?? view.webContents.canGoBack()
    if (!canGoBack) return false
    view.webContents.navigationHistory?.goBack() ?? view.webContents.goBack()
    return true
  }

  public goForwardTab(tabId: string): boolean {
    const view = this.views.get(tabId)
    if (!view) return false
    const canGoForward = view.webContents.navigationHistory?.canGoForward() ?? view.webContents.canGoForward()
    if (!canGoForward) return false
    view.webContents.navigationHistory?.goForward() ?? view.webContents.goForward()
    return true
  }

  /**
   * 监听 WebContents 原生事件
   */
  private setupViewListeners(tabId: string, view: WebContentsView): void {
    const wc = view.webContents

    wc.on('did-start-loading', () => {
      const tab = this.tabs.get(tabId)
      if (tab) {
        tab.isLoading = true
        this.notifyTabsChange()
      }
    })

    wc.on('did-stop-loading', () => {
      const tab = this.tabs.get(tabId)
      if (tab) {
        tab.isLoading = false
        tab.url = wc.getURL()
        tab.canGoBack = wc.navigationHistory?.canGoBack() ?? wc.canGoBack()
        tab.canGoForward = wc.navigationHistory?.canGoForward() ?? wc.canGoForward()
        this.notifyTabsChange()
      }
    })

    wc.on('page-title-updated', (_, title) => {
      const tab = this.tabs.get(tabId)
      if (tab) {
        tab.title = title || '无标题'
        this.notifyTabsChange()
      }
    })

    wc.on('page-favicon-updated', (_, favicons) => {
      const tab = this.tabs.get(tabId)
      if (tab && favicons.length > 0) {
        tab.faviconUrl = favicons[0]
        this.notifyTabsChange()
      }
    })
  }

  public onTabsChange(callback: (tabs: TabDefinition[]) => void): () => void {
    this.onTabsChangeCallbacks.push(callback)
    return () => {
      this.onTabsChangeCallbacks = this.onTabsChangeCallbacks.filter((c) => c !== callback)
    }
  }

  public onActiveTabChange(callback: (activeId: string | null) => void): () => void {
    this.onActiveTabChangeCallbacks.push(callback)
    return () => {
      this.onActiveTabChangeCallbacks = this.onActiveTabChangeCallbacks.filter((c) => c !== callback)
    }
  }

  private notifyTabsChange(): void {
    const list = this.getAllTabs()
    this.onTabsChangeCallbacks.forEach((cb) => cb(list))
  }

  private notifyActiveTabChange(): void {
    this.onActiveTabChangeCallbacks.forEach((cb) => cb(this.activeTabId))
  }
}
