# 棱界 (Prism) — 项目核心上下文 (Context v1.3.0)

> **一束光，多重身份。一个浏览器，多个并行的“我”。**

---

## 1. 项目定位与核心愿景

**棱界 (Prism)** 是一款基于 **Electron 33+ 与 Vite 5+ (React 18 + TypeScript 5)** 打造的**全景环绕式多容器物理隔离与深度环境拟真浏览器**。

在 v1.3.0 规范中，Prism 确立了**“全景环绕式生产力工作台”**模型：
- **左翼（容器树状导航栏）**：以容器为第一分组的垂直页面树，支持跨容器拖拽迁移与拖拽左右分屏；
- **顶穹（智能地址栏 + 容器感知收藏栏）**：智能地址输入 + 绑定容器属性的智能分流收藏夹；
- **右翼（扩展侧栏与 SidePanel）**：40px 垂直扩展坞 + 独立 WebContentsView 侧视窗，支持 1Password、AI 与翻译工具无缝常驻；
- **中心（主网页视窗）**：单视窗或左右双容器 Split View 并行比对；
- **内核（物理隔离与环境拟真）**：Chromium Session Partitioning、CDP 级时区与位置拟真、DoH 防泄露与官方商店 CRX3 一键安装。

---

## 2. 核心架构八大支柱 (Core Pillars v1.3.0)

```text
┌─────────────────────────────────────────────────────────────┐
│                   棱界 (Prism) 全景环绕核心体系              │
├──────────────────────────┬──────────────────────────────────┤
│ 1. 物理级多容器隔离      │ Session Partition 完全物理独立    │
│    (Multi-Container)     │ Cookie/Storage/Cache 彻底解耦    │
├──────────────────────────┼──────────────────────────────────┤
│ 2. 容器中心化左侧管理栏  │ 容器分组树 + 拖拽跨容器流转      │
│    (Container Sidebar)   │ 拖拽分屏 + 紧凑迷你坞 (Mini Dock)│
├──────────────────────────┼──────────────────────────────────┤
│ 3. 容器感知型顶部收藏栏  │ 容器专属书签绑定 + 智能容器分流  │
│    (Container Bookmarks) │ Ctrl+Shift+B 极速显隐与通用导入  │
├──────────────────────────┼──────────────────────────────────┤
│ 4. 右侧扩展栏与SidePanel │ 垂直扩展坞 + 独立侧视窗并行协同  │
│    (Right Extension Dock)│ 1Password速查 + AI常驻辅助       │
├──────────────────────────┼──────────────────────────────────┤
│ 5. 深度环境拟真防风控    │ 独立时区/语言/地理位置/UA/DoH    │
│    (Environment Override)│ 真实配合独立网络出口代理         │
├──────────────────────────┼──────────────────────────────────┤
│ 6. 官方扩展商店一键闭环  │ Chrome/Edge 商店页面直点直装     │
│    (Extension Ecosystem) │ Action Popup 浮窗与作用域分配    │
├──────────────────────────┼──────────────────────────────────┤
│ 7. 1Password 跨容器协同  │ Native Messaging 跨 Session 中继 │
│    (Password Management) │ 单点指纹解锁，所有容器无感填充   │
├──────────────────────────┼──────────────────────────────────┤
│ 8. 生产力视窗与资产便携  │ WebContentsView 硬件加速秒切     │
│    (Productivity UX)     │ 双容器 Split View + .prism 备份  │
└──────────────────────────┴──────────────────────────────────┘
```

---

## 3. 源码目录结构规划

```text
src/
├── main/                       # 主进程 (Electron Main Core)
│   ├── container/              # 容器引擎: Session Partition 隔离与环境拟真
│   │   ├── ContainerManager.ts # 容器创建、持久化、销毁、清洗
│   │   ├── EnvironmentSpoof.ts # CDP 时区/语言/经纬度覆盖
│   │   └── ProxyManager.ts     # 容器专属代理配置与动态鉴权
│   ├── tab/                    # 标签调度与视窗管理
│   │   ├── TabManager.ts       # WebContentsView 挂载与切换调度
│   │   ├── SplitViewManager.ts # 双容器 Split View 分屏管理
│   │   └── TabDiscarder.ts     # 后台闲置标签智能休眠与恢复
│   ├── sidepanel/              # 右侧插件侧视窗管理 (SidePanelManager.ts)
│   ├── bookmark/               # 容器智能书签引擎 (BookmarkEngine.ts)
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
    │   ├── navbar/             # 顶部: 地址栏、容器徽章、扩展托盘
    │   ├── bookmarks/          # 顶部: 容器感知收藏栏 (Bookmarks Bar)
    │   ├── right-dock/         # 右翼: 扩展侧栏 (Extension Dock & SidePanel)
    │   ├── split/              # 中心: 双容器分屏指示器与比例调节条
    │   └── common/             # 色彩胶囊、图标、模态抽屉
    ├── command-palette/        # Ctrl+K 全局速控命令面板
    ├── hooks/                  # 容器状态、拖拽流转、分屏、书签 hooks
    ├── store/                  # Zustand 状态切片
    └── App.tsx                 # 浏览器主界面框架
```
