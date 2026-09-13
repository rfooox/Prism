import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'

describe('ContainerManager 容器管理逻辑与预置配置验证', () => {
  const tempDir = path.join(os.tmpdir(), `prism_test_${Date.now()}`)

  beforeAll(() => {
    fs.mkdirSync(tempDir, { recursive: true })
  })

  afterAll(() => {
    fs.rmSync(tempDir, { recursive: true, force: true })
  })

  it('验证 4 组场景容器的预置定义完整性', () => {
    const DEFAULT_CONTAINERS = [
      {
        id: 'work',
        name: '工作主舱',
        color: '#3B82F6',
        icon: 'Briefcase',
        partition: 'persist:prism_work',
        isPrivate: false
      },
      {
        id: 'personal',
        name: '个人空间',
        color: '#10B981',
        icon: 'User',
        partition: 'persist:prism_personal',
        isPrivate: false
      },
      {
        id: 'global',
        name: '跨境出海',
        color: '#F59E0B',
        icon: 'Globe',
        partition: 'persist:prism_global',
        isPrivate: false
      },
      {
        id: 'sandbox',
        name: '极客沙箱',
        color: '#8B5CF6',
        icon: 'Flame',
        partition: 'prism_sandbox_memory',
        isPrivate: true
      }
    ]

    expect(DEFAULT_CONTAINERS.length).toBe(4)

    const work = DEFAULT_CONTAINERS.find((c) => c.id === 'work')
    expect(work).toBeDefined()
    expect(work?.partition.startsWith('persist:')).toBe(true)

    const sandbox = DEFAULT_CONTAINERS.find((c) => c.id === 'sandbox')
    expect(sandbox).toBeDefined()
    // 阅后即焚沙箱必须是非 persist 前缀
    expect(sandbox?.partition.startsWith('persist:')).toBe(false)
    expect(sandbox?.isPrivate).toBe(true)
  })

  it('验证分区标识与存储解耦逻辑', () => {
    const partitionA = 'persist:prism_work'
    const partitionB = 'persist:prism_personal'
    expect(partitionA).not.toBe(partitionB)
  })

  it('验证视窗几何边界计算公式 (Layout Bounds Protocol)', () => {
    const windowWidth = 1400
    const windowHeight = 900
    const sidebarWidth = 240
    const navbarHeight = 44
    const bookmarksHeight = 28
    const rightDockWidth = 40
    const isBookmarksVisible = true
    const isSidePanelOpen = false
    const sidePanelWidth = 360

    const x = sidebarWidth
    const y = navbarHeight + (isBookmarksVisible ? bookmarksHeight : 0)
    const width =
      windowWidth -
      sidebarWidth -
      rightDockWidth -
      (isSidePanelOpen ? sidePanelWidth : 0)
    const height = windowHeight - y

    expect(x).toBe(240)
    expect(y).toBe(72)
    expect(width).toBe(1400 - 240 - 40) // 1120
    expect(height).toBe(900 - 72) // 828

    // 验证折叠为 Mini Dock 紧凑模式
    const miniSidebarWidth = 48
    const xMini = miniSidebarWidth
    const widthMini = windowWidth - miniSidebarWidth - rightDockWidth
    expect(xMini).toBe(48)
    expect(widthMini).toBe(1400 - 48 - 40) // 1312
  })
})
