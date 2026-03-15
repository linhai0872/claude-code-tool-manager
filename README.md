[English](./README-EN.md) | **中文**

<div align="center">
  <img src="./imgs/Claude_AI_symbol.svg.png" width="120" />
  <h1>Claude Code Tool Manager</h1>
  <p>Claude Code 缺一个配置管理界面。这就是。</p>

  [安装](#安装) · [功能](#功能) · [快速上手](#快速上手) · [参与贡献](./CONTRIBUTING.md) · [更新日志](./CHANGELOG.md)
</div>

<p align="center">
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/github/license/linhai0872/claude-code-tool-manager?style=flat-square" alt="License" />
  </a>
</p>

<!-- 以下 GIF 为上游英文 UI 录制，建议替换为中文 UI 版本 -->
<div align="center">
  <img src="./imgs/project-assign.gif" width="100%" />
</div>

---

## 为什么需要这个工具

Claude Code 的配置散落在多个位置——`~/.claude.json` 存 MCP 服务器，`~/.claude/commands/` 放命令，`~/.claude/settings.json` 管 Hook——管理它们意味着手动编辑 JSON 和 Markdown 文件。如果你同时使用 Cursor、Copilot CLI、Gemini CLI 等其他 AI 编程助手，每个工具的配置格式和路径都不一样，维护成本成倍增加。

Claude Code Tool Manager 做的事情很简单：**提供一个图形界面，集中管理所有配置，然后同步到你使用的每个编辑器。** 它以中间层的方式工作——读写各编辑器的标准配置文件，不修改任何工具本身的行为，不引入额外的配置格式，也不产生锁定。

如果你用过 cc-switch 之类的配置切换工具，这个项目可以看作它的完整替代：除了配置切换，还覆盖了 MCP 测试、用量分析、会话回顾、状态栏定制等场景。

> 本项目 Fork 自 [tylergraydev/claude-code-tool-manager](https://github.com/tylergraydev/claude-code-tool-manager)，在保留上游全部功能的基础上，添加了**简体中文界面**——基于 Paraglide JS，覆盖 1750+ 条翻译，在设置中切换语言，无需重启。

---

## 功能

### MCP 服务器管理与测试

创建、编辑、删除 MCP 服务器配置。支持 stdio、SSE、HTTP 三种传输方式。可以直接在应用内启动服务器、列出工具、执行调用——在分配给项目之前就能验证配置是否可用。

还可以从 [MCP Registry](https://registry.modelcontextprotocol.io/) 浏览并一键导入。

<!-- 以下 GIF 为上游英文 UI 录制，建议替换为中文 UI 版本 -->
<div align="center">
  <img src="./imgs/mcp-testing-12s.gif" width="100%" />
</div>

### 命令与 Skill

管理斜杠命令（存储在 `.claude/commands/` 中的 Markdown 文件）和 Skill（包含 `SKILL.md` 的目录，Claude 根据上下文自动调用）。在界面中编辑内容、设置触发条件，不再手动创建文件。

### Sub-Agent 与 Hook

定义自定义 Sub-Agent 的名称、模型、指令和工具集。配置 Hook 在特定事件（对话开始、工具调用前后、任务完成等）时自动执行脚本。内置声音通知向导，Claude 完成任务时可以播放提示音。

### 配置档案

保存当前启用的 MCP、Skill、Sub-Agent、命令和 Hook 的组合为一个 Profile。在「工作」和「个人」配置之间一键切换，或按项目分配不同的工具集。

### AI 可控

内置 MCP 服务器随应用启动，通过 Streamable HTTP 暴露 31 个工具。Claude Code 或任何 MCP 客户端可以在对话中直接查询和修改你的工具配置——对 Claude 说「把这个 MCP 加到我的项目里」，它就能做到。

### 状态栏与 Spinner 定制

通过可视化构建器设计 Claude Code 终端状态栏，从 25+ 种信息段中选择（模型、费用、上下文窗口、Git 分支等），支持 Powerline 主题。还可以自定义 Spinner 动词——拖拽排序、逐条开关。

### 用量分析与会话浏览

- **用量分析** — 每日活动趋势、模型使用分布、Token 消耗量、高峰时段热力图、费用估算
- **会话浏览** — 按项目查看历史对话，包含时间线、工具调用标签、逐条消息的 Token 用量
- **洞察** — 会话质量评分、阻力分析、实用性评级

<!--
  截图占位：用量分析页面（中文 UI）
  拍摄指引：打开应用 → 切换中文 → 进入「分析」页面，确保图表有数据后全窗口截图
  建议尺寸：1280px 宽
  格式：PNG
  保存路径：imgs/analytics-zh.png
-->

### 多编辑器同步

在设置中启用目标编辑器后，MCP 配置自动同步到每个编辑器的配置文件。全局配置写入编辑器的全局路径，项目配置写入项目级路径。管理一次，所有编辑器都能用。

| 编辑器 | 配置路径 | 格式 |
|--------|---------|------|
| [Claude Code](https://docs.anthropic.com/en/docs/claude-code) | `~/.claude.json` | JSON |
| [OpenCode](https://opencode.ai) | `~/.config/opencode/opencode.json` | JSON |
| [Codex CLI](https://github.com/openai/codex) | `~/.codex/config.toml` | TOML |
| [GitHub Copilot CLI](https://githubnext.com/projects/copilot-cli) | `~/.copilot/mcp-config.json` | JSON |
| [Cursor](https://cursor.com) | `~/.cursor/mcp.json` | JSON |
| [Gemini CLI](https://github.com/google-gemini/gemini-cli) | `~/.gemini/settings.json` | JSON |

### 简体中文界面

本 Fork 版本添加了完整的简体中文支持。1750+ 条翻译键值覆盖了界面的所有文字，在「设置 → 界面」中切换语言，即时生效，不需要重启应用。

<!--
  截图占位：中文界面整体截图
  拍摄指引：
  1. 打开应用，进入「设置 → 界面」切换为中文
  2. 回到 MCP 服务器管理页面（左侧栏第一项）
  3. 窗口调整到 1280×800 左右
  4. 使用 Cmd+Shift+4 框选整个窗口截图
  建议尺寸：1280px 宽
  格式：PNG
  保存路径：imgs/hero-zh.png

  （可选）拍摄语言切换 GIF：
  1. 打开设置页面的界面标签
  2. 开始录屏（推荐 CleanShot X 或 QuickTime）
  3. 从 English 切换到 中文，等界面刷新
  4. 停止录制，用 Gifski 转为 GIF
  建议时长：3-5 秒
  保存路径：imgs/language-switch.gif
-->

---

## 安装

### 直接下载

从 [GitHub Releases](https://github.com/linhai0872/claude-code-tool-manager/releases) 下载最新版本：

| 平台 | 文件 |
|------|------|
| Windows | `.msi`（安装包）或 `.exe`（免安装） |
| macOS (Apple Silicon) | `.dmg` |
| macOS (Intel) | `.dmg` |
| Linux | `.AppImage` 或 `.deb` |

> [!IMPORTANT]
> **macOS 用户注意**：本应用未经 Apple 签名，首次打开时会被系统拦截。
>
> 解决方法：右键点击应用 → 选择「打开」→ 在弹窗中确认「打开」。
>
> 或在终端执行：
> ```bash
> xattr -cr /Applications/Claude\ Code\ Tool\ Manager.app
> ```

<details>
<summary><strong>从源码构建</strong></summary>

需要 [Node.js](https://nodejs.org/) 18+、[Rust](https://www.rust-lang.org/tools/install) 1.70+ 以及 [Tauri 构建依赖](https://v2.tauri.app/start/prerequisites/)。

```bash
git clone https://github.com/linhai0872/claude-code-tool-manager.git
cd claude-code-tool-manager
npm install
npm run tauri build
```

构建产物位于 `src-tauri/target/release/bundle/`。

</details>

---

## 快速上手

**1. 扫描现有配置**

启动应用后，系统自动检测已安装的编辑器并扫描现有 MCP 配置。

**2. 添加或导入**

手动新建 MCP 服务器，或粘贴 JSON / CLI 命令快速导入：

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "~/Documents"]
    }
  }
}
```

```bash
claude mcp add filesystem -s user -- npx -y @modelcontextprotocol/server-filesystem ~/Documents
```

**3. 分配到项目**

在项目页面开关所需的工具，选择目标编辑器，配置自动同步。

---

## 配置文件位置

| 作用域 | MCP 服务器 | 命令 | Skill | Sub-Agent | Hook |
|--------|-----------|------|-------|-----------|------|
| 全局 | `~/.claude.json` | `~/.claude/commands/` | `~/.claude/skills/` | `~/.claude/agents/` | `~/.claude/settings.json` |
| 项目 | `.claude/.mcp.json` | `.claude/commands/` | `.claude/skills/` | `.claude/agents/` | `.claude/settings.json` |

---

## 技术栈

Svelte 5 + SvelteKit · Tauri 2 + Rust · SQLite · Tailwind CSS v4 · Paraglide JS

## 致谢

感谢 [@tylergraydev](https://github.com/tylergraydev) 创建并维护上游项目 [claude-code-tool-manager](https://github.com/tylergraydev/claude-code-tool-manager)。

## 开发

```bash
npm install          # 安装依赖
npm run tauri dev    # 启动开发服务器
npm test             # 运行测试
npm run tauri build  # 构建生产版本
```

详见 [CONTRIBUTING.md](./CONTRIBUTING.md)。

## 许可证

[MIT](https://opensource.org/licenses/MIT)
