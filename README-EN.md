**English** | [中文](./README.md)

<div align="center">

# Claude Code Tool Manager

**A Visual Configuration Console for Claude Code and Multi-Editor Workflows**

*Out of sight, out of mind.*

Free your MCP, Skill, Hook, Subagent, and Command configs from scattered JSON files.  
Manage, test, and sync — all in one place.

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Platform](https://img.shields.io/badge/Platform-macOS%20%7C%20Windows%20%7C%20Linux-lightgrey.svg)]()
[![Built with Tauri](https://img.shields.io/badge/Built%20with-Tauri%202-FFC131.svg)](https://tauri.app/)

[Features](#features) · [Install](#installation) · [Quick Start](#quick-start) · [Changelog](./CHANGELOG.md) · [Contributing](./CONTRIBUTING.md)

<!-- Hero image from upstream -->
![Claude Code Tool Manager](./imgs/project-assign.gif)

</div>

---

## You Might Need This

Claude Code configuration lives across `~/.claude.json`, `commands/`, `settings.json`, and several other files. Every change requires hand-editing JSON or Markdown — and you won't know if it works until you restart Claude. If you also use Cursor, Gemini CLI, or other editors, each has its own config format and path. The overhead scales with the number of tools.

This app brings all those configs into one interface. **See it, manage it.**

- **Visual Management** — No more digging through JSON. MCP, Skill, Hook, Subagent, Command — all visible at a glance
- **Pre-flight Validation** — Test MCP connections and execute tools before assigning to projects. No more "configure and pray"
- **One Change, Multi-Editor Sync** — MCP syncs to 6 editors; Skill/Command/Subagent sync to Claude Code and OpenCode
- **Scene Switching** — Profiles bundle your entire config. One click to switch between work/personal/project setups
- **Local Analytics** — Usage and session data stay on your machine. Understand your habits and costs

> [!TIP]
> Fork of [tylergraydev/claude-code-tool-manager](https://github.com/tylergraydev/claude-code-tool-manager), adding full Simplified Chinese UI (1800+ translations) and several UI improvements. See [Differences from Upstream](#differences-from-upstream).

---

## How We Compare

**vs. Hand-editing JSON** — Configs scattered, error-prone, no feedback until runtime. GUI makes everything visible with instant test feedback.

**vs. [cc-switch](https://github.com/farion1231/cc-switch)** — Both are config management GUIs. cc-switch focuses on provider switching and multi-CLI support. This project covers full MCP/Skill/Command/Subagent/Hook management, plus MCP testing, usage analytics, session browsing, and StatusLine customization.

**vs. [McPick](https://github.com/spences10/mcpick) / MCP Bundler** — Focused on MCP toggling. This project goes further: test connections, execute tools, import from Registry, and manage Skill, Hook, and other components in one place.

**About the CLI** — Claude Code's CLI is powerful and can handle almost any config operation. The GUI's value is letting you see the full picture — which MCPs are active, which Skills are enabled, when Hooks fire — instead of jumping between JSON files.

---

## Quick Start

```bash
# macOS (Homebrew)
brew tap linhai0872/tap
brew install --cask linhai0872/tap/claude-code-tool-manager

# Or download from GitHub Releases
# https://github.com/linhai0872/claude-code-tool-manager/releases
```

On launch, the app detects installed editors and imports existing MCP configurations.

### Supported Editors

| Editor | Config Location |
|--------|-----------------|
| [Claude Code](https://docs.anthropic.com/en/docs/claude-code) | `~/.claude.json` |
| [Cursor](https://cursor.com) | `~/.cursor/mcp.json` |
| [Gemini CLI](https://github.com/google-gemini/gemini-cli) | `~/.gemini/settings.json` |
| [Codex CLI](https://github.com/openai/codex) | `~/.codex/config.toml` |
| [Copilot CLI](https://githubnext.com/projects/copilot-cli) | `~/.copilot/mcp-config.json` |
| [OpenCode](https://opencode.ai) | `~/.config/opencode/opencode.json` |

Enable the editors you use in Settings, and MCP configurations will sync to all of them automatically.

---

## Features

### MCP Server Management & Testing

![MCP Testing](./imgs/mcp-testing-12s.gif)

- **Three Transports** — stdio / SSE / HTTP, covering local and remote MCP servers
- **Test & Execute** — Connect, list tools, and execute calls before assigning to projects
- **Registry Import** — Browse, search, and one-click import from [MCP Registry](https://registry.modelcontextprotocol.io/)
- **Multiple Import Methods** — Paste JSON config or CLI command (`claude mcp add ...`) for auto-parsing
- **MCP Gateway** — Lazy-load mode exposing only 3 meta-tools, connecting MCPs on demand to reduce context window usage

### Skills & Commands

<!--
[Placeholder] Skills & Commands screenshot
Capture: Open the app → navigate to the Skills page → expand a Skill's edit panel to show Markdown content, allowedTools, and model selection
Size: 1280px wide, PNG
Path: imgs/skills.png
Replace below when ready:
-->
![Skills & Commands](./imgs/skills.png)

- **Skill** — On-demand capabilities; Claude decides whether to invoke based on conversation context
- **Command** — Manually triggered via `/command-name`, with argument hints
- **Visual Editing** — Markdown content, allowedTools restrictions, model selection (Opus/Sonnet/Haiku/Other)
- **Import Support** — Paste Markdown or import from file

### Subagents & Hooks

<!--
[Placeholder] Hooks configuration screenshot
Capture: Open the app → navigate to the Hooks page → expand a Hook's edit panel showing event type, regex matcher, and script input
Size: 1280px wide, PNG
Path: imgs/hooks.png
Replace below when ready:
-->
![Hooks](./imgs/hooks.png)

- **Subagent** — Independent child agents with dedicated model, system instructions, tool set, and permission mode
- **Hook** — Execute scripts or inject prompts on specific events
  - 10 event types: SessionStart, PreToolUse, PostToolUse, Stop, and more
  - Regex matching for tool names (e.g., `Write|Edit`)
  - Built-in task completion sound presets

### Profiles

Profiles bundle your currently enabled MCPs, Skills, Subagents, Commands, and Hooks into one configuration set. Create different Profiles for different scenarios (daily coding, work projects, learning) and switch between them with one click.

### Editor Sync

One change, multi-editor effect. The app syncs configurations to each editor's config files:

| Component | Claude Code | Cursor | Gemini CLI | Codex CLI | Copilot CLI | OpenCode |
|-----------|:-----------:|:------:|:----------:|:---------:|:-----------:|:--------:|
| MCP Server | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Skill | ✓ | | | | | ✓ |
| Command | ✓ | | | | | ✓ |
| Subagent | ✓ | | | | | ✓ |
| Hook | ✓ | | | | | |
| Spinner Verb | ✓ | | | | | |

> [!NOTE]
> ✓ indicates this project actively syncs to that editor's config file. Some editors (like Cursor) support reading additional config types, which is the editor's own capability and not part of this project's sync scope.

### Built-in MCP Server

The app runs its own MCP Server on startup, exposing **31 tools** over Streamable HTTP. Claude Code can query and modify configurations mid-conversation — e.g., "add this MCP to my project" or "list all enabled Skills." Any MCP-compatible client can connect.

<details>
<summary>Built-in Tool List</summary>

**MCP Management**: list_mcps, get_mcp, create_mcp, update_mcp, delete_mcp, assign_mcp_to_project, remove_mcp_from_project, list_global_mcps, enable_global_mcp, disable_global_mcp

**Skill Management**: list_skills, get_skill, create_skill, delete_skill, enable_global_skill, disable_global_skill

**Subagent Management**: list_subagents, get_subagent, create_subagent, delete_subagent, enable_global_subagent, disable_global_subagent

**Hook Management**: list_hooks, get_hook, create_hook, delete_hook, enable_global_hook, disable_global_hook

**Project Management**: list_projects, get_project

</details>

### StatusLine & Spinner Customization

<!--
[Placeholder] StatusLine builder screenshot
Capture: Open the app → navigate to the StatusLine page → drag in several segments (model, cost, git_branch, etc.) → switch to Powerline theme → screenshot the full builder including the preview bar
Size: 1280px wide, PNG
Path: imgs/statusline.png
Add image below when ready:
-->

**StatusLine** is the info bar at the bottom of the Claude Code terminal. Drag-and-drop builder with 25+ segment types:

- Model/Session: model, version, session_id, agent_name, vim_mode
- Usage/Cost: cost, context, tokens_in, tokens_out, duration, lines_changed
- Git/Workspace: git_branch, git_status, cwd, project_dir
- Themes: Default / Powerline / Powerline Round

**Spinner Verb** — The action words shown during task execution (*Thinking...*, *Analyzing...*). Customize content, order, and enable/disable.

### Usage Analytics & Session Explorer

<!--
[Placeholder] Usage analytics screenshot
Capture: Open the app → navigate to the Analytics page (requires existing usage history) → screenshot the full page including activity heatmap and model distribution chart
Size: 1280px wide, PNG
Path: imgs/analytics.png
Add image below when ready:
-->

Parse local Claude Code session data. All analysis runs locally — no cloud required:

- **Usage Analytics** — Daily activity trends, model breakdown, token consumption, peak hours heatmap, cost estimates
- **Session Explorer** — View conversation history per project, tool call stats, per-message token usage
- **Insights** — Session quality assessment, goal completion analysis, friction point identification, efficiency bottleneck diagnosis

### More Features

- **Memory File Management** — Manage Claude Code memory files with user/project/local scopes
- **Permission Rules** — Visual config for tool permissions (allow/deny/ask), with preset templates
- **Marketplace** — Extend Skill/Command plugin sources via GitHub, npm, URL, and more

---

## Installation

### macOS (Homebrew Recommended)

```bash
brew tap linhai0872/tap
brew install --cask linhai0872/tap/claude-code-tool-manager
```

Update: `brew upgrade --cask linhai0872/tap/claude-code-tool-manager`

### Direct Download

Grab the latest from [GitHub Releases](https://github.com/linhai0872/claude-code-tool-manager/releases):

| Platform | File |
|----------|------|
| Windows | `.msi` (installer) or `.exe` (portable) |
| macOS (Apple Silicon) | `.dmg` |
| macOS (Intel) | `.dmg` |
| Linux | `.AppImage` or `.deb` |

> [!IMPORTANT]
> **macOS users:** The app isn't Apple-signed. DMG installs get blocked on first launch.
> Right-click → "Open" → confirm, or run:
>
> ```bash
> xattr -cr /Applications/Claude\ Code\ Tool\ Manager.app
> ```
>
> Homebrew installs are not affected.

**Build from Source**

Requires [Node.js](https://nodejs.org/) 18+, [Rust](https://www.rust-lang.org/tools/install) 1.70+, [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/).

```bash
git clone https://github.com/linhai0872/claude-code-tool-manager.git
cd claude-code-tool-manager
npm install
npm run tauri build
```

Output in `src-tauri/target/release/bundle/`.

---

## Quick Start Guide

1. **Scan existing configs** — On launch, the app detects installed editors and imports existing MCP configurations
2. **Add or import** — Create manually, or paste JSON / CLI commands for auto-parsing
3. **Assign to projects** — Toggle tools on/off, pick target editors, configs sync automatically

Supported import formats:

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

## Configuration Locations

| Scope | MCP Server | Command | Skill | Subagent | Hook |
|-------|------------|---------|-------|----------|------|
| Global | `~/.claude.json` | `~/.claude/commands/` | `~/.claude/skills/` | `~/.claude/agents/` | `~/.claude/settings.json` |
| Project | `.claude/.mcp.json` | `.claude/commands/` | `.claude/skills/` | `.claude/agents/` | `.claude/settings.json` |

---

## Development

| Command | Purpose |
|---------|---------|
| `npm install` | Install dependencies |
| `npm run tauri dev` | Start dev server |
| `npm run check` | TypeScript type checking |
| `npm run test:run` | Unit tests |
| `npm run tauri build` | Production build |

**Tech Stack**: Svelte 5 + SvelteKit · Tauri 2 + Rust · SQLite · Tailwind CSS v4 · Paraglide JS

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## Differences from Upstream

Fork of [tylergraydev/claude-code-tool-manager](https://github.com/tylergraydev/claude-code-tool-manager). All upstream features retained, with the following additions:

| Change | Details |
|--------|---------|
| **Simplified Chinese UI** | Paraglide JS, 1800+ translations covering the full interface, runtime switching without restart |
| **Custom Select Component** | All native `<select>` elements replaced with CustomSelect — keyboard nav, search filtering, dark mode |
| **Theme Persistence** | Dark mode preference stored in localStorage, no longer hardcoded |
| **Independent Release Pipeline** | Removed upstream Apple signing dependency; added Homebrew Cask distribution and Tauri signed updates (Windows/Linux) |

## Acknowledgments

Thanks to [@tylergraydev](https://github.com/tylergraydev) for creating and maintaining the upstream project.

## License

[MIT](https://opensource.org/licenses/MIT)
