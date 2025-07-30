<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
    <div align="center">
  <img src="https://codewithmuhilan.com/Extra-Assets/lightwind-logo.png" alt="Lightswind UI Logo" width="180" />
  
  <h1 align="center">Lightswind UI 3.0.0</h1>
  
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
      <li>Installation Guide</li>
      <li>Quick Start</li>
      <li>Folder Structure</li>
    </ul>
  </li>

  <li>
    <h3 className="text-xl font-bold mb-2">Background</h3>
    <ul className="ml-4 list-disc text-sm text-muted-foreground">
      <li>Aurora Background</li>
      <li>Animated Gradient</li>
      <li>Parallax Scroll</li>
    </ul>
  </li>

  <li>
    <h3 className="text-xl font-bold mb-2">Text</h3>
    <ul className="ml-4 list-disc text-sm text-muted-foreground">
      <li>Typewriter Effect</li>
      <li>Glitch Text</li>
      <li>3D Text Flip</li>
    </ul>
  </li>

  <li>
    <h3 className="text-xl font-bold mb-2">Button</h3>
    <ul className="ml-4 list-disc text-sm text-muted-foreground">
      <li>Hover Button</li>
      <li>Magnetic Button</li>
      <li>Slide Reveal Button</li>
    </ul>
  </li>

  <li>
    <h3 className="text-xl font-bold mb-2">3D Elements</h3>
    <ul className="ml-4 list-disc text-sm text-muted-foreground">
      <li>3D Hover Card</li>
      <li>Image Ring</li>
      <li>Perspective Scroll</li>
    </ul>
  </li>

  <li>
    <h3 className="text-xl font-bold mb-2">Cursor</h3>
    <ul className="ml-4 list-disc text-sm text-muted-foreground">
      <li>Blob Cursor</li>
      <li>Interactive Cursor</li>
      <li>Cursor Trail</li>
    </ul>
  </li>

  <li>
    <h3 className="text-xl font-bold mb-2">Components</h3>
    <ul className="ml-4 list-disc text-sm text-muted-foreground">
      <li>Animated Card</li>
      <li>Reveal Box</li>
      <li>Hover Overlay</li>
    </ul>
  </li>

  <li>
    <h3 className="text-xl font-bold mb-2">Layout</h3>
    <ul className="ml-4 list-disc text-sm text-muted-foreground">
      <li>Sticky Sections</li>
      <li>Grid Layout</li>
      <li>Flex Panels</li>
    </ul>
  </li>

  <li>
    <h3 className="text-xl font-bold mb-2">UI Elements</h3>
    <ul className="ml-4 list-disc text-sm text-muted-foreground">
      <li>Accordion</li>
      <li>Tabs</li>
      <li>Modal</li>
    </ul>
  </li>

  <li>
    <h3 className="text-xl font-bold mb-2">Form Controls</h3>
    <ul className="ml-4 list-disc text-sm text-muted-foreground">
      <li>Animated Input</li>
      <li>Custom Checkbox</li>
      <li>Form Wizard</li>
    </ul>
  </li>

  <li>
    <h3 className="text-xl font-bold mb-2">Navigation</h3>
    <ul className="ml-4 list-disc text-sm text-muted-foreground">
      <li>Sticky Header</li>
      <li>Sidebar Menu</li>
      <li>Mobile Drawer</li>
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