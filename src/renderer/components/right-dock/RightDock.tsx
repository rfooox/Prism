import React from 'react'
import { KeyRound, Bot, Languages, Plus, Settings } from 'lucide-react'

export const RightDock: React.FC = () => {
  return (
    <aside className="w-10 bg-slate-900 border-l border-slate-800 flex flex-col items-center py-2.5 justify-between select-none z-20 shrink-0">
      {/* 顶部扩展快捷托盘 */}
      <div className="flex flex-col items-center gap-2.5 w-full">
        {/* 1Password 跨容器协同快捷图标 */}
        <button
          title="1Password 跨容器凭据速查"
          className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 hover:scale-105 flex items-center justify-center transition-all border border-blue-500/30"
        >
          <KeyRound className="w-3.5 h-3.5" />
        </button>

        {/* 沉浸式翻译常驻图标 */}
        <button
          title="沉浸式翻译"
          className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 hover:scale-105 flex items-center justify-center transition-all border border-emerald-500/30"
        >
          <Languages className="w-3.5 h-3.5" />
        </button>

        {/* AI 助手常驻视窗 */}
        <button
          title="AI 网页助手"
          className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 hover:scale-105 flex items-center justify-center transition-all border border-purple-500/30"
        >
          <Bot className="w-3.5 h-3.5" />
        </button>

        {/* 扩展商店一键添加 */}
        <button
          onClick={() => {
            window.open('https://chromewebstore.google.com', '_blank')
          }}
          title="打开 Chrome 官方扩展商店"
          className="w-7 h-7 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700 flex items-center justify-center transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 底部全局设置图标 */}
      <div className="flex flex-col items-center gap-2">
        <button
          title="偏好设置"
          className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 flex items-center justify-center transition-colors"
        >
          <Settings className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  )
}
