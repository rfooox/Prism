import React, { useState, useEffect } from 'react'
import {
  X,
  Trash2,
  Brush,
  Palette,
  Shield,
  Briefcase,
  User,
  Globe,
  Flame,
  Layers,
  Code,
  Zap,
  Network,
  Check
} from 'lucide-react'
import { useContainerStore } from '../../store/useContainerStore'

const PRESET_COLORS = [
  '#3B82F6', // 蓝
  '#10B981', // 绿
  '#F59E0B', // 橙黄
  '#8B5CF6', // 紫
  '#EC4899', // 粉
  '#06B6D4', // 青
  '#84CC16', // 荧光绿
  '#F97316', // 橙
  '#6366F1', // 靛青
  '#D946EF', // 玫红
  '#EF4444', // 红
  '#64748B'  // 灰蓝
]

const ICON_OPTIONS = [
  { id: 'Briefcase', label: '工作', icon: <Briefcase className="w-4 h-4" /> },
  { id: 'User', label: '个人', icon: <User className="w-4 h-4" /> },
  { id: 'Globe', label: '出海', icon: <Globe className="w-4 h-4" /> },
  { id: 'Flame', label: '沙箱', icon: <Flame className="w-4 h-4" /> },
  { id: 'Layers', label: '多重', icon: <Layers className="w-4 h-4" /> },
  { id: 'Code', label: '开发', icon: <Code className="w-4 h-4" /> },
  { id: 'Zap', label: '极速', icon: <Zap className="w-4 h-4" /> },
  { id: 'Shield', label: '安全', icon: <Shield className="w-4 h-4" /> }
]

export const ContainerInspector: React.FC = () => {
  const { inspectingContainerId, containers, closeInspector, updateContainer, clearContainerData, deleteContainer } =
    useContainerStore()

  const container = containers.find((c) => c.id === inspectingContainerId)

  const [name, setName] = useState('')
  const [color, setColor] = useState('')
  const [icon, setIcon] = useState('')
  const [isCleaning, setIsCleaning] = useState(false)
  const [cleanSuccess, setCleanSuccess] = useState(false)

  useEffect(() => {
    if (container) {
      setName(container.name)
      setColor(container.color)
      setIcon(container.icon)
    }
  }, [container])

  if (!container) return null

  const handleSave = (): void => {
    updateContainer(container.id, { name, color, icon })
  }

  const handleCleanData = async (): Promise<void> => {
    setIsCleaning(true)
    const ok = await clearContainerData(container.id)
    setIsCleaning(false)
    if (ok) {
      setCleanSuccess(true)
      setTimeout(() => setCleanSuccess(false), 2000)
    }
  }

  const handleDelete = async (): Promise<void> => {
    if (confirm(`确定要彻底删除容器 [${container.name}] 及其所有数据吗？`)) {
      await deleteContainer(container.id)
      closeInspector()
    }
  }

  return (
    <div className="fixed inset-y-0 left-0 w-80 bg-slate-900 border-r border-slate-800 shadow-2xl z-50 flex flex-col select-none animate-in slide-in-from-left duration-200">
      {/* 抽屉头部 */}
      <div className="h-12 px-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: container.color }} />
          <h2 className="font-semibold text-sm text-slate-100">容器配置与环境</h2>
        </div>

        <button
          onClick={closeInspector}
          className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* 抽屉表单内容 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-none text-xs">
        {/* 名称修改 */}
        <div>
          <label className="block text-slate-400 font-medium mb-1.5">容器名称</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleSave}
            className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-lg px-3 py-2 text-slate-200 outline-none transition-colors"
          />
        </div>

        {/* 12 色现代化主题色板 */}
        <div>
          <label className="flex items-center gap-1.5 text-slate-400 font-medium mb-2">
            <Palette className="w-3.5 h-3.5" />
            <span>专属主题色</span>
          </label>
          <div className="grid grid-cols-6 gap-2">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setColor(c)
                  updateContainer(container.id, { color: c })
                }}
                className={`w-7 h-7 rounded-lg transition-transform flex items-center justify-center ${
                  color === c ? 'scale-110 ring-2 ring-white ring-offset-2 ring-offset-slate-900' : 'hover:scale-105'
                }`}
                style={{ backgroundColor: c }}
              >
                {color === c && <Check className="w-3.5 h-3.5 text-white" />}
              </button>
            ))}
          </div>
        </div>

        {/* 图标选择 */}
        <div>
          <label className="block text-slate-400 font-medium mb-2">容器图标</label>
          <div className="grid grid-cols-4 gap-2">
            {ICON_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  setIcon(opt.id)
                  updateContainer(container.id, { icon: opt.id })
                }}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all ${
                  icon === opt.id
                    ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                    : 'border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                {opt.icon}
                <span className="text-[10px]">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 环境信息概览 */}
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-2 text-[11px]">
          <div className="text-slate-400 font-medium flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>隔离分区标识:</span>
          </div>
          <p className="font-mono text-slate-500 truncate bg-slate-900 px-2 py-1 rounded">
            {container.partition}
          </p>

          <div className="text-slate-400 font-medium flex items-center gap-1.5 mt-2">
            <Network className="w-3.5 h-3.5 text-blue-400" />
            <span>专属网络出口:</span>
          </div>
          <p className="text-slate-400">
            {container.proxyConfig?.enabled
              ? `${container.proxyConfig.type}://${container.proxyConfig.host}:${container.proxyConfig.port}`
              : '直连模式 (Direct)'}
          </p>
        </div>

        {/* 深度清洗与安全操作 */}
        <div className="pt-2 border-t border-slate-800/80 space-y-2.5">
          <button
            onClick={handleCleanData}
            disabled={isCleaning}
            className="w-full py-2 px-3 rounded-lg border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 flex items-center justify-center gap-2 transition-colors"
          >
            <Brush className="w-3.5 h-3.5" />
            <span>{isCleaning ? '正在清洗...' : cleanSuccess ? '已深度清空缓存与Cookie' : '一键清洗容器缓存'}</span>
          </button>

          <button
            onClick={handleDelete}
            className="w-full py-2 px-3 rounded-lg border border-red-500/40 bg-red-500/10 hover:bg-red-500/20 text-red-300 flex items-center justify-center gap-2 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>彻底销毁此容器</span>
          </button>
        </div>
      </div>
    </div>
  )
}
