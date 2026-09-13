import React from 'react'
import { Plus, PanelLeftOpen, Briefcase, User, Globe, Flame, Shield } from 'lucide-react'
import { useContainerStore } from '../../store/useContainerStore'
import { useTabStore } from '../../store/useTabStore'

const ICON_MAP: Record<string, React.ReactNode> = {
  Briefcase: <Briefcase className="w-4 h-4" />,
  User: <User className="w-4 h-4" />,
  Globe: <Globe className="w-4 h-4" />,
  Flame: <Flame className="w-4 h-4" />
}

export const MiniDock: React.FC = () => {
  const { containers, activeContainerId, setActiveContainerId, toggleSidebar } = useContainerStore()
  const { getTabsByContainer, createTab } = useTabStore()

  return (
    <aside className="w-12 bg-slate-900 border-r border-slate-800 flex flex-col items-center py-3 select-none z-20">
      {/* 展开全树按钮 */}
      <button
        onClick={toggleSidebar}
        title="展开左侧容器管理栏 (Ctrl+\)"
        className="p-2 mb-3 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
      >
        <PanelLeftOpen className="w-4 h-4" />
      </button>

      {/* 垂直容器彩色圆形徽标列表 */}
      <div className="flex-1 w-full flex flex-col items-center gap-3 overflow-y-auto scrollbar-none px-1">
        {containers.map((c) => {
          const isActive = c.id === activeContainerId
          const tabs = getTabsByContainer(c.id)
          const tabCount = tabs.length

          return (
            <div key={c.id} className="relative group">
              <button
                onClick={() => setActiveContainerId(c.id)}
                className={`relative w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                  isActive
                    ? 'ring-2 ring-offset-2 ring-offset-slate-900 scale-105'
                    : 'opacity-70 hover:opacity-100 hover:scale-105'
                }`}
                style={{
                  backgroundColor: `${c.color}22`,
                  color: c.color,
                  boxShadow: isActive ? `0 0 12px ${c.color}66` : undefined,
                  borderColor: c.color
                }}
                title={`${c.name} (${tabCount} 个页面)`}
              >
                {ICON_MAP[c.icon] || <Shield className="w-4 h-4" />}

                {/* 活跃指示小白条 */}
                {isActive && (
                  <span
                    className="absolute -left-1.5 w-1 h-5 rounded-r-full"
                    style={{ backgroundColor: c.color }}
                  />
                )}

                {/* 打开页面数量数字角标 */}
                {tabCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 text-[10px] font-bold px-1 rounded-full text-slate-950"
                    style={{ backgroundColor: c.color }}
                  >
                    {tabCount}
                  </span>
                )}
              </button>

              {/* 悬浮气泡提示 */}
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-2 bg-slate-800 text-slate-200 text-xs px-2.5 py-1.5 rounded-md shadow-xl whitespace-nowrap z-50 pointer-events-none border border-slate-700">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                <span>{c.name}</span>
                <span className="text-slate-400 font-mono text-[11px]">({tabCount})</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* 快捷新建标签 */}
      <button
        onClick={() => {
          if (activeContainerId) {
            createTab(activeContainerId, 'https://www.google.com')
          }
        }}
        title="在当前容器新建标签页"
        className="w-8 h-8 mt-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 flex items-center justify-center transition-colors border border-slate-700/50"
      >
        <Plus className="w-4 h-4" />
      </button>
    </aside>
  )
}
