# 棱界 (Prism) — 开发与维护实录 (Development Log)

> 本文档用于完整记录项目每次迭代、缺陷排查、架构调优及修复细节，作为长期技术沉淀与追溯依据。

---

## 📅 2026-09-13

### 🏆 里程碑完成：M1 核心底座与全景外壳测试通过
- **验收状态**：用户实测通过，窗口展示、多容器物理隔离、左侧树状管理栏、顶部导航与收藏栏、视窗边界同步协议均达到交付标准。
- **阶段沉淀成果**：
  - `ContainerManager` 实现 `session.fromPartition` 物理级会话隔离，预置 4 组场景容器；
  - `TabManager` + `LayoutManager` 打通现代 `BaseWindow + WebContentsView` 视窗调度；
  - 全景四方环绕式 UI 外壳（React 18 + Tailwind CSS v4）与 `Ctrl+\` 迷你坞折叠交互。

---

### 记录 1：解决 pnpm 10 下 Electron 二进制缺失与启动卡死问题
- **现象**：
  在控制台运行 `pnpm dev` 时报错：`Error: Electron uninstall at getElectronPath`。
- **根因分析**：
  1. pnpm 10 默认启用了 `onlyBuiltDependencies` 安全策略，自动跳过了 `electron` 的 postinstall 脚本，导致 `node_modules/electron/dist/electron.exe` 未被下载；
  2. 后台存在测试残留的 `electron.exe` 僵尸进程，锁死了 Chromium 本地用户目录，导致文件访问冲突（`0x5 拒绝访问`）。
- **解决措施**：
  1. 在 `package.json` 中配置 `pnpm.onlyBuiltDependencies: ["electron", "esbuild"]`；
  2. 手动执行 `node ./node_modules/electron/install.js` 补全底层二进制；
  3. 彻底清理系统后台残留僵尸进程；
  4. 将主窗口设为 `show: true` 并赋予深色背景色 `#020617`，将初始标签页改为轻量的 `about:blank`。

---

### 记录 2：解决容器配置抽屉被中间原生网页视窗遮挡问题
- **现象**：
  点击容器头部的 `[⚙]` 打开“容器配置与环境”抽屉时，抽屉右半部分被中间的主网页视窗遮挡，无法看全内容。
- **根因分析**：
  在 Electron 现代化架构中，`WebContentsView` 是底层的**原生 OS 视窗层**，层级高于 React/HTML DOM。此前抽屉采用 `fixed inset-y-0 left-0 w-80` 绝对覆盖布局，脱离了常规文档流；中心主网页容器 `contentRef` 的尺寸并未发生改变，因此底层 `WebContentsView` 依旧绘制在原坐标上，直接遮挡了抽屉。
- **解决措施**：
  1. 将 `ContainerInspector.tsx` 改为标准文档流组件（`w-80 shrink-0 h-full border-r`）；
  2. 在 `App.tsx` 中将其挂载于左侧栏与主网页视窗之间；
  3. 当用户打开抽屉时，中央 `contentRef` 自动向右自适应缩进 320px；
  4. `ResizeObserver` 捕获到尺寸变化，立即通过 `Layout Bounds Sync Protocol` 通知主进程，底层 `WebContentsView` 毫秒级同步右移并缩放，页面与抽屉并排展现，**彻底杜绝遮挡**。

---

### 记录 3：解决 URL 栏回车后闪烁回弹旧网址问题
- **现象**：
  在地址栏输入新网址并回车后，输入框文字瞬间跳回原来的旧网址；等待 1~3 秒页面加载完成时，输入框才再次变更为新网址，体验反直觉。
- **根因分析**：
  1. 用户回车后，输入框失焦（`blur`），触发 `NavBar` 的 `useEffect` 重新取 `activeTab.url`；
  2. 在主进程中，此前仅在网页完全加载完毕的 `did-stop-loading` 事件中才更新 `tab.url`；
  3. 在发起网络请求到页面加载完的 1~3 秒期间，`activeTab.url` 仍是旧网址，导致 React 重新将其刷回输入框，造成回弹闪烁。
- **解决措施**：
  1. **主进程乐观更新**：在 `TabManager.ts` 的 `navigateTab` 中，解析完 URL 后**立即**更新 `tab.url = formattedUrl` 并触发 `notifyTabsChange`，让状态机在毫秒级进入就绪态；
  2. **监听原生导航发起事件**：新增对 `webContents.on('did-start-navigation')` 的监听，在主框架发起跳转瞬间同步 URL，覆盖重定向场景；
  3. **前端输入框状态锁定**：在 `NavBar.tsx` 的回车处理逻辑中，本地预先格式化并保留目标 URL，与主进程乐观更新双重保障。
