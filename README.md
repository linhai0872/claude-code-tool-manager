[English](./README-EN.md) | **中文**


# Claude Code Tool Manager

**Claude Code 和多编辑器的可视化配置控制台**

*不被看见，价值难现。*

把 MCP、Skill、Hook、Subagent、Command 从分散的 JSON 文件里解放出来，
集中管理、测试验证、一键同步。

[License](https://opensource.org/licenses/MIT)
[Platform]()
[Built with Tauri](https://tauri.app/)

[功能](#功能) · [安装](#安装) · [快速上手](#快速上手) · [更新日志](./CHANGELOG.md) · [参与贡献](./CONTRIBUTING.md)

<!--
[待补充] Hero 截图 — 应用主界面全览
操作：打开应用 → 确认语言为中文 → 进入 MCP 管理页面（左侧第一项）→ 将窗口调至 1280×800 → Cmd+Shift+4 截取整个窗口
格式：PNG，宽度 1280px
保存路径：imgs/hero-zh.png
就绪后取消注释：
![Claude Code Tool Manager](./imgs/hero-zh.png)
-->

---

## 你可能需要这个

Claude Code 的配置分散在 `~/.claude.json`、`commands/`、`settings.json` 等多个文件中。每次修改都要手写 JSON 和 Markdown，改完还不确定能不能用——只能启动 Claude 才知道。如果你还在用 Cursor、Gemini CLI 等其他编辑器，每个工具的配置格式和路径都不一样，管理成本随着工具数量一起增长。

这个项目把这些配置集中到一个界面里。**看得见，才管得住。**

- **可视化管理** — 不用再翻 JSON，MCP、Skill、Hook、Subagent、Command 一目了然
- **配置前验证** — MCP 可以在分配前测试连接、执行 Tool，不用"配了再说"
- **一处修改，多端同步** — MCP 同步到 6 个编辑器，Skill/Command/Subagent 同步到 Claude Code 和 OpenCode
- **场景切换** — Profile 打包整套配置，一键切换工作/学习/项目环境
- **本地分析** — Usage 和 Session 数据全在本地，了解自己的使用习惯和成本

> [!TIP]
> 本项目 Fork 自 [tylergraydev/claude-code-tool-manager](https://github.com/tylergraydev/claude-code-tool-manager)，加入了完整的简体中文界面（1800+ 条翻译）和多项 UI 改进。详见[与上游的差异](#与上游的差异)。

---

## 与其他工具的对比

**vs. 手写 JSON** — 配置分散、容易出错、改完不知道能不能用。GUI 让一切可视化，测试即时反馈。

**vs. [cc-switch](https://github.com/farion1231/cc-switch)** — 同样是配置管理 GUI，cc-switch 专注于 Provider 切换和多 CLI 支持。本项目覆盖 MCP/Skill/Command/Subagent/Hook 全组件管理，还提供 MCP 测试执行、Usage 分析、Session 浏览、StatusLine 定制等功能。

**vs. [McPick](https://github.com/spences10/mcpick) / MCP Bundler** — 专注于 MCP 的开关切换。本项目不仅管理 MCP，还能测试连接、执行 Tool、从 Registry 导入，并且统一管理 Skill、Hook 等其他组件。

**关于 CLI** — Claude Code CLI 本身功能强大，几乎能完成所有配置操作。GUI 的价值在于让你看清楚配置的全貌——有哪些 MCP、启用了哪些 Skill、Hook 会在什么时候触发——而不是在多个 JSON 文件之间来回跳转。

---

## 快速开始

```bash
# macOS (Homebrew)
brew tap linhai0872/tap
brew install --cask claude-code-tool-manager

# 或从 GitHub Releases 下载对应平台的安装包
# https://github.com/linhai0872/claude-code-tool-manager/releases
```

启动后应用会自动检测已安装的编辑器，导入现有 MCP 配置。

### 支持的编辑器


| 编辑器                                                           | 配置位置                               |
| ------------------------------------------------------------- | ---------------------------------- |
| [Claude Code](https://docs.anthropic.com/en/docs/claude-code) | `~/.claude.json`                   |
| [Cursor](https://cursor.com)                                  | `~/.cursor/mcp.json`               |
| [Gemini CLI](https://github.com/google-gemini/gemini-cli)     | `~/.gemini/settings.json`          |
| [Codex CLI](https://github.com/openai/codex)                  | `~/.codex/config.toml`             |
| [Copilot CLI](https://githubnext.com/projects/copilot-cli)    | `~/.copilot/mcp-config.json`       |
| [OpenCode](https://opencode.ai)                               | `~/.config/opencode/opencode.json` |


在设置中启用你使用的编辑器，MCP 配置会自动同步到所有已启用的编辑器。



---

## 功能

### MCP Server 管理与测试

<!--
[待补充] MCP 测试 GIF — 演示连接测试与 Tool 执行流程
操作：打开应用（中文界面）→ 选择一个 MCP → 点击「测试连接」→ 展开 Tool 列表 → 执行一个 Tool 调用 → 录制整个流程
工具推荐：QuickTime 录屏后用 Gifski 转 GIF，或直接用 CleanShot X
建议时长：10–15 秒，循环播放
格式：GIF，宽度 1280px
保存路径：imgs/mcp-testing-zh.gif
就绪后取消注释（也可暂时复用上游英文版 mcp-testing-12s.gif）：
![MCP 测试](./imgs/mcp-testing-zh.gif)
-->

- **三种传输方式** — stdio / SSE / HTTP，覆盖本地和远程 MCP Server
- **测试与执行** — 在分配到项目之前，直接测试连接、列出 Tool、执行调用，确认配置正常
- **Registry 导入** — 从 [MCP Registry](https://registry.modelcontextprotocol.io/) 浏览、搜索、一键导入
- **多种导入方式** — 粘贴 JSON 配置或 CLI 命令 (`claude mcp add ...`) 自动解析
- **MCP Gateway** — 延迟加载模式，只暴露 3 个 meta-tool，按需连接 MCP，减少上下文窗口占用

### Skill 与 Command

<!--
[待补充] Skill 管理截图
操作：进入 Skill 页面 → 展开一个 Skill 的编辑面板，确保能看到 Markdown 内容区和 allowedTools 设置
格式：PNG，宽度 1280px
保存路径：imgs/skills-zh.png
就绪后取消注释：
![Skill 管理](./imgs/skills-zh.png)
-->

- **Skill** — 按需加载的能力，Claude 根据对话上下文自动判断是否调用
- **Command** — 手动触发的指令，通过 `/command-name` 主动调用，支持参数提示
- **可视化编辑** — Markdown 内容编辑、allowedTools 限制、模型选择 (Opus/Sonnet/Haiku/Other)
- **导入支持** — 粘贴 Markdown 或从文件导入

### Subagent 与 Hook

<!--
[待补充] Hook 配置截图
操作：进入 Hook 页面 → 展开一个 Hook 的编辑面板，确保能看到事件类型、正则匹配和脚本输入区
格式：PNG，宽度 1280px
保存路径：imgs/hooks-zh.png
就绪后取消注释：
![Hook 配置](./imgs/hooks-zh.png)
-->

- **Subagent** — 独立的子智能体，可配置专属模型、系统指令、工具集、权限模式
- **Hook** — 在特定事件触发时执行脚本或注入 Prompt
  - 支持 10 种事件：SessionStart、PreToolUse、PostToolUse、Stop 等
  - 正则匹配工具名（如 `Write|Edit`）
  - 内置任务完成提示音选择

### Profile 配置档案

Profile 将当前启用的 MCP、Skill、Subagent、Command 和 Hook 打包为一组配置。针对不同场景（日常编码、工作项目、学习研究等）创建不同的 Profile，一键切换整套环境。

### 编辑器同步

一处修改，多端生效。本项目会将配置自动同步到对应编辑器的配置文件中：


| 组件           | Claude Code | Cursor | Gemini CLI | Codex CLI | Copilot CLI | OpenCode |
| ------------ | ----------- | ------ | ---------- | --------- | ----------- | -------- |
| MCP Server   | ✓           | ✓      | ✓          | ✓         | ✓           | ✓        |
| Skill        | ✓           |        |            |           |             | ✓        |
| Command      | ✓           |        |            |           |             | ✓        |
| Subagent     | ✓           |        |            |           |             | ✓        |
| Hook         | ✓           |        |            |           |             |          |
| Spinner Verb | ✓           |        |            |           |             |          |


> [!NOTE]
> 表格中的 ✓ 表示本项目会主动同步到该编辑器的配置文件。部分编辑器（如 Cursor）支持读取更多类型的配置文件，属于编辑器自身的能力，不在本项目的同步范围内。

### 内置 MCP Server

应用启动时运行一个 MCP Server，通过 Streamable HTTP 暴露 **31 个 Tool**。Claude Code 可以在对话中直接查询和修改配置——比如「把这个 MCP 加到我的项目里」「列出所有启用的 Skill」——任何支持 MCP 协议的客户端都可以连接。

内置 Tool 列表

**MCP 管理**：list_mcps, get_mcp, create_mcp, update_mcp, delete_mcp, assign_mcp_to_project, remove_mcp_from_project, list_global_mcps, enable_global_mcp, disable_global_mcp

**Skill 管理**：list_skills, get_skill, create_skill, delete_skill, enable_global_skill, disable_global_skill

**Subagent 管理**：list_subagents, get_subagent, create_subagent, delete_subagent, enable_global_subagent, disable_global_subagent

**Hook 管理**：list_hooks, get_hook, create_hook, delete_hook, enable_global_hook, disable_global_hook

**项目管理**：list_projects, get_project



### StatusLine 与 Spinner 定制

<!--
[待补充] StatusLine 构建器截图
操作：进入「StatusLine」页面 → 拖入几个 Segment（model、cost、git_branch 等）→ 切换到 Powerline 主题 → 截取整个构建器界面（包含预览区）
格式：PNG，宽度 1280px
保存路径：imgs/statusline-zh.png
就绪后取消注释：
![StatusLine 构建器](./imgs/statusline-zh.png)
-->

**StatusLine** 是 Claude Code 终端底部的信息栏。拖拽式构建器，从 25+ 种 Segment 中选择组合：

- 模型/会话：model, version, session_id, agent_name, vim_mode
- 用量/成本：cost, context, tokens_in, tokens_out, duration, lines_changed
- Git/工作区：git_branch, git_status, cwd, project_dir
- 主题风格：Default / Powerline / Powerline Round

**Spinner Verb** 是执行任务时加载动画显示的动词（如 *Thinking...*、*Analyzing...*）。可自定义内容、排序和启停。

### Usage 分析与 Session 浏览

<!--
[待补充] 用量分析截图
操作：进入「分析」页面 → 确保图表已有数据（需要有历史使用记录）→ 截取完整页面，包含活动热力图和模型分布图
格式：PNG，宽度 1280px
保存路径：imgs/analytics-zh.png
就绪后取消注释：
![用量分析](./imgs/analytics-zh.png)
-->

解析本地的 Claude Code Session 数据，所有分析在本地完成，无需云端：

- **Usage 分析** — 每日活动趋势、模型分布、Token 消耗、高峰时段热力图、费用估算
- **Session 浏览** — 按项目查看历史对话、Tool 调用统计、每条消息的 Token 用量
- **Insights** — Session 质量评估、目标达成分析、摩擦点识别、效率瓶颈诊断

### 更多功能

- **Memory 文件管理** — 管理 Claude Code 的 memory 文件，支持 user/project/local 作用域
- **Permissions 权限规则** — 可视化配置工具权限规则 (allow/deny/ask)，支持模板预设
- **Marketplace** — 扩展 Skill/Command 插件来源，支持 GitHub、npm、URL 等

---

## 安装

### macOS（推荐 Homebrew）

```bash
brew tap linhai0872/tap
brew install --cask claude-code-tool-manager
```

更新：`brew upgrade --cask claude-code-tool-manager`

### 直接下载

从 [GitHub Releases](https://github.com/linhai0872/claude-code-tool-manager/releases) 下载：


| 平台                    | 文件                       |
| --------------------- | ------------------------ |
| Windows               | `.msi`（安装包）或 `.exe`（免安装） |
| macOS (Apple Silicon) | `.dmg`                   |
| macOS (Intel)         | `.dmg`                   |
| Linux                 | `.AppImage` 或 `.deb`     |


> [!IMPORTANT]
> **macOS 用户**：应用没有 Apple 签名，DMG 安装后首次打开会被系统拦截。
> 右键应用 → 「打开」→ 确认即可，或终端执行：
>
> ```bash
> xattr -cr /Applications/Claude\ Code\ Tool\ Manager.app
> ```
>
> 使用 Homebrew 安装不受此影响。

**从源码构建**

需要 [Node.js](https://nodejs.org/) 18+、[Rust](https://www.rust-lang.org/tools/install) 1.70+、[Tauri 构建依赖](https://v2.tauri.app/start/prerequisites/)。

```bash
git clone https://github.com/linhai0872/claude-code-tool-manager.git
cd claude-code-tool-manager
npm install
npm run tauri build
```

产物在 `src-tauri/target/release/bundle/`。

---

## 快速上手

1. **扫描现有配置** — 启动后应用自动检测已安装的编辑器，导入现有 MCP 配置
2. **添加或导入** — 手动新建，或粘贴 JSON / CLI 命令自动解析导入
3. **分配到项目** — 开关所需的工具，选择目标编辑器，配置自动同步

支持的导入格式：

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

---

## 配置文件位置


| 作用域 | MCP Server          | Command               | Skill               | Subagent            | Hook                      |
| --- | ------------------- | --------------------- | ------------------- | ------------------- | ------------------------- |
| 全局  | `~/.claude.json`    | `~/.claude/commands/` | `~/.claude/skills/` | `~/.claude/agents/` | `~/.claude/settings.json` |
| 项目  | `.claude/.mcp.json` | `.claude/commands/`   | `.claude/skills/`   | `.claude/agents/`   | `.claude/settings.json`   |


---

## 开发


| 命令                    | 用途              |
| --------------------- | --------------- |
| `npm install`         | 安装依赖            |
| `npm run tauri dev`   | 启动开发服务器         |
| `npm run check`       | TypeScript 类型检查 |
| `npm run test:run`    | 单元测试            |
| `npm run tauri build` | 构建生产版本          |


**技术栈**：Svelte 5 + SvelteKit · Tauri 2 + Rust · SQLite · Tailwind CSS v4 · Paraglide JS

详见 [CONTRIBUTING.md](./CONTRIBUTING.md)。

---

## 与上游的差异

本项目 Fork 自 [tylergraydev/claude-code-tool-manager](https://github.com/tylergraydev/claude-code-tool-manager)，上游功能全部保留，额外做了以下改动：


| 改动          | 说明                                                             |
| ----------- | -------------------------------------------------------------- |
| **简体中文界面**  | Paraglide JS 驱动，1800+ 条翻译覆盖全部界面，运行时切换不用重启                      |
| **自定义下拉组件** | 全部原生 `<select>` 替换为 CustomSelect，支持键盘导航、搜索过滤和深色模式              |
| **主题记忆**    | 深色模式偏好写入 localStorage，不再硬编码                                    |
| **独立发布管线**  | 移除上游 Apple 签名依赖，新增 Homebrew Cask 分发和 Tauri 签名更新（Windows/Linux） |


## 致谢

感谢 [@tylergraydev](https://github.com/tylergraydev) 创建并维护上游项目。

## 许可证

[MIT](https://opensource.org/licenses/MIT)
