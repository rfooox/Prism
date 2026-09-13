import { app, session, Session } from 'electron'
import * as fs from 'fs'
import * as path from 'path'
import { ContainerDefinition } from '@shared/types'

/**
 * 默认初始化的 4 组场景容器
 */
const DEFAULT_CONTAINERS: ContainerDefinition[] = [
  {
    id: 'work',
    name: '工作主舱',
    color: '#3B82F6', // 经典企业蓝
    icon: 'Briefcase',
    partition: 'persist:prism_work',
    isPrivate: false,
    isCollapsed: false,
    createdAt: Date.now()
  },
  {
    id: 'personal',
    name: '个人空间',
    color: '#10B981', // 活力清新绿
    icon: 'User',
    partition: 'persist:prism_personal',
    isPrivate: false,
    isCollapsed: false,
    createdAt: Date.now() + 1
  },
  {
    id: 'global',
    name: '跨境出海',
    color: '#F59E0B', // 出海活力橙
    icon: 'Globe',
    partition: 'persist:prism_global',
    isPrivate: false,
    isCollapsed: false,
    environmentOverrides: {
      timezoneId: 'America/New_York',
      locale: 'en-US'
    },
    createdAt: Date.now() + 2
  },
  {
    id: 'sandbox',
    name: '极客沙箱',
    color: '#8B5CF6', // 神秘极客紫
    icon: 'Flame',
    partition: 'prism_sandbox_memory', // 非 persist: 前缀，纯内存阅后即焚
    isPrivate: true,
    isCollapsed: false,
    createdAt: Date.now() + 3
  }
]

export class ContainerManager {
  private containers: Map<string, ContainerDefinition> = new Map()
  private sessions: Map<string, Session> = new Map()
  private configPath: string
  private onContainersChangeCallbacks: Array<(containers: ContainerDefinition[]) => void> = []

  constructor() {
    const configDir = path.join(app.getPath('userData'), 'Prism')
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true })
    }
    this.configPath = path.join(configDir, 'containers.json')
    this.loadContainers()
  }

  /**
   * 加载或初始化容器配置
   */
  private loadContainers(): void {
    if (fs.existsSync(this.configPath)) {
      try {
        const raw = fs.readFileSync(this.configPath, 'utf-8')
        const list: ContainerDefinition[] = JSON.parse(raw)
        if (Array.isArray(list) && list.length > 0) {
          list.forEach((c) => this.containers.set(c.id, c))
          return
        }
      } catch (err) {
        console.error('加载容器配置失败，使用默认配置:', err)
      }
    }

    // 写入默认预置容器
    DEFAULT_CONTAINERS.forEach((c) => this.containers.set(c.id, c))
    this.saveContainers()
  }

  /**
   * 持久化容器列表至磁盘
   */
  private saveContainers(): void {
    try {
      const list = Array.from(this.containers.values())
      fs.writeFileSync(this.configPath, JSON.stringify(list, null, 2), 'utf-8')
      this.notifyChange()
    } catch (err) {
      console.error('保存容器配置失败:', err)
    }
  }

  /**
   * 获取或初始化容器对应的底层 Session
   */
  public getOrCreateSession(containerId: string): Session {
    if (this.sessions.has(containerId)) {
      return this.sessions.get(containerId)!
    }

    const container = this.containers.get(containerId)
    const partition = container ? container.partition : `persist:prism_${containerId}`
    const sess = session.fromPartition(partition, { cache: true })

    // 应用代理配置 (如果已配置)
    if (container?.proxyConfig?.enabled) {
      const { type, host, port } = container.proxyConfig
      sess.setProxy({ proxyRules: `${type}://${host}:${port}` })
    }

    this.sessions.set(containerId, sess)
    return sess
  }

  /**
   * 获取所有容器列表
   */
  public getAllContainers(): ContainerDefinition[] {
    return Array.from(this.containers.values())
  }

  /**
   * 根据 ID 获取容器
   */
  public getContainer(id: string): ContainerDefinition | undefined {
    return this.containers.get(id)
  }

  /**
   * 创建新容器
   */
  public createContainer(def: Omit<ContainerDefinition, 'partition' | 'createdAt'>): ContainerDefinition {
    const partition = def.isPrivate ? `prism_${def.id}_mem` : `persist:prism_${def.id}`
    const newContainer: ContainerDefinition = {
      ...def,
      partition,
      createdAt: Date.now()
    }
    this.containers.set(newContainer.id, newContainer)
    this.saveContainers()
    return newContainer
  }

  /**
   * 更新容器配置
   */
  public updateContainer(id: string, updates: Partial<ContainerDefinition>): ContainerDefinition {
    const existing = this.containers.get(id)
    if (!existing) {
      throw new Error(`未找到容器: ${id}`)
    }

    const updated = { ...existing, ...updates }
    this.containers.set(id, updated)
    this.saveContainers()

    // 若修改了代理设置，实时同步给底层 Session
    if (updates.proxyConfig) {
      const sess = this.getOrCreateSession(id)
      if (updates.proxyConfig.enabled) {
        const { type, host, port } = updates.proxyConfig
        sess.setProxy({ proxyRules: `${type}://${host}:${port}` })
      } else {
        sess.setProxy({ proxyRules: '' })
      }
    }

    return updated
  }

  /**
   * 删除容器及相关物理数据
   */
  public async deleteContainer(id: string): Promise<boolean> {
    const container = this.containers.get(id)
    if (!container) return false

    // 清空会话数据
    await this.clearContainerData(id)

    this.containers.delete(id)
    this.sessions.delete(id)
    this.saveContainers()
    return true
  }

  /**
   * 深度清洗指定容器的缓存与 Cookie
   */
  public async clearContainerData(id: string): Promise<boolean> {
    try {
      const sess = this.getOrCreateSession(id)
      await sess.clearStorageData()
      await sess.clearCache()
      return true
    } catch (err) {
      console.error(`清洗容器 ${id} 数据失败:`, err)
      return false
    }
  }

  /**
   * 监听容器更新
   */
  public onContainersChange(callback: (containers: ContainerDefinition[]) => void): () => void {
    this.onContainersChangeCallbacks.push(callback)
    return () => {
      this.onContainersChangeCallbacks = this.onContainersChangeCallbacks.filter((c) => c !== callback)
    }
  }

  private notifyChange(): void {
    const list = this.getAllContainers()
    this.onContainersChangeCallbacks.forEach((cb) => cb(list))
  }
}
