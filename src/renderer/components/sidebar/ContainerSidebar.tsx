import React from 'react'
import { PanelLeftClose, Plus, Layers } from 'lucide-react'
import { useContainerStore } from '../../store/useContainerStore'
import { ContainerItem } from './ContainerItem'

export const ContainerSidebar: React.FC = () => {
  const { containers, toggleSidebar, createContainer } = useContainerStore()

  const handleAddNewContainer = async (): Promise<void> => {
    const defaultNames = ['测试沙箱', '出海营销', '临时协作', '日常项目']
    const colors = ['#EC4899', '#06B6D4', '#84CC16', '#F97316']
    const randomIdx = Math.floor(Math.random() * defaultNames.length)
    const id = `custom_${Date.now().toString(36)}`

    await createContainer({
      id,
      name: `${defaultNames[randomIdx]}-${Math.floor(Math.random() * 100)}`,
      color: colors[randomIdx],
      icon: 'Layers',
      isPrivate: false,
      isCollapsed: false
    })
  }

  return (
    <aside className="w-60 bg-slate-900/95 border-r border-slate-800/90 flex flex-col h-full select-none z-20 shrink-0">
      {/* 顶部标题栏区域 */}
      <div className="h-12 px-3.5 flex items-center justify-between border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-md shadow-indigo-500/20">
            <Layers className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-sm tracking-wide bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
            棱界 Prism
          </span>
        </div>

        <button
          onClick={toggleSidebar}
          title="折叠为迷你坞 (Ctrl+\)"
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        >
          <PanelLeftClose className="w-4 h-4" />
        </button>
      </div>

      {/* 容器树状列表 */}
      <div className="flex-1 overflow-y-auto p-2 scrollbar-none space-y-1">
        <div className="px-2 py-1 text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
          数字身份空间
        </div>

        {containers.map((c) => (
          <ContainerItem key={c.id} container={c} />
        ))}
      </div>

      {/* 底部：新建容器按钮 */}
      <div className="p-2 border-t border-slate-800/80">
        <button
          onClick={handleAddNewContainer}
          className="w-full py-2 px-3 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-800/40 hover:bg-slate-800/80 text-slate-300 hover:text-slate-100 text-xs font-medium flex items-center justify-center gap-2 transition-all shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>新建隔离容器</span>
        </button>
      </div>
    </aside>
  )
}
