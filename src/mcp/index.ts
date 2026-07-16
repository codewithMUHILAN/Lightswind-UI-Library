#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import Fuse from "fuse.js";
import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import * as os from "os";

// ─── Types ─────────────────────────────────────────────────────────────────

interface LightswindComponent {
  id: string;
  title: string;
  description: string;
  keywords: string[];
  htmlcode: string;
  reactcode: string;
  paid?: boolean | string;
  hidden?: string;
  displayOrder?: string | number;
}

import blocksData from "./blocks.json";

interface LightswindBlock {
  id: string;
  title: string;
  description: string;
  category: string;
  previewUrl?: string;
  blockPageUrl?: string;
}

// ─── Data Fetching ──────────────────────────────────────────────────────────

const REGISTRY_API = "https://lightswind.com/api/registry";
const BLOCKS_METADATA_API = "https://pro.lightswind.com/api/mcp/blocks";

let componentsCache: LightswindComponent[] | null = null;
let blocksCache: LightswindBlock[] | null = null;
let componentsFuse: Fuse<LightswindComponent> | null = null;

function getApiKey(): string | null {
  if (process.env.LIGHTSWIND_API_KEY) {
    return process.env.LIGHTSWIND_API_KEY;
  }
  try {
    const home = os.homedir();
    const rcPath = path.join(home, ".lightswindrc");
    if (fs.existsSync(rcPath)) {
      const raw = JSON.parse(fs.readFileSync(rcPath, "utf-8"));
      if (raw.apiKey && /^sk_(pro|live)_[a-z0-9]+$/i.test(raw.apiKey)) {
        return raw.apiKey;
      }
    }
  } catch (e) {
    // Ignore errors
  }
  return null;
}

async function fetchJSON(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(e); }
      });
    }).on("error", reject);
  });
}

async function fetchSecureBlock(blockId: string, apiKey: string | null): Promise<any> {
  const url = `https://pro.lightswind.com/api/v1/secure-block?id=${blockId}`;
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      port: 443,
      path: parsedUrl.pathname + parsedUrl.search,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(apiKey ? { "x-api-key": apiKey } : {})
      }
    };
    https.get(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on("error", reject);
  });
}

async function fetchSecureComponent(componentName: string, apiKey: string | null): Promise<any> {
  const url = `https://pro.lightswind.com/api/v1/components?name=${componentName}`;
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      port: 443,
      path: parsedUrl.pathname + parsedUrl.search,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(apiKey ? { "x-api-key": apiKey } : {})
      }
    };
    https.get(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on("error", reject);
  });
}

async function getComponents(): Promise<LightswindComponent[]> {
  if (componentsCache) return componentsCache;
  try {
    const res = await fetchJSON(REGISTRY_API);
    const items = Array.isArray(res) ? res : res.items ?? [];
    
    // Map Shadcn registry format to LightswindComponent format
    componentsCache = items.map((item: any) => {
      const code = item.files?.[0]?.content ?? "";
      return {
        id: item.name,
        title: item.title || item.name,
        description: item.description || "",
        keywords: item.meta?.category ? [item.meta.category] : ["general"],
        htmlcode: "",
        reactcode: code,
        paid: item.type === "lightswind:pro" || item.type?.includes("pro"),
        hidden: "false"
      };
    });
  } catch (err) {
    console.error("Error fetching registry:", err);
    componentsCache = [];
  }
  // Build fuse index
  componentsFuse = new Fuse(componentsCache!, {
    keys: ["title", "description", "keywords"],
    threshold: 0.4,
    includeScore: true,
  });
  return componentsCache!;
}

async function getBlocks(): Promise<LightswindBlock[]> {
  if (blocksCache) return blocksCache;
  try {
    const res = await fetchJSON(BLOCKS_METADATA_API);
    const items = Array.isArray(res) ? res : res.data ?? [];
    if (items.length > 0) {
      blocksCache = items.map((b: any) => {
        let preview = b.previewUrl || "";
        if (preview.startsWith("/")) {
          preview = `https://pro.lightswind.com${preview}`;
        }
        let pageUrl = b.blockPageUrl || "";
        if (pageUrl.startsWith("/")) {
          pageUrl = `https://pro.lightswind.com${pageUrl}`;
        }
        return {
          id: b.id,
          title: b.title,
          description: b.description || "",
          category: b.category || "general",
          previewUrl: preview,
          blockPageUrl: pageUrl
        };
      });
      return blocksCache!;
    }
  } catch (err) {
    // Silently fall back to local bundled data
  }

  try {
    blocksCache = blocksData.map((b: any) => {
      let preview = b.previewUrl || "";
      if (preview.startsWith("/")) {
        preview = `https://pro.lightswind.com${preview}`;
      }
      const category = Array.isArray(b.category) ? b.category[0] : b.category || "general";
      const pageUrl = `https://pro.lightswind.com/blocks/${category}/${b.id}`;
      return {
        id: b.id,
        title: b.title,
        description: b.description || "",
        category: category,
        previewUrl: preview,
        blockPageUrl: pageUrl
      };
    });
  } catch (err) {
    console.error("Error loading local blocks:", err);
    blocksCache = [];
  }
  return blocksCache!;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function sanitizeComponent(c: LightswindComponent) {
  return {
    id: c.id,
    title: c.title,
    description: c.description,
    keywords: c.keywords,
    category: c.keywords?.[0] ?? "general",
    isPro: c.paid === true || c.paid === "true",
    htmlCode: c.htmlcode ?? "",
    reactCode: c.reactcode ?? "",
    usage: `/* Install: npm install lightswind */
/* Import CSS in your app: import 'lightswind/styles.css'; */

${c.reactcode ?? "// No React code available"}`,
  };
}

function uniqueCategories(components: LightswindComponent[]) {
  const cats = new Set<string>();
  components.forEach((c) => c.keywords?.forEach((k) => cats.add(k)));
  return Array.from(cats).sort();
}

// ─── Tool Definitions ─────────────────────────────────────────────────────

const TOOLS: Tool[] = [
  {
    name: "list_all_components",
    description:
      "List all available Lightswind UI components with their titles, categories, and IDs. Use this to browse the full catalog before picking a component.",
    inputSchema: {
      type: "object",
      properties: {
        category: {
          type: "string",
          description:
            "Optional: filter by category (e.g. 'buttons', 'cards', 'navbars', 'tabs', 'loaders', 'marquees', 'sidebars', 'alerts', 'breadcrumbs', 'dropdowns'). Leave empty for all.",
        },
        limit: {
          type: "number",
          description: "Max results to return (default 50)",
        },
      },
    },
  },
  {
    name: "get_component",
    description:
      "Get the full code (HTML + React/JSX) for a specific Lightswind component by name or ID. Returns ready-to-use code that works with Lightswind + Tailwind CSS.",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description:
            "Component name or ID (e.g. 'Primary Button', 'Glassmorphism Sidebar', or the component ID string)",
        },
        format: {
          type: "string",
          enum: ["react", "html", "both"],
          description: "Code format to return (default: 'react')",
        },
      },
      required: ["name"],
    },
  },
  {
    name: "search_components",
    description:
      "Fuzzy-search Lightswind components by natural language query. Use this when the user asks for something like 'a glowing button', 'animated card with hover', or 'dark sidebar navigation'.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Natural language search query",
        },
        limit: {
          type: "number",
          description: "Max results (default 5)",
        },
        react_only: {
          type: "boolean",
          description: "If true, only return components that have React code",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "list_categories",
    description:
      "List all available Lightswind component categories (e.g. buttons, cards, navbars, etc.)",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "get_block",
    description:
      "Get a Lightswind Pro template block by name or ID. Blocks are full page sections like Hero, Pricing, FAQ, Team, etc.",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Block name or category (e.g. 'hero', 'pricing', 'features', 'team')",
        },
      },
      required: ["name"],
    },
  },
  {
    name: "list_blocks",
    description:
      "List all available Lightswind Pro template blocks (full page sections ready to use).",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "get_installation_guide",
    description:
      "Get the installation and setup guide for Lightswind UI in a React/Next.js project.",
    inputSchema: {
      type: "object",
      properties: {
        framework: {
          type: "string",
          enum: ["nextjs", "react", "vite"],
          description: "Target framework (default: nextjs)",
        },
      },
    },
  },
  {
    name: "get_usage_example",
    description:
      "Get a complete usage example combining multiple Lightswind components to build a real UI section (e.g. a full landing hero, dashboard, etc.).",
    inputSchema: {
      type: "object",
      properties: {
        section: {
          type: "string",
          description:
            "The UI section you want to build (e.g. 'hero section', 'pricing table', 'dashboard sidebar', 'navigation header')",
        },
      },
      required: ["section"],
    },
  },
];

// ─── Tool Handlers ────────────────────────────────────────────────────────

async function handleListAllComponents(args: Record<string, unknown>) {
  const components = await getComponents();
  const category = (args.category as string | undefined)?.toLowerCase();
  const limit = (args.limit as number) ?? 50;

  let filtered = components.filter((c) => c.hidden !== "true");
  if (category) {
    filtered = filtered.filter((c) =>
      c.keywords?.some((k) => k.toLowerCase().includes(category))
    );
  }
  filtered = filtered.slice(0, limit);

  const result = filtered.map((c) => ({
    id: c.id,
    title: c.title,
    category: c.keywords?.[0] ?? "general",
    description: c.description?.slice(0, 120) + "...",
    isPro: c.paid === true || c.paid === "true",
  }));

  return {
    content: [
      {
        type: "text",
        text: `## Lightswind UI Components (${result.length} found)\n\n` +
          result.map((c) =>
            `### ${c.title}${c.isPro ? " [PRO]" : ""}
- **ID**: \`${c.id}\`  
- **Category**: ${c.category}  
- **Description**: ${c.description}  
- **Get code**: Use \`get_component\` tool with name="${c.title}"`
          ).join("\n\n"),
      },
    ],
  };
}

async function handleGetComponent(args: Record<string, unknown>) {
  const components = await getComponents();
  const name = (args.name as string).toLowerCase();
  const format = (args.format as string) ?? "react";

  // Try exact ID match first
  let found = components.find((c) => c.id === args.name);

  // Then try title match
  if (!found) {
    found = components.find((c) => c.title.toLowerCase() === name);
  }

  // Then fuzzy
  if (!found && componentsFuse) {
    const results = componentsFuse.search(name);
    if (results.length > 0) found = results[0].item;
  }

  if (!found) {
    return {
      content: [
        {
          type: "text",
          text: `❌ Component not found: "${args.name}". Try \`search_components\` or \`list_all_components\` to browse available components.`,
        },
      ],
    };
  }

  const isPro = found.paid === true || found.paid === "true" || found.paid === "pro" || found.paid === "lightswind:pro";
  let reactCode = found.reactcode ?? "";
  let htmlCode = found.htmlcode ?? "";
  let dependencies: string[] = [];
  let internalDependencies: string[] = [];

  if (isPro) {
    const apiKey = getApiKey();
    try {
      const res = await fetchSecureComponent(found.id, apiKey);
      if (res.success && res.component && res.component.code) {
        reactCode = res.component.code;
        dependencies = res.component.dependencies || [];
        internalDependencies = res.component.internalDependencies || [];
      } else {
        const errorMsg = res.error || "Requires a Lightswind Pro subscription.";
        return {
          content: [
            {
              type: "text",
              text: `## 🔒 Pro Component: ${found.title} (\`${found.id}\`)\n` +
                `- **Category**: ${found.keywords?.[0] ?? "general"}\n` +
                `- **Details Page**: https://pro.lightswind.com/components/${found.id}\n\n` +
                `> **Access Restricted**: ${errorMsg}\n\n` +
                `### How to unlock:\n` +
                `1. **Upgrade to Pro**: Go to https://lightswind.com/pricing and buy a Lightswind Pro plan to get your license key.\n` +
                `2. **Authenticate**: In your project terminal, log in using your license key:\n` +
                `   \`npx lightswind auth login --key=YOUR_KEY\`\n` +
                `3. **Install**: Run \`npx lightswind add ${found.id}\` or query it again in Cursor!`,
            },
          ],
        };
      }
    } catch (e: any) {
      return {
        content: [
          {
            type: "text",
            text: `## 🔒 Pro Component: ${found.title} (\`${found.id}\`)\n` +
              `- **Category**: ${found.keywords?.[0] ?? "general"}\n` +
              `- **Details Page**: https://pro.lightswind.com/components/${found.id}\n\n` +
              `> **Connection Error**: Failed to retrieve component code securely from server (${e.message}).\n\n` +
              `### How to unlock:\n` +
              `1. **Upgrade to Pro**: Verify you have an active Pro subscription at https://lightswind.com/pricing.\n` +
              `2. **Authenticate**: Log in using your license key in your terminal:\n` +
              `   \`npx lightswind auth login --key=YOUR_KEY\`\n` +
              `3. **Install**: Run \`npx lightswind add ${found.id}\` or query it again in Cursor!`,
          },
        ],
      };
    }
  }

  const c = {
    ...found,
    reactcode: reactCode,
    htmlcode: htmlCode
  };

  const sanitized = sanitizeComponent(c);
  let codeSection = "";

  if (format === "html" || format === "both") {
    codeSection += `\n### HTML Code\n\`\`\`html\n${sanitized.htmlCode}\n\`\`\`\n`;
  }
  if (format === "react" || format === "both") {
    codeSection += `\n### React/JSX Code\n\`\`\`jsx\n${sanitized.reactCode}\n\`\`\`\n`;
  }

  let detailsText = `# ${sanitized.title}${isPro ? " [PRO]" : ""}\n\n` +
    `**Category**: ${sanitized.category}  \n` +
    `**ID**: \`${sanitized.id}\`  \n` +
    `**Description**: ${sanitized.description}\n`;

  if (isPro) {
    detailsText += `\n- **Dependencies**: ${dependencies.join(", ") || "None"}\n` +
      `- **Internal Components**: ${internalDependencies.join(", ") || "None"}\n`;
  }

  detailsText += `\n## Setup
\`\`\`bash
npm install lightswind
\`\`\`

Add to your \`tailwind.config.ts\`:
\`\`\`js
import lightswindPlugin from 'lightswind/plugin';
// Add to plugins: [lightswindPlugin]
\`\`\`

Import CSS in your root layout:
\`\`\`js
import 'lightswind/styles.css';
\`\`\`
${codeSection}
> 💡 **Tip**: This component uses Lightswind's custom classes (e.g. \`bg-primarylw\`, \`text-darklw\`). Make sure the Lightswind plugin is active in your Tailwind config.`;

  return {
    content: [
      {
        type: "text",
        text: detailsText,
      },
    ],
  };
}

async function handleSearchComponents(args: Record<string, unknown>) {
  await getComponents(); // ensures fuse is built
  const query = args.query as string;
  const limit = (args.limit as number) ?? 5;
  const reactOnly = (args.react_only as boolean) ?? false;

  if (!componentsFuse) {
    return { content: [{ type: "text", text: "Components not loaded yet." }] };
  }

  let results = componentsFuse.search(query).slice(0, limit * 2);
  if (reactOnly) {
    results = results.filter((r) => r.item.reactcode?.trim().length > 0);
  }
  results = results.slice(0, limit);

  if (results.length === 0) {
    return {
      content: [
        {
          type: "text",
          text: `No components found for "${query}". Try \`list_categories\` to see what's available.`,
        },
      ],
    };
  }

  return {
    content: [
      {
        type: "text",
        text: `## Search Results for "${query}"\n\n` +
          results.map(({ item: c, score }) =>
            `### ${c.title} (match: ${Math.round((1 - (score ?? 0)) * 100)}%)
- **ID**: \`${c.id}\`
- **Category**: ${c.keywords?.[0] ?? "general"}
- **Description**: ${c.description?.slice(0, 150)}...
- **Get code**: \`get_component\` with name="${c.title}"`
          ).join("\n\n"),
      },
    ],
  };
}

async function handleListCategories() {
  const components = await getComponents();
  const cats = uniqueCategories(components);
  return {
    content: [
      {
        type: "text",
        text: `## Lightswind UI Component Categories\n\n${cats.map((c) => `- **${c}**`).join("\n")}\n\n> Use \`list_all_components\` with \`category\` param to see components in each category.`,
      },
    ],
  };
}

async function handleGetBlock(args: Record<string, unknown>) {
  const blocks = await getBlocks();
  const name = (args.name as string).toLowerCase().trim();
  
  // Try to find matching blocks
  const found = blocks.filter(
    (b) =>
      b.id.toLowerCase() === name ||
      b.title?.toLowerCase() === name ||
      b.title?.toLowerCase().includes(name) ||
      b.category?.toLowerCase().includes(name)
  );

  if (found.length === 0) {
    return {
      content: [
        {
          type: "text",
          text: `No Pro blocks found matching "${args.name}". Use \`list_blocks\` to see all available templates.`,
        },
      ],
    };
  }

  // If there's an exact ID match or a single match, try to retrieve the secure block code
  const exactMatch = found.find(b => b.id.toLowerCase() === name) || (found.length === 1 ? found[0] : null);
  
  if (exactMatch) {
    const apiKey = getApiKey();
    try {
      const res = await fetchSecureBlock(exactMatch.id, apiKey);
      if (res.success && res.block && res.block.code) {
        const blockInfo = res.block;
        return {
          content: [
            {
              type: "text",
              text: `## Lightswind Pro Block: ${exactMatch.title} (\`${exactMatch.id}\`)\n` +
                `- **Category**: ${exactMatch.category}\n` +
                `- **Dependencies**: ${blockInfo.dependencies?.join(", ") || "None"}\n` +
                `- **Internal Components**: ${blockInfo.internalDependencies?.join(", ") || "None"}\n\n` +
                `### Source Code (\`${exactMatch.id}.tsx\`):\n` +
                `\`\`\`tsx\n${blockInfo.code}\n\`\`\`\n\n` +
                `> To install this block via CLI, run:\n` +
                `> \`npx lightswind add-block ${exactMatch.id}\``,
            },
          ],
        };
      } else {
        const errorMsg = res.error || "Requires a Lightswind Pro subscription.";
        return {
          content: [
            {
              type: "text",
              text: `## 🔒 Pro Block: ${exactMatch.title} (\`${exactMatch.id}\`)\n` +
                `- **Category**: ${exactMatch.category}\n` +
                `- **Details Page**: ${exactMatch.blockPageUrl || "https://pro.lightswind.com/blocks"}\n` +
                `- **Live Preview**: ${exactMatch.previewUrl || "https://pro.lightswind.com/blocks"}\n\n` +
                `> **Access Restricted**: ${errorMsg}\n\n` +
                `### How to unlock:\n` +
                `1. **Upgrade to Pro**: Go to https://lightswind.com/pricing and buy a Lightswind Pro plan to get your license key.\n` +
                `2. **Authenticate**: In your project terminal, log in using your license key:\n` +
                `   \`npx lightswind auth login --key=YOUR_KEY\`\n` +
                `3. **Install**: Run \`npx lightswind add-block ${exactMatch.id}\` or query it again in Cursor!`,
            },
          ],
        };
      }
    } catch (e: any) {
      return {
        content: [
          {
            type: "text",
            text: `## 🔒 Pro Block: ${exactMatch.title} (\`${exactMatch.id}\`)\n` +
              `- **Category**: ${exactMatch.category}\n` +
              `- **Details Page**: ${exactMatch.blockPageUrl || "https://pro.lightswind.com/blocks"}\n` +
              `- **Live Preview**: ${exactMatch.previewUrl || "https://pro.lightswind.com/blocks"}\n\n` +
              `> **Connection Error**: Failed to retrieve block code securely from server (${e.message}).\n\n` +
              `### How to unlock:\n` +
              `1. **Upgrade to Pro**: Verify you have an active Pro subscription at https://lightswind.com/pricing.\n` +
              `2. **Authenticate**: Log in using your license key in your terminal:\n` +
              `   \`npx lightswind auth login --key=YOUR_KEY\`\n` +
              `3. **Install**: Run \`npx lightswind add-block ${exactMatch.id}\` or query it again in Cursor!`,
          },
        ],
      };
    }
  }

  // Otherwise, list matching options
  return {
    content: [
      {
        type: "text",
        text: `## Multiple Blocks Found for "${args.name}":\n\n` +
          found
            .slice(0, 10)
            .map(
              (b) =>
                `### ${b.title} (\`${b.id}\`)\n- **Category**: ${b.category}\n- **Details Page**: ${b.blockPageUrl || "https://pro.lightswind.com/blocks"}\n- **Live Preview**: ${b.previewUrl ?? "https://pro.lightswind.com/blocks"}`
            )
            .join("\n\n") +
          `\n\n> To get the code for a specific block, query its ID directly (e.g. \`get block ${found[0].id}\`).`,
      },
    ],
  };
}

async function handleListBlocks() {
  const blocks = await getBlocks();
  const cats = [...new Set(blocks.map((b) => b.category))].sort();
  return {
    content: [
      {
        type: "text",
        text: `## Lightswind Pro Template Blocks (${blocks.length} total)\n\n**Categories:**\n${cats.map((c) => `- ${c}`).join("\n")}\n\n> Access at https://pro.lightswind.com/blocks — requires Pro subscription.\n\nUse \`get_block\` with a category name for details.`,
      },
    ],
  };
}

function handleGetInstallationGuide(args: Record<string, unknown>) {
  const framework = (args.framework as string) ?? "nextjs";

  const guides: Record<string, string> = {
    nextjs: `# Lightswind UI — Next.js Installation

## 1. Install
\`\`\`bash
npm install lightswind
\`\`\`

## 2. Configure Tailwind (\`tailwind.config.ts\`)
\`\`\`ts
import type { Config } from "tailwindcss";
import lightswindPlugin from "lightswind/plugin";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  plugins: [lightswindPlugin],
};
export default config;
\`\`\`

## 3. Import CSS (\`app/layout.tsx\`)
\`\`\`tsx
import "lightswind/styles.css";
\`\`\`

## 4. Use a component
\`\`\`tsx
// Example: Primary Button
export default function Page() {
  return (
    <a href="#" className="font-bold bg-primarylw text-white hover:bg-primarylw-2 p-4 px-12 rounded-full">
      Get Started
    </a>
  );
}
\`\`\`

## Key Lightswind CSS Classes
| Class | Description |
|-------|-------------|
| \`bg-primarylw\` | Primary brand color background |
| \`bg-primarylw-2\` | Primary hover color |
| \`bg-darklw\` | Dark variant background |
| \`text-primarylw\` | Primary text color |
| \`font-primarylw\` | Lightswind brand font |

## Resources
- Components: https://lightswind.com
- Pro Blocks: https://pro.lightswind.com
- Docs: https://lightswind.com/docs`,

    react: `# Lightswind UI — React (Vite/CRA) Installation

## 1. Install
\`\`\`bash
npm install lightswind
\`\`\`

## 2. Configure Tailwind (\`tailwind.config.js\`)
\`\`\`js
const lightswindPlugin = require("lightswind/plugin");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  plugins: [lightswindPlugin],
};
\`\`\`

## 3. Import CSS (\`main.tsx\` or \`index.tsx\`)
\`\`\`tsx
import "lightswind/styles.css";
\`\`\`

## Resources
- Components: https://lightswind.com
- Pro Blocks: https://pro.lightswind.com`,

    vite: `# Lightswind UI — Vite Installation

## 1. Install
\`\`\`bash
npm install lightswind
\`\`\`

## 2. Configure (\`tailwind.config.ts\`)
\`\`\`ts
import lightswindPlugin from "lightswind/plugin";
export default { plugins: [lightswindPlugin] };
\`\`\`

## 3. Import CSS (\`main.tsx\`)
\`\`\`tsx
import "lightswind/styles.css";
\`\`\``,
  };

  return {
    content: [{ type: "text", text: guides[framework] ?? guides.nextjs }],
  };
}

function handleGetUsageExample(args: Record<string, unknown>) {
  const section = (args.section as string).toLowerCase();

  let example = "";

  if (section.includes("hero")) {
    example = `# Hero Section with Lightswind UI

\`\`\`tsx
import "lightswind/styles.css";

export default function HeroSection() {
  return (
    <section className="min-h-screen bg-black flex flex-col items-center justify-center text-center px-6 font-primarylw">
      {/* Badge */}
      <span className="mb-4 px-4 py-1 rounded-full border border-primarylw text-primarylw text-sm font-medium">
        ✨ New — Lightswind Pro is here
      </span>

      {/* Headline */}
      <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6">
        Build faster with{" "}
        <span className="text-primarylw">Lightswind UI</span>
      </h1>

      {/* Sub */}
      <p className="text-gray-400 text-lg max-w-2xl mb-10">
        150+ beautifully crafted React components and Pro blocks. Copy, paste, ship.
      </p>

      {/* CTA buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <a href="/components" className="font-bold bg-primarylw text-white hover:bg-primarylw-2 py-4 px-12 rounded-full cursor-pointer transition-all">
          Browse Components
        </a>
        <a href="/docs" className="font-bold border border-gray-600 text-white hover:border-primarylw py-4 px-12 rounded-full cursor-pointer transition-all">
          Read Docs
        </a>
      </div>
    </section>
  );
}
\`\`\``;
  } else if (section.includes("dashboard") || section.includes("sidebar")) {
    example = `# Dashboard Layout with Lightswind Sidebar

\`\`\`tsx
import "lightswind/styles.css";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-black font-primarylw">
      {/* Glassmorphism Sidebar */}
      <aside className="w-52 h-screen bg-gray-500/10 backdrop-blur-md border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="px-4 py-6">
          <h2 className="text-primarylw font-bold text-lg">Lightswind</h2>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {["Dashboard", "Components", "Blocks", "Settings"].map((item) => (
            <a key={item} href="#" className="flex items-center gap-3 p-2 rounded-lg hover:bg-white hover:shadow-md dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium transition-all">
              {item}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
\`\`\``;
  } else {
    example = `# ${section} — Lightswind UI Example

Use \`search_components\` with query="${section}" to find the best matching components.

Then use \`get_component\` to get the full React code.

\`\`\`bash
# Quick setup
npm install lightswind
\`\`\`

Visit https://pro.lightswind.com for Pro template blocks matching "${section}".`;
  }

  return { content: [{ type: "text", text: example }] };
}

// ─── Server Setup ─────────────────────────────────────────────────────────

const server = new Server(
  { name: "lightswind-ui-mcp", version: "1.1.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;
  try {
    switch (name) {
      case "list_all_components":  return await handleListAllComponents(args);
      case "get_component":        return await handleGetComponent(args);
      case "search_components":    return await handleSearchComponents(args);
      case "list_categories":      return await handleListCategories();
      case "get_block":            return await handleGetBlock(args);
      case "list_blocks":          return await handleListBlocks();
      case "get_installation_guide": return handleGetInstallationGuide(args);
      case "get_usage_example":    return handleGetUsageExample(args);
      default:
        return { content: [{ type: "text", text: `Unknown tool: ${name}` }] };
    }
  } catch (err) {
    return {
      content: [{ type: "text", text: `Error: ${(err as Error).message}` }],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("✅ Lightswind MCP Server running");
  // Pre-warm components cache in background (do NOT await!)
  getComponents().catch(() => {});
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
