# 棱界 (Prism) — 项目核心上下文 (Context v1.2.0)

> **一束光，多重身份。一个浏览器，多个并行的“我”。**

---

## 1. 项目定位与核心愿景

**棱界 (Prism)** 是一款基于 **Electron 33+ 与 Vite 5+ (React 18 + TypeScript 5)** 打造的**现代化多容器物理隔离与深度环境拟真浏览器**。

它通过**以容器为核心单元的左侧页面管理栏 (Container-Centric Left Sidebar)** 作为人机交互中枢，打破多账号混杂和标签挤压的困局；底层结合 Chromium Session Partition 物理持久化、CDP 时区与环境拟真、官方扩展商店一键直装与 1Password 跨容器中继，为专业用户提供兼具纯净隔离与丝滑协同的高性能数字工作台。

---

## 2. 核心架构七大支柱 (Core Pillars v1.2.0)

```text
┌─────────────────────────────────────────────────────────────┐
│                       棱界 (Prism) 核心体系                  │
├──────────────────────────┬──────────────────────────────────┤
│ 1. 物理级多容器隔离      │ Session Partition 完全物理独立    │
│    (Multi-Container)     │ Cookie/Storage/Cache 彻底解耦    │
├──────────────────────────┼──────────────────────────────────┤
│ 2. 容器中心化左侧管理栏  │ 容器分组树 + 拖拽跨容器流转      │
│    (Container Sidebar)   │ 拖拽分屏 + 紧凑迷你坞 (Mini Dock)│
├──────────────────────────┼──────────────────────────────────┤
│ 3. 深度环境拟真防风控    │ 独立时区/语言/地理位置/UA/DoH    │
│    (Environment Override)│ 真实配合独立网络出口代理         │
├──────────────────────────┼──────────────────────────────────┤
│ 4. 官方扩展商店一键闭环  │ Chrome/Edge 商店页面直点直装     │
│    (Extension Ecosystem) │ Action Popup 浮窗与作用域分配    │
├──────────────────────────┼──────────────────────────────────┤
│ 5. 1Password 跨容器协同  │ Native Messaging 跨 Session 中继 │
│    (Password Management) │ 单点指纹解锁，所有容器无感填充   │
├──────────────────────────┼──────────────────────────────────┤
│ 6. 生产力视窗与分屏调度  │ WebContentsView 硬件加速秒切     │
│    (Productivity UX)     │ 双容器 Split View + 标签智能休眠 │
├──────────────────────────┼──────────────────────────────────┤
│ 7. 极客效率与资产便携    │ Ctrl+K 命令盘 + .prism 容器备份  │
│    (Power & Assets)      │ 专属下载隔离 + 智能域名路由      │
└──────────────────────────┴──────────────────────────────────┘
```

---

## 3. 技术栈架构与关键选型

- **桌面运行时**：`Electron 33+` (Chromium 130+)
- **构建工程**：`electron-vite` (Vite 5+)
- **前端架构**：`React 18` + `TypeScript 5`
- **UI 风格与样式**：`Tailwind CSS v4` + `Lucide React`
- **视窗管理**：`BaseWindow` + `WebContentsView` 现代化架构（零重绘、硬件加速、原生流畅）
- **拖拽系统**：基于 HTML5 Drag and Drop API 打造的“拖拽改容器”与“拖拽触发左右分屏”
- **状态存储与安全**：`Zustand` 响应式切片 + `Electron safeStorage` 加密存储敏感凭据
- **扩展与包解析**：`adm-zip` 二进制 CRX3 Header 解析与解压引擎

---

## 4. 源码目录结构规划

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
    │   ├── sidebar/            # 容器左侧管理栏 (Container Tree, Mini Dock, Actions)
    │   ├── navbar/             # 顶部地址栏、容器徽章、扩展托盘
    │   ├── split/              # 双容器分屏指示器与比例调节条
    │   └── common/             # 色彩胶囊、图标、模态抽屉
    ├── command-palette/        # Ctrl+K 全局速控命令面板
    ├── hooks/                  # 容器状态、拖拽流转、分屏 hooks
    ├── store/                  # Zustand 状态切片
    └── App.tsx                 # 浏览器主界面框架
```
