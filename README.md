# 棱界 (Prism) 浏览器

<p align="center">
  <strong>一束光，多重身份。一个浏览器，多个并行的“我”。</strong>
</p>

<p align="center">
  基于 Electron 33+ 与 Vite 打造的全景环绕式多容器物理隔离浏览器。
</p>

---

## ✨ 核心特性矩阵

### 🧭 全景环绕式生产力工作台 (Pan-Surround UI)
- **左翼 · 容器中心化管理栏 (Container Sidebar)**：以容器为第一分组的垂直页面树，支持展开/折叠与紧凑迷你坞（Mini Dock）模式。支持标签直接跨容器拖拽迁移（Drag-to-Migrate）与拖拽触发左右分屏（Drag-to-Split）。
- **顶穹 · 容器感知型收藏栏 (Container Bookmarks Bar)**：快捷键 `Ctrl+Shift+B` 极速显隐，书签可与特定容器深度绑定，点击书签智能自动分流至目标容器打开。
- **右翼 · 扩展侧栏与 SidePanel (Extension Dock & SidePanel)**：40px 垂直扩展坞 + 独立 WebContentsView 侧视窗，支持 1Password 凭据速查、AI 助手与沉浸式翻译常驻并行交互，不遮挡网页主体。
- **中心 · 双容器 Split View 分屏**：同一窗口左右 50:50 或自适应比例分屏，不同容器页面并行展示与实时比对。

### 🛡️ 物理级隔离与深度环境拟真
- **物理级多容器隔离**：各容器间 Cookie、LocalStorage、IndexedDB、Cache 彻底物理解耦。同一网站（Google、GitHub、Twitter、AWS 等）在不同容器内并行登录多个账号，互不干扰、绝不串号。
- **深度环境与指纹拟真**：支持每个容器独立配置代理（HTTP/SOCKS5）、时区（CDP 级时区覆盖）、语言（Accept-Language 与 navigator.languages 联动）、经纬度地理位置及 DoH 防泄露，完美应对严苛风控。
- **一键深度净化与沙盒**：支持一键清空指定容器缓存数据，或创建阅后即焚的纯内存临时容器。

### 🧩 官方扩展商店闭环与 1Password 跨容器协同
- **官方商店一键直装**：原生支持在 **Chrome 网上应用店** 与 **Edge 加载项商店** 直接点击“添加至 Chrome / 获取”一键安装，后台自动完成 CRX3 官方包解析与解压热加载。
- **扩展 Action Popup 视窗**：支持扩展在地址栏右侧托盘展示图标，点击平滑弹出原生扩展小窗口（支持 1Password、MetaMask、沉浸式翻译等）。
- **细粒度容器作用域**：扩展支持全局共享（如 1Password、uBlock）或指定容器独占（如工作内网助手、开发者调试工具）。
- **1Password 跨容器中继**：独创跨 Session Native Messaging 中继，一次指纹/主密码解锁，所有容器同步感知并自动安全填充表单。

### 🚀 极客效率与资产便携
- **现代 WebContentsView 调度**：毫秒级视窗切换，彻底摒弃重绘闪烁与卡顿。
- **后台标签智能休眠 (Memory Saver)**：闲置后台标签自动释放 GPU/DOM 内存，点击秒级无感唤醒，内存开销减少 60% 以上。
- **Ctrl+K 棱镜全局命令盘**：全键盘秒切容器、切换代理、分屏对比、快速搜索所有标签与收藏。
- **容器专属下载管理**：按容器自动分流下载子目录，下载文件带容器色彩角标。
- **容器资产加密便携迁移**：支持将容器及登录态加密打包导出为 `.prism` 备份文件，换机一键复原。

---

## 📚 详细文档导航

- [📖 核心功能需求与系统设计规范 (PRD v1.3.0)](specs/functional_specification.md)
- [🧭 项目上下文指南与架构选型 (Context)](contexts/context.md)

---

## 🛠️ 技术栈

- **宿主环境**：Electron 33+ (Chromium 130+)
- **构建工程**：electron-vite (Vite 5+)
- **前端架构**：React 18 + TypeScript 5
- **样式方案**：Tailwind CSS (v4)
- **状态管理**：Zustand
- **视窗技术**：BaseWindow + WebContentsView (中心主视窗 + 右侧 SidePanel)
- **加密安全**：Electron safeStorage + AES-256-GCM
