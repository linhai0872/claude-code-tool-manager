# 这是 Homebrew Cask 文件模板，供参考。
# 实际文件放在 https://github.com/linhai0872/homebrew-tap 仓库的 Casks/ 目录下。
# CI 每次发版时会自动更新版本号和 SHA256。

cask "claude-code-tool-manager" do
  version "3.4.1"

  on_arm do
    url "https://github.com/linhai0872/claude-code-tool-manager/releases/download/v#{version}/Claude.Code.Tool.Manager_#{version}_aarch64.dmg"
    sha256 "PLACEHOLDER_ARM_SHA256"
  end

  on_intel do
    url "https://github.com/linhai0872/claude-code-tool-manager/releases/download/v#{version}/Claude.Code.Tool.Manager_#{version}_x64.dmg"
    sha256 "PLACEHOLDER_X64_SHA256"
  end

  name "Claude Code Tool Manager"
  desc "GUI for managing Claude Code MCP servers, skills, hooks, sub-agents, and more"
  homepage "https://github.com/linhai0872/claude-code-tool-manager"

  app "Claude Code Tool Manager.app"

  zap trash: [
    "~/Library/Application Support/com.claude-code-tool-manager.app",
    "~/Library/WebKit/com.claude-code-tool-manager.app",
  ]
end
