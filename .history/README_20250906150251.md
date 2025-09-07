<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
    <div align="center">
  <img src="https://codewithmuhilan.com/Extra-Assets/lightwind-logo.png" alt="Lightswind UI Logo" width="180" />
  
  <h1 align="center">Lightswind UI 3.0.0
Animated React Components</h1>
  
  <p align="center">
    <b>Create stunning web applications effortlessly with Lightwind UI. Access 100+ customizable cli components, blocks, and templates for various applications—from dashboards to resource pages and catalog displays. Available in React, these pre-built animated elements are fully customizable, helping you craft user-friendly, visually appealing apps without starting from scratch.</b>
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

<h3>Install Lightswind in your Project</h3>

```bash
# Using npm
npm install lightswind@lastest

# Using yarn
yarn add lightswind

# Using pnpm
pnpm add lightswind
```
 <h2>🔗 View Full Installation Guide</h2>
  <p>
    For a complete setup walkthrough with examples and configuration tips, visit:
    <a href="https://lightswind.com/components/installation" target="_blank" rel="noopener noreferrer">
      https://lightswind.com/components/installation
    </a>
  </p>
```

<h3>Start building your interface with Lightswind UI components</h3>

## 🔧 Requirements

- React 18+
- Tailwind CSS 4+
- TypeScript 4.9+ (for TypeScript users)

## 🚀 Quick Start

```jsx
import React from 'react';
import { Button } from '@components/lightswind/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@components/lightswind/card';
import { Input } from '@components/lightswind/input';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input id="email" type="email" placeholder="your@email.com" />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
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

## ✨ Features

- **🎨 Beautiful Design System** — Sleek, professional aesthetics with carefully crafted components
- **♿ Accessible Components** — WCAG 2.1 compliant with full keyboard navigation and screen reader support
- **🌙 Dark Mode Built-in** — Seamless light and dark mode transitions with consistent theming
- **📱 Fully Responsive** — Components designed to work flawlessly across all device sizes
- **⚡ Performance Optimized** — Efficient rendering with minimal bundle size impact
- **🧩 Highly Customizable** — Flexible theming system that adapts to your brand
- **🔄 Interactive Effects** — Smooth animations and transitions enhance user experience
- **📊 Advanced UI Patterns** — Sophisticated components for complex data visualization and user interactions

## 🧩 Component Library

Lightswind UI includes a comprehensive set of components:

### Our Components List

<ul className="space-y-4">
  <li>
    <h3 className="text-xl font-bold mb-2">Get Started</h3>
    <ul className="ml-4 list-disc text-sm text-muted-foreground">
      <li><a href="https://lightswind.com/components/introduction">Introduction</a></li>
      <li><a href="https://lightswind.com/components/installation">Installation</a></li>
    </ul>
  </li>
  <li>
    <h3 className="text-xl font-bold mb-2">Background</h3>
    <ul className="ml-4 list-disc text-sm text-muted-foreground">
      <li><a href="https://lightswind.com/components/animated-wave">Animated Wave</a></li>
      <li><a href="https://lightswind.com/components/animated-bubble-particles">Animated Bubble Particles</a></li>
      <li><a href="https://lightswind.com/components/aurora-shader">Aurora Shader</a></li>
      <li><a href="https://lightswind.com/components/grid-&-dot-backgrounds">Grid & Dot Backgrounds</a></li>
      <li><a href="https://lightswind.com/components/gradient-background">Gradient Background</a></li>
      <li><a href="https://lightswind.com/components/hell-background">Hell Background</a></li>
      <li><a href="https://lightswind.com/components/particles-background">Particles Background</a></li>
      <li><a href="https://lightswind.com/components/reflect-background">Reflect Background</a></li>
      <li><a href="https://lightswind.com/components/smokey-background">Smokey Background</a></li>
      <li><a href="https://lightswind.com/components/shader-background">Shader Background</a></li>
      <li><a href="https://lightswind.com/components/sparkle-particles">Sparkle Particles</a></li>
      <li><a href="https://lightswind.com/components/stripes-background">Stripes Background</a></li>
      <li><a href="https://lightswind.com/components/wave-background">Wave Background</a></li>
    </ul>
  </li>
  <li>
    <h3 className="text-xl font-bold mb-2">Button</h3>
    <ul className="ml-4 list-disc text-sm text-muted-foreground">
      <li><a href="https://lightswind.com/components/border-beam">Border Beam</a></li>
      <li><a href="https://lightswind.com/components/confetti-button">Confetti Button</a></li>
      <li><a href="https://lightswind.com/components/gradient-button">Gradient Button</a></li>
      <li><a href="https://lightswind.com/components/ripple-button">Ripple Button</a></li>
      <li><a href="https://lightswind.com/components/shine-button">Shine Button</a></li>
      <li><a href="https://lightswind.com/components/trial-button">Trial Button</a></li>
    </ul>
  </li>
  <li>
    <h3 className="text-xl font-bold mb-2">Text</h3>
    <ul className="ml-4 list-disc text-sm text-muted-foreground">
      <li><a href="https://lightswind.com/components/aurora-text">Aurora Text</a></li>
      <li><a href="https://lightswind.com/components/scroll-reveal">Scroll Reveal</a></li>
      <li><a href="https://lightswind.com/components/shiny-text">Shiny Text</a></li>
      <li><a href="https://lightswind.com/components/text-scroll-marquee">Text Scroll Marquee</a></li>
      <li><a href="https://lightswind.com/components/typewriter-input">Typewriter Input</a></li>
      <li><a href="https://lightswind.com/components/typing-text">Typing Text</a></li>
      <li><a href="https://lightswind.com/components/video-text">Video Text</a></li>
    </ul>
  </li>
  <li>
    <h3 className="text-xl font-bold mb-2">3D Elements</h3>
    <ul className="ml-4 list-disc text-sm text-muted-foreground">
      <li><a href="https://lightswind.com/components/3d-image-ring">3d Image Ring</a></li>
      <li><a href="https://lightswind.com/components/3d-carousel">3D Carousel</a></li>
      <li><a href="https://lightswind.com/components/3d-hover-gallery">3D Hover Gallery</a></li>
      <li><a href="https://lightswind.com/components/3d-marquee">3D Marquee</a></li>
      <li><a href="https://lightswind.com/components/3d-model-viewer">3D Model Viewer</a></li>
      <li><a href="https://lightswind.com/components/3d-perspective-card">3D Perspective Card</a></li>
      <li><a href="https://lightswind.com/components/3d-scroll-trigger">3D Scroll Trigger</a></li>
      <li><a href="https://lightswind.com/components/scroll-carousel">Scroll Carousel</a></li>
      <li><a href="https://lightswind.com/components/sparkle-navbar">Sparkle Navbar</a></li>
    </ul>
  </li>
  <li>
    <h3 className="text-xl font-bold mb-2">Cursor</h3>
    <ul className="ml-4 list-disc text-sm text-muted-foreground">
      <li><a href="https://lightswind.com/components/canvas-confetti-cursor">Canvas Confetti Cursor</a></li>
      <li><a href="https://lightswind.com/components/particle-orbit-effect">Particle Orbit Effect</a></li>
      <li><a href="https://lightswind.com/components/smokey-cursor">Smokey Cursor</a></li>
      <li><a href="https://lightswind.com/components/smooth-cursor">Smooth Cursor</a></li>
    </ul>
  </li>
  <li>
    <h3 className="text-xl font-bold mb-2">Components</h3>
    <ul className="ml-4 list-disc text-sm text-muted-foreground">
      <li><a href="https://lightswind.com/components/animated-notification">Animated Notification</a></li>
      <li><a href="https://lightswind.com/components/bento-grid">Bento Grid</a></li>
      <li><a href="https://lightswind.com/components/code-hover-cards">Code Hover Cards</a></li>
      <li><a href="https://lightswind.com/components/count-up">Count Up</a></li>
      <li><a href="https://lightswind.com/components/dock">Dock</a></li>
      <li><a href="https://lightswind.com/components/drag-order-list">Drag Order List</a></li>
      <li><a href="https://lightswind.com/components/dynamic-navigation">Dynamic Navigation</a></li>
      <li><a href="https://lightswind.com/components/glass-folder">Glass Folder</a></li>
      <li><a href="https://lightswind.com/components/globe">Globe</a></li>
      <li><a href="https://lightswind.com/components/glowing-cards">Glowing Cards</a></li>
      <li><a href="https://lightswind.com/components/hamburger-menu-overlay">Hamburger Menu Overlay</a></li>
      <li><a href="https://lightswind.com/components/image-reveal">Image Reveal</a></li>
      <li><a href="https://lightswind.com/components/image-trail-effect">Image Trail Effect</a></li>
      <li><a href="https://lightswind.com/components/interactive-card">Interactive Card</a></li>
      <li><a href="https://lightswind.com/components/interactive-gradient-card">Interactive Gradient Card</a></li>
      <li><a href="https://lightswind.com/components/lens">Lens</a></li>
      <li><a href="https://lightswind.com/components/magic-loader">Magic Loader</a></li>
      <li><a href="https://lightswind.com/components/morphing-navigation">Morphing Navigation</a></li>
      <li><a href="https://lightswind.com/components/orbit-card">Orbit Card</a></li>
      <li><a href="https://lightswind.com/components/password-strength-indicator">Password Strength Indicator</a></li>
      <li><a href="https://lightswind.com/components/scroll-list">Scroll List</a></li>
      <li><a href="https://lightswind.com/components/scroll-stack">Scroll Stack</a></li>
      <li><a href="https://lightswind.com/components/scroll-timeline">Scroll Timeline</a></li>
      <li><a href="https://lightswind.com/components/seasonal-hover-cards">Seasonal Hover Cards</a></li>
      <li><a href="https://lightswind.com/components/sliding-cards">Sliding Cards</a></li>
      <li><a href="https://lightswind.com/components/sliding-logo-marquee">Sliding Logo Marquee</a></li>
      <li><a href="https://lightswind.com/components/stack-list">Stack List</a></li>
      <li><a href="https://lightswind.com/components/team-carousel">Team Carousel</a></li>
      <li><a href="https://lightswind.com/components/terminal-card">Terminal Card</a></li>
      <li><a href="https://lightswind.com/components/top-loader">Top Loader</a></li>
      <li><a href="https://lightswind.com/components/top-sticky-bar">Top Sticky Bar</a></li>
      <li><a href="https://lightswind.com/components/trusted-users">Trusted Users</a></li>
      <li><a href="https://lightswind.com/components/ripple-loader">Ripple Loader</a></li>
      <li><a href="https://lightswind.com/components/woofy-hover-image">Woofy Hover Image</a></li>
    </ul>
  </li>
  <li>
    <h3 className="text-xl font-bold mb-2">Layout</h3>
    <ul className="ml-4 list-disc text-sm text-muted-foreground">
      <li><a href="https://lightswind.com/components/accordion">Accordion</a></li>
      <li><a href="https://lightswind.com/components/aspect-ratio">Aspect Ratio</a></li>
      <li><a href="https://lightswind.com/components/resizable">Resizable</a></li>
      <li><a href="https://lightswind.com/components/scroll-area">Scroll Area</a></li>
      <li><a href="https://lightswind.com/components/separator">Separator</a></li>
      <li><a href="https://lightswind.com/components/tabs">Tabs</a></li>
    </ul>
  </li>
  <li>
    <h3 className="text-xl font-bold mb-2">UI Elements</h3>
    <ul className="ml-4 list-disc text-sm text-muted-foreground">
      <li><a href="https://lightswind.com/components/alert">Alert</a></li>
      <li><a href="https://lightswind.com/components/alert-dialog">Alert Dialog</a></li>
      <li><a href="https://lightswind.com/components/avatar">Avatar</a></li>
      <li><a href="https://lightswind.com/components/badge">Badge</a></li>
      <li><a href="https://lightswind.com/components/button">Button</a></li>
      <li><a href="https://lightswind.com/components/card">Card</a></li>
      <li><a href="https://lightswind.com/components/carousel">Carousel</a></li>
      <li><a href="https://lightswind.com/components/chart">Chart</a></li>
      <li><a href="https://lightswind.com/components/collapsible">Collapsible</a></li>
      <li><a href="https://lightswind.com/components/context-menu">Context Menu</a></li>
      <li><a href="https://lightswind.com/components/dialog">Dialog</a></li>
      <li><a href="https://lightswind.com/components/drawer">Drawer</a></li>
      <li><a href="https://lightswind.com/components/dropdown-menu">Dropdown Menu</a></li>
      <li><a href="https://lightswind.com/components/hover-card">Hover Card</a></li>
      <li><a href="https://lightswind.com/components/popover">Popover</a></li>
      <li><a href="https://lightswind.com/components/progress">Progress</a></li>
      <li><a href="https://lightswind.com/components/sheet">Sheet</a></li>
      <li><a href="https://lightswind.com/components/skeleton">Skeleton</a></li>
      <li><a href="https://lightswind.com/components/table">Table</a></li>
      <li><a href="https://lightswind.com/components/toast">Toast</a></li>
      <li><a href="https://lightswind.com/components/tooltip">Tooltip</a></li>
    </ul>
  </li>
  <li>
    <h3 className="text-xl font-bold mb-2">Form Controls</h3>
    <ul className="ml-4 list-disc text-sm text-muted-foreground">
      <li><a href="https://lightswind.com/components/calendar">Calendar</a></li>
      <li><a href="https://lightswind.com/components/checkbox">Checkbox</a></li>
      <li><a href="https://lightswind.com/components/command">Command</a></li>
      <li><a href="https://lightswind.com/components/form">Form</a></li>
      <li><a href="https://lightswind.com/components/input">Input</a></li>
      <li><a href="https://lightswind.com/components/input-otp">Input OTP</a></li>
      <li><a href="https://lightswind.com/components/label">Label</a></li>
      <li><a href="https://lightswind.com/components/radio-group">Radio Group</a></li>
      <li><a href="https://lightswind.com/components/select">Select</a></li>
      <li><a href="https://lightswind.com/components/slider">Slider</a></li>
      <li><a href="https://lightswind.com/components/switch">Switch</a></li>
      <li><a href="https://lightswind.com/components/textarea">Textarea</a></li>
      <li><a href="https://lightswind.com/components/toggle">Toggle</a></li>
      <li><a href="https://lightswind.com/components/toggle-group">Toggle Group</a></li>
    </ul>
  </li>
  <li>
    <h3 className="text-xl font-bold mb-2">Navigation</h3>
    <ul className="ml-4 list-disc text-sm text-muted-foreground">
      <li><a href="https://lightswind.com/components/breadcrumb">Breadcrumb</a></li>
      <li><a href="https://lightswind.com/components/command">Command</a></li>
      <li><a href="https://lightswind.com/components/menubar">Menubar</a></li>
      <li><a href="https://lightswind.com/components/navigation-menu">Navigation Menu</a></li>
      <li><a href="https://lightswind.com/components/pagination">Pagination</a></li>
      <li><a href="https://lightswind.com/components/sidebar">Sidebar</a></li>
    </ul>
  </li>
</ul>



## 🌈 Theming System

Lightswind UI uses CSS variables for theming, making it easy to customize:

```css
:root {
  --primary: 240 5% 10%;
  --primary-foreground: 0 0% 98%;
  
  /* Add your custom theme colors */
  --brand-purple: 267 100% 58%;
  --brand-blue: 214 100% 60%;
}

.dark {
  --primary: 0 0% 98%;
  --primary-foreground: 240 5% 10%;
}
```


## 📖 Documentation

For comprehensive documentation including all components, props, and examples:

[**View Documentation**](https://lightswind.com/components/introduction)


## 🤝 Contributing

We welcome contributions to Lightswind UI! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📋 Changelog

### Version 3.0.0 (July 2025)
- 🎉 Initial stable release with 40+ production-ready components
-  Basic to Advanced props for each components.
-  Dark mode support finalized
-  WCAG 2.1 AA compliance across all components
-  Responsive design for all screen sizes
-  Theme customization system
-  Performance optimizations
-  Well-documented for each component

### Version 3.0.3 (July 2025)
- 🎉 Added 10+ Animated Components
-  Rectified the old components bugs

### Version 3.0.6 (July 2025)
- 🎉 Added 5+ Animated Components
-  Rectified the old components bugs

### Version 3.0.9 (July 2025)
- 🎉 Added 3+ Animated background
-  Rectified the old components bugs
Update the installation setup and inplemented cli.


## 📄 License

Lightswind UI is licensed under the [MIT License](https://github.com/codewithMUHILAN/Lightswind-UI-Library/blob/main/README.md).

---

<div align="center">
  <p>
    <sub>Designed and built with ❤️ by the MuhilanOrg</sub>
  </p>
  <p>
<a href="https://instagram.com/codewith_muhilan/" target="_blank">
  <img src="https://img.shields.io/badge/Follow-@codewith_muhilan-blue?style=social&logo=instagram" alt="Instagram Follow" />
</a>
  </p>
</div>
</body>
</html>
