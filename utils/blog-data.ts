export interface BlogPost {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  tags: string[];
  author: {
    name: string;
    avatar: string;
  };
}

export const blogPosts: BlogPost[] = [
  {
    id: "lightwind-intro",
    title: "Introducing Lightwind UI: Build Fast, Beautiful Interfaces",
    subtitle: "Discover how Lightwind UI can speed up your development with elegant components and utilities.",
    // Use backticks for multi-line content
    content: `Welcome to **Lightwind UI**, a modern UI library built on top of Tailwind CSS that helps you build responsive, accessible, and beautiful websites faster.

## ✨ What is Lightwind UI?
Lightwind UI is a component-driven design system tailored for developers and designers who love minimalism and flexibility. It provides prebuilt components, utilities, and layout templates you can drop into your Tailwind projects instantly.

## 🚀 Features
- Fully responsive and mobile-first components
- Easy to customize using Tailwind classes
- Accessibility-friendly by default
- Works seamlessly with Next.js, React, Vue, and other frameworks
- Built for performance and minimal load time

## 📦 Installation
Install via npm:
\`\`\`bash
npm install lightwind-ui
\`\`\`

Or use CDN:
\`\`\`html
<link href="https://cdn.lightwindui.dev/lightwind.css" rel="stylesheet">
\`\`\`

## 📚 Documentation
Explore components like:
- Navigation, Cards, Modals, Alerts, Hero sections
- Forms, Buttons, Avatars, Accordions, and more

Visit our full documentation at [https://lightwindui.dev](https://lightwindui.dev)

## 🧠 Who is it for?
- Indie hackers building MVPs
- Designers prototyping quickly
- Developers who want scalable and elegant UIs

Lightwind UI brings speed, beauty, and simplicity into one library.`,
    category: "Product",
    date: "July 25, 2025",
    readTime: "4 min read",
    image: "/images/blog/lightwind-intro.png",
    tags: ["tailwind", "ui", "react", "design system"],
    author: {
      name: "Muhilan J.",
      avatar: "/images/authors/muhilan.png"
    }
  },
  {
    id: "lightwind-themes",
    title: "Creating Stunning Themes with Lightwind UI",
    subtitle: "Learn how to build beautiful themes quickly using Lightwind's pre-configured color palette system.",
    // Use backticks for multi-line content
    content: `Lightwind UI supports theme-based development, allowing you to define light/dark themes and apply them with ease.

## 🎨 Theme Customization
Update your Tailwind config:
\`\`\`js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#4f46e5',
        secondary: '#6366f1'
      }
    }
  }
}
\`\`\`

Apply theme classes dynamically and watch your entire UI change accordingly.

## 🌗 Dark Mode Support
Use Tailwind's built-in dark mode along with Lightwind components:
\`\`\`html
<body class="dark:bg-gray-900 dark:text-white">
\`\`\`

Enjoy seamless switching between themes with beautiful transitions.

## ✨ Pro Tip
Try combining CSS variables with Lightwind UI for advanced theming use cases!`,
    category: "Design",
    date: "July 18, 2025",
    readTime: "5 min read",
    image: "/images/blog/lightwind-themes.png",
    tags: ["themes", "dark-mode", "tailwind", "ui"],
    author: {
      name: "Muhilan J.",
      avatar: "/images/authors/muhilan.png"
    }
  },
  {
    id: "lightwind-react",
    title: "Integrating Lightwind UI with React Projects",
    subtitle: "Step-by-step guide to using Lightwind UI in your React apps for faster UI development.",
    // Use backticks for multi-line content
    content: `React and Lightwind UI are a perfect match for building scalable UIs quickly.

## 🔧 Setup Instructions
1. Install Tailwind and Lightwind UI:
\`\`\`bash
npm install tailwindcss lightwind-ui
\`\`\`

2. Import styles in your root file:
\`\`\`js
import 'lightwind-ui/dist/lightwind.css';
\`\`\`

3. Use Lightwind components:
\`\`\`jsx
import { Button } from 'lightwind-ui';

<Button className="bg-primary text-white">Click Me</Button>
\`\`\`

Enjoy productivity and consistent design across your React project!`,
    category: "Development",
    date: "July 10, 2025",
    readTime: "3 min read",
    image: "/images/blog/lightwind-react.png",
    tags: ["react", "tailwind", "components", "integration"],
    author: {
      name: "Muhilan J.",
      avatar: "/images/authors/muhilan.png"
    }
  }
];
