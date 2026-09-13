# 棱界 (Prism) 浏览器

<p align="center">
  <strong>一束光，多重身份。一个浏览器，多个并行的“我”。</strong>
</p>

<p align="center">
  基于 Electron + Vite 打造的多容器物理隔离浏览器。
</p>

---

## ✨ 核心特性

- 🌐 **物理级多容器隔离**：各容器间 Cookie、LocalStorage、IndexedDB、Cache 彻底物理隔离。同一网站（Google、GitHub、Twitter、AWS 等）可在不同容器内并行登录多个账号，绝不串号、互不干扰。
- 🛍️ **官方扩展商店一键安装**：支持在 **Chrome 网上应用店** 与 **Edge 加载项商店** 直接点击“添加至 Chrome / 获取”一键安装插件，无需手动解包配置。
- 🎯 **插件容器级作用域控制**：插件支持**全局共享**（如 1Password、uBlock Origin）或**指定容器专属**（如工作专用扩展、开发者调试工具）。
- 🔐 **1Password 跨容器无缝协同**：独创跨容器 Native Messaging 中继架构，一次解锁，所有容器无缝调用 1Password 自动填充表单。
- 🎨 **色彩感知交互与标签管理**：基于现代 `WebContentsView` 架构，标签栏色彩高亮、地址栏身份徽章，秒级切换无重绘。
- 🧭 **智能域名路由 (Site Rules)**：指定域名自动派发到对应容器，杜绝误用工作账号打开私人页面。
- 🚀 **容器级独立网络代理**：不同容器可绑定不同 HTTP / SOCKS5 节点及专属身份，实现真正的网络环境隔离。

---

## 📚 详细文档

- [项目核心上下文](contexts/context.md)
- [功能需求与技术设计规范 (PRD)](specs/functional_specification.md)

---

## 🛠️ 技术栈

- **桌面环境**：Electron 33+
- **构建工具**：electron-vite (Vite 5+)
- **前端框架**：React 18 + TypeScript 5
- **样式方案**：Tailwind CSS (v4)
- **状态管理**：Zustand
- **视窗技术**：BaseWindow + WebContentsView
