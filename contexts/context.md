# 棱界 (Prism) — 项目上下文 (Context)

> **一束光，多重身份。一个浏览器，多个并行的“我”。**

---

## 1. 项目简介

**棱界 (Prism)** 是一款基于 **Electron + Vite (React + TypeScript)** 打造的**多容器物理隔离浏览器**。
针对现代开发者、独立创作者、跨境运营及多账号从业者，在同一浏览器窗口中实现完全物理隔离的多重容器环境。不同容器间的 Cookie、LocalStorage、IndexedDB、Cache 及网络会话彻底独立，同域多账号（如 Google、Twitter、GitHub、AWS 等）并行登录互不干扰。

同时，Prism 突破传统 Chromium 隔离方案的插件壁垒，原生支持在 Chrome / Edge 官方扩展商店直接一键安装插件，支持为特定容器分配独立插件，并实现 1Password 等主流密码管理器的跨容器无缝自动填充。

---

## 2. 核心价值主张

| 核心痛点 | 传统方案弊端 | 棱界 (Prism) 创新方案 |
| :--- | :--- | :--- |
| **多账号并行切换** | 多开不同浏览器或频繁隐身窗口，系统内存爆满，状态无法保留 | **Session Partition 物理隔离**：单窗口常驻，各容器独立持久化，秒级切换 |
| **容易串号/污染** | 切换失误导致工作/私人账号信息交叉污染 | **视觉化边界与智能路由**：容器专属主题色、标签色带及域名自动化规则 |
| **扩展管理割裂** | 多 Profile 导致各插件重复安装、重复配置，甚至无法安装商店插件 | **商店原生一键安装 + 细粒度容器作用域**：全局插件共享，专用插件定向注入 |
| **密码填充断层** | 多开浏览器或无头环境无法调用 1Password 桌面端原生通信 | **跨容器 Native Messaging 中继**：单点解锁，所有容器自动感知并填充对应账号 |

---

## 3. 技术栈体系

- **桌面运行时**：`Electron` (v33+)
- **构建工具**：`electron-vite` (Vite 5+)
- **前端框架**：`React 18` + `TypeScript 5`
- **UI 样式**：`Tailwind CSS` (v4) + `Lucide React` 图标库
- **状态管理**：`Zustand` (响应式状态管理)
- **多窗口/视图层**：`BaseWindow` + `WebContentsView` (Chromium 现代化多层架构)
- **存储与安全**：`Electron safeStorage` (凭据加密) + 本地 LevelDB / JSON 持久化存储

---

## 4. 模块结构规划

```text
src/
├── main/                   # 主进程 (Electron Main)
│   ├── container/          # 容器隔离引擎 (Session Partition 管理)
│   ├── tab/                # 标签页与 WebContentsView 调度
│   ├── extension/          # 扩展一键安装、CRX 解包与作用域分发
│   ├── native-messaging/   # 1Password / 密码管理器 Native Messaging 中继
│   ├── rule/               # 智能域名路由引擎 (Site Rules)
│   ├── proxy/              # 容器级代理切换与鉴权
│   └── security/           # 存储加密与数据清除保护
├── preload/                # 预加载脚本 (Preload Scripts)
│   ├── browser.ts          # 浏览器外壳 UI 与主进程 IPC 桥梁
│   └── guest.ts            # 注入网页的隔离上下文增强脚本
└── renderer/               # 渲染进程 (Browser Shell UI)
    ├── components/         # 标签栏、地址栏、容器侧边栏、扩展弹窗
    ├── hooks/              # 容器状态、标签调度 Hooks
    ├── store/              # Zustand 状态切片
    └── App.tsx             # 浏览器主界面框架
```
