import React, { useEffect, useRef, useState } from 'react'
import { ContainerSidebar } from './components/sidebar/ContainerSidebar'
import { MiniDock } from './components/sidebar/MiniDock'
import { NavBar } from './components/navbar/NavBar'
import { BookmarksBar } from './components/bookmarks/BookmarksBar'
import { RightDock } from './components/right-dock/RightDock'
import { ContainerInspector } from './components/container-drawer/ContainerInspector'
import { useContainerStore } from './store/useContainerStore'
import { useTabStore } from './store/useTabStore'

export const App: React.FC = () => {
  const { isSidebarCollapsed, toggleSidebar, fetchContainers, setContainers } = useContainerStore()
  const { fetchTabs, setTabs, setActiveTabId } = useTabStore()

  const [isBookmarksVisible, setIsBookmarksVisible] = useState(true)
  const contentRef = useRef<HTMLDivElement>(null)

  // 初始化数据加载与主进程广播监听
  useEffect(() => {
    fetchContainers()
    fetchTabs()

    if (window.prismAPI) {
      const unsubContainers = window.prismAPI.onContainersUpdated((list) => {
        setContainers(list)
      })

      const unsubTabs = window.prismAPI.onTabsUpdated((tabs) => {
        setTabs(tabs)
      })

      const unsubActive = window.prismAPI.onActiveTabChanged((activeId) => {
        setActiveTabId(activeId)
      })

      return () => {
        unsubContainers()
        unsubTabs()
        unsubActive()
      }
    }
  }, [])

  // 全局快捷键监听 (Ctrl+\ 与 Ctrl+Shift+B)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if ((e.ctrlKey || e.metaKey) && e.key === '\\') {
        e.preventDefault()
        toggleSidebar()
      } else if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'b' || e.key === 'B')) {
        e.preventDefault()
        setIsBookmarksVisible((prev) => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toggleSidebar])

  // 视窗几何边界同步协议 (Layout Bounds Sync Protocol)
  useEffect(() => {
    const syncBounds = (): void => {
      if (!contentRef.current || !window.prismAPI) return

      const rect = contentRef.current.getBoundingClientRect()
      window.prismAPI.updateContentBounds({
        x: Math.round(rect.left),
        y: Math.round(rect.top),
        width: Math.round(rect.width),
        height: Math.round(rect.height)
      })
    }

    // 初始同步
    syncBounds()

    // 监听中心占位容器尺寸变化（窗口拉伸、侧栏折叠、收藏夹切换等）
    const observer = new ResizeObserver(() => {
      syncBounds()
    })

    if (contentRef.current) {
      observer.observe(contentRef.current)
    }

    window.addEventListener('resize', syncBounds)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', syncBounds)
    }
  }, [isSidebarCollapsed, isBookmarksVisible])

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 font-sans">
      {/* 左翼 · 容器中心化管理栏 (240px 全展开 或 48px Mini Dock) */}
      {isSidebarCollapsed ? <MiniDock /> : <ContainerSidebar />}

      {/* 中心与主视觉区域 */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        {/* 顶穹 · 地址导航栏 */}
        <NavBar
          onToggleBookmarks={() => setIsBookmarksVisible((v) => !v)}
          isBookmarksVisible={isBookmarksVisible}
        />

        {/* 顶穹 · 容器感知收藏栏 */}
        {isBookmarksVisible && <BookmarksBar />}

        {/* 中心主网页 WebContentsView 几何对齐锚点 */}
        <main
          ref={contentRef}
          className="flex-1 w-full bg-slate-950 relative overflow-hidden"
        >
          {/* 当无活动标签时的优雅空状态占位 */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 pointer-events-none select-none">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800/80 flex items-center justify-center mb-3 shadow-inner">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
                P
              </span>
            </div>
            <p className="text-xs text-slate-500">正在载入物理隔离安全视窗...</p>
          </div>
        </main>
      </div>

      {/* 右翼 · 扩展坞 (40px) */}
      <RightDock />

      {/* 容器属性编辑抽屉 (Inspector Drawer) */}
      <ContainerInspector />
    </div>
  )
}

export default App
