import React from 'react'
import { Bookmark, Globe, Star } from 'lucide-react'
import { useTabStore } from '../../store/useTabStore'
import { useContainerStore } from '../../store/useContainerStore'

interface BookmarkItem {
  title: string
  url: string
  icon?: string
}

const DEFAULT_BOOKMARKS: BookmarkItem[] = [
  { title: 'Google', url: 'https://www.google.com' },
  { title: 'GitHub', url: 'https://github.com' },
  { title: 'Twitter / X', url: 'https://x.com' },
  { title: 'YouTube', url: 'https://www.youtube.com' },
  { title: 'Prism 扩展中心', url: 'https://chromewebstore.google.com' }
]

export const BookmarksBar: React.FC = () => {
  const { getActiveTab, navigateTab, createTab } = useTabStore()
  const { activeContainerId } = useContainerStore()

  const handleBookmarkClick = (url: string): void => {
    const active = getActiveTab()
    if (active) {
      navigateTab(active.id, url)
    } else if (activeContainerId) {
      createTab(activeContainerId, url)
    }
  }

  return (
    <div className="h-7 bg-slate-900/90 border-b border-slate-800/80 flex items-center px-3 gap-1 select-none z-10 text-xs text-slate-300 overflow-x-auto scrollbar-none shrink-0">
      <div className="flex items-center gap-1 text-slate-500 mr-1 text-[11px]">
        <Star className="w-3 h-3 text-amber-400/80" />
        <span>常用:</span>
      </div>

      {DEFAULT_BOOKMARKS.map((item, idx) => (
        <button
          key={idx}
          onClick={() => handleBookmarkClick(item.url)}
          className="flex items-center gap-1.5 px-2 py-0.5 rounded hover:bg-slate-800 hover:text-slate-100 text-slate-400 transition-colors whitespace-nowrap text-[11px]"
        >
          <Globe className="w-3 h-3 text-slate-500" />
          <span>{item.title}</span>
        </button>
      ))}
    </div>
  )
}
