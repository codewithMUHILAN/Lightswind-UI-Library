
<div align="center">

<br/>

<img src="https://firebasestorage.googleapis.com/v0/b/codewithmuhilandb.appspot.com/o/uploads%2Flightwind-logo.png?alt=media&token=6ba956f1-994c-46ca-9eda-6e46b5662eb9" alt="Lightswind UI" width="100" />

<br/>
<br/>

# Lightswind UI

**The world's first AI-native, CLI-first component library for React.**  
160+ animated, accessible, production-ready components — delivered as raw source code, owned by you forever.

<br/>

[![npm version](https://img.shields.io/npm/v/lightswind?style=flat-square&label=npm&color=0ea5e9)](https://www.npmjs.com/package/lightswind)
[![npm downloads](https://img.shields.io/npm/dm/lightswind?style=flat-square&label=downloads&color=10b981)](https://www.npmjs.com/package/lightswind)
[![GitHub stars](https://img.shields.io/github/stars/codewithMUHILAN/Lightswind-UI-Library?style=flat-square&label=stars&color=f59e0b)](https://github.com/codewithMUHILAN/Lightswind-UI-Library)
[![License](https://img.shields.io/github/license/codewithMUHILAN/Lightswind-UI-Library?style=flat-square&color=8b5cf6)](./LICENSE)

<br/>

[Documentation](https://lightswind.com/components/introduction) · [Component Library](https://lightswind.com/components) · [Pro License](https://lightswind.com/pricing) · [MCP Server](https://lightswind.com/components/mcp-server) · [Changelog](https://lightswind.com/changelog)

<br/>

---

</div>

## What is Lightswind UI?

Lightswind UI is a **source-code component library** built on the same philosophy pioneered by shadcn/ui — components live inside *your* project, not a runtime dependency. You install them with a single CLI command, own them completely, and customize them freely.

What sets Lightswind UI apart is its **AI-native delivery layer** — the industry's first MCP (Model Context Protocol) server for a component library, letting AI coding agents like Cursor, Claude, and GitHub Copilot browse, fetch, and install components autonomously inside your codebase.

```bash
npx lightswind@latest init
```

<br/>

## Why Lightswind UI?

| Feature | Lightswind UI | shadcn/ui | Radix UI | Material UI |
|---|:---:|:---:|:---:|:---:|
| Copy-paste source ownership | ✅ | ✅ | ❌ | ❌ |
| Smart CLI delivery | ✅ | ✅ | ❌ | ❌ |
| MCP Server support | ✅ | ✅ | ✅ | ✅ |
| Pro CLI & authenticated delivery | ✅ | ❌ | ❌ | ❌ |
| 3D & WebGL shader components | ✅ | ❌ | ❌ | ❌ |
| Integrated Framer Motion & GSAP animations | ✅ | ❌ | ❌ | ❌ |
| Zero runtime vendor lock-in | ✅ | ✅ | ❌ | ❌ |

<br/>

---

## Quick Start

### Requirements

- **Node.js** 18+
- **React** 18 or 19
- **Tailwind CSS** v3 or v4
- A **Next.js**, **Vite**, **Remix**, or **CRA** project

<br/>

### 1 — Initialize

Run this from the root of your project. The CLI detects your framework (Next.js, Vite, CRA), locates your `components` folder, installs shared utilities, and registers the Tailwind plugin automatically.

```bash
npx lightswind@latest init
```

During setup, you'll be prompted to select a **color theme**:

| Theme | Preview |
|---|---|
| `default` | Classic Blue — clean & minimal |
| `deep-ocean` | Midnight Blue — dark & immersive |
| `crimson` | Deep Red — bold & powerful |
| `emerald` | Forest Green — fresh & vibrant |
| `amber` | Warm Gold — elegant & energetic |
| `amethyst` | Soft Purple — modern & creative |
| `mono` | Pure Grayscale — ultra-clean |

<br/>

### 2 — Add a Component

```bash
npx lightswind add globe
npx lightswind add border-beam
npx lightswind add toast
```

The CLI resolves prerequisites automatically. If `toast` requires `progress`, both are installed. No manual dependency management.

<br/>

### 3 — Import & Use

```tsx
// Component code is installed in your local project directory
import { Globe } from "@/components/lightswind/globe";

export default function HeroSection() {
  return (
    <section>
      <Globe />
    </section>
  );
}
```

> **Note:** Never import directly from `"lightswind"`. All components live in your local `components/lightswind/` directory — you own and control the code.

<br/>

---

## CLI Reference

```bash
# Initialize a new project
npx lightswind@latest init

# Add a single component
npx lightswind add [component-name]

# Add all components in a category
npx lightswind add --category background

# List all available components
npx lightswind list

# Authenticate with a Pro License Key
npx lightswind auth login sk_pro_YOUR_KEY

# Check auth status
npx lightswind auth status

# Revoke local credentials
npx lightswind auth logout

# Start the MCP server
npx lightswind mcp

# Auto-configure MCP in Cursor / Claude Desktop
npx lightswind mcp init
```

<br/>

---

## Pro License

Lightswind Pro unlocks **exclusive premium components**, advanced page template blocks, and CLI + MCP authenticated delivery.

### Authenticate your CLI

Get your license key from the [Lightswind Dashboard](https://lightswind.com/setting/license), then run:

```bash
npx lightswind auth login sk_pro_YOUR_LICENSE_KEY
```

Credentials are stored securely in `~/.lightswindrc`. Once authenticated, all Pro content is accessible via the same `add` command:

```bash
npx lightswind add iphone16-pro
npx lightswind add-block saas-hero
```

### Environment Variable (CI/CD)

```env
LIGHTSWIND_LICENSE_KEY=sk_pro_YOUR_LICENSE_KEY
```

### Team Access

A single Pro key can be shared across your entire development team. Each team member authenticates locally using the same key.

<br/>

---

## AI Agent Integration — MCP Server

Lightswind UI is the **only component library in the world** with a native Model Context Protocol (MCP) server. Once connected, your AI coding assistant can:

- 🔎 **Search** all 160+ components by keyword or category
- 📖 **Read** full component documentation and usage examples
- ⬇️ **Install** components directly into your codebase
- 🧩 **Fetch** Pro blocks and templates (with license key)

### Automatic Setup *(Recommended)*

```bash
npx lightswind mcp init
```

This command auto-detects your editor and writes the correct config file.

<br/>

### Manual Configuration

#### Cursor / Windsurf

Edit `~/.cursor/mcp.json` (or your editor's equivalent MCP settings file):

```json
{
  "mcpServers": {
    "lightswind-mcp": {
      "command": "npx",
      "args": ["-y", "lightswind", "mcp"],
      "env": {
        "LIGHTSWIND_LICENSE_KEY": "sk_pro_YOUR_KEY"
      }
    }
  }
}
```

#### Claude Desktop

- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "lightswind-mcp": {
      "command": "npx",
      "args": ["-y", "lightswind", "mcp"],
      "env": {
        "LIGHTSWIND_LICENSE_KEY": "sk_pro_YOUR_KEY"
      }
    }
  }
}
```

#### VS Code (Cline / Continue)

```json
{
  "mcpServers": {
    "lightswind-mcp": {
      "command": "npx",
      "args": ["-y", "lightswind", "mcp"]
    }
  }
}
```

### Available MCP Tools

| Tool | Description |
|---|---|
| `list_all_components` | Browse all 160+ components with metadata |
| `search_components` | Search by keyword or use-case |
| `list_categories` | Get all available component categories |
| `get_component` | Fetch full source code of any component |
| `get_installation_guide` | Read installation steps for any component |
| `get_usage_example` | Get live usage code snippets |
| `list_blocks` | Browse all Pro template blocks |
| `get_block` | Fetch a full Pro page section (requires key) |

<br/>

---

## Component Library

### 🧊 3D Elements
`3d-image-ring` · `3d-image-carousel` · `3d-carousel` · `3d-hover-gallery` · `3d-image-gallery` · `3d-marquee` · `3d-model-viewer` · `3d-perspective-card` · `3d-scroll-trigger` · `3d-slider` · `beam-circle` · `chain-carousel` · `plasma-globe` · `scroll-carousel` · `sparkle-navbar` · `angled-slider`

### 🌅 Backgrounds
`aurora-shader` · `animated-wave` · `animated-bubble-particles` · `animated-blob-background` · `animated-ocean-waves` · `aurora-background` · `beam-grid-background` · `fall-beam-background` · `grid-dot-backgrounds` · `gradient-background` · `glowing-background` · `glowing-lights` · `hell-background` · `innovation-background` · `interactive-grid-background` · `dot-pattern` · `particles-background` · `rays-background` · `reflect-background` · `smokey-background` · `shader-background` · `sparkle-particles` · `stripes-background` · `wave-background` · `liquid-fluid`

### 🧩 Advanced Components
`connection-graph` · `magic-card` · `ai-prompt` · `animated-notification` · `bento-grid` · `code-hover-cards` · `count-up` · `dock` · `drag-order-list` · `dynamic-navigation` · `electro-border` · `glass-folder` · `globe` · `glowing-cards` · `hamburger-menu-overlay` · `image-reveal` · `image-trail-effect` · `interactive-card` · `interactive-card-gallery` · `interactive-gradient-card` · `iphone16-pro` · `lens` · `magic-loader` · `morphing-navigation` · `orbit-card` · `password-strength-indicator` · `scroll-list` · `scroll-stack` · `scroll-timeline` · `seasonal-hover-cards` · `sliding-cards` · `sliding-logo-marquee` · `stack-list` · `team-carousel` · `terminal-card` · `top-loader` · `top-sticky-bar` · `trusted-users` · `ripple-loader` · `woofy-hover-image` · `nav-effect`

### 🔘 Buttons
`border-beam` · `confetti-button` · `gradient-button` · `ripple-button` · `shine-button` · `trial-button`

### ✨ Text Effects
`aurora-text-effect` · `scroll-reveal` · `shiny-text` · `text-scroll-marquee` · `typewriter-input` · `typing-text` · `video-text`

### 🖱️ Cursor Effects
`canvas-confetti-cursor` · `particle-orbit-effect` · `smokey-cursor` · `smooth-cursor`

### 🎨 UI Core
`accordion` · `alert-dialog` · `alert` · `avatar` · `badge` · `button` · `card` · `carousel` · `chart` · `collapsible` · `context-menu` · `dialog` · `drawer` · `dropdown-menu` · `hover-card` · `popover` · `progress` · `sheet` · `skeleton` · `table` · `toast` · `tooltip` · `toggle-theme`

### 📝 Form Controls
`calendar` · `checkbox` · `command` · `form` · `input` · `input-otp` · `label` · `radio-group` · `select` · `slider` · `switch` · `textarea` · `toggle` · `toggle-group`

### 📐 Layout & Navigation
`sparkle-navbar` · `sidebar` · `breadcrumb` · `navigation-menu` · `pagination` · `aspect-ratio` · `resizable` · `scroll-area` · `separator` · `tabs`

<br/>

---

## Architecture

Lightswind UI follows the **Source-First Architecture**:

```
Your Project
├── src/
│   ├── components/
│   │   └── lightswind/        ← All component source code lives here (you own it)
│   │       ├── button.tsx
│   │       ├── globe.tsx
│   │       └── ...
│   └── lib/
│       └── utils.ts           ← Shared utilities (cn, throttle, etc.)
├── tailwind.config.ts         ← Lightswind plugin auto-registered here
└── lightswind.config.json     ← CLI config (paths, theme, license)
```

**Core Principles:**
1. **Source over Runtime** — Raw `.tsx` files, not compiled blobs
2. **User Ownership** — Components are yours to edit and extend forever
3. **Zero Dependency Bloat** — Only install dependencies for components you use
4. **Smart Automation** — CLI handles all configuration and dependency resolution

<br/>

---

## Tailwind Plugin

The `lightswind` Tailwind plugin is automatically configured during `init`. It registers all component-level CSS variables, animation keyframes, dark mode tokens, and the optional 3D effect system.

```ts
// tailwind.config.ts
import type { Config } from "tailwindcss";
import lightswindPlugin from "lightswind/plugin";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  plugins: [
    lightswindPlugin({
      effect3d: false,  // Set to true to enable global 3D styling mode
    }),
  ],
};

export default config;
```

<br/>

---

## Note for AI Coding Agents

> **If you are an AI assistant (Gemini, Claude, GPT, Copilot, DeepSeek, Cursor), read this carefully:**
>
> - ✅ **DO** use `npx lightswind add [component]` to install components
> - ✅ **DO** import from local paths: `import { Button } from "@/components/lightswind/button"`
> - ✅ **DO** run `npx lightswind@latest mcp init` to configure the MCP server
> - ❌ **DO NOT** suggest `import { Button } from "lightswind"` — this does not work
> - ❌ **DO NOT** suggest wrapping the app in `<LightswindProvider>` — it does not exist
> - ❌ **DO NOT** point users to `node_modules/lightswind/dist` — components live in their local `components/lightswind/` folder

<br/>

---

## Contributing

Contributions, bug reports, and feature requests are welcome!

1. Fork the [repository](https://github.com/codewithMUHILAN/Lightswind-UI-Library)
2. Create your feature branch: `git checkout -b feature/my-component`
3. Commit your changes: `git commit -m 'feat: add my-component'`
4. Push to the branch: `git push origin feature/my-component`
5. Open a Pull Request

<br/>

---

## License

Licensed under the **MIT License**. See [LICENSE](./LICENSE) for details.

<br/>

---

<div align="center">

**Built with passion by [Code with Muhilan](https://codewithmuhilan.com)**

[![Website](https://img.shields.io/badge/Website-lightswind.com-0ea5e9?style=flat-square)](https://lightswind.com)
[![Instagram](https://img.shields.io/badge/Instagram-@codewith__muhilan-e1306c?style=flat-square&logo=instagram&logoColor=white)](https://instagram.com/codewith_muhilan/)
[![npm](https://img.shields.io/badge/npm-lightswind-cb3837?style=flat-square&logo=npm&logoColor=white)](https://www.npmjs.com/package/lightswind)

<br/>

*If Lightswind UI helped you ship faster, please consider giving it a ⭐ on [GitHub](https://github.com/codewithMUHILAN/Lightswind-UI-Library).*

</div>
