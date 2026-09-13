# 棱界 (Prism) — 项目核心上下文 (Context v1.4.0)

> **一束光，多重身份。一个浏览器，多个并行的“我”。**

---

## 1. 项目定位与核心愿景

**棱界 (Prism)** 是一款基于 **Electron 33+ 与 Vite 5+ (React 18 + TypeScript 5)** 打造的**全景环绕式多容器物理隔离与深度环境拟真浏览器**。

在 v1.4.0 规范中，Prism 确立了**“全景环绕式生产力工作台”**模型与工程实施级规范：
- **左翼（容器树状导航栏）**：以容器为第一分组的垂直页面树，支持跨容器拖拽迁移与拖拽左右分屏；
- **顶穹（智能地址栏 + 容器感知收藏栏）**：智能地址输入 + 绑定容器属性的智能分流收藏夹；
- **右翼（扩展侧栏与 SidePanel）**：40px 垂直扩展坞 + 独立 WebContentsView 侧视窗，支持 1Password、AI 与翻译工具无缝常驻；
- **中心（主网页视窗）**：单视窗或双容器 Split View 并行比对，通过严谨的 LayoutManager 坐标同步协议与外壳无缝契合；
- **配置与恢复中心**：可视化快捷键自定义配置页面、`session-state.json` 轻量休眠恢复机制与开箱 4 组预置容器。

---

## 2. 源码目录结构规划 (v1.4.0)

```text
src/
├── main/                       # 主进程 (Electron Main Core)
│   ├── layout/                 # 视窗几何与边界同步协议 (LayoutManager.ts)
│   ├── container/              # 容器引擎: Session Partition 隔离与环境拟真
│   │   ├── ContainerManager.ts # 容器创建、持久化、销毁、预设模板
│   │   ├── EnvironmentSpoof.ts # CDP 时区/语言/经纬度覆盖
│   │   └── ProxyManager.ts     # 容器专属代理配置与动态鉴权
│   ├── tab/                    # 标签调度与视窗管理
│   │   ├── TabManager.ts       # WebContentsView 挂载与切换调度
│   │   ├── SplitViewManager.ts # 双容器 Split View 分屏管理
│   │   └── TabDiscarder.ts     # 后台闲置标签智能休眠与恢复
│   ├── sidepanel/              # 右侧插件侧视窗管理 (SidePanelManager.ts)
│   ├── bookmark/               # 容器智能书签引擎 (BookmarkEngine.ts)
│   ├── shortcuts/              # 快捷键监听与自定义映射引擎 (ShortcutsManager.ts)
│   ├── session/                # 会话持久化与轻量恢复 (SessionRestorer.ts)
│   ├── extension/              # 扩展生态与交互
│   │   ├── ExtensionManager.ts # 插件装载、生命周期与作用域分配
│   │   ├── CrxDownloader.ts    # 官方商店直拉 CRX3 与二进制解压
│   │   ├── ActionPopupView.ts  # 扩展右上角 Action Popup 悬浮视窗
│   │   └── NativeRelayServer.ts# 1Password Native Messaging 跨容器中继
│   ├── rule/                   # 智能域名路由引擎 (Site Rule Engine)
│   ├── download/               # 容器专属下载路径隔离 (ScopedDownloadManager)
│   └── security/               # safeStorage 凭据加密与 .prism 容器备份
├── preload/                    # 预加载脚本 (Preload Scripts)
│   ├── browser.ts              # 浏览器外壳 UI 与主进程双向 IPC
│   ├── store-hook.ts           # 官方商店页注入脚本 (捕获安装按钮)
│   └── guest.ts                # 注入网页的隔离与环境增强脚本
└── renderer/                   # 渲染层外壳 UI (Browser Shell UI)
    ├── components/             # 界面组件
    │   ├── sidebar/            # 左翼: 容器左侧管理栏 (Container Tree, Mini Dock)
    │   ├── container-drawer/   # 容器属性编辑与设置抽屉 (Container Inspector)
    │   ├── navbar/             # 顶部: 地址栏、容器徽章、扩展托盘
    │   ├── bookmarks/          # 顶部: 容器感知收藏栏 (Bookmarks Bar)
    │   ├── right-dock/         # 右翼: 扩展侧栏 (Extension Dock & SidePanel)
    │   ├── split/              # 中心: 双容器分屏指示器与比例调节条
    │   └── common/             # 色彩胶囊、图标、模态抽屉
    ├── settings/               # 全局设置视图
    │   └── shortcuts/          # 可视化快捷键自定义配置页面 (Key Recorder, 冲突检测)
    ├── command-palette/        # Ctrl+K 全局速控命令面板
    ├── hooks/                  # 容器状态、拖拽流转、分屏、快捷键 hooks
    ├── store/                  # Zustand 状态切片
    └── App.tsx                 # 浏览器主界面框架
```
