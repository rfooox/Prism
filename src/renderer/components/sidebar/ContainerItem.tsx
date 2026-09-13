import React, { useState } from 'react'
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Settings,
  Briefcase,
  User,
  Globe,
  Flame,
  Shield,
  Moon
} from 'lucide-react'
import { ContainerDefinition } from '@shared/types'
import { TabItem } from './TabItem'
import { useTabStore } from '../../store/useTabStore'
import { useContainerStore } from '../../store/useContainerStore'

const ICON_MAP: Record<string, React.ReactNode> = {
  Briefcase: <Briefcase className="w-3.5 h-3.5" />,
  User: <User className="w-3.5 h-3.5" />,
  Globe: <Globe className="w-3.5 h-3.5" />,
  Flame: <Flame className="w-3.5 h-3.5" />
}

interface ContainerItemProps {
  container: ContainerDefinition
}

export const ContainerItem: React.FC<ContainerItemProps> = ({ container }) => {
  const [isCollapsed, setIsCollapsed] = useState(container.isCollapsed || false)
  const { getTabsByContainer, createTab } = useTabStore()
  const { activeContainerId, setActiveContainerId, openInspector } = useContainerStore()

  const tabs = getTabsByContainer(container.id)
  const isActiveContainer = container.id === activeContainerId

  const handleHeaderClick = (): void => {
    setActiveContainerId(container.id)
  }

  const handleCreateTab = (e: React.MouseEvent): void => {
    e.stopPropagation()
    createTab(container.id, 'https://www.google.com')
    if (isCollapsed) setIsCollapsed(false)
  }

  return (
    <div className="mb-2 select-none">
      {/* 容器卡片头部 */}
      <div
        onClick={handleHeaderClick}
        className={`group flex items-center justify-between px-2.5 py-2 rounded-lg cursor-pointer transition-all ${
          isActiveContainer
            ? 'bg-slate-800/80 text-slate-100 shadow-sm'
            : 'text-slate-300 hover:bg-slate-800/40 hover:text-slate-100'
        }`}
      >
        {/* 左侧：折叠箭头 + 容器图标 + 容器名称 */}
        <div className="flex items-center gap-2 overflow-hidden flex-1">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsCollapsed(!isCollapsed)
            }}
            className="text-slate-500 hover:text-slate-300 p-0.5 rounded transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>

          <span
            className="flex items-center justify-center w-5 h-5 rounded-md shrink-0"
            style={{ backgroundColor: `${container.color}25`, color: container.color }}
          >
            {ICON_MAP[container.icon] || <Shield className="w-3.5 h-3.5" />}
          </span>

          <span className="truncate font-semibold text-xs text-slate-200">
            {container.name}
          </span>

          {/* 页面计数 */}
          <span className="text-[11px] text-slate-500 font-mono">
            {tabs.length}
          </span>
        </div>

        {/* 右侧动作栏 */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* 新建标签按钮 */}
          <button
            onClick={handleCreateTab}
            title="在此容器新建标签"
            className="p-1 hover:bg-slate-700/60 rounded text-slate-400 hover:text-slate-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>

          {/* 容器配置抽屉 */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              openInspector(container.id)
            }}
            title="容器设置"
            className="p-1 hover:bg-slate-700/60 rounded text-slate-400 hover:text-slate-200 transition-colors"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 展开的标签页列表 */}
      {!isCollapsed && (
        <div className="ml-3 pl-2 mt-1 space-y-0.5 border-l border-slate-800/80">
          {tabs.length > 0 ? (
            tabs.map((tab) => (
              <TabItem key={tab.id} tab={tab} container={container} />
            ))
          ) : (
            <div
              onClick={handleCreateTab}
              className="py-1.5 px-2 text-[11px] text-slate-600 hover:text-slate-400 cursor-pointer flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3 h-3" />
              <span>新建首个页面</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
