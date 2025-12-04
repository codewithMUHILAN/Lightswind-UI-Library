<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
</head>
<body>
    <div align="center">
  <img src="https://codewithmuhilan.com/Extra-Assets/lightwind-logo.png" alt="Lightswind UI Logo" width="180" />
  
  <h1 align="center">Lightswind UI 3.1.20</h1>
  
  <p align="center">
    <b>A collection of beautifully crafted React Components, Blocks & Templates built with Tailwind CSS. Create stunning web applications effortlessly by using our 100+ professional and animated react components.</b>
  </p>
  
<p align="center">
  <a href="https://github.com/codewithMUHILAN/Lightswind-UI-Library/stargazers">
    <img src="https://img.shields.io/github/stars/codewithMUHILAN/Lightswind-UI-Library?style=flat-square&labelColor=000000&color=4d4d4d" alt="GitHub Stars" />
  </a>
  <a href="https://www.npmjs.com/package/lightswind">
    <img src="https://img.shields.io/npm/v/lightswind?style=flat-square&labelColor=000000&color=4d4d4d" alt="NPM Version" />
  </a>
  <a href="https://github.com/codewithMUHILAN/Lightswind-UI-Library/blob/main/README.md">
    <img src="https://img.shields.io/github/license/codewithMUHILAN/Lightswind-UI-Library?style=flat-square&labelColor=000000&color=4d4d4d" alt="License" />
  </a>
</p>

  <br />
  <!-- <p align="center">
    <img src="https://i.ibb.co/CtFSK18/lightswind-components-display.png" alt="Lightswind UI Components" width="90%" />
  </p> -->
</div>

<hr />

## 📦 Installation

<h2>Step 1: Install Tailwind CSS</h2>
<p>Lightswind UI components are built on Tailwind CSS. Make sure to install Tailwind in your project by following the instructions at <a href="https://tailwindcss.com/docs/installation" target="_blank" rel="noopener noreferrer">Tailwind CSS Installation Guide</a>.</p>

<!-- <h3>01: Create your project</h3> -->
<!-- <p>Start by creating a new Vite project if you don’t have one set up already. The most common approach is to use Create Vite.</p> -->

<!-- ```bash
npm create vite@latest my-project
cd my-project
``` -->

<!-- <h3>02: Install Tailwind CSS</h3>
<p>Install `tailwindcss` and `@tailwindcss/vite` via npm.</p>

```bash
npm install tailwindcss @tailwindcss/vite
```

<h3>03: Configure the Vite plugin</h3>
<p>Add the `@tailwindcss/vite` plugin to your Vite configuration.
</p>

```bash
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
})
``` -->

<br/>


<h2>Step 2: Install Lightswind UI Package</h2>
<p>Add the Lightswind UI package to your project dependencies.</p>

```bash
# Using npm
npm install lightswind@lastest

# Using yarn
yarn add lightswind

# Using pnpm
pnpm add lightswind
```

<br/>


<h2>Step 3: Initialize Components</h2>
<p>Set up Lightswind UI components in your project structure using our smart CLI tool.</p>

<h3>🎯 Smart Dependency Management</h3>
<p>Lightswind CLI automatically detects which dependencies your chosen components need and prompts you to install only those packages. This keeps your project lean!</p>

<h3>Full Setup - Install All Components</h3>
<p>Our CLI tool will install all components, utilities, and styles to your project.</p>

```bash
npx lightswind@latest init
```

<span>
What this command does:

✓ Installs ALL components to src/components/lightswind
All 100+ UI components are organized in this directory.

✓ Sets up src/lib folder
Contains utilities and helpers for component functionality.

✓ Installs hooks to src/components/hooks
Custom React hooks used by components.

✓ Copies CSS styles
Places the `lightswind.css` file in `src/components/lightswind.css`.

✓ Lists all required dependencies
Shows you all packages needed across all components and prompts for installation.
</span>

<h3>Individual Component - Install What You Need</h3>
<p>Install only the components you need with smart dependency detection. Replace `[component-name]` with the desired component (e.g., `button`, `globe`, `chart`).</p>

```bash
# Install a basic component (no extra dependencies)
npx lightswind@latest add button

# Install a specialized component (CLI auto-detects dependencies)
npx lightswind@latest add globe
```

**Example output:**
```
📦 globe requires: cobe
Install dependencies? (Y/n): Y
⏳ Installing cobe...
✅ Dependencies installed
✅ Installed globe component
```

<span>
What this command does:

✓ Checks component dependencies
Reads which npm packages this component needs.

✓ Detects missing packages
Compares with your package.json to find what's missing.

✓ Prompts for installation
Asks before installing - you stay in control!

✓ Copies the component file
Places it in src/components/lightswind/[component].tsx

✓ Copies shared utilities
Includes lib, hooks, and styles automatically.

**No bloat!** Installing `button` won't add `cobe`, `recharts`, or `@react-three/fiber`. You only get what you need.
</span>

<h3>Category-Based Installation - NEW! 🆕</h3>
<p><strong>Install all components from a specific category at once with intelligent dependency management.</strong></p>

This powerful feature allows you to install entire groups of related components in one command, perfect for when you know you'll need multiple components of the same type.

**Command Syntax:**
```bash
npx lightswind@latest add --category <category-name>

# Short form
npx lightswind@latest add -c <category-name>
```

<h4>📦 Available Categories</h4>

<table>
<tr>
<th>Category</th>
<th>Description</th>
<th>Dependencies</th>
<th>Command</th>
</tr>
<tr>
<td><code>basic</code></td>
<td>Basic UI components</td>
<td>None</td>
<td><code>add -c basic</code></td>
</tr>
<tr>
<td><code>ui</code></td>
<td>Standard UI elements</td>
<td>lucide-react</td>
<td><code>add -c ui</code></td>
</tr>
<tr>
<td><code>layout</code></td>
<td>Layout components</td>
<td>lucide-react</td>
<td><code>add -c layout</code></td>
</tr>
<tr>
<td><code>form</code></td>
<td>Form controls</td>
<td>lucide-react</td>
<td><code>add -c form</code></td>
</tr>
<tr>
<td><code>navigation</code></td>
<td>Navigation components</td>
<td>lucide-react</td>
<td><code>add -c navigation</code></td>
</tr>
<tr>
<td><code>utility</code></td>
<td>Utility components</td>
<td>None</td>
<td><code>add -c utility</code></td>
</tr>
<tr>
<td><code>background</code></td>
<td>Background effects</td>
<td>framer-motion</td>
<td><code>add -c background</code></td>
</tr>
<tr>
<td><code>button</code></td>
<td>Animated buttons</td>
<td>framer-motion</td>
<td><code>add -c button</code></td>
</tr>
<tr>
<td><code>text</code></td>
<td>Text effects</td>
<td>framer-motion</td>
<td><code>add -c text</code></td>
</tr>
<tr>
<td><code>cursor</code></td>
<td>Cursor effects</td>
<td>framer-motion</td>
<td><code>add -c cursor</code></td>
</tr>
<tr>
<td><code>components</code></td>
<td>Complex animated components</td>
<td>framer-motion</td>
<td><code>add -c components</code></td>
</tr>
<tr>
<td><code>3d</code></td>
<td>3D elements</td>
<td>three, @react-three/fiber</td>
<td><code>add -c 3d</code></td>
</tr>
<tr>
<td><code>charts</code></td>
<td>Chart components</td>
<td>recharts</td>
<td><code>add -c charts</code></td>
</tr>
</table>
**✅ Use category installation when:**
- Building a dashboard → `npx lightswind@latest add -c charts`
- Creating animated landing pages → `npx lightswind@latest add -c animated`
- Building 3D experiences → `npx lightswind@latest add -c 3d`
- Need multiple UI components → `npx lightswind@latest add -c ui`
- Want all basic components → `npx lightswind@latest add -c basic`

**❌ Use individual installation when:**
- You only need 1-2 specific components
- Keeping bundle size minimal is critical
- Testing a specific component

<h4>📚 Example 1: Install All Animated Components</h4>

```bash
npx lightswind@latest add --category animated
```

**Output:**
```
🎨 Installing Animated Components...
📦 Detected: Vite
📁 Installing to: /your-project/src/components/lightswind
📊 Total components: 30

📦 The following dependencies are required:
  • framer-motion

Total: 1 packages

Install dependencies? (Y/n): Y
⏳ Installing framer-motion...
✅ Dependencies installed successfully

✅ Installed 30 components from Animated Components

🎉 Success! Animated Components ready to use.

Components installed:
  • 3d-hover-gallery
  • 3d-marquee
  • aurora-background
  • count-up
  • dock
  ... and 25 more
```

<h4>📚 Example 2: Install All 3D Components</h4>

```bash
npx lightswind@latest add -c 3d
```

**Output:**
```
🌐 Installing 3D Components...
📦 Detected: Next.js
📁 Installing to: /your-project/components/lightswind
📊 Total components: 7

📦 The following dependencies are required:
  • @react-three/fiber
  • @react-three/drei

Total: 2 packages

Install dependencies? (Y/n): Y
⏳ Installing @react-three/fiber @react-three/drei...
✅ Dependencies installed successfully

✅ Installed 7 components from 3D Components

Components installed:
  • 3d-image-gallery
  • 3d-image-ring
  • 3d-model-viewer
  ... and 4 more
```

<h4>📚 Example 3: Install Basic UI (No Dependencies)</h4>

```bash
npx lightswind@latest add --category basic
```

**Output:**
```
✨ Installing Basic UI...
📦 Detected: Create React App
📁 Installing to: /your-project/src/components/lightswind
📊 Total components: 50

✅ Installed 50 components from Basic UI

🎉 Success! Basic UI ready to use.

Components installed:
  • badge
  • button
  • card
  • input
  • label
  ... and 45 more
```

<h4>🎯 Category Benefits</h4>

| Benefit | Description |
|---------|-------------|
| **Time Saving** | Install 30+ components in one command vs individually |
| **Smart Dependencies** | Automatically collects unique dependencies from all components |
| **No Duplicates** | Intelligent deduplication of dependencies across components |
| **Organized Workflow** | Group components by purpose (animated, 3D, charts, etc.) |
| **Easy Testing** | Quickly try out all components in a category |

<h4>📋 Complete Category List</h4>

**Basic UI Components (No Dependencies)**
```bash
npx lightswind@latest add -c basic
```
Perfect for foundational UI elements without external package requirements.
**Includes:** badge, button, card, input, label, progress, separator, skeleton, table, textarea, and ~40 more

**UI Components (Lucide React)**
```bash
npx lightswind@latest add -c ui
```
Standard UI elements that use icons from lucide-react.
**Includes:** accordion, alert, breadcrumb, checkbox, dialog, dropdown-menu, select, tabs, toast, and ~20 more

**Animated Components (Framer Motion)**
```bash
npx lightswind@latest add -c animated
```
Beautiful animated components powered by framer-motion.
**Includes:** aurora-background, count-up, dock, interactive-card, lens, scroll-reveal, shiny-text, and ~23 more

**3D Components (Three.js)**
```bash
npx lightswind@latest add -c 3d
```
Immersive 3D components using React Three Fiber.
**Includes:** 3d-image-gallery, 3d-image-ring, 3d-model-viewer, and more

**Chart Components (Recharts)**
```bash
npx lightswind@latest add -c charts
```
Data visualization components.
**Includes:** chart (with multiple chart types)

**Specialized Components**
```bash
npx lightswind@latest add -c specialized
```
Components with unique or multiple dependencies.
**Includes:** calendar, carousel, form, globe, particles-background, and more

<h3>List Available Components</h3>
<p>See all available components grouped by their dependencies.</p>

```bash
npx lightswind@latest list
```

<br/>

<h2>📱 Framework Compatibility</h2>

<p><strong>Lightswind UI works seamlessly with all major React frameworks!</strong></p>

<h3>✅ Supported Frameworks</h3>

<table>
<tr>
<th>Framework</th>
<th>Auto-Detected</th>
<th>Directory Structure</th>
<th>Status</th>
</tr>
<tr>
<td><strong>Vite + React</strong></td>
<td>✅ Yes</td>
<td><code>src/components/</code></td>
<td>✅ Fully Supported</td>
</tr>
<tr>
<td><strong>Next.js (with src/)</strong></td>
<td>✅ Yes</td>
<td><code>src/components/</code></td>
<td>✅ Fully Supported</td>
</tr>
<tr>
<td><strong>Next.js (without src/)</strong></td>
<td>✅ Yes</td>
<td><code>components/</code></td>
<td>✅ Fully Supported</td>
</tr>
<tr>
<td><strong>Create React App</strong></td>
<td>✅ Yes</td>
<td><code>src/components/</code></td>
<td>✅ Fully Supported</td>
</tr>
<tr>
<td><strong>Generic React</strong></td>
<td>✅ Yes</td>
<td><code>src/components/</code></td>
<td>✅ Fully Supported</td>
</tr>
</table>

<h3>🤖 Automatic Framework Detection</h3>

<p>The Lightswind CLI automatically detects your framework from <code>package.json</code> and adapts the installation path accordingly. <strong>Zero configuration needed!</strong></p>

**Example Output:**
```bash
$ npx lightswind@latest init

🚀 Installing all Lightswind components...
📦 Detected: Next.js
📁 Installing to: /your-project/components/lightswind

✅ Installed all components
```

<h3>📁 Supported Directory Structures</h3>

The CLI intelligently detects and uses the appropriate directory structure for your project:

**Vite / Create React App:**
```
your-project/
├── src/
│   ├── components/
│   │   ├── lightswind/     ← Components installed here
│   │   ├── lib/            ← Utilities
│   │   ├── hooks/          ← Custom hooks
│   │   └── lightswind.css  ← Styles
│   └── App.tsx
└── package.json
```

**Next.js (with src/ directory):**
```
your-next-app/
├── src/
│   ├── app/
│   └── components/
│       ├── lightswind/     ← Components installed here
│       ├── lib/            ← Utilities
│       ├── hooks/          ← Custom hooks
│       └── lightswind.css  ← Styles
└── package.json
```

**Next.js (without src/ directory):**
```
your-next-app/
├── app/
├── components/
│   ├── lightswind/         ← Components installed here
│   ├── lib/                ← Utilities
│   ├── hooks/              ← Custom hooks
│   └── lightswind.css      ← Styles
└── package.json
```

<h3>🎯 How Detection Works</h3>

1. **Checks existing directories** - If you already have a `components/` folder, uses that
2. **Detects framework** - Reads `package.json` to identify Vite, Next.js, or CRA
3. **Chooses path** - Selects the appropriate path based on framework and structure
4. **Creates directories** - Automatically creates folders if they don't exist

**You don't need to configure anything - it just works!** ✨


<h2>Step 4: Configure Tailwind Plugin - Automated! ✨</h2>

<p><strong>Good news! The Lightswind CLI automatically configures the Tailwind plugin for you.</strong></p>

When you install components using any of these commands:
- `npx lightswind@latest init`
- `npx lightswind@latest add <component>`
- `npx lightswind@latest add --category <name>`

The CLI will:
1. **Detect your Tailwind CSS version** from `package.json`
2. **Auto-configure the plugin** based on your version
3. **Show you confirmation** when done

<h3>🤖 Automatic Configuration</h3>

**For Tailwind CSS v3.x:**

The CLI automatically adds the plugin to your `tailwind.config.js`:

```bash
$ npx lightswind@latest init

✅ Installed all components
✅ Installed shared utilities

🔧 Configuring Lightswind for Tailwind CSS v3...
✅ Added Lightswind plugin to tailwind.config

🎉 Success! Ready to use.
```

**Your `tailwind.config.js` will be updated:**
```javascript
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [
    require('lightswind/plugin'),  // ← Automatically added!
  ],
}
```

---

**For Tailwind CSS v4.x (Alpha):**

The CLI automatically adds the plugin to your main CSS file:

```bash
$ npx lightswind@latest init

✅ Installed all components
✅ Installed shared utilities

🔧 Configuring Lightswind for Tailwind CSS v4...
✅ Added Lightswind plugin to globals.css

🎉 Success! Ready to use.
```

**Your CSS file (e.g., `globals.css`) will be updated:**
```css
@import 'tailwindcss';
@plugin 'lightswind/plugin';  /* ← Automatically added! */

/* Your custom styles below */
```

<h3>📋 Supported Config Files</h3>

The CLI automatically detects and modifies these files:

**For Tailwind v3:**
- `tailwind.config.js`
- `tailwind.config.ts`
- `tailwind.config.mjs`
- `tailwind.config.cjs`

**For Tailwind v4:**
- `src/app/globals.css`
- `src/globals.css`
- `app/globals.css`
- `src/styles/globals.css`
- `src/index.css`
- `src/App.css`
- `styles/globals.css`

<h3>⚠️ Fallback Scenarios</h3>

**If Tailwind is not installed:**
```bash
⚠️  Tailwind CSS not found in package.json
💡 Install Tailwind CSS first:
   npm install -D tailwindcss
```
**Action:** Install Tailwind, then run the CLI again.

---

**If config file is not found (v3):**
```bash
⚠️  Tailwind config not found
💡 Add Lightswind plugin manually to tailwind.config.js:
   plugins: [require('lightswind/plugin')]
```
**Action:** Create `tailwind.config.js` or add the plugin manually.

---

**If CSS file is not found (v4):**
```bash
⚠️  Main CSS file not found
💡 Add Lightswind plugin manually to your CSS file:
   @import 'tailwindcss';
   @plugin 'lightswind/plugin';
```
**Action:** Add the plugin line to your main CSS file.

<h3>🔧 Manual Configuration (If Needed)</h3>

If automatic configuration doesn't work, you can configure manually:

**For Tailwind CSS v3.x:**
```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [
    require('lightswind/plugin'),
  ],
}
```

**For Tailwind CSS v4.x:**
```css
/* In your main CSS file (e.g., globals.css) */
@import 'tailwindcss';
@plugin 'lightswind/plugin';

/* Your custom styles */
```

<h3>✅ Verify Configuration</h3>

After installation, check that the plugin is added:

**For v3:**
```bash
# Check your tailwind.config.js
cat tailwind.config.js | grep lightswind
```

**For v4:**
```bash
# Check your CSS file
cat src/app/globals.css | grep lightswind
```

You should see the Lightswind plugin referenced!

<br/>

<h2>Final Step: Using Components</h2>
<p>Start building your interface with Lightswind UI components.</p>
<h3>Component Structure</h3>
<p>After running the initialization command (e.g., `npx create-lightswind`), your project structure will be updated to include Lightswind UI components and utilities.</p>

```bash
src/
├── components/
│   ├── lightswind/
│   │   ├── button.tsx
│   │   ├── card.tsx
- TypeScript 4.9+ (for TypeScript users)

## 🚀 Quick Start

```jsx
import React from "react";
import { Button } from "@/components/lightswind/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/lightswind/card";
import { Input } from "@/components/lightswind/input";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input id="email" type="email" placeholder="your@email.com" />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input id="password" type="password" placeholder="••••••••" />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Sign in</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
```

## ✨ Core Features

- **⚡ Responsive by Default** — All components are designed to work across devices of all sizes

- **⚡ Themeable** — Customize the look and feel to match your brand identity

- **⚡ Accessible** — Follows WAI-ARIA guidelines for inclusive user interfaces

- **⚡ Modern Animations** — Subtle animations and transitions enhance user experience

- **⚡ CLI Installation** — Quickly set up projects with our simple and powerful CLI tool

- **⚡ AI Assistance** — Get smart recommendations and code suggestions powered by AI for faster development

## 🧩 Component Library

Create stunning web applications effortlessly by using our 100+ professional and animated react components.:

### Our Components List

<ul className="space-y-4">
  <li>
    <h3 className="text-xl font-bold mb-2">Get Started</h3>
    <ul className="ml-4 list-disc text-sm text-muted-foreground">
      <li><a href="https://lightswind.com/components/introduction" target="_blank">Introduction</a></li>
      <li><a href="https://lightswind.com/components/installation" target="_blank">Installation</a></li>
    </ul>
  </li>

  <li>
    <h3 className="text-xl font-bold mb-2">3D Elements</h3>
<ul className="ml-4 list-disc text-sm text-muted-foreground">
  <li>
    <a href="https://lightswind.com/components/3d-image-ring" target="_blank">
      3d Image Ring
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/3d-carousel" target="_blank">
      3d Carousel
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/3d-hover-gallery" target="_blank">
      3d Hover Gallery
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/3d-marquee" target="_blank">
      3d Marquee
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/3d-model-viewer" target="_blank">
      3d Model Viewer
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/3d-perspective-card" target="_blank">
      3d Perspective Card
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/3d-scroll-trigger" target="_blank">
      3d Scroll Trigger
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/scroll-carousel" target="_blank">
      Scroll Carousel <span className="text-xs text-red-500">New</span>
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/sparkle-navbar" target="_blank">
      Sparkle Navbar <span className="text-xs text-red-500">New</span>
    </a>
  </li>
</ul>
  </li>

  <li>
    <h3 className="text-xl font-bold mb-2">Background</h3>
<ul className="ml-4 list-disc text-sm text-muted-foreground mt-4">
  <li>
    <a href="https://lightswind.com/components/animated-wave" target="_blank">
      Animated Wave
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/animated-bubble-particles" target="_blank">
      Animated Bubble Particles
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/aurora-shader" target="_blank">
      Aurora Shader <span className="text-xs text-red-500">New</span>
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/grid-dot-backgrounds" target="_blank">
      Grid Dot Backgrounds
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/gradient-background" target="_blank">
      Gradient Background
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/hell-background" target="_blank">
      Hell Background
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/particles-background" target="_blank">
      Particles Background
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/reflect-background" target="_blank">
      Reflect Background
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/smokey-background" target="_blank">
      Smokey Background
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/shader-background" target="_blank">
      Shader Background
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/sparkle-particles" target="_blank">
      Sparkle Particles
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/stripes-background" target="_blank">
      Stripes Background
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/wave-background" target="_blank">
      Wave Background
    </a>
  </li>
</ul>
  </li>

  <li>
    <h3 className="text-xl font-bold mb-2">Button</h3>
<ul className="ml-4 list-disc text-sm text-muted-foreground mt-4">
  <li>
    <a href="https://lightswind.com/components/border-beam" target="_blank">
      Border Beam
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/confetti-button" target="_blank">
      Confetti Button
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/gradient-button" target="_blank">
      Gradient Button
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/ripple-button" target="_blank">
      Ripple Button
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/shine-button" target="_blank">
      Shine Button
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/trial-button" target="_blank">
      Trial Button
    </a>
  </li>
</ul>
  </li>

  <li>
    <h3 className="text-xl font-bold mb-2">Components</h3>
<ul className="ml-4 list-disc text-sm text-muted-foreground mt-4">
  <li>
    <a href="https://lightswind.com/components/animated-notification" target="_blank">
      Animated Notification
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/bento-grid" target="_blank">
      Bento Grid
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/code-hover-cards" target="_blank">
      Code Hover Cards
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/count-up" target="_blank">
      Count Up
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/dock" target="_blank">
      Dock
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/drag-order-list" target="_blank">
      Drag Order List
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/dynamic-navigation" target="_blank">
      Dynamic Navigation
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/glass-folder" target="_blank">
      Glass Folder
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/globe" target="_blank">
      Globe
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/glowing-cards" target="_blank">
      Glowing Cards
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/hamburger-menu-overlay" target="_blank">
      Hamburger Menu Overlay
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/image-reveal" target="_blank">
      Image Reveal
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/image-trail-effect" target="_blank">
      Image Trail Effect
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/interactive-card" target="_blank">
      Interactive Card
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/interactive-gradient-card" target="_blank">
      Interactive Gradient Card
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/lens" target="_blank">
      Lens
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/magic-loader" target="_blank">
      Magic Loader
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/morphing-navigation" target="_blank">
      Morphing Navigation
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/orbit-card" target="_blank">
      Orbit Card
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/password-strength-indicator" target="_blank">
      Password Strength Indicator
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/scroll-list" target="_blank">
      Scroll List
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/scroll-stack" target="_blank">
      Scroll Stack
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/scroll-timeline" target="_blank">
      Scroll Timeline
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/seasonal-hover-cards" target="_blank">
      Seasonal Hover Cards
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/sliding-cards" target="_blank">
      Sliding Cards
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/sliding-logo-marquee" target="_blank">
      Sliding Logo Marquee
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/stack-list" target="_blank">
      Stack List
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/team-carousel" target="_blank">
      Team Carousel
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/terminal-card" target="_blank">
      Terminal Card
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/top-loader" target="_blank">
      Top Loader
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/top-sticky-bar" target="_blank">
      Top Sticky Bar
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/trusted-users" target="_blank">
      Trusted Users
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/ripple-loader" target="_blank">
      Ripple Loader
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/woofy-hover-image" target="_blank">
      Woofy Hover Image
    </a>
  </li>
</ul>
  </li>

  <li>
    <h3 className="text-xl font-bold mb-2">Cursor</h3>
<ul className="ml-4 list-disc text-sm text-muted-foreground mt-4">
  <li>
    <a href="https://lightswind.com/components/canvas-confetti-cursor" target="_blank">
      Canvas Confetti Cursor
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/particle-orbit-effect" target="_blank">
      Particle Orbit Effect
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/smokey-cursor" target="_blank">
      Smokey Cursor
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/smooth-cursor" target="_blank">
      Smooth Cursor
    </a>
  </li>
</ul>
  </li>

  <li>
    <h3 className="text-xl font-bold mb-2">Text</h3>
<ul className="ml-4 list-disc text-sm text-muted-foreground mt-4">
  <li>
    <a href="https://lightswind.com/components/aurora-text-effect" target="_blank">
      Aurora Text Effect
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/scroll-reveal" target="_blank">
      Scroll Reveal
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/shiny-text" target="_blank">
      Shiny Text
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/text-scroll-marquee" target="_blank">
      Text Scroll Marquee
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/typewriter-input" target="_blank">
      Typewriter Input
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/typing-text" target="_blank">
      Typing Text
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/video-text" target="_blank">
      Video Text
    </a>
  </li>
</ul>
  </li>

  <li>
    <h3 className="text-xl font-bold mb-2">UI Elements</h3>
<ul className="ml-4 list-disc text-sm text-muted-foreground mt-4">
  <li>
    <a href="https://lightswind.com/components/alert" target="_blank">
      Alert
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/alert-dialog" target="_blank">
      Alert Dialog
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/avatar" target="_blank">
      Avatar
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/badge" target="_blank">
      Badge
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/button" target="_blank">
      Button
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/card" target="_blank">
      Card
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/carousel" target="_blank">
      Carousel
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/chart" target="_blank">
      Chart
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/collapsible" target="_blank">
      Collapsible
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/context-menu" target="_blank">
      Context Menu
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/dialog" target="_blank">
      Dialog
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/drawer" target="_blank">
      Drawer
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/dropdown-menu" target="_blank">
      Dropdown Menu
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/hover-card" target="_blank">
      Hover Card
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/popover" target="_blank">
      Popover
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/progress" target="_blank">
      Progress
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/sheet" target="_blank">
      Sheet
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/skeleton" target="_blank">
      Skeleton
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/table" target="_blank">
      Table
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/toast" target="_blank">
      Toast
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/tooltip" target="_blank">
      Tooltip
    </a>
  </li>
</ul>
  </li>

  <li>
    <h3 className="text-xl font-bold mb-2">Form Controls</h3>
<ul className="ml-4 list-disc text-sm text-muted-foreground mt-4">
  <li>
    <a href="https://lightswind.com/components/calendar" target="_blank">
      Calendar
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/checkbox" target="_blank">
      Checkbox
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/command" target="_blank">
      Command
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/form" target="_blank">
      Form
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/input" target="_blank">
      Input
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/input-otp" target="_blank">
      Input Otp
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/label" target="_blank">
      Label
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/radio-group" target="_blank">
      Radio Group
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/select" target="_blank">
      Select
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/slider" target="_blank">
      Slider
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/switch" target="_blank">
      Switch
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/textarea" target="_blank">
      Textarea
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/toggle" target="_blank">
      Toggle
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/toggle-group" target="_blank">
      Toggle Group
    </a>
  </li>
</ul>
  </li>

  <li>
    <h3 className="text-xl font-bold mb-2">Layout</h3>
<ul className="ml-4 list-disc text-sm text-muted-foreground mt-4">
  <li>
    <a href="https://lightswind.com/components/accordion" target="_blank">
      Accordion
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/aspect-ratio" target="_blank">
      Aspect Ratio
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/resizable" target="_blank">
      Resizable
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/scroll-area" target="_blank">
      Scroll Area
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/separator" target="_blank">
      Separator
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/tabs" target="_blank">
      Tabs
    </a>
  </li>
</ul>
  </li>

  <li>
    <h3 className="text-xl font-bold mb-2">Navigation</h3>
<ul className="ml-4 list-disc text-sm text-muted-foreground mt-4">
  <li>
    <a href="https://lightswind.com/components/breadcrumb" target="_blank">
      Breadcrumb
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/command" target="_blank">
      Command
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/menubar" target="_blank">
      Menubar
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/navigation-menu" target="_blank">
      Navigation Menu
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/pagination" target="_blank">
      Pagination
    </a>
  </li>
  <li>
    <a href="https://lightswind.com/components/sidebar" target="_blank">
      Sidebar
    </a>
  </li>
</ul>
  </li>
</ul>

## 🌈 Theming System

Lightswind UI uses CSS variables for theming, making it easy to customize:

```css
      ":root": {
        "--primarylw": "#173eff",
        "--primarylw-2": "#3758f9",
        "--darklw": "#11131B",
        "--darklw-2": "#1a1d25",
        "--greedy": "#07eae6",

        "--background": "0 0% 100%",
        "--foreground": "0 0% 0%",

        "--card": "0 0% 100%",
        "--card-foreground": "0 0% 0%",

        "--popover": "0 0% 100%",
        "--popover-foreground": "0 0% 0%",

        "--primary": "0 0% 0%",
        "--primary-foreground": "0 0% 100%",

        "--secondary": "0 0% 96%",
        "--secondary-foreground": "0 0% 0%",

        "--muted": "0 0% 96%",
        "--muted-foreground": "0 0% 45%",

        "--accent": "0 0% 96%",
        "--accent-foreground": "0 0% 0%",

        "--destructive": "0 84% 60%",
        "--destructive-foreground": "0 0% 100%",

        "--border": "0 0% 90%",
        "--input": "0 0% 90%",
        "--ring": "0 0% 0%",

        "--radius": "0.5rem",

        "--scrollbar-thumb": "0 0% 75%",
        "--scrollbar-track": "0 0% 95%",
        "--scrollbar-hover": "0 0% 65%",
      },

      // Dark theme
      ".dark": {
        "--primarylw": "#173eff",
        "--primarylw-2": "#3758f9",
        "--darklw": "#11131B",
        "--darklw-2": "#1a1d25",
        "--greedy": "#07eae6",

        "--background": "0 0% 0%",
        "--foreground": "0 0% 100%",

        "--card": "0 0% 5%",
        "--card-foreground": "0 0% 100%",

        "--popover": "0 0% 5%",
        "--popover-foreground": "0 0% 100%",

        "--primary": "0 0% 100%",
        "--primary-foreground": "0 0% 0%",

        "--secondary": "0 0% 15%",
        "--secondary-foreground": "0 0% 100%",

        "--muted": "0 0% 15%",
        "--muted-foreground": "0 0% 65%",

        "--accent": "0 0% 15%",
        "--accent-foreground": "0 0% 100%",

        "--destructive": "0 62% 30%",
        "--destructive-foreground": "0 0% 100%",

        "--border": "#000",
        "--input": "0 0% 20%",
        "--ring": "0 0% 20%",

        "--scrollbar-thumb": "0 0% 25%",
        "--scrollbar-track": "0 0% 10%",
        "--scrollbar-hover": "0 0% 35%",
      },
```

## 📖 Documentation

For comprehensive documentation including all components, props, and examples:

[**View Documentation**](https://lightswind.com/components/introduction)

## 🤝 Contributing

We welcome contributions to Lightswind UI! Here's how you can help:

1. <a href="https://github.com/codewithMUHILAN/Lightswind-UI-Library/issues/new?template=Blank+issue" target="_blank">Request a feature</a>
2. <a href="https://github.com/codewithMUHILAN/Lightswind-UI-Library/issues/new?template=Blank+issue" target="_blank">Report an issue</a>
3. <a href="https://buymeacoffee.com/codewithmuhilan" target="_blank">Buy me a Coffee (Support Us❤️)</a>
4. <a href="https://lightswind.com/pricing" target="_blank">Buy Our Premium Plan (Support Us❤️)</a>
5. <a href="https://github.com/codewithMUHILAN/Lightswind-UI-Library" target="_blank">Star out Repository (Star Us❤️)</a>

## 📄 License

Lightswind UI is licensed under the [MIT License].

---

<div align="center">
  <p>
    <sub>Designed and built with ❤️ by the <a href="https://www.instagram.com/codewith_muhilan/" target="_blank" > Code with Muhilan</a></sub>
  </p>
  <p>
  <a href="https://instagram.com/codewith_muhilan/" target="_blank">
    <img src="https://img.shields.io/badge/Follow-@codewith_muhilan-blue?style=social&logo=instagram" alt="Instagram Follow" />
  </a>
  </p>
</div>

<script src="https://cdn.tailwindcss.com"></script>
</body>
</html>
