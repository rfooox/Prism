import { BaseWindow, WebContentsView } from 'electron'
import { LayoutBoundsPayload } from '@shared/types'

/**
 * 视窗几何边界与动态同步管理器
 */
export class LayoutManager {
  private currentBounds: LayoutBoundsPayload = { x: 240, y: 72, width: 800, height: 600 }
  private activeView: WebContentsView | null = null
  private window: BaseWindow | null = null

  constructor(window: BaseWindow) {
    this.window = window
  }

  /**
   * 绑定当前活跃的前台 WebContentsView
   */
  public setActiveView(view: WebContentsView | null): void {
    this.activeView = view
    this.applyBounds()
  }

  /**
   * 接收渲染层 React Shell 传来的最新内容视窗坐标
   */
  public updateBounds(bounds: LayoutBoundsPayload): void {
    this.currentBounds = bounds
    this.applyBounds()
  }

  /**
   * 获取当前视窗几何尺寸
   */
  public getBounds(): LayoutBoundsPayload {
    return { ...this.currentBounds }
  }

  /**
   * 物理应用 Bounds 至当前 WebContentsView
   */
  public applyBounds(): void {
    if (!this.activeView) return

    const { x, y, width, height } = this.currentBounds
    // 确保视窗尺寸不会出现负数
    const safeBounds = {
      x: Math.max(0, Math.floor(x)),
      y: Math.max(0, Math.floor(y)),
      width: Math.max(10, Math.floor(width)),
      height: Math.max(10, Math.floor(height))
    }

    try {
      this.activeView.setBounds(safeBounds)
    } catch (err) {
      console.error('设置 WebContentsView 边界失败:', err)
    }
  }
}
