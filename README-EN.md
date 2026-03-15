**English** | [中文](./README.md)

<div align="center">
  <img src="./imgs/Claude_AI_symbol.svg.png" width="120" />
  <h1>Claude Code Tool Manager</h1>
  <p>Claude Code doesn't have a configuration GUI. This is it.</p>

  [Install](#installation) · [Features](#features) · [Quick Start](#quick-start) · [Contributing](./CONTRIBUTING.md) · [Changelog](./CHANGELOG.md)
</div>

<p align="center">
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/github/license/linhai0872/claude-code-tool-manager?style=flat-square" alt="License" />
  </a>
</p>

<!-- GIF recorded from upstream English UI; consider replacing with Chinese UI version -->
<div align="center">
  <img src="./imgs/project-assign.gif" width="100%" />
</div>

---

## Why This Tool Exists

Claude Code configuration is scattered across your filesystem — `~/.claude.json` for MCP servers, `~/.claude/commands/` for commands, `~/.claude/settings.json` for hooks — and managing it means hand-editing JSON and Markdown files. If you also use Cursor, Copilot CLI, Gemini CLI, or other AI coding assistants, each has its own config format and path.

Claude Code Tool Manager does one thing well: **provide a GUI to manage all your configurations in one place, then sync them to every editor you use.** It works as a middleware layer — reading and writing each editor's standard config files without modifying tool behavior, introducing new config formats, or creating vendor lock-in.

If you've used tools like cc-switch for config toggling, think of this as the full replacement: beyond switching, it covers MCP testing, usage analytics, session review, status line customization, and more.

> This is a fork of [tylergraydev/claude-code-tool-manager](https://github.com/tylergraydev/claude-code-tool-manager) with **Simplified Chinese UI** added — powered by Paraglide JS, covering 1750+ translation keys, switchable at runtime in Settings without restart.

---

## Features

### MCP Server Management and Testing

Create, edit, and remove MCP server configurations. Supports stdio, SSE, and HTTP transports. Test servers directly in the app — launch a server, list its tools, execute calls, and verify everything works before assigning it to a project.

Browse and import from the official [MCP Registry](https://registry.modelcontextprotocol.io/).

<!-- GIF recorded from upstream English UI -->
<div align="center">
  <img src="./imgs/mcp-testing-12s.gif" width="100%" />
</div>

### Commands and Skills

Manage slash commands (Markdown files in `.claude/commands/`) and Skills (directories with `SKILL.md` that Claude invokes automatically based on context). Edit content and trigger conditions through the GUI instead of creating files manually.

### Sub-Agents and Hooks

Define custom Sub-Agents with name, model, instructions, and tool sets. Configure Hooks to run scripts on specific events (conversation start, pre/post tool use, task completion, etc.). Includes a sound notification wizard for audio alerts when Claude finishes a task.

### Profiles

Save your current set of enabled MCPs, Skills, Sub-Agents, commands, and Hooks as a named Profile. Switch between "Work" and "Personal" setups with one click, or assign different tool sets per project.

### AI-Controllable

Ships with a built-in MCP server that starts alongside the app, exposing 31 tools via Streamable HTTP. Claude Code or any MCP client can query and modify your tool configurations programmatically — tell Claude "add this MCP to my project" and it works.

### Status Line and Spinner Customization

Design Claude Code terminal status lines with a visual builder. Choose from 25+ segment types (model, cost, context window, git branch, etc.), apply Powerline themes, or browse community presets. Customize Spinner verbs with drag-and-drop reordering and per-verb toggles.

### Usage Analytics and Session Explorer

- **Analytics** — Daily activity trends, model usage breakdown, token consumption, peak hours heatmap, cost estimates
- **Session Explorer** — Browse past sessions per project with conversation timelines, tool call tags, per-message token usage
- **Insights** — Session quality scores, friction analysis, helpfulness ratings

<!--
  Screenshot placeholder: Analytics page
  How to capture: Open app → navigate to Analytics page with chart data visible → full window screenshot
  Suggested size: 1280px wide
  Format: PNG
  Save to: imgs/analytics-screenshot.png
-->

### Multi-Editor Sync

Enable target editors in Settings, and MCP configurations sync to each editor's config file automatically. Global configs write to the editor's global path; project configs write to project-level paths. Configure once, use everywhere.

| Editor | Config Path | Format |
|--------|-------------|--------|
| [Claude Code](https://docs.anthropic.com/en/docs/claude-code) | `~/.claude.json` | JSON |
| [OpenCode](https://opencode.ai) | `~/.config/opencode/opencode.json` | JSON |
| [Codex CLI](https://github.com/openai/codex) | `~/.codex/config.toml` | TOML |
| [GitHub Copilot CLI](https://githubnext.com/projects/copilot-cli) | `~/.copilot/mcp-config.json` | JSON |
| [Cursor](https://cursor.com) | `~/.cursor/mcp.json` | JSON |
| [Gemini CLI](https://github.com/google-gemini/gemini-cli) | `~/.gemini/settings.json` | JSON |

### Simplified Chinese UI

This fork adds full Simplified Chinese support. 1750+ translation keys cover every piece of text in the interface. Switch languages in Settings — takes effect immediately, no restart required.

<!--
  Screenshot placeholder: Chinese UI overview
  How to capture:
  1. Open app, go to Settings → Interface, switch to Chinese
  2. Navigate to MCP server management page
  3. Resize window to ~1280×800
  4. Take full window screenshot (Cmd+Shift+4 on macOS)
  Suggested size: 1280px wide
  Format: PNG
  Save to: imgs/hero-zh.png
-->

---

## Installation

### Direct Download

Download the latest release from [GitHub Releases](https://github.com/linhai0872/claude-code-tool-manager/releases):

| Platform | File |
|----------|------|
| Windows | `.msi` (installer) or `.exe` (portable) |
| macOS (Apple Silicon) | `.dmg` |
| macOS (Intel) | `.dmg` |
| Linux | `.AppImage` or `.deb` |

> [!IMPORTANT]
> **macOS users:** This app is not signed with an Apple Developer certificate. macOS will block it on first launch.
>
> Fix: Right-click the app → select "Open" → confirm "Open" in the dialog.
>
> Or run in Terminal:
> ```bash
> xattr -cr /Applications/Claude\ Code\ Tool\ Manager.app
> ```

<details>
<summary><strong>Build from Source</strong></summary>

Requires [Node.js](https://nodejs.org/) 18+, [Rust](https://www.rust-lang.org/tools/install) 1.70+, and [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/).

```bash
git clone https://github.com/linhai0872/claude-code-tool-manager.git
cd claude-code-tool-manager
npm install
npm run tauri build
```

Output: `src-tauri/target/release/bundle/`

</details>

---

## Quick Start

**1. Scan existing configurations**

On launch, the app detects installed editors and scans their existing MCP configurations.

**2. Add or import**

Create a new MCP server manually, or paste JSON / CLI commands for quick import:

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

**3. Assign to projects**

Toggle tools on/off per project, select target editors, and configurations sync automatically.

---

## Configuration Locations

| Scope | MCPs | Commands | Skills | Sub-Agents | Hooks |
|-------|------|----------|--------|------------|-------|
| Global | `~/.claude.json` | `~/.claude/commands/` | `~/.claude/skills/` | `~/.claude/agents/` | `~/.claude/settings.json` |
| Project | `.claude/.mcp.json` | `.claude/commands/` | `.claude/skills/` | `.claude/agents/` | `.claude/settings.json` |

---

## Tech Stack

Svelte 5 + SvelteKit · Tauri 2 + Rust · SQLite · Tailwind CSS v4 · Paraglide JS

## Acknowledgments

Thanks to [@tylergraydev](https://github.com/tylergraydev) for creating and maintaining the upstream project [claude-code-tool-manager](https://github.com/tylergraydev/claude-code-tool-manager).

## Development

```bash
npm install          # Install dependencies
npm run tauri dev    # Development mode
npm test             # Run tests
npm run tauri build  # Production build
```

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## License

[MIT](https://opensource.org/licenses/MIT)
