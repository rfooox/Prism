import React, { useState, useEffect } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Lock,
  Search,
  Command,
  Briefcase,
  User,
  Globe,
  Flame,
  Shield,
  Bookmark
} from 'lucide-react'
import { useTabStore } from '../../store/useTabStore'
import { useContainerStore } from '../../store/useContainerStore'

const ICON_MAP: Record<string, React.ReactNode> = {
  Briefcase: <Briefcase className="w-3.5 h-3.5" />,
  User: <User className="w-3.5 h-3.5" />,
  Globe: <Globe className="w-3.5 h-3.5" />,
  Flame: <Flame className="w-3.5 h-3.5" />
}

interface NavBarProps {
  onToggleBookmarks?: () => void
  isBookmarksVisible?: boolean
}

export const NavBar: React.FC<NavBarProps> = ({ onToggleBookmarks, isBookmarksVisible }) => {
  const { getActiveTab, navigateTab, reloadTab, goBackTab, goForwardTab } = useTabStore()
  const { containers, activeContainerId, openInspector } = useContainerStore()

  const activeTab = getActiveTab()
  const activeContainer = containers.find((c) => c.id === activeContainerId)

  const [inputUrl, setInputUrl] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  // 当活动标签改变时，自动同步 URL 输入框
  useEffect(() => {
    if (activeTab && !isFocused) {
      setInputUrl(activeTab.url || '')
    }
  }, [activeTab?.url, activeTab?.id, isFocused])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && activeTab) {
      let targetUrl = inputUrl.trim()
      if (!/^https?:\/\//i.test(targetUrl) && !/^about:/i.test(targetUrl)) {
        if (targetUrl.includes('.') && !targetUrl.includes(' ')) {
          targetUrl = 'https://' + targetUrl
        } else {
          targetUrl = `https://www.google.com/search?q=${encodeURIComponent(targetUrl)}`
        }
      }
      setInputUrl(targetUrl)
      navigateTab(activeTab.id, targetUrl)
      ;(e.target as HTMLInputElement).blur()
    }
  }

  return (
    <header className="h-11 bg-slate-900 border-b border-slate-800/90 flex items-center px-3 gap-2 select-none z-10 shrink-0">
      {/* 历史导航控制 */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => activeTab && goBackTab(activeTab.id)}
          disabled={!activeTab?.canGoBack}
          title="后退 (Alt+Left)"
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <button
          onClick={() => activeTab && goForwardTab(activeTab.id)}
          disabled={!activeTab?.canGoForward}
          title="前进 (Alt+Right)"
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => activeTab && reloadTab(activeTab.id)}
          disabled={!activeTab}
          title="刷新 (Ctrl+R)"
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        >
          <RotateCw className={`w-3.5 h-3.5 ${activeTab?.isLoading ? 'animate-spin text-blue-400' : ''}`} />
        </button>
      </div>

      {/* 容器身份标识胶囊 */}
      {activeContainer && (
        <div
          onClick={() => openInspector(activeContainer.id)}
          title={`当前身份：${activeContainer.name} (点击管理)`}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-all hover:scale-105 border shrink-0"
          style={{
            backgroundColor: `${activeContainer.color}15`,
            borderColor: `${activeContainer.color}44`,
            color: activeContainer.color
          }}
        >
          <span className="shrink-0">
            {ICON_MAP[activeContainer.icon] || <Shield className="w-3.5 h-3.5" />}
          </span>
          <span className="truncate max-w-[90px]">{activeContainer.name}</span>
        </div>
      )}

      {/* 智能地址输入栏 (Omnibar) */}
      <div className="flex-1 max-w-2xl mx-auto flex items-center relative">
        <div
          className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border text-xs transition-all ${
            isFocused
              ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md shadow-blue-500/10'
              : 'border-slate-800 hover:border-slate-700'
          }`}
        >
          {inputUrl.startsWith('https://') ? (
            <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          ) : (
            <Search className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          )}

          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            onFocus={(e) => {
              setIsFocused(true)
              e.target.select()
            }}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder="搜索或输入网址..."
            className="w-full bg-transparent outline-none text-slate-200 placeholder-slate-500 text-xs"
          />
        </div>
      </div>

      {/* 右侧工具栏按钮 */}
      <div className="flex items-center gap-1 shrink-0">
        {/* 顶部收藏夹开关 */}
        <button
          onClick={onToggleBookmarks}
          title="切换顶部收藏栏 (Ctrl+Shift+B)"
          className={`p-1.5 rounded-lg transition-colors ${
            isBookmarksVisible
              ? 'text-amber-400 bg-amber-400/10'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Bookmark className="w-4 h-4" />
        </button>

        {/* 全局速控命令面板提示 */}
        <button
          title="全局命令面板 (Ctrl+K)"
          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs transition-colors border border-slate-700/40"
        >
          <Command className="w-3 h-3" />
          <span className="font-mono text-[11px]">K</span>
        </button>
      </div>
    </header>
  )
}
