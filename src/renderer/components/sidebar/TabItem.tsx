import React from 'react'
import { X, Loader2, Globe } from 'lucide-react'
import { TabDefinition, ContainerDefinition } from '@shared/types'
import { useTabStore } from '../../store/useTabStore'

interface TabItemProps {
  tab: TabDefinition
  container: ContainerDefinition
}

export const TabItem: React.FC<TabItemProps> = ({ tab, container }) => {
  const { activeTabId, switchTab, closeTab } = useTabStore()
  const isActive = tab.id === activeTabId

  return (
    <div
      onClick={() => switchTab(tab.id)}
      className={`group relative flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition-all ${
        isActive
          ? 'bg-slate-800/90 text-slate-100 font-medium shadow-sm'
          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
      }`}
      style={{
        borderLeft: isActive ? `3px solid ${container.color}` : '3px solid transparent'
      }}
    >
      {/* 标题与 Favicon */}
      <div className="flex items-center gap-2 overflow-hidden flex-1 mr-2">
        {tab.isLoading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0 text-slate-400" />
        ) : tab.faviconUrl ? (
          <img
            src={tab.faviconUrl}
            alt=""
            className="w-3.5 h-3.5 rounded shrink-0 object-contain"
            onError={(e) => {
              ;(e.target as HTMLImageElement).style.display = 'none'
            }}
          />
        ) : (
          <Globe className="w-3.5 h-3.5 shrink-0 text-slate-500" />
        )}

        <span className="truncate text-[12px]">{tab.title || '新标签页'}</span>
      </div>

      {/* 关闭标签按钮 */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          closeTab(tab.id)
        }}
        title="关闭标签 (Ctrl+W)"
        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-700/60 rounded text-slate-400 hover:text-slate-200 transition-all shrink-0"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  )
}
