# 棱界 (Prism) M1 阶段开发实施计划：核心底座与全景外壳

> **阶段目标**：搭建 Electron 33 + Vite + React 18 + Tailwind CSS 工程底座，实现 `ContainerManager` 物理级会话隔离与预设容器，构建以容器为核心的左侧管理栏，打通基于 `WebContentsView` 与 `LayoutManager` 的视窗调度，实测验证同站多容器并行独立登录。

---

## 阶段一总体架构规划

```mermaid
graph TD
    subgraph Main_Process [主进程 (Electron 33+)]
        MainApp[main/index.ts 应用程序生命周期]
        ContainerMgr[container/ContainerManager.ts 物理隔离会话]
        TabMgr[tab/TabManager.ts WebContentsView 调度]
        LayoutMgr[layout/LayoutManager.ts 几何边界计算与同步]
        IpcHandlers[ipc/handlers.ts 主进程 IPC 协议总线]
    end

    subgraph Preload_Bridge [Preload 预加载桥梁]
        PreloadBrowser[preload/browser.ts contextBridge API]
    end

    subgraph Renderer_Shell [渲染层 UI (React 18 + Tailwind v4 + Lucide)]
        AppShell[App.tsx 全景布局框架]
        Sidebar[components/sidebar/ 左侧容器管理栏 & MiniDock]
        NavBar[components/navbar/ 顶部地址导航栏 & 容器徽章]
        Bookmarks[components/bookmarks/ 顶部容器感知收藏栏]
        RightDock[components/right-dock/ 右侧扩展侧栏占位]
        Inspector[components/container-drawer/ 容器设置抽屉]
        ZustandStore[store/ 容器与标签响应式状态机]
    end

    MainApp --> ContainerMgr & TabMgr & LayoutMgr & IpcHandlers
    IpcHandlers <-->|IPC| PreloadBrowser
    PreloadBrowser <-->|Window.prismAPI| Renderer_Shell
```

---

## 关键技术与架构决策

1. **视窗与视窗架构**：本阶段中心网页使用 Electron 现代化 `WebContentsView` 架构，淘汰废弃的 `BrowserView` 与存在安全沙箱隐患的 `<webview>` 标签。
2. **开箱即用 4 组预置容器**：首次启动自动初始化【工作主舱】(蓝)、【个人空间】(绿)、【跨境出海】(橙)、【极客沙箱】(紫，纯内存分区)。
3. **默认布局**：左侧容器管理栏为第一默认布局（支持 240px 全展开与 48px 迷你坞一键折叠）。

---

## 计划创建与变更的文件列表 (Proposed Changes)

### 1. 工程脚手架与构建配置 (Tooling & Config)
- `package.json`: 配置 `electron@^33.0.0`, `electron-vite@^2.3.0`, `react@^18.3.1`, `tailwindcss@^4.0.0`, `zustand@^5.0.0`, `lucide-react@^0.475.0`
- `electron.vite.config.ts`: main, preload, renderer 配置与 Vite React 插件
- `tsconfig.json`, `tsconfig.node.json`, `tsconfig.web.json`: TypeScript 5 配置与路径别名

### 2. 主进程核心引擎 (Electron Main Core)
- `src/main/index.ts`: 主窗口创建与生命周期管理
- `src/main/container/ContainerManager.ts`: `session.fromPartition` 物理隔离会话、预设容器初始化、存储清洗
- `src/main/layout/LayoutManager.ts`: 渲染层尺寸监听与中心 `WebContentsView` 边界动态同步协议
- `src/main/tab/TabManager.ts`: `WebContentsView` 实例持有、容器绑定、标签切换/导航/销毁
- `src/main/ipc/handlers.ts`: 容器与标签 IPC 通道集中调度

### 3. 预加载脚本与类型安全桥梁 (Preload Bridge)
- `src/preload/browser.ts`: `contextBridge.exposeInMainWorld('prismAPI', ...)`
- `src/renderer/env.d.ts`: 完整的 TypeScript 接口与 Window 类型定义

### 4. 渲染层全景 UI 外壳 (Renderer Browser Shell)
- `src/renderer/index.html` & `src/renderer/main.tsx` & Tailwind 入口样式
- `src/renderer/App.tsx`: 全景工作台布局中枢
- `src/renderer/components/sidebar/`: `ContainerSidebar.tsx`, `MiniDock.tsx`, `ContainerItem.tsx`, `TabItem.tsx`
- `src/renderer/components/navbar/`: `NavBar.tsx` (地址栏、后退/前进/刷新、容器胶囊徽章)
- `src/renderer/components/bookmarks/`: `BookmarksBar.tsx` (容器感知收藏栏，快捷键 `Ctrl+Shift+B` 显隐)
- `src/renderer/components/container-drawer/`: `ContainerInspector.tsx` (容器外观与环境配置抽屉)
- `src/renderer/store/`: `useContainerStore.ts`, `useTabStore.ts` (Zustand 状态切片)

---

## 验证与测试计划 (Verification Plan)
1. **依赖与编译验证**：`pnpm install` -> `pnpm typecheck` -> `pnpm build`
2. **运行时验证**：`pnpm dev` 验证全景环绕 UI、4 组预设容器加载、240px 展开与 48px 迷你坞折叠、标签新建与导航、中心视窗边界对齐、同站多容器物理隔离测试。
