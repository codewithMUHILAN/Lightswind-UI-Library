
export interface ComponentDoc {
  description: string;
  import: string;
  props?: {
    name: string;
    type: string;
    description: string;
    default?: string;
    required: boolean;
  }[];
  usage: string;
  variants?: {
    name: string;
    description: string;
  }[];
  accessibility?: string;
  examples?: {
    title: string;
    description?: string;
    code: string;
  }[];
}

// Helper function to convert name to lowercase with hyphens
// Ensure this function is accessible in this file (e.g., imported or defined here)
const formatName = (name) => name.toLowerCase().replace(/\s+/g, "-");

export const componentDocs: Record<string, ComponentDoc> = {
  [formatName("Dynamic Island")]: {
    description:
      "A floating glassmorphic island that sits fixed at any corner or edge of the viewport. It provides live scroll-section tracking with an animated progress ring, a font switcher that overrides the whole page's font-family, and a fully-customisable theme colour picker that writes CSS custom properties to <html> so your design tokens update instantly. Use the `position` prop to place it top-left, top-center, top-right, bottom-left, bottom-center, or bottom-right. Selections are persisted to localStorage automatically, and the island hides itself whenever a modal is visible.",
    import: 'import { DynamicIsland } from "@/components/lightswind/dynamic-island"',
    usage: `import { DynamicIsland } from "@/components/lightswind/dynamic-island";
import { Zap } from "lucide-react";

export default function RootLayout({ children }) {
  return (
    <>
      {children}

      <DynamicIsland
        position="bottom-center"
        sections={[
          { id: "hero",     label: "Hero"     },
          { id: "features", label: "Features" },
          { id: "pricing",  label: "Pricing"  },
          { id: "contact",  label: "Contact"  },
        ]}
        themes={[
          { name: "Brand",  color: "#6366f1", color2: "#818cf8" },
          { name: "Accent", color: "#f59e0b", color2: "#fbbf24" },
          { name: "Dark",   color: "#0f172a", color2: "#1e293b" },
        ]}
        sectionIcon={<Zap className="w-3 h-3" />}
        storageKey="my-app"
        onThemeChange={(theme) => console.log("theme changed", theme)}
      />
    </>
  );
}`,
    props: [
      {
        name: "position",
        type: '"top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right"',
        description:
          "Where the island is pinned in the viewport. Dropdowns automatically open downward for top positions and upward for bottom positions.",
        default: '"bottom-center"',
        required: false,
      },
      {
        name: "sections",
        type: "IslandSection[]",
        description:
          "Array of page sections to track. Each entry is `{ id: string; label: string }` where `id` matches the DOM element's `id` attribute.",
        default: '[{ id: "home", label: "Home" }]',
        required: false,
      },
      {
        name: "defaultSectionLabel",
        type: "string",
        description: "Label shown before any section is scrolled into view.",
        default: '"Home"',
        required: false,
      },
      {
        name: "sectionIcon",
        type: "React.ReactNode",
        description:
          "Icon rendered beside the scroll progress ring. Accepts any React node — a Lucide icon, custom SVG, or even an emoji string. When provided, the animated ring is replaced by this icon.",
        default: "Animated SVG ring",
        required: false,
      },
      {
        name: "fonts",
        type: "IslandFont[]",
        description:
          "Font picker options. Each entry is `{ name: string; value: string }` where `value` is a valid CSS font-family string. Selecting a font updates `document.body.style.fontFamily` for the entire page — even overriding external fonts loaded via <link>.",
        default: "7 built-in fonts (Inter, Geist, Outfit, …)",
        required: false,
      },
      {
        name: "showFontPicker",
        type: "boolean",
        description: "Toggle the font-picker button on/off.",
        default: "true",
        required: false,
      },
      {
        name: "defaultFontIndex",
        type: "number",
        description: "Index into the `fonts` array that is active on first mount.",
        default: "0",
        required: false,
      },
      {
        name: "themes",
        type: "IslandTheme[]",
        description:
          "Theme colour presets. Each entry is `{ name: string; color: string; color2?: string }`. Selecting a theme sets `--island-color` and `--island-color-2` on `<html>` — point your CSS variables at these to make the island theme drive your whole design.",
        default: "6 built-in themes (Blue, Midnight, Emerald, …)",
        required: false,
      },
      {
        name: "showThemePicker",
        type: "boolean",
        description: "Toggle the theme-picker button on/off.",
        default: "true",
        required: false,
      },
      {
        name: "defaultThemeIndex",
        type: "number",
        description: "Index into the `themes` array that is active on first mount.",
        default: "0",
        required: false,
      },
      {
        name: "storageKey",
        type: "string",
        description:
          'localStorage key prefix used to persist the selected font and theme across page refreshes. E.g. `"my-app"` writes `"my-app-font"` and `"my-app-theme"`. Use different keys if you mount islands on multiple pages.',
        default: '"island"',
        required: false,
      },
      {
        name: "disablePersistence",
        type: "boolean",
        description: "Disable localStorage persistence entirely.",
        default: "false",
        required: false,
      },
      {
        name: "className",
        type: "string",
        description:
          "CSS class names appended to the outermost wrapper `<div>`. Use to fine-tune positioning or add custom styles.",
        required: false,
      },
      {
        name: "modalSelectors",
        type: "string[]",
        description:
          "CSS selectors for modal-like elements. The island hides itself whenever any matching element is visible.",
        default: '["[data-checkout-modal=\\"true\\"]", ".modal", "[role=\\"dialog\\"]"]',
        required: false,
      },
      {
        name: "lightBg",
        type: "string",
        description: "Glass background colour in light mode. Any valid CSS colour string.",
        default: '"rgba(255,255,255,0.8)"',
        required: false,
      },
      {
        name: "darkBg",
        type: "string",
        description: "Glass background colour in dark mode. Any valid CSS colour string.",
        default: '"#111111"',
        required: false,
      },
      {
        name: "onSectionChange",
        type: "(section: IslandSection | null) => void",
        description: "Callback fired each time the active section changes.",
        required: false,
      },
      {
        name: "onFontChange",
        type: "(font: IslandFont) => void",
        description: "Callback fired each time the user selects a new font.",
        required: false,
      },
      {
        name: "onThemeChange",
        type: "(theme: IslandTheme) => void",
        description: "Callback fired each time the user selects a new theme.",
        required: false,
      },
    ],
    variants: [
      {
        name: "Top-right corner",
        description: 'Pin the island to the top-right: `position="top-right"`. Dropdowns open downward automatically.',
      },
      {
        name: "Font only",
        description: "Hide the theme picker to show only the font switcher: `showThemePicker={false}`.",
      },
      {
        name: "Theme only",
        description: "Hide the font picker to show only the theme switcher: `showFontPicker={false}`.",
      },
      {
        name: "Navigation only",
        description:
          "Set `showFontPicker={false}` and `showThemePicker={false}` to keep only the scroll-progress ring + section label.",
      },
      {
        name: "Custom icon",
        description:
          "Pass any React node to `sectionIcon` to replace the SVG ring with a static icon.",
      },
    ],
    examples: [
      {
        title: "Top-right placement",
        description: "Pin to the top-right corner — dropdown opens downward.",
        code: `<DynamicIsland position="top-right" />`,
      },
      {
        title: "Bottom-left with brand theme",
        description: "Pin bottom-left and supply a single brand-colour theme.",
        code: `<DynamicIsland
  position="bottom-left"
  themes={[{ name: "Brand", color: "#6366f1", color2: "#818cf8" }]}
  showFontPicker={false}
/>`,
      },
      {
        title: "Connect CSS variables to island theme",
        description:
          "After adding this to your global CSS, every time the user picks a theme the whole site re-colours.",
        code: `/* globals.css */
:root {
  --primary:   var(--island-color);
  --primary-2: var(--island-color-2);
}

/* Then use in components */
.btn-primary {
  background: var(--primary);
}`,
      },
      {
        title: "Multi-page apps (unique storage keys)",
        description: "Give each page its own key so selections don't bleed between pages.",
        code: `// Marketing page
<DynamicIsland storageKey="marketing" />

// Dashboard
<DynamicIsland storageKey="dashboard" position="top-right" />`,
      },
      {
        title: "Custom section icon",
        description: "Replace the animated ring with a Lucide icon.",
        code: `import { Rocket } from "lucide-react";

<DynamicIsland
  position="bottom-center"
  sectionIcon={<Rocket className="w-3.5 h-3.5" />}
  sections={[
    { id: "launch", label: "Launch" },
    { id: "orbit",  label: "Orbit"  },
  ]}
/>`,
      },
    ],
    accessibility:
      "All picker buttons have unique id attributes (`island-font-btn`, `island-theme-btn`) and are keyboard-accessible. Dropdowns close on outside click via a mousedown listener.",
  },

  [formatName("3D Scroll Paragraph")]: {
    description: "A premium 3D typography component that maps text onto a tilted back 3D plane, moving vertically on scroll. Replicates the cinematic feel of 'Star Wars' intros with true perspective and depth scaling.",
    import: 'import { ScrollPara3D } from "@/components/lightswind/scroll-para-3d"',
    usage: `import { ScrollPara3D } from "@/components/lightswind/scroll-para-3d";

const textLines = [
  "In an era of digital noise",
  "Creating experiences that matter",
  "Requires more than just beauty",
  "It demands true intentionality",
  "Design is how it works",
  "Smooth motion captures minds"
];

export function Demo() {
  return (
    <div className="w-full">
      <ScrollPara3D 
        lines={textLines} 
        perspective={400}
        angle={60}
        scrubSpeed={1.5}
      />
    </div>
  );
}`,
    props: [
      {
        name: "lines",
        type: "string[]",
        description: "Array of strings representing the text lines to scroll in 3D.",
        required: true,
      },
      {
        name: "perspective",
        type: "number",
        description: "The perspective depth distance in pixels. Less perspective (e.g. 300) means more extreme 3D depth and stretch.",
        default: "400",
        required: false,
      },
      {
        name: "angle",
        type: "number",
        description: "The angle of the text plane rotating away from the user.",
        default: "60",
        required: false,
      },
      {
        name: "scrubSpeed",
        type: "number",
        description: "How much extra window vertical scroll space is allocated to complete the animation. Greater value = slower scroll.",
        default: "1.5",
        required: false,
      },
      {
        name: "containerClassName",
        type: "string",
        description: "Additional CSS classes for the generic paragraph container.",
        required: false,
      },
      {
        name: "textClassName",
        type: "string",
        description: "Additional CSS classes applied to each text line element directly (useful for setting font sizes, italics, and colors).",
        required: false,
      },
    ]
  },
  [formatName("Scroll Paragraph")]: {
    description: "A professional scroll-triggered typography component that reveals text paragraphs line-by-line while pinning the parent section, providing smooth GSAP-based scroll engagement like tracking websites.",
    import: 'import { ScrollPara } from "@/components/lightswind/scroll-para"',
    usage: `import { ScrollPara } from "@/components/lightswind/scroll-para";

const textLines = [
  "In an era of digital noise",
  "Creating experiences that matter",
  "Requires more than just beauty"
];

export function Demo() {
  return (
    <div className="w-full">
      <ScrollPara 
        lines={textLines} 
        blur={12}
        direction="bottom" 
        pinSpacing={true}
      />
    </div>
  );
}`,
    props: [
      {
        name: "lines",
        type: "string[]",
        description: "Array of strings representing the text lines to reveal one by one.",
        required: true,
      },
      {
        name: "blur",
        type: "number",
        description: "Initial blur amount in px before revealing.",
        default: "10",
        required: false,
      },
      {
        name: "direction",
        type: '"top" | "bottom" | "left" | "right"',
        description: "The initial direction from which the line enters the viewport before settling to 0.",
        default: '"bottom"',
        required: false,
      },
      {
        name: "scrubSpeed",
        type: "number",
        description: "Scrub multiplier for GSAP scroll trigger.",
        default: "1",
        required: false,
      },
      {
        name: "pinSpacing",
        type: "boolean",
        description: "Whether the parent container should add padding to space out the layout while pinning.",
        default: "true",
        required: false,
      },
    ]
  },
  [formatName("Magnetic Button")]: {
    description: "A cursor-attracting button that magnetically follows your pointer with spring physics and a subtle parallax text effect.",
    import: 'import { MagneticButton } from "@/components/lightswind/magnetic-button"',
    usage: `import { MagneticButton } from "@/components/lightswind/magnetic-button";

export function Demo() {
  return (
    <MagneticButton variant="primary" size="lg">
      Get Started
    </MagneticButton>
  );
}`,
    props: [
      {
        name: "children",
        type: "React.ReactNode",
        description: "Button label or icon+label content.",
        required: true,
      },
      {
        name: "variant",
        type: '"primary" | "outline" | "ghost" | "dark"',
        description: "Visual style of the button.",
        default: '"primary"',
        required: false,
      },
      {
        name: "size",
        type: '"sm" | "md" | "lg"',
        description: "Size of the button.",
        default: '"md"',
        required: false,
      },
      {
        name: "strength",
        type: "number",
        description: "Magnetic pull strength from 0 to 1.",
        default: "0.4",
        required: false,
      },
      {
        name: "radius",
        type: "number",
        description: "Pixel radius in which the magnet activates.",
        default: "80",
        required: false,
      },
      {
        name: "onClick",
        type: "() => void",
        description: "Click handler.",
        required: false,
      },
    ],
    examples: [
      {
        title: "High Strength",
        description: "Increase strength and radius for a more dramatic pull.",
        code: `<MagneticButton strength={0.7} radius={120} variant="dark" size="lg">
  Contact Us
</MagneticButton>`
      }
    ]
  },
  [formatName("Draggable Reorder List")]: {
    description: "A smooth drag-to-reorder list using Framer Motion's Reorder API with spring physics, staggered entry, and optional item removal.",
    import: 'import { DraggableReorderList, ReorderItem } from "@/components/lightswind/draggable-reorder-list"',
    usage: `import { DraggableReorderList, ReorderItem } from "@/components/lightswind/draggable-reorder-list";

const items: ReorderItem[] = [
  { id: "1", label: "First Item", description: "Description here" },
  { id: "2", label: "Second Item", description: "Another description" },
];

export function ReorderDemo() {
  return (
    <DraggableReorderList
      items={items}
      removable
      onReorder={(newOrder) => console.log(newOrder)}
    />
  );
}`,
    props: [
      {
        name: "items",
        type: "ReorderItem[]",
        description: "The initial list of items. Each item needs an id and label.",
        required: true,
      },
      {
        name: "removable",
        type: "boolean",
        description: "If true, shows a remove button on each item.",
        default: "true",
        required: false,
      },
      {
        name: "onReorder",
        type: "(items: ReorderItem[]) => void",
        description: "Callback with the new item order after drag or removal.",
        required: false,
      },
      {
        name: "className",
        type: "string",
        description: "Additional CSS classes for the container.",
        required: false,
      },
    ],
    examples: [
      {
        title: "With Icons",
        description: "Pass an icon prop for a richer settings-panel feel.",
        code: `const items: ReorderItem[] = [
  { id: "1", label: "Notifications", icon: <Bell className="h-4 w-4" /> },
];

<DraggableReorderList items={items} />`
      }
    ]
  },
  [formatName("Animated Number Stepper")]: {
    description: "A sleek animated increment/decrement stepper with spring physics, number-flip transitions, and boundary-aware disabled states.",
    import: 'import { AnimatedNumberStepper } from "@/components/lightswind/animated-number-stepper"',
    usage: `import { AnimatedNumberStepper } from "@/components/lightswind/animated-number-stepper";

export function StepperDemo() {
  return (
    <div className="flex justify-center py-8">
      <AnimatedNumberStepper defaultValue={1} min={1} max={10} size="lg" />
    </div>
  );
}`,
    props: [
      {
        name: "defaultValue",
        type: "number",
        description: "The initial value of the stepper.",
        default: "1",
        required: false,
      },
      {
        name: "min",
        type: "number",
        description: "The minimum allowed value.",
        default: "0",
        required: false,
      },
      {
        name: "max",
        type: "number",
        description: "The maximum allowed value.",
        default: "99",
        required: false,
      },
      {
        name: "step",
        type: "number",
        description: "The increment/decrement step amount.",
        default: "1",
        required: false,
      },
      {
        name: "size",
        type: '"sm" | "md" | "lg"',
        description: "The size of the stepper.",
        default: '"md"',
        required: false,
      },
      {
        name: "onChange",
        type: "(value: number) => void",
        description: "Callback fired when value changes.",
        required: false,
      },
    ],
    examples: [
      {
        title: "Booking Widget",
        description: "Use inside a card for a real-world guest counter.",
        code: `<AnimatedNumberStepper defaultValue={2} min={1} max={8} size="md" />`
      }
    ]
  },
  [formatName("Slide To Confirm")]: {
    description: "A highly interactive slide-to-action button frequently used for critical operations like payments or deleting records.",
    import: 'import { SlideToConfirm } from "@/components/lightswind/slide-to-confirm"',
    usage: `import { SlideToConfirm } from "@/components/lightswind/slide-to-confirm";

export function ConfirmDemo() {
  const handleConfirm = async () => {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 1500));
  };

  return (
    <div className="flex justify-center py-12">
      <SlideToConfirm onConfirm={handleConfirm} />
    </div>
  );
}`,
    props: [
      {
        name: "text",
        type: "string",
        description: "The text displayed on the slider track.",
        default: '"Slide to confirm"',
        required: false,
      },
      {
        name: "successText",
        type: "string",
        description: "The text displayed after successful confirmation.",
        default: '"Confirmed"',
        required: false,
      },
      {
        name: "onConfirm",
        type: "() => Promise<void> | void",
        description: "Callback function triggered when the slider reaches the end.",
        required: true,
      },
      {
        name: "width",
        type: "number",
        description: "The width of the component in pixels.",
        default: "320",
        required: false,
      },
      {
        name: "height",
        type: "number",
        description: "The height of the component in pixels.",
        default: "56",
        required: false,
      },
      {
        name: "className",
        type: "string",
        description: "Additional CSS classes for the container.",
        required: false,
      },
    ],
    examples: [
      {
        title: "Custom Width",
        description: "Adjust the width to fit your layout.",
        code: `<SlideToConfirm width={400} text="Swipe to execute" onConfirm={handleConfirm} />`
      }
    ]
  },
  [formatName("Expandable Search Bar")]: {
    description: "An elegant, animated search bar that expands gracefully on interaction and features clear/command micro-interactions.",
    import: 'import { ExpandableSearchBar } from "@/components/lightswind/expandable-search-bar"',
    usage: `import { ExpandableSearchBar } from "@/components/lightswind/expandable-search-bar";

export function SearchBarDemo() {
  return (
    <div className="flex justify-center py-20">
      <ExpandableSearchBar placeholder="Search documents..." expandedWidth="20rem" />
    </div>
  );
}`,
    props: [
      {
        name: "placeholder",
        type: "string",
        description: "The placeholder text for the search input.",
        default: '"Search..."',
        required: false,
      },
      {
        name: "expandedWidth",
        type: "string | number",
        description: "The width of the search bar when expanded.",
        default: '"18rem"',
        required: false,
      },
      {
        name: "onChange",
        type: "(value: string) => void",
        description: "Callback fired when the input value changes.",
        required: false,
      },
      {
        name: "onSubmit",
        type: "(value: string) => void",
        description: "Callback fired when the form is submitted (Enter key).",
        required: false,
      },
      {
        name: "className",
        type: "string",
        description: "Additional CSS classes for the container.",
        required: false,
      },
    ],
    examples: [
      {
        title: "Full Width",
        description: "Expands natively into 100% of the parent width.",
        code: `<ExpandableSearchBar expandedWidth="100%" />`
      }
    ]
  },
  [formatName("Expandable Speed Dial")]: {
    description: "A functional speed dial that expands into multiple floating action buttons with staggered physics animations.",
    import: 'import { ExpandableSpeedDial, SpeedDialAction } from "@/components/lightswind/expandable-speed-dial"',
    usage: `import { ExpandableSpeedDial, SpeedDialAction } from "@/components/lightswind/expandable-speed-dial";
import { FileEdit, Share2, Download, Printer } from "lucide-react";

export function SpeedDialDemo() {
  const actions: SpeedDialAction[] = [
    { icon: <FileEdit className="h-4 w-4" />, label: "Edit", onClick: () => console.log("Edit") },
    { icon: <Share2 className="h-4 w-4" />, label: "Share", onClick: () => console.log("Share") },
  ];

  return (
    <div className="flex justify-center py-20">
      <ExpandableSpeedDial actions={actions} direction="up" size="lg" />
    </div>
  );
}`,
    props: [
      {
        name: "actions",
        type: "SpeedDialAction[]",
        description: "Array of actions to show when expanded. Each action requires an icon, label, and onClick handler.",
        required: true,
      },
      {
        name: "direction",
        type: '"up" | "down" | "left" | "right"',
        description: "The direction to expand the actions.",
        default: '"up"',
        required: false,
      },
      {
        name: "size",
        type: '"sm" | "md" | "lg"',
        description: "The size of the main dial and internal buttons.",
        default: '"md"',
        required: false,
      },
      {
        name: "className",
        type: "string",
        description: "Additional CSS classes for the container.",
        required: false,
      },
    ],
    examples: [
      {
        title: "Directions",
        description: "Expand the actions horizontally or vertically.",
        code: `<ExpandableSpeedDial actions={actions} direction="right" />`
      }
    ]
  },
  [formatName("Animated Copy Button")]: {
    description: "A highly interactive copy-to-clipboard button using Framer Motion with smooth success animations.",
    import: 'import { AnimatedCopyButton } from "@/components/lightswind/animated-copy-button"',
    usage: `import { AnimatedCopyButton } from "@/components/lightswind/animated-copy-button";

export function AnimatedCopyButtonDemo() {
  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <AnimatedCopyButton textToCopy="npm install lightswind-ui" />
    </div>
  );
}`,
    props: [
      {
        name: "textToCopy",
        type: "string",
        description: "The text that will be copied to the clipboard when clicked.",
        required: true,
      },
      {
        name: "size",
        type: '"sm" | "md" | "lg"',
        description: "The size of the copy button.",
        default: '"md"',
        required: false,
      },
      {
        name: "className",
        type: "string",
        description: "Additional CSS classes for the button.",
        required: false,
      },
      {
        name: "onCopy",
        type: "() => void",
        description: "Optional callback fired when text is successfully copied.",
        required: false,
      },
    ],
    examples: [
      {
        title: "Sizes",
        description: "The button comes in three different sizes.",
        code: `<div className="flex items-center gap-4">
  <AnimatedCopyButton textToCopy="copy" size="sm" />
  <AnimatedCopyButton textToCopy="copy" size="md" />
  <AnimatedCopyButton textToCopy="copy" size="lg" />
</div>`
      }
    ]
  },
  [formatName("Cool Theme Toggle")]: {
    description: "A professional and beautiful theme toggle with smooth spring animations, sun/moon icons, and day/night scenery background.",
    import: 'import { CoolThemeToggle } from "@/components/lightswind/cool-theme-toggle"',
    usage: `import { CoolThemeToggle } from "@/components/lightswind/cool-theme-toggle";

export function CoolThemeToggleDemo() {
  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <CoolThemeToggle size="lg" />
    </div>
  );
}`,
    props: [
      {
        name: "size",
        type: '"sm" | "md" | "lg"',
        description: "The size of the toggle switch.",
        default: '"md"',
        required: false,
      },
      {
        name: "className",
        type: "string",
        description: "Additional CSS classes for the toggle switch.",
        required: false,
      },
    ],
    examples: [
      {
        title: "Sizes",
        description: "The toggle comes in three different sizes.",
        code: `<div className="flex items-center gap-4">
  <CoolThemeToggle size="sm" />
  <CoolThemeToggle size="md" />
  <CoolThemeToggle size="lg" />
</div>`
      }
    ]
  },
  [formatName("Ascii Wave")]: {
    description: "A retro-style, text-based animation using ASCII characters to simulate fluids, fire, or data streams on HTML Canvas.",
    import: 'import AsciiWave from "@/components/lightswind/ascii-wave"',
    usage: `import AsciiWave from "@/components/lightswind/ascii-wave";

export function AsciiWaveDemo() {
  return (
    <div className="relative w-full h-[300px] bg-black overflow-hidden rounded-lg">
      <AsciiWave 
        color="#f97316" 
        speed={1} 
      />
    </div>
  );
}`,
    props: [
      {
        name: "color",
        type: "string",
        description: "Hex or CSS color string for the ASCII characters.",
        default: '"#FF4500"',
        required: false,
      },
      {
        name: "speed",
        type: "number",
        description: "Animation playback speed multiplier.",
        default: "1",
        required: false,
      },
      {
        name: "className",
        type: "string",
        description: "Additional CSS classes for the container.",
        required: false,
      },
    ],
    examples: [
      {
        title: "Fire Effect",
        description: "Orange data-fire rising upwards.",
        code: `<AsciiWave color="#f97316" speed={1.5} />`
      },
      {
        title: "Matrix Rain Code",
        description: "Green slow-motion data stream.",
        code: `<AsciiWave color="#22c55e" speed={0.5} />`
      }
    ]
  },
  [formatName("Liquid Surface")]: {
    description: "A premium 3D interactive background featuring liquid surface displacement and dynamic color mixing. Powered by WebGL and Three.js.",
    import: 'import LiquidSurface from "@/components/lightswind/liquid-surface"',
    usage: `import LiquidSurface from "@/components/lightswind/liquid-surface";

export function LiquidSurfaceDemo() {
  return (
    <div className="relative w-full h-[400px] bg-black overflow-hidden rounded-xl">
      <LiquidSurface 
        heading="LIQUID SURFACE"
        scheme={1}
        speed={1.2}
      />
    </div>
  );
}`,
    props: [
      {
        name: "colors",
        type: "string[]",
        description: "Array of hex colors for the liquid surface gradients.",
        required: false,
      },
      {
        name: "speed",
        type: "number",
        description: "Speed of the liquid surface animation.",
        default: "1.2",
        required: false,
      },
      {
        name: "intensity",
        type: "number",
        description: "Brightness/Intensity of the colors.",
        default: "1.8",
        required: false,
      },
      {
        name: "heading",
        type: "string",
        description: "Interactive HTML string to display as a center heading.",
        required: false,
      },
      {
        name: "showCursor",
        type: "boolean",
        description: "Whether to show the custom following cursor (overrides global cursor).",
        default: "true",
        required: false,
      },
    ],
    examples: [
      {
        title: "Clean Design",
        description: "No heading, just the interactive surface.",
        code: `<LiquidSurface showCursor={false} />`
      },
      {
        title: "Custom Palette",
        description: "Vibrant custom colors.",
        code: `<LiquidSurface colors={["#00fffc", "#000000", "#ff00ff"]} />`
      }
    ]
  },

  [formatName("Magic Card")]: {
    description: "Interactive card with pointer-tracking spotlight/projection effect and glassmorphic borders.",
    import: "import { MagicCard } from '@/components/lightswind/magic-card';",
    usage: `import { MagicCard } from '@/components/lightswind/magic-card';

export function MagicCardDemo() {
  return (
    <MagicCard
        title="Magic Card"
        imageUrl="https://images.unsplash.com/photo-1517336714731-489689fd1ca4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    />
  );
}`,
    props: [
      {
        name: "title",
        type: "string",
        description: "The title of the card.",
        required: true,
      },
      {
        name: "imageUrl",
        type: "string",
        description: "The URL of the image to display.",
        required: true,
      },
      {
        name: "icon",
        type: "ReactNode",
        description: "Optional icon to display in top right corner",
        required: false,
      }
    ],
  },
  [formatName("Accordion")]: {
    description:
      `A vertically stacked set of interactive headings that each reveal a section of content.`,
    import:
      "import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/lightswind/accordion';",
    usage: `import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/lightswind/accordion';

export function AccordionDemo() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes. It adheres to the WAI-ARIA design pattern.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>
          Yes. It comes with default styles that matches the other components' aesthetic.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is it animated?</AccordionTrigger>
        <AccordionContent>
          Yes. It's animated by default, but you can disable it if you prefer.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}`,
    props: [
      {
        name: "type",
        type: '"single" | "multiple"',
        description:
          "Determines whether one or multiple items can be opened at the same time.",
        default: '"single"',
        required: false,
      },
      {
        name: "value",
        type: "string | string[]",
        description: "The controlled value(s) of the open accordion item(s).",
        default: "",
        required: false,
      },
      {
        name: "defaultValue",
        type: "string | string[]",
        description:
          "The default value(s) for the open accordion item(s) when initially rendered.",
        default: "[]",
        required: false,
      },
      {
        name: "onValueChange",
        type: "(value: string[]) => void",
        description:
          "Event handler called when the expanded state of an accordion item changes.",
        default: "",
        required: false,
      },
      {
        name: "collapsible",
        type: "boolean",
        description:
          "When true, allows closing content by clicking the trigger of an open item.",
        default: "false",
        required: false,
      },
    ],
    examples: [
      {
        title: "Multiple Items Open",
        description: "Allow multiple accordion items to be open simultaneously",
        code: `<Accordion type="multiple" defaultValue={["item-1", "item-3"]}>
  <AccordionItem value="item-1">
    <AccordionTrigger>First item</AccordionTrigger>
    <AccordionContent>
      This item is open by default.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>Second item</AccordionTrigger>
    <AccordionContent>
      This item is closed by default.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-3">
    <AccordionTrigger>Third item</AccordionTrigger>
    <AccordionContent>
      This item is also open by default.
    </AccordionContent>
  </AccordionItem>
</Accordion>`,
      },
      {
        title: "Controlled Accordion",
        description: "Controlling the open state with React state",
        code: `import { useState } from "react";

function ControlledAccordion() {
  const [value, setValue] = useState<string[]>(["item-1"]);
  
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={() => setValue([])}
        >
          Close All
        </Button>
        <Button 
          variant="outline" 
          onClick={() => setValue(["item-1", "item-2", "item-3"])}
        >
          Open All
        </Button>
      </div>
      
      <Accordion 
        type="multiple" 
        value={value} 
        onValueChange={setValue}
      >
        <AccordionItem value="item-1">
          <AccordionTrigger>First item</AccordionTrigger>
          <AccordionContent>First content</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Second item</AccordionTrigger>
          <AccordionContent>Second content</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Third item</AccordionTrigger>
          <AccordionContent>Third content</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}`,
      },
      {
        title: "Custom Styling",
        description: "Accordion with custom styling and border",
        code: `<Accordion 
  type="single" 
  collapsible 
  className="rounded-md border"
>
  <AccordionItem value="item-1" className="border-b px-4">
    <AccordionTrigger className="py-4 hover:no-underline hover:bg-muted/50">
      Custom styled item
    </AccordionTrigger>
    <AccordionContent className="pb-4 pt-0">
      Custom styled content with different padding and hover effects.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2" className="px-4">
    <AccordionTrigger className="py-4 hover:no-underline hover:bg-muted/50">
      Another custom item
    </AccordionTrigger>
    <AccordionContent className="pb-4 pt-0">
      More custom styled content.
    </AccordionContent>
  </AccordionItem>
</Accordion>`,
      },
    ],
    accessibility:
      "The Accordion component follows the WAI-ARIA Accordion Pattern. It uses appropriate ARIA attributes and keyboard interactions to ensure accessibility. Each accordion trigger is a button, which makes it focusable and interactive by keyboard. The component handles keyboard navigation, including tab, space, and enter keys for interacting with the accordion items.",
  },

  [formatName("Alert")]: {
    import:
      'import { Alert, AlertTitle, AlertDescription } from "@/components/lightswind/alert"',
    description:
      "Displays a callout for user attention with various severity levels.",
    usage: `<Alert>
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>
    You can add components to your app using the cli.
  </AlertDescription>
</Alert>`,
    variants: [
      {
        name: "Destructive",
        description:
          "Use the destructive variant to indicate a potentially dangerous action.",
      },
    ],
    accessibility:
      "The alert component uses the aria-live attribute to announce changes to the user.",
    examples: [
      {
        title: "Default",
        code: `<Alert>
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>
    You can add components to your app using the cli.
  </AlertDescription>
</Alert>`,
      },
    ],
  },

  [formatName("Alert Dialog")]: {
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
    import:
      'import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from "@/components/lightswind/alert-dialog"',
    usage: `import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/lightswind/alert-dialog";
import { Button } from "@/components/lightswind/button";

export function AlertDialogDemo() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Delete Account</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}`,
    props: [
      {
        name: "open",
        type: "boolean",
        description: "Controls whether the dialog is open or closed",
        required: false,
      },
      {
        name: "onOpenChange",
        type: "(open: boolean) => void",
        description: "Callback fired when the dialog open state changes",
        required: false,
      },
      {
        name: "defaultOpen",
        type: "boolean",
        default: "false",
        description: "Initial open state of the dialog when uncontrolled",
        required: false,
      },
    ],
    variants: [
      {
        name: "Default",
        description:
          "The standard alert dialog with header, content, and footer sections",
      },
      {
        name: "Destructive",
        description:
          "Alert dialog with a destructive action that requires confirmation",
      },
      {
        name: "Simple",
        description: "A simplified alert dialog with minimal content",
      },
    ],
    examples: [
      {
        title: "Confirm Deletion",
        description:
          "Alert dialog asking for confirmation before deleting an item",
        code: `<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="outline">Delete Item</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This will permanently delete the selected item.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Delete</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>`,
      },
      {
        title: "Controlled Dialog",
        description: "Alert dialog with controlled open state",
        code: `import { useState } from "react";

function ControlledAlertDialog() {
  const [open, setOpen] = useState(false);
  
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Dialog</Button>
      
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Important Notice</AlertDialogTitle>
            <AlertDialogDescription>
              This is a controlled alert dialog.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}`,
      },
      {
        title: "Custom Action Button",
        description: "Alert dialog with customized action button",
        code: `<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button>Open</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Important Update</AlertDialogTitle>
      <AlertDialogDescription>
        A new version is available. Would you like to update now?
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Later</AlertDialogCancel>
      <AlertDialogAction className="bg-green-600 hover:bg-green-700">
        Update Now
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>`,
      },
    ],
    accessibility:
      "The Alert Dialog follows WAI-ARIA design patterns for dialog modals. It traps focus within the dialog when open, is dismissible via the Escape key, and has appropriate ARIA roles, labels, and descriptions. The dialog is designed to be announced by screen readers when it opens.",
  },

  [formatName("3D Image Slider")]: {
    description: "A professional responsive 3D image slider component using Framer Motion and Tailwind CSS. Features smooth rotation, customizable perspective, and CSS 3D transforms.",
    import: 'import ImageSlider3D from "@/components/lightswind/3d-image-slider"',
    usage: `import ImageSlider3D from "@/components/lightswind/3d-image-slider";

export function ThreeDImageSliderDemo() {
  return (
    <div className="w-full h-[600px] flex items-center justify-center bg-[#fff3ed] dark:bg-black rounded-xl overflow-hidden relative">
      <ImageSlider3D duration={32} cardWidth="15em" />
    </div>
  );
}`,
    props: [
      {
        name: "images",
        type: "string[]",
        description: "Array of image URLs to display in the 3D slider.",
        required: false,
      },
      {
        name: "duration",
        type: "number",
        description: "Duration of one full 360-degree rotation in seconds.",
        default: "32",
        required: false,
      },
      {
        name: "cardWidth",
        type: "string",
        description: "Width of each card. Can be px, em, etc.",
        default: '"17.5em"',
        required: false,
      },
      {
        name: "perspective",
        type: "string",
        description: "Perspective value for the 3D container.",
        default: '"35em"',
        required: false,
      },
      {
        name: "cardAspectRatio",
        type: "string",
        description: "The CSS aspect ratio for each card.",
        default: '"7/10"',
        required: false,
      },
      {
        name: "containerClassName",
        type: "string",
        description: "Additional Tailwind classes to apply to the container.",
        default: '""',
        required: false,
      },
      {
        name: "imageClassName",
        type: "string",
        description: "Additional Tailwind classes to apply to the image tags.",
        default: '""',
        required: false,
      },
      {
        name: "rotationDirection",
        type: '"left" | "right"',
        description: "The direction the cylinder rotates.",
        default: '"left"',
        required: false,
      },
      {
        name: "withMask",
        type: "boolean",
        description: "Whether to apply a subtle vignette fade mask on the edges of the image slider to seamlessly blend it into the background.",
        default: "true",
        required: false,
      },
    ],
    examples: [
      {
        title: "Default Config",
        description: "Automatically uses Unsplash images and slow rotation.",
        code: `<ImageSlider3D />`
      }
    ],
  },
  [formatName("Rolling Text 3D")]: {
    description: "A premium 3D text rotation component that creates a 'Tube' rotation effect using GSAP. Each character rotates in a 3D cylindrical space for a high-impact cinematic feel.",
    import: 'import { RollingText3D } from "@/components/lightswind/rolling-text-3d"',
    usage: `import { RollingText3D } from "@/components/lightswind/rolling-text-3d";

export function RollingTextDemo() {
  return (
    <div className="h-64 flex items-center justify-center bg-black">
      <RollingText3D 
        text="LIGHTSWIND" 
        fontSize="6vw" 
        color="#ffffff" 
      />
    </div>
  );
}`,
    props: [
      {
        name: "text",
        type: "string",
        description: "The text content to be animated.",
        required: true,
      },
      {
        name: "fontSize",
        type: "string",
        description: "CSS font size (e.g., '5vw', '48px').",
        default: '"8vw"',
        required: false,
      },
      {
        name: "color",
        type: "string",
        description: "Text color (hex, hsl, or tailwind utility).",
        default: '"currentColor"',
        required: false,
      },
      {
        name: "duration",
        type: "number",
        description: "Time in seconds for a full rotation cycle.",
        default: "0.9",
        required: false,
      },
      {
        name: "stagger",
        type: "number",
        description: "Stagger delay between each character's rotation.",
        default: "0.08",
        required: false,
      },
      {
        name: "perspective",
        type: "number",
        description: "3D perspective value.",
        default: "700",
        required: false,
      },
    ],
    examples: [
      {
        title: "Slow Cinematic",
        description: "Lower duration and higher stagger for a more rhythmic, slow-motion effect.",
        code: `<RollingText3D text="PREMIUM" duration={1.5} stagger={0.12} />`
      }
    ]
  },
  [formatName("Angled Slider")]: {
    description: "A 3D perspective infinite slider with reflection effects and hover interactions.",
    import: 'import { AngledSlider } from "@/components/lightswind/angled-slider"',
    usage: `import { AngledSlider } from "@/components/lightswind/angled-slider";

export function AngledSliderDemo() {
  const images = [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1554080353-a576cf803bda?auto=format&fit=crop&w=1000&q=80",
      title: "Mountain View",
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1505144808419-1957a94ca61e?auto=format&fit=crop&w=1000&q=80",
      title: "Ocean Breeze",
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1000&q=80",
      title: "Forest Mist",
    },
    {
      id: 4,
      url: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1000&q=80",
      title: "Canyon Echo",
    },
     {
      id: 5,
      url: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1000&q=80",
      title: "Canyon Echo",
    },
     {
      id: 6,
      url: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1000&q=80",
      title: "Canyon Echo",
    },
  ];

  return <AngledSlider items={images} speed={30} />;
}`,
    props: [
      {
        name: "items",
        type: "{ id: string | number; url: string; alt?: string; title?: string; }[]",
        description: "Array of image objects to display.",
        required: true,
      },
      {
        name: "speed",
        type: "number",
        description: "Animation duration in seconds for one full loop. Higher is slower.",
        default: "40",
        required: false,
      },
      {
        name: "direction",
        type: '"left" | "right"',
        description: "Direction of the scroll.",
        default: '"left"',
        required: false,
      },
      {
        name: "angle",
        type: "number",
        description: "3D skew angle in degrees.",
        default: "15",
        required: false,
      },
      {
        name: "containerHeight",
        type: "string",
        description: "Height of the slider container.",
        default: '"400px"',
        required: false,
      },
      {
        name: "cardWidth",
        type: "string",
        description: "Width of each card.",
        default: '"300px"',
        required: false,
      },
    ],
    examples: [
      {
        title: "Basic Usage",
        description: "Default left-scrolling 3D slider.",
        code: `<AngledSlider 
  items={[
    { id: 1, url: "/img1.jpg", title: "Image 1" },
    { id: 2, url: "/img2.jpg", title: "Image 2" },
    { id: 3, url: "/img3.jpg", title: "Image 3" },
    { id: 4, url: "/img4.jpg", title: "Image 4" },
  ]} 
/>`
      }
    ],
    accessibility: "Items are decorative by default. Ensure alt text is provided for images if they convey meaning.",
  },

  [formatName("Aspect Ratio")]: {
    description:
      "A container that maintains a specific aspect ratio for its content, useful for images, videos, and other media.",
    import:
      "import { AspectRatio } from '@/components/lightswind/aspect-ratio';",
    usage: `import { AspectRatio } from '@/components/lightswind/aspect-ratio';
import Image from 'next/image';

export function AspectRatioDemo() {
  return (
    <div className="w-[300px]">
      <AspectRatio ratio={16 / 9}>
        <img
          src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
          alt="Image"
          className="rounded-md object-cover w-full h-full"
        />
      </AspectRatio>
    </div>
  );
}`,
    props: [
      {
        name: "ratio",
        type: "number",
        description: "The aspect ratio to maintain (width/height).",
        default: "1",
        required: false,
      },
      {
        name: "preset",
        type: '"square" | "video" | "portrait" | "widescreen" | "ultrawide" | "golden"',
        description: "Predefined aspect ratios for common use cases.",
        default: "",
        required: false,
      },
      {
        name: "rounded",
        type: "boolean",
        description: "Whether to apply rounded corners.",
        default: "false",
        required: false,
      },
      {
        name: "bordered",
        type: "boolean",
        description: "Whether to show a border.",
        default: "false",
        required: false,
      },
      {
        name: "objectFit",
        type: '"cover" | "contain" | "fill" | "none" | "scale-down"',
        description: "Optional object-fit style for child elements.",
        default: "",
        required: false,
      },
    ],
    examples: [
      {
        title: "Square Aspect Ratio",
        description: "A 1:1 square aspect ratio container",
        code: `<div className="w-[200px]">
  <AspectRatio ratio={1 / 1}>
    <img
      src="/placeholder.jpg"
      alt="Square image"
      className="object-cover w-full h-full"
    />
  </AspectRatio>
</div>`,
      },
      {
        title: "Using Presets",
        description: "Using predefined aspect ratio presets",
        code: `<div className="grid grid-cols-2 gap-4 w-full max-w-3xl">
  <div>
    <p className="text-sm text-muted-foreground mb-2">Video (16:9)</p>
    <AspectRatio preset="video" bordered>
      <div className="flex items-center justify-center bg-muted w-full h-full">
        16:9
      </div>
    </AspectRatio>
  </div>
  <div>
    <p className="text-sm text-muted-foreground mb-2">Portrait (3:4)</p>
    <AspectRatio preset="portrait" bordered>
      <div className="flex items-center justify-center bg-muted w-full h-full">
        3:4
      </div>
    </AspectRatio>
  </div>
  <div>
    <p className="text-sm text-muted-foreground mb-2">Square (1:1)</p>
    <AspectRatio preset="square" bordered>
      <div className="flex items-center justify-center bg-muted w-full h-full">
        1:1
      </div>
    </AspectRatio>
  </div>
  <div>
    <p className="text-sm text-muted-foreground mb-2">Golden Ratio</p>
    <AspectRatio preset="golden" bordered>
      <div className="flex items-center justify-center bg-muted w-full h-full">
        1:1.618
      </div>
    </AspectRatio>
  </div>
</div>`,
      },
      {
        title: "With Styling Options",
        description: "AspectRatio with rounded corners, border and object-fit",
        code: `<div className="w-[300px]">
  <AspectRatio 
    ratio={4 / 3} 
    rounded 
    bordered
    objectFit="cover"
  >
    <img
      src="/placeholder.jpg"
      alt="Image with styling"
      className="w-full h-full"
    />
  </AspectRatio>
</div>`,
      },
      {
        title: "Video Embed",
        description: "Embedding a video with proper aspect ratio",
        code: `<div className="w-full max-w-2xl">
  <AspectRatio ratio={16 / 9} rounded>
    <iframe
      src="https://www.youtube.com/embed/dQw4w9WgXcQ"
      title="YouTube video"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      className="w-full h-full"
    />
  </AspectRatio>
</div>`,
      },
    ],
    accessibility:
      "The AspectRatio component provides a way to maintain consistent dimensions for media, which helps prevent layout shifts during page loading. This improves the user experience for everyone, including those using assistive technologies. When using this component, ensure that any media within it has appropriate alt text or descriptions for accessibility.",
  },

  [formatName("Avatar")]: {
    description: "An image element with a fallback for representing the user.",
    import:
      'import { Avatar, AvatarImage, AvatarFallback } from "@/components/lightswind/avatar"',
    usage: `import { Avatar, AvatarImage, AvatarFallback } from "@/components/lightswind/avatar";

export function AvatarDemo() {
  return (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
}`,
    props: [
      {
        name: "src",
        type: "string",
        description: "Image source URL for the avatar",
        required: false,
      },
      {
        name: "alt",
        type: "string",
        description: "Alt text for the avatar image",
        required: false,
      },
      {
        name: "fallback",
        type: "React.ReactNode",
        description: "Content to display when the image fails to load",
        required: false,
      },
      {
        name: "status",
        type: '"online" | "offline" | "away" | "busy" | null',
        description: "Online status indicator to display on the avatar",
        required: false,
      },
      {
        name: "className",
        type: "string",
        description: "Additional CSS classes to apply to the avatar",
        required: false,
      },
    ],
    variants: [
      {
        name: "Default",
        description: "Standard avatar with image and fallback",
      },
      {
        name: "With Status",
        description: "Avatar with an online status indicator",
      },
      {
        name: "Fallback Only",
        description: "Avatar showing only the fallback content",
      },
    ],
    examples: [
      {
        title: "Basic Avatar",
        description: "Simple avatar with image and fallback",
        code: `<Avatar>
  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
  <AvatarFallback>CN</AvatarFallback>
</Avatar>`,
      },
      {
        title: "Avatar with Status",
        description: "Avatar with online status indicator",
        code: `<Avatar status="online">
  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
  <AvatarFallback>CN</AvatarFallback>
</Avatar>`,
      },
      {
        title: "Different Status Types",
        description: "Avatars with different status indicators",
        code: `<div className="flex space-x-4">
  <Avatar status="online">
    <AvatarImage src="/avatar1.png" alt="User 1" />
    <AvatarFallback>U1</AvatarFallback>
  </Avatar>
  <Avatar status="offline">
    <AvatarImage src="/avatar2.png" alt="User 2" />
    <AvatarFallback>U2</AvatarFallback>
  </Avatar>
  <Avatar status="away">
    <AvatarImage src="/avatar3.png" alt="User 3" />
    <AvatarFallback>U3</AvatarFallback>
  </Avatar>
  <Avatar status="busy">
    <AvatarImage src="/avatar4.png" alt="User 4" />
    <AvatarFallback>U4</AvatarFallback>
  </Avatar>
</div>`,
      },
      {
        title: "Avatar with Icon Fallback",
        description: "Avatar using an icon as fallback",
        code: `import { User } from "lucide-react";

<Avatar>
  <AvatarImage src="/user-avatar.png" alt="User" />
  <AvatarFallback>
    <User className="h-5 w-5" />
  </AvatarFallback>
</Avatar>`,
      },
    ],
    accessibility:
      "The Avatar component uses appropriate alt text for images and provides a visible fallback when images fail to load or are unavailable. The component has a suitable color contrast ratio for fallback text.",
  },

  [formatName("Badge")]: {
    description:
      "A small visual indicator used to highlight an item, indicate status, or emphasize information.",
    import: 'import { Badge } from "@/components/lightswind/badge"',
    usage: `import { Badge } from "@/components/lightswind/badge";

export function BadgeDemo() {
  return <Badge>New</Badge>;
}`,
    props: [
      {
        name: "variant",
        type: '"default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info"',
        default: '"default"',
        description: "The style variant of the badge",
        required: false,
      },
      {
        name: "size",
        type: '"default" | "sm" | "lg"',
        default: '"default"',
        description: "The size of the badge",
        required: false,
      },
      {
        name: "shape",
        type: '"default" | "square" | "rounded"',
        default: '"default"',
        description: "The shape of the badge",
        required: false,
      },
      {
        name: "highlighted",
        type: "boolean",
        default: "false",
        description: "Whether the badge should be visually highlighted",
        required: false,
      },
      {
        name: "interactive",
        type: "boolean",
        default: "false",
        description: "Whether to apply a subtle hover effect",
        required: false,
      },
      {
        name: "withDot",
        type: "boolean",
        default: "false",
        description: "Whether to show a dot indicator inside the badge",
        required: false,
      },
      {
        name: "dotColor",
        type: "string",
        description: "Color of the dot indicator",
        required: false,
      },
      {
        name: "className",
        type: "string",
        description: "Additional CSS classes to apply to the badge",
        required: false,
      },
    ],
    variants: [
      {
        name: "default",
        description: "The primary badge style with the brand's main color",
      },
      {
        name: "secondary",
        description: "A more subtle badge style with secondary colors",
      },
      {
        name: "destructive",
        description:
          "A red badge typically used for errors or destructive actions",
      },
      {
        name: "outline",
        description: "A badge with a border and transparent background",
      },
      {
        name: "success",
        description: "A green badge for indicating successful states",
      },
      {
        name: "warning",
        description: "A yellow badge for indicating warning states",
      },
      {
        name: "info",
        description: "A blue badge for indicating informational states",
      },
    ],
    examples: [
      {
        title: "Basic Badges",
        description: "Different badge variants",
        code: `<div className="flex flex-wrap gap-2">
  <Badge>Default</Badge>
  <Badge variant="secondary">Secondary</Badge>
  <Badge variant="destructive">Destructive</Badge>
  <Badge variant="outline">Outline</Badge>
  <Badge variant="success">Success</Badge>
  <Badge variant="warning">Warning</Badge>
  <Badge variant="info">Info</Badge>
</div>`,
      },
      {
        title: "Badge Sizes",
        description: "Badges in different sizes",
        code: `<div className="flex flex-wrap items-center gap-2">
  <Badge size="sm">Small</Badge>
  <Badge size="default">Default</Badge>
  <Badge size="lg">Large</Badge>
</div>`,
      },
      {
        title: "Badge Shapes",
        description: "Badges with different shapes",
        code: `<div className="flex flex-wrap gap-2">
  <Badge shape="default">Rounded Full</Badge>
  <Badge shape="square">Square</Badge>
  <Badge shape="rounded">Rounded</Badge>
</div>`,
      },
      {
        title: "Interactive Badge",
        description: "Badge with hover effect",
        code: `<Badge interactive>
  Hover me
</Badge>`,
      },
      {
        title: "Badge with Dot Indicator",
        description: "Badge with a colored dot indicator",
        code: `<div className="flex flex-wrap gap-2">
  <Badge withDot>New</Badge>
  <Badge withDot dotColor="#10b981" variant="outline">Online</Badge>
  <Badge withDot dotColor="#f43f5e">Notifications</Badge>
</div>`,
      },
    ],
    accessibility:
      "Badge components use appropriate color contrast to ensure text readability. For badges that convey important information, make sure to pair them with supporting text or provide context to users of assistive technologies.",
  },

  [formatName("Button")]: {
    description:
      "A clickable element that triggers an action or event when activated.",
    import: 'import { Button } from "@/components/lightswind/button"',
    usage: `import { Button } from "@/components/lightswind/button";

export function ButtonDemo() {
  return (
    <Button>Click me</Button>
  );
}`,
    props: [
      {
        name: "variant",
        type: '"default" | "destructive" | "outline" | "secondary" | "ghost" | "link"',
        default: '"default"',
        description: "Controls the visual style of the button",
        required: false,
      },
      {
        name: "size",
        type: '"default" | "sm" | "lg" | "icon"',
        default: '"default"',
        description: "Controls the size of the button",
        required: false,
      },
      {
        name: "asChild",
        type: "boolean",
        default: "false",
        description: "Whether to render the button as a child element",
        required: false,
      },
      {
        name: "className",
        type: "string",
        description: "Additional CSS classes to apply to the button",
        required: false,
      },
    ],
    variants: [
      {
        name: "default",
        description: "The primary button style with the brand's main color",
      },
      {
        name: "destructive",
        description: "A red button typically used for destructive actions",
      },
      {
        name: "outline",
        description: "A button with a border and transparent background",
      },
      {
        name: "secondary",
        description: "A more subtle button style with secondary colors",
      },
      {
        name: "ghost",
        description: "A button with no background until hovered",
      },
      {
        name: "link",
        description: "A button that looks like a hyperlink",
      },
    ],
    examples: [
      {
        title: "Button Variants",
        description: "Different button variants",
        code: `<div className="flex flex-wrap gap-2">
  <Button>Default</Button>
  <Button variant="destructive">Destructive</Button>
  <Button variant="outline">Outline</Button>
  <Button variant="secondary">Secondary</Button>
  <Button variant="ghost">Ghost</Button>
  <Button variant="link">Link</Button>
</div>`,
      },
      {
        title: "Button Sizes",
        description: "Buttons in different sizes",
        code: `<div className="flex flex-wrap items-center gap-2">
  <Button size="sm">Small</Button>
  <Button size="default">Default</Button>
  <Button size="lg">Large</Button>
  <Button size="icon">
    <Plus className="h-4 w-4" />
  </Button>
</div>`,
      },
      {
        title: "Button with Icon",
        description: "Button with text and icon",
        code: `import { Mail } from "lucide-react";

<Button>
  <Mail className="mr-2 h-4 w-4" />
  Login with Email
</Button>`,
      },
      {
        title: "Disabled Button",
        description: "Button in a disabled state",
        code: `<Button disabled>
  Disabled
</Button>`,
      },
      {
        title: "Loading Button",
        description: "Button with a loading state",
        code: `import { Loader2 } from "lucide-react";

<Button disabled>
  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  Please wait
</Button>`,
      },
    ],
    accessibility:
      "Buttons are accessible by default, using native HTML button elements. They support keyboard navigation and activation with the Enter or Space keys. For custom button appearances, appropriate ARIA attributes are utilized to maintain accessibility.",
  },

  [formatName("Calendar")]: {
    description:
      "A premium date picker component with high-fps animations, glassmorphism, and silky month transitions.",
    import: 'import { Calendar } from "@/components/lightswind/calendar"',
    usage: `import { Calendar } from "@/components/lightswind/calendar";
import { useState } from "react";

export function CalendarDemo() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-2xl border border-gray-200"
    />
  );
}`,
    props: [
      {
        name: "mode",
        type: '"single" | "multiple" | "range"',
        default: '"single"',
        description: "The selection mode of the calendar",
        required: false,
      },
      {
        name: "selected",
        type: "Date | Date[] | DateRange | undefined",
        description: "The selected date(s)",
        required: false,
      },
      {
        name: "onSelect",
        type: "function",
        description: "Event handler called when a date is selected",
        required: false,
      },
      {
        name: "disabled",
        type: "boolean | Date[] | ((date: Date) => boolean)",
        description: "Dates that are disabled and cannot be selected",
        required: false,
      },
      {
        name: "defaultMonth",
        type: "Date",
        description: "The default month shown when the calendar opens",
        required: false,
      },
      {
        name: "fromDate",
        type: "Date",
        description: "The minimum date that can be selected",
        required: false,
      },
      {
        name: "toDate",
        type: "Date",
        description: "The maximum date that can be selected",
        required: false,
      },
      {
        name: "showOutsideDays",
        type: "boolean",
        default: "true",
        description: "Whether to show days from the previous and next months",
        required: false,
      },
      {
        name: "weekStartsOn",
        type: "0 | 1 | 2 | 3 | 4 | 5 | 6",
        default: "0",
        description:
          "The day the week starts on (0 = Sunday, 1 = Monday, etc.)",
        required: false,
      },
      {
        name: "locale",
        type: "Locale",
        description: "The locale to use for formatting dates",
        required: false,
      },
      {
        name: "className",
        type: "string",
        description: "Additional CSS classes to apply to the calendar",
        required: false,
      },
      {
        name: "initialFocus",
        type: "boolean",
        default: "false",
        description: "Whether to focus the calendar on initial render",
        required: false,
      },
    ],
    variants: [
      {
        name: "Single Date Selection",
        description: "Calendar for selecting a single date",
      },
      {
        name: "Multiple Date Selection",
        description: "Calendar for selecting multiple dates",
      },
      {
        name: "Date Range Selection",
        description: "Calendar for selecting a range of dates",
      },
      {
        name: "With Disabled Dates",
        description: "Calendar with certain dates disabled",
      },
    ],
    examples: [
      {
        title: "Single Date Selection",
        description: "Calendar for selecting a single date",
        code: `import { useState } from "react";

function SingleDateCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border"
    />
  );
}`,
      },
      {
        title: "Multiple Date Selection",
        description: "Calendar for selecting multiple dates",
        code: `import { useState } from "react";

function MultiDateCalendar() {
  const [dates, setDates] = useState<Date[] | undefined>([new Date()]);
  
  return (
    <Calendar
      mode="multiple"
      selected={dates}
      onSelect={setDates}
      className="rounded-md border"
    />
  );
}`,
      },
      {
        title: "Date Range Selection",
        description: "Calendar for selecting a range of dates",
        code: `import { useState } from "react";
import { DateRange } from "react-day-picker";

function DateRangeCalendar() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(new Date().setDate(new Date().getDate() + 7)),
  });
  
  return (
    <Calendar
      mode="range"
      selected={dateRange}
      onSelect={setDateRange}
      className="rounded-md border"
    />
  );
}`,
      },
      {
        title: "With Disabled Dates",
        description: "Calendar with disabled dates",
        code: `import { useState } from "react";
import { addDays, isBefore, isAfter } from "date-fns";

function DisabledDatesCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const disabledDays = [
    new Date(2023, 8, 10),
    new Date(2023, 8, 15),
    new Date(2023, 8, 25),
    { from: new Date(2023, 9, 1), to: new Date(2023, 9, 5) },
    (date) => date.getDay() === 0 || date.getDay() === 6, // Disable weekends
  ];
  
  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      disabled={disabledDays}
      className="rounded-md border"
    />
  );
}`,
      },
      {
        title: "With Min/Max Dates",
        description: "Calendar with minimum and maximum selectable dates",
        code: `import { useState } from "react";

function MinMaxDateCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const today = new Date();
  const inOneMonth = new Date(today);
  inOneMonth.setMonth(today.getMonth() + 1);
  
  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      fromDate={today} // Cannot select dates before today
      toDate={inOneMonth} // Cannot select dates after one month from today
      className="rounded-md border"
    />
  );
}`,
      },
    ],
    accessibility:
      "The Calendar component is built with accessibility in mind. It supports keyboard navigation, screen readers, and follows WAI-ARIA design patterns for date pickers. Users can navigate between days, weeks, and months using arrow keys, and can select dates using the Enter or Space keys.",
  },

  [formatName("Card")]: {
    description: "A container that groups related content and actions.",
    import:
      'import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/lightswind/card"',
    usage: `import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/lightswind/card";
import { Button } from "@/components/lightswind/button";

export function CardDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content goes here.</p>
      </CardContent>
      <CardFooter>
        <Button>Deploy</Button>
      </CardFooter>
    </Card>
  );
}`,
    props: [
      {
        name: "hoverable",
        type: "boolean",
        default: "false",
        description: "Makes the card have a hover effect",
        required: false,
      },
      {
        name: "bordered",
        type: "boolean",
        default: "false",
        description: "Makes the card have a bordered appearance",
        required: false,
      },
      {
        name: "compact",
        type: "boolean",
        default: "false",
        description: "Renders the card with compact padding",
        required: false,
      },
      {
        name: "className",
        type: "string",
        description: "Additional CSS classes to apply to the card",
        required: false,
      },
    ],
    variants: [
      {
        name: "Default",
        description: "Standard card with header, content, and footer sections",
      },
      {
        name: "Hoverable",
        description: "Card with hover effect for interactive elements",
      },
      {
        name: "Bordered",
        description: "Card with a visible border",
      },
      {
        name: "Compact",
        description: "Card with reduced padding for compact layouts",
      },
    ],
    examples: [
      {
        title: "Simple Card",
        description: "Basic card with header and content",
        code: `<Card>
  <CardHeader>
    <CardTitle>Team Members</CardTitle>
    <CardDescription>Invite your team members to collaborate.</CardDescription>
  </CardHeader>
  <CardContent>
    <p>You have invited 2 people to your project.</p>
  </CardContent>
</Card>`,
      },
      {
        title: "Interactive Card",
        description: "Card with hover effect and action buttons",
        code: `<Card hoverable>
  <CardHeader>
    <CardTitle>Subscription Plan</CardTitle>
    <CardDescription>Your current plan and usage</CardDescription>
  </CardHeader>
  <CardContent>
    <p>You are currently on the Pro plan.</p>
  </CardContent>
  <CardFooter className="flex justify-between">
    <Button variant="outline">Cancel</Button>
    <Button>Upgrade</Button>
  </CardFooter>
</Card>`,
      },
      {
        title: "Card with Form",
        description: "Card containing a form",
        code: `import { Input } from "@/components/lightswind/input";
import { Label } from "@/components/lightswind/label";

<Card>
  <CardHeader>
    <CardTitle>Login</CardTitle>
    <CardDescription>Enter your credentials to access your account.</CardDescription>
  </CardHeader>
  <CardContent className="space-y-4">
    <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="m@example.com" />
    </div>
    <div className="space-y-2">
      <Label htmlFor="password">Password</Label>
      <Input id="password" type="password" />
    </div>
  </CardContent>
  <CardFooter>
    <Button className="w-full">Sign in</Button>
  </CardFooter>
</Card>`,
      },
      {
        title: "Bordered Card",
        description: "Card with visible border",
        code: `<Card bordered>
  <CardHeader>
    <CardTitle>Notifications</CardTitle>
  </CardHeader>
  <CardContent>
    <p>You have 3 unread messages.</p>
  </CardContent>
  <CardFooter>
    <Button variant="ghost" size="sm">Mark all as read</Button>
  </CardFooter>
</Card>`,
      },
      {
        title: "Card with Custom Header",
        description: "Card with custom styled header",
        code: `<Card>
  <CardHeader className="bg-primary text-primary-foreground">
    <CardTitle>Featured Post</CardTitle>
    <CardDescription className="text-primary-foreground/80">
      Our most popular article this week
    </CardDescription>
  </CardHeader>
  <CardContent className="pt-6">
    <h3 className="text-lg font-bold">10 Tips for Better Productivity</h3>
    <p className="mt-2 text-muted-foreground">
      Learn how to maximize your daily efficiency with these simple tips.
    </p>
  </CardContent>
  <CardFooter>
    <Button variant="outline">Read more</Button>
  </CardFooter>
</Card>`,
      },
    ],
    accessibility:
      "Card components provide a clean visual grouping of content that is accessible to screen readers through proper HTML structure and ARIA attributes where necessary. Cards use appropriate heading levels for titles and maintain content hierarchy.",
  },

  [formatName("Carousel")]: {
    description: "A carousel component with scroll controls and pagination.",
    import: `import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselPrevious, 
  CarouselNext 
} from "@/components/lightswind/carousel"`,
    usage: `<Carousel>
  <CarouselContent>
    {items.map((item) => (
      <CarouselItem key={item.id}>
        <div className="p-1">
          <Card>
            <CardContent className="flex aspect-square items-center justify-center p-6">
              <span className="text-4xl font-semibold">{item.title}</span>
            </CardContent>
          </Card>
        </div>
      </CarouselItem>
    ))}
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>`,
    props: [
      {
        name: "opts",
        type: "CarouselOptions",
        required: true,
        description:
          "Options to configure the carousel behavior. See Embla Carousel documentation for details.",
      },
      {
        name: "plugins",
        type: "CarouselPlugin",
        required: false,
        description:
          "Plugins to extend the carousel functionality. See Embla Carousel documentation for details.",
      },
      {
        name: "orientation",
        type: '"horizontal" | "vertical"',
        required: false,
        description: "The orientation of the carousel.",
      },
      {
        name: "setApi",
        type: "(api: CarouselApi) => void",
        required: false,
        description: "A callback function to get access to the carousel API.",
      },
    ],
    variants: [],
    examples: [
      {
        title: "Default",
        description: "A simple carousel with slides.",
        code: `<Carousel className="w-full max-w-xs">
  <CarouselContent>
    {Array.from({ length: 5 }).map((_, index) => (
      <CarouselItem key={index}>
        <div className="p-1">
          <Card>
            <CardContent className="flex aspect-square items-center justify-center p-6">
              <span className="text-4xl font-semibold">{index + 1}</span>
            </CardContent>
          </Card>
        </div>
      </CarouselItem>
    ))}
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>`,
      },
      {
        title: "Vertical",
        description: "A vertical carousel.",
        code: `<Carousel
  orientation="vertical"
  className="w-full max-w-xs"
>
  <CarouselContent className="-mt-1 h-[200px]">
    {Array.from({ length: 5 }).map((_, index) => (
      <CarouselItem key={index} className="pt-1 md:basis-1/2">
        <Card>
          <CardContent className="flex aspect-video items-center justify-center p-6">
            <span className="text-4xl font-semibold">{index + 1}</span>
          </CardContent>
        </Card>
      </CarouselItem>
    ))}
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>`,
      },
    ],
    accessibility: `
      keyboard: "The carousel supports keyboard navigation using the arrow keys for horizontal navigation.",
      screen_readers: "The carousel has ARIA attributes for accessibility and screen reader support."
    `,
  },

  [formatName("Checkbox")]: {
    description:
      "A control that allows the user to toggle between checked and not checked.",
    import: "import { Checkbox } from '@/components/lightswind/checkbox';",
    usage: `import { Checkbox } from '@/components/lightswind/checkbox';

export function CheckboxDemo() {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <label
        htmlFor="terms"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Accept terms and conditions
      </label>
    </div>
  );
}`,
    props: [
      {
        name: "checked",
        type: "boolean",
        description: "Whether the checkbox is checked.",
        default: "",
        required: false,
      },
      {
        name: "defaultChecked",
        type: "boolean",
        description: "The default checked state when initially rendered.",
        default: "false",
        required: false,
      },
      {
        name: "onCheckedChange",
        type: "(checked: boolean) => void",
        description: "Event handler called when the checked state changes.",
        default: "",
        required: false,
      },
      {
        name: "disabled",
        type: "boolean",
        description:
          "When true, prevents the user from interacting with the checkbox.",
        default: "false",
        required: false,
      },
      {
        name: "required",
        type: "boolean",
        description:
          "When true, indicates that the user must check the checkbox before the form can be submitted.",
        default: "false",
        required: false,
      },
    ],
    examples: [
      {
        title: "Basic Checkbox",
        description: "A simple checkbox with label",
        code: `<div className="flex items-center space-x-2">
  <Checkbox id="terms" />
  <label htmlFor="terms" className="text-sm">
    Accept terms and conditions
  </label>
</div>`,
      },
      {
        title: "Disabled Checkbox",
        description: "A checkbox that cannot be interacted with",
        code: `<div className="flex items-center space-x-2">
  <Checkbox id="disabled" disabled />
  <label htmlFor="disabled" className="text-sm text-muted-foreground">
    This option is disabled
  </label>
</div>`,
      },
      {
        title: "Controlled Checkbox",
        description: "Managing checkbox state with React state",
        code: `import { useState } from "react";

function ControlledCheckbox() {
  const [checked, setChecked] = useState(false);
  
  return (
    <div className="flex items-center space-x-2">
      <Checkbox 
        id="controlled" 
        checked={checked} 
        onCheckedChange={setChecked} 
      />
      <label htmlFor="controlled" className="text-sm">
        {checked ? "Checked" : "Unchecked"}
      </label>
    </div>
  );
}`,
      },
    ],
    accessibility:
      "Checkboxes follow the WAI-ARIA Checkbox Pattern. They are keyboard navigable and support all standard keyboard interactions for checkboxes. The component also manages focus states and conveys the checked state to assistive technologies.",
  },

  [formatName("Collapsible")]: {
    description:
      "An interactive component that can be expanded or collapsed to reveal or hide content.",
    import: `import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent
} from "@/components/lightswind/collapsible"`,
    usage: `<Collapsible>
  <CollapsibleTrigger>Toggle</CollapsibleTrigger>
  <CollapsibleContent>
    <p>Content that can be expanded or collapsed.</p>
  </CollapsibleContent>
</Collapsible>`,
    props: [
      {
        name: "open",
        type: "boolean",
        required: false,
        description: "Controls the open state of the collapsible.",
      },
      {
        name: "defaultOpen",
        type: "boolean",
        required: false,
        description: "The default open state when initially rendered.",
      },
      {
        name: "disabled",
        type: "boolean",
        required: false,
        description:
          "When true, prevents user interaction with the collapsible.",
      },
      {
        name: "onOpenChange",
        type: "(open: boolean) => void",
        required: false,
        description: "Event handler called when the open state changes.",
      },
    ],
    variants: [],
    examples: [
      {
        title: "Default",
        description:
          "A simple collapsible component with a trigger and content.",
        code: `<Collapsible className="w-full space-y-2">
  <div className="flex items-center justify-between space-x-4">
    <h4 className="text-sm font-semibold">
      Collapsible Section
    </h4>
    <CollapsibleTrigger asChild>
      <Button variant="ghost" size="sm">
        <ChevronDown className="h-4 w-4" />
        <span className="sr-only">Toggle</span>
      </Button>
    </CollapsibleTrigger>
  </div>
  <div className="rounded-md border px-4 py-2  text-sm">
    Some visible content here...
  </div>
  <CollapsibleContent className="space-y-2">
    <div className="rounded-md border px-4 py-2  text-sm">
      Hidden content that expands when the collapsible is opened.
    </div>
  </CollapsibleContent>
</Collapsible>`,
      },
    ],
    accessibility: ` keyboard: "The collapsible can be operated with keyboard, using the Space or Enter key to toggle.",
      screen_readers: "Includes appropriate ARIA attributes for screen readers to announce state changes."
    `,
  },

  [formatName("Command")]: {
    description:
      "A command palette that provides keyboard-centric and search-enabled command execution.",
    import:
      "import { Command, CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandShortcut } from '@/components/lightswind/command';",
    usage: `import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/lightswind/command';
import { CalendarIcon, EnvelopeClosedIcon, FaceIcon, GearIcon, PersonIcon } from '@radix-ui/react-icons';

export function CommandDemo() {
  return (
    <Command className="rounded-lg border shadow-md">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span>Calendar</span>
          </CommandItem>
          <CommandItem>
            <FaceIcon className="mr-2 h-4 w-4" />
            <span>Search Emoji</span>
          </CommandItem>
          <CommandItem>
            <EnvelopeClosedIcon className="mr-2 h-4 w-4" />
            <span>Launch Email</span>
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Settings">
          <CommandItem>
            <PersonIcon className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </CommandItem>
          <CommandItem>
            <GearIcon className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}`,
    props: [
      {
        name: "value",
        type: "string",
        description: "Current value of the command input.",
        default: "",
        required: false,
      },
      {
        name: "onValueChange",
        type: "(value: string) => void",
        description: "Event handler called when the input value changes.",
        default: "",
        required: false,
      },
      {
        name: "filter",
        type: "(value: string, search: string) => boolean",
        description: "Custom filter function for command items.",
        default: "String matching algorithm",
        required: false,
      },
      {
        name: "isLoading",
        type: "boolean",
        description: "Shows a loading state for the command palette.",
        default: "false",
        required: false,
      },
      {
        name: "emptyMessage",
        type: "string",
        description: "Text to display when no results are found.",
        default: "No results found.",
        required: false,
      },
    ],
    examples: [
      {
        title: "Command Dialog",
        description:
          "Command palette in a dialog triggered by a keyboard shortcut",
        code: `import { useState, useEffect } from "react";
import { Command, CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/lightswind/command';

function CommandMenuDialog() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Actions">
          <CommandItem>New File</CommandItem>
          <CommandItem>New Folder</CommandItem>
          <CommandItem>Settings</CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}`,
      },
      {
        title: "With Loading State",
        description:
          "Command palette showing a loading indicator during search",
        code: `import { useState } from "react";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/lightswind/command';

function SearchCommand() {
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");
  
  const handleSearch = (value) => {
    setQuery(value);
    if (value.trim()) {
      setIsLoading(true);
      // Simulate API search
      setTimeout(() => setIsLoading(false), 1000);
    } else {
      setIsLoading(false);
    }
  };
  
  return (
    <Command className="rounded-lg border shadow-md">
      <CommandInput 
        placeholder="Search..." 
        value={query}
        onValueChange={handleSearch}
        isLoading={isLoading}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Results">
          {!isLoading && query && (
            <>
              <CommandItem>Result 1</CommandItem>
              <CommandItem>Result 2</CommandItem>
            </>
          )}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}`,
      },
      {
        title: "With Keyboard Shortcuts",
        description: "Command palette displaying keyboard shortcuts",
        code: `import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandShortcut } from '@/components/lightswind/command';

function ShortcutsCommand() {
  return (
    <Command className="rounded-lg border shadow-md">
      <CommandInput placeholder="Type a command..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Actions">
          <CommandItem>
            <span>New File</span>
            <CommandShortcut>⌘N</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <span>Save</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <span>Find</span>
            <CommandShortcut>⌘F</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}`,
      },
    ],
    accessibility:
      "The Command component follows ARIA best practices for comboboxes and listboxes. It provides keyboard navigation, focus management, screen reader announcements, and supports all standard keyboard interactions for menus and listboxes.",
  },

  [formatName("Context Menu")]: {
    import:
      'import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem } from "@/components/lightswind/context-menu"',
    description:
      "Displays a context menu when the user right-clicks or uses the context menu key on an element.",
    props: [
      {
        name: "onOpenChange",
        type: "function",
        description:
          "Event handler called when the open state of the context menu changes",
        required: false,
      },
      {
        name: "modal",
        type: "boolean",
        description:
          "When true, interaction with outside elements will be disabled and only context menu content will be visible to screen readers",
        default: "false",
        required: false,
      },
      {
        name: "disableOutsidePointerEvents",
        type: "boolean",
        description:
          "When true, pointer events outside the context menu will be disabled",
        default: "false",
        required: false,
      },
      {
        name: "defaultOpen",
        type: "boolean",
        description: "The initial open state of the context menu",
        default: "false",
        required: false,
      },
      {
        name: "open",
        type: "boolean",
        description: "Controls the open state of the context menu",
        required: false,
      },
      {
        name: "position",
        type: "object",
        description:
          "The position where the context menu should be displayed, with x and y coordinates",
        required: false,
      },
      {
        name: "collisionPadding",
        type: "number",
        description:
          "Distance in pixels from the edge of the viewport to start handling collision",
        default: "10",
        required: false,
      },
      {
        name: "sideOffset",
        type: "number",
        description: "Distance in pixels between the trigger and content",
        default: "4",
        required: false,
      },
    ],
    usage: `// Basic usage
<ContextMenu>
  <ContextMenuTrigger>
    <div className="border p-4 rounded">
      Right click me
    </div>
  </ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem>Profile</ContextMenuItem>
    <ContextMenuItem>Settings</ContextMenuItem>
    <ContextMenuItem>Logout</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>`,
    variants: [
      {
        name: "With Submenu",
        description: "Context menu with nested submenu items",
      },
      {
        name: "With Icons",
        description: "Context menu items with icons",
      },
      {
        name: "With Separators",
        description: "Context menu with item separators",
      },
      {
        name: "With Shortcuts",
        description: "Context menu with keyboard shortcut hints",
      },
    ],
    accessibility:
      "Context menus follow the WAI-ARIA menu pattern. They trap focus within the menu when opened and support keyboard navigation with arrow keys. Pressing Escape closes the menu.",
    examples: [
      {
        title: "With Submenu",
        description: "A context menu with nested items",
        code: `<ContextMenu>
  <ContextMenuTrigger>
    <div className="border p-4 rounded">Right click me</div>
  </ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem>Back</ContextMenuItem>
    <ContextMenuItem>Forward</ContextMenuItem>
    <ContextMenuItem>Reload</ContextMenuItem>
    <ContextMenuSub>
      <ContextMenuSubTrigger>More Tools</ContextMenuSubTrigger>
      <ContextMenuSubContent>
        <ContextMenuItem>Save Page As...</ContextMenuItem>
        <ContextMenuItem>Create Shortcut...</ContextMenuItem>
        <ContextMenuItem>View Page Source</ContextMenuItem>
      </ContextMenuSubContent>
    </ContextMenuSub>
  </ContextMenuContent>
</ContextMenu>`,
      },
      {
        title: "With Icons",
        description: "Context menu items with leading icons",
        code: `<ContextMenu>
  <ContextMenuTrigger>
    <div className="border p-4 rounded">Right click me</div>
  </ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem>
      <User className="mr-2 h-4 w-4" /> Profile
    </ContextMenuItem>
    <ContextMenuItem>
      <Settings className="mr-2 h-4 w-4" /> Settings
    </ContextMenuItem>
    <ContextMenuSeparator />
    <ContextMenuItem>
      <LogOut className="mr-2 h-4 w-4" /> Logout
    </ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>`,
      },
    ],
  },

  [formatName("Dialog")]: {
    import:
      'import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/lightswind/dialog"',
    description:
      "A modal window overlaid on the primary window, rendering content that requires user interaction.",
    usage: `<Dialog>
  <DialogTrigger asChild>
    <Button variant="outline">Show Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>Dialog Description</DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>`,
    variants: [],
    accessibility:
      "The dialog component uses the aria-modal attribute to indicate that it is a modal dialog. It also uses the aria-labelledby and aria-describedby attributes to provide a title and description for the dialog.",
    examples: [
      {
        title: "Default",
        code: `<DialogDemo />`,
      },
    ],
  },

  [formatName("Drawer")]: {
    description:
      "A drawer component that slides in from the edge of the screen.",
    import: `import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerClose,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription
} from "@/components/lightswind/drawer"`,
    usage: `<Drawer>
  <DrawerTrigger>Open Drawer</DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Drawer Title</DrawerTitle>
      <DrawerDescription>Drawer description text goes here.</DrawerDescription>
    </DrawerHeader>
    <div className="p-4">Drawer content goes here</div>
    <DrawerFooter>
      <Button>Save changes</Button>
      <DrawerClose>Cancel</DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>`,
    props: [
      {
        name: "defaultOpen",
        type: "boolean",
        required: false,
        description:
          "The default open state of the drawer when initially rendered.",
      },
      {
        name: "open",
        type: "boolean",
        required: false,
        description: "Controls the open state of the drawer.",
      },
      {
        name: "onOpenChange",
        type: "(open: boolean) => void",
        required: false,
        description:
          "Event handler called when the open state of the drawer changes.",
      },
    ],
    variants: [],
    examples: [
      {
        title: "Bottom Drawer",
        code: `<Drawer>
  <DrawerTrigger asChild>
    <Button variant="outline">Open Drawer</Button>
  </DrawerTrigger>
  <DrawerContent>
    <div className="mx-auto w-full max-w-sm">
      <DrawerHeader>
        <DrawerTitle>Edit Profile</DrawerTitle>
        <DrawerDescription>
          Make changes to your profile here. Click save when you're done.
        </DrawerDescription>
      </DrawerHeader>
      <div className="p-4 pb-0">
        <div className="flex items-center justify-center space-x-2">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-muted">
            <User className="h-10 w-10" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between space-x-2">
              <h4 className="text-sm font-semibold">John Doe</h4>
              <div className="text-xs text-muted-foreground">@johndoe</div>
            </div>
            <div className="text-xs text-muted-foreground">
              Joined January 2022
            </div>
          </div>
        </div>
      </div>
      <DrawerFooter className="pt-2">
        <Button>Save changes</Button>
        <DrawerClose asChild>
          <Button variant="outline">Cancel</Button>
        </DrawerClose>
      </DrawerFooter>
    </div>
  </DrawerContent>
</Drawer>`,
      },
    ],
    accessibility: ` keyboard: "The drawer can be closed using the Escape key. Focus is trapped within the drawer when open.",
      screen_readers: "Uses appropriate ARIA attributes to ensure screen reader accessibility."`,
  },

  [formatName("Dropdown Menu")]: {
    description:
      "Displays a menu to the user — such as a set of actions or functions — triggered by a button.",
    import: `import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup
} from "@/components/lightswind/dropdown-menu"`,
    usage: `<DropdownMenu>
  <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Profile</DropdownMenuMenuItem>
    <DropdownMenuItem>Billing</DropdownMenuItem>
    <DropdownMenuItem>Settings</DropdownMenuItem>
    <DropdownMenuItem>Logout</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`,
    props: [
      {
        name: "defaultOpen",
        type: "boolean",
        required: false,
        description:
          "The default open state of the dropdown menu when initially rendered.",
      },
      {
        name: "open",
        type: "boolean",
        required: false,

        description: "Controls the open state of the dropdown menu.",
      },
      {
        name: "onOpenChange",
        type: "(open: boolean) => void",
        required: false,

        description: "Event handler called when the open state changes.",
      },
      {
        name: "hoverMode",
        type: "boolean",
        required: false,
        description:
          "When true, the dropdown will open on hover rather than click.",
      },
    ],
    variants: [
      {
        name: "variant",
        description: "Controls the style of the dropdown menu content.",
      },
    ],
    examples: [
      {
        title: "Default",
        code: `<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Open Menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent className="w-56">
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuGroup>
      <DropdownMenuItem>
        <User className="mr-2 h-4 w-4" />
        <span>Profile</span>
        <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <CreditCard className="mr-2 h-4 w-4" />
        <span>Billing</span>
        <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Settings className="mr-2 h-4 w-4" />
        <span>Settings</span>
        <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Keyboard className="mr-2 h-4 w-4" />
        <span>Keyboard shortcuts</span>
        <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
      </DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />
    <DropdownMenuItem>
      <LogOut className="mr-2 h-4 w-4" />
      <span>Log out</span>
      <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`,
      },
      {
        title: "With Hover Mode",
        code: `<DropdownMenu hoverMode>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Hover Me</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Settings</DropdownMenuItem>
    <DropdownMenuItem>Logout</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`,
      },
    ],
    accessibility: `keyboard: "The dropdown menu can be navigated using the Tab key and opened/closed using the Space or Enter key.",
      screen_readers: "Uses appropriate ARIA attributes to ensure screen reader accessibility."`,
  },

  [formatName("Form")]: {
    import:
      'import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/lightswind/form"',
    description:
      "Building forms with React Hook Form and validation with Zod schema.",
    props: [
      {
        name: "formSchema",
        type: "z.ZodObject",
        description: "The Zod schema for form validation",
        required: true,
      },
      {
        name: "defaultValues",
        type: "object",
        description: "The default values for the form",
        required: false,
      },
      {
        name: "resolver",
        type: "function",
        description:
          "Form resolver function, typically zodResolver to use Zod for validation",
        required: true,
      },
      {
        name: "onSubmit",
        type: "function",
        description:
          "Handler called when the form is submitted and validation passes",
        required: true,
      },
      {
        name: "mode",
        type: "string",
        description:
          "The mode for the form validation (onChange, onBlur, onSubmit, onTouched, all)",
        default: "onSubmit",
        required: false,
      },
      {
        name: "reValidateMode",
        type: "string",
        description:
          "When to re-validate fields after submission (onChange, onBlur, onSubmit)",
        default: "onChange",
        required: false,
      },
      {
        name: "criteriaMode",
        type: "string",
        description:
          "Whether to gather all validation errors or stop at the first one",
        default: "firstError",
        required: false,
      },
      {
        name: "shouldFocusError",
        type: "boolean",
        description:
          "Whether to focus the first error field after submission fails",
        default: "true",
        required: false,
      },
    ],
    usage: `// Basic usage with React Hook Form and Zod
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email.",
  })
})

function ProfileForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: ""
    },
  })
  
  function onSubmit(values) {
    console.log(values)
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter username" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}`,
    variants: [
      {
        name: "Basic Form",
        description: "Simple form with basic validation",
      },
      {
        name: "Multi-step Form",
        description: "Form with multiple steps and navigation",
      },
      {
        name: "Form with Arrays",
        description: "Form with dynamic field arrays",
      },
      {
        name: "Form with Custom Components",
        description: "Form using custom form controls",
      },
    ],
    accessibility:
      "Forms are built with accessibility in mind, using proper labels, ARIA attributes, and error messaging. Form controls maintain focus states and tab order for keyboard navigation.",
    //     examples: [
    //       {
    //         title: "Form with Select and Checkbox",
    //         description: "Form combining different input types",
    //         code: `function ProfileForm() {
    //   const form = useForm({
    //     resolver: zodResolver(formSchema),
    //     defaultValues: {
    //       name: "",
    //       email: "",
    //       role: "",
    //       receiveUpdates: false
    //     },
    //   })

    //   return (
    //     <Form {...form}>
    //       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
    //         <FormField
    //           control={form.control}
    //           name="name"
    //           render={({ field }) => (
    //             <FormItem>
    //               <FormLabel>Name</FormLabel>
    //               <FormControl>
    //                 <Input placeholder="Enter your name" {...field} />
    //               </FormControl>
    //               <FormMessage />
    //             </FormItem>
    //           )}
    //         />
    //         <FormField
    //           control={form.control}
    //           name="email"
    //           render={({ field }) => (
    //             <FormItem>
    //               <FormLabel>Email</FormLabel>
    //               <FormControl>
    //                 <Input placeholder="Enter your email" {...field} />
    //               </FormControl>
    //               <FormMessage />
    //             </FormItem>
    //           )}
    //         />
    //         <FormField
    //           control={form.control}
    //           name="role"
    //           render={({ field }) => (
    //             <FormItem>
    //               <FormLabel>Role</FormLabel>
    //               <Select onValueChange={field.onChange} defaultValue={field.value}>
    //                 <FormControl>
    //                   <SelectTrigger>
    //                     <SelectValue placeholder="Select a role" />
    //                   </SelectTrigger>
    //                 </FormControl>
    //                 <SelectContent>
    //                   <SelectItem value="user">User</SelectItem>
    //                   <SelectItem value="admin">Admin</SelectItem>
    //                   <SelectItem value="manager">Manager</SelectItem>
    //                 </SelectContent>
    //               </Select>
    //               <FormMessage />
    //             </FormItem>
    //           )}
    //         />
    //         <FormField
    //           control={form.control}
    //           name="receiveUpdates"
    //           render={({ field }) => (
    //             <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
    //               <FormControl>
    //                 <Checkbox
    //                   checked={field.value}
    //                   onCheckedChange={field.onChange}
    //                 />
    //               </FormControl>
    //               <div className="space-y-1 leading-none">
    //                 <FormLabel>Receive updates</FormLabel>
    //                 <FormDescription>
    //                   Get notified about new features and updates.
    //                 </FormDescription>
    //               </div>
    //             </FormItem>
    //           )}
    //         />
    //         <Button type="submit">Submit</Button>
    //       </form>
    //     </Form>
    //   )
    // }`,
    //       },
    //       {
    //         title: "Form with Validation",
    //         description: "Form with complex validation rules",
    //         code: `// Define a complex schema with validation
    // const formSchema = z.object({
    //   username: z.string()
    //     .min(3, "Username must be at least 3 characters")
    //     .max(20, "Username cannot exceed 20 characters")
    //     .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores and hyphens"),
    //   email: z.string()
    //     .email("Please enter a valid email address"),
    //   password: z.string()
    //     .min(8, "Password must be at least 8 characters")
    //     .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    //     .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    //     .regex(/[0-9]/, "Password must contain at least one number")
    //     .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
    //   confirmPassword: z.string()
    // }).refine((data) => data.password === data.confirmPassword, {
    //   message: "Passwords don't match",
    //   path: ["confirmPassword"],
    // });

    // function RegistrationForm() {
    //   const form = useForm({
    //     resolver: zodResolver(formSchema),
    //     mode: "onChange",
    //     defaultValues: {
    //       username: "",
    //       email: "",
    //       password: "",
    //       confirmPassword: ""
    //     },
    //   });

    //   return (
    //     <Form {...form}>
    //       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
    //         {/* Form fields implementation */}
    //       </form>
    //     </Form>
    //   );
    // }`,
    //       },
    //     ],
  },

  [formatName("Hover Card")]: {
    description:
      "A card that appears when hovering over a trigger element, providing additional information or context.",
    import: `import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/lightswind/hover-card";`,
    usage: `import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/lightswind/hover-card";
import { Button } from "@/components/lightswind/button";

export function HoverCardDemo() {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">Hover me</Button>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="p-2">
          <h4 className="font-medium">Hover Card Content</h4>
          <p className="text-sm text-muted-foreground">
            Additional information displayed on hover.
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}`,
    props: [
      {
        name: "open",
        type: "boolean",
        description: "Whether the hover card is open (controlled)",
        required: false,
      },
      {
        name: "onOpenChange",
        type: "function",
        description: "Callback when the open state changes",
        required: false,
      },
      {
        name: "defaultOpen",
        type: "boolean",
        description: "Whether the hover card is open by default (uncontrolled)",
        default: "false",
        required: false,
      },
      {
        name: "openDelay",
        type: "number",
        description: "Delay in ms before opening",
        default: "700",
        required: false,
      },
      {
        name: "closeDelay",
        type: "number",
        description: "Delay in ms before closing",
        default: "300",
        required: false,
      },
    ],
    examples: [
      {
        title: "User Profile Preview",
        description: "A hover card that displays a user profile preview",
        code: `import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/lightswind/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/lightswind/avatar";
import { CalendarDays } from "lucide-react";

export function UserHoverCard() {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <a href="#" className="text-primarylw hover:underline">@johndoe</a>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <Avatar>
            <AvatarImage src="https://github.com/vercel.png" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">John Doe</h4>
            <p className="text-sm">
              Software developer and open-source contributor
            </p>
            <div className="flex items-center pt-2">
              <CalendarDays className="mr-2 h-4 w-4 opacity-70" />
              <span className="text-xs text-muted-foreground">
                Joined December 2021
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}`,
      },
    ],
    accessibility:
      "The Hover Card component is designed to be accessible. It can be triggered by keyboard focus in addition to mouse hover, ensuring keyboard users can access the additional information.",
  },

  [formatName("Input")]: {
    description: "A text input field that allows users to enter data.",
    import: "import { Input } from '@/components/lightswind/input';",
    usage: `import { Input } from '@/components/lightswind/input';

export function InputDemo() {
  return <Input type="text" placeholder="Email" />;
}`,
    props: [
      {
        name: "type",
        type: "string",
        description:
          "The type of the input field (text, email, password, etc).",
        default: "text",
        required: false,
      },
      {
        name: "placeholder",
        type: "string",
        description: "Placeholder text to display when the input is empty.",
        default: "",
        required: false,
      },
      {
        name: "value",
        type: "string",
        description: "The controlled value of the input.",
        default: "",
        required: false,
      },
      {
        name: "defaultValue",
        type: "string",
        description: "The default value when the input is initially rendered.",
        default: "",
        required: false,
      },
      {
        name: "disabled",
        type: "boolean",
        description:
          "When true, prevents the user from interacting with the input.",
        default: "false",
        required: false,
      },
      {
        name: "readOnly",
        type: "boolean",
        description: "When true, makes the input non-editable.",
        default: "false",
        required: false,
      },
    ],
    examples: [
      {
        title: "Text Input",
        description: "Basic text input with placeholder",
        code: `<Input type="text" placeholder="Enter your name" />`,
      },
      {
        title: "Password Input",
        description: "Input field for password entry",
        code: `<Input type="password" placeholder="Enter password" />`,
      },
      {
        title: "Email Input",
        description: "Input field optimized for email entry",
        code: `<Input 
  type="email" 
  placeholder="name@example.com" 
  autoComplete="email" 
/>`,
      },
      {
        title: "Disabled Input",
        description: "Input field that cannot be interacted with",
        code: `<Input 
  type="text" 
  value="This field cannot be edited" 
  disabled 
/>`,
      },
      {
        title: "Input with Label",
        description: "Input field with associated label",
        code: `import { Label } from "@/components/lightswind/label";

function LabeledInput() {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input type="email" id="email" placeholder="Email" />
    </div>
  );
}`,
      },
    ],
    accessibility:
      "The Input component follows standard HTML input practices for accessibility. It supports keyboard focus, screen reader announcements, and can be paired with form labels to provide accessible names. Use appropriate ARIA attributes when creating complex input patterns.",
  },

  [formatName("Label")]: {
    description:
      "A form label component that can be associated with form controls to improve accessibility.",
    import: "import { Label } from '@/components/lightswind/label';",
    usage: `import { Label } from '@/components/lightswind/label';
import { Input } from '@/components/lightswind/input';

export function LabelDemo() {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input type="email" id="email" placeholder="Email" />
    </div>
  );
}`,
    props: [
      {
        name: "htmlFor",
        type: "string",
        description:
          "The ID of the form control this label is associated with.",
        default: "",
        required: false,
      },
      {
        name: "required",
        type: "boolean",
        description:
          "When true, indicates that the associated form control requires user input.",
        default: "false",
        required: false,
      },
      {
        name: "disabled",
        type: "boolean",
        description: "When true, visually shows the label as disabled.",
        default: "false",
        required: false,
      },
    ],
    examples: [
      {
        title: "Basic Label",
        description: "Simple label for a form control",
        code: `<Label htmlFor="username">Username</Label>
<Input id="username" />`,
      },
      {
        title: "Required Label",
        description: "Label for a required form field with visual indicator",
        code: `<Label htmlFor="password" required>
  Password <span className="text-destructive">*</span>
</Label>
<Input id="password" type="password" required />`,
      },
      {
        title: "Disabled Label",
        description: "Label for a disabled form control",
        code: `<Label htmlFor="disabled-input" disabled>
  Disabled field
</Label>
<Input id="disabled-input" disabled />`,
      },
      {
        title: "Label with Description",
        description: "Label with additional helper text",
        code: `<div className="space-y-2">
  <Label htmlFor="description">Bio</Label>
  <p className="text-xs text-muted-foreground">
    Write a short description about yourself.
  </p>
  <Input id="description" />
</div>`,
      },
    ],
    accessibility:
      "The Label component establishes a programmatic relationship with form controls using the htmlFor attribute, which significantly improves accessibility by ensuring screen readers can announce the label when the corresponding form control receives focus.",
  },

  [formatName("Menubar")]: {
    import:
      'import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem, MenubarSeparator, MenubarLabel, MenubarShortcut } from "@/components/lightswind/menubar"',
    description:
      "A horizontal navigation component with dropdown menus for organizing features.",
    usage: `<Menubar>
  <MenubarMenu>
    <MenubarTrigger>File</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>New</MenubarItem>
    </MenubarContent>
  </MenubarMenu>
</Menubar>`,
    variants: [],
    accessibility:
      "The menubar component uses the aria-haspopup attribute to indicate that the trigger element controls a menubar. It also uses the aria-expanded attribute to indicate whether the menubar is expanded.",
    examples: [
      {
        title: "Default",
        code: `<MenubarDemo />`,
      },
    ],
  },

  [formatName("Navigation Menu")]: {
    description:
      "A responsive navigation component with flyout menus for site navigation.",
    import: `import { 
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink
} from "@/components/lightswind/navigation-menu"`,
    usage: `<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px]">
          <li className="row-span-3">
            <NavigationMenuLink asChild>
              <a href="/docs">Documentation</a>
            </NavigationMenuLink>
          </li>
          <li>
            <NavigationMenuLink asChild>
              <a href="/docs/installation">Installation</a>
            </NavigationMenuLink>
          </li>
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <NavigationMenuLink href="/components">Components</NavigationMenuLink>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>`,
    props: [
      {
        name: "value",
        type: "string",
        default: "",
        description:
          "For NavigationMenuItem - a unique identifier for the menu item",
        required: false,
      },
      {
        name: "forceMount",
        type: "boolean",
        default: "false",
        description:
          "For NavigationMenuContent - when true, content will be mounted even when its menu is closed",
        required: false,
      },
      {
        name: "id",
        type: "string",
        default: "",
        description:
          "For NavigationMenuContent and NavigationMenuTrigger - an identifier that links content to its trigger",
        required: false,
      },
    ],
    variants: [],
    examples: [
      {
        title: "Simple Navigation",
        code: `<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuLink href="/">Home</NavigationMenuLink>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <NavigationMenuLink href="/about">About</NavigationMenuLink>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <NavigationMenuLink href="/contact">Contact</NavigationMenuLink>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>`,
      },
      {
        title: "With Dropdown Menus",
        code: `<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger>Products</NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid gap-3 p-4 w-[400px]">
          <li>
            <NavigationMenuLink asChild>
              <a href="/products/hardware">Hardware</a>
            </NavigationMenuLink>
          </li>
          <li>
            <NavigationMenuLink asChild>
              <a href="/products/software">Software</a>
            </NavigationMenuLink>
          </li>
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <NavigationMenuTrigger>Services</NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid gap-3 p-4 w-[400px]">
          <li>
            <NavigationMenuLink asChild>
              <a href="/services/consulting">Consulting</a>
            </NavigationMenuLink>
          </li>
          <li>
            <NavigationMenuLink asChild>
              <a href="/services/support">Support</NavigationMenuLink>
          </li>
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>`,
      },
    ],
    accessibility:
      "Menu items that trigger sub-menus have the aria-haspopup attribute. When a menu is open, the trigger has aria-expanded=true. Supports keyboard navigation between menu items. Focus is managed to ensure usability.",
  },

  [formatName("Pagination")]: {
    import:
      'import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext, PaginationLink, PaginationEllipsis } from "@/components/lightswind/pagination"',
    description: "Controls for navigating through multiple pages of content.",
    usage: `<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink>1</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationNext />
    </PaginationItem>
  </PaginationContent>
</Pagination>`,
    variants: [],
    accessibility:
      "The pagination component uses the aria-label attribute to provide a description of the pagination. It also uses the aria-disabled attribute to indicate that a navigation button is disabled.",
    examples: [
      {
        title: "Default",
        code: `<PaginationDemo />`,
      },
    ],
  },

  [formatName("Popover")]: {
    description:
      "A small overlay that appears relative to a trigger element, containing additional UI or information.",
    import: `import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/lightswind/popover";`,
    usage: `import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/lightswind/popover";
import { Button } from "@/components/lightswind/button";

export function PopoverDemo() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button>Open Popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="p-2">
          <p>Popover content goes here.</p>
        </div>
      </PopoverContent>
    </Popover>
  );
}`,
    props: [
      {
        name: "open",
        type: "boolean",
        description: "Whether the popover is open (controlled).",
        required: false,
      },
      {
        name: "onOpenChange",
        type: "(open: boolean) => void",
        description: "Callback function triggered when the open state changes.",
        required: false,
      },
      {
        name: "defaultOpen",
        type: "boolean",
        description: "Whether the popover is open by default (uncontrolled).",
        default: "false",
        required: false,
      },
      {
        name: "closeOnOutsideClick",
        type: "boolean",
        description:
          "Controls if clicking outside the popover content will close it.",
        default: "true",
        required: false,
      },
    ],
    examples: [
      {
        title: "Date Picker",
        description: "A popover that contains a date picker",
        code: `import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/lightswind/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/lightswind/popover";
import { Button } from "@/components/lightswind/button";
import { CalendarIcon } from "lucide-react";

export function DatePickerPopover() {
  const [date, setDate] = useState<Date>();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-[240px] justify-start text-left font-normal"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}`,
      },
    ],
    accessibility:
      "The Popover component follows WAI-ARIA design patterns for popovers. It can be opened and closed via keyboard, and maintains focus management for keyboard accessibility.",
  },

  [formatName("Progress")]: {
    description:
      "Displays an indicator showing the completion progress of a task.",
    import: `import { Progress } from "@/components/lightswind/progress";`,
    usage: `import { Progress } from "@/components/lightswind/progress";

export function ProgressDemo() {
  return <Progress value={60} />;
}`,
    props: [
      {
        name: "value",
        type: "number",
        description: "The progress value between 0 and 100",
        required: false,
      },
      {
        name: "max",
        type: "number",
        description: "The maximum value of the progress",
        default: "100",
        required: false,
      },
    ],
    examples: [
      {
        title: "Indeterminate Progress",
        description: "A progress indicator without a specific value",
        code: `import { Progress } from "@/components/lightswind/progress";

export function IndeterminateProgress() {
  return <Progress className="w-[60%]" />;
}`,
      },
      {
        title: "Progress with Value",
        description: "A progress indicator with a specific value",
        code: `import { useState, useEffect } from "react";
import { Progress } from "@/components/lightswind/progress";

export function ProgressWithValue() {
  const [progress, setProgress] = useState(13);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);

  return <Progress value={progress} className="w-[60%]" />;
}`,
      },
    ],
    accessibility:
      "The Progress component uses the HTML progress element, which provides strong accessibility support. It includes appropriate ARIA attributes to communicate progress to assistive technologies.",
  },

  [formatName("Radio Group")]: {
    import:
      'import { RadioGroup, RadioGroupItem } from "@/components/lightswind/radio-group"',
    description:
      "A control that allows users to select a single option from a list of predefined options.",
    props: [
      {
        name: "value",
        type: "string",
        description: "The controlled value of the radio item to check",
        required: false,
      },
      {
        name: "defaultValue",
        type: "string",
        description: "The default value of the radio group",
        required: false,
      },
      {
        name: "onValueChange",
        type: "function",
        description: "Callback function called when the value changes",
        required: false,
      },
      {
        name: "disabled",
        type: "boolean",
        description:
          "When true, prevents the user from interacting with the radio items",
        default: "false",
        required: false,
      },
      {
        name: "orientation",
        type: "string",
        description:
          "The orientation of the component (horizontal or vertical)",
        default: "vertical",
        required: false,
      },
      {
        name: "customSize",
        type: "string",
        description: "Custom size for the radio items (sm, md, lg)",
        default: "md",
        required: false,
      },
    ],
    usage: `<RadioGroup defaultValue="option-one">
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option-one" id="option-one" />
    <Label htmlFor="option-one">Option One</Label>
  </div>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option-two" id="option-two" />
    <Label htmlFor="option-two">Option Two</Label>
  </div>
</RadioGroup>`,
    variants: [
      {
        name: "Horizontal",
        description: "Radio group with horizontally arranged items",
      },
      {
        name: "Custom Size",
        description: "Radio group with custom sized radio items (sm, md, lg)",
      },
      {
        name: "Disabled",
        description: "Radio group with disabled state",
      },
    ],
    accessibility:
      "Radio groups follow the WAI-ARIA radio pattern. They support keyboard navigation with arrow keys and selection with the Space key.",
    examples: [
      {
        title: "Default",
        code: `<RadioGroupDemo />`,
      },
    ],
  },

  [formatName("Select")]: {
    import:
      'import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/lightswind/select"',
    description:
      "Displays a list of options for the user to pick from—triggered by a button.",
    props: [
      {
        name: "defaultValue",
        type: "string",
        description: "The default value of the select",
        required: false,
      },
      {
        name: "value",
        type: "string",
        description: "The controlled value of the select",
        required: false,
      },
      {
        name: "onValueChange",
        type: "function",
        description: "Callback function called when the value changes",
        required: false,
      },
      {
        name: "disabled",
        type: "boolean",
        description:
          "When true, prevents the user from interacting with the select",
        default: "false",
        required: false,
      },
      {
        name: "placeholder",
        type: "string",
        description: "Text displayed when no value is selected",
        required: false,
      },
    ],
    usage: `<Select>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Theme" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="light">Light</SelectItem>
    <SelectItem value="dark">Dark</SelectItem>
    <SelectItem value="system">System</SelectItem>
  </SelectContent>
</Select>`,
    variants: [
      {
        name: "With Icon",
        description: "Select with leading or trailing icons",
      },
      {
        name: "With Groups",
        description: "Select with grouped options",
      },
      {
        name: "With Search",
        description: "Select with search/filter functionality",
      },
    ],
    accessibility:
      "Select follows the WAI-ARIA combobox pattern. It includes proper aria-controls and aria-expanded states, and supports full keyboard navigation.",
    examples: [
      {
        title: "Default",
        code: `<SelectDemo />`,
      },
    ],
  },

  [formatName("Separator")]: {
    description:
      "A horizontal or vertical line that visually separates content, useful for creating visual hierarchy and grouping related items.",
    import: "import { Separator } from '@/components/lightswind/separator';",
    usage: `import { Separator } from '@/components/lightswind/separator';

export function SeparatorDemo() {
  return (
    <div>
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">Radix Primitives</h4>
        <p className="text-sm text-muted-foreground">
          An open-source UI component library.
        </p>
      </div>
      <Separator className="my-4" />
      <div className="flex h-5 items-center space-x-4 text-sm">
        <div>Blog</div>
        <Separator orientation="vertical" />
        <div>Docs</div>
        <Separator orientation="vertical" />
        <div>Source</div>
      </div>
    </div>
  );
}`,
    props: [
      {
        name: "orientation",
        type: '"horizontal" | "vertical"',
        description: "The orientation of the separator.",
        default: '"horizontal"',
        required: false,
      },
      {
        name: "decorative",
        type: "boolean",
        description: "Whether the separator is decorative or functional.",
        default: "true",
        required: false,
      },
      {
        name: "thickness",
        type: '"thin" | "default" | "thick"',
        description: "The thickness of the separator.",
        default: '"default"',
        required: false,
      },
      {
        name: "lineStyle",
        type: '"solid" | "dashed" | "dotted"',
        description: "The style of the separator line.",
        default: '"solid"',
        required: false,
      },
      {
        name: "variant",
        type: '"default" | "muted" | "accent" | "primary"',
        description: "The color variant of the separator.",
        default: '"default"',
        required: false,
      },
    ],
    examples: [
      {
        title: "Horizontal Separator",
        description: "Basic horizontal separator with margin",
        code: `<div className="space-y-4">
  <div>Content above the separator</div>
  <Separator />
  <div>Content below the separator</div>
</div>`,
      },
      {
        title: "Vertical Separator",
        description: "Separator with vertical orientation for inline content",
        code: `<div className="flex items-center space-x-4">
  <div>First item</div>
  <Separator orientation="vertical" className="h-6" />
  <div>Second item</div>
  <Separator orientation="vertical" className="h-6" />
  <div>Third item</div>
</div>`,
      },
      {
        title: "Styled Separators",
        description:
          "Separators with different styles, thicknesses, and variants",
        code: `<div className="space-y-6">
  <div>
    <h4 className="text-sm font-medium mb-2">Default Separator</h4>
    <Separator />
  </div>
  
  <div>
    <h4 className="text-sm font-medium mb-2">Thick Separator</h4>
    <Separator thickness="thick" />
  </div>
  
  <div>
    <h4 className="text-sm font-medium mb-2">Dashed Separator</h4>
    <Separator lineStyle="dashed" />
  </div>
  
  <div>
    <h4 className="text-sm font-medium mb-2">Dotted Thin Separator</h4>
    <Separator lineStyle="dotted" thickness="thin" />
  </div>
  
  <div>
    <h4 className="text-sm font-medium mb-2">Accent Variant</h4>
    <Separator variant="accent" />
  </div>
  
  <div>
    <h4 className="text-sm font-medium mb-2">Primary Variant (Thick)</h4>
    <Separator variant="primary" thickness="thick" />
  </div>
</div>`,
      },
      {
        title: "Section Divider",
        description: "Using a separator with heading to divide page sections",
        code: `<div className="space-y-8">
  <section>
    <h2 className="text-2xl font-bold">First Section</h2>
    <p className="mt-2 text-muted-foreground">
      This is the content for the first section of the page.
    </p>
  </section>
  
  <Separator thickness="thick" />
  
  <section>
    <h2 className="text-2xl font-bold">Second Section</h2>
    <p className="mt-2 text-muted-foreground">
      This is the content for the second section of the page.
    </p>
  </section>
</div>`,
      },
    ],
    accessibility:
      "The Separator component has a role of separator by default and includes the appropriate ARIA attributes for orientation. When used functionally (non-decorative), it properly communicates the separation between content to assistive technologies. When used decoratively, it is hidden from screen readers to avoid unnecessary announcements.",
  },

  [formatName("Sheet")]: {
    description:
      "A dialog that slides in from the edge of the screen, useful for side panels or drawers.",
    import: `import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/lightswind/sheet";`,
    usage: `import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/lightswind/sheet";
import { Button } from "@/components/lightswind/button";

export function SheetDemo() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Open Sheet</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          {/* Form content here */}
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button>Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}`,
    props: [
      {
        name: "open",
        type: "boolean",
        description: "Whether the sheet is open (controlled)",
        required: false,
      },
      {
        name: "onOpenChange",
        type: "function",
        description: "Callback when the open state changes",
        required: false,
      },
      {
        name: "side",
        type: '"top" | "right" | "bottom" | "left"',
        description: "The side the sheet appears from",
        default: "right",
        required: false,
      },
    ],
    examples: [
      {
        title: "Sheet Sides",
        description: "Sheets that appear from different sides of the screen",
        code: `import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/lightswind/sheet";
import { Button } from "@/components/lightswind/button";

export function SheetSides() {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Top Sheet</Button>
        </SheetTrigger>
        <SheetContent side="top">
          <SheetHeader>
            <SheetTitle>Top Sheet</SheetTitle>
            <SheetDescription>
              This sheet slides in from the top of the screen.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
      
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Right Sheet</Button>
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Right Sheet</SheetTitle>
            <SheetDescription>
              This sheet slides in from the right of the screen.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
      
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Bottom Sheet</Button>
        </SheetTrigger>
        <SheetContent side="bottom">
          <SheetHeader>
            <SheetTitle>Bottom Sheet</SheetTitle>
            <SheetDescription>
              This sheet slides in from the bottom of the screen.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
      
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Left Sheet</Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Left Sheet</SheetTitle>
            <SheetDescription>
              This sheet slides in from the left of the screen.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
}`,
      },
    ],
    accessibility:
      "The Sheet component follows WAI-ARIA dialog design patterns. It properly manages focus, can be dismissed via the ESC key, and implements appropriate ARIA attributes for screen readers.",
  },

  [formatName("Skeleton")]: {
    description:
      "A placeholder preview for content that is loading, reducing layout shift and improving perceived performance.",
    import: `import { Skeleton } from "@/components/lightswind/skeleton";`,
    usage: `import { Skeleton } from "@/components/lightswind/skeleton";

export function SkeletonDemo() {
  return <Skeleton className="h-[20px] w-[100px]" />;
}`,
    props: [
      {
        name: "className",
        type: "string",
        description:
          "Additional CSS classes to customize the skeleton appearance",
        required: false,
      },
    ],
    examples: [
      {
        title: "Card Skeleton",
        description: "A skeleton placeholder for a card layout",
        code: `import { Skeleton } from "@/components/lightswind/skeleton";

export function CardSkeleton() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}`,
      },
      {
        title: "Profile Skeleton",
        description: "A skeleton placeholder for a user profile",
        code: `import { Skeleton } from "@/components/lightswind/skeleton";

export function ProfileSkeleton() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}`,
      },
    ],
    accessibility:
      'Skeletons should be used with appropriate ARIA attributes for indicating loading state. Consider using aria-busy="true" on the parent container when content is loading.',
  },

  [formatName("Slider")]: {
    import: 'import { Slider } from "@/components/lightswind/slider"',
    description: "Allows users to select a value or range from a given range.",
    props: [
      {
        name: "defaultValue",
        type: "number[]",
        description: "The default value of the slider",
        required: false,
      },
      {
        name: "value",
        type: "number[]",
        description: "The controlled value of the slider",
        required: false,
      },
      {
        name: "min",
        type: "number",
        description: "The minimum value of the slider",
        default: "0",
        required: false,
      },
      {
        name: "max",
        type: "number",
        description: "The maximum value of the slider",
        default: "100",
        required: false,
      },
      {
        name: "step",
        type: "number",
        description: "The step value of the slider",
        default: "1",
        required: false,
      },
      {
        name: "onValueChange",
        type: "function",
        description: "Callback function called when the value changes",
        required: false,
      },
      {
        name: "disabled",
        type: "boolean",
        description:
          "When true, prevents the user from interacting with the slider",
        default: "false",
        required: false,
      },
    ],
    usage: `<Slider defaultValue={[33]} max={100} step={1} />`,
    variants: [
      {
        name: "Range",
        description: "Slider that allows selecting a range with two handles",
      },
      {
        name: "With Labels",
        description: "Slider with min, max, and value labels",
      },
    ],
    accessibility:
      "Slider implements WAI-ARIA slider pattern with proper roles and keyboard navigation.",
    examples: [
      {
        title: "Default",
        code: `<SliderDemo />`,
      },
    ],
  },

  [formatName("Switch")]: {
    import: 'import { Switch } from "@/components/lightswind/switch"',
    description:
      "A control that allows users to toggle between checked and not checked.",
    props: [
      {
        name: "checked",
        type: "boolean",
        description: "The controlled checked state of the switch",
        required: false,
      },
      {
        name: "defaultChecked",
        type: "boolean",
        description: "The default checked state when initially rendered",
        default: "false",
        required: false,
      },
      {
        name: "onCheckedChange",
        type: "function",
        description: "Callback function called when the checked state changes",
        required: false,
      },
      {
        name: "disabled",
        type: "boolean",
        description:
          "When true, prevents the user from interacting with the switch",
        default: "false",
        required: false,
      },
      {
        name: "size",
        type: "string",
        description: "The size of the switch (sm, md, lg)",
        default: "md",
        required: false,
      },
      {
        name: "thumbColor",
        type: "string",
        description: "Custom color for the switch thumb",
        required: false,
      },
      {
        name: "trackColor",
        type: "string",
        description: "Custom color for the switch track",
        required: false,
      },
      {
        name: "animation",
        type: "string",
        description: "Animation style for the switch (smooth, bounce, slide)",
        default: "smooth",
        required: false,
      },
    ],
    usage: `<Switch />`,
    variants: [
      {
        name: "With Label",
        description: "Switch with an associated label",
      },
      {
        name: "Custom Colors",
        description: "Switch with custom thumb and track colors",
      },
      {
        name: "Custom Animation",
        description: "Switch with custom animation style",
      },
      {
        name: "Size Variants",
        description: "Switch with different size options (sm, md, lg)",
      },
    ],
    accessibility:
      "Switch follows the WAI-ARIA switch pattern with appropriate roles and states.",
    examples: [
      {
        title: "Default",
        code: `<SwitchDemo />`,
      },
    ],
  },

  [formatName("Table")]: {
    description: "A responsive table component for displaying tabular data.",
    import: `import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/lightswind/table";`,
    usage: `import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/lightswind/table";

export function TableDemo() {
  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>INV001</TableCell>
          <TableCell>Paid</TableCell>
          <TableCell>Credit Card</TableCell>
          <TableCell className="text-right">$250.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>INV002</TableCell>
          <TableCell>Pending</TableCell>
          <TableCell>PayPal</TableCell>
          <TableCell className="text-right">$125.00</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}`,
    props: [
      {
        name: "className",
        type: "string",
        description: "Additional CSS classes for styling",
        required: false,
      },
    ],
    examples: [
      {
        title: "Data Table",
        description: "A more complex data table with sorting",
        code: `import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/lightswind/table";
import { Button } from "@/components/lightswind/button";
import { ArrowUpDown, ChevronDown } from "lucide-react";

const data = [
  { id: "INV001", status: "Paid", method: "Credit Card", amount: "$250.00" },
  { id: "INV002", status: "Pending", method: "PayPal", amount: "$125.00" },
  { id: "INV003", status: "Paid", method: "Bank Transfer", amount: "$350.00" },
  { id: "INV004", status: "Unpaid", method: "Credit Card", amount: "$450.00" },
  { id: "INV005", status: "Paid", method: "PayPal", amount: "$550.00" },
];

export function DataTable() {
  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>
            <Button variant="ghost" className="p-0 h-auto font-medium">
              Invoice
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">
            <Button variant="ghost" className="p-0 h-auto font-medium">
              Amount
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell className="font-medium">{invoice.id}</TableCell>
            <TableCell>{invoice.status}</TableCell>
            <TableCell>{invoice.method}</TableCell>
            <TableCell className="text-right">{invoice.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}`,
      },
    ],
    accessibility:
      "The Table component is built on semantic HTML table elements, providing good accessibility by default. Use TableCaption to provide a summary of the table content for screen readers, and ensure table headers are properly associated with their cells.",
  },

  [formatName("Tabs")]: {
    import:
      'import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/lightswind/tabs"',
    description:
      "A set of layered sections of content that display one panel at a time.",
    props: [
      {
        name: "defaultValue",
        type: "string",
        description: "The default selected tab value",
        required: false,
      },
      {
        name: "value",
        type: "string",
        description: "The controlled selected tab value",
        required: false,
      },
      {
        name: "onValueChange",
        type: "function",
        description: "Callback function called when the selected tab changes",
        required: false,
      },
    ],
    usage: `<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">Account settings.</TabsContent>
  <TabsContent value="password">Password settings.</TabsContent>
</Tabs>`,
    variants: [
      {
        name: "Animated",
        description: "Tabs with smooth animations between content panels",
      },
      {
        name: "Responsive",
        description: "Tabs that adapt to different screen sizes",
      },
    ],
    accessibility:
      "Tabs follow the WAI-ARIA tabs pattern with proper roles, states, and keyboard navigation.",
    examples: [
      {
        title: "Default",
        code: `<TabsDemo />`,
      },
    ],
  },

  [formatName("Textarea")]: {
    description:
      "A multi-line text input field that allows users to enter longer form content.",
    import: "import { Textarea } from '@/components/lightswind/textarea';",
    usage: `import { Textarea } from '@/components/lightswind/textarea';
import { Label } from '@/components/lightswind/label';

export function TextareaDemo() {
  return (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="message">Your message</Label>
      <Textarea placeholder="Type your message here." id="message" />
    </div>
  );
}`,
    props: [
      {
        name: "placeholder",
        type: "string",
        description: "Placeholder text to display when the textarea is empty.",
        default: "",
        required: false,
      },
      {
        name: "value",
        type: "string",
        description: "The controlled value of the textarea.",
        default: "",
        required: false,
      },
      {
        name: "defaultValue",
        type: "string",
        description:
          "The default value when the textarea is initially rendered.",
        default: "",
        required: false,
      },
      {
        name: "disabled",
        type: "boolean",
        description:
          "When true, prevents the user from interacting with the textarea.",
        default: "false",
        required: false,
      },
      {
        name: "required",
        type: "boolean",
        description: "When true, indicates that the user must provide a value.",
        default: "false",
        required: false,
      },
      {
        name: "readOnly",
        type: "boolean",
        description: "When true, makes the textarea non-editable.",
        default: "false",
        required: false,
      },
      {
        name: "rows",
        type: "number",
        description: "The number of visible text lines.",
        default: "",
        required: false,
      },
    ],
    examples: [
      {
        title: "Basic Textarea",
        description: "Simple textarea with placeholder",
        code: `<Textarea placeholder="Type your comment here." />`,
      },
      {
        title: "With Row Count",
        description: "Setting a specific number of visible rows",
        code: `<Textarea 
  placeholder="This textarea has 5 visible rows." 
  rows={5} 
/>`,
      },
      {
        title: "Disabled Textarea",
        description: "Textarea that cannot be interacted with",
        code: `<Textarea 
  value="This content cannot be edited." 
  disabled 
/>`,
      },
      {
        title: "Form Integration",
        description: "Using textarea in a form with React Hook Form",
        code: `import { useForm } from "react-hook-form";
import { Label } from "@/components/lightswind/label";
import { Textarea } from "@/components/lightswind/textarea";
import { Button } from "@/components/lightswind/button";

function CommentForm() {
  const { register, handleSubmit } = useForm();
  
  const onSubmit = (data) => {
    console.log(data);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="comment">Your comment</Label>
        <Textarea 
          id="comment"
          placeholder="Leave a comment..." 
          {...register("comment", { required: true })}
        />
      </div>
      <Button type="submit">Submit</Button>
    </form>
  );
}`,
      },
    ],
    accessibility:
      "The Textarea component follows standard HTML textarea practices for accessibility. It supports keyboard focus, screen reader announcements, and can be paired with form labels to provide accessible names. Ensure you use the Label component with proper htmlFor attributes to maintain accessibility.",
  },

  [formatName("Toast")]: {
    description:
      "A notification component used to provide feedback to the user about an action or system event.",
    import: "import { useToast } from '@/components/lightswind/use-toast';\nimport { Toaster } from '@/components/lightswind/toaster';\nimport { ToastAction } from '@/components/lightswind/toast';",
    usage: `import { useToast } from '@/components/lightswind/use-toast';
import { ToastAction } from '@/components/lightswind/toast';
import { Button } from '@/components/lightswind/button';

export function ToastDemo() {
  const { toast } = useToast();
  
  return (
    <Button
      onClick={() => {
        toast({
          title: "Scheduled",
          description: "Your meeting has been scheduled for 4:30 PM.",
          action: (
            <ToastAction altText="Goto schedule to undo">Undo</ToastAction>
          ),
        })
      }}
    >
      Show Toast
    </Button>
  );
}`,
    props: [
      {
        name: "title",
        type: "string",
        description: "The title of the toast notification.",
        default: "",
        required: false,
      },
      {
        name: "description",
        type: "string",
        description: "The description of the toast notification.",
        default: "",
        required: false,
      },
      {
        name: "variant",
        type: "default | destructive | success | warning | info",
        description: "The variant of the toast notification.",
        default: "default",
        required: false,
      },
      {
        name: "position",
        type: "top-right | top-left | bottom-right | bottom-left | top-center | bottom-center",
        description: "The positioning of the toast stack (configured on the <Toaster /> component).",
        default: "top-right",
        required: false,
      },
      {
        name: "duration",
        type: "number",
        description:
          "The duration in milliseconds the toast will stay visible.",
        default: "5000",
        required: false,
      },
      {
        name: "action",
        type: "React.ReactNode",
        description: "An action component to display alongside the toast.",
        default: "",
        required: false,
      },
    ],
    variants: [
      {
        name: "default",
        description: "The default style for toast notifications.",
      },
      {
        name: "destructive",
        description: "A destructive style for error or warning notifications.",
      },
      {
        name: "success",
        description: "A specialized style for success feedback.",
      },
      {
        name: "warning",
        description: "A specialized style for warning notifications.",
      },
      {
        name: "info",
        description: "A specialized style for informational updates.",
      },
    ],
    examples: [
      {
        title: "Success Toast",
        description: "Show a success message with an action button",
        code: `toast({
  variant: "success",
  title: "Success!",
  description: "Your changes have been saved.",
})`,
      },
      {
        title: "Error Toast",
        description: "Show an error message with destructive variant",
        code: `toast({
  variant: "destructive",
  title: "Error",
  description: "Something went wrong. Please try again.",
})`,
      },
      {
        title: "Global Positioning",
        description: "Configure the default position in your layout",
        code: `// In your layout file
import { Toaster } from "@/components/lightswind/toaster";

export default function Layout({ children }) {
  return (
    <>
      {children}
      <Toaster position="bottom-right" />
    </>
  );
}`,
      },
      {
        title: "Custom Duration",
        description: "Show a toast with a longer display duration",
        code: `toast({
  title: "Long Notification",
  description: "This notification will stay visible for 10 seconds.",
  duration: 10000,
})`,
      },
    ],
    accessibility:
      "Toast notifications use ARIA live regions to announce their content to screen readers. They are also keyboard navigable and can be dismissed using the Escape key.",
  },

  [formatName("Toggle")]: {
    import: 'import { Toggle } from "@/components/lightswind/toggle"',
    description: "A two-state button that can be toggled on or off.",
    props: [
      {
        name: "pressed",
        type: "boolean",
        description: "The controlled pressed state of the toggle",
        required: false,
      },
      {
        name: "defaultPressed",
        type: "boolean",
        description: "The default pressed state when initially rendered",
        default: "false",
        required: false,
      },
      {
        name: "onPressedChange",
        type: "function",
        description: "Callback function called when the pressed state changes",
        required: false,
      },
      {
        name: "disabled",
        type: "boolean",
        description:
          "When true, prevents the user from interacting with the toggle",
        default: "false",
        required: false,
      },
      {
        name: "variant",
        type: "string",
        description: "Visual variant (default, outline)",
        default: "default",
        required: false,
      },
      {
        name: "size",
        type: "string",
        description: "Size of the toggle (default, sm, lg)",
        default: "default",
        required: false,
      },
    ],
    usage: `<Toggle>Click me</Toggle>`,
    variants: [
      {
        name: "Outline",
        description: "Toggle with an outline style",
      },
      {
        name: "With Icon",
        description: "Toggle with an icon alongside text",
      },
      {
        name: "Size Variants",
        description: "Toggle with different size options",
      },
    ],
    accessibility:
      "Toggle follows the WAI-ARIA button pattern with proper pressed state.",
    examples: [
      {
        title: "Default",
        code: `<ToggleDemo />`,
      },
    ],
  },

  [formatName("Toggle Group")]: {
    import:
      'import { ToggleGroup, ToggleGroupItem } from "@/components/lightswind/toggle-group"',
    description: "A set of two-state buttons that can be toggled on or off.",
    props: [
      {
        name: "type",
        type: "string",
        description: "The type of toggle group (single, multiple)",
        required: true,
      },
      {
        name: "value",
        type: "string | string[]",
        description: "The controlled value of the toggle group",
        required: false,
      },
      {
        name: "defaultValue",
        type: "string | string[]",
        description: "The default value of the toggle group",
        required: false,
      },
      {
        name: "onValueChange",
        type: "function",
        description: "Callback function called when the value changes",
        required: false,
      },
      {
        name: "disabled",
        type: "boolean",
        description:
          "When true, prevents the user from interacting with the toggle group",
        default: "false",
        required: false,
      },
      {
        name: "variant",
        type: "string",
        description: "Visual variant (default, outline)",
        default: "default",
        required: false,
      },
      {
        name: "size",
        type: "string",
        description: "Size of the toggle group items (default, sm, lg)",
        default: "default",
        required: false,
      },
    ],
    usage: `<ToggleGroup type="single">
  <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
  <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
  <ToggleGroupItem value="underline">Underline</ToggleGroupItem>
</ToggleGroup>`,
    variants: [
      {
        name: "Multiple",
        description: "Toggle group that allows multiple items to be selected",
      },
      {
        name: "With Icons",
        description: "Toggle group with icon buttons",
      },
      {
        name: "Outline",
        description: "Toggle group with outline style",
      },
    ],
    accessibility:
      "Toggle groups follow the WAI-ARIA button pattern with proper pressed states and grouping.",
    examples: [
      {
        title: "Default",
        code: `<ToggleGroupDemo />`,
      },
    ],
  },

  [formatName("Tooltip")]: {
    description:
      "A popup that displays informative text when users hover over or focus on an element.",
    import:
      "import { Tooltip, TooltipTrigger } from '@/components/lightswind/tooltip';",
    usage: `import { Tooltip, TooltipTrigger } from '@/components/lightswind/tooltip';
import { Button } from '@/components/lightswind/button';

export function TooltipDemo() {
  return (
    <Tooltip 
      content="Add to library"
      variant="default"
      side="top"
    >
      <TooltipTrigger asChild>
        <Button variant="outline">Hover Me</Button>
      </TooltipTrigger>
    </Tooltip>
  );
}`,
    props: [
      {
        name: "content",
        type: "React.ReactNode",
        description: "The content to display inside the tooltip.",
        required: true,
      },
      {
        name: "variant",
        type: "'default' | 'info' | 'success' | 'warning' | 'error'",
        description: "Visual variant of the tooltip.",
        default: "'default'",
        required: false,
      },
      {
        name: "side",
        type: "'top' | 'right' | 'bottom' | 'left'",
        description: "The side of the trigger the tooltip should appear on.",
        default: "'top'",
        required: false,
      },
      {
        name: "align",
        type: "'center' | 'start' | 'end'",
        description: "Alignment of the tooltip relative to the trigger.",
        default: "'center'",
        required: false,
      },
      {
        name: "sideOffset",
        type: "number",
        description: "Distance in pixels from the trigger.",
        default: "8",
        required: false,
      },
      {
        name: "delayDuration",
        type: "number",
        description: "Delay in milliseconds before showing the tooltip.",
        default: "300",
        required: false,
      },
    ],
    examples: [
      {
        title: "Success Tooltip",
        description: "Tooltip with a success variant",
        code: `<Tooltip content="Successfully saved!" variant="success">
  <TooltipTrigger asChild>
    <Button variant="outline">Save</Button>
  </TooltipTrigger>
</Tooltip>`,
      },
      {
        title: "Error Variant",
        description: "Tooltip with an error variant for warnings",
        code: `<Tooltip content="This action is permanent" variant="error">
  <TooltipTrigger asChild>
    <Button variant="destructive">Delete</Button>
  </TooltipTrigger>
</Tooltip>`,
      },
      {
        title: "Custom Positioning",
        description: "Tooltip aligned to the right side",
        code: `<Tooltip content="Right-side info" side="right" align="center">
  <TooltipTrigger asChild>
    <Button variant="ghost">More Info</Button>
  </TooltipTrigger>
</Tooltip>`,
      },
    ],
    accessibility:
      "Tooltips follow WAI-ARIA practices for tooltips. They are triggered by both hover and focus, and can be dismissed with the Escape key. Content is announced to screen readers using the appropriate ARIA attributes.",
  },

  [formatName("Combobox")]: {
    import:
      'import { Combobox, ComboboxTrigger, ComboboxContent, ComboboxInput, ComboboxEmpty, ComboboxItem } from "@/components/lightswind/combobox"',
    description:
      "Combines a text input with a listbox, allowing users to filter a list of options and select one.",
    props: [
      {
        name: "value",
        type: "string",
        description: "The controlled value of the combobox",
        required: false,
      },
      {
        name: "defaultValue",
        type: "string",
        description: "The default value of the combobox",
        required: false,
      },
      {
        name: "onValueChange",
        type: "function",
        description: "Callback function called when the value changes",
        required: false,
      },
      {
        name: "placeholder",
        type: "string",
        description: "Placeholder text for the combobox input",
        required: false,
      },
      {
        name: "disabled",
        type: "boolean",
        description:
          "When true, prevents the user from interacting with the combobox",
        default: "false",
        required: false,
      },
      {
        name: "items",
        type: "array",
        description: "Array of items to display in the combobox",
        required: true,
      },
      {
        name: "filterFunction",
        type: "function",
        description: "Custom function for filtering items based on input value",
        required: false,
      },
      {
        name: "itemComponent",
        type: "component",
        description: "Custom component for rendering each item",
        required: false,
      },
      {
        name: "emptyComponent",
        type: "component",
        description: "Custom component for rendering empty state",
        required: false,
      },
    ],
    usage: `const frameworks = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
]

function ComboboxDemo() {
  const [value, setValue] = React.useState("")
  
  return (
    <Combobox value={value} onValueChange={setValue}>
      <ComboboxTrigger>
        <Button variant="outline" className="w-[200px] justify-between">
          {value ? frameworks.find((framework) => framework.value === value)?.label : "Select framework"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </ComboboxTrigger>
      <ComboboxContent>
        <ComboboxInput placeholder="Search framework..." />
        {frameworks.map((framework) => (
          <ComboboxItem key={framework.value} value={framework.value}>
            {framework.label}
            {value === framework.value && <Check className="ml-auto h-4 w-4" />}
          </ComboboxItem>
        ))}
      </ComboboxContent>
    </Combobox>
  )
}`,
    variants: [
      {
        name: "Creatable",
        description: "Combobox that allows creating new options",
      },
      {
        name: "With Groups",
        description: "Combobox with grouped options",
      },
      {
        name: "Async",
        description: "Combobox with asynchronously loaded options",
      },
    ],
    accessibility:
      "Combobox follows the WAI-ARIA combobox pattern with proper roles, states, and keyboard navigation.",
    examples: [
      {
        title: "Default",
        code: `<ComboboxDemo />`,
      },
    ],
  },

  [formatName("Confetti Button")]: {
    description:
      "An interactive button that triggers a confetti animation effect when clicked or hovered.",
    import: `import { ConfettiButton } from "@/components/lightswind/confetti-button";`,
    usage: `import { ConfettiButton } from "@/components/lightswind/confetti-button";
import { Sparkles } from "lucide-react";

export function ConfettiButtonDemo() {
  return (
    <ConfettiButton
      icon={<Sparkles className="h-4 w-4" />}
      confettiOptions={{
        particleCount: 100,
        spread: 70
      }}
    >
      Click for Confetti
    </ConfettiButton>
  );
}`,
    props: [
      {
        name: "variant",
        type: '"default" | "secondary" | "outline" | "ghost" | "link" | "gradient"',
        default: "default",
        description: "Controls the visual style of the button.",
        required: false,
      },
      {
        name: "size",
        type: '"default" | "sm" | "lg" | "xl" | "icon" | "pill"',
        default: "default",
        description: "Determines the size of the button.",
        required: false,
      },
      {
        name: "animation",
        type: '"none" | "pulse" | "bounce" | "scale" | "shake" | "glow" | "expand"',
        default: "scale",
        description: "Applies an animation effect to the button.",
        required: false,
      },
      {
        name: "icon",
        type: "React.ReactNode",
        default: "undefined",
        description: "Icon to display inside the button.",
        required: false,
      },
      {
        name: "iconPosition",
        type: '"left" | "right"',
        default: "left",
        description: "Position of the icon within the button.",
        required: false,
      },
      {
        name: "loading",
        type: "boolean",
        default: "false",
        description:
          "When true, displays a loading spinner and disables the button.",
        required: false,
      },
      {
        name: "confettiOptions",
        type: "object",
        default: "{ particleCount: 100, spread: 70 }",
        description: "Configuration options for the confetti effect.",
        required: false,
      },
      {
        name: "autoConfetti",
        type: "boolean",
        default: "false",
        description:
          "Automatically triggers confetti when the component mounts.",
        required: false,
      },
      {
        name: "triggerOnHover",
        type: "boolean",
        default: "false",
        description: "Triggers confetti when hovering over the button.",
        required: false,
      },
    ],
    variants: [
      {
        name: "default",
        description: "Primary button with brand color background.",
      },
      {
        name: "secondary",
        description: "Secondary button with muted background color.",
      },
      {
        name: "outline",
        description: "Button with outline and transparent background.",
      },
      {
        name: "ghost",
        description: "Button with no background or border.",
      },
      {
        name: "link",
        description: "Button that looks like a hyperlink.",
      },
      {
        name: "gradient",
        description: "Button with a gradient background.",
      },
    ],
    examples: [
      {
        title: "Basic Usage",
        description: "Simple confetti button with default settings",
        code: `<ConfettiButton>
  Click for Confetti
</ConfettiButton>`,
      },
      {
        title: "With Custom Options",
        description: "Customize the confetti effect with options",
        code: `<ConfettiButton
  confettiOptions={{
    particleCount: 200,
    spread: 90,
    colors: ['#ff0000', '#00ff00', '#0000ff']
  }}
>
  Party Time!
</ConfettiButton>`,
      },
      {
        title: "With Icon",
        description: "Button with an icon and confetti effect",
        code: `import { PartyPopper } from "lucide-react";

<ConfettiButton
  icon={<PartyPopper className="h-4 w-4" />}
  variant="gradient"
>
  Celebrate
</ConfettiButton>`,
      },
      {
        title: "Different Sizes",
        description: "Confetti buttons with different size variants",
        code: `<div className="flex flex-wrap gap-4">
  <ConfettiButton size="sm">Small</ConfettiButton>
  <ConfettiButton size="default">Default</ConfettiButton>
  <ConfettiButton size="lg">Large</ConfettiButton>
  <ConfettiButton size="xl">Extra Large</ConfettiButton>
  <ConfettiButton size="pill">Pill Button</ConfettiButton>
</div>`,
      },
      {
        title: "On Hover",
        description: "Trigger confetti when hovering over the button",
        code: `<ConfettiButton
  triggerOnHover={true}
  variant="outline"
>
  Hover for Confetti
</ConfettiButton>`,
      },
    ],
    accessibility:
      "The button is fully accessible via keyboard navigation. It uses native button elements and maintains all standard button functionality including focus states and ARIA attributes.",
  },

  [formatName("Aurora Text Effect")]: {
    description:
      "A text component with beautiful aurora-like gradient animations in the background.",
    import: `import { AuroraTextEffect } from "@/components/lightswind/aurora-text-effect"`,
    usage: `<AuroraTextEffect 
  text="Aurora Effect" 
  fontSize="clamp(3rem, 8vw, 7rem)"
  colors={{
    first: "bg-cyan-400",
    second: "bg-yellow-400",
    third: "bg-green-400",
    fourth: "bg-primarylw"
  }}
  blurAmount="blur-lg"
/>`,
    props: [
      {
        name: "text",
        type: "string",
        description: "The text to display with the aurora effect",
        required: true,
      },
      {
        name: "className",
        type: "string",
        default: "",
        description: "Additional CSS classes to apply to the container",
        required: false,
      },
      {
        name: "textClassName",
        type: "string",
        default: "",
        description: "Additional CSS classes to apply to the text element",
        required: false,
      },
      {
        name: "fontSize",
        type: "string",
        default: "clamp(3rem, 8vw, 7rem)",
        description:
          "Font size for the text, can be any valid CSS font-size value",
        required: false,
      },
      {
        name: "colors",
        type: "object",
        default:
          "{ first: 'bg-cyan-400', second: 'bg-yellow-400', third: 'bg-green-400', fourth: 'bg-primarylw' }",
        description: "Tailwind background color classes for the aurora layers",
        required: false,
      },
      {
        name: "blurAmount",
        type: "string",
        default: "blur-lg",
        description: "Tailwind blur class or custom blur value",
        required: false,
      },
      {
        name: "animationSpeed",
        type: "object",
        default: "{ border: 6, first: 5, second: 5, third: 3, fourth: 13 }",
        description:
          "Speed of animations for different aurora layers in seconds",
        required: false,
      },
    ],
    variants: [],
    examples: [
      {
        title: "Basic Usage",
        code: `<AuroraTextEffect text="Aurora Text" />`,
      },
      {
        title: "Custom Colors",
        code: `<AuroraTextEffect 
  text="Custom Colors" 
  colors={{
    first: "bg-pink-400",
    second: "bg-blue-400",
    third: "bg-violet-400",
    fourth: "bg-primarylw"
  }}
/>`,
      },
      {
        title: "Custom Animation Speed",
        code: `<AuroraTextEffect 
  text="Fast Aurora" 
  animationSpeed={{
    border: 3,
    first: 2,
    second: 2.5,
    third: 1.5,
    fourth: 6
  }}
/>`,
      },
      {
        title: "Heavy Blur Effect",
        code: `<AuroraTextEffect 
  text="Blurred Effect" 
  blurAmount="blur-3xl"
/>`,
      },
    ],
    accessibility:
      "Text has sufficient contrast with the background for readability. Animation can be reduced using the prefers-reduced-motion media query.",
  },

  [formatName("Interactive Card Gallery")]: {
    description:
      "A responsive gallery of interactive cards with hover effects and customizable layouts.",
    import: `import { InteractiveCardGallery } from "@/components/lightswind/interactive-card-gallery"`,
    usage: `const galleryData = [
  {
    title: "Mountain View",
    description: "Check out these gorgeous mountain trips with beautiful views",
    imageSrc: "/images/mountains.jpg",
    buttonText: "View Trips",
    imageAlt: "Mountain landscape",
    accentColor: "yellow",
    onClick: () => console.log("Mountain card clicked")
  },
  {
    title: "Beach Getaway",
    description: "Plan your next beach trip with these fabulous destinations",
    imageSrc: "/images/beach.jpg",
    buttonText: "View Trips",
    imageAlt: "Beach landscape",
    accentColor: "blue",
    onClick: () => console.log("Beach card clicked")
  }
];

<InteractiveCardGallery 
  cards={galleryData} 
  cardHeight="h-64"
  columns={4}
  hoverScale={1.1}
  transitionDuration={700}
/>`,
    props: [
      {
        name: "cards",
        type: "CardProps[]",
        description:
          "Array of card data objects containing title, description, imageSrc, buttonText, etc.",
        required: true,
      },
      {
        name: "className",
        type: "string",
        default: "",
        description: "Additional CSS classes to apply to the container",
        required: false,
      },
      {
        name: "cardHeight",
        type: "string",
        default: "h-64",
        description: "Height of the cards using Tailwind height classes",
        required: false,
      },
      {
        name: "columns",
        type: "1 | 2 | 3 | 4",
        default: "4",
        description: "Number of columns in the grid layout",
        required: false,
      },
      {
        name: "hoverScale",
        type: "number",
        default: "1.1",
        description: "Scale factor for hover animation",
        required: false,
      },
      {
        name: "transitionDuration",
        type: "number",
        default: "700",
        description: "Duration of transition animations in milliseconds",
        required: false,
      },
    ],
    variants: [],
    examples: [
      {
        title: "Basic Usage",
        code: `<InteractiveCardGallery 
  cards={galleryData} 
/>`,
      },
      {
        title: "Custom Layout",
        code: `<InteractiveCardGallery 
  cards={galleryData} 
  cardHeight="h-80"
  columns={2}
  hoverScale={1.2}
  transitionDuration={500}
/>`,
      },
      {
        title: "With Click Handlers",
        code: `const galleryWithHandlers = galleryData.map(card => ({
  ...card,
  onClick: () => {
    toast({
      title: "Card Selected",
      description: \`You clicked on \${card.title}\`,
    });
  }
}));

<InteractiveCardGallery 
  cards={galleryWithHandlers} 
/>`,
      },
    ],
    accessibility:
      "Images include alt text for screen readers. Interactive elements are keyboard accessible. Focus states are clearly visible. Color contrast meets WCAG guidelines.",
  },

  [formatName("Scroll Area")]: {
    description:
      "A scrollable container with custom styled scrollbars, providing a consistent cross-browser experience.",
    import:
      "import { ScrollArea, ScrollBar } from '@/components/lightswind/scroll-area';",
    usage: `import { ScrollArea } from '@/components/lightswind/scroll-area';

export function ScrollAreaDemo() {
  return (
    <ScrollArea className="h-[200px] w-[350px] rounded-md border p-4">
      <div className="space-y-4">
        <h4 className="text-sm font-medium leading-none">Scrollable Content</h4>
        <p className="text-sm">
          This is a scrollable area with custom scrollbars. The content will scroll when it exceeds the height.
        </p>
        {/* Add more content here to make it scroll */}
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} className="py-1">
            Row {i + 1}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}`,
    props: [
      {
        name: "maxHeight",
        type: "string | number",
        description: "Maximum height of the scroll area.",
        required: false,
      },
      {
        name: "showScrollbars",
        type: "boolean",
        description: "Whether to show scrollbars.",
        required: false,
      },
      {
        name: "scrollable",
        type: "boolean",
        description: "Whether to allow scrolling.",
        required: false,
      },
      {
        name: "orientation",
        type: '"vertical" | "horizontal" | "both"',
        description: "The orientation of the scroll area.",
        required: false,
      },
      {
        name: "smooth",
        type: "boolean",
        description: "Whether to smooth scroll.",
        required: false,
      },
      {
        name: "viewportRef",
        type: "React.RefObject<HTMLDivElement>",
        description: "Reference to the viewport element.",
        required: false,
      },
    ],
    examples: [
      {
        title: "Horizontal Scrolling",
        description: "ScrollArea with horizontal orientation",
        code: `<ScrollArea 
  orientation="horizontal" 
  className="w-[350px] whitespace-nowrap rounded-md border"
>
  <div className="flex p-4">
    {Array.from({ length: 50 }).map((_, i) => (
      <div
        key={i}
        className="w-[200px] shrink-0 rounded-md border p-4 mr-4"
      >
        <div className="font-semibold">Item {i + 1}</div>
        <div className="text-sm">This is a horizontal item</div>
      </div>
    ))}
  </div>
</ScrollArea>`,
      },
      {
        title: "Both Directions Scrolling",
        description: "ScrollArea with both vertical and horizontal scrolling",
        code: `<ScrollArea 
  orientation="both"
  className="h-[300px] w-[400px] rounded-md border"
>
  <div className="p-4" style={{ width: '800px' }}>
    <h4 className="mb-4 text-sm font-medium leading-none">
      Content that scrolls in both directions
    </h4>
    {Array.from({ length: 20 }).map((_, i) => (
      <div key={i} className="mb-4">
        <div className="font-semibold">Row {i + 1}</div>
        <div className="text-sm">
          This is a wide content area that will scroll horizontally.
          {' '.repeat(100)}
        </div>
      </div>
    ))}
  </div>
</ScrollArea>`,
      },
      {
        title: "With Maximum Height",
        description:
          "ScrollArea that only shows scrollbars when content exceeds the max height",
        code: `<ScrollArea 
  maxHeight="200px" 
  className="w-full rounded-md border p-4"
>
  <div className="space-y-4">
    <h4 className="text-sm font-medium leading-none">Auto-height content</h4>
    <p className="text-sm">
      This area will only show scrollbars when the content exceeds 200px in height.
    </p>
    {Array.from({ length: 10 }).map((_, i) => (
      <div key={i} className="py-1">
        Row {i + 1} - This is some content to make the area scrollable.
      </div>
    ))}
  </div>
</ScrollArea>`,
      },
      {
        title: "Without Scrollbars",
        description: "ScrollArea with hidden scrollbars",
        code: `<ScrollArea 
  showScrollbars={false} 
  className="h-[200px] w-[350px] rounded-md border p-4"
>
  <div className="space-y-4">
    <h4 className="text-sm font-medium leading-none">Hidden scrollbars</h4>
    <p className="text-sm">
      This area can still scroll but without visible scrollbars.
      Use this when you want to maintain a clean UI.
    </p>
    {Array.from({ length: 15 }).map((_, i) => (
      <div key={i} className="py-1">
        Row {i + 1}
      </div>
    ))}
  </div>
</ScrollArea>`,
      },
    ],
    accessibility:
      "The ScrollArea component is designed with accessibility in mind. It maintains native scroll functionality while providing a custom scrollbar appearance. This ensures compatibility with keyboard navigation and screen readers while providing a consistent visual experience across browsers. Users can navigate the scrollable content using standard keyboard controls such as arrow keys, Page Up/Down, and Tab key.",
  },

  [formatName("Resizable")]: {
    description:
      "A component that allows users to resize elements by dragging handles.",
    import:
      "import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/lightswind/resizable';",
    usage: `import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/lightswind/resizable';

export function ResizableDemo() {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="min-h-[200px] max-w-md rounded-lg border"
    >
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Sidebar</span>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Content</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}`,
    props: [
      {
        name: "direction",
        type: '"horizontal" | "vertical"',
        description: "The axis along which the panels will resize.",
        default: '"horizontal"',
        required: false,
      },
      {
        name: "defaultSize",
        type: "number",
        description: "The default size of a panel as a percentage.",
        default: "",
        required: false,
      },
      {
        name: "minSize",
        type: "number",
        description: "The minimum size of a panel as a percentage.",
        default: "10",
        required: false,
      },
      {
        name: "maxSize",
        type: "number",
        description: "The maximum size of a panel as a percentage.",
        default: "90",
        required: false,
      },
      {
        name: "withHandle",
        type: "boolean",
        description: "Whether to show a visible handle for dragging.",
        default: "false",
        required: false,
      },
    ],
    examples: [
      {
        title: "Vertical Layout",
        description: "Resizable panels stacked vertically",
        code: `<ResizablePanelGroup
  direction="vertical"
  className="min-h-[400px] w-full rounded-lg border"
>
  <ResizablePanel defaultSize={25}>
    <div className="flex h-full items-center justify-center p-6">
      <span className="font-semibold">Top Panel</span>
    </div>
  </ResizablePanel>
  <ResizableHandle withHandle />
  <ResizablePanel defaultSize={75}>
    <div className="flex h-full items-center justify-center p-6">
      <span className="font-semibold">Bottom Panel</span>
    </div>
  </ResizablePanel>
</ResizablePanelGroup>`,
      },
      {
        title: "Three-Panel Layout",
        description: "Creating a layout with three resizable panels",
        code: `<ResizablePanelGroup
  direction="horizontal"
  className="min-h-[300px] w-full rounded-lg border"
>
  <ResizablePanel defaultSize={20} minSize={15}>
    <div className="flex h-full items-center justify-center p-6">
      <span className="font-semibold">Navigation</span>
    </div>
  </ResizablePanel>
  <ResizableHandle withHandle />
  <ResizablePanel defaultSize={60}>
    <div className="flex h-full items-center justify-center p-6">
      <span className="font-semibold">Main Content</span>
    </div>
  </ResizablePanel>
  <ResizableHandle withHandle />
  <ResizablePanel defaultSize={20} minSize={15}>
    <div className="flex h-full items-center justify-center p-6">
      <span className="font-semibold">Details</span>
    </div>
  </ResizablePanel>
</ResizablePanelGroup>`,
      },
      {
        title: "Nested Panels",
        description: "Creating a complex layout with nested resizable panels",
        code: `<ResizablePanelGroup
  direction="horizontal"
  className="min-h-[400px] max-w-4xl rounded-lg border"
>
  <ResizablePanel defaultSize={30} minSize={20}>
    <div className="flex h-full flex-col">
      <div className="p-4 border-b font-medium">Explorer</div>
      <div className="p-4">Sidebar content</div>
    </div>
  </ResizablePanel>
  <ResizableHandle withHandle />
  <ResizablePanel defaultSize={70}>
    <ResizablePanelGroup direction="vertical">
      <ResizablePanel defaultSize={70}>
        <div className="flex h-full flex-col">
          <div className="p-4 border-b font-medium">Editor</div>
          <div className="p-4">Main content area</div>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={30}>
        <div className="flex h-full flex-col">
          <div className="p-4 border-b font-medium">Console</div>
          <div className="p-4">Output area</div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  </ResizablePanel>
</ResizablePanelGroup>`,
      },
      {
        title: "With Size Constraints",
        description: "Setting minimum and maximum sizes for panels",
        code: `<ResizablePanelGroup
  direction="horizontal"
  className="min-h-[200px] max-w-md rounded-lg border"
>
  <ResizablePanel 
    defaultSize={25} 
    minSize={20} 
    maxSize={40}
  >
    <div className="flex h-full items-center justify-center p-6">
      <span className="text-sm text-muted-foreground text-center">
        This panel has min-size: 20% and max-size: 40%
      </span>
    </div>
  </ResizablePanel>
  <ResizableHandle withHandle />
  <ResizablePanel defaultSize={75}>
    <div className="flex h-full items-center justify-center p-6">
      <span className="text-sm text-muted-foreground text-center">
        This panel will adjust based on the constraints of the first panel
      </span>
    </div>
  </ResizablePanel>
</ResizablePanelGroup>`,
      },
    ],
    accessibility:
      "The Resizable component provides keyboard support for resizing panels. Users can focus on the resize handles using the Tab key and use arrow keys to adjust the size of panels. The component also includes appropriate ARIA attributes to ensure that screen readers can announce the purpose of the resize handles.",
  },

  [formatName("Input OTP")]: {
    description:
      "An input component for one-time password entry, optimized for entering codes received via email or SMS.",
    import:
      "import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from '@/components/lightswind/input-otp';",
    usage: `import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/lightswind/input-otp';

export function InputOTPDemo() {
  return (
    <InputOTP maxLength={6}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  );
}`,
    props: [
      {
        name: "maxLength",
        type: "number",
        description: "The maximum number of characters allowed.",
        default: "",
        required: true,
      },
      {
        name: "value",
        type: "string",
        description: "The controlled value of the input.",
        default: "",
        required: false,
      },
      {
        name: "defaultValue",
        type: "string",
        description:
          "The default value when the component is initially rendered.",
        default: "",
        required: false,
      },
      {
        name: "onChange",
        type: "(value: string) => void",
        description: "Event handler called when the input value changes.",
        default: "",
        required: false,
      },
      {
        name: "placeholder",
        type: "string",
        description:
          "The placeholder character to display when the input is empty.",
        default: "○",
        required: false,
      },
      {
        name: "disabled",
        type: "boolean",
        description:
          "When true, prevents the user from interacting with the input.",
        default: "false",
        required: false,
      },
    ],
    examples: [
      {
        title: "Basic OTP Input",
        description: "Simple 4-digit OTP input field",
        code: `<InputOTP maxLength={4}>
  <InputOTPGroup>
    <InputOTPSlot index={0} />
    <InputOTPSlot index={1} />
    <InputOTPSlot index={2} />
    <InputOTPSlot index={3} />
  </InputOTPGroup>
</InputOTP>`,
      },
      {
        title: "With Separator",
        description: "OTP input with separators between groups",
        code: `<InputOTP maxLength={6}>
  <InputOTPGroup>
    <InputOTPSlot index={0} />
    <InputOTPSlot index={1} />
    <InputOTPSlot index={2} />
  </InputOTPGroup>
  <InputOTPSeparator />
  <InputOTPGroup>
    <InputOTPSlot index={3} />
    <InputOTPSlot index={4} />
    <InputOTPSlot index={5} />
  </InputOTPGroup>
</InputOTP>`,
      },
      {
        title: "Controlled OTP Input",
        description: "OTP input controlled by React state",
        code: `import { useState } from "react";

function ControlledOTPInput() {
  const [otp, setOtp] = useState("");
  
  return (
    <div className="space-y-2">
      <InputOTP 
        maxLength={6} 
        value={otp} 
        onChange={setOtp}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <div>Current value: {otp}</div>
    </div>
  );
}`,
      },
      {
        title: "Custom Placeholder",
        description: "OTP input with custom placeholder character",
        code: `<InputOTP maxLength={4} placeholder="-">
  <InputOTPGroup>
    <InputOTPSlot index={0} />
    <InputOTPSlot index={1} />
    <InputOTPSlot index={2} />
    <InputOTPSlot index={3} />
  </InputOTPGroup>
</InputOTP>`,
      },
    ],
    accessibility:
      "The InputOTP component follows ARIA best practices for input fields. It provides keyboard navigation between slots, supports clipboard pasting of the complete code, and offers proper focus management. Screen readers will announce the input appropriately.",
  },

  [formatName("Top Loader")]: {
    description:
      "A slim loading indicator that appears at the top of the page to show loading progress.",
    import: "import { TopLoader } from '@/components/lightswind/top-loader';",
    usage: `import { TopLoader } from '@/components/lightswind/top-loader';
import { Button } from '@/components/lightswind/button';
import { useState } from 'react';

export function TopLoaderDemo() {
  const [isLoading, setIsLoading] = useState(false);
  
  return (
    <div>
      <TopLoader isLoading={isLoading} />
      <Button
        onClick={() => {
          setIsLoading(true);
          setTimeout(() => setIsLoading(false), 3000);
        }}
      >
        Start Loading
      </Button>
    </div>
  );
}`,
    props: [
      {
        name: "isLoading",
        type: "boolean",
        description: "Whether the loader is visible.",
        default: "false",
        required: true,
      },
      {
        name: "color",
        type: "string",
        description: "The color of the loader bar.",
        default: "var(--primary)",
        required: false,
      },
      {
        name: "height",
        type: "string | number",
        description: "The height of the loader bar.",
        default: "2px",
        required: false,
      },
      {
        name: "waitingTime",
        type: "number",
        description: "Time in milliseconds before the loader appears.",
        default: "500",
        required: false,
      },
      {
        name: "className",
        type: "string",
        description: "Additional CSS classes to apply to the loader.",
        default: "",
        required: false,
      },
    ],
    examples: [
      {
        title: "Custom Styled Loader",
        description: "Using custom colors and height",
        code: `<TopLoader 
  isLoading={isLoading} 
  color="#ff0000" 
  height="4px" 
/>`,
      },
      {
        title: "Instant Loader",
        description: "Loader that appears immediately without waiting",
        code: `<TopLoader 
  isLoading={isLoading} 
  waitingTime={0} 
/>`,
      },
      {
        title: "Integration with Router",
        description: "Using the loader with React Router navigation",
        code: `import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function RouterLoader() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [location.pathname]);
  
  return <TopLoader isLoading={isLoading} />;
}`,
      },
    ],
    accessibility:
      "The top loader provides a visual indication of loading state without disrupting the user's interaction with the page. For accessibility, pair it with appropriate ARIA live regions when representing important loading states.",
  },

  [formatName("Chart")]: {
    description:
      "A versatile chart component built on Recharts that supports various chart types like line, bar, area, and pie charts.",
    import: 'import { Chart } from "@/components/lightswind/chart"',
    usage: `import { Chart } from "@/components/lightswind/chart";

export function LineChartExample() {
  const data = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 800 },
    { name: 'May', value: 500 },
    { name: 'Jun', value: 900 },
  ];

  return (
    <Chart 
      type="line" 
      data={data}
      xAxis="name"
      series={[{ key: "value", name: "Revenue" }]}
      height={300}
    />
  );
}`,
    props: [
      {
        name: "type",
        type: `"line" | "bar" | "area" | "pie" | "radar"`,
        description: "Type of chart to render",
        required: true,
      },
      {
        name: "data",
        type: "object[]",
        description: "Array of data objects for the chart",
        required: true,
      },
      {
        name: "xAxis",
        type: "string",
        description: "Key in the data objects to use for the x-axis",
        required: true,
      },
      {
        name: "series",
        type: "object[]",
        description: "Array of series configurations",
        required: true,
      },
      {
        name: "height",
        type: "number",
        description: "Height of the chart",
        required: false,
        default: "400",
      },
      {
        name: "width",
        type: "number",
        description: "Width of the chart",
        required: false,
        default: "600",
      },
      {
        name: "legend",
        type: "boolean",
        description: "Whether to display the legend",
        required: false,
        default: "false",
      },
      {
        name: "className",
        type: "string",
        description: "Additional CSS classes to apply to the chart",
        required: false,
      },
    ],
    variants: [
      {
        name: "Line Chart",
        description: "A line chart to display data trends",
      },
      {
        name: "Bar Chart",
        description: "A bar chart to compare data values",
      },
      {
        name: "Area Chart",
        description: "An area chart to show data volume over time",
      },
      {
        name: "Pie Chart",
        description: "A pie chart to display data composition",
      },
      {
        name: "Radar Chart",
        description: "A radar chart to compare multiple quantitative variables",
      },
    ],
    examples: [
      {
        title: "Line Chart",
        description: "Simple line chart example",
        code: `const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 900 },
];

<Chart 
  type="line" 
  data={data}
  xAxis="name"
  series={[{ key: "value", name: "Revenue" }]}
  height={300}
/>`,
      },
      {
        title: "Bar Chart",
        description: "Simple bar chart example",
        code: `const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 900 },
];

<Chart 
  type="bar" 
  data={data}
  xAxis="name"
  series={[{ key: "value", name: "Revenue" }]}
  height={300}
/>`,
      },
      {
        title: "Area Chart",
        description: "Simple area chart example",
        code: `const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 900 },
];

<Chart 
  type="area" 
  data={data}
  xAxis="name"
  series={[{ key: "value", name: "Revenue" }]}
  height={300}
/>`,
      },
      {
        title: "Pie Chart",
        description: "Simple pie chart example",
        code: `const data = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
];

<Chart 
  type="pie" 
  data={data}
  xAxis="name"
  series={[{ key: "value", name: "Value" }]}
  height={300}
  legend={true}
/>`,
      },
      {
        title: "Radar Chart",
        description: "Radar chart example",
        code: `const data = [
  { subject: 'Math', A: 120, B: 110, fullMark: 150 },
  { subject: 'English', A: 98, B: 130, fullMark: 150 },
  { subject: 'Physics', A: 86, B: 130, fullMark: 150 },
  { subject: 'History', A: 99, B: 100, fullMark: 150 },
  { subject: 'Geography', A: 85, B: 90, fullMark: 150 },
];

<Chart 
  type="radar" 
  data={data}
  xAxis="subject"
  series={[
    { key: "A", name: "Student A" },
    { key: "B", name: "Student B" }
  ]}
  height={300}
/>`,
      },
    ],
    accessibility:
      "The chart component is built with accessibility in mind, including keyboard navigation support and proper color contrast. All chart data is also accessible via screen readers through appropriate ARIA attributes.",
  },

  [formatName("Seasonal Hover Cards")]: {
    description:
      "A set of cards that change their appearance based on the current season.",
    import:
      'import { SeasonalHoverCards } from "@/components/lightswind/seasonal-hover-cards"',
    usage: `import { SeasonalHoverCards } from "@/components/lightswind/seasonal-hover-cards";

export function SeasonalHoverCardsDemo() {
  return <SeasonalHoverCards />;
}`,
    props: [
      {
        name: "cards",
        type: "object[]",
        description: "An array of card objects to display in the gallery.",
        required: false,
      },
      {
        name: "className",
        type: "string",
        description: "Additional CSS classes to apply to the gallery.",
        required: false,
      },
    ],
    variants: [
      {
        name: "Default",
        description: "The standard seasonal hover cards with default styling.",
      },
      {
        name: "Custom Cards",
        description: "Seasonal hover cards with custom cards.",
      },
    ],
    examples: [
      {
        title: "Basic Seasonal Hover Cards",
        description: "A simple seasonal hover cards with default styling.",
        code: `<SeasonalHoverCards />`,
      },
      {
        title: "Custom Cards",
        description: "Seasonal hover cards with custom cards.",
        code: `<SeasonalHoverCards
  cards={[
    {
      title: "Card 1",
      description: "This is the first card.",
      image: "https://via.placeholder.com/300x200"
    },
    {
      title: "Card 2",
      description: "This is the second card.",
      image: "https://via.placeholder.com/300x200"
    }
  ]}
/>`,
      },
    ],
    accessibility:
      "The Seasonal Hover Cards are accessible to users of all abilities. The cards are keyboard accessible and the gallery is navigable using the keyboard.",
  },

  [formatName("Smokey Cursor")]: {
    description:
      "An interactive WebGL-based fluid simulation that follows cursor movements.",
    import: `import SmokeyCursor from "@/components/lightswind/smokey-cursor"`,
    usage: `import SmokeyCursor from "@/components/lightswind/smokey-cursor";

// Basic Usage - Full screen overlay
<SmokeyCursor />

// Custom Simulation Quality
<SmokeyCursor 
  simulationResolution={256}
  dyeResolution={1024}
  enableShading={true}
/>

// Performance Optimized for Mobile
<SmokeyCursor
  simulationResolution={64}
  dyeResolution={512}
  densityDissipation={5}
  velocityDissipation={3}
  enableShading={false}
/>

// High Quality Desktop Experience
<SmokeyCursor
  simulationResolution={256}
  dyeResolution={2048}
  densityDissipation={2}
  curl={5}
  splatForce={8000}
  enableShading={true}
/>

// Intense Fire-like Effect
<SmokeyCursor
  curl={10}
  splatForce={12000}
  densityDissipation={1.5}
  colorUpdateSpeed={20}
  backgroundColor={{ r: 0.8, g: 0.1, b: 0 }}
/>

// Subtle Ambient Effect
<SmokeyCursor
  splatRadius={0.1}
  splatForce={3000}
  densityDissipation={8}
  velocityDissipation={5}
  colorUpdateSpeed={5}
/>`,
    props: [
      {
        name: "className",
        type: "string",
        required: false,
        description:
          "Additional CSS classes for custom styling of the canvas container.",
        default: "undefined",
      },
      {
        name: "disabled",
        type: "boolean",
        required: false,
        description:
          "Disable the cursor effect entirely while keeping the component mounted.",
        default: "false",
      },
      {
        name: "intensity",
        type: "number",
        required: false,
        description:
          "Overall intensity multiplier for all effects. Values 0.1-2.0 work best.",
        default: "1",
      },
      {
        name: "followMouse",
        type: "boolean",
        required: false,
        description:
          "Whether the effect should follow mouse movement or be static.",
        default: "true",
      },
      {
        name: "autoColors",
        type: "boolean",
        required: false,
        description:
          "Enable automatic color transitions over time for dynamic effects.",
        default: "true",
      },
      {
        name: "simulationResolution",
        type: "number",
        required: false,
        description:
          "Resolution for velocity field simulation. Higher values increase quality but reduce performance.",
        default: "128",
      },
      {
        name: "dyeResolution",
        type: "number",
        required: false,
        description:
          "Resolution for color/dye rendering. Higher values create sharper trails but use more memory.",
        default: "1440",
      },
      {
        name: "captureResolution",
        type: "number",
        required: false,
        description:
          "Resolution for capture/rendering operations. Affects final output quality.",
        default: "512",
      },
      {
        name: "densityDissipation",
        type: "number",
        required: false,
        description:
          "Rate at which colors fade over time. Lower values create longer-lasting trails.",
        default: "3.5",
      },
      {
        name: "velocityDissipation",
        type: "number",
        required: false,
        description:
          "Rate at which fluid motion slows down. Lower values create more fluid movement.",
        default: "2",
      },
      {
        name: "pressure",
        type: "number",
        required: false,
        description:
          "Pressure coefficient for fluid simulation. Affects fluid behavior and stability.",
        default: "0.1",
      },
      {
        name: "pressureIterations",
        type: "number",
        required: false,
        description:
          "Number of pressure solver iterations. Higher values improve accuracy but reduce performance.",
        default: "20",
      },
      {
        name: "curl",
        type: "number",
        required: false,
        description:
          "Vorticity/curl strength. Higher values create more swirling, turbulent motion.",
        default: "3",
      },
      {
        name: "splatRadius",
        type: "number",
        required: false,
        description:
          "Size of the interaction area around cursor. Values between 0.1-0.5 work best.",
        default: "0.2",
      },
      {
        name: "splatForce",
        type: "number",
        required: false,
        description:
          "Force applied by cursor movement. Higher values create more dramatic effects.",
        default: "6000",
      },
      {
        name: "enableShading",
        type: "boolean",
        required: false,
        description:
          "Enable 3D-style shading effects for more realistic appearance.",
        default: "true",
      },
      {
        name: "colorUpdateSpeed",
        type: "number",
        required: false,
        description:
          "Speed of automatic color transitions. Higher values change colors more frequently.",
        default: "10",
      },
      {
        name: "backgroundColor",
        type: "ColorRGB",
        required: false,
        description:
          "Background color as RGB object with r, g, b values (0-1 range).",
        default: "{ r: 0.5, g: 0, b: 0 }",
      },
      {
        name: "transparent",
        type: "boolean",
        required: false,
        description:
          "Whether the background should be transparent or use backgroundColor.",
        default: "true",
      },
    ],
    examples: [
      {
        title: "Basic Full-Screen Effect",
        description: "Simple overlay with default settings",
        code: `<SmokeyCursor />`,
      },
      {
        title: "Performance Optimized",
        description:
          "Reduced settings for better performance on mobile devices",
        code: `<SmokeyCursor
  simulationResolution={64}
  dyeResolution={512}
  densityDissipation={5}
  velocityDissipation={3}
  enableShading={false}
/>`,
      },
      {
        title: "High Quality Desktop",
        description: "Enhanced settings for desktop with powerful graphics",
        code: `<SmokeyCursor
  simulationResolution={256}
  dyeResolution={2048}
  densityDissipation={2}
  curl={5}
  splatForce={8000}
  enableShading={true}
/>`,
      },
      {
        title: "Fire Theme",
        description: "Intense red-orange effect with high turbulence",
        code: `<SmokeyCursor
  curl={10}
  splatForce={12000}
  densityDissipation={1.5}
  colorUpdateSpeed={20}
  backgroundColor={{ r: 0.8, g: 0.1, b: 0 }}
/>`,
      },
      {
        title: "Subtle Ambient",
        description: "Gentle effect for background ambiance",
        code: `<SmokeyCursor
  splatRadius={0.1}
  splatForce={3000}
  densityDissipation={8}
  velocityDissipation={5}
  colorUpdateSpeed={5}
/>`,
      },
    ],
    accessibility: ` [
      "Provides cursor-none class to hide default cursor during effect",
      "Uses pointer-events-none to prevent canvas from blocking interactions",
      "May cause motion sensitivity issues - consider providing toggle option",
      "WebGL effects may not work on older devices or browsers",
      "Consider reducing effects for users with motion sensitivity preferences"
    ],
    best_practices: [
      "Use lower resolutions (64-128) for mobile devices to maintain performance",
      "Higher dyeResolution values (1024-2048) work well on desktop for sharp details",
      "Adjust densityDissipation based on desired trail length (1-2 for long, 5-8 for short)",
      "Use curl values 3-10 for natural motion (higher values create chaos)",
      "Test performance across devices and provide quality presets",
      "Consider adding toggle to disable for accessibility",
      "Place as overlay with high z-index and pointer-events-none"
    ],
    troubleshooting: [
      {
        issue: "Effect not visible or black screen",
        solution: "Check WebGL support in browser. Ensure canvas has proper dimensions and z-index positioning."
      },
      {
        issue: "Poor performance or lag",
        solution: "Reduce simulationResolution and dyeResolution. Disable shading. Lower curl and force values."
      },
      {
        issue: "Colors appearing too dim or bright",
        solution: "Adjust colorUpdateSpeed and densityDissipation. Check backgroundColor settings for contrast."
      },
      {
        issue: "Effect interfering with page interactions", 
        solution: "Ensure pointer-events-none class is applied to the container div."
      },
      {
        issue: "Trails disappearing too quickly",
        solution: "Lower densityDissipation and velocityDissipation values to make effects last longer."
      },
      {
        issue: "WebGL context lost errors",
        solution: "Add WebGL context restoration handling. Reduce resolution settings to lower GPU memory usage."
      }
    ]`,
  },

  [formatName("Scroll Timeline")]: {
    description:
      "An animated timeline component that reveals entries as the user scrolls down the page.",
    import: `import { ScrollTimeline } from "@/components/lightswind/scroll-timeline"`,
    usage: `import { ScrollTimeline } from "@/components/lightswind/scroll-timeline"

// Define your timeline events
const events = [
  {
    year: "2023",
    title: "Major Achievement",
    subtitle: "Organization Name",
    description: "Description of the achievement."
  },
  {
    year: "2022",
    title: "Important Milestone",
    subtitle: "Organization Name",
    description: "Details about the milestone."
  },
]

export function ScrollTimelineExample() {
  return (
    <ScrollTimeline 
      events={events}
      title="My Journey"
      subtitle="Scroll to explore the timeline"
      progressIndicator={true}
      cardAlignment="alternating"
      revealAnimation="fade"
    />
  )
}`,
    props: [
      {
        name: "events",
        type: "TimelineEvent[]",
        description: "Array of timeline events to display",
        required: true,
      },
      {
        name: "title",
        type: "string",
        description: "Title displayed at the top of the timeline",
        required: true,
      },
      {
        name: "subtitle",
        type: "string",
        description: "Subtitle displayed below the title",
        required: true,
      },
      {
        name: "animationOrder",
        type: '"sequential" | "staggered" | "simultaneous"',
        description: "Controls how items animate in when scrolling",
        required: true,
      },
      {
        name: "cardAlignment",
        type: '"alternating" | "left" | "right"',
        description: "Controls the alignment of timeline cards",
        required: false,
      },
      {
        name: "lineColor",
        type: "string",
        description: "CSS class for the timeline line color",
        required: false,
      },
      {
        name: "activeColor",
        type: "string",
        description: "CSS class for the active progress indicator",
        required: false,
      },
      {
        name: "progressIndicator",
        type: "boolean",
        description: "Whether to show the scrolling progress line",
        required: false,
      },
      {
        name: "cardVariant",
        type: '"default" | "elevated" | "outlined" | "filled"',
        description: "Visual style variant for the timeline cards",
        required: false,
      },
      {
        name: "cardEffect",
        type: '"none" | "glow" | "shadow" | "bounce"',
        description: "Interactive effect for cards on hover",
        required: false,
      },
      {
        name: "parallaxIntensity",
        type: "number",
        description: "Amount of parallax scroll effect (0 to disable)",
        required: false,
      },
      {
        name: "progressLineWidth",
        type: "number",
        description: "Width of the progress line in pixels",
        required: false,
      },
      {
        name: "progressLineCap",
        type: '"round" | "square"',
        description: "Shape of the progress line cap",
        required: false,
      },
      {
        name: "dateFormat",
        type: '"text" | "badge"',
        description: "How to display dates/years in the timeline",
        required: false,
      },
      {
        name: "className",
        type: "string",
        description: "Additional CSS classes to apply to the timeline",
        required: false,
      },
      {
        name: "revealAnimation",
        type: '"fade" | "slide" | "scale" | "flip" | "none"',
        description: "Animation style when revealing items",
        required: false,
      },
      {
        name: "connectorStyle",
        type: '"line" | "dots" | "dashed"',
        description: "Style of the connecting line between events",
        required: false,
      },
      {
        name: "perspective",
        type: "boolean",
        description: "Enable 3D perspective effects on cards",
        required: false,
      },
      {
        name: "darkMode",
        type: "boolean",
        description: "Use dark mode styling for the timeline",
        required: false,
      },
      {
        name: "smoothScroll",
        type: "boolean",
        description: "Enable smooth scrolling animations",
        required: false,
      },
      {
        name: "id",
        type: "string",
        description: "Unique identifier for the timeline event",
        required: false,
      },
      {
        name: "year",
        type: "string",
        description: "Year or timeframe of the event",
        required: true,
      },
      {
        name: "title",
        type: "string",
        description: "Main title of the timeline event",
        required: true,
      },
      {
        name: "subtitle",
        type: "string",
        description: "Optional subtitle (e.g. company or institution)",
        required: false,
      },
      {
        name: "description",
        type: "string",
        description: "Detailed description of the timeline event",
        required: true,
      },
      {
        name: "icon",
        type: "React.ReactNode",
        description: "Custom icon to display with the event",
        required: false,
      },
      {
        name: "color",
        type: "string",
        description: "Custom color for the event (Tailwind class)",
        required: false,
      },
    ],

    examples: [
      {
        title: "Career Timeline",
        description: "Professional journey display",
        code: `<ScrollTimeline 
  events={careerEvents}
  title="Career Timeline"
  subtitle="My professional journey"
/>`,
      },
      {
        title: "Educational History",
        description: "Academic achievements display",
        code: `<ScrollTimeline 
  events={educationEvents}
  title="Education"
  progressIndicator={true}
  cardEffect="shadow"
/>`,
      },
    ],
    variants: [
      {
        name: "Default",
        description: "Standard timeline with centered cards",
      },
      {
        name: "Alternating",
        description: "Cards positioned on alternating sides of the timeline",
      },
    ],
    accessibility: `The ScrollTimeline component is designed with accessibility in mind, providing keyboard navigation and proper ARIA attributes for screen readers.",
## Accessibility

- The ScrollTimeline component is designed to be accessible and keyboard navigable.
- All interactive elements have appropriate ARIA attributes.
- The component respects user reduced motion preferences.

## Browser Support

- Works on all modern browsers that support the Intersection Observer API.
- For older browsers, events will appear without animation.

## Performance

For optimal performance with many timeline events:
- Consider setting \`animationOrder="simultaneous"\` to reduce animation calculations
- Reduce the \`parallaxIntensity\` or set it to 0 for better performance on lower-end devices

## Customization

You can customize the appearance further by:
- Using custom icons for each timeline event
- Applying different colors to individual events
- Adding custom CSS classes to the timeline container
    `,
  },

  [formatName("Interactive Gradient")]: {
    description:
      "A gradient card component that responds to mouse movement with customizable colors and animations.",
    import: `import { InteractiveGradient } from "@/components/lightswind/interactive-gradient";`,

    usage: `
import { InteractiveGradient } from "@/components/lightswind/interactive-gradient";

export default function GradientCardExample() {
  return (
    <InteractiveGradient 
      color="#01c3a8" 
      glowColor="#107667ed" 
      followMouse={true}
      intensity={100}
    >
      <div className="p-6 text-white">
        <h3 className="text-xl font-bold">Interactive Card</h3>
        <p>This card responds to mouse movements</p>
      </div>
    </InteractiveGradient>
  );
}
    `,
    props: [
      {
        name: "color",
        type: "string",
        required: false,
        description: "Base color for the gradient",
      },
      {
        name: "glowColor",
        type: "string",
        required: false,
        description: "Secondary color (used in border and inner glow)",
      },
      {
        name: "width",
        type: "string",
        required: false,
        description: "Card width",
      },
      {
        name: "height",
        type: "string",
        required: false,
        description: "Card height",
      },
      {
        name: "borderRadius",
        type: "string",
        required: false,
        description: "Card border radius",
      },
      {
        name: "className",
        type: "string",
        required: false,
        description: "Custom CSS class name",
      },
      {
        name: "followMouse",
        type: "boolean",
        required: false,
        description: "Whether to follow mouse movement",
      },
      {
        name: "hoverOnly",
        type: "boolean",
        required: false,
        description: "Whether to animate on hover only",
      },
      {
        name: "intensity",
        type: "number",
        required: false,
        description: "Gradient intensity (0-100)",
      },
      {
        name: "backgroundColor",
        type: "string",
        required: false,
        description: "Background color",
      },
    ],
    accessibility: ` 
      "Use to create eye-catching cards or containers that respond to user interaction",
      "Configure colors to match your app's theme",
      "Adjust intensity for optimal visual effect",
      "Consider accessibility when choosing color combinations"
    `,
  },

  [formatName("Dynamic Navigation")]: {
    description:
      "A responsive navigation bar with animated highlight effects that follows user interactions.",
    import: `import { DynamicNavigation } from "@/components/lightswind/dynamic-navigation";`,
    usage: `
import { DynamicNavigation } from "@/components/lightswind/dynamic-navigation";
import { Home, ShoppingCart, Info, Phone } from "lucide-react";

const links = [
  { id: 'home', label: 'Home', href: '/', icon: <Home /> },
  { id: 'shop', label: 'Shop', href: '/shop', icon: <ShoppingCart /> },
  { id: 'about', label: 'About', href: '/about', icon: <Info /> },
  { id: 'contact', label: 'Contact', href: '/contact', icon: <Phone /> }
];

export default function NavigationExample() {
  return (
    <DynamicNavigation 
      links={links}
      theme="dark"
      glowIntensity={5}
      onLinkClick={(id) => console.log("Clicked:", id)}
    />
  );
}
    `,
    props: [
      {
        name: "links",
        type: "array",
        required: true,
        description:
          "Array of navigation links with id, label, href, and optional icon",
      },
      {
        name: "theme",
        type: "'dark' | 'light' | 'primary' | 'custom'",
        required: false,
        description: "Predefined color theme for the navigation",
      },
      {
        name: "backgroundColor",
        type: "string",
        required: false,
        description: "Background color (for custom theme)",
      },
      {
        name: "textColor",
        type: "string",
        required: false,
        description: "Text color (for custom theme)",
      },
      {
        name: "highlightColor",
        type: "string",
        required: false,
        description: "Highlight color (for custom theme)",
      },
      {
        name: "glowIntensity",
        type: "number",
        required: false,
        description: "Glow effect intensity (0-10)",
      },
      {
        name: "className",
        type: "string",
        required: false,
        description: "Additional CSS class name",
      },
      {
        name: "showLabelsOnMobile",
        type: "boolean",
        required: false,
        description: "Whether to show labels on mobile devices",
      },
      {
        name: "onLinkClick",
        type: "function",
        required: false,
        description: "Callback when a link is clicked with ID parameter",
      },
      {
        name: "activeLink",
        type: "string",
        required: false,
        description: "ID of initially active link",
      },
      {
        name: "enableRipple",
        type: "boolean",
        required: false,
        description: "Enable ripple effect on click",
      },
    ],

    accessibility: `
      "Use for primary navigation in applications or websites",
      "Configure the theme to match your brand identity",
      "Customize icons and labels for clear user understanding",
      "Consider mobile experience with the showLabelsOnMobile prop"
    `,
  },

  [formatName("Gradient Button")]: {
    description:
      "An animated button with gradient borders and optional glow effect.",
    import:
      "import { GradientButton } from '@/components/lightswind/gradient-button'",
    usage: `<GradientButton>
  Get Started
</GradientButton>`,
    props: [
      {
        name: "size",
        type: "'sm' | 'md' | 'lg' | 'xl'",
        description: "The size of the button.",
        required: false,
      },
      {
        name: "gradientColors",
        type: "string[]",
        description: "Array of color values to use in the gradient.",
        required: false,
      },
      {
        name: "animationSpeed",
        type: "number",
        description: "Animation speed of the gradient movement in seconds.",
        required: false,
      },
      {
        name: "glowEffect",
        type: "boolean",
        description: "Whether to show the glow effect beneath the button.",
        required: false,
      },
      {
        name: "glowSize",
        type: "number",
        description: "Size of the glow effect (1-10).",
        required: false,
      },
      {
        name: "variant",
        type: "'default' | 'outline' | 'ghost'",
        description: "The variant style of the button.",
        required: false,
      },
      {
        name: "className",
        type: "string",
        description: "Additional CSS classes to apply to the component.",
        required: false,
      },
    ],
    examples: [
      {
        title: "Default Gradient Button",
        description: "A simple gradient button with default styling.",
        code: `<GradientButton>
  Get Started
</GradientButton>`,
      },
      {
        title: "Custom Sized Gradient Button",
        description: "Gradient button with custom size and styling.",
        code: `<GradientButton 
  size="xl" 
  glowSize={6}
  className="font-bold"
>
  Sign Up Now
</GradientButton>`,
      },
      {
        title: "Custom Colors",
        description: "A gradient button with custom color scheme.",
        code: `<GradientButton 
  gradientColors={["#ff6d1b", "#ffee55"]} 
  size="lg"
>
  Orange Sunrise
</GradientButton>`,
      },
      {
        title: "Ghost Variant",
        description: "A ghost variant of the gradient button.",
        code: `<GradientButton 
  variant="ghost" 
  animationSpeed={0.5}
>
  Learn More
</GradientButton>`,
      },
    ],
    accessibility: `
      "Ensure sufficient contrast between button text and background for readability.",
      "The button is fully keyboard accessible and uses native button functionality.",
      "Consider providing an option with reduced motion for users with motion sensitivity."
     `,
  },

  [formatName("Count Up")]: {
    description:
      "Animated counter that counts from zero to a target value with configurable effects.",
    props: [
      {
        name: "value",
        type: "number",
        description: "The end value to count up to",
        required: true,
      },
      {
        name: "duration",
        type: "number",
        description: "The duration of the animation in seconds",
        required: false,
      },
      {
        name: "decimals",
        type: "number",
        description: "The decimal precision of the number",
        required: false,
      },
      {
        name: "prefix",
        type: "string",
        description: "The prefix to show before the number (e.g. '$')",
        required: false,
      },
      {
        name: "suffix",
        type: "string",
        description: "The suffix to show after the number (e.g. '%', 'k', 'M')",
        required: false,
      },
      {
        name: "easing",
        type: '"linear" | "easeIn" | "easeOut" | "easeInOut"',
        description: "The easing function to use for the animation",
        required: false,
      },
      {
        name: "separator",
        type: "string",
        description: "The separator for thousands",
        required: false,
      },
      {
        name: "interactive",
        type: "boolean",
        description: "Whether to enable interactive hover effects",
        required: false,
      },
      {
        name: "triggerOnView",
        type: "boolean",
        description:
          "Whether to trigger the animation when the element is in view",
        required: false,
      },
      {
        name: "animationStyle",
        type: '"default" | "bounce" | "spring" | "gentle" | "energetic"',
        description: "Animation style to apply",
        required: false,
      },
      {
        name: "colorScheme",
        type: '"default" | "gradient" | "primary" | "secondary" | "custom"',
        description: "Color scheme for the number",
        required: false,
      },
    ],
    import: `import { CountUp } from "@/components/lightswind/count-up"`,

    usage: `
import { CountUp } from "@/components/lightswind/count-up"

export function CountUpExample() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center">
        <p className="text-muted-foreground mb-2">Basic Usage</p>
        <CountUp value={1234} />
      </div>
      
      <div className="flex flex-col items-center">
        <p className="text-muted-foreground mb-2">With Prefix and Suffix</p>
        <CountUp
          value={99.9}
          prefix="$"
          suffix="%"
          decimals={1}
          duration={3}
        />
      </div>
      
      <div className="flex flex-col items-center">
        <p className="text-muted-foreground mb-2">Custom Animation</p>
        <CountUp
          value={5000}
          duration={2.5}
          animationStyle="spring"
          colorScheme="gradient"
        />
      </div>
      
      <div className="flex flex-col items-center">
        <p className="text-muted-foreground mb-2">Interactive</p>
        <CountUp
          value={1500}
          interactive={true}
          colorScheme="primary"
          animationStyle="bounce"
        />
      </div>
    </div>
  )
}`,
  },

  [formatName("Border Beam")]: {
    description:
      "A customizable animated border beam that moves around an element's border with gradient effects.",
    usage: `import { BorderBeam } from "@/components/lightswind/border-beam";

export default function BorderBeamDemo() {
  return (
    <div className="relative p-1 rounded-lg overflow-hidden">
      <BorderBeam 
        colorFrom="#7400ff" 
        colorTo="#9b41ff" 
        size={50}
        duration={6}
        borderThickness={2}
        glowIntensity={3}
      />
      <div className="relative bg-card p-4 rounded-md z-10">
        Content with animated border
      </div>
    </div>
  );
}`,
    import: `import { BorderBeam } from "@/components/lightswind/border-beam"`,

    props: [
      {
        name: "size",
        type: "number",
        description: "The size (width/height) of the border beam in pixels",
        required: false,
      },
      {
        name: "duration",
        type: "number",
        description: "The duration of one animation cycle in seconds",
        required: false,
      },
      {
        name: "delay",
        type: "number",
        description: "The delay before the animation starts in seconds",
        required: false,
      },
      {
        name: "colorFrom",
        type: "string",
        description: "The starting color of the border beam (CSS color)",
        required: false,
      },
      {
        name: "colorTo",
        type: "string",
        description: "The ending color of the border beam (CSS color)",
        required: false,
      },
      {
        name: "reverse",
        type: "boolean",
        description: "Reverses the animation direction",
        required: false,
      },
      {
        name: "initialOffset",
        type: "number",
        description: "Initial offset position of the beam (0-100%)",
        required: false,
      },
      {
        name: "borderThickness",
        type: "number",
        description: "The thickness of the border in pixels",
        required: false,
      },
      {
        name: "opacity",
        type: "number",
        description: "The opacity of the beam (0-1)",
        required: false,
      },
      {
        name: "glowIntensity",
        type: "number",
        description: "The intensity of the glow effect (0-10)",
        required: false,
      },
      {
        name: "beamBorderRadius",
        type: "number",
        description: "Border radius of the beam in pixels",
        required: false,
      },
      {
        name: "pauseOnHover",
        type: "boolean",
        description: "Whether to pause animation on hover",
        required: false,
      },
      {
        name: "speedMultiplier",
        type: "number",
        description: "Animation speed multiplier (higher is faster)",
        required: false,
      },
      {
        name: "transition",
        type: "object",
        description: "Custom transition properties for framer-motion",
        required: false,
      },
      {
        name: "className",
        type: "string",
        description: "Additional CSS classes to apply to the beam",
        required: false,
      },
      {
        name: "style",
        type: "React.CSSProperties",
        description: "Custom inline styles for the beam",
        required: false,
      },
    ],
    examples: [
      {
        title: "Basic Usage",
        description: "A simple border beam with default settings",
        code: `<div className="relative p-1 rounded-lg">
  <BorderBeam />
  <div className="relative bg-card p-4 rounded-md z-10">
    Content
  </div>
</div>`,
      },
      {
        title: "Custom Colors",
        description: "Customizing the gradient colors of the beam",
        code: `<div className="relative p-1 rounded-lg">
  <BorderBeam colorFrom="#f97316" colorTo="#ec4899" />
  <div className="relative bg-card p-4 rounded-md z-10">
    Content
  </div>
</div>`,
      },
      {
        title: "With Glow Effect",
        description: "Adding a glow effect to the beam",
        code: `<div className="relative p-1 rounded-lg">
  <BorderBeam 
    colorFrom="#22c55e" 
    colorTo="#10b981" 
    glowIntensity={5}
  />
  <div className="relative bg-card p-4 rounded-md z-10">
    Content
  </div>
</div>`,
      },
      {
        title: "Interactive Pause",
        description: "Pausing the animation on hover",
        code: `<div className="relative p-1 rounded-lg group">
  <BorderBeam pauseOnHover={true} />
  <div className="relative bg-card p-4 rounded-md z-10">
    Hover to pause
  </div>
</div>`,
      },
    ],
    variants: [
      {
        name: "Default",
        description: "Standard border beam with a gradient effect",
      },
      {
        name: "Glowing",
        description: "A border beam with glow effect for emphasis",
      },
      {
        name: "Interactive",
        description: "Animation that responds to user interaction",
      },
    ],
    accessibility: `
## Accessibility

- The BorderBeam component is purely decorative and does not affect the accessibility of the content it surrounds
- For users with motion sensitivity, you can conditionally render the component based on the user's prefers-reduced-motion setting
- The component is fully keyboard-accessible as it doesn't involve any interactive elements

## Browser Support

- The border beam effect works on all modern browsers that support CSS masks and Framer Motion animations
- For older browsers that don't support these features, the content remains accessible with a standard border

## Performance Considerations

- The animation is optimized for performance but may impact devices with limited GPU capabilities
- For better performance on mobile devices:
  - Consider using a larger duration value
  - Reduce the glowIntensity or set it to 0
  - Set opacity to a lower value
  - Use simpler gradient combinations

## Customization

You can customize the appearance by:
- Adjusting the size, duration, and delay
- Changing the colors using the colorFrom and colorTo props
- Modifying the borderThickness for different outline weights
- Adding a glow effect with glowIntensity
- Controlling animation speed with the speedMultiplier
    `,
  },

  [formatName("Animated Background")]: {
    description:
      "Creates an animated gradient blob background effect with interactive hover capabilities and customizable shapes.",
    import: `import { AnimatedBlobBackground } from "@/components/lightswind/animated-blob-background"`,
    usage: `import { AnimatedBlobBackground } from "@/components/lightswind/animated-blob-background"

export function AnimatedBlobBackgroundDemo() {
  return (
    <AnimatedBlobBackground
      blurAmount="12vw"
      firstBlobColors={["hotpink", "red", "orange", "yellow", "hotpink"]}
      secondBlobColors={["cyan", "blue", "green", "purple", "cyan"]}
      firstBlobSpeed={8000}
      secondBlobSpeed={6000}
      interactive={true}
    >
      {/* Optional content to display on top of the background */}
    </AnimatedBlobBackground>
  )
}`,
    props: [
      {
        name: "blurAmount",
        type: "string",
        description:
          "The amount of blur applied to the blobs (in pixels or viewport units)",
        required: false,
        default: "12vw",
      },
      {
        name: "firstBlobColors",
        type: "string[]",
        description: "Array of colors for the first blob gradient",
        required: false,
        default: "['hotpink', 'red', 'orange', 'yellow', 'hotpink']",
      },
      {
        name: "secondBlobColors",
        type: "string[]",
        description: "Array of colors for the second blob gradient",
        required: false,
        default: "['cyan', 'blue', 'green', 'purple', 'cyan']",
      },
      {
        name: "blobPath",
        type: "string",
        description: "Custom SVG path for the blob shapes",
        required: false,
        default: "polygon(...)",
      },
      {
        name: "firstBlobSpeed",
        type: "number",
        description: "Speed of the first blob rotation animation in ms",
        required: false,
        default: "8000",
      },
      {
        name: "secondBlobSpeed",
        type: "number",
        description: "Speed of the second blob rotation animation in ms",
        required: false,
        default: "6000",
      },
      {
        name: "firstBlobOpacity",
        type: "number",
        description: "Opacity of the first blob (0-1)",
        required: false,
        default: "0.66",
      },
      {
        name: "secondBlobOpacity",
        type: "number",
        description: "Opacity of the second blob (0-1)",
        required: false,
        default: "0.5",
      },
      {
        name: "firstBlobRotation",
        type: "number",
        description: "Initial rotation angle for the first blob in degrees",
        required: false,
        default: "0",
      },
      {
        name: "secondBlobRotation",
        type: "number",
        description: "Initial rotation angle for the second blob in degrees",
        required: false,
        default: "180",
      },
      {
        name: "isAnimating",
        type: "boolean",
        description: "Should the animation run or be paused",
        required: false,
        default: "true",
      },
      {
        name: "interactive",
        type: "boolean",
        description:
          "Enable interactive hover effects that respond to mouse movement",
        required: false,
        default: "false",
      },
      {
        name: "interactiveIntensity",
        type: "number",
        description: "Intensity of the interactive effect (1-10)",
        required: false,
        default: "5",
      },
      {
        name: "zIndex",
        type: "number",
        description: "Z-index for the background container",
        required: false,
        default: "-1",
      },
      {
        name: "blobCount",
        type: "1 | 2",
        description: "Number of blobs to show (1 or 2)",
        required: false,
        default: "2",
      },
      {
        name: "className",
        type: "string",
        description: "Additional class name for the background container",
        required: false,
      },
      {
        name: "style",
        type: "React.CSSProperties",
        description: "Custom styles for the background container",
        required: false,
      },
      {
        name: "children",
        type: "React.ReactNode",
        description: "Children elements to render on top of the background",
        required: false,
      },
    ],
    examples: [
      {
        title: "Basic Background",
        description: "A simple animated blob background with default settings",
        code: `<AnimatedBlobBackground />`,
      },
      {
        title: "Interactive Background",
        description: "Background that responds to mouse movement",
        code: `<AnimatedBlobBackground 
  interactive={true}
  interactiveIntensity={7}
  firstBlobColors={["#ff9900", "#ff0000", "#ff9900"]}
  secondBlobColors={["#0099ff", "#0044ff", "#0099ff"]}
/>`,
      },
      {
        title: "Custom Shape",
        description: "Background with a custom blob shape and single blob",
        code: `<AnimatedBlobBackground
  blobCount={1}
  blobPath="polygon(73% 26%, 89% 46%, 86% 71%, 57% 90%, 28% 84%, 11% 59%, 13% 29%, 28% 11%, 51% 8%)"
  firstBlobColors={["#8B5CF6", "#6366F1", "#3B82F6", "#8B5CF6"]}
  blurAmount="8vw"
/>`,
      },
      {
        title: "With Content",
        description: "Background with content displayed on top",
        code: `<AnimatedBlobBackground
  blurAmount="16vw"
  firstBlobOpacity={0.5}
  secondBlobOpacity={0.3}
>
  <div className="relative z-10 text-center text-white">
    <h1 className="text-4xl font-bold mb-4">Welcome</h1>
    <p className="text-xl">This content appears on top of the animated background</p>
  </div>
</AnimatedBlobBackground>`,
      },
    ],
    variants: [
      {
        name: "Default",
        description: "Standard dual-blob animated background",
      },
      {
        name: "Single Blob",
        description: "Background with only one animated blob",
      },
      {
        name: "Interactive",
        description: "Background that responds to mouse movement",
      },
      {
        name: "Custom Shape",
        description: "Background with custom blob shapes",
      },
    ],
    accessibility: `## Accessibility Considerations

- The AnimatedBlobBackground is designed primarily as a visual element and doesn't require interactive accessibility features.
- For users who prefer reduced motion, consider using the \`prefers-reduced-motion\` media query to disable or slow down animations.
- Ensure sufficient color contrast between the background and any content displayed on top of it.
- The background is automatically positioned at a negative z-index by default, ensuring it doesn't interfere with interactive elements.
- When using \`interactive={true}\`, be aware that the background will respond to mouse movements, which may be distracting for some users.

## Performance Considerations

- The animation performance depends on the complexity of the blob shape and blur amount.
- For better performance on mobile devices, consider using simpler shapes or reducing the blur amount.
- Setting \`isAnimating={false}\` when the component is not visible can help improve performance.
- The \`interactiveIntensity\` property can be adjusted to reduce the computational load of mouse tracking.`,
  },

  [formatName("Password Strength Indicator")]: {
    description:
      "A component that visually indicates the strength of a password as the user types, with customizable strength levels and visual feedback.",
    import: `import { PasswordStrengthIndicator } from "@/components/lightswind/password-strength-indicator"`,
    usage: `import { PasswordStrengthIndicator } from "@/components/lightswind/password-strength-indicator"

export function PasswordDemo() {
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState<StrengthLevel>("empty");
  
  return (
    <PasswordStrengthIndicator
      value={password}
      onChange={setPassword}
      onStrengthChange={setStrength}
      showScore={true}
    />
  )
}`,
    props: [
      {
        name: "value",
        type: "string",
        description: "The value of the password input",
        required: true,
      },
      {
        name: "onChange",
        type: "(value: string) => void",
        description: "Function called when password changes",
        required: false,
      },
      {
        name: "onStrengthChange",
        type: "(strength: StrengthLevel) => void",
        description: "Function called when strength level changes",
        required: false,
      },
      {
        name: "className",
        type: "string",
        description: "Class name for the container",
        required: false,
      },
      {
        name: "label",
        type: "string",
        description: "Label text for the password field",
        required: false,
        default: "Password",
      },
      {
        name: "showScore",
        type: "boolean",
        description: "Show strength score as text",
        required: false,
        default: "true",
      },
      {
        name: "showScoreNumber",
        type: "boolean",
        description: "Show strength score as number",
        required: false,
        default: "false",
      },
      {
        name: "placeholder",
        type: "string",
        description: "Placeholder text for input",
        required: false,
        default: "Enter your password",
      },
      {
        name: "showVisibilityToggle",
        type: "boolean",
        description: "Show toggle for password visibility",
        required: false,
        default: "true",
      },
      {
        name: "inputProps",
        type: "React.InputHTMLAttributes<HTMLInputElement>",
        description: "Additional props for the input element",
        required: false,
      },
      {
        name: "strengthColors",
        type: "Record<StrengthLevel, string>",
        description: "Custom color classes for different strength levels",
        required: false,
      },
      {
        name: "strengthLabels",
        type: "Record<StrengthLevel, string>",
        description: "Custom text labels for different strength levels",
        required: false,
      },
      {
        name: "criteria",
        type: "{ minLength?: number, requireUppercase?: boolean, requireLowercase?: boolean, requireNumbers?: boolean, requireSpecialChars?: boolean }",
        description: "Custom criteria for password strength calculation",
        required: false,
      },
      {
        name: "strengthScoreMapping",
        type: "Record<number, StrengthLevel>",
        description: "Custom mapping of scores to strength levels",
        required: false,
      },
    ],
    examples: [
      {
        title: "Basic Usage",
        description:
          "A simple password strength indicator with default settings",
        code: `<PasswordStrengthIndicator
  value={password}
  onChange={setPassword}
/>`,
      },
      {
        title: "With Strength Callback",
        description: "Using the strength level in your component",
        code: `<PasswordStrengthIndicator
  value={password}
  onChange={setPassword}
  onStrengthChange={(level) => {
    setIsValid(level === "strong" || level === "very-strong");
  }}
/>`,
      },
      {
        title: "Without Visibility Toggle",
        description:
          "Password strength indicator without the visibility toggle",
        code: `<PasswordStrengthIndicator
  value={password}
  onChange={setPassword}
  showVisibilityToggle={false}
/>`,
      },
      {
        title: "With Numeric Score",
        description: "Display the strength as a numeric score",
        code: `<PasswordStrengthIndicator
  value={password}
  onChange={setPassword}
  showScoreNumber={true}
  showScore={true}
/>`,
      },
      {
        title: "Custom Styling",
        description: "With custom styling for the container",
        code: `<PasswordStrengthIndicator
  value={password}
  onChange={setPassword}
  className="max-w-md rounded-xl p-4 border"
/>`,
      },
    ],
    variants: [
      {
        name: "Default",
        description: "Standard password strength indicator with text feedback",
      },
      {
        name: "With Numeric Score",
        description: "Shows the strength as a numeric value out of 10",
      },
      {
        name: "Without Visibility Toggle",
        description: "Hides the visibility toggle button",
      },
      {
        name: "Without Strength Label",
        description: "Shows only the visual indicator without text feedback",
      },
    ],
    accessibility: `## Accessibility Considerations

- The component uses proper labeling and ARIA attributes for screen readers.
- The password visibility toggle has appropriate aria-label for accessibility.
- Visual indicators use both color and icons to convey password strength for users with color vision deficiencies.
- The component respects user's motion preferences through prefers-reduced-motion media query.
- Password field uses proper HTML5 input type="password" for browser autocomplete and security features.

## Security Considerations

- Password strength calculation happens client-side only and doesn't transmit the password content.
- The strength calculation uses multiple factors: length, character variety, and complexity.
- Visual feedback helps users create stronger passwords without explicit instructions.
- The component never stores or logs password values.`,
  },

  [formatName("Dock")]: {
    description:
      "A customizable macOS-style dock component for navigation with magnification effect.",
    import: `import  Dock  from '@/components/lightswind/dock';`,
    usage: `import  Dock  from '@/components/lightswind/dock';
import { Home, Settings, Mail } from 'lucide-react';

// Define your dock items
const dockItems = [
  {
    icon: <Home size={24} />,
    label: 'Home',
    onClick: () => console.log('Home clicked')
  },
  {
    icon: <Settings size={24} />,
    label: 'Settings',
    onClick: () => console.log('Settings clicked')
  },
  {
    icon: <Mail size={24} />,
    label: 'Messages',
    onClick: () => console.log('Messages clicked')
  }
];

// Render the dock component
<Dock 
  items={dockItems}
  position="bottom"
  magnification={70}
  baseItemSize={50}
/>`,
    props: [
      {
        name: "items",
        type: "Array<{ icon: ReactNode, label: string, onClick?: () => void }>",
        required: true,
        description:
          "Array of items to display in the dock. Each item must have an icon and label.",
      },
      {
        name: "position",
        type: "'top' | 'right' | 'bottom' | 'left'",
        required: false,
        description: "Position of the dock on the screen.",
      },
      {
        name: "className",
        type: "string",
        required: false,
        description: "Additional CSS classes to apply to the dock container.",
      },
      {
        name: "magnification",
        type: "number",
        required: false,
        description:
          "Maximum size in pixels that items will grow to when hovered.",
      },
      {
        name: "baseItemSize",
        type: "number",
        required: false,
        description: "Default size in pixels of dock items when not hovered.",
      },
      {
        name: "distance",
        type: "number",
        required: false,
        description:
          "Distance in pixels over which the magnification effect spreads to neighboring items.",
      },
      {
        name: "panelHeight",
        type: "number",
        required: false,
        description:
          "Height of the dock panel in pixels when not being hovered.",
      },
      {
        name: "dockHeight",
        type: "number",
        required: false,
        description:
          "Maximum height of the dock panel in pixels when being hovered.",
      },
      {
        name: "spring",
        type: "{ mass: number, stiffness: number, damping: number }",
        required: false,
        description: "Spring physics configuration for the animation effects.",
      },
    ],
    examples: [
      {
        title: "Basic",
        description: "Standard dock with magnification effect.",
        code: `<Dock items={dockItems} />`,
      },
      {
        title: "Vertical",
        description: "Dock positioned on the left or right side of the screen.",
        code: `<Dock items={dockItems} position="left" />`,
      },
      {
        title: "Custom Theme",
        description: "Dock with custom styling.",
        code: `<Dock 
  items={dockItems} 
  className="bg-gradient-to-r from-violet-500 to-purple-500 border-purple-400" 
/>`,
      },
      {
        title: "Fixed Size",
        description: "Dock with no magnification effect.",
        code: `<Dock 
  items={dockItems} 
  magnification={50}
  baseItemSize={50}
  distance={0}
/>`,
      },
      {
        title: "With Custom Spring Physics",
        description: "Dock with custom animation physics.",
        code: `<Dock 
  items={dockItems} 
  spring={{ 
    mass: 0.2, 
    stiffness: 200, 
    damping: 20 
  }} 
/>`,
      },
    ],
    accessibility: `
      keyboard: "Dock items can be navigated using Tab key and activated with Enter or Space. Focus indicators are visible when navigating with keyboard.",
      screen_readers: "Each dock item has appropriate roles and ARIA attributes for screen reader accessibility. The dock uses role='toolbar' and each item uses role='button'."
    
       best_practices: [
      "Keep the number of dock items reasonable to avoid overcrowding",
      "Use clear, recognizable icons for each item",
      "Provide descriptive labels for each icon",
      "Consider using badges sparingly for notifications",
      "Adjust magnification and distance settings for optimal user experience",
      "Consider positioning based on your layout - bottom for desktop-like experiences, left/right for app-like interfaces"
    ],
    references: [
      {
        name: "Framer Motion Documentation",
        url: "https://www.framer.com/motion/"
      },
      {
        name: "Apple Human Interface Guidelines - Dock",
        url: "https://developer.apple.com/design/human-interface-guidelines/macos/system-elements/dock/"
      }
    ]`,
  },

  [formatName("Interactive Gradient Card")]: {
    description:
      "A customizable interactive gradient background that responds to mouse movements and provides visual feedback.",
    import: `import { InteractiveGradient } from "@/components/lightswind/interactive-gradient"`,
    usage: `import { InteractiveGradient } from "@/components/lightswind/interactive-gradient"

// Basic usage
<InteractiveGradient>
  <div className="p-6 text-white">
    <h3 className="text-xl font-bold">Interactive Card</h3>
    <p>Hover or move your mouse around to see the gradient effect</p>
  </div>
</InteractiveGradient>

// With custom colors and options
<InteractiveGradient
  color="#1890ff"
  glowColor="#107667ed"
  followMouse={true}
  hoverOnly={false}
  intensity={100}
  backgroundColor="#151419"
  width="20rem"
  height="20rem"
  borderRadius="2.25rem"
>
  <div className="p-6 text-white">Content here</div>
</InteractiveGradient>`,
    props: [
      {
        name: "color",
        type: "string",
        required: false,
        description: "Base color for the gradient and border.",
      },
      {
        name: "glowColor",
        type: "string",
        required: false,
        description: "Secondary color used in the inner glow effect.",
      },
      {
        name: "width",
        type: "string",
        required: false,
        description: "Width of the gradient card.",
      },
      {
        name: "height",
        type: "string",
        required: false,
        description: "Height of the gradient card.",
      },
      {
        name: "borderRadius",
        type: "string",
        required: false,
        description: "Border radius of the gradient card.",
      },
      {
        name: "className",
        type: "string",
        required: false,
        description: "Additional CSS classes to apply to the gradient card.",
      },
      {
        name: "children",
        type: "React.ReactNode",
        required: false,
        description: "Content to render inside the gradient card.",
      },
      {
        name: "followMouse",
        type: "boolean",
        required: false,
        description:
          "Whether to follow mouse movement for the gradient effect.",
      },
      {
        name: "hoverOnly",
        type: "boolean",
        required: false,
        description: "Whether to only show the effect when hovering.",
      },
      {
        name: "intensity",
        type: "number",
        required: false,
        description:
          "Gradient intensity (0-100), higher values create stronger effects.",
      },
      {
        name: "backgroundColor",
        type: "string",
        required: false,
        description: "Background color of the gradient card.",
      },
    ],
    examples: [
      {
        title: "Basic",
        description: "Standard interactive gradient with default settings.",
        code: `<InteractiveGradient>
  <div>Content here</div>
</InteractiveGradient>`,
      },
      {
        title: "Custom Colors",
        description:
          "Gradient with custom colors for a different visual effect.",
        code: `<InteractiveGradient
  color="#ff0055"
  glowColor="#ff005587"
  backgroundColor="#000"
>
  <div>Content here</div>
</InteractiveGradient>`,
      },
      {
        title: "Hover Only",
        description: "Gradient that only activates when hovered.",
        code: `<InteractiveGradient
  followMouse={true}
  hoverOnly={true}
>
  <div>Hover to see effect</div>
</InteractiveGradient>`,
      },
      {
        title: "High Intensity",
        description:
          "Gradient with increased intensity for a more dramatic effect.",
        code: `<InteractiveGradient
  intensity={200}
  glowColor="#107667"
>
  <div>High intensity effect</div>
</InteractiveGradient>`,
      },
      {
        title: "Glass Effect",
        description:
          "Gradient with lower opacity and blur for a glass-like appearance.",
        code: `<InteractiveGradient
  intensity={70}
  className="backdrop-blur-md"
  backgroundColor="rgba(0,0,0,0.2)"
>
  <div>Glass effect</div>
</InteractiveGradient>`,
      },
    ],
    accessibility: `
      keyboard: "The gradient effect is purely visual and doesn't affect keyboard navigation.",
      screen_readers: "The gradient effect is decorative and doesn't convey essential information to screen readers."
    },
    best_practices: [
      "Use appropriate color combinations that maintain sufficient contrast for content readability",
      "Avoid excessive intensity values that might be distracting to users",
      "Consider providing a reduced-motion alternative for users who prefer minimal animations",
      "Use the hoverOnly option for larger components to prevent constant visual changes",
      "Ensure content within the gradient remains accessible and readable"
    ],
    references: [
      {
        name: "Framer Motion Documentation",
        url: "https://www.framer.com/motion/"
      },
      {
        name: "Web Content Accessibility Guidelines (WCAG) - Animation",
        url: "https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html"
      }
    `,
  },

  [formatName("Magic Cursor")]: {
    description:
      "An interactive, WebGL-powered animated particle cursor powered by threejs-toys. Highly customizable with support for vibrant effects, performance tuning, and click interactions.",
    import: `import MagicCursor from "@/components/lightswind/magic-cursor"`,
    usage: `import MagicCursor from "@/components/lightswind/magic-cursor"

// Default usage
<MagicCursor>
  <div className="h-64 flex items-center justify-center">
    Move your mouse here!
  </div>
</MagicCursor>

// Custom configuration
<MagicCursor
  config={{
    colors: [0xff0066, 0x00fffc, 0x0000ff],
    pointSize: 5,
    noiseIntensity: 0.01,
    coordScale: 1,
    gpgpuSize: 1024
  }}
  clickInteraction={true}
  resetDuration={3000}
  showOnMobile={false}
>
  <div className="h-96 flex items-center justify-center">
    <span className="text-lg font-semibold">Try clicking!</span>
  </div>
</MagicCursor>`,
    props: [
      {
        name: "target",
        type: "HTMLElement | string",
        required: false,
        description:
          "DOM element or selector to attach the cursor effect; defaults to container.",
      },
      {
        name: "config.colors",
        type: "number[]",
        required: false,
        description:
          "Array of color hex codes for particle gradient ([0x00fffc, 0x0000ff] default).",
      },
      {
        name: "config.color",
        type: "number",
        required: false,
        description: "Primary particle color (default: 0xff0000).",
      },
      {
        name: "config.coordScale",
        type: "number",
        required: false,
        description: "Scaling for cursor–particle mapping (default: 0.5).",
      },
      {
        name: "config.noiseIntensity",
        type: "number",
        required: false,
        description: "Controls particle movement randomness (default: 0.005).",
      },
      {
        name: "config.noiseTimeCoef",
        type: "number",
        required: false,
        description: "Noise animation speed coefficient (default: 0.0001).",
      },
      {
        name: "config.pointSize",
        type: "number",
        required: false,
        description: "Particle visual size (default: 2).",
      },
      {
        name: "config.pointDecay",
        type: "number",
        required: false,
        description: "Fade rate of particles (default: 0.0025).",
      },
      {
        name: "config.sleepRadiusX",
        type: "number",
        required: false,
        description: "X radius for idle particle state (default: 250).",
      },
      {
        name: "config.sleepRadiusY",
        type: "number",
        required: false,
        description: "Y radius for idle particle state (default: 250).",
      },
      {
        name: "config.sleepTimeCoefX",
        type: "number",
        required: false,
        description:
          "Coefficient for X axis sleep animation speed (default: 0.001).",
      },
      {
        name: "config.sleepTimeCoefY",
        type: "number",
        required: false,
        description:
          "Coefficient for Y axis sleep animation speed (default: 0.002).",
      },
      {
        name: "config.gpgpuSize",
        type: "number",
        required: false,
        description:
          "Controls the number of particles (options: 256, 512, 1024; default: 512).",
      },
      {
        name: "enabled",
        type: "boolean",
        required: false,
        description:
          "Enable or disable the cursor effect entirely (default: true).",
      },
      {
        name: "className",
        type: "string",
        required: false,
        description: "Extra CSS classes for the container.",
      },
      {
        name: "clickInteraction",
        type: "boolean",
        required: false,
        description:
          "If true, clicking triggers randomized particle effects (default: true).",
      },
      {
        name: "resetDuration",
        type: "number",
        required: false,
        description:
          "Milliseconds before effect resets after click (default: 2000).",
      },
      {
        name: "showOnMobile",
        type: "boolean",
        required: false,
        description: "Force enable on mobile/touch devices (default: false).",
      },
      {
        name: "interactionColors",
        type: "number[]",
        required: false,
        description:
          "Array of particle colors to cycle during interaction ([0xff0000, 0x00ff00, ...] by default).",
      },
      {
        name: "children",
        type: "React.ReactNode",
        required: false,
        description: "Content inside the magic cursor container.",
      },
    ],
    examples: [
      {
        title: "Default Style",
        description: "Minimal magic cursor with default settings.",
        code: `<MagicCursor>
  <div className="flex h-48 items-center justify-center">Hover your mouse!</div>
</MagicCursor>`,
      },
      {
        title: "Energetic Preset",
        description: "Faster, bolder particles and custom colors.",
        code: `<MagicCursor
  config={{
    colors: [0xff0000, 0xffff00],
    coordScale: 1.2,
    noiseIntensity: 0.01,
    pointSize: 4,
    pointDecay: 0.005
  }}
/>`,
      },
      {
        title: "Subtle Style",
        description: "Very gentle, background-only effect.",
        code: `<MagicCursor
  config={{
    colors: [0x888888, 0xcccccc],
    coordScale: 0.2,
    noiseIntensity: 0.001,
    pointSize: 1,
    pointDecay: 0.001
  }}
/>`,
      },
      {
        title: "Mobile Disabled",
        description: "Cursor is not shown on mobile devices.",
        code: `<MagicCursor showOnMobile={false}>
  <div>Desktop magic only!</div>
</MagicCursor>`,
      },
      {
        title: "Click Interaction",
        description: "Particles animate with color/size bursts on click.",
        code: `<MagicCursor clickInteraction resetDuration={4000} />`,
      },
    ],
    accessibility: `
      {
        keyboard: "This component is purely visual and does not impact keyboard navigation.",
        screen_readers: "Particle effects are decorative and not announced. Content should remain accessible.",
        aria: "You may set aria-hidden='true' if there are no relevant interactive children."
      }
    ],
    best_practices: [
      "Use subtle colors/effects for background enhancement; avoid overwhelming overlays.",
      "Disable on mobile and low-end devices for better performance.",
      "Keep contrast and content accessibility in mind; never let particles obscure information.",
      "Always provide interactive content within the container for accessibility.",
      "Performance-test with large particle counts (high gpgpuSize) as appropriate for your users."
    ],
    references: [
      {
        name: "threejs-toys documentation",
        url: "https://github.com/ykob/threejs-toys"
      },
      {
        name: "WebGL Fundamentals",
        url: "https://webglfundamentals.org/"
      }
    `,
  },

  [formatName("Particle Orbit Effect")]: {
    description:
      "Beautiful orbital particle effect that follows cursor movement across the entire screen. Creates mesmerizing trails of particles that orbit around the mouse position with customizable colors, intensity, and behavior.",
    import: `import ParticleOrbitEffect from "@/components/lightswind/ParticleOrbitEffect"`,
    usage: `import ParticleOrbitEffect from "@/components/lightswind/ParticleOrbitEffect";

// Basic Usage
<ParticleOrbitEffect />

// Custom Configuration
<ParticleOrbitEffect 
  particleCount={30}
  radius={80}
  intensity={1.2}
  colorRange={[180, 270]}
  autoColors={true}
/>

// Energetic Preset
<ParticleOrbitEffect 
  particleCount={40}
  radius={90}
  particleSpeed={0.04}
  radiusScale={2}
  intensity={1.5}
  colorRange={[0, 60]}
/>
// Subtle Background Effect
<ParticleOrbitEffect 
  particleCount={15}
  radius={50}
  intensity={0.7}
  fadeOpacity={0.03}
  colorRange={[180, 270]}
  disabled={false}
/>`,
    props: [
      {
        name: "className",
        type: "string",
        required: false,
        description: "Additional CSS classes for the container.",
        default: "undefined",
      },
      {
        name: "style",
        type: "React.CSSProperties",
        required: false,
        description: "Inline styles for the canvas element.",
        default: "undefined",
      },
      {
        name: "particleCount",
        type: "number",
        required: false,
        description: "Number of particles in the orbital system.",
        default: "25",
      },
      {
        name: "radius",
        type: "number",
        required: false,
        description: "Base orbit radius in pixels around the cursor.",
        default: "70",
      },
      {
        name: "particleSpeed",
        type: "number",
        required: false,
        description: "Speed of particle movement and orbital rotation.",
        default: "0.025",
      },
      {
        name: "radiusScale",
        type: "number",
        required: false,
        description: "Scale factor applied to radius when mouse is pressed.",
        default: "1.5",
      },
      {
        name: "intensity",
        type: "number",
        required: false,
        description: "Overall intensity multiplier for all effects.",
        default: "1",
      },
      {
        name: "fadeOpacity",
        type: "number",
        required: false,
        description: "Opacity of the trailing fade effect (0.01-0.2).",
        default: "0.05",
      },
      {
        name: "colorRange",
        type: "[number, number]",
        required: false,
        description:
          "HSL hue range for particle colors [start, end] in degrees.",
        default: "[0, 360]",
      },
      {
        name: "disabled",
        type: "boolean",
        required: false,
        description:
          "Disable the effect entirely while keeping component mounted.",
        default: "false",
      },
      {
        name: "followMouse",
        type: "boolean",
        required: false,
        description: "Whether particles should follow mouse movement.",
        default: "true",
      },
      {
        name: "autoColors",
        type: "boolean",
        required: false,
        description: "Enable automatic color transitions over time.",
        default: "true",
      },
      {
        name: "particleSize",
        type: "number",
        required: false,
        description: "Base size of individual particles in pixels.",
        default: "2",
      },
    ],
    examples: [
      {
        title: "Website Background",
        description: "Add as a subtle background effect for portfolios",
        code: `<div className="relative min-h-screen">
  <ParticleOrbitEffect 
    particleCount={20}
    intensity={0.8}
    fadeOpacity={0.03}
    colorRange={[200, 250]}
  />
  <div className="relative z-10">
    {/* Your content here */}
  </div>
</div>`,
      },
      {
        title: "Interactive Landing Page",
        description: "High-energy effect for modern landing pages",
        code: `<ParticleOrbitEffect 
  particleCount={35}
  radius={85}
  particleSpeed={0.035}
  radiusScale={2.2}
  intensity={1.3}
  colorRange={[0, 120]}
  autoColors={true}
/>`,
      },
      {
        title: "Gaming Theme",
        description: "Cosmic space-like effect with purple/blue colors",
        code: `<ParticleOrbitEffect 
  particleCount={40}
  radius={100}
  particleSpeed={0.03}
  intensity={1.2}
  fadeOpacity={0.06}
  colorRange={[240, 300]}
  particleSize={2.5}
/>`,
      },
      {
        title: "Mobile Optimized",
        description: "Performance-optimized settings for mobile devices",
        code: `<ParticleOrbitEffect 
  particleCount={15}
  radius={50}
  particleSpeed={0.02}
  intensity={0.7}
  fadeOpacity={0.04}
  particleSize={1.5}
/>`,
      },
    ],
    accessibility: ` [
      "Particles are hidden from screen readers with aria-hidden",
      "Effect can be disabled via the disabled prop for motion-sensitive users",
      "Consider respecting prefers-reduced-motion CSS media query",
      "Provide toggle controls in your UI for users to disable the effect",
      "Ensure sufficient color contrast for any text content overlaying the effect"
    ],
    best_practices: [
      "Use lower particle counts (10-20) on mobile devices for better performance",
      "Keep intensity values between 0.5-1.5 for natural-looking motion",
      "Use fadeOpacity 0.02-0.08 for optimal trail effects",
      "Choose colorRange based on your site's theme and branding",
      "Enable autoColors for dynamic sites, disable for consistent branding",
      "Test across different devices and screen sizes",
      "Consider adding user preference toggles for accessibility",
      "Position with high z-index but ensure it doesn't interfere with interactions"
    ],
    troubleshooting: [
      {
        issue: "Effect not visible",
        solution: "Check that canvas dimensions are set correctly and z-index is high enough. Ensure particles aren't being rendered outside viewport."
      },
      {
        issue: "Poor performance or stuttering",
        solution: "Reduce particleCount, lower intensity, or increase fadeOpacity. Consider disabling autoColors."
      },
      {
        issue: "Particles not following mouse",
        solution: "Ensure followMouse prop is true and mouse events are being captured correctly."
      },
      {
        issue: "Colors not changing",
        solution: "Check that autoColors is enabled and colorRange has sufficient span. Verify HSL values are valid (0-360)."
      },
      {
        issue: "Effect interfering with page interactions",
        solution: "Ensure the component has pointer-events-none class applied to prevent blocking clicks."
      },
      {
        issue: "Canvas appearing blank on mobile",
        solution: "Check touch event handling and ensure canvas dimensions are properly set for mobile viewports."
      }
    ]`,
  },

  [formatName("Scrolling Cube Carousel")]: {
    description:
      "A stunning 3D cube carousel that rotates through items as the user scrolls. Built with GSAP ScrollTrigger for smooth, performant animations with customizable themes and interactions.",
    import: `import ScrollCube3D, { CubeItem } from "@/components/lightswind/scroll-cube-3d"`,
    usage: `import ScrollCube3D, { CubeItem } from "@/components/lightswind/scroll-cube-3d";

// Basic Usage
const items: CubeItem[] = [
  {
    title: "Mountain Landscape",
    image: "https://example.com/mountain.jpg"
  },
  {
    title: "Ocean View", 
    image: "https://example.com/ocean.jpg",
    href: "https://example.com",
    target: "_blank"
  },
  {
    title: "Forest Path",
    image: "https://example.com/forest.jpg"
  },
  {
    title: "Desert Dunes",
    image: "https://example.com/desert.jpg"
  }
];

<ScrollCube3D items={items} />

// Custom Configuration
<ScrollCube3D
  items={items}
  showTitles={true}
  cubeSize={400}
  scrollHeight={2000}
  theme="dark"
  onItemClick={(item, index) => {
    console.log('Clicked:', item.title);
  }}
/>

// Light Theme with Custom Size
<ScrollCube3D
  items={items}
  theme="light"
  cubeSize={300}
  showTitles={false}
  scrollHeight={1200}
  className="my-custom-class"
/>`,
    props: [
      {
        name: "items",
        type: "CubeItem[]",
        required: true,
        description:
          "Array of items to display on cube faces. Each item needs title and image. If fewer than 4 items provided, they will cycle to fill all faces.",
        default: "[]",
      },
      {
        name: "showTitles",
        type: "boolean",
        required: false,
        description: "Whether to display titles on each cube face",
        default: "true",
      },
      {
        name: "cubeSize",
        type: "number",
        required: false,
        description: "Size of the cube in pixels (both width and height)",
        default: "380",
      },
      {
        name: "scrollHeight",
        type: "number",
        required: false,
        description:
          "Height in pixels that user needs to scroll to complete full cube rotation",
        default: "1600",
      },
      {
        name: "theme",
        type: '"dark" | "light"',
        required: false,
        description: "Visual theme for background and text colors",
        default: '"dark"',
      },
      {
        name: "className",
        type: "string",
        required: false,
        description: "Additional CSS classes for the cube container",
        default: "undefined",
      },
      {
        name: "onItemClick",
        type: "(item: CubeItem, index: number) => void",
        required: false,
        description: "Callback function when a cube face is clicked",
        default: "undefined",
      },
    ],
    examples: [
      {
        title: "Basic Cube Carousel",
        description: "Simple 4-item cube with default settings",
        code: `const items = [
  { title: "Item 1", image: "image1.jpg" },
  { title: "Item 2", image: "image2.jpg" },
  { title: "Item 3", image: "image3.jpg" },
  { title: "Item 4", image: "image4.jpg" }
];

<ScrollCube3D items={items} />`,
      },
      {
        title: "Custom Size and Theme",
        description: "Light theme with larger cube size",
        code: `<ScrollCube3D
  items={items}
  theme="light"
  cubeSize={450}
  scrollHeight={2400}
/>`,
      },
      {
        title: "Interactive with Click Handler",
        description: "Handle clicks on cube faces with custom logic",
        code: `<ScrollCube3D
  items={items}
  onItemClick={(item, index) => {
    console.log(\`Clicked \${item.title} on face \${index}\`);
    // Custom click logic here
  }}
/>`,
      },
      {
        title: "Minimal Clean Design",
        description: "Hidden titles with faster scroll animation",
        code: `<ScrollCube3D
  items={items}
  showTitles={false}
  scrollHeight={1000}
  cubeSize={320}
/>`,
      },
    ],
    accessibility: ` [
      "Ensure all images have proper alt text for screen readers",
      "Consider reduced motion preferences - effects may trigger motion sensitivity",
      "Cube rotation may not be accessible to screen readers",
      "Provide alternative navigation method for users who cannot scroll effectively",
      "High contrast maintained between text and backgrounds in both themes"
    ],
    best_practices: [
      "Use high-quality square images (600x600px minimum) for best results",
      "Keep titles concise as space is limited on cube faces",
      "Test scroll performance on different devices and adjust animationSpeed accordingly",
      "Consider providing only 4 items maximum as cube has 4 faces",
      "Use consistent image aspect ratios for uniform appearance",
      "Place component in contexts where scroll behavior is expected"
    ],
    troubleshooting: [
      {
        issue: "Cube not rotating on scroll",
        solution: "Ensure GSAP and ScrollTrigger are properly loaded. Check that the component has sufficient scroll space above and below."
      },
      {
        issue: "Images not loading or appearing blurry",
        solution: "Verify image URLs are correct and accessible. Use high-resolution images (600x600px minimum) for crisp display."
      },
      {
        issue: "Animation feels choppy or laggy",
        solution: "Reduce animationSpeed value and ensure the device supports hardware acceleration. Consider using smaller cubeSize on mobile."
      },
      {
        issue: "Scroll doesn't pin the section",
        solution: "Check that ScrollTrigger is registered and the section has proper height context around it."
      },
      {
        issue: "Text not visible on certain backgrounds",
        solution: "Ensure backgroundColor prop matches your design theme. White theme uses dark text, black theme uses light text."
      }
    ] `,
  },

  [formatName("Canvas Confetti Cursor")]: {
    description:
      "A fully configurable Canvas-based animated confetti effect that follows the cursor. Designed for professional visual feedback and celebration effects.",
    import: `import { CanvasConfettiCursor } from "@/components/lightswind/CanvasConfettiCursor"`,
    usage: `import { CanvasConfettiCursor } from "@/components/lightswind/CanvasConfettiCursor";

// Fullscreen usage
<CanvasConfettiCursor />

// Container usage
<div style={{ height: 300, position: 'relative' }}>
  <CanvasConfettiCursor fillParent particleCount={25} />
</div>
`,
    props: [
      {
        name: "colors",
        type: "string[]",
        required: false,
        description: "List of colors for confetti particles.",
      },
      {
        name: "minSize",
        type: "number",
        required: false,
        description: "Minimum particle radius (default: 2).",
      },
      {
        name: "maxSize",
        type: "number",
        required: false,
        description: "Maximum particle radius (default: 7).",
      },
      {
        name: "particleCount",
        type: "number",
        required: false,
        description: "Particles generated per burst (default: 40).",
      },
      {
        name: "frequency",
        type: "number",
        required: false,
        description: "Time between bursts in ms (default: 50).",
      },
      {
        name: "fillParent",
        type: "boolean",
        required: false,
        description:
          "If true, restricts confetti to parent; otherwise, fullscreen.",
      },
      {
        name: "overlayOpacity",
        type: "number",
        required: false,
        description: "Opacity of overlay/particles (default: 1).",
      },
      {
        name: "decay",
        type: "number",
        required: false,
        description:
          "Rate at which particle radius shrinks each frame (default: 0.98).",
      },
      {
        name: "onExplosion",
        type: "(x: number, y: number) => void",
        required: false,
        description: "Callback for each confetti burst (with burst x/y).",
      },
      {
        name: "enabled",
        type: "boolean",
        required: false,
        description: "Enable/disable the confetti effect (default: true).",
      },
      {
        name: "className",
        type: "string",
        required: false,
        description: "Additional canvas class.",
      },
      {
        name: "style",
        type: "React.CSSProperties",
        required: false,
        description: "Custom canvas style (e.g. zIndex, pointerEvents).",
      },
    ],
    examples: [
      {
        title: "Default Fullscreen",
        description:
          "Config for a fullscreen, cursor-tracking confetti cascade.",
        code: `<CanvasConfettiCursor />`,
      },
      {
        title: "Confetti With Custom Colors & Lower Opacity",
        description:
          "Themed confetti for a party effect with reduced overlay opacity.",
        code: `<CanvasConfettiCursor colors={["#FF69B4", "#FFD700", "#4CAF50"]} overlayOpacity={0.7} />`,
      },
      {
        title: "Container Restricted, Lower Particle Count",
        description: "Show confetti only within a specific box.",
        code: `<div className="relative w-full h-80">
  <CanvasConfettiCursor fillParent particleCount={20} frequency={120} />
</div>`,
      },
      {
        title: "Responsive Particle Sizes and Speed",
        description: "Fine-tune for subtle visual feedback.",
        code: `<CanvasConfettiCursor minSize={1} maxSize={4} decay={0.96} />`,
      },
    ],
    accessibility: ` [
    "Purely visual effect; focusable children not affected.",
    "Canvas has aria-hidden and pointer-events as needed.",
    "Does not interfere with keyboard navigation or screen readers."
  ],
  best_practices: [
    "Avoid using in heavy animation layers for performance.",
    "Adjust opacity, particle count and frequency to optimize appearance and CPU usage.",
    "For accessibility, avoid overlapping actionable UI.",
    "Destroy and cleanup the component on unmount if controlling manually."
  ],
  references: [
    {
      name: "CanvasRenderingContext2D",
      url: "https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D"
    }
  ]`,
  },

  [formatName("Animated Ocean Waves")]: {
    description:
      "A professional, customizable animated SVG ocean wave effect for footers, hero backgrounds, or decorative sections.",
    import: `import { AnimatedOceanWaves } from "@/components/lightswind/AnimatedOceanWaves"`,
    usage: `import { AnimatedOceanWaves } from "@/components/lightswind/AnimatedOceanWaves";

// Full width footer
<AnimatedOceanWaves height="80px" oceanBackground="#28b4d6" />

// Overlay at the bottom of a hero section
<div className="relative h-[420px]">
  {/* Other hero content */}
  <AnimatedOceanWaves className="absolute left-0 bottom-0 w-full" height="72px" zIndex={10} />
</div>`,
    props: [
      {
        name: "height",
        type: "string",
        required: false,
        description: "Height of the ocean container (e.g., '5%', '80px').",
      },
      {
        name: "oceanBackground",
        type: "string",
        required: false,
        description: "Background color/gradient for the ocean container.",
      },
      {
        name: "waveImageUrl",
        type: "string",
        required: false,
        description: "SVG image URL for the wave pattern.",
      },
      {
        name: "waveDuration",
        type: "number",
        required: false,
        description: "Wave animation cycle duration in seconds.",
      },
      {
        name: "waveOffset",
        type: "number",
        required: false,
        description:
          "Pixel offset between front and back waves (controls parallax distance).",
      },
      {
        name: "frontWaveOpacity",
        type: "number",
        required: false,
        description: "Opacity of front wave.",
      },
      {
        name: "backWaveOpacity",
        type: "number",
        required: false,
        description: "Opacity of back (parallax) wave.",
      },
      {
        name: "className",
        type: "string",
        required: false,
        description: "Optional extra class for container.",
      },
      {
        name: "style",
        type: "React.CSSProperties",
        required: false,
        description: "Inline style for container.",
      },
      {
        name: "zIndex",
        type: "number",
        required: false,
        description: "Z-index for overlay stacking.",
      },
    ],
    examples: [
      {
        title: "Full Width Ocean at Page Bottom",
        description: "Use as an animated bottom border/footer.",
        code: `<AnimatedOceanWaves height="64px" oceanBackground="#317e96" />`,
      },
      {
        title: "Inside a Card with Custom Opacity",
        description: "Layer inside a card with softened waves.",
        code: `<div className="relative w-full h-48 rounded overflow-hidden">
  <AnimatedOceanWaves
    height="40%"
    oceanBackground="rgba(34,197,244,0.5)"
    frontWaveOpacity={0.7}
    backWaveOpacity={0.28}
    waveDuration={10}
  />
  <div className="relative z-10 p-6 text-white">
    <h3>Get Started</h3>
    <p>Make a splash with animated waves!</p>
  </div>
</div>`,
      },
      {
        title: "Custom Wave Image",
        description: "Swap out the SVG for a different style.",
        code: `<AnimatedOceanWaves waveImageUrl="/custom-waves.svg" />`,
      },
    ],
    accessibility: ` [
      "Decorative/visual element only; use aria-hidden.",
      "Does not impact tab order, keyboard, or screen reader navigation."
    ],
    best_practices: [
      "Use for decorative section backgrounds or footers.",
      "Control layering using zIndex/className.",
      "Set pointer-events to none if layered above interactive elements.",
      "Optimize performance by not overusing on mobile."
    ],
    references: [
      { name: "CSS Keyframes Animation", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/@keyframes" }
    ]
      `,
  },

  [formatName("Hamburger Menu Overlay")]: {
    description:
      "A professional, fully customizable hamburger menu with animated full-screen overlay. Features smooth GSAP-style animations, responsive design, and comprehensive accessibility support.",
    import: `import { HamburgerMenuOverlay } from "@/components/lightswind/HamburgerMenuOverlay"`,
    usage: `import { HamburgerMenuOverlay } from "@/components/lightswind/HamburgerMenuOverlay";
import { Home, Search, User, Settings } from "lucide-react";

// Basic navigation menu
const menuItems = [
  { label: "Home", icon: <Home size={20} />, href: "/" },
  { label: "Search", icon: <Search size={20} />, href: "/search" },
  { label: "Profile", icon: <User size={20} />, onClick: () => console.log("Profile") },
  { label: "Settings", icon: <Settings size={20} />, href: "/settings" }
];

<HamburgerMenuOverlay items={menuItems} />

// Advanced with gradient and blur
<HamburgerMenuOverlay 
  items={menuItems}
  overlayBackground="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  fontSize="xl"
  enableBlur={true}
  menuAlignment="center"
  animationDuration={2}
/>

// Custom positioning and styling
<HamburgerMenuOverlay 
  items={menuItems}
  buttonTop="30px"
  buttonLeft="30px"
  buttonColor="#22c55e"
  overlayBackground="#22c55e"
  onOpen={() => console.log("Menu opened")}
  onClose={() => console.log("Menu closed")}
/>`,
    props: [
      {
        name: "items",
        type: "MenuItem[]",
        required: true,
        description:
          "Array of menu items with label, optional href/onClick, and icon.",
      },
      {
        name: "buttonTop",
        type: "string",
        required: false,
        description: "Button position from top (CSS value, default: '60px').",
      },
      {
        name: "buttonLeft",
        type: "string",
        required: false,
        description: "Button position from left (CSS value, default: '60px').",
      },
      {
        name: "buttonSize",
        type: "'sm' | 'md' | 'lg'",
        required: false,
        description: "Size of the hamburger button (default: 'md').",
      },
      {
        name: "buttonColor",
        type: "string",
        required: false,
        description:
          "Background color of the hamburger button (default: '#6c8cff').",
      },
      {
        name: "overlayBackground",
        type: "string",
        required: false,
        description:
          "Background color or gradient for the overlay (default: '#6c8cff').",
      },
      {
        name: "textColor",
        type: "string",
        required: false,
        description: "Color of menu text and icons (default: '#ffffff').",
      },
      {
        name: "fontSize",
        type: "'sm' | 'md' | 'lg' | 'xl' | '2xl'",
        required: false,
        description: "Font size for menu items (default: 'lg').",
      },
      {
        name: "fontFamily",
        type: "string",
        required: false,
        description:
          "Font family for menu text (default: '\"Krona One\", monospace').",
      },
      {
        name: "fontWeight",
        type: "'normal' | 'medium' | 'semibold' | 'bold'",
        required: false,
        description: "Font weight for menu text (default: 'bold').",
      },
      {
        name: "animationDuration",
        type: "number",
        required: false,
        description: "Duration of overlay animation in seconds (default: 1.5).",
      },
      {
        name: "staggerDelay",
        type: "number",
        required: false,
        description:
          "Delay between each menu item animation in seconds (default: 0.1).",
      },
      {
        name: "menuAlignment",
        type: "'left' | 'center' | 'right'",
        required: false,
        description: "Text alignment for menu items (default: 'left').",
      },
      {
        name: "menuDirection",
        type: "'vertical' | 'horizontal'",
        required: false,
        description: "Layout direction for menu items (default: 'vertical').",
      },
      {
        name: "enableBlur",
        type: "boolean",
        required: false,
        description: "Enable backdrop blur effect on overlay (default: false).",
      },
      {
        name: "keepOpenOnItemClick",
        type: "boolean",
        required: false,
        description: "Keep menu open when item is clicked (default: false).",
      },
      {
        name: "customButton",
        type: "React.ReactNode",
        required: false,
        description: "Custom content for the hamburger button.",
      },
      {
        name: "ariaLabel",
        type: "string",
        required: false,
        description:
          "ARIA label for accessibility (default: 'Navigation menu').",
      },
      {
        name: "onOpen",
        type: "() => void",
        required: false,
        description: "Callback when menu opens.",
      },
      {
        name: "onClose",
        type: "() => void",
        required: false,
        description: "Callback when menu closes.",
      },
      {
        name: "zIndex",
        type: "number",
        required: false,
        description: "Z-index for overlay stacking (default: 1000).",
      },
      {
        name: "className",
        type: "string",
        required: false,
        description: "Additional CSS class for container.",
      },
      {
        name: "buttonClassName",
        type: "string",
        required: false,
        description: "Additional CSS class for button.",
      },
      {
        name: "menuItemClassName",
        type: "string",
        required: false,
        description: "Additional CSS class for menu items.",
      },
    ],
    examples: [
      {
        title: "Basic Navigation Menu",
        description:
          "Simple hamburger menu with navigation links for main site sections.",
        code: `import { HamburgerMenuOverlay } from "@/components/lightswind/HamburgerMenuOverlay";

const menuItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" }
];

<HamburgerMenuOverlay items={menuItems} />`,
      },
      {
        title: "Menu with Icons and Actions",
        description:
          "Enhanced menu with icons and custom click handlers for dynamic actions.",
        code: `import { HamburgerMenuOverlay } from "@/components/lightswind/HamburgerMenuOverlay";
import { Home, Search, User, Settings, LogOut } from "lucide-react";

const menuItems = [
  { 
    label: "Dashboard", 
    icon: <Home size={20} />, 
    onClick: () => navigate("/dashboard") 
  },
  { 
    label: "Search", 
    icon: <Search size={20} />, 
    onClick: () => setSearchOpen(true) 
  },
  { 
    label: "Profile", 
    icon: <User size={20} />, 
    href: "/profile" 
  },
  { 
    label: "Settings", 
    icon: <Settings size={20} />, 
    href: "/settings" 
  },
  { 
    label: "Logout", 
    icon: <LogOut size={20} />, 
    onClick: () => handleLogout() 
  }
];

<HamburgerMenuOverlay 
  items={menuItems}
  buttonColor="#22c55e"
  overlayBackground="#22c55e"
  fontSize="xl"
/>`,
      },
      {
        title: "Gradient Overlay with Blur",
        description:
          "Modern design with beautiful gradient background and blur effect.",
        code: `import { HamburgerMenuOverlay } from "@/components/lightswind/HamburgerMenuOverlay";

<HamburgerMenuOverlay 
  items={menuItems}
  overlayBackground="linear-gradient(135deg, #a78bfa 0%, #ec4899 50%, #f59e0b 100%)"
  enableBlur={true}
  animationDuration={2}
  staggerDelay={0.15}
  menuAlignment="center"
/>`,
      },
      {
        title: "Large Center-Aligned Menu",
        description:
          "Prominent center-aligned menu with large text for impact.",
        code: `import { HamburgerMenuOverlay } from "@/components/lightswind/HamburgerMenuOverlay";

<HamburgerMenuOverlay 
  items={menuItems}
  menuAlignment="center"
  fontSize="2xl"
  fontWeight="bold"
  animationDuration={2.5}
  overlayBackground="rgba(0,0,0,0.95)"
/>`,
      },
      {
        title: "Horizontal Layout",
        description:
          "Horizontal menu layout perfect for wide screens and modern designs.",
        code: `import { HamburgerMenuOverlay } from "@/components/lightswind/HamburgerMenuOverlay";

<HamburgerMenuOverlay 
  items={menuItems}
  menuDirection="horizontal"
  menuAlignment="center"
  overlayBackground="rgba(0,0,0,0.9)"
  enableBlur={true}
  fontSize="lg"
/>`,
      },
      {
        title: "Custom Positioning and Colors",
        description: "Custom button position with branded colors and styling.",
        code: `import { HamburgerMenuOverlay } from "@/components/lightswind/HamburgerMenuOverlay";

<HamburgerMenuOverlay 
  items={menuItems}
  buttonTop="30px"
  buttonLeft="30px"
  buttonSize="lg"
  buttonColor="#dc2626"
  overlayBackground="linear-gradient(135deg, #dc2626 0%, #991b1b 100%)"
  textColor="#ffffff"
/>`,
      },
      {
        title: "With Event Handlers",
        description:
          "Menu with callbacks for tracking user interactions and state management.",
        code: `import { HamburgerMenuOverlay } from "@/components/lightswind/HamburgerMenuOverlay";

<HamburgerMenuOverlay 
  items={menuItems}
  onOpen={() => {
    setMenuOpen(true);
    analytics.track('menu_opened');
  }}
  onClose={() => {
    setMenuOpen(false);
    analytics.track('menu_closed');
  }}
  keepOpenOnItemClick={true}
  ariaLabel="Main navigation menu"
/>`,
      },
      {
        title: "Mobile-First Responsive Design",
        description:
          "Optimized for mobile devices with touch-friendly interactions.",
        code: `import { HamburgerMenuOverlay } from "@/components/lightswind/HamburgerMenuOverlay";

<HamburgerMenuOverlay 
  items={menuItems}
  buttonSize="lg"
  fontSize="xl"
  staggerDelay={0.08}
  animationDuration={1.2}
  overlayBackground="#1f2937"
  className="md:hidden"
/>`,
      },
    ],
    accessibility: `[
      "Full keyboard navigation with Tab key support",
      "Automatic ARIA labels and expanded states",
      "Screen reader announcements for menu state changes",
      "Focus management and visible focus indicators",
      "Escape key closes menu for quick exit",
      "Proper semantic navigation structure"
    ],
    best_practices: [
      "Use for primary site navigation on mobile and tablet devices",
      "Limit menu items to 6-8 for optimal user experience",
      "Ensure sufficient color contrast between text and background",
      "Test touch interactions on various mobile devices",
      "Consider reduced motion preferences for animations",
      "Provide clear visual feedback for menu state changes",
      "Use consistent iconography that matches your brand",
      "Test with screen readers and keyboard-only navigation"
    ],
    references: [
      { name: "CSS Clip-path", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/clip-path" },
      { name: "CSS Backdrop Filter", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter" },
      { name: "ARIA Navigation", url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/navigation_role" },
      { name: "Mobile Navigation Patterns", url: "https://www.nngroup.com/articles/mobile-navigation-patterns/" }
    ]`,
  },

  [formatName("Animated Bubble Particles")]: {
    description:
      "A dynamic particle system component that creates floating bubble animations with physics-based movement. Features include mouse interaction, gooey blur effects, performance optimization, and extensive customization options for creating engaging background animations.",
    import: `import { AnimatedBubbleParticles } from "@/components/lightswind/AnimatedBubbleParticles"`,
    usage: `import { AnimatedBubbleParticles } from "@/components/lightswind/AnimatedBubbleParticles";

// Basic usage
<AnimatedBubbleParticles />

// With custom colors and effects
<AnimatedBubbleParticles 
  backgroundColor="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  particleColor="#ffffff"
  enableGooEffect={true}
  mouseInteraction={true}
/>

// Performance optimized for mobile
<AnimatedBubbleParticles 
  performanceMode={true}
  particlesPerSpawn={1}
  spawnInterval={300}
  enableGooEffect={false}
/>

// Custom particle behavior
<AnimatedBubbleParticles 
  direction="random"
  spawnFromEdges={true}
  gravity={0}
  wind={0.01}
  particleSize={{ min: 20, max: 60 }}
  speed={{ min: 0.3, max: 1.5 }}
/>`,
    props: [
      {
        name: "className",
        type: "string",
        required: false,
        description: "Additional CSS class for container styling.",
      },
      {
        name: "backgroundColor",
        type: "string",
        required: false,
        description:
          "Background color or gradient (default: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)').",
      },
      {
        name: "particleColor",
        type: "string",
        required: false,
        description: "Primary particle color (default: '#3e82f7').",
      },
      {
        name: "secondaryColor",
        type: "string",
        required: false,
        description:
          "Secondary particle color for gradients (default: '#8b5cf6').",
      },
      {
        name: "useGradient",
        type: "boolean",
        required: false,
        description:
          "Enable gradient colors between primary and secondary (default: false).",
      },
      {
        name: "particleSize",
        type: "{ min: number; max: number }",
        required: false,
        description:
          "Particle size range in pixels (default: { min: 10, max: 40 }).",
      },
      {
        name: "particlesPerSpawn",
        type: "number",
        required: false,
        description: "Number of particles to spawn per interval (default: 1).",
      },
      {
        name: "spawnInterval",
        type: "number",
        required: false,
        description:
          "Time between particle spawns in milliseconds (default: 200).",
      },
      {
        name: "speed",
        type: "{ min: number; max: number }",
        required: false,
        description:
          "Particle movement speed range (default: { min: 0.5, max: 2 }).",
      },
      {
        name: "gravity",
        type: "number",
        required: false,
        description: "Gravity effect strength (default: 0.02).",
      },
      {
        name: "wind",
        type: "number",
        required: false,
        description: "Horizontal wind force (default: 0).",
      },
      {
        name: "enableGooEffect",
        type: "boolean",
        required: false,
        description: "Enable SVG gooey blur effect (default: true).",
      },
      {
        name: "blurStrength",
        type: "number",
        required: false,
        description: "Blur intensity for goo effect (default: 12).",
      },
      {
        name: "height",
        type: "string",
        required: false,
        description: "Container height CSS value (default: '100vh').",
      },
      {
        name: "width",
        type: "string",
        required: false,
        description: "Container width CSS value (default: '100%').",
      },
      {
        name: "opacity",
        type: "{ min: number; max: number }",
        required: false,
        description: "Particle opacity range (default: { min: 0.6, max: 1 }).",
      },
      {
        name: "particleLife",
        type: "{ min: number; max: number }",
        required: false,
        description:
          "Particle lifespan in frames (default: { min: 180, max: 300 }).",
      },
      {
        name: "mouseInteraction",
        type: "boolean",
        required: false,
        description: "Enable mouse repulsion effect (default: false).",
      },
      {
        name: "mouseRepulsion",
        type: "number",
        required: false,
        description: "Mouse repulsion force radius (default: 50).",
      },
      {
        name: "direction",
        type: "'up' | 'down' | 'left' | 'right' | 'random'",
        required: false,
        description: "Particle movement direction (default: 'up').",
      },
      {
        name: "pauseOnBlur",
        type: "boolean",
        required: false,
        description: "Pause animation when window loses focus (default: true).",
      },
      {
        name: "responsive",
        type: "boolean",
        required: false,
        description: "Enable responsive dimension updates (default: true).",
      },
      {
        name: "spawnFromEdges",
        type: "boolean",
        required: false,
        description: "Spawn particles from all screen edges (default: false).",
      },
      {
        name: "enableCollisions",
        type: "boolean",
        required: false,
        description: "Enable particle collision detection (default: false).",
      },
      {
        name: "customShape",
        type: "string",
        required: false,
        description: "Custom SVG path for particle shape.",
      },
      {
        name: "performanceMode",
        type: "boolean",
        required: false,
        description: "Limit particles for better performance (default: false).",
      },
      {
        name: "zIndex",
        type: "number",
        required: false,
        description: "Z-index for layering control (default: 1).",
      },
    ],
    examples: [
      {
        title: "Basic Floating Bubbles",
        description: "Simple upward-floating particles with default settings.",
        code: `import { AnimatedBubbleParticles } from "@/components/lightswind/AnimatedBubbleParticles";

<AnimatedBubbleParticles 
  height="400px"
  backgroundColor="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  particleColor="#ffffff"
/>`,
      },
      {
        title: "Interactive Mouse Repulsion",
        description:
          "Particles that respond to mouse movement with repulsion force.",
        code: `import { AnimatedBubbleParticles } from "@/components/lightswind/AnimatedBubbleParticles";

<AnimatedBubbleParticles 
  mouseInteraction={true}
  mouseRepulsion={80}
  enableGooEffect={true}
  blurStrength={15}
  backgroundColor="linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)"
  particleColor="#00d4ff"
/>`,
      },
      {
        title: "Colorful Gradient Particles",
        description:
          "Multi-colored particles with gradient effects and increased spawn rate.",
        code: `import { AnimatedBubbleParticles } from "@/components/lightswind/AnimatedBubbleParticles";

<AnimatedBubbleParticles 
  backgroundColor="linear-gradient(135deg, #ff9a8b 0%, #f093fb 50%, #f5576c 100%)"
  particleColor="#ff6b6b"
  secondaryColor="#4ecdc4"
  useGradient={true}
  particlesPerSpawn={2}
  spawnInterval={150}
/>`,
      },
      {
        title: "Multi-directional Flow",
        description:
          "Particles spawning from edges with random directions and physics.",
        code: `import { AnimatedBubbleParticles } from "@/components/lightswind/AnimatedBubbleParticles";

<AnimatedBubbleParticles 
  direction="random"
  spawnFromEdges={true}
  particlesPerSpawn={3}
  speed={{ min: 0.3, max: 1.5 }}
  gravity={0}
  wind={0.01}
  backgroundColor="linear-gradient(135deg, #134e5e 0%, #71b280 100%)"
  particleColor="#a8e6cf"
/>`,
      },
      {
        title: "Performance Optimized",
        description:
          "Mobile-friendly configuration with reduced effects and particle count.",
        code: `import { AnimatedBubbleParticles } from "@/components/lightswind/AnimatedBubbleParticles";

<AnimatedBubbleParticles 
  performanceMode={true}
  enableGooEffect={false}
  particlesPerSpawn={1}
  spawnInterval={300}
  backgroundColor="linear-gradient(135deg, #2c3e50 0%, #34495e 100%)"
  particleColor="#e74c3c"
/>`,
      },
      {
        title: "Large Dramatic Particles",
        description:
          "Big, slow-moving particles for dramatic background effects.",
        code: `import { AnimatedBubbleParticles } from "@/components/lightswind/AnimatedBubbleParticles";

<AnimatedBubbleParticles 
  particleSize={{ min: 40, max: 80 }}
  speed={{ min: 0.2, max: 0.8 }}
  spawnInterval={400}
  enableGooEffect={true}
  blurStrength={20}
  backgroundColor="rgba(0,0,0,0.9)"
  particleColor="#ffffff"
  opacity={{ min: 0.3, max: 0.7 }}
/>`,
      },
      {
        title: "Underwater Effect",
        description:
          "Slow bubbles rising with blue tones mimicking underwater movement.",
        code: `import { AnimatedBubbleParticles } from "@/components/lightswind/AnimatedBubbleParticles";

<AnimatedBubbleParticles 
  backgroundColor="linear-gradient(180deg, #0c4a6e 0%, #1e40af 100%)"
  particleColor="#38bdf8"
  secondaryColor="#06b6d4"
  useGradient={true}
  speed={{ min: 0.3, max: 1.0 }}
  gravity={-0.01}
  particleSize={{ min: 8, max: 25 }}
  enableGooEffect={false}
/>`,
      },
      {
        title: "Cosmic Space Theme",
        description:
          "Dark space theme with glowing particles and subtle movements.",
        code: `import { AnimatedBubbleParticles } from "@/components/lightswind/AnimatedBubbleParticles";

<AnimatedBubbleParticles 
  backgroundColor="radial-gradient(ellipse at center, #1a1a2e 0%, #16213e 50%, #0f0f0f 100%)"
  particleColor="#fbbf24"
  secondaryColor="#a855f7"
  useGradient={true}
  direction="random"
  spawnFromEdges={true}
  speed={{ min: 0.1, max: 0.5 }}
  particlesPerSpawn={1}
  spawnInterval={500}
/>`,
      },
    ],
    accessibility: ` [
      "Respects user's reduced motion preferences",
      "Pauses animation when window loses focus to save resources",
      "Non-intrusive background animation that doesn't interfere with content",
      "Provides performance mode for users with limited resources",
      "Compatible with screen readers (decorative content)",
      "No audio or flashing effects that could trigger sensitivities"
    ],
    best_practices: [
      "Use as background decoration, not primary content",
      "Enable performanceMode on mobile devices for better battery life",
      "Consider user preferences for reduced motion",
      "Adjust particle count based on device capabilities",
      "Use subtle colors that don't distract from main content",
      "Test on various devices to ensure smooth performance",
      "Provide fallback backgrounds for users who disable animations",
      "Keep particle effects proportional to screen size"
    ],
    references: [
      { name: "RequestAnimationFrame API", url: "https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame" },
      { name: "SVG Filters", url: "https://developer.mozilla.org/en-US/docs/Web/SVG/Element/filter" },
      { name: "CSS Transform Performance", url: "https://www.html5rocks.com/en/tutorials/speed/high-performance-animations/" },
      { name: "Particle Systems", url: "https://en.wikipedia.org/wiki/Particle_system" }
    ]`,
  },

  [formatName("Glowing Cards")]: {
    description:
      "Interactive card components with beautiful glowing effects that follow mouse cursor movement. Perfect for feature showcases, pricing sections, and content highlights.",
    import: `import { GlowingCards, GlowingCard } from "@/components/lightswind/glowing-cards"`,
    usage: `import { GlowingCards, GlowingCard } from "@/components/lightswind/glowing-cards";
import { Zap, Sparkles, Crown } from "lucide-react";

// Basic usage
<GlowingCards>
  <GlowingCard glowColor="#10b981">
    <h3>Performance</h3>
    <p>Lightning-fast components...</p>
  </GlowingCard>
  <GlowingCard glowColor="#8b5cf6">
    <h3>Design</h3>
    <p>Beautiful, accessible components...</p>
  </GlowingCard>
</GlowingCards>

// Advanced configuration
<GlowingCards
  enableGlow={true}
  glowRadius={30}
  glowOpacity={0.8}
  animationDuration={500}
  gap="3rem"
  responsive={true}
>
  <GlowingCard glowColor="#f59e0b" className="space-y-4">
    <div className="flex items-center space-x-2">
      <Crown className="w-6 h-6 text-amber-500" />
      <h3>Premium Features</h3>
    </div>
    <p>Enterprise-grade components...</p>
  </GlowingCard>
</GlowingCards>`,
    props: [
      {
        name: "enableGlow",
        type: "boolean",
        required: false,
        description: "Enable the glowing overlay effect (default: true).",
      },
      {
        name: "glowRadius",
        type: "number",
        required: false,
        description:
          "Size of the glow effect radius in rem units (default: 25).",
      },
      {
        name: "glowOpacity",
        type: "number",
        required: false,
        description: "Opacity of the glow effect from 0 to 1 (default: 1).",
      },
      {
        name: "animationDuration",
        type: "number",
        required: false,
        description:
          "Duration of glow transitions in milliseconds (default: 400).",
      },
      {
        name: "enableHover",
        type: "boolean",
        required: false,
        description:
          "Enable hover effects on individual cards (default: true).",
      },
      {
        name: "gap",
        type: "string",
        required: false,
        description: "Gap between cards (CSS value, default: '2.5rem').",
      },
      {
        name: "maxWidth",
        type: "string",
        required: false,
        description: "Maximum width of cards container (default: '75rem').",
      },
      {
        name: "padding",
        type: "string",
        required: false,
        description: "Padding around the container (default: '3rem 1.5rem').",
      },
      {
        name: "backgroundColor",
        type: "string",
        required: false,
        description: "Background color for the container.",
      },
      {
        name: "borderRadius",
        type: "string",
        required: false,
        description: "Border radius for cards (default: '1rem').",
      },
      {
        name: "responsive",
        type: "boolean",
        required: false,
        description: "Enable responsive layout behavior (default: true).",
      },
      {
        name: "customTheme",
        type: "object",
        required: false,
        description:
          "Custom theme object with cardBg, cardBorder, textColor, hoverBg properties.",
      },
      {
        name: "children",
        type: "React.ReactNode",
        required: true,
        description: "GlowingCard components to display.",
      },
      {
        name: "className",
        type: "string",
        required: false,
        description: "Additional CSS classes for the container.",
      },
    ],
    examples: [
      {
        title: "Basic Feature Cards",
        description:
          "Simple glowing cards for showcasing features or services.",
        code: `import { GlowingCards, GlowingCard } from "@/components/lightswind/glowing-cards";
import { Zap, Shield, Sparkles } from "lucide-react";

<GlowingCards>
  <GlowingCard glowColor="#10b981">
    <div className="flex items-center space-x-2 mb-4">
      <Zap className="w-6 h-6 text-emerald-500" />
      <h3 className="text-xl font-semibold">Fast</h3>
    </div>
    <p>Lightning-fast performance with optimized rendering.</p>
  </GlowingCard>
  
  <GlowingCard glowColor="#3b82f6">
    <div className="flex items-center space-x-2 mb-4">
      <Shield className="w-6 h-6 text-primarylw" />
      <h3 className="text-xl font-semibold">Secure</h3>
    </div>
    <p>Enterprise-grade security built into every component.</p>
  </GlowingCard>
  
  <GlowingCard glowColor="#8b5cf6">
    <div className="flex items-center space-x-2 mb-4">
      <Sparkles className="w-6 h-6 text-primarylw" />
      <h3 className="text-xl font-semibold">Beautiful</h3>
    </div>
    <p>Stunning designs with smooth animations.</p>
  </GlowingCard>
</GlowingCards>`,
      },
      {
        title: "Product Showcase",
        description:
          "Highlight different products or services with custom styling.",
        code: `import { GlowingCards, GlowingCard } from "@/components/lightswind/glowing-cards";

<GlowingCards
  glowRadius={35}
  gap="3rem"
  className="bg-gray-900"
>
  <GlowingCard glowColor="#f59e0b" className="text-center space-y-4">
    <div className="w-16 h-16 bg-amber-500 rounded-full mx-auto flex items-center justify-center">
      <span className="text-2xl font-bold text-white">A</span>
    </div>
    <h3 className="text-2xl font-bold">Premium Plan</h3>
    <p className="text-gray-600">Everything you need to get started.</p>
    <button className="w-full bg-amber-500 text-white py-2 rounded-lg">
      Get Started
    </button>
  </GlowingCard>
  
  <GlowingCard glowColor="#ef4444" className="text-center space-y-4">
    <div className="w-16 h-16 bg-red-500 rounded-full mx-auto flex items-center justify-center">
      <span className="text-2xl font-bold text-white">B</span>
    </div>
    <h3 className="text-2xl font-bold">Pro Plan</h3>
    <p className="text-gray-600">Advanced features for power users.</p>
    <button className="w-full bg-red-500 text-white py-2 rounded-lg">
      Upgrade Now
    </button>
  </GlowingCard>
</GlowingCards>`,
      },
      {
        title: "Team Members",
        description:
          "Display team members or testimonials with glowing effects.",
        code: `import { GlowingCards, GlowingCard } from "@/components/lightswind/glowing-cards";

<GlowingCards
  enableGlow={true}
  glowOpacity={0.7}
  animationDuration={600}
>
  <GlowingCard glowColor="#06b6d4" className="text-center space-y-4">
    <img 
      src="/avatar1.jpg" 
      alt="John Doe"
      className="w-20 h-20 rounded-full mx-auto"
    />
    <div>
      <h4 className="font-semibold text-lg">John Doe</h4>
      <p className="text-gray-500">Frontend Developer</p>
    </div>
    <p className="text-sm text-gray-600">
      "These components make development so much faster!"
    </p>
  </GlowingCard>
  
  <GlowingCard glowColor="#ec4899" className="text-center space-y-4">
    <img 
      src="/avatar2.jpg" 
      alt="Jane Smith"
      className="w-20 h-20 rounded-full mx-auto"
    />
    <div>
      <h4 className="font-semibold text-lg">Jane Smith</h4>
      <p className="text-gray-500">UI Designer</p>
    </div>
    <p className="text-sm text-gray-600">
      "Beautiful designs with incredible attention to detail."
    </p>
  </GlowingCard>
</GlowingCards>`,
      },
      {
        title: "Statistics Dashboard",
        description: "Create impressive stat cards with glowing effects.",
        code: `import { GlowingCards, GlowingCard } from "@/components/lightswind/glowing-cards";
import { TrendingUp, Users, DollarSign, Star } from "lucide-react";

<GlowingCards gap="2rem" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
  <GlowingCard glowColor="#10b981" className="text-center space-y-2">
    <TrendingUp className="w-8 h-8 text-emerald-500 mx-auto" />
    <div className="text-3xl font-bold text-emerald-600">+24%</div>
    <p className="text-sm text-gray-600">Growth</p>
  </GlowingCard>
  
  <GlowingCard glowColor="#3b82f6" className="text-center space-y-2">
    <Users className="w-8 h-8 text-primarylw mx-auto" />
    <div className="text-3xl font-bold text-primarylw">12.5K</div>
    <p className="text-sm text-gray-600">Users</p>
  </GlowingCard>
  
  <GlowingCard glowColor="#f59e0b" className="text-center space-y-2">
    <DollarSign className="w-8 h-8 text-amber-500 mx-auto" />
    <div className="text-3xl font-bold text-amber-600">$89K</div>
    <p className="text-sm text-gray-600">Revenue</p>
  </GlowingCard>
  
  <GlowingCard glowColor="#8b5cf6" className="text-center space-y-2">
    <Star className="w-8 h-8 text-primarylw mx-auto" />
    <div className="text-3xl font-bold text-primarylw">4.9</div>
    <p className="text-sm text-gray-600">Rating</p>
  </GlowingCard>
</GlowingCards>`,
      },
      {
        title: "Custom Theme",
        description: "Apply custom themes for different brand requirements.",
        code: `import { GlowingCards, GlowingCard } from "@/components/lightswind/glowing-cards";

<GlowingCards
  customTheme={{
    cardBg: "rgba(15, 23, 42, 0.8)",
    cardBorder: "#334155",
    textColor: "#f1f5f9",
    hoverBg: "rgba(30, 41, 59, 0.8)"
  }}
  backgroundColor="linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
  borderRadius="1.5rem"
>
  <GlowingCard glowColor="#00d4ff" className="space-y-4">
    <h3 className="text-xl font-bold text-cyan-400">Cyberpunk Theme</h3>
    <p className="text-slate-300">
      Futuristic design with neon glowing effects perfect for tech brands.
    </p>
  </GlowingCard>
  
  <GlowingCard glowColor="#ff0080" className="space-y-4">
    <h3 className="text-xl font-bold text-pink-400">Neon Vibes</h3>
    <p className="text-slate-300">
      Eye-catching colors that make your content stand out.
    </p>
  </GlowingCard>
</GlowingCards>`,
      },
    ],
    accessibility: ` [
      "Full keyboard navigation support with Tab and Enter keys",
      "ARIA labels and roles for screen reader compatibility",
      "High contrast mode support for better visibility",
      "Reduced motion respect for accessibility preferences",
      "Focus indicators visible for keyboard users",
      "Semantic HTML structure for better screen reader navigation"
    ],
    best_practices: [
      "Use meaningful glowColor values that match your brand",
      "Limit the number of cards to maintain visual clarity (3-6 recommended)",
      "Ensure sufficient color contrast between text and backgrounds",
      "Test with keyboard navigation and screen readers",
      "Consider performance impact with many animated cards",
      "Use descriptive content that adds value beyond visual appeal",
      "Implement proper loading states for dynamic content",
      "Optimize for mobile devices with appropriate touch targets"
    ],
    references: [
      { name: "CSS Mask Property", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/mask" },
      { name: "CSS Radial Gradients", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/gradient/radial-gradient" },
      { name: "React Mouse Events", url: "https://react.dev/reference/react-dom/components/common#mouseevent-handler" },
      { name: "CSS Transform Performance", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/transform" }
    ]
      `,
  },

  [formatName("Morphing Navigation")]: {
    description:
      "A sophisticated navigation component that morphs from a full horizontal menu to a compact hamburger button on scroll. Features smooth animations, backdrop blur effects, and customizable themes perfect for modern web applications.",
    import: `import { MorphingNavigation } from "@/components/lightswind/morphing-navigation"`,
    usage: `import { MorphingNavigation } from "@/components/lightswind/morphing-navigation";
import { Home, ShoppingBag, Info, HelpCircle } from "lucide-react";

// Basic usage
<MorphingNavigation
  links={[
    { id: 'home', label: 'Home', href: '#home' },
    { id: 'shop', label: 'Shop', href: '#shop' },
    { id: 'about', label: 'About', href: '#about' },
    { id: 'help', label: 'Help', href: '#help' }
  ]}
  onLinkClick={(link) => console.log('Clicked:', link)}
/>

// Advanced configuration with icons and custom styling
<MorphingNavigation
  links={[
    { id: 'home', label: 'Home', href: '#home', icon: <Home size={14} /> },
    { id: 'shop', label: 'Shop', href: '#shop', icon: <ShoppingBag size={14} /> },
    { id: 'about', label: 'About', href: '#about', icon: <Info size={14} /> },
    { id: 'help', label: 'Help', href: '#help', icon: <HelpCircle size={14} /> }
  ]}
  theme="custom"
  backgroundColor="rgba(59, 130, 246, 0.1)"
  textColor="#3b82f6"
  borderColor="rgba(59, 130, 246, 0.3)"
  scrollThreshold={150}
  animationDuration={1.5}
  enablePageBlur={true}
  onLinkClick={(link) => handleNavigation(link)}
  onMenuToggle={(isOpen) => console.log('Menu:', isOpen)}
/>`,
    props: [
      {
        name: "links",
        type: "MorphingNavigationLink[]",
        required: true,
        description:
          "Array of navigation links with id, label, href, and optional icon.",
      },
      {
        name: "scrollThreshold",
        type: "number",
        required: false,
        description:
          "Scroll distance in pixels to trigger morphing (default: 100).",
      },
      {
        name: "enablePageBlur",
        type: "boolean",
        required: false,
        description:
          "Enable blur effect on page content when menu is open (default: true).",
      },
      {
        name: "theme",
        type: "'dark' | 'light' | 'glass' | 'custom'",
        required: false,
        description: "Pre-defined theme for styling (default: 'glass').",
      },
      {
        name: "backgroundColor",
        type: "string",
        required: false,
        description: "Custom background color (used with 'custom' theme).",
      },
      {
        name: "textColor",
        type: "string",
        required: false,
        description: "Custom text color (used with 'custom' theme).",
      },
      {
        name: "borderColor",
        type: "string",
        required: false,
        description: "Custom border color (used with 'custom' theme).",
      },
      {
        name: "initialTop",
        type: "number",
        required: false,
        description:
          "Top position in pixels when navigation is expanded (default: 70).",
      },
      {
        name: "compactTop",
        type: "number",
        required: false,
        description:
          "Top position in pixels when navigation is compact (default: 20).",
      },
      {
        name: "animationDuration",
        type: "number",
        required: false,
        description:
          "Animation duration in seconds for morphing transitions (default: 1).",
      },
      {
        name: "onLinkClick",
        type: "(link: MorphingNavigationLink) => void",
        required: false,
        description: "Callback function when a navigation link is clicked.",
      },
      {
        name: "onMenuToggle",
        type: "(isOpen: boolean) => void",
        required: false,
        description: "Callback function when hamburger menu is toggled.",
      },
      {
        name: "enableSmoothTransitions",
        type: "boolean",
        required: false,
        description:
          "Enable smooth scrolling to target sections (default: true).",
      },
      {
        name: "customHamburgerIcon",
        type: "React.ReactNode",
        required: false,
        description: "Custom icon to replace the default hamburger icon.",
      },
      {
        name: "disableAutoMorph",
        type: "boolean",
        required: false,
        description: "Disable automatic morphing on scroll (default: false).",
      },
      {
        name: "className",
        type: "string",
        required: false,
        description: "Additional CSS classes for the navigation container.",
      },
    ],
    examples: [
      {
        title: "Basic Navigation",
        description: "Simple morphing navigation with glass theme",
        code: `import { MorphingNavigation } from "@/components/lightswind/morphing-navigation";

const navigation = [
  { id: 'home', label: 'Home', href: '#home' },
  { id: 'about', label: 'About', href: '#about' },
  { id: 'services', label: 'Services', href: '#services' },
  { id: 'contact', label: 'Contact', href: '#contact' }
];

<MorphingNavigation
  links={navigation}
  onLinkClick={(link) => console.log('Navigating to:', link.href)}
/>`,
      },
      {
        title: "Navigation with Icons",
        description: "Enhanced navigation with Lucide React icons",
        code: `import { MorphingNavigation } from "@/components/lightswind/morphing-navigation";
import { Home, User, Briefcase, Mail } from "lucide-react";

const navigationWithIcons = [
  { id: 'home', label: 'Home', href: '#home', icon: <Home size={14} /> },
  { id: 'about', label: 'About', href: '#about', icon: <User size={14} /> },
  { id: 'work', label: 'Work', href: '#work', icon: <Briefcase size={14} /> },
  { id: 'contact', label: 'Contact', href: '#contact', icon: <Mail size={14} /> }
];

<MorphingNavigation
  links={navigationWithIcons}
  theme="dark"
  scrollThreshold={120}
  onLinkClick={(link) => handleNavigation(link)}
/>`,
      },
      {
        title: "Custom Styled Navigation",
        description: "Fully customized navigation with brand colors",
        code: `import { MorphingNavigation } from "@/components/lightswind/morphing-navigation";

<MorphingNavigation
  links={[
    { id: 'products', label: 'Products', href: '#products' },
    { id: 'pricing', label: 'Pricing', href: '#pricing' },
    { id: 'docs', label: 'Docs', href: '#docs' },
    { id: 'support', label: 'Support', href: '#support' }
  ]}
  theme="custom"
  backgroundColor="rgba(16, 185, 129, 0.1)"
  textColor="#10b981"
  borderColor="rgba(16, 185, 129, 0.3)"
  initialTop={60}
  compactTop={15}
  animationDuration={1.2}
  enablePageBlur={false}
  onLinkClick={(link) => router.push(link.href)}
/>`,
      },
      {
        title: "Manual Control Navigation",
        description:
          "Navigation with disabled auto-morphing for manual control",
        code: `import { MorphingNavigation } from "@/components/lightswind/morphing-navigation";
import { useState } from "react";

const [isCompact, setIsCompact] = useState(false);

<MorphingNavigation
  links={navigationLinks}
  disableAutoMorph={true}
  theme="light"
  onMenuToggle={(isOpen) => {
    console.log('Menu toggled:', isOpen);
    // Custom logic here
  }}
  onLinkClick={(link) => {
    // Handle navigation
    setIsCompact(true);
  }}
/>`,
      },
      {
        title: "E-commerce Navigation",
        description: "Perfect for e-commerce sites with shopping-focused links",
        code: `import { MorphingNavigation } from "@/components/lightswind/morphing-navigation";
import { ShoppingBag, Heart, User, Search } from "lucide-react";

const ecommerceNav = [
  { id: 'shop', label: 'Shop', href: '#shop', icon: <ShoppingBag size={14} /> },
  { id: 'wishlist', label: 'Wishlist', href: '#wishlist', icon: <Heart size={14} /> },
  { id: 'account', label: 'Account', href: '#account', icon: <User size={14} /> },
  { id: 'search', label: 'Search', href: '#search', icon: <Search size={14} /> }
];

<MorphingNavigation
  links={ecommerceNav}
  theme="glass"
  scrollThreshold={80}
  enablePageBlur={true}
  onLinkClick={(link) => handleEcommerceNavigation(link)}
/>`,
      },
    ],
    accessibility: ` [
      "Full keyboard navigation with Tab, Enter, and Escape keys",
      "ARIA labels for hamburger button and navigation landmarks",
      "Screen reader compatible with proper semantic HTML structure",
      "Focus management when menu opens and closes",
      "High contrast mode support for better visibility",
      "Reduced motion respect for users with motion sensitivities",
      "Proper color contrast ratios in all theme variants"
    ],
    troubleshooting: [
      {
        problem: "Navigation not morphing on scroll",
        solution: "Check that scrollThreshold is set correctly and disableAutoMorph is false. Ensure the parent container allows scrolling."
      },
      {
        problem: "Blur effect not working",
        solution: "Verify that backdrop-filter is supported in your target browsers. Consider adding a fallback background color."
      },
      {
        problem: "Custom colors not applying",
        solution: "Make sure theme is set to 'custom' when using backgroundColor, textColor, or borderColor props."
      },
      {
        problem: "Smooth scrolling not working",
        solution: "Ensure target elements have the correct IDs matching the href values, and enableSmoothTransitions is true."
      },
      {
        problem: "Navigation overlapping content",
        solution: "Adjust initialTop and compactTop values, or add appropriate padding-top to your page content."
      }
    ],
    best_practices: [
      "Keep navigation links concise (4-6 items work best)",
      "Use consistent icon sizes (14-16px recommended)",
      "Test scroll threshold on different screen sizes",
      "Ensure sufficient color contrast for accessibility",
      "Consider performance impact of backdrop-filter on older devices",
      "Provide meaningful href values for proper navigation",
      "Test touch interactions on mobile devices",
      "Use semantic HTML structure for better SEO"
    ],
    references: [
      { name: "CSS Backdrop Filter", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter" },
      { name: "CSS Transitions", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/transition" },
      { name: "Intersection Observer API", url: "https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API" },
      { name: "React useCallback Hook", url: "https://react.dev/reference/react/useCallback" }
    ]`,
  },

  [formatName("Typewriter Input")]: {
    description:
      "An animated input component that creates a typewriter effect as you type. Features smooth character animations, customizable styling, and professional form integration.",
    import: `import { TypewriterInput } from "@/components/lightswind/typewriter-input"`,
    usage: `import { TypewriterInput } from "@/components/lightswind/typewriter-input";
import { useState } from "react";

// Basic usage
const [value, setValue] = useState("");

<TypewriterInput
  value={value}
  onChange={setValue}
  placeholder="Type something..."
/>

// Advanced configuration
<TypewriterInput
  value={value}
  onChange={setValue}
  placeholder="Custom styled input..."
  backgroundGradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  textColor="#4c1d95"
  caretColor="#8b5cf6"
  fontWeight="bold"
  fontSize="lg"
  animationDuration={300}
  width="300px"
  onEnter={() => console.log("Enter pressed")}
/>`,
    props: [
      {
        name: "value",
        type: "string",
        required: false,
        description: "The value of the input (controlled component).",
      },
      {
        name: "onChange",
        type: "(value: string) => void",
        required: false,
        description: "Callback when input value changes.",
      },
      {
        name: "placeholder",
        type: "string",
        required: false,
        description:
          "Placeholder text displayed when input is empty (default: 'Type something...').",
      },
      {
        name: "enableAnimation",
        type: "boolean",
        required: false,
        description: "Enable typewriter animation effect (default: true).",
      },
      {
        name: "animationDuration",
        type: "number",
        required: false,
        description:
          "Duration of character animation in milliseconds (default: 200).",
      },
      {
        name: "scaleFactor",
        type: "number",
        required: false,
        description:
          "Scale factor for character animation effect (default: 50).",
      },
      {
        name: "animationDelay",
        type: "number",
        required: false,
        description:
          "Delay before animation starts in milliseconds (default: 300).",
      },
      {
        name: "backgroundGradient",
        type: "string",
        required: false,
        description:
          "CSS gradient for container background (default: green-blue gradient).",
      },
      {
        name: "inputBackground",
        type: "string",
        required: false,
        description:
          "Background color of the input field (default: '#ffffff').",
      },
      {
        name: "textColor",
        type: "string",
        required: false,
        description: "Color of the animated text overlay (default: '#000000').",
      },
      {
        name: "caretColor",
        type: "string",
        required: false,
        description: "Color of the input cursor (default: '#555555').",
      },
      {
        name: "fontWeight",
        type: "'normal' | 'medium' | 'semibold' | 'bold' | 'black'",
        required: false,
        description: "Font weight of the text (default: 'black').",
      },
      {
        name: "fontSize",
        type: "'xs' | 'sm' | 'base' | 'lg' | 'xl'",
        required: false,
        description: "Font size of the input text (default: 'sm').",
      },
      {
        name: "borderRadius",
        type: "'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'",
        required: false,
        description: "Border radius of the input (default: 'md').",
      },
      {
        name: "shadowIntensity",
        type: "'none' | 'sm' | 'md' | 'lg' | 'xl'",
        required: false,
        description: "Drop shadow intensity (default: 'md').",
      },
      {
        name: "width",
        type: "string",
        required: false,
        description: "Width of the input container (default: '200px').",
      },
      {
        name: "enableShakeAnimation",
        type: "boolean",
        required: false,
        description:
          "Enable shake animation on character input (default: true).",
      },
      {
        name: "disabled",
        type: "boolean",
        required: false,
        description: "Disable the input field (default: false).",
      },
      {
        name: "readOnly",
        type: "boolean",
        required: false,
        description: "Make input read-only (default: false).",
      },
      {
        name: "name",
        type: "string",
        required: false,
        description: "Name attribute for the input field.",
      },
      {
        name: "id",
        type: "string",
        required: false,
        description: "ID attribute for the input field.",
      },
      {
        name: "ariaLabel",
        type: "string",
        required: false,
        description: "ARIA label for accessibility.",
      },
      {
        name: "onFocus",
        type: "() => void",
        required: false,
        description: "Callback when input receives focus.",
      },
      {
        name: "onBlur",
        type: "() => void",
        required: false,
        description: "Callback when input loses focus.",
      },
      {
        name: "onEnter",
        type: "() => void",
        required: false,
        description: "Callback when Enter key is pressed.",
      },
      {
        name: "className",
        type: "string",
        required: false,
        description: "Additional CSS class for the container.",
      },
      {
        name: "inputClassName",
        type: "string",
        required: false,
        description: "Additional CSS class for the input element.",
      },
      {
        name: "textClassName",
        type: "string",
        required: false,
        description: "Additional CSS class for the animated text.",
      },
      {
        name: "style",
        type: "React.CSSProperties",
        required: false,
        description: "Custom styles for the container.",
      },
    ],
    examples: [
      {
        title: "Basic Typewriter Input",
        description: "Simple implementation with default typewriter animation",
        code: `import { TypewriterInput } from "@/components/lightswind/typewriter-input";
import { useState } from "react";

const [value, setValue] = useState("");

<TypewriterInput
  value={value}
  onChange={setValue}
  placeholder="Start typing to see the magic..."
  name="basic-input"
/>`,
      },
      {
        title: "Custom Styled Input",
        description: "Typewriter input with custom colors and styling",
        code: `import { TypewriterInput } from "@/components/lightswind/typewriter-input";

<TypewriterInput
  value={value}
  onChange={setValue}
  placeholder="Custom styled input..."
  backgroundGradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  inputBackground="#ffffff"
  textColor="#4c1d95"
  caretColor="#8b5cf6"
  fontWeight="bold"
  fontSize="lg"
  borderRadius="lg"
  shadowIntensity="xl"
  width="320px"
/>`,
      },
      {
        title: "Dark Theme Variant",
        description: "Dark themed typewriter input with reduced animations",
        code: `import { TypewriterInput } from "@/components/lightswind/typewriter-input";

<TypewriterInput
  value={value}
  onChange={setValue}
  placeholder="Dark theme input..."
  backgroundGradient="linear-gradient(to right, #1a1a1a 0%, #2d2d2d 100%)"
  inputBackground="#374151"
  textColor="#f3f4f6"
  caretColor="#10b981"
  fontWeight="semibold"
  enableShakeAnimation={false}
  animationDuration={150}
/>`,
      },
      {
        title: "Form Integration",
        description: "Using typewriter input in forms with validation",
        code: `import { TypewriterInput } from "@/components/lightswind/typewriter-input";
import { Button } from "@/components/lightswind/button";

const handleSubmit = () => {
  if (value.trim()) {
    console.log("Submitted:", value);
  }
};

<div className="space-y-4">
  <TypewriterInput
    value={value}
    onChange={setValue}
    placeholder="Enter your message..."
    onEnter={handleSubmit}
    backgroundGradient="linear-gradient(to right, #f093fb 0%, #f5576c 100%)"
    textColor="#be185d"
    caretColor="#ec4899"
  />
  <Button onClick={handleSubmit} disabled={!value.trim()}>
    Submit
  </Button>
</div>`,
      },
      {
        title: "Performance Optimized",
        description:
          "Typewriter input with optimized settings for better performance",
        code: `import { TypewriterInput } from "@/components/lightswind/typewriter-input";

<TypewriterInput
  value={value}
  onChange={setValue}
  placeholder="Optimized input..."
  animationDuration={100}
  scaleFactor={10}
  enableShakeAnimation={false}
  shadowIntensity="sm"
  fontSize="sm"
  width="240px"
/>`,
      },
    ],
    accessibility: ` [
      "Full keyboard navigation support with Tab and arrow keys",
      "ARIA labels and descriptions for screen reader compatibility", 
      "High contrast mode support with customizable colors",
      "Reduced motion respect for accessibility preferences",
      "Focus indicators visible for keyboard navigation",
      "Semantic form element structure for assistive technologies",
      "Enter key support for form submission",
      "Proper labeling association with input fields"
    ],
    best_practices: [
      "Use meaningful placeholder text that describes expected input",
      "Consider animation performance impact with many inputs on one page",
      "Test with keyboard navigation and screen readers",
      "Ensure sufficient color contrast between text and backgrounds",
      "Provide clear feedback for form validation states",
      "Use appropriate input widths for different content types",
      "Consider reducing animations on mobile devices for better performance",
      "Implement proper error handling and validation messages"
    ],
    troubleshooting: [
      {
        issue: "Animations appear choppy or slow",
        solution: "Reduce animationDuration, disable enableShakeAnimation, or lower scaleFactor for better performance."
      },
      {
        issue: "Text color not visible against background",
        solution: "Ensure textColor has sufficient contrast against inputBackground. Use color contrast checkers."
      },
      {
        issue: "Input not responding to keyboard events", 
        solution: "Check that the component is not disabled or readOnly. Ensure onEnter callback is properly defined."
      },
      {
        issue: "Animated text positioning incorrect",
        solution: "Verify that the container has proper positioning. Adjust width prop if text is getting cut off."
      },
      {
        issue: "Performance issues with multiple inputs",
        solution: "Disable animations on non-critical inputs or use performance optimized settings with reduced effects."
      },
      {
        issue: "Mobile responsiveness problems",
        solution: "Test on various screen sizes and adjust width prop or use responsive CSS units. Consider touch interactions."
      }
    ]
      `,
  },

  [formatName("Team Carousel")]: {
    description:
      "An interactive 3D carousel component for displaying team members with smooth animations, keyboard/touch navigation, and extensive customization options.",
    import: `import { TeamCarousel } from "@/components/lightswind/team-carousel"`,
    usage: `import { TeamCarousel } from '@/components/lightswind/team-carousel';

const teamMembers = [
  {
    id: "1",
    name: "Emily Kim",
    role: "Founder",
    image: "https://example.com/emily.jpg",
    bio: "Visionary leader with 10+ years of experience."
  },
  // ... more members
];

function TeamPage() {
  return (
    <TeamCarousel 
      members={teamMembers}
      title="OUR TEAM"
      autoPlay={3000}
      onMemberChange={(member, index) => {
        console.log('Active member:', member.name);
      }}
    />
  );
}`,
    props: [
      {
        name: "members",
        type: "TeamMember[]",
        required: true,
        description:
          "Array of team member objects with id, name, role, image, and optional bio",
      },
      {
        name: "title",
        type: "string",
        required: true,
        description: "Title displayed above the carousel",
      },
      {
        name: "titleSize",
        type: "'sm' | 'md' | 'lg' | 'xl' | '2xl'",
        required: false,
        description: "Size of the title text",
      },
      {
        name: "cardWidth",
        type: "number",
        required: false,
        description: "Width of each card in pixels",
      },
      {
        name: "cardHeight",
        type: "number",
        required: false,
        description: "Height of each card in pixels",
      },
      {
        name: "autoPlay",
        type: "number",
        required: false,
        description: "Auto-play interval in milliseconds (0 to disable)",
      },
      {
        name: "showArrows",
        type: "boolean",
        required: true,
        description: "Show navigation arrows",
      },
      {
        name: "showDots",
        type: "boolean",
        required: true,
        description: "Show dot indicators",
      },
    ],
    examples: [
      {
        title: "Basic Team Carousel",
        description: "Simple team carousel with default settings",
        code: `import { TeamCarousel } from "@/components/lightswind/team-carousel";

const teamMembers = [
  {
    id: "1",
    name: "Emily Kim",
    role: "Founder",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e"
  },
  {
    id: "2",
    name: "Michael Stewart",
    role: "Creative Director",
    image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5"
  }
];

<TeamCarousel members={teamMembers} />`,
      },
      {
        title: "Custom Styled Carousel",
        description: "Team carousel with custom colors and auto-play",
        code: `<TeamCarousel
  members={teamMembers}
  title="MEET OUR TEAM"
  titleColor="#1e40af"
  background="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  autoPlay={4000}
  cardWidth={320}
  cardHeight={420}
  infoTextColor="#1e40af"
/>`,
      },
      {
        title: "Minimal Carousel",
        description: "Clean carousel without arrows or dots",
        code: `<TeamCarousel
  members={teamMembers}
  title=""
  showArrows={false}
  showDots={false}
  infoPosition="overlay"
  grayscaleEffect={false}
/>`,
      },
    ],
    accessibility: ` [
      "Full keyboard navigation with arrow keys",
      "ARIA labels for navigation buttons",
      "Touch/swipe support for mobile devices",
      "Screen reader compatible team member information",
      "Focus management for interactive elements",
      "Proper heading structure for title",
    ],
    best_practices: [
      "Use high-quality, professional headshot images",
      "Keep team member names and roles concise",
      "Test auto-play timing for optimal user experience",
      "Ensure sufficient color contrast for text elements",
      "Consider performance with large team sizes",
      "Provide meaningful bio information when using overlay position",
    ],
    troubleshooting: [
      {
        issue: "Images not loading or displaying incorrectly",
        solution: "Ensure image URLs are accessible and use proper aspect ratios. Consider using placeholder images for development."
      },
      {
        issue: "Carousel animations appear choppy",
        solution: "Reduce animationDuration or disable auto-play. Check for performance issues with large images."
      },
      {
        issue: "Touch navigation not working on mobile",
        solution: "Verify touchNavigation prop is enabled and test on actual mobile devices rather than browser dev tools."
      },
      {
        issue: "Cards not positioning correctly",
        solution: "Check cardWidth and cardHeight props match your content. Ensure container has sufficient space."
      },
    ]`,
  },

  [formatName("3D Image Gallery")]: {
    description:
      "An interactive Three.js powered 3D image gallery with parallax effects, customizable styling, and responsive design. Features mouse/touch controls, auto-rotation, and professional animations.",
    import: `import ThreeDImageGallery from "@/components/lightswind/3d-image-gallery"`,
    usage: `import ThreeDImageGallery from "@/components/lightswind/3d-image-gallery";
import { useState } from "react";

// Basic usage
<ThreeDImageGallery
  images={[
    'https://example.com/image1.jpg',
    'https://example.com/image2.jpg',
    'https://example.com/image3.jpg'
  ]}
  onImageClick={(index) => console.log('Clicked image:', index)}
/>

// Advanced configuration
<ThreeDImageGallery
  images={customImages}
  width={800}
  height={600}
  parallaxStrength={0.5}
  autoRotate={true}
  autoRotateSpeed={0.3}
  borderRadius={0.1}
  ambientLightIntensity={0.7}
  onImageClick={handleImageClick}
  onSceneReady={() => console.log('3D scene loaded!')}
/>`,
    props: [
      {
        name: "images",
        type: "string[]",
        required: false,
        description:
          "Array of image URLs to display in the gallery (default: demo images).",
      },
      {
        name: "width",
        type: "number",
        required: false,
        description: "Width of the gallery container in pixels (default: 800).",
      },
      {
        name: "height",
        type: "number",
        required: false,
        description:
          "Height of the gallery container in pixels (default: 600).",
      },
      {
        name: "boxWidth",
        type: "number",
        required: false,
        description: "Width of individual image planes (default: 1).",
      },
      {
        name: "boxHeight",
        type: "number",
        required: false,
        description: "Height of individual image planes (default: 1.4).",
      },
      {
        name: "parallaxStrength",
        type: "number",
        required: false,
        description: "Strength of mouse parallax effect (0-1, default: 0.3).",
      },
      {
        name: "animationSpeed",
        type: "number",
        required: false,
        description: "Speed of animations and transitions (default: 3).",
      },
      {
        name: "spacing",
        type: "number",
        required: false,
        description: "Spacing between image planes (default: 1).",
      },
      {
        name: "rotationAngle",
        type: "number",
        required: false,
        description:
          "Rotation angle for side images in radians (default: 0.1).",
      },
      {
        name: "borderRadius",
        type: "number",
        required: false,
        description:
          "Border radius for rounded corners (0-0.2, default: 0.08).",
      },
      {
        name: "edgeSoftness",
        type: "number",
        required: false,
        description: "Softness of image edges (default: 0.001).",
      },
      {
        name: "autoRotate",
        type: "boolean",
        required: false,
        description:
          "Enable automatic rotation of the gallery (default: false).",
      },
      {
        name: "autoRotateSpeed",
        type: "number",
        required: false,
        description: "Speed of auto rotation (default: 0.5).",
      },
      {
        name: "ambientLightIntensity",
        type: "number",
        required: false,
        description: "Intensity of ambient lighting (0-1, default: 0.5).",
      },
      {
        name: "enableMouseControl",
        type: "boolean",
        required: false,
        description: "Enable mouse interaction for parallax (default: true).",
      },
      {
        name: "enableTouchControl",
        type: "boolean",
        required: false,
        description:
          "Enable touch interaction for mobile devices (default: true).",
      },
      {
        name: "perspective",
        type: "number",
        required: false,
        description: "Camera perspective field of view (default: 75).",
      },
      {
        name: "cameraDistance",
        type: "number",
        required: false,
        description: "Distance of camera from the scene (default: 3).",
      },
      {
        name: "backgroundColor",
        type: "string",
        required: false,
        description: "Background color of the scene (default: 'transparent').",
      },
      {
        name: "className",
        type: "string",
        required: false,
        description: "Additional CSS class for the container.",
      },
      {
        name: "style",
        type: "React.CSSProperties",
        required: false,
        description: "Custom styles for the container.",
      },
      {
        name: "onImageClick",
        type: "(index: number) => void",
        required: false,
        description: "Callback when an image is clicked.",
      },
      {
        name: "onSceneReady",
        type: "() => void",
        required: false,
        description: "Callback when the 3D scene is fully loaded.",
      },
    ],
    examples: [
      {
        title: "Basic 3D Gallery",
        description: "Simple gallery with default settings",
        code: `import ThreeDImageGallery from "@/components/lightswind/3d-image-gallery";

<ThreeDImageGallery
  images={[
    'https://images.pexels.com/photos/2514035/pexels-photo-2514035.jpeg',
    'https://images.pexels.com/photos/816608/pexels-photo-816608.jpeg',
    'https://images.pexels.com/photos/1271620/pexels-photo-1271620.jpeg'
  ]}
  onImageClick={(index) => console.log('Image clicked:', index)}
/>`,
      },
      {
        title: "Auto-Rotating Gallery",
        description: "Gallery with automatic rotation and custom styling",
        code: `import ThreeDImageGallery from "@/components/lightswind/3d-image-gallery";

<ThreeDImageGallery
  images={portfolioImages}
  autoRotate={true}
  autoRotateSpeed={0.3}
  borderRadius={0.12}
  ambientLightIntensity={0.8}
  spacing={1.2}
  backgroundColor="#000000"
  onSceneReady={() => console.log('Gallery loaded!')}
/>`,
      },
      {
        title: "Mobile-Optimized Gallery",
        description: "Responsive gallery optimized for mobile devices",
        code: `import ThreeDImageGallery from "@/components/lightswind/3d-image-gallery";

<ThreeDImageGallery
  images={mobileImages}
  width={window.innerWidth}
  height={400}
  parallaxStrength={0.2}
  animationSpeed={2}
  enableTouchControl={true}
  perspective={60}
  boxWidth={0.8}
  boxHeight={1.2}
/>`,
      },
      {
        title: "Interactive Portfolio",
        description: "Gallery with click handling for portfolio showcase",
        code: `import ThreeDImageGallery from "@/components/lightswind/3d-image-gallery";
import { useState } from "react";

const [selectedImage, setSelectedImage] = useState(null);

const handleImageClick = (index) => {
  setSelectedImage(portfolioItems[index]);
  // Open modal or navigate to detail page
};

<ThreeDImageGallery
  images={portfolioImages}
  parallaxStrength={0.4}
  borderRadius={0.1}
  spacing={1.5}
  onImageClick={handleImageClick}
/>`,
      },
      {
        title: "Custom Styled Gallery",
        description: "Gallery with custom dimensions and visual effects",
        code: `import ThreeDImageGallery from "@/components/lightswind/3d-image-gallery";

<ThreeDImageGallery
  images={artworkImages}
  width={1200}
  height={800}
  boxWidth={1.2}
  boxHeight={1.6}
  rotationAngle={0.15}
  borderRadius={0.05}
  edgeSoftness={0.002}
  ambientLightIntensity={0.6}
  cameraDistance={4}
  className="artwork-gallery"
/>`,
      },
    ],
    accessibility: ` [
      "ARIA labels for screen reader compatibility",
      "Keyboard navigation support for image selection",
      "High contrast mode support with customizable lighting",
      "Reduced motion respect for accessibility preferences",
      "Touch gesture support for mobile accessibility",
      "Semantic image gallery structure",
      "Focus indicators for interactive elements",
      "Alternative text support through image URLs"
    ],
    best_practices: [
      "Optimize image sizes for web performance (recommended: 1260x750px or similar)",
      "Use consistent aspect ratios across all images for best visual results",
      "Test on various devices and screen sizes for responsive behavior",
      "Consider performance impact with many high-resolution images",
      "Provide fallback content for browsers without WebGL support",
      "Use loading states while images are being loaded",
      "Implement proper error handling for failed image loads",
      "Consider lazy loading for galleries with many images"
    ],
    troubleshooting: [
      {
        issue: "Gallery not rendering or appears black",
        solution: "Ensure WebGL is supported in the browser and images are accessible via CORS. Check browser console for errors."
      },
      {
        issue: "Images appear distorted or stretched",
        solution: "Verify image aspect ratios are consistent. Adjust boxWidth and boxHeight props to match your image dimensions."
      },
      {
        issue: "Poor performance on mobile devices",
        solution: "Reduce image resolution, disable auto-rotation, lower parallax strength, or reduce the number of images for mobile."
      },
      {
        issue: "Mouse/touch controls not responding",
        solution: "Check that enableMouseControl and enableTouchControl are set to true. Ensure the container has proper dimensions."
      },
      {
        issue: "Images not loading or showing placeholder",
        solution: "Verify image URLs are accessible and support CORS. Check network tab for failed requests."
      },
      {
        issue: "Gallery appears too small on different screen sizes",
        solution: "Use responsive dimensions or CSS to make the container adapt to different screen sizes. Consider using percentage-based sizing."
      }
    ]`,
  },

  [formatName("3D Hover Gallery")]: {
    description:
      "A stunning 3D hover gallery with perspective effects, smooth transitions, and responsive design. Features keyboard navigation, auto-play mode, and extensive customization options.",
    import: `import ThreeDHoverGallery from "@/components/lightswind/3d-hover-gallery"`,
    usage: `import ThreeDHoverGallery from "@/components/lightswind/3d-hover-gallery";

// Basic usage
<ThreeDHoverGallery />

// With custom images
<ThreeDHoverGallery
  images={[
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg",
    "https://example.com/image3.jpg"
  ]}
  onImageClick={(index, image) => console.log(\`Clicked image \${index + 1}\`)}
/>

// Advanced configuration
<ThreeDHoverGallery
  itemWidth={4}
  itemHeight={15}
  gap={0.6}
  perspective={40}
  hoverScale={12}
  transitionDuration={1.5}
  backgroundColor="#0a0a0a"
  grayscaleStrength={0.8}
  brightnessLevel={0.6}
  activeWidth={35}
  enableKeyboardNavigation={true}
  autoPlay={true}
  autoPlayDelay={4000}
  onImageClick={(index, image) => handleImageClick(index, image)}
  onImageHover={(index, image) => handleImageHover(index, image)}
/>`,
    props: [
      {
        name: "images",
        type: "string[]",
        required: false,
        description:
          "Array of image URLs to display in the gallery (default: demo images).",
      },
      {
        name: "itemWidth",
        type: "number",
        required: false,
        description: "Width of gallery items in viewport units (default: 3).",
      },
      {
        name: "itemHeight",
        type: "number",
        required: false,
        description: "Height of gallery items in viewport units (default: 12).",
      },
      {
        name: "gap",
        type: "number",
        required: false,
        description: "Gap between gallery items in rem units (default: 0.4).",
      },
      {
        name: "perspective",
        type: "number",
        required: false,
        description:
          "CSS perspective value for 3D effect in viewport units (default: 35).",
      },
      {
        name: "hoverScale",
        type: "number",
        required: false,
        description: "Scale factor for hover transform effect (default: 10).",
      },
      {
        name: "transitionDuration",
        type: "number",
        required: false,
        description: "Duration of transitions in seconds (default: 1.25).",
      },
      {
        name: "backgroundColor",
        type: "string",
        required: false,
        description:
          "Background color of the gallery container (default: '#141414').",
      },
      {
        name: "grayscaleStrength",
        type: "number",
        required: false,
        description:
          "Strength of grayscale filter on inactive items (0-1, default: 1).",
      },
      {
        name: "brightnessLevel",
        type: "number",
        required: false,
        description: "Brightness level of inactive items (0-1, default: 0.5).",
      },
      {
        name: "activeWidth",
        type: "number",
        required: false,
        description:
          "Width of active/clicked item in viewport width units (default: 28).",
      },
      {
        name: "rotationAngle",
        type: "number",
        required: false,
        description:
          "Rotation angle for neighboring items in degrees (default: 35).",
      },
      {
        name: "zDepth",
        type: "number",
        required: false,
        description: "Z-depth for neighboring items (default: 8.5).",
      },
      {
        name: "enableKeyboardNavigation",
        type: "boolean",
        required: false,
        description:
          "Enable keyboard navigation with arrow keys (default: true).",
      },
      {
        name: "autoPlay",
        type: "boolean",
        required: false,
        description:
          "Enable automatic cycling through images (default: false).",
      },
      {
        name: "autoPlayDelay",
        type: "number",
        required: false,
        description:
          "Delay between auto-play transitions in milliseconds (default: 3000).",
      },
      {
        name: "className",
        type: "string",
        required: false,
        description: "Additional CSS class for the container.",
      },
      {
        name: "style",
        type: "React.CSSProperties",
        required: false,
        description: "Custom styles for the container.",
      },
      {
        name: "onImageClick",
        type: "(index: number, image: string) => void",
        required: false,
        description: "Callback when an image is clicked.",
      },
      {
        name: "onImageHover",
        type: "(index: number, image: string) => void",
        required: false,
        description: "Callback when an image is hovered.",
      },
      {
        name: "onImageFocus",
        type: "(index: number, image: string) => void",
        required: false,
        description: "Callback when an image receives focus.",
      },
    ],
    examples: [
      {
        title: "Basic Gallery",
        description: "Simple 3D hover gallery with default settings",
        code: `import ThreeDHoverGallery from "@/components/lightswind/3d-hover-gallery";

<ThreeDHoverGallery />`,
      },
      {
        title: "Custom Images",
        description: "Gallery with custom image URLs and click handling",
        code: `import ThreeDHoverGallery from "@/components/lightswind/3d-hover-gallery";

const customImages = [
  "https://example.com/nature1.jpg",
  "https://example.com/nature2.jpg",
  "https://example.com/nature3.jpg",
  "https://example.com/nature4.jpg"
];

<ThreeDHoverGallery
  images={customImages}
  onImageClick={(index, image) => {
    console.log(\`Clicked image \${index + 1}: \${image}\`);
  }}
/>`,
      },
      {
        title: "Auto-Playing Gallery",
        description: "Gallery with automatic image cycling",
        code: `import ThreeDHoverGallery from "@/components/lightswind/3d-hover-gallery";

<ThreeDHoverGallery
  autoPlay={true}
  autoPlayDelay={4000}
  transitionDuration={2}
  hoverScale={15}
/>`,
      },
      {
        title: "Compact Gallery",
        description: "Smaller gallery with adjusted dimensions",
        code: `import ThreeDHoverGallery from "@/components/lightswind/3d-hover-gallery";

<ThreeDHoverGallery
  itemWidth={2}
  itemHeight={8}
  gap={0.2}
  activeWidth={20}
  hoverScale={8}
  transitionDuration={0.8}
/>`,
      },
      {
        title: "Dark Theme Variant",
        description: "Gallery optimized for dark themes",
        code: `import ThreeDHoverGallery from "@/components/lightswind/3d-hover-gallery";

<ThreeDHoverGallery
  backgroundColor="#000000"
  grayscaleStrength={0.6}
  brightnessLevel={0.3}
  perspective={45}
  hoverScale={12}
/>`,
      },
      {
        title: "Full-Width Gallery",
        description: "Gallery that takes full container width",
        code: `import ThreeDHoverGallery from "@/components/lightswind/3d-hover-gallery";

<ThreeDHoverGallery
  itemWidth={4}
  itemHeight={16}
  gap={0.8}
  activeWidth={40}
  perspective={50}
  className="w-full"
/>`,
      },
    ],
    accessibility: ` [
      "Full keyboard navigation support with arrow keys, Enter, and Space",
      "ARIA labels and roles for screen reader compatibility",
      "Focus indicators for keyboard navigation",
      "Semantic button roles for interactive elements",
      "Support for reduced motion preferences",
      "High contrast mode compatibility",
      "Tab navigation support for all interactive elements",
      "Proper focus management during interactions"
    ],
    best_practices: [
      "Use high-quality images with consistent aspect ratios",
      "Provide meaningful alt text or aria-labels for images",
      "Test performance with large numbers of images",
      "Consider implementing lazy loading for better performance",
      "Ensure sufficient color contrast for accessibility",
      "Test on various screen sizes and orientations",
      "Consider reducing animations on mobile devices",
      "Implement proper error handling for failed image loads"
    ],
    troubleshooting: [
      {
        issue: "Images not loading or displaying incorrectly",
        solution: "Verify image URLs are accessible and have CORS headers enabled. Check for proper image formats (JPG, PNG, WebP)."
      },
      {
        issue: "Performance issues with many images",
        solution: "Reduce the number of images or implement lazy loading. Consider optimizing image sizes and formats."
      },
      {
        issue: "Gallery not responsive on mobile devices",
        solution: "Adjust itemWidth and itemHeight values for smaller screens. Test with different viewport sizes."
      },
      {
        issue: "Keyboard navigation not working",
        solution: "Ensure enableKeyboardNavigation is true and the gallery container has proper focus management."
      },
      {
        issue: "Transitions appear choppy or slow",
        solution: "Reduce transitionDuration or hoverScale values. Check for CSS conflicts affecting transform properties."
      },
      {
        issue: "3D effects not visible",
        solution: "Increase perspective value or ensure browser supports CSS 3D transforms. Check for transform-style preservation."
      }
    ]`,
  },

  [formatName("Code Hover Cards")]: {
    description:
      "Interactive cards with dynamic character matrix effects on hover. Features customizable gradients, animations, and responsive layouts with professional styling and accessibility support.",
    import: `import ThreeDHoverGallery from "@/components/lightswind/3d-hover-gallery"`,

    props: [
      {
        name: "cards",
        type: "CardData[]",
        required: true,
        description:
          "Array of card objects with id, icon, title, description, and href properties.",
      },
      {
        name: "className",
        type: "string",
        required: false,
        description: "Additional CSS classes for the container.",
      },
      {
        name: "cardClassName",
        type: "string",
        required: false,
        description: "Additional CSS classes for individual cards.",
      },
      {
        name: "gradientColors",
        type: "string[]",
        required: false,
        description: "Array of colors for the radial gradient overlay effect.",
      },
      {
        name: "maskRadius",
        type: "number",
        required: false,
        description: "Radius of the character reveal mask effect in pixels.",
      },
      {
        name: "characterCount",
        type: "number",
        required: false,
        description:
          "Number of random characters to generate for the background matrix effect.",
      },
      {
        name: "characterSet",
        type: "string",
        required: false,
        description:
          "Set of characters to use for the random background matrix effect.",
      },
      {
        name: "animationDuration",
        type: "number",
        required: false,
        description: "Duration of the character reveal animation in seconds.",
      },
      {
        name: "borderRadius",
        type: "number",
        required: false,
        description:
          "Border radius of the cards in pixels for rounded corners.",
      },
      {
        name: "cardGap",
        type: "string",
        required: false,
        description: "Gap between cards using CSS gap value (rem, px, etc).",
      },
      {
        name: "iconSize",
        type: "number",
        required: false,
        description: "Size of the Lucide React icons in pixels.",
      },
      {
        name: "iconColor",
        type: "string",
        required: false,
        description: "Color of the card icons in hex or CSS color format.",
      },
      {
        name: "backgroundColor",
        type: "string",
        required: false,
        description: "Background color of the main container.",
      },
      {
        name: "borderColor",
        type: "string",
        required: false,
        description: "Border color of the individual cards with opacity.",
      },
      {
        name: "enableTouch",
        type: "boolean",
        required: true,
        description: "Enable touch interaction for mobile and tablet devices.",
      },
      {
        name: "columns",
        type: "1 | 2 | 3 | 4",
        required: false,
        description: "Number of columns in the responsive grid layout.",
      },
      {
        name: "minHeight",
        type: "number",
        required: false,
        description: "Minimum height of individual cards in pixels.",
      },
      {
        name: "onCardClick",
        type: "(card: CardData) => void",
        required: false,
        description: "Callback function triggered when a card is clicked.",
      },
      {
        name: "onCardHover",
        type: "(card: CardData) => void",
        required: false,
        description: "Callback function triggered when a card is hovered.",
      },
      {
        name: "disabled",
        type: "boolean",
        required: false,
        description: "Disable all card interactions and apply opacity styling.",
      },
      {
        name: "showBorder",
        type: "boolean",
        required: true,
        description: "Show or hide card borders for different design styles.",
      },
    ],
    usage: `import CodeHoverCards from '@/components/lightswind/code-hover-cards';
import { Github, Code, Dices } from 'lucide-react';

// Basic usage with default cards
<CodeHoverCards />

// Custom cards with icons and links
const cards = [
  { id: '1', icon: Github, title: 'GitHub', href: 'https://github.com' },
  { id: '2', icon: Code, title: 'Code Editor' },
  { id: '3', icon: Dices, title: 'Games' },
];

<CodeHoverCards 
  cards={cards}
  onCardClick={(card) => console.log('Clicked:', card)}
/>

// Advanced configuration
<CodeHoverCards 
  cards={cards}
  gradientColors={['#1a1a2e', '#16213e', '#0f3460', '#e94560']}
  maskRadius={400}
  characterCount={3000}
  iconSize={64}
  borderRadius={20}
  backgroundColor="#0a0a0a"
  columns={4}
  enableTouch={true}
  onCardClick={(card) => handleCardClick(card)}
  onCardHover={(card) => handleCardHover(card)}
/>`,
    accessibility: ` {
      ariaLabels: ["Cards include proper ARIA labels for screen readers", "Icons have accessible names and descriptions"],
      keyboardSupport: ["Cards are focusable with tab navigation", "Click handlers work with Enter and Space keys", "Full keyboard accessibility support"],
      screenReader: ["Card titles and descriptions are announced properly", "Icon names are accessible to screen readers", "Interaction states are communicated"]
    },

    troubleshooting: [
      {
        issue: "Character matrix effect not appearing on hover",
        solution: "Ensure the card has sufficient content and the maskRadius is appropriate for your card size. Check that mouse events are not being blocked by other elements. Verify that characterCount is set to a reasonable value (1000-3000)."
      },
      {
        issue: "Touch interaction not working on mobile devices",
        solution: "Make sure enableTouch is set to true and test on actual mobile devices as desktop touch simulation may behave differently. Check for CSS pointer-events conflicts and ensure touch events are not prevented by parent elements."
      },
      {
        issue: "Icons not displaying correctly from Lucide React",
        solution: "Verify that you're importing the correct Lucide React icons and that the icon component is properly passed to the CardData object. Ensure lucide-react is installed and the icon names match the exact exports."
      },
      {
        issue: "Performance issues with many cards or high character count",
        solution: "Reduce characterCount (try 1000-2000 instead of 3000+), limit the number of cards displayed simultaneously, or implement virtualization for large lists. Consider reducing animationDuration for smoother performance."
      },
      {
        issue: "Gradient colors not visible or displaying incorrectly",
        solution: "Check that gradientColors array contains valid CSS color values (hex, rgb, hsl). Ensure the mix-blend-mode property is supported by target browsers. Test with simpler gradient combinations first."
      },
      {
        issue: "Cards not responsive on different screen sizes",
        solution: "Adjust the columns prop for different breakpoints, test minHeight values on various devices, and ensure cardGap works well across screen sizes. Consider using responsive CSS classes in className prop."
      },
      {
        issue: "Click handlers not firing or href links not working",
        solution: "Check that onCardClick callbacks are properly defined and not conflicting with href navigation. Ensure event propagation is not stopped by other event handlers. Verify that disabled prop is not set to true."
      },
      {
        issue: "Character mask effect not following cursor accurately",
        solution: "Verify that the card container has proper positioning (relative) and check for CSS transform conflicts. Ensure maskRadius is appropriate for the card size and that pointer events are reaching the card element."
      }
    ]`,
  },

  [formatName("3D Marquee")]: {
    description:
      "A stunning 3D animated image gallery with customizable rotation, scaling, and interactive features. Perfect for showcasing portfolios, products, or any visual content with an engaging 3D perspective.",
    import: `import { ThreeDMarquee, MarqueeImage } from "@/components/lightswind/3d-marquee"`,
    usage: `import { ThreeDMarquee, MarqueeImage } from "@/components/lightswind/3d-marquee";

// Basic usage
const images: MarqueeImage[] = [
  {
    src: "/path/to/image1.jpg",
    alt: "Description 1"
  },
  {
    src: "/path/to/image2.jpg", 
    alt: "Description 2"
  }
];

<ThreeDMarquee images={images} />

// With clickable images
const clickableImages: MarqueeImage[] = [
  {
    src: "/path/to/image1.jpg",
    alt: "Portfolio Item 1",
    href: "https://example.com/project1",
    target: "_blank"
  }
];
 
<ThreeDMarquee 
  images={clickableImages}
  onImageClick={(image, index) => {
    console.log('Clicked:', image.alt, 'at index:', index);
  }}
/>`,

    props: [
      {
        name: "images",
        type: "MarqueeImage[]",
        required: true,
        description:
          "Array of image objects with src, alt, optional href and target properties.",
      },
      {
        name: "className",
        type: "string",
        required: false,
        description: "Additional CSS classes for the container.",
      },
      {
        name: "onImageClick",
        type: "(image: MarqueeImage, index: number) => void",
        required: false,
        description:
          "Callback function when an image is clicked. Takes precedence over href links.",
      },
    ],
    examples: [
      {
        title: "Basic Gallery",
        description: "Simple 3D marquee with default settings",
        code: `import { ThreeDMarquee } from "@/components/lightswind/3d-marquee";

const images = [
  { src: "/image1.jpg", alt: "Gallery item 1" },
  { src: "/image2.jpg", alt: "Gallery item 2" },
  { src: "/image3.jpg", alt: "Gallery item 3" }
];

<ThreeDMarquee images={images} />`,
      },
      {
        title: "Interactive Portfolio",
        description: "Portfolio showcase with click handlers",
        code: `import { ThreeDMarquee } from "@/components/lightswind/3d-marquee";

const portfolioImages = [
  { 
    src: "/portfolio1.jpg", 
    alt: "Project Alpha",
    href: "/projects/alpha"
  },
  { 
    src: "/portfolio2.jpg", 
    alt: "Project Beta",
    href: "/projects/beta"
  }
];

<ThreeDMarquee 
  images={portfolioImages}
  onImageClick={(image, index) => {
    router.push(\`/portfolio/\${index}\`);
  }}
/>`,
      },
      {
        title: "External Links",
        description: "Images that open external links",
        code: `import { ThreeDMarquee } from "@/components/lightswind/3d-marquee";

const externalImages = [
  {
    src: "/image.jpg",
    alt: "External resource",
    href: "https://example.com",
    target: "_blank"
  }
];

<ThreeDMarquee images={externalImages} />`,
      },
      {
        title: "Custom Styling",
        description: "Marquee with custom container styles",
        code: `import { ThreeDMarquee } from "@/components/lightswind/3d-marquee";

<ThreeDMarquee 
  images={images}
  className="border-2 border-primarylw shadow-2xl"
/>`,
      },
      {
        title: "Mixed Interactions",
        description: "Combining click handlers with direct links",
        code: `import { ThreeDMarquee } from "@/components/lightswind/3d-marquee";

const mixedImages = [
  { 
    src: "/image1.jpg", 
    alt: "Custom action",
    // No href - will use onImageClick
  },
  { 
    src: "/image2.jpg", 
    alt: "Direct link",
    href: "https://example.com",
    target: "_blank"
  }
];

<ThreeDMarquee 
  images={mixedImages}
  onImageClick={(image, index) => {
    if (!image.href) {
      // Custom action for images without href
      handleCustomAction(image, index);
    }
  }}
/>`,
      },
      {
        title: "Large Image Set",
        description: "Efficiently handling many images",
        code: `import { ThreeDMarquee } from "@/components/lightswind/3d-marquee";

const manyImages = Array.from({ length: 20 }, (_, i) => ({
  src: \`/gallery/image-\${i + 1}.jpg\`,
  alt: \`Gallery image \${i + 1}\`,
  href: \`/gallery/\${i + 1}\`
}));

<ThreeDMarquee images={manyImages} />`,
      },
    ],
    accessibility: ` [
      "Images include alt text for screen readers",
      "Images are focusable and clickable via keyboard",
      "Proper semantic markup with image descriptions",
      "Supports keyboard navigation for interactive elements",
      "Respects reduced motion preferences",
      "High contrast mode compatible"
    ],
    best_practices: [
      "Use descriptive alt text for all images",
      "Optimize image sizes for better performance",
      "Consider lazy loading for large image sets",
      "Test animations on various devices and performance levels",
      "Provide meaningful href values or onImageClick handlers",
      "Use consistent aspect ratios for better visual harmony",
      "Test with keyboard navigation and screen readers",
      "Consider reducing animation complexity on mobile devices"
    ],
    troubleshooting: [
      {
        issue: "Images not loading or displaying",
        solution: "Ensure image URLs are accessible and properly formatted. Check that the images array contains valid MarqueeImage objects with src and alt properties."
      },
      {
        issue: "3D effect not visible",
        solution: "The component uses fixed 3D transforms (rotateX: 55deg, rotateZ: 45deg). Ensure CSS transforms are supported in the browser and no conflicting styles are applied."
      },
      {
        issue: "Click events not firing",
        solution: "Check that either href is provided in image objects or onImageClick callback is properly implemented. onImageClick takes precedence over href links."
      },
      {
        issue: "Performance issues with many images",
        solution: "Consider reducing the number of images, optimizing image sizes, or implementing lazy loading. The component uses infinite animations which may impact performance with too many images."
      },
      {
        issue: "Layout breaks on mobile",
        solution: "The component is responsive but check for container width constraints. Ensure parent containers don't restrict the component's responsive scaling."
      },
      {
        issue: "Animations appear choppy",
        solution: "Reduce the number of images, optimize image file sizes, or check for competing CSS animations. Consider using will-change CSS property for better performance."
      },
      {
        issue: "Grid lines not visible",
        solution: "Grid lines use CSS custom properties and may not appear in all browsers. Check for CSS conflicts and ensure the component's styles are not being overridden."
      },
      {
        issue: "Hover effects not working",
        solution: "Ensure the component is not wrapped in containers that prevent mouse events. Check that CSS pointer-events are not disabled on parent elements."
      }
    ]`,
  },

  [formatName("Aurora Background")]: {
    description:
      "An animated aurora background effect with beautiful gradient animations that responds to light and dark themes.",
    import: `import { AuroraBackground } from "@/components/lightswind/aurora-background"`,

    props: [
      {
        name: "children",
        type: "ReactNode",
        required: true,
        description: "Content to be displayed over the aurora background",
      },
      {
        name: "showRadialGradient",
        type: "boolean",
        required: false,
        description:
          "Whether to show the radial gradient mask effect (default: true)",
      },
      {
        name: "className",
        type: "string",
        required: false,
        description: "Additional CSS classes to apply to the container",
      },
    ],
    usage: `import { AuroraBackground } from '@/components/lightswind/aurora-background';

// Basic usage
<AuroraBackground>
  <h1>Your content here</h1>
</AuroraBackground>

// Without radial gradient
<AuroraBackground showRadialGradient={false}>
  <div>Full aurora effect</div>
</AuroraBackground>

// With custom styling
<AuroraBackground className="items-start pt-20">
  <section>Custom positioned content</section>
</AuroraBackground>`,
    examples: [
      {
        title: "Hero Section",
        description: "Perfect for landing page hero sections",
        code: `<AuroraBackground>
  <div className="text-center">
    <h1 className="text-4xl font-bold mb-4">Welcome to Our Platform</h1>
    <p className="text-lg opacity-80 mb-8">Experience the future today</p>
    <button className="px-6 py-3 bg-white text-black rounded-lg">
      Get Started
    </button>
  </div>
</AuroraBackground>`,
      },
      {
        title: "Authentication Pages",
        description: "Beautiful background for login/signup forms",
        code: `<AuroraBackground className="justify-center">
  <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl">
    <h2 className="text-2xl font-semibold mb-6">Sign In</h2>
    <form className="space-y-4">
      <input type="email" placeholder="Email" className="w-full p-3 rounded" />
      <input type="password" placeholder="Password" className="w-full p-3 rounded" />
      <button type="submit" className="w-full bg-primarylw text-white p-3 rounded">
        Sign In
      </button>
    </form>
  </div>
</AuroraBackground>`,
      },
      {
        title: "Feature Showcase",
        description: "Highlight key features with aurora background",
        code: `<AuroraBackground showRadialGradient={false}>
  <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
    <div className="text-center">
      <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4"></div>
      <h3 className="text-xl font-semibold mb-2">Fast</h3>
      <p className="opacity-80">Lightning fast performance</p>
    </div>
    <div className="text-center">
      <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4"></div>
      <h3 className="text-xl font-semibold mb-2">Secure</h3>
      <p className="opacity-80">Bank-level security</p>
    </div>
    <div className="text-center">
      <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4"></div>
      <h3 className="text-xl font-semibold mb-2">Reliable</h3>
      <p className="opacity-80">99.9% uptime guarantee</p>
    </div>
  </div>
</AuroraBackground>`,
      },
    ],
    accessibility: ` {
      ariaLabels: ["Background decorative element with proper contrast"],
      keyboardSupport: ["Fully keyboard accessible content area"],
      screenReader: ["Aurora effect is purely decorative and doesn't interfere with screen readers"]
    },
    troubleshooting: [
      {
        issue: "Aurora animation appears choppy",
        solution: "The animation uses a 60-second cycle for smooth performance. If still choppy, check for CSS conflicts or reduce browser zoom level."
      },
      {
        issue: "Colors not displaying correctly",
        solution: "Ensure your browser supports CSS custom properties and blend modes. Check that no parent elements are affecting color inheritance."
      },
      {
        issue: "Background not filling viewport",
        solution: "The component uses h-[100vh] by default. If you need different sizing, override with className prop or wrap in a container with specific dimensions."
      },
      {
        issue: "Content not visible",
        solution: "Ensure content has sufficient contrast. Use text-white for dark themes and text-slate-950 for light themes. Consider adding backdrop-blur or background overlays for better readability."
      }
    ]`,
  },

  [formatName("Grid Dot Backgrounds")]: {
    description:
      "Professional grid and dot background components with customizable patterns, colors, and fade effects. Perfect for hero sections, landing pages, and content backgrounds with both light and dark mode support.",
    import: `import { GridBackground, DotBackground } from "@/components/lightswind/grid-dot-background"`,
    usage: `import { GridBackground, DotBackground } from "@/components/lightswind/grid-dot-background";

// Grid Background
<GridBackground 
  gridSize={20}
  gridColor="#e4e4e7"
  darkGridColor="#262626"
  showFade={true}
  fadeIntensity={20}
  className="h-[500px]"
>
  <div className="text-center">
    <h1 className="text-4xl font-bold">Grid Background</h1>
    <p className="text-gray-600">Perfect for structured layouts</p>
  </div>
</GridBackground>

// Dot Background
<DotBackground 
  dotSize={1}
  dotColor="#d4d4d4"
  darkDotColor="#404040"
  spacing={20}
  showFade={true}
  fadeIntensity={20}
  className="h-[500px]"
>
  <div className="text-center">
    <h1 className="text-4xl font-bold">Dot Background</h1>
    <p className="text-gray-600">Subtle and elegant patterns</p>
  </div>
</DotBackground>`,
    props: [
      {
        name: "gridSize (GridBackground)",
        type: "number",
        required: false,
        description: "Size of each grid cell in pixels. Default: 20",
      },
      {
        name: "gridColor (GridBackground)",
        type: "string",
        required: false,
        description: "Color of grid lines in light mode. Default: '#e4e4e7'",
      },
      {
        name: "darkGridColor (GridBackground)",
        type: "string",
        required: false,
        description: "Color of grid lines in dark mode. Default: '#262626'",
      },
      {
        name: "dotSize (DotBackground)",
        type: "number",
        required: false,
        description: "Size of each dot in pixels. Default: 1",
      },
      {
        name: "dotColor (DotBackground)",
        type: "string",
        required: false,
        description: "Color of dots in light mode. Default: '#d4d4d4'",
      },
      {
        name: "darkDotColor (DotBackground)",
        type: "string",
        required: false,
        description: "Color of dots in dark mode. Default: '#404040'",
      },
      {
        name: "spacing (DotBackground)",
        type: "number",
        required: false,
        description: "Space between dots in pixels. Default: 20",
      },
      {
        name: "showFade",
        type: "boolean",
        required: false,
        description: "Whether to show radial fade effect. Default: true",
      },
      {
        name: "fadeIntensity",
        type: "number",
        required: false,
        description: "Intensity of fade effect (0-50%). Default: 20",
      },
      {
        name: "className",
        type: "string",
        required: false,
        description: "Additional CSS classes for styling",
      },
      {
        name: "children",
        type: "React.ReactNode",
        required: false,
        description: "Content to display over the background",
      },
    ],
    examples: [
      {
        title: "Basic Grid",
        description: "Simple grid background with default settings",
        code: `import { GridBackground } from "@/components/lightswind/grid-dot-background";

<GridBackground>
  <h1 className="text-4xl font-bold">Welcome</h1>
</GridBackground>`,
      },
      {
        title: "Custom Grid",
        description: "Grid with custom size and colors",
        code: `import { GridBackground } from "@/components/lightswind/grid-dot-background";

<GridBackground 
  gridSize={30}
  gridColor="#3b82f6"
  darkGridColor="#1d4ed8"
  fadeIntensity={10}
>
  <div className="text-center space-y-4">
    <h1 className="text-5xl font-bold">Custom Grid</h1>
    <p className="text-xl">Large grid with blue lines</p>
  </div>
</GridBackground>`,
      },
      {
        title: "Basic Dots",
        description: "Simple dot background with default settings",
        code: `import { DotBackground } from "@/components/lightswind/grid-dot-background";

<DotBackground>
  <h1 className="text-4xl font-bold">Elegant Dots</h1>
</DotBackground>`,
      },
      {
        title: "Custom Dots",
        description: "Dot pattern with custom size and spacing",
        code: `import { DotBackground } from "@/components/lightswind/grid-dot-background";

<DotBackground 
  dotSize={2}
  spacing={15}
  dotColor="#10b981"
  darkDotColor="#059669"
  fadeIntensity={30}
>
  <div className="text-center space-y-4">
    <h1 className="text-5xl font-bold">Dense Dots</h1>
    <p className="text-xl">Green dots with tight spacing</p>
  </div>
</DotBackground>`,
      },
      {
        title: "No Fade Effect",
        description: "Background without radial fade",
        code: `import { GridBackground } from "@/components/lightswind/grid-dot-background";

<GridBackground showFade={false}>
  <div className="bg-white/90 dark:bg-black/90 p-8 rounded-lg">
    <h1 className="text-4xl font-bold">No Fade</h1>
    <p>Full grid visibility</p>
  </div>
</GridBackground>`,
      },
      {
        title: "Hero Section",
        description: "Using background for hero section",
        code: `import { DotBackground } from "@/components/lightswind/grid-dot-background";
import { Button } from "@/components/lightswind/button";

<DotBackground className="min-h-screen">
  <div className="max-w-4xl mx-auto text-center space-y-8">
    <h1 className="text-6xl font-bold bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text text-transparent">
      Amazing Product
    </h1>
    <p className="text-xl text-gray-600 dark:text-gray-400">
      Revolutionary solution for modern problems
    </p>
    <div className="space-x-4">
      <Button size="lg">Get Started</Button>
      <Button variant="outline" size="lg">Learn More</Button>
    </div>
  </div>
</DotBackground>`,
      },
    ],
    accessibility: ` [
      "Backgrounds are purely decorative and don't interfere with content accessibility",
      "High contrast mode compatible with customizable colors",
      "Respects user's reduced motion preferences",
      "Proper color contrast maintained for overlaid content",
      "Screen reader friendly - backgrounds don't add noise to content",
      "Keyboard navigation works normally over backgrounds"
    ],
    best_practices: [
      "Use subtle colors that don't compete with your content",
      "Consider performance impact with very small grid/dot sizes",
      "Test readability of text content over the background",
      "Use fade effects to focus attention on central content",
      "Match grid/dot density to your design's complexity level",
      "Ensure sufficient contrast between background and content",
      "Test appearance in both light and dark modes",
      "Consider reducing complexity on mobile devices"
    ],
    troubleshooting: [
      {
        issue: "Background pattern not visible",
        solution: "Check that colors have sufficient contrast. Ensure grid/dot colors are different from the background color. Verify that showFade isn't hiding the pattern completely."
      },
      {
        issue: "Performance issues on mobile",
        solution: "Increase grid size or dot spacing to reduce the number of rendered elements. Consider disabling the background on mobile devices or using larger patterns."
      },
      {
        issue: "Dark mode colors not applying",
        solution: "Ensure your app properly implements dark mode with Tailwind's dark: prefix. Check that darkGridColor/darkDotColor props are correctly set."
      },
      {
        issue: "Content not visible over background",
        solution: "Increase fadeIntensity or add a semi-transparent overlay to your content. Use contrasting text colors and consider adding background colors to text containers."
      },
      {
        issue: "Background not filling container",
        solution: "The components use h-[50rem] by default. Override with className to set appropriate height (e.g., 'min-h-screen', 'h-[400px]')."
      },
      {
        issue: "Fade effect looks wrong",
        solution: "Adjust fadeIntensity (0-50%). Lower values create stronger fades, higher values create subtler effects. Set showFade={false} to disable completely."
      }
    ]`,
  },

  [formatName("Lens")]: {
    description:
      "Interactive magnifying lens component with customizable zoom, animations, and visual effects. Perfect for image galleries, product showcases, detailed inspections, and interactive content exploration with both hover and static modes.",
    import: `import { Lens } from "@/components/lightswind/lens"`,
    usage: `import { Lens } from "@/components/lightswind/lens";

<Lens zoomFactor={2} lensSize={150}>
  <img src="/image.jpg" alt="Product" className="w-full h-64 object-cover" />
</Lens>

// Static Lens (Always Visible)
<Lens 
  isStatic
  position={{ x: 200, y: 150 }}
  zoomFactor={2.5}
  lensSize={120}
  shadowIntensity="medium"
>
  <img src="/image.jpg" alt="Product" className="w-full h-64 object-cover" />
</Lens>

// Advanced Lens with Custom Effects
<Lens 
  zoomFactor={3}
  lensSize={180}
  maskShape="square"
  blurEdge={true}
  shadowIntensity="heavy"
  animationDuration={0.5}
  smoothFollow={false}
>
  <div className="bg-gradient-to-r from-primarylw to-purple-500 h-96">
    <h1 className="text-white text-4xl">Interactive Content</h1>
  </div>
</Lens>`,
    props: [
      {
        name: "children",
        type: "React.ReactNode",
        required: true,
        description:
          "Content to be magnified (images, divs, any React elements)",
      },
      {
        name: "zoomFactor",
        type: "number",
        required: false,
        description: "Magnification level (1.1 to 5). Default: 1.5",
      },
      {
        name: "lensSize",
        type: "number",
        required: false,
        description: "Diameter of the lens in pixels (50-300). Default: 170",
      },
      {
        name: "isStatic",
        type: "boolean",
        required: false,
        description:
          "Whether lens is always visible at fixed position. Default: false",
      },
      {
        name: "position",
        type: "{ x: number; y: number }",
        required: false,
        description:
          "Fixed position for static lens. Default: { x: 200, y: 150 }",
      },
      {
        name: "hovering",
        type: "boolean",
        required: false,
        description: "External control of hover state for interactive lens",
      },
      {
        name: "setHovering",
        type: "(hovering: boolean) => void",
        required: false,
        description: "Callback for hover state changes",
      },
      {
        name: "className",
        type: "string",
        required: false,
        description: "Additional CSS classes for the container",
      },
      {
        name: "borderRadius",
        type: "string",
        required: false,
        description:
          "Tailwind border radius class (sm, md, lg, xl). Default: 'lg'",
      },
      {
        name: "borderWidth",
        type: "number",
        required: false,
        description: "Border thickness around lens (0-4). Default: 0",
      },
      {
        name: "borderColor",
        type: "string",
        required: false,
        description: "Border color class. Default: 'border-gray-300'",
      },
      {
        name: "shadowIntensity",
        type: "'none' | 'light' | 'medium' | 'heavy'",
        required: false,
        description: "Drop shadow intensity for lens. Default: 'medium'",
      },
      {
        name: "animationDuration",
        type: "number",
        required: false,
        description: "Animation duration in seconds (0.1-2). Default: 0.3",
      },
      {
        name: "animationEasing",
        type: "string",
        required: false,
        description: "CSS easing function. Default: 'easeOut'",
      },
      {
        name: "maskShape",
        type: "'circle' | 'square'",
        required: false,
        description: "Shape of the lens mask. Default: 'circle'",
      },
      {
        name: "opacity",
        type: "number",
        required: false,
        description: "Lens opacity (0-1). Default: 1",
      },
      {
        name: "blurEdge",
        type: "boolean",
        required: false,
        description: "Whether to blur the edges of the lens. Default: false",
      },
      {
        name: "smoothFollow",
        type: "boolean",
        required: false,
        description:
          "Smooth mouse following vs snapped grid movement. Default: true",
      },
      {
        name: "disabled",
        type: "boolean",
        required: false,
        description: "Disable lens interaction. Default: false",
      },
    ],
    examples: [
      {
        title: "Basic Image Lens",
        description: "Simple magnifying lens on hover",
        code: `import { Lens } from "@/components/lightswind/lens";

<Lens zoomFactor={2} lensSize={150}>
  <img 
    src="/product-image.jpg" 
    alt="Product Details" 
    className="w-full h-64 object-cover rounded-lg"
  />
</Lens>`,
      },
    ],
    accessibility: ` [
      "Lens effects don't interfere with screen readers",
      "Content remains fully accessible even when magnified",
      "Keyboard navigation works normally over lens containers",
      "Focus states are preserved and visible",
      "ARIA labels and descriptions are maintained",
      "Alternative text for images remains accessible",
      "Color contrast is preserved during magnification",
      "Respects user's reduced motion preferences for animations"
    ],
    best_practices: [
      "Use appropriate zoom levels (1.5-3x) for most content",
      "Match lens size to content complexity and screen size",
      "Test on mobile devices - consider disabling or adjusting",
      "Ensure sufficient contrast between lens border and content",
      "Use static lenses sparingly to avoid overwhelming users",
      "Consider performance with very large images or complex content",
      "Provide visual feedback when lens is disabled",
      "Test with various content types (images, text, gradients)",
      "Use blur edge effect for softer, more natural transitions",
      "Combine with loading states for better user experience"
    ],
    troubleshooting: [
      {
        issue: "Lens not appearing on hover",
        solution: "Check that the component is properly imported and the container has sufficient size. Ensure hovering prop isn't set to false when using external control."
      },
      {
        issue: "Magnification looks blurry",
        solution: "Use high-resolution source images. Check that transform-origin is correctly set. Avoid excessive zoom factors (>4x) which can cause quality loss."
      },
      {
        issue: "Lens position offset or incorrect",
        solution: "Ensure the container has proper positioning (relative). Check that position prop values are within the container bounds for static lenses."
      },
      {
        issue: "Performance issues with complex content",
        solution: "Reduce zoom factor or lens size. Consider using transform3d for hardware acceleration. Disable lens on mobile devices if necessary."
      },
      {
        issue: "Animation feels sluggish",
        solution: "Reduce animationDuration. Use will-change CSS property for better performance. Consider disabling smoothFollow for snappier movement."
      },
      {
        issue: "Lens cuts off at container edges",
        solution: "Increase container size or adjust lens size. For static lenses, ensure position values account for lens radius."
      },
      {
        issue: "Border or shadow not visible",
        solution: "Check that borderWidth > 0 and appropriate borderColor is set. Ensure shadowIntensity is not 'none'. Verify container doesn't clip shadows."
      },
      {
        issue: "Content not properly magnified",
        solution: "Verify that children content has appropriate dimensions. Check that overflow is set correctly on parent containers."
      },
      {
        issue: "Square lens appears circular",
        solution: "Ensure maskShape prop is set to 'square'. Check that CSS mask properties are supported in the target browser."
      },
      {
        issue: "Lens doesn't follow mouse smoothly",
        solution: "Enable smoothFollow prop. Check for CSS transitions or transforms that might interfere. Reduce animationDuration for more responsive movement."
      }
    ]`,
  },

  [formatName("Smooth Cursor")]: {
    description:
      "Advanced smooth cursor replacement component with physics-based animations, magnetic effects, trail animations, and customizable visual effects. Perfect for creative websites, interactive applications, and immersive user experiences.",
    import: `import { SmoothCursor } from "@/components/lightswind/smooth-cursor"`,
    usage: `import { SmoothCursor } from "@/components/lightswind/smooth-cursor";

// Basic Usage
<SmoothCursor />

// Custom Cursor with Settings
<SmoothCursor
  size={30}
  color="purple"
  rotateOnMove={true}
  scaleOnClick={true}
  glowEffect={true}
/>

// Advanced Cursor with Magnetic and Trail Effects
<SmoothCursor
  size={25}
  color="blue"
  showTrail={true}
  trailLength={8}
  magneticDistance={60}
  magneticElements="[data-magnetic]"
  springConfig={{
    damping: 50,
    stiffness: 450,
    mass: 0.8,
    restDelta: 0.001
  }}
/>

// Custom Cursor Element
<SmoothCursor
  cursor={<div className="w-6 h-6 bg-red-500 rounded-full" />}
  rotateOnMove={false}
  scaleOnClick={true}
/>`,
    props: [
      {
        name: "cursor",
        type: "JSX.Element",
        required: false,
        description: "Custom cursor element to replace default cursor SVG",
      },
      {
        name: "springConfig",
        type: "SpringConfig",
        required: false,
        description:
          "Physics configuration for smooth animations. Default: { damping: 45, stiffness: 400, mass: 1, restDelta: 0.001 }",
      },
      {
        name: "className",
        type: "string",
        required: false,
        description: "Additional CSS classes for the cursor container",
      },
      {
        name: "size",
        type: "number",
        required: false,
        description:
          "Size of the default cursor in pixels (10-50). Default: 25",
      },
      {
        name: "color",
        type: "string",
        required: false,
        description:
          "Color of the default cursor (CSS color value). Default: 'black'",
      },
      {
        name: "hideOnLeave",
        type: "boolean",
        required: false,
        description: "Hide cursor when mouse leaves the window. Default: true",
      },
      {
        name: "trailLength",
        type: "number",
        required: false,
        description: "Number of trail particles (3-15). Default: 5",
      },
      {
        name: "showTrail",
        type: "boolean",
        required: false,
        description: "Enable cursor trail effect. Default: false",
      },
      {
        name: "rotateOnMove",
        type: "boolean",
        required: false,
        description: "Rotate cursor based on movement direction. Default: true",
      },
      {
        name: "scaleOnClick",
        type: "boolean",
        required: false,
        description: "Scale down cursor on click/touch. Default: true",
      },
      {
        name: "glowEffect",
        type: "boolean",
        required: false,
        description: "Add glow/drop-shadow effect to cursor. Default: false",
      },
      {
        name: "magneticDistance",
        type: "number",
        required: false,
        description:
          "Distance for magnetic attraction effect (20-100). Default: 50",
      },
      {
        name: "magneticElements",
        type: "string",
        required: false,
        description:
          "CSS selector for magnetic attraction elements. Default: '[data-magnetic]'",
      },
      {
        name: "onCursorMove",
        type: "(position: Position) => void",
        required: false,
        description: "Callback fired on cursor movement with position data",
      },
      {
        name: "onCursorEnter",
        type: "() => void",
        required: false,
        description: "Callback fired when cursor enters the window",
      },
      {
        name: "onCursorLeave",
        type: "() => void",
        required: false,
        description: "Callback fired when cursor leaves the window",
      },
      {
        name: "disabled",
        type: "boolean",
        required: false,
        description:
          "Disable the smooth cursor (shows default cursor). Default: false",
      },
    ],
    examples: [
      {
        title: "Basic Smooth Cursor",
        description: "Simple smooth cursor replacement",
        code: `import { SmoothCursor } from "@/components/lightswind/smooth-cursor";

<SmoothCursor 
  size={25}
  color="black"
  rotateOnMove={true}
  scaleOnClick={true}
/>`,
      },
    ],
    accessibility: ` [
      "Respects user's reduced motion preferences",
      "Maintains system cursor visibility for accessibility tools",
      "Doesn't interfere with keyboard navigation or focus indicators",
      "Preserves click and interaction functionality",
      "Compatible with screen readers and assistive technologies",
      "Provides option to disable for users who prefer default cursor",
      "Maintains pointer events and hover states",
      "Supports high contrast mode detection"
    ],
    best_practices: [
      "Test on various devices and screen sizes",
      "Consider performance impact on lower-end devices",
      "Provide option to disable for users with motion sensitivity",
      "Use appropriate spring configuration for your use case",
      "Test with touch devices and ensure mobile compatibility",
      "Consider cursor visibility against different backgrounds",
      "Use magnetic effects sparingly to avoid overwhelming users",
      "Ensure cursor doesn't interfere with text selection",
      "Test with different mouse speeds and DPI settings",
      "Provide fallback to default cursor if component fails"
    ],
    ]`,
  },

  [formatName("Sliding logo Marquee")]: {
    description:
      "A professional sliding logo marquee component with smooth animations, blur effects, and customizable styling. Perfect for showcasing client logos, partners, or brands with elegant horizontal scrolling motion.",
    import: `import { SlidingLogoMarquee } from "@/components/lightswind/sliding-logo-marquee"`,
    usage: `import { SlidingLogoMarquee, SlidingLogoMarqueeItem } from "@/components/lightswind/sliding-logo-marquee";

// Basic Usage
const logos: SlidingLogoMarqueeItem[] = [
  {
    id: "1",
    content: <div className="text-white font-bold">Company A</div>,
    href: "https://example.com"
  },
  {
    id: "2", 
    content: <img src="/logo.png" alt="Logo" className="h-8" />
  }
];

<SlidingLogoMarquee items={logos} />

// Advanced Configuration
<SlidingLogoMarquee
  items={logos}
  speed={60}
  height="120px"
  enableBlur={true}
  blurIntensity={2}
  pauseOnHover={true}
  showGridBackground={true}
  onItemClick={(item) => console.log("Clicked:", item.id)}
/>`,
    props: [
      {
        name: "items",
        type: "SlidingLogoMarqueeItem[]",
        required: true,
        description: "Array of logo/content items to display in the marquee",
      },
      {
        name: "showControls",
        type: "boolean",
        required: false,
        description: "Show and hide the controls boolean value",
      },
      {
        name: "speed",
        type: "number",
        required: false,
        description: "Animation speed in seconds (lower = faster)",
        default: "60",
      },
      {
        name: "pauseOnHover",
        type: "boolean",
        required: false,
        description:
          "Whether to pause animation when mouse hovers over component",
        default: "true",
      },
      {
        name: "enableBlur",
        type: "boolean",
        required: false,
        description: "Enable blur effects on the left and right edges",
        default: "true",
      },
      {
        name: "blurIntensity",
        type: "number",
        required: false,
        description: "Intensity of the blur effect (0-10)",
        default: "1",
      },
      {
        name: "height",
        type: "string",
        required: false,
        description: "Height of the marquee container",
        default: "100px",
      },
      {
        name: "width",
        type: "string",
        required: false,
        description: "Width of the marquee container",
        default: "100%",
      },
      {
        name: "gap",
        type: "string",
        required: false,
        description: "Gap between marquee items",
        default: "0.5rem",
      },
      {
        name: "scale",
        type: "number",
        required: false,
        description: "Scale factor for the entire component",
        default: "1",
      },
      {
        name: "direction",
        type: "'horizontal' | 'vertical'",
        required: false,
        description: "Direction of the marquee animation",
        default: "horizontal",
      },
      {
        name: "autoPlay",
        type: "boolean",
        required: false,
        description: "Whether animation starts automatically",
        default: "true",
      },
      {
        name: "backgroundColor",
        type: "string",
        required: false,
        description: "Background color of the marquee container",
        default: "hsl(0 0% 2%)",
      },
      {
        name: "showGridBackground",
        type: "boolean",
        required: false,
        description: "Show decorative grid pattern background",
        default: "false",
      },
      {
        name: "className",
        type: "string",
        required: false,
        description: "Additional CSS classes for the container",
      },
      {
        name: "onItemClick",
        type: "(item: SlidingLogoMarqueeItem) => void",
        required: false,
        description: "Callback function when an item is clicked",
      },
      {
        name: "enableSpillEffect",
        type: "boolean",
        required: false,
        description: "Enable visual spill effect outside container bounds",
        default: "false",
      },
      {
        name: "animationSteps",
        type: "number",
        required: false,
        description: "Number of animation steps for smooth blur transitions",
        default: "8",
      },
    ],
    examples: [
      {
        title: "Basic Logo Marquee",
        description: "Simple logo marquee with text content",
        code: `import { SlidingLogoMarquee, SlidingLogoMarqueeItem } from "@/components/lightswind/sliding-logo-marquee";

const logos: SlidingLogoMarqueeItem[] = [
  { id: "1", content: <div className="text-white font-bold">ACME Corp</div> },
  { id: "2", content: <div className="text-white font-bold">TechFlow</div> },
  { id: "3", content: <div className="text-white font-bold">DataSync</div> },
];

<SlidingLogoMarquee 
  items={logos}
  height="100px"
  speed={80}
/>`,
      },
      {
        title: "Interactive Logo Marquee with Blur",
        description: "Marquee with click handlers and blur effects",
        code: `import { SlidingLogoMarquee, SlidingLogoMarqueeItem } from "@/components/lightswind/sliding-logo-marquee";

const partnerLogos: SlidingLogoMarqueeItem[] = [
  {
    id: "company-1",
    content: <img src="/logos/company1.png" alt="Company 1" className="h-8" />,
    href: "https://company1.com"
  },
  {
    id: "company-2", 
    content: <img src="/logos/company2.png" alt="Company 2" className="h-8" />,
    href: "https://company2.com"
  }
];

<SlidingLogoMarquee
  items={partnerLogos}
  height="120px"
  speed={60}
  enableBlur={true}
  blurIntensity={2}
  pauseOnHover={true}
  onItemClick={(item) => {
    console.log(\`Clicked: \${item.id}\`);
    // Analytics tracking or other actions
  }}
/>`,
      },
      {
        title: "SVG Icon Marquee",
        description: "Marquee featuring SVG icons with custom styling",
        code: `import { SlidingLogoMarquee, SlidingLogoMarqueeItem } from "@/components/lightswind/sliding-logo-marquee";

const techIcons: SlidingLogoMarqueeItem[] = [
  {
    id: "react",
    content: (
      <svg viewBox="0 0 24 24" className="w-8 h-8 text-primarylw fill-current">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    )
  },
  // Add more icons...
];

<SlidingLogoMarquee
  items={techIcons}
  height="100px"
  speed={40}
  enableBlur={false}
  backgroundColor="hsl(220 39% 11%)"
  gap="2rem"
/>`,
      },
      {
        title: "Premium Marquee with Grid Background",
        description:
          "Professional marquee with grid pattern and advanced effects",
        code: `import { SlidingLogoMarquee, SlidingLogoMarqueeItem } from "@/components/lightswind/sliding-logo-marquee";

const premiumLogos: SlidingLogoMarqueeItem[] = [
  // Your logo items...
];

<SlidingLogoMarquee
  items={premiumLogos}
  height="140px"
  speed={100}
  enableBlur={true}
  blurIntensity={3}
  showGridBackground={true}
  backgroundColor="hsl(240 10% 5%)"
  scale={0.9}
  animationSteps={12}
  className="premium-marquee"
/>`,
      },
    ],
    accessibility: ` [
      "Supports keyboard navigation for interactive elements",
      "Provides proper ARIA labels for play/pause controls",
      "Respects prefers-reduced-motion for animation preferences",
      "Includes semantic HTML structure with proper roles",
      "Maintains focus indicators for clickable items",
      "Supports screen reader navigation",
      "Provides alternative text for logo images",
      "Includes proper color contrast for text elements",
    ],
    best_practices: [
      "Use high-contrast logos for better visibility",
      "Keep logo content concise and recognizable",
      "Test animation speed across different devices",
      "Ensure logos are properly sized and aspect-ratio compliant",
      "Provide fallback content for failed image loads",
      "Consider performance impact with many high-resolution images",
      "Use consistent sizing for all logo items",
      "Test hover and click interactions on touch devices",
      "Implement proper loading states for external images",
      "Consider using WebP format for better performance",
    ],
    troubleshooting: [
      {
        issue: "Animation appears choppy or laggy",
        solution:
          "Reduce the number of items, optimize image sizes, or increase the speed value. Consider using CSS transform3d for hardware acceleration.",
      },
      {
        issue: "Blur effects not rendering correctly",
        solution:
          "Check browser support for backdrop-filter. Ensure enableBlur is set to true and adjust blurIntensity. Some browsers may require vendor prefixes.",
      },
      {
        issue: "Items not clickable or hover states not working",
        solution:
          "Verify that pointer-events are properly set on interactive elements. Check for overlapping elements or z-index issues.",
      },
      {
        issue: "Logos appearing distorted or incorrectly sized",
        solution:
          "Ensure all logo items have consistent dimensions. Use CSS object-fit properties for images and set proper aspect ratios.",
      },
      {
        issue: "Animation not starting or pausing unexpectedly",
        solution:
          "Check the autoPlay prop and ensure no JavaScript errors are preventing the component from mounting. Verify that the animation CSS is properly loaded.",
      },
      {
        issue: "Performance issues with many logos",
        solution:
          "Implement virtual scrolling for large datasets, optimize image formats and sizes, or reduce the complexity of logo content.",
      },
      {
        issue: "Grid background not showing",
        solution:
          "Ensure showGridBackground is set to true and check that the background styles are not being overridden by parent container styles.",
      },
      {
        issue: "Responsive behavior not working as expected",
        solution:
          "Check parent container constraints and ensure the marquee has proper width settings. Test across different viewport sizes and adjust scale property if needed.",
      },
    ],`,
  },

  [formatName("scroll-reveal")]: {
    description:
      "Advanced scroll-triggered text animation component with rotation, blur effects, and word-by-word stagger animations. Built with Framer Motion for smooth performance and customizable spring physics.",
    import: `import { ScrollReveal } from "@/components/lightswind/scroll-reveal"`,
    usage: `import { ScrollReveal } from "@/components/lightswind/scroll-reveal";

// Basic Usage
<ScrollReveal>
  Transform your user experience with beautiful scroll-triggered animations
</ScrollReveal>

// Custom Size and Alignment
<ScrollReveal 
  size="xl" 
  align="center"
  variant="primary"
>
  Large centered heading with primary color
</ScrollReveal>

// Advanced Animation Settings
<ScrollReveal
  enableBlur={true}
  baseOpacity={0.05}
  baseRotation={5}
  blurStrength={6}
  staggerDelay={0.1}
  springConfig={{
    damping: 15,
    stiffness: 200,
    mass: 0.5,
  }}
>
  Custom animation with heavy effects
</ScrollReveal>

// Responsive Design
<ScrollReveal 
  size="lg"
  className="max-w-4xl mx-auto"
  textClassName="tracking-tight"
>
  Responsive text with custom styling
</ScrollReveal>`,
    props: [
      {
        name: "children",
        type: "React.ReactNode",
        required: true,
        description: "Text content to animate",
        default: "-",
      },
      {
        name: "size",
        type: '"sm" | "md" | "lg" | "xl" | "2xl"',
        required: false,
        description: "Text size variant with responsive scaling",
        default: '"lg"',
      },
      {
        name: "align",
        type: '"left" | "center" | "right"',
        required: false,
        description: "Text alignment",
        default: '"left"',
      },
      {
        name: "variant",
        type: '"default" | "muted" | "accent" | "primary"',
        required: false,
        description: "Color variant",
        default: '"default"',
      },
      {
        name: "enableBlur",
        type: "boolean",
        required: false,
        description: "Enable blur animation effect",
        default: "true",
      },
      {
        name: "baseOpacity",
        type: "number",
        required: false,
        description: "Base opacity when text is out of view (0-1)",
        default: "0.1",
      },
      {
        name: "baseRotation",
        type: "number",
        required: false,
        description: "Base rotation angle in degrees",
        default: "3",
      },
      {
        name: "blurStrength",
        type: "number",
        required: false,
        description: "Blur strength in pixels",
        default: "4",
      },
      {
        name: "staggerDelay",
        type: "number",
        required: false,
        description: "Animation delay between words in seconds",
        default: "0.05",
      },
      {
        name: "threshold",
        type: "number",
        required: false,
        description: "Viewport threshold for triggering animation (0-1)",
        default: "0.5",
      },
      {
        name: "duration",
        type: "number",
        required: false,
        description: "Animation duration in seconds",
        default: "0.8",
      },
      {
        name: "springConfig",
        type: "{ damping?: number; stiffness?: number; mass?: number }",
        required: false,
        description: "Spring animation configuration",
        default: "{ damping: 25, stiffness: 100, mass: 1 }",
      },
      {
        name: "containerClassName",
        type: "string",
        required: false,
        description: "Custom container className",
        default: '""',
      },
      {
        name: "textClassName",
        type: "string",
        required: false,
        description: "Custom text className",
        default: '""',
      },
    ],
    examples: [
      {
        title: "Basic Scroll Reveal",
        description: "Simple text animation triggered by scroll",
        code: `import { ScrollReveal } from "@/components/lightswind/scroll-reveal";

<ScrollReveal>
  Transform your user experience with beautiful scroll-triggered animations
</ScrollReveal>`,
      },
      {
        title: "Custom Animation Settings",
        description: "Scroll reveal with heavy blur and rotation effects",
        code: `import { ScrollReveal } from "@/components/lightswind/scroll-reveal";

<ScrollReveal
  enableBlur={true}
  baseOpacity={0.05}
  baseRotation={5}
  blurStrength={6}
  staggerDelay={0.1}
  springConfig={{
    damping: 15,
    stiffness: 200,
    mass: 0.5,
  }}
>
  Custom animation with heavy effects
</ScrollReveal>`,
      },
    ],
    accessibility: ` [
      "Respects prefers-reduced-motion for users with motion sensitivity",
      "Uses semantic HTML structure for screen readers",
      "Maintains proper reading order and focus flow",
      "Provides smooth animations that don't cause seizures",
      "Works with keyboard navigation",
      "Compatible with assistive technologies"
    ],
    best_practices: [
      "Use appropriate animation speed for content length",
      "Test across different scroll speeds and devices",
      "Consider performance impact with many animated elements",
      "Use meaningful text that enhances user experience",
      "Ensure animations don't interfere with content readability",
      "Test with different viewport sizes and orientations"
    ],
    troubleshooting: [
      {
        issue: "Animation not triggering on scroll",
        solution: "Check that the component is properly in the viewport and threshold value is appropriate. Ensure Framer Motion is properly installed."
      },
      {
        issue: "Text appears blurry or distorted",
        solution: "Reduce blurStrength or disable blur effects. Check CSS transforms and ensure GPU acceleration is working properly."
      },
      {
        issue: "Performance issues with multiple components",
        solution: "Reduce the number of animated elements, increase stagger delay, or use simpler spring configurations."
      }
    ]`,
  },

  [formatName("Shiny Text")]: {
    description:
      "Eye-catching text animation component with customizable shine effects, multiple directions, and smooth transitions. Perfect for headings, CTAs, and brand elements that need to stand out.",
    import: `import { ShinyText } from "@/components/lightswind/shiny-text"`,
    usage: `import { ShinyText } from "@/components/lightswind/shiny-text";

// Basic Usage
<ShinyText>Shiny animated text</ShinyText>

// Custom Size and Weight
<ShinyText size="2xl" weight="bold">
  Large Bold Heading
</ShinyText>

// Custom Colors
<ShinyText
  baseColor="rgba(59, 130, 246, 0.4)"
  shineColor="rgba(147, 51, 234, 0.9)"
  speed={2}
>
  Blue to Purple Gradient
</ShinyText>

// Animation Direction
<ShinyText 
  direction="right-to-left" 
  speed={1.5}
>
  Right to left animation
</ShinyText>

// Advanced Configuration
<ShinyText
  size="xl"
  weight="semibold"
  speed={3}
  intensity={0.9}
  shineWidth={30}
  pauseOnHover={true}
  repeat={5}
  gradientType="radial"
>
  Fully customized shiny text
</ShinyText>

// Disabled State
<ShinyText disabled>
  No animation when disabled
</ShinyText>`,
    props: [
      {
        name: "children",
        type: "React.ReactNode",
        required: true,
        description: "Text content to display",
        default: "-",
      },
      {
        name: "size",
        type: '"xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl"',
        required: false,
        description: "Text size variant",
        default: '"base"',
      },
      {
        name: "weight",
        type: '"normal" | "medium" | "semibold" | "bold" | "extrabold"',
        required: false,
        description: "Font weight",
        default: '"medium"',
      },
      {
        name: "disabled",
        type: "boolean",
        required: false,
        description: "Disable the shiny animation",
        default: "false",
      },
      {
        name: "speed",
        type: "number",
        required: false,
        description: "Animation speed in seconds",
        default: "3",
      },
      {
        name: "baseColor",
        type: "string",
        required: false,
        description: "Base text color (CSS color value)",
        default: '"rgba(255, 255, 255, 0.4)"',
      },
      {
        name: "shineColor",
        type: "string",
        required: false,
        description: "Shine effect color (CSS color value)",
        default: '"rgba(255, 255, 255, 0.9)"',
      },
      {
        name: "intensity",
        type: "number",
        required: false,
        description: "Shine effect intensity (0-1)",
        default: "0.8",
      },
      {
        name: "direction",
        type: '"left-to-right" | "right-to-left" | "top-to-bottom" | "bottom-to-top"',
        required: false,
        description: "Animation direction",
        default: '"left-to-right"',
      },
      {
        name: "shineWidth",
        type: "number",
        required: false,
        description: "Shine effect width percentage",
        default: "20",
      },
      {
        name: "delay",
        type: "number",
        required: false,
        description: "Delay before animation starts in seconds",
        default: "0",
      },
      {
        name: "repeat",
        type: 'number | "infinite"',
        required: false,
        description: "Animation repeat behavior",
        default: '"infinite"',
      },
      {
        name: "pauseOnHover",
        type: "boolean",
        required: false,
        description: "Pause animation on hover",
        default: "false",
      },
      {
        name: "gradientType",
        type: '"linear" | "radial"',
        required: false,
        description: "Gradient type for shine effect",
        default: '"linear"',
      },
      {
        name: "className",
        type: "string",
        required: false,
        description: "Custom className",
        default: '""',
      },
    ],
    examples: [
      {
        title: "Basic Shiny Text",
        description: "Simple shiny text animation",
        code: `import { ShinyText } from "@/components/lightswind/shiny-text";

<ShinyText size="2xl" weight="bold">
  Shiny animated text
</ShinyText>`,
      },
      {
        title: "Custom Colors and Direction",
        description: "Shiny text with custom colors and animation direction",
        code: `import { ShinyText } from "@/components/lightswind/shiny-text";

<ShinyText
  baseColor="rgba(59, 130, 246, 0.4)"
  shineColor="rgba(147, 51, 234, 0.9)"
  direction="right-to-left"
  speed={2}
>
  Blue to Purple Gradient
</ShinyText>`,
      },
      {
        title: "Interactive Shiny Text",
        description: "Shiny text with hover pause and custom repeat",
        code: `import { ShinyText } from "@/components/lightswind/shiny-text";

<ShinyText
  size="xl"
  weight="semibold"
  pauseOnHover={true}
  repeat={5}
  gradientType="radial"
>
  Hover to pause animation
</ShinyText>`,
      },
    ],
    accessibility: ` [
      "Respects prefers-reduced-motion settings",
      "Maintains readability and text contrast",
      "Doesn't interfere with text selection",
      "Works with screen readers and assistive technologies",
      "Provides option to disable animations",
      "Maintains semantic text structure"
    ],
    best_practices: [
      "Use sparingly to avoid overwhelming users",
      "Ensure text remains readable during animation",
      "Test with different background colors",
      "Consider performance impact on lower-end devices",
      "Use appropriate animation speed for context",
      "Provide fallback for browsers without animation support"
    ],
    troubleshooting: [
      {
        issue: "Shine effect not visible",
        solution: "Check background color contrast and adjust baseColor/shineColor. Ensure intensity is set appropriately."
      },
      {
        issue: "Animation appears choppy",
        solution: "Reduce animation speed or simplify gradient complexity. Check browser hardware acceleration settings."
      },
      {
        issue: "Text becomes unreadable",
        solution: "Adjust baseColor for better contrast or reduce intensity. Consider using simpler gradient effects."
      }
    ]`,
  },

  [formatName("3d Image Ring")]: {
    description:
      "A stunning 3D image carousel arranged in a circular ring that users can drag to rotate. Features smooth GSAP animations, parallax effects, and responsive touch controls.",
    import: `import { ThreeDImageRing } from "@/components/lightswind/draggable-3d-image-ring";`,
    usage: `
      const imageUrls = [
    "https://images.pexels.com/photos/1704120/pexels-photo-1704120.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/912110/pexels-photo-912110.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/114979/pexels-photo-114979.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/145939/pexels-photo-145939.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/698808/pexels-photo-698808.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/2449540/pexels-photo-2449540.jpeg?auto=compress&cs=tinysrgb&w=1200",
  ];
    <ThreeDImageRing images={imageUrls} />`,
    props: [
      {
        name: "images",
        type: "string[]",
        required: true,
        description: "Array of image URLs to display in the ring",
      },
      {
        name: "width",
        type: "number",
        required: false,
        description: "Container width in pixels",
        default: "300",
      },
      {
        name: "height",
        type: "number",
        required: false,
        description: "Container height in pixels",
        default: "400",
      },
      {
        name: "perspective",
        type: "number",
        required: false,
        description: "3D perspective value",
        default: "2000",
      },
      {
        name: "imageDistance",
        type: "number",
        required: false,
        description: "Distance of images from center (z-depth)",
        default: "500",
      },
      {
        name: "initialRotation",
        type: "number",
        required: false,
        description: "Initial rotation of the ring",
        default: "180",
      },
      {
        name: "animationDuration",
        type: "number",
        required: false,
        description: "Animation duration for entrance",
        default: "1.5",
      },
      {
        name: "staggerDelay",
        type: "number",
        required: false,
        description: "Stagger delay between images",
        default: "0.1",
      },
      {
        name: "hoverOpacity",
        type: "number",
        required: false,
        description: "Opacity for non-hovered images",
        default: "0.5",
      },
      {
        name: "containerClassName",
        type: "string",
        required: false,
        description: "Custom container className",
      },
      {
        name: "ringClassName",
        type: "string",
        required: false,
        description: "Custom ring className",
      },
      {
        name: "imageClassName",
        type: "string",
        required: false,
        description: "Custom image className",
      },
      {
        name: "backgroundColor",
        type: "string",
        required: false,
        description: "Background color of the stage",
        default: "#000",
      },
      {
        name: "draggable",
        type: "boolean",
        required: false,
        description: "Enable/disable drag functionality",
        default: "true",
      },
      {
        name: "ease",
        type: "string",
        required: false,
        description: "Animation ease for entrance",
        default: "expo",
      },
    ],
    examples: [
      {
        title: "Basic Usage",
        description: "Simple 3D image ring with default settings",
        code: `const images = [
  "https://picsum.photos/600/400?random=1",
  "https://picsum.photos/600/400?random=2",
  "https://picsum.photos/600/400?random=3",
  // ... more images
];

<ThreeDImageRing images={images} />`,
      },
      {
        title: "Customized Ring",
        description: "Custom styling and behavior",
        code: `<ThreeDImageRing
  images={images}
  width={350}
  height={450}
  perspective={2500}
  imageDistance={600}
  backgroundColor="transparent"
  hoverOpacity={0.3}
  animationDuration={2}
  staggerDelay={0.15}
/>`,
      },
      {
        title: "Non-draggable Display",
        description: "Static ring for display purposes",
        code: `<ThreeDImageRing
  images={images}
  draggable={false}
  backgroundColor="#111"
  hoverOpacity={0.2}
/>`,
      },
    ],
    accessibility: ` [
        "Supports both mouse and touch interactions",
        "Keyboard navigation can be added via custom event handlers",
        "Images should include proper alt text when implemented",
        "Respects user motion preferences",
      ],
      best_practices: [
        "Use high-quality images with consistent aspect ratios",
        "Optimize images for web to ensure smooth performance",
        "Consider mobile users with touch-friendly interactions",
        "Test on different devices for optimal experience",
        "Use appropriate number of images (6-12 works well)",
      ],
      troubleshooting: [
        {
          issue: "Images not loading",
          solution:
            "Verify image URLs are accessible and support CORS if needed",
        },
        {
          issue: "Stuttering during drag",
          solution: "Reduce number of images or optimize image sizes",
        },
        {
          issue: "Touch events not working on mobile",
          solution:
            "Ensure proper viewport meta tag and touch-action CSS properties",
        },
        {
          issue: "Ring appears flat",
          solution:
            "Increase perspective value or imageDistance for more pronounced 3D effect",
        },
      ],`,
  },

  [formatName("Magic Loader")]: {
    description:
      "A mesmerizing particle-based loader with spinning effects and customizable colors. Perfect for loading states and adding visual appeal with smooth canvas animations.",
    import: `import MagicLoader from "@/components/lightswind/magic-loader"`,
    usage: `import MagicLoader from "@/components/lightswind/magic-loader";

// Basic Usage
<MagicLoader />

// Custom Size and Speed
<MagicLoader 
  size={300} 
  speed={1.5} 
/>

// Fire Theme
<MagicLoader 
  size={250}
  particleCount={2}
  speed={1.2}
  hueRange={[0, 40]}
/>

// Ocean Theme
<MagicLoader
  size={200}
  speed={0.8}
  hueRange={[180, 220]}
/>

// Mobile Optimized
<MagicLoader
  size={150}
  particleCount={1}
  speed={0.7}
  className="md:hidden"
/>`,
    props: [
      {
        name: "size",
        type: "number",
        required: false,
        description: "Size of the loader in pixels. Automatically responsive.",
        default: "200",
      },
      {
        name: "particleCount",
        type: "number",
        required: false,
        description:
          "Number of particles generated per frame. Higher values create denser effects.",
        default: "1",
      },
      {
        name: "speed",
        type: "number",
        required: false,
        description:
          "Animation speed multiplier. Values above 1 increase speed, below 1 decrease it.",
        default: "1",
      },
      {
        name: "hueRange",
        type: "[number, number]",
        required: false,
        description:
          "HSL hue range for particle colors as [start, end] in degrees (0-360).",
        default: "[0, 360]",
      },
      {
        name: "className",
        type: "string",
        required: false,
        description: "Additional CSS classes for the loader container.",
        default: "undefined",
      },
    ],
    examples: [
      {
        title: "Basic Loader",
        description: "Simple rainbow loader with default settings",
        code: `<MagicLoader />`,
      },
      {
        title: "Custom Size and Speed",
        description: "Larger loader with faster animation",
        code: `<MagicLoader 
  size={300} 
  speed={1.5} 
/>`,
      },
      {
        title: "Fire Theme",
        description: "Red-orange themed loader for dramatic effect",
        code: `<MagicLoader 
  size={250}
  particleCount={2}
  speed={1.2}
  hueRange={[0, 40]}
/>`,
      },
      {
        title: "Ocean Theme",
        description: "Cool blue-cyan themed loader",
        code: `<MagicLoader
  size={200}
  speed={0.8}
  hueRange={[180, 220]}
/>`,
      },
      {
        title: "Mobile Optimized",
        description: "Smaller, performance-optimized version for mobile",
        code: `<MagicLoader
  size={150}
  particleCount={1}
  speed={0.7}
  className="md:hidden"
/>`,
      },
    ],
    accessibility: ` [
      "Canvas-based animation may not be accessible to screen readers",
      "Consider providing alternative text or skip animation option",
      "Respects user's motion preferences when available",
      "High contrast colors for better visibility"
    ],
    best_practices: [
      "Use appropriate sizes for different screen sizes (150px mobile, 200px tablet, 250px+ desktop)",
      "Reduce particle count and speed on mobile devices for better performance",
      "Consider user's battery level and device performance",
      "Provide option to disable animations for accessibility",
      "Use semantic color themes that match your application design",
      "Hide loader when content is ready to prevent indefinite animation"
    ],
    troubleshooting: [
      {
        issue: "Animation appears choppy or slow",
        solution: "Reduce particleCount or lower the speed. Check if device has limited performance capabilities."
      },
      {
        issue: "Loader not visible on dark backgrounds",
        solution: "Adjust hueRange to use brighter colors or add a contrasting background to the container."
      },
      {
        issue: "High battery usage on mobile",
        solution: "Use smaller sizes, reduce particleCount to 1, and lower speed to 0.7 or below for mobile devices."
      },
      {
        issue: "Canvas appears blurry on high-DPI displays",
        solution: "The component automatically handles devicePixelRatio. Ensure container has proper sizing."
      },
      {
        issue: "Animation doesn't start",
        solution: "Check that the canvas is visible and has proper dimensions. Verify no CSS is interfering with the canvas."
      }
    ]`,
  },

  [formatName("3D Carousel")]: {
    description:
      "An immersive 3D carousel component with flippable cards arranged in a circular layout. Features drag navigation, keyboard controls, auto-rotation, and smooth animations with full theme support.",
    import: `import ThreeDCarousel, { ThreeDCarouselItem } from "@/components/ThreeDCarousel";`,
    usage: `const items: ThreeDCarouselItem[] = [
  {
    id: 1,
    title: "6th SENSE Safety System",
    brand: "FireCat Group",
    description: "AI-driven smart uniform tech for law enforcement, military & firefighters.",
    tags: ["Safety", "Military", "AI Sensors", "Monitoring"],
    imageUrl: "/img/firecat.jpg",
    link: "/projects/firecat"
  }
];

<ThreeDCarousel 
  items={items}
  autoRotate={true}
  rotateInterval={4000}
  cardHeight={500}
/>`,
    props: [
      {
        name: "items",
        type: "ThreeDCarouselItem[]",
        required: true,
        description: "An array of card items to display in the carousel",
      },
      {
        name: "autoRotate",
        type: "boolean",
        required: false,
        default: "true",
        description: "Whether the carousel should auto-rotate",
      },
      {
        name: "rotateInterval",
        type: "number",
        required: false,
        default: "4000",
        description: "Interval (in milliseconds) between auto-rotations",
      },
      {
        name: "cardHeight",
        type: "number",
        required: false,
        default: "500",
        description: "Height of each carousel card in pixels",
      },
      {
        name: "title",
        type: "string",
        required: false,
        description: "Optional section title",
      },
      {
        name: "subtitle",
        type: "string",
        required: false,
        description: "Optional subtitle text for the section",
      },
      {
        name: "tagline",
        type: "string",
        required: false,
        description: "Optional tagline or description below the title",
      },
      {
        name: "isMobileSwipe",
        type: "boolean",
        required: false,
        default: "true",
        description: "Enable swipe navigation on mobile",
      },
    ],
    examples: [
      {
        title: "Default Carousel",
        description: "Basic setup with auto-rotation enabled.",
        code: `<ThreeDCarousel items={items} />`,
      },
      {
        title: "Carousel with Manual Rotation",
        description: "Auto-rotation disabled with manual navigation.",
        code: `<ThreeDCarousel items={items} autoRotate={false} />`,
      },
      {
        title: "Custom Card Height and Interval",
        description: "Set a custom card height and slower auto-rotate timing.",
        code: `<ThreeDCarousel items={items} cardHeight={600} rotateInterval={8000} />`,
      },
      {
        title: "Mobile Swipe Carousel",
        description: "Mobile-friendly swipe enabled with smaller layout.",
        code: `<ThreeDCarousel items={items} isMobileSwipe={true} cardHeight={400} />`,
      },
    ],
    accessibility: `[
       "Keyboard accessible navigation buttons (prev/next)",
    "Responsive swipe support for mobile",
    "Uses semantic headings and ARIA labels where applicable",
    "Focus is preserved when using keyboard to rotate",
    "Alt-like semantics via text content for image-based headers",
  ],
  best_practices: [
    "Use consistent card heights for layout stability",
    "Keep tag text short and scannable",
    "Limit the number of tags per card for readability",
    "Add meaningful links with descriptive CTA",
    "Avoid setting extremely fast auto-rotate intervals",
    "Use high-resolution images for background covers",
    "Add tracking or logging to measure which cards users interact with most",
  ],
  troubleshooting: [
    {
      issue: "Carousel not rotating automatically",
      solution:
        "Ensure "autoRotate" is set to "true" and the component is in viewport (20% visible). Hovering also pauses rotation.",
    },
    {
      issue: "Cards not swiping on mobile",
      solution:
        "Ensure "isMobileSwipe" is "true and that the component isn’t being blocked by another overlaying element.",
    },
    {
      issue: "Next/Prev buttons not showing",
      solution:
        "They are hidden on mobile. Use "isMobileSwipe" for touch navigation or adapt logic to show buttons on mobile too.",
    },
    {
      issue: "Performance drop with many cards",
      solution:
        "Try limiting to 5-10 cards max or lazy load background images using "loading='lazy'" technique.",
    },
    ]`,
  },

  [formatName("Woofy Hover Image")]: {
    description:
      "A sophisticated image hover effect component that reveals different visual effects through an organic marbling mask. Features WebGL-powered shaders, multiple effect types, and smooth animations.",
    import: `import WoofyHoverImage from '@/components/lightswind/woofy-hover-image';`,
    usage: `<WoofyHoverImage
  src="https://example.com/image.jpg"
  alt="Beautiful landscape"
  width="400px"
  height="300px"
  effectType="inversion"
  maskRadius={0.35}
  turbulenceIntensity={0.225}
/>`,
    props: [
      {
        name: "src",
        type: "string",
        required: true,
        description: "Image source URL",
      },
      {
        name: "alt",
        type: "string",
        required: false,
        description: "Alternative text for the image",
        default: '""',
      },
      {
        name: "width",
        type: "number | string",
        required: false,
        description: "Width of the image container",
        default: '"100%"',
      },
      {
        name: "height",
        type: "number | string",
        required: false,
        description: "Height of the image container",
        default: '"400px"',
      },
      {
        name: "maskRadius",
        type: "number",
        required: false,
        description: "Radius of the effect mask (0.1 to 0.6)",
        default: "0.35",
      },
      {
        name: "animationSpeed",
        type: "number",
        required: false,
        description: "Speed of the marbling animation",
        default: "1.0",
      },
      {
        name: "appearDuration",
        type: "number",
        required: false,
        description: "Duration for effect to appear (seconds)",
        default: "0.4",
      },
      {
        name: "disappearDuration",
        type: "number",
        required: false,
        description: "Duration for effect to disappear (seconds)",
        default: "0.3",
      },
      {
        name: "turbulenceIntensity",
        type: "number",
        required: false,
        description: "Intensity of the marbling turbulence (0 to 0.5)",
        default: "0.225",
      },
      {
        name: "effectType",
        type: "'inversion' | 'blackWhite' | 'sepia' | 'duotone' | 'pixelate' | 'blur'",
        required: false,
        description: "Type of visual effect to apply",
        default: "'inversion'",
      },
      {
        name: "effectIntensity",
        type: "number",
        required: false,
        description: "Intensity of the effect (0 to 1)",
        default: "0.5",
      },
      {
        name: "invertMask",
        type: "boolean",
        required: false,
        description: "Whether to invert which area shows the effect",
        default: "false",
      },
      {
        name: "duotoneColor1",
        type: "string",
        required: false,
        description: "First color for duotone effect (hex format)",
        default: '"#3366cc"',
      },
      {
        name: "duotoneColor2",
        type: "string",
        required: false,
        description: "Second color for duotone effect (hex format)",
        default: '"#e63333"',
      },
      {
        name: "className",
        type: "string",
        required: false,
        description: "Additional CSS classes",
      },
      {
        name: "style",
        type: "React.CSSProperties",
        required: false,
        description: "Inline styles for the container",
      },
      {
        name: "onMouseEnter",
        type: "() => void",
        required: false,
        description: "Callback when mouse enters the image",
      },
      {
        name: "onMouseLeave",
        type: "() => void",
        required: false,
        description: "Callback when mouse leaves the image",
      },
      {
        name: "disabled",
        type: "boolean",
        required: false,
        description: "Whether to disable the hover effect",
        default: "false",
      },
    ],
    examples: [
      {
        title: "Basic Inversion Effect",
        description: "Simple color inversion with organic marbling",
        code: `<WoofyHoverImage
  src="/path/to/image.jpg"
  alt="Demo image"
  width="400px"
  height="300px"
/>`,
      },
      {
        title: "Duotone Effect",
        description: "Custom duotone colors with adjusted settings",
        code: `<WoofyHoverImage
  src="/path/to/image.jpg"
  alt="Duotone effect"
  effectType="duotone"
  duotoneColor1="#ff6b6b"
  duotoneColor2="#4ecdc4"
  maskRadius={0.4}
  turbulenceIntensity={0.3}
/>`,
      },
      {
        title: "Pixelate Effect",
        description: "Retro pixelate effect with high intensity",
        code: `<WoofyHoverImage
  src="/path/to/image.jpg"
  alt="Pixelate effect"
  effectType="pixelate"
  effectIntensity={0.8}
  appearDuration={0.6}
  disappearDuration={0.4}
/>`,
      },
      {
        title: "Responsive Gallery",
        description: "Grid of responsive images with different effects",
        code: `<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <WoofyHoverImage
    src="/image1.jpg"
    alt="Image 1"
    height="250px"
    effectType="sepia"
    className="rounded-lg"
  />
  <WoofyHoverImage
    src="/image2.jpg"
    alt="Image 2"
    height="250px"
    effectType="blackWhite"
    className="rounded-lg"
  />
  <WoofyHoverImage
    src="/image3.jpg"
    alt="Image 3"
    height="250px"
    effectType="blur"
    effectIntensity={0.6}
    className="rounded-lg"
  />
</div>`,
      },
    ],
    accessibility: ` [
      "Always provide meaningful alt text for images",
      "Ensure sufficient contrast between original and effect states",
      "Consider users with motion sensitivity - provide reduced motion options",
      "Test with screen readers to ensure content is accessible",
      "Provide keyboard navigation alternatives if needed",
      "Use semantic HTML structure around the component"
    ],
    best_practices: [
      "Use high-quality images for best visual results",
      "Test effects with different image types (portraits, landscapes, graphics)",
      "Consider loading states for large images",
      "Optimize image sizes for web performance",
      "Use appropriate effect types that complement your content",
      "Test on different devices and screen sizes",
      "Consider the overall design context when choosing effects",
      "Implement proper error handling for failed image loads"
    ],
    troubleshooting: [
      {
        issue: "Effect not appearing on hover",
        solution: "Check that Three.js and GSAP are properly loaded. Verify the image src is accessible and CORS-enabled if loading from external domains."
      },
      {
        issue: "Performance issues on mobile",
        solution: "Reduce turbulenceIntensity and consider disabling the effect on low-end devices. Use smaller image sizes and lower quality settings."
      },
      {
        issue: "Image not loading or showing",
        solution: "Verify the image URL is correct and accessible. Check browser console for CORS errors. Ensure the image format is supported."
      },
      {
        issue: "Effect appears too strong or weak",
        solution: "Adjust effectIntensity prop. For duotone effects, ensure color contrast is appropriate. Consider adjusting maskRadius for better visibility."
      },
      {
        issue: "Marbling effect looks choppy",
        solution: "Increase animationSpeed or reduce turbulenceIntensity. Check if the device supports WebGL properly."
      },
      {
        issue: "Canvas not rendering",
        solution: "Ensure WebGL is supported in the browser. Check console for WebGL context errors. Provide fallback for unsupported browsers."
      }
    ]`,
  },

  [formatName("Animated Notification")]: {
    description:
      "A professional animated notification center with smooth transitions, blur effects, and customizable styling. Displays notifications one-by-one with beautiful entrance and exit animations.",
    import: `import AnimatedNotification from '@/components/lightswind/animated-notification';`,
    usage: `<AnimatedNotification
  autoGenerate={true}
  maxNotifications={3}
  variant="glass"
  position="top-right"
  showAvatars={true}
  allowDismiss={true}
  customMessages={["Welcome!", "Task completed!"]}
  onNotificationClick={(notification) => console.log(notification)}
/>`,
    props: [
      {
        name: "maxNotifications",
        type: "number",
        required: false,
        description: "Maximum number of notifications to show at once",
        default: "3",
      },
      {
        name: "autoInterval",
        type: "number",
        required: false,
        description: "Interval between auto-generated notifications (in ms)",
        default: "4000",
      },
      {
        name: "autoGenerate",
        type: "boolean",
        required: false,
        description: "Enable auto-generation of notifications",
        default: "true",
      },
      {
        name: "notifications",
        type: "NotificationItem[]",
        required: false,
        description: "Custom notification data array",
        default: "[]",
      },
      {
        name: "customMessages",
        type: "string[]",
        required: false,
        description: "Custom messages for auto-generation",
        default: "undefined",
      },
      {
        name: "animationDuration",
        type: "number",
        required: false,
        description: "Animation duration for fade transitions (ms)",
        default: "800",
      },
      {
        name: "position",
        type: "'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'",
        required: false,
        description: "Position of the notification center",
        default: "'center'",
      },
      {
        name: "width",
        type: "number",
        required: false,
        description: "Width of notification cards in pixels",
        default: "320",
      },
      {
        name: "showAvatars",
        type: "boolean",
        required: false,
        description: "Enable/disable user avatars",
        default: "true",
      },
      {
        name: "showTimestamps",
        type: "boolean",
        required: false,
        description: "Enable/disable timestamps",
        default: "true",
      },
      {
        name: "className",
        type: "string",
        required: false,
        description: "Custom CSS class for the container",
        default: "undefined",
      },
      {
        name: "onNotificationClick",
        type: "(notification: NotificationItem) => void",
        required: false,
        description: "Callback when notification is clicked",
        default: "undefined",
      },
      {
        name: "onNotificationDismiss",
        type: "(notification: NotificationItem) => void",
        required: false,
        description: "Callback when notification is dismissed",
        default: "undefined",
      },
      {
        name: "allowDismiss",
        type: "boolean",
        required: false,
        description: "Enable manual dismiss with close button",
        default: "true",
      },
      {
        name: "autoDismissTimeout",
        type: "number",
        required: false,
        description: "Auto dismiss timeout in ms (0 to disable)",
        default: "0",
      },
      {
        name: "userApiEndpoint",
        type: "string",
        required: false,
        description: "Custom API endpoint for fetching user data",
        default: "'https://randomuser.me/api/'",
      },
      {
        name: "variant",
        type: "'default' | 'minimal' | 'glass' | 'bordered'",
        required: false,
        description: "Visual theme variant",
        default: "'glass'",
      },
    ],
    examples: [
      {
        title: "Basic Usage",
        description: "Simple notification center with auto-generation",
        code: `<AnimatedNotification
  autoGenerate={true}
  maxNotifications={3}
  variant="glass"
  position="top-right"
/>`,
      },
      {
        title: "Custom Notifications",
        description: "Static notifications with custom data",
        code: `const notifications = [
  {
    id: "1",
    user: { name: "John Doe", color: "hsl(200, 70%, 80%)" },
    message: "Task completed successfully!",
    timestamp: new Date().toLocaleTimeString(),
    priority: "high"
  }
];

<AnimatedNotification
  autoGenerate={false}
  notifications={notifications}
  variant="bordered"
  allowDismiss={true}
/>`,
      },
      {
        title: "Event Handlers",
        description: "Handle notification clicks and dismissals",
        code: `<AnimatedNotification
  onNotificationClick={(notification) => {
    console.log('Clicked:', notification.message);
  }}
  onNotificationDismiss={(notification) => {
    console.log('Dismissed:', notification.id);
  }}
  customMessages={[
    "Welcome to our app!",
    "New message received",
    "System update available"
  ]}
/>`,
      },
      {
        title: "Different Variants",
        description: "Showcase different visual styles",
        code: `// Glass effect with backdrop blur
<AnimatedNotification variant="glass" />

// Minimal clean design
<AnimatedNotification variant="minimal" />

// Bordered with priority colors
<AnimatedNotification variant="bordered" />

// Default solid background
<AnimatedNotification variant="default" />`,
      },
    ],
    accessibility: ` [
      "Notifications include proper ARIA labels and roles",
      "Close buttons are keyboard accessible",
      "Color priority indicators include border styling for visibility",
      "Animations respect user preferences for reduced motion",
      "Screen reader compatible with proper semantic structure"
    ],
    best_practices: [
      "Use appropriate priority levels to help users identify urgent notifications",
      "Keep notification messages concise and actionable",
      "Position notifications where they won't interfere with main content",
      "Provide clear dismiss options for non-critical notifications",
      "Use custom messages relevant to your application context",
      "Consider auto-dismiss timeouts for temporary notifications",
      "Test with different screen sizes and orientations",
      "Implement proper error handling for API failures"
    ],
    troubleshooting: [
      {
        issue: "Notifications not appearing one-by-one",
        solution: "Ensure autoInterval is set to a reasonable value (minimum 2000ms) and maxNotifications is properly configured."
      },
      {
        issue: "Blur animations not working",
        solution: "Check if your browser supports backdrop-filter CSS property. Consider fallback styles for older browsers."
      },
      {
        issue: "Close button not visible",
        solution: "Verify allowDismiss is set to true and the button appears on hover. Check if CSS hover states are working properly."
      },
      {
        issue: "API requests failing",
        solution: "Check network connectivity and API endpoint availability. The component includes fallback data when API fails."
      },
      {
        issue: "Notifications overlapping content",
        solution: "Adjust the position prop or add appropriate z-index styling. Use fixed positioning variants for overlay notifications."
      },
      {
        issue: "Performance issues with many notifications",
        solution: "Reduce maxNotifications count and ensure proper cleanup of timeout references. Consider virtualization for high-volume scenarios."
      }
    ]`,
  },

  [formatName("Animated Wave")]: {
    description:
      "A professional 3D animated wave background component using Three.js with automatic background color detection, multiple quality settings, and customizable visual effects.",
    import: `import AnimatedWave from '@/components/lightswind/AnimatedWave';`,
    usage: `<div className="relative h-64 bg-gray-900 rounded-lg overflow-hidden">
  <AnimatedWave className="!relative !z-0" />
</div>`,
    props: [
      {
        name: "className",
        type: "string",
        default: "undefined",
        required: false,

        description: "Custom CSS class name for additional styling.",
      },
      {
        name: "speed",
        type: "number",
        default: "0.015",
        required: false,

        description:
          "Wave animation speed. Higher values create faster wave movement.",
      },
      {
        name: "amplitude",
        type: "number",
        default: "30",
        required: false,

        description:
          "Wave height/scale. Controls how tall the wave peaks and valleys are.",
      },
      {
        name: "smoothness",
        type: "number",
        default: "300",
        required: false,

        description:
          "Wave smoothness factor. Higher values create smoother, more gradual waves.",
      },
      {
        name: "wireframe",
        type: "boolean",
        default: "true",
        required: false,

        description:
          "Enable wireframe mode to show the wave structure as lines instead of solid surface.",
      },
      {
        name: "waveColor",
        type: "string",
        default: "undefined",
        required: false,

        description:
          "Wave color as CSS color string. Overrides auto-detected background color.",
      },
      {
        name: "opacity",
        type: "number",
        default: "1",
        required: false,

        description:
          "Wave opacity (0-1). Values less than 1 enable transparency.",
      },
      {
        name: "mouseInteraction",
        type: "boolean",
        default: "true",
        required: false,

        description:
          "Enable mouse interaction effects including wave following and distortion.",
      },
      {
        name: "quality",
        type: "'low' | 'medium' | 'high'",
        default: "'medium'",
        required: false,

        description:
          "Render quality setting. Higher quality provides more detail but may impact performance.",
      },
      {
        name: "fov",
        type: "number",
        default: "60",
        required: false,

        description:
          "Camera field of view in degrees. Higher values create a wider viewing angle.",
      },
      {
        name: "waveOffsetY",
        type: "number",
        default: "-300",
        required: false,

        description:
          "Wave position Y offset. Controls vertical positioning of the wave plane.",
      },
      {
        name: "waveRotation",
        type: "number",
        default: "29.8",
        required: false,

        description:
          "Wave rotation in degrees. Controls the tilt angle of the wave plane.",
      },
      {
        name: "cameraDistance",
        type: "number",
        default: "-1000",
        required: false,

        description:
          "Camera position Z offset. Controls how far the wave appears from the viewer.",
      },
      {
        name: "autoDetectBackground",
        type: "boolean",
        default: "true",
        required: false,

        description:
          "Automatically detect and match the background color of parent elements.",
      },
      {
        name: "backgroundColor",
        type: "string",
        default: "undefined",
        required: false,

        description:
          "Manual background color override. Used when autoDetectBackground is disabled.",
      },
      {
        name: "ease",
        type: "number",
        default: "12",
        required: false,

        description:
          "Wave movement easing factor. Higher values create slower, smoother transitions.",
      },
      {
        name: "mouseDistortionStrength",
        type: "number",
        default: "0.5",
        required: false,

        description: "Strength of mouse-induced wave distortion effects.",
      },
      {
        name: "mouseDistortionSmoothness",
        type: "number",
        default: "100",
        required: false,

        description:
          "Smoothness of mouse distortion ripples. Higher values create wider, smoother effects.",
      },
      {
        name: "mouseDistortionDecay",
        type: "number",
        default: "0.0005",
        required: false,

        description:
          "Time factor for mouse distortion decay. Controls how quickly distortion effects fade.",
      },
      {
        name: "mouseShrinkScaleStrength",
        type: "number",
        default: "0.7",
        required: false,

        description:
          "Strength of the mouse-induced shrinking/scaling effect on wave vertices.",
      },
      {
        name: "mouseShrinkScaleRadius",
        type: "number",
        default: "200",
        required: false,
        description: "Radius of influence for mouse shrinking/scaling effects.",
      },
    ],
    examples: [
      {
        title: "Basic Wave",
        description: "Simple animated wave background",
        code: `<AnimatedWave />`,
      },
    ],
    accessibility: ` ["GPU accelerated", "Responsive design"],
    best_practices: ["Use quality='low' for mobile", "Test performance"],
    troubleshooting: [
      {
        issue: "Performance issues",
        solution: "Reduce quality or disable mouse interaction",
      },
    ],`,
  },

  [formatName("Scroll Stack")]: {
    description:
      "A dynamic scroll-activated component that creates a stacking card effect as users scroll. Cards animate in sequence with smooth transitions, perfect for storytelling, feature showcases, or progressive content reveal.",
    import: `import ScrollStack from '@/components/lightswind/scroll-stack';`,
    usage: `import ScrollStack from '@/components/lightswind/scroll-stack';

// Basic usage with simple cards
const cards = [
  {
    title: "First Card",
    subtitle: "This is the first card in the stack",
    badge: "Step 1"
  },
  {
    title: "Second Card", 
    subtitle: "This card appears as you scroll down",
    backgroundImage: "https://example.com/image.jpg"
  }
];

<ScrollStack cards={cards} />

// Advanced usage with custom content
const customCards = [
  {
    title: "Custom Card",
    content: (
      <div>
        <h2>Custom React Content</h2>
        <button>Interactive Element</button>
      </div>
    )
  }
];

<ScrollStack 
  cards={customCards}
  backgroundColor="#1f2937"
  cardHeight="70vh"
  animationDuration="0.8s"
  sectionHeightMultiplier={4}
/>`,

    props: [
      {
        name: "cards",
        type: "ScrollStackCard[]",
        default: "[]",
        required: true,

        description:
          "Array of card objects (max 5). Each card can have title, subtitle, backgroundImage, badge, and custom content.",
      },
      {
        name: "className",
        type: "string",
        default: "undefined",
        required: false,

        description: "Custom CSS class name for the container.",
      },
      {
        name: "backgroundColor",
        type: "string",
        default: "'white'",
        required: false,

        description: "Background color for the sticky section container.",
      },
      {
        name: "cardHeight",
        type: "string",
        default: "'60vh'",
        required: false,

        description: "Height of each card (CSS value).",
      },
      {
        name: "cardMaxHeight",
        type: "string",
        default: "'600px'",
        required: false,

        description: "Maximum height constraint for cards (CSS value).",
      },
      {
        name: "cardBorderRadius",
        type: "string",
        default: "'20px'",
        required: false,

        description: "Border radius for cards (CSS value).",
      },
      {
        name: "animationDuration",
        type: "string",
        default: "'0.5s'",
        required: false,

        description: "Duration of card animations (CSS time value).",
      },
      {
        name: "sectionHeightMultiplier",
        type: "number",
        default: "3",
        required: false,

        description:
          "Multiplier for section height (e.g., 3 = 300vh). Controls scroll distance.",
      },
      {
        name: "intersectionThreshold",
        type: "number",
        default: "0.1",
        required: false,

        description:
          "Intersection Observer threshold (0-1). When to start detecting the section.",
      },
    ],

    accessibility: ` {
      ariaLabels: ["Cards have semantic structure", "Scroll progress is visually indicated"],
      keyboardSupport: ["Scroll navigation works with keyboard", "Focus management maintained"],
      screenReader: ["Card content is accessible to screen readers", "Proper heading hierarchy"]
    },
    troubleshooting: [
      {
        issue: "Cards not animating on scroll",
        solution: "Ensure the container has enough height and the sectionHeightMultiplier is set appropriately. Check that the Intersection Observer is detecting the section."
      },
      {
        issue: "Cards appearing too early or late",
        solution: "Adjust the intersectionThreshold prop (0-1). Lower values trigger earlier, higher values trigger later."
      },
      {
        issue: "Background images not loading",
        solution: "Verify image URLs are accessible and properly formatted. The component will fall back to default images if custom ones fail."
      },
      {
        issue: "Animation feels too fast or slow",
        solution: "Modify the animationDuration prop for animation speed, or adjust sectionHeightMultiplier to change scroll distance required."
      },
      {
        issue: "Cards overlapping incorrectly",
        solution: "Each card has automatic z-index and transform calculations. If issues persist, check for conflicting CSS that might affect positioning."
      }
    ]`,
  },

  [formatName("Shader Background")]: {
    description:
      "An interactive WebGL shader background featuring a turbulent, glowing wave pattern that responds to mouse movement. It offers an optional backdrop blur for versatile integration into modern UIs.",
    import: `import ShaderBackground from '@/components/lightswind/shader-background';`,
    usage: `import ShaderBackground from '@/components/lightswind/shader-background';

// Basic usage with default blur and purple glow
<ShaderBackground />

// With a larger backdrop blur
<ShaderBackground backdropBlurAmount="xl" />

// With no backdrop blur and a custom green glow
<ShaderBackground backdropBlurAmount="none" color="#00FF00" />

// With a custom class name for additional styling
<ShaderBackground className="border border-primarylw rounded-lg" />

// Combining all props
<ShaderBackground backdropBlurAmount="md" color="#FF00FF" className="shadow-lg" />`,
    props: [
      {
        name: "backdropBlurAmount",
        type: "BlurSize",
        default: '"sm"',
        required: false,
        description:
          'The size of the backdrop blur to apply. Valid values are "none", "sm", "md", "lg", "xl", "2xl", "3xl". Defaults to "sm".',
      },
      {
        name: "color",
        type: "string",
        default: '"#471CE2"',
        required: false,
        description:
          'The color of the shader\'s glow in hexadecimal format (e.g., "#RRGGBB"). Defaults to "#471CE2" (purple).',
      },
      {
        name: "className",
        type: "string",
        default: '""',
        required: false,
        description:
          "Additional CSS classes to apply to the main container div of the shader background. Useful for adding borders, shadows, or other custom styles.",
      },
    ],
    accessibility: `  {
    ariaLabels: ["Background is purely decorative and does not require interactive ARIA labels."],
    keyboardSupport: ["No direct keyboard interaction for the background itself."],
    screenReader: ["The background is visual only and does not convey semantic content to screen readers."]
  },
  troubleshooting:  [
    {
      issue: "Shader background not appearing",
      solution:
        "Ensure WebGL is supported by the browser. Check the console for WebGL errors during shader compilation or program linking. Verify the canvas element has appropriate 'width' and 'height' applied through CSS or HTML attributes.",
    },
    {
      issue: "Mouse interaction not working",
      solution:
        "Confirm that the component is receiving mouse events. Check if 'isHovering' state is correctly toggling and 'mousePosition' is updating. Ensure the 'iMouse' uniform is correctly passed to the shader, remembering that WebGL Y-coordinates are often inverted compared to browser screen coordinates.",
    },
    {
      issue: "Performance issues or low frame rate",
      solution:
        "Complex shaders can be resource-intensive. Ensure 'requestAnimationFrame' is used for rendering. Consider simplifying the shader logic or reducing the number of loop iterations if targeting lower-end devices. Verify no other demanding processes are running simultaneously.",
    },
    {
      issue: "Blur effect not applying",
      solution:
        "Ensure Tailwind CSS is correctly configured to generate 'backdrop-blur-*' classes. Double-check the 'backdropBlurAmount' prop value matches one of the 'BlurSize' options. Inspect the rendered HTML to confirm the correct 'backdrop-blur' class is applied to the overlay div.",
    },
    {
      issue: "Custom color not appearing",
      solution:
        "Ensure the 'color' prop is a valid hexadecimal string (e.g., '#RRGGBB'). Check the browser console for any errors related to uniform setting in WebGL. Verify that the 'u_color' uniform is correctly defined and used in the fragment shader.",
    },
  ],`,
  },

  [formatName("Hell Background")]: {
    description:
      "An immersive WebGL shader background with a hellish glow and turbulence effect that reacts to cursor movement. Ideal for dark, moody UI themes with a dramatic impact. It supports backdrop blur and customizable glow color.",
    import: `import HellBackground from '@/components/lightswind/hell-background';`,
    usage: `import HellBackground from '@/components/lightswind/hell-background';

// Basic usage with default blur and red glow
<HellBackground />

// With a larger backdrop blur
<HellBackground backdropBlurAmount="xl" />

// With no backdrop blur and a custom orange flame glow
<HellBackground backdropBlurAmount="none" color="#FF4500" />

// With a custom class name for additional styling
<HellBackground className="border border-red-700 rounded-xl" />

// Combining all props
<HellBackground backdropBlurAmount="md" color="#FF0000" className="shadow-xl" />`,
    props: [
      {
        name: "backdropBlurAmount",
        type: "BlurSize",
        default: '"sm"',
        required: false,
        description:
          'The backdrop blur intensity. Acceptable values: "none", "sm", "md", "lg", "xl", "2xl", "3xl". Default is "sm".',
      },
      {
        name: "color",
        type: "string",
        default: '"#FF0000"',
        required: false,
        description:
          'Hexadecimal color string defining the hell glow (e.g., "#FF0000"). Default is bright red.',
      },
      {
        name: "className",
        type: "string",
        default: '""',
        required: false,
        description:
          "Optional Tailwind CSS class string for styling the container div (e.g., border, padding, shadow).",
      },
    ],
    accessibility: ` {
    ariaLabels: [
      "The hellish background is for visual effect and requires no ARIA labeling."
    ],
    keyboardSupport: [
      "This component does not support keyboard interaction."
    ],
    screenReader: [
      "The hell background is non-semantic and should be hidden from screen readers."
    ],
  },
  troubleshooting: [
    {
      issue: "Hell background not showing up",
      solution:
        "Ensure WebGL is enabled in the browser. Check browser console for shader errors or WebGL context issues. Make sure the canvas is sized correctly via Tailwind or inline styles.",
    },

    {
      issue: "Custom glow color not visible",
      solution:
        "Ensure you're passing a valid hex color string (e.g., '#FF4500'). Confirm the color is being assigned to the correct uniform in the shader program.",
    },
  ],`,
  },

  [formatName("Gradient Background")]: {
    description:
      "A vibrant animated WebGL gradient background with customizable backdrop blur, ideal for immersive UI experiences. Provides dynamic color wave distortion with subtle vignette and extrusion glow. Suited for modern and expressive design themes.",
    import: `import GradientBackground from '@/components/lightswind/gradient-background';`,
    usage: `import GradientBackground from '@/components/lightswind/gradient-background';

// Basic usage with default (no) blur
<GradientBackground />

// With a medium backdrop blur
<GradientBackground backdropBlurAmount="md" />

// With maximum blur and a custom class for border styling
<GradientBackground backdropBlurAmount="3xl" className="border-2 border-indigo-700 rounded-2xl" />

// With a responsive height and full screen width
<GradientBackground className="h-[60vh] w-screen" />

// Combining all props
<GradientBackground backdropBlurAmount="xl" className="rounded-xl shadow-xl border border-neutral-800" />`,
    props: [
      {
        name: "backdropBlurAmount",
        type: "BlurSize",
        default: '"none"',
        required: false,
        description:
          'Sets the intensity of backdrop blur over the animated canvas. Acceptable values: "none", "sm", "md", "lg", "xl", "2xl", "3xl".',
      },
      {
        name: "className",
        type: "string",
        default: '""',
        required: false,
        description:
          "Optional Tailwind CSS class string for additional styling of the outer container (e.g., border, height, padding).",
      },
    ],
  },

  [formatName("Wave Background")]: {
    description:
      `An animated WebGL background featuring fluid wave 
      distortions with vibrant color shifting. Supports optional 
      customizable backdrop blur overlay for enhanced visual layering. 
      Ideal for dynamic, modern UIs that require an artistic background element.`,
    import: `import WaveBackground from '@/components/lightswind/wave-background';`,
    usage: `import WaveBackground from '@/components/lightswind/wave-background';

// Basic usage with default (sm) blur
<WaveBackground />

// With a medium backdrop blur
<WaveBackground backdropBlurAmount="md" />

// With maximum blur and custom border styling
<WaveBackground backdropBlurAmount="3xl" className="border-2 border-cyan-600 rounded-2xl" />

// With responsive height and full screen width
<WaveBackground className="h-[60vh] w-screen" />

// Combining all props
<WaveBackground backdropBlurAmount="xl" className="rounded-xl shadow-lg border border-neutral-700" />`,
    props: [
      {
        name: "backdropBlurAmount",
        type: "BlurSize",
        default: '"sm"',
        required: false,
        description:
          'Controls the intensity of the backdrop blur applied over the animated canvas. Acceptable values: "none", "sm", "md", "lg", "xl", "2xl", "3xl".',
      },
      {
        name: "className",
        type: "string",
        default: '""',
        required: false,
        description:
          "Optional Tailwind CSS class string for styling the outer container (e.g., border, height, width, padding).",
      },
    ],
  },

  [formatName("Reflect Background")]: {
    description:
      "A vibrant animated WebGL background that simulates reflected light and fluid motion using a custom shader. Includes optional customizable backdrop blur overlay for immersive depth and layering. Ideal for modern UIs requiring expressive, animated visuals.",
    import: `import ReflectBackground from '@/components/lightswind/reflect-background';`,
    usage: `import ReflectBackground from '@/components/lightswind/reflect-background';

// Basic usage with default (sm) blur
<ReflectBackground />

// With a medium backdrop blur
<ReflectBackground backdropBlurAmount="md" />

// With maximum blur and custom border styling
<ReflectBackground backdropBlurAmount="3xl" className="border-2 border-primarylw rounded-2xl" />

// With responsive height and full screen width
<ReflectBackground className="h-[60vh] w-screen" />

// Combining all props
<ReflectBackground backdropBlurAmount="xl" className="rounded-xl shadow-lg border border-neutral-700" />`,
    props: [
      {
        name: "backdropBlurAmount",
        type: "BlurSize",
        default: '"sm"',
        required: false,
        description:
          'Controls the intensity of the backdrop blur applied over the animated canvas. Acceptable values: "none", "sm", "md", "lg", "xl", "2xl", "3xl".',
      },
      {
        name: "className",
        type: "string",
        default: '""',
        required: false,
        description:
          "Optional Tailwind CSS class string for styling the outer container (e.g., border, height, width, padding).",
      },
    ],
  },

  [formatName("Animated Range Input")]: {
    description:
      "A customizable and reusable vertical range input component with animated display. Designed for modern UIs with support for dynamic percentage display, custom icons, and full theming. Ideal for use cases like volume, brightness, or intensity control.",
    import: `import AnimatedRangeInput from '@/components/lightswind/animated-range-input';`,

    usage: `import AnimatedRangeInput from '@/components/lightswind/animated-range-input';
import { Sun } from 'lucide-react';

const [value, setValue] = useState(50);

<AnimatedRangeInput
  value={value}
  onChange={setValue}
  icon={<Sun />}
  labelId="brightness-slider"
/>`,

    props: [
      {
        name: "value",
        type: "number",
        required: true,
        description:
          "The current numeric value of the range slider (0 to 100).",
      },
      {
        name: "onChange",
        type: "(value: number) => void",
        required: true,
        description:
          "Callback function triggered when the slider value changes.",
      },
      {
        name: "icon",
        type: "React.ReactNode",
        required: false,
        description:
          "Optional icon to be displayed to the left of the slider for visual context (e.g., brightness or volume).",
      },
      {
        name: "labelId",
        type: "string",
        required: true,
        description:
          "A unique ID used to associate the input and label for accessibility.",
      },
    ],
  },

  [formatName("Stripes Background")]: {
    description:
      "A reusable background component that applies diagonal striped patterns for visual enhancement. Supports dynamic positioning, sizing, and light/dark theme adaptation. Ideal for decorative backgrounds or section separators.",
    import: `import StripesBackground from '@/components/lightswind/StripesBackground';`,

    usage: `import StripesBackground from '@/components/lightswind/StripesBackground';

<StripesBackground
  position="right"
  width="w-1/2"
  height="h-full"
  opacity="opacity-60"
/>`,

    props: [
      {
        name: "className",
        type: "string",
        required: false,
        description:
          "Custom Tailwind CSS classes to override or extend default styles.",
      },
      {
        name: "position",
        type: `"left" | "right" | "top" | "bottom" | "full"`,
        required: false,
        description:
          "Specifies the position of the stripes background. Defaults to `'right'`.",
      },
      {
        name: "width",
        type: "string",
        required: false,
        description:
          "Tailwind width utility class. Controls the width of the background. Defaults to `'w-full'`.",
      },
      {
        name: "height",
        type: "string",
        required: false,
        description:
          "Tailwind height utility class. Controls the height of the background. Defaults to `'h-full'`.",
      },
      {
        name: "opacity",
        type: "string",
        required: false,
        description:
          "Tailwind opacity utility class. Controls the transparency of the stripes. Defaults to `'opacity-70'`.",
      },
    ],
  },

  [formatName("Smokey Background")]: {
    description:
      "A reusable WebGL-powered background component that renders a glowing, interactive smokey wave effect. Responds to mouse movement and supports dynamic color and backdrop blur customization. Ideal for modern, ambient visual sections.",
    import: `import SmokeyBackground from '@/components/lightswind/SmokeyBackground';`,

    usage: `import SmokeyBackground from '@/components/lightswind/SmokeyBackground';

<SmokeyBackground
  backdropBlurAmount="lg"
  color="#471CE2"
  className="rounded-xl"
/>`,

    props: [
      {
        name: "backdropBlurAmount",
        type: `"none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl"`,
        required: false,
        description:
          "Specifies the intensity of the Tailwind CSS backdrop blur applied over the shader. Defaults to `'sm'`.",
      },
      {
        name: "color",
        type: "string",
        required: false,
        description:
          "The glow color of the smokey effect in hexadecimal format (e.g., `'#471CE2'`). Defaults to white (`'#ffffff'`).",
      },
      {
        name: "className",
        type: "string",
        required: false,
        description:
          "Custom Tailwind CSS classes to override or extend default styles applied to the container div.",
      },
    ],
  },

  [formatName("Scroll List")]: {
    description:
      "An animated vertical list that highlights the centered item using Framer Motion.",
    import: `import ScrollList from '@/components/lightswind/ScrollList';`,

    usage: `import ScrollList from '@/components/lightswind/ScrollList';

<ScrollList
  data={yourDataArray}
  renderItem={(item, index) => (
    <div className="p-4 bg-white rounded-xl shadow-md">
      <h3 className="text-lg font-semibold">{item.title}</h3>
      <p className="text-sm text-gray-600">{item.description}</p>
    </div>
  )}
  itemHeight={160}
/>`,

    props: [
      {
        name: "data",
        type: "T[]",
        required: true,
        description:
          "An array of items to be rendered in the scrollable list. Each item can be of any type and is passed into the `renderItem` function.",
      },
      {
        name: "renderItem",
        type: "(item: T, index: number) => React.ReactNode",
        required: true,
        description:
          "Function to render each individual list item. Receives the current item and index as arguments.",
      },
      {
        name: "itemHeight",
        type: "number",
        required: false,
        description:
          "Fixed height in pixels for each item in the scroll list. Defaults to `155` if not specified.",
      },
    ],
  },

  [formatName("Stack List")]: {
    description:
      "A responsive animated stack view component that displays a vertical list of items with expandable functionality, built with Tailwind CSS and Framer Motion.",
    import: `import StackList from '@/components/lightswind/StackList';`,

    usage: `import StackList from '@/components/lightswind/StackList';
import { Flame, FileText, MapPin } from 'lucide-react';

const activities = [
  {
    icon: <FileText className="w-5 h-5" />,
    title: "Camping",
    subtitle: "Yosemite Park",
    date: "5 August",
  },
  {
    icon: <MapPin className="w-5 h-5" />,
    title: "Boating",
    subtitle: "Lake Tahoe",
    date: "2 August",
  },
  {
    icon: <Flame className="w-5 h-5" />,
    title: "Barbecue",
    subtitle: "Greenfield Shores",
    date: "28 July",
  },
];

<StackList
  items={activities}
  initialVisible={1}
  className="w-full sm:max-w-md md:max-w-lg"
/>;`,

    props: [
      {
        name: "items",
        type: "{ icon: React.ReactNode; title: string; subtitle: string; date: string; }[]",
        required: true,
        description:
          "Array of stack items to display. Each item should contain an icon, title, subtitle, and date.",
      },
      {
        name: "initialVisible",
        type: "number",
        required: false,
        description:
          "Number of items visible before expanding. Defaults to `1`.",
      },
      {
        name: "className",
        type: "string",
        required: false,
        description:
          "Tailwind utility class string for custom width and layout control of the container.",
      },
    ],
  },

  [formatName("Ripple Loader")]: {
    description:
      "A customizable animated ripple loader component with layered ripple effects and a centered icon, built using React and inline CSS-in-JSX. Accepts dynamic icons through props.",
    import: `import RippleLoader from '@/components/lightswind/RippleLoader';`,

    usage: `import RippleLoader from '@/components/lightswind/RippleLoader';
import { FaReact } from 'react-icons/fa';

<RippleLoader
  icon={<FaReact size="100%" />}
  size={200}
  duration="2s"
  logoColor="dodgerblue"
/>;`,

    props: [
      {
        name: "icon",
        type: "React.ReactNode",
        required: false,
        description:
          "The icon or any React node to be displayed in the center of the loader. Typically an SVG or icon component.",
      },
      {
        name: "size",
        type: "number",
        required: false,
        description:
          "Size of the loader in pixels (width and height are equal). Defaults to `250`.",
      },
      {
        name: "duration",
        type: "string",
        required: false,
        description:
          "Animation duration for the ripple effect. Accepts CSS time values like `2s`, `1500ms`. Defaults to `2s`.",
      },
      {
        name: "logoColor",
        type: "string",
        required: false,
        description:
          "Color of the centered icon. Accepts any valid CSS color. Defaults to `grey`.",
      },
    ],
  },

  [formatName("Orbit Card")]: {
    description:
      "A visually enhanced card component with a pulsing orbit-style glowing background animation. Built using React, Tailwind CSS, and CSS-in-JSX keyframes. Ideal for showcasing premium features, callouts, or spotlight sections.",

    import: `import OrbitCard from '@/components/lightswind/OrbitCard';`,

    usage: `import OrbitCard from '@/components/lightswind/OrbitCard';
import { Crown } from 'lucide-react';

<OrbitCard>
  <div className="flex flex-col items-center text-center">
    <Crown className="w-8 h-8 text-yellow-500 mb-3" />
    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
      Unlock Premium Access
    </h2>
    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
      Gain priority access to new features, exclusive tools, and member-only resources.
    </p>
    <button className="px-4 py-2 rounded-lg bg-primarylw text-white hover:bg-primarylw-2 transition duration-300 text-sm font-medium">
      Upgrade Now
    </button>
  </div>
</OrbitCard>;`,

    props: [
      {
        name: "children",
        type: "React.ReactNode",
        required: true,
        description:
          "The content to render inside the orbit card. Typically includes icons, text, and interactive elements like buttons.",
      },
      {
        name: "className",
        type: "string",
        required: false,
        description:
          "Optional additional Tailwind CSS class names to customize the outer card container.",
      },
    ],
  },

  [formatName("Glass Folder")]: {
    description:
      "A 3D glassmorphic folder component with layered depth and interactive rotation effects on hover. Designed using React and Tailwind CSS, it visually mimics a stack of translucent folder sheets, making it ideal for showcasing documents, portfolios, or feature categories in a stylish and futuristic way.",

    import: `import GlassFolder from '@/components/lightswind/GlassFolder';`,

    usage: `import GlassFolder from '@/components/lightswind/GlassFolder';
import { FileText } from 'lucide-react';

<GlassFolder>
  <FileText className="w-8 h-8 text-yellow-300" />
</GlassFolder>;`,

    props: [
      {
        name: "icon",
        type: "React.ReactNode",
        required: false,
        description:
          "Optional icon element displayed in the center of the front folder layer. Commonly used to visually represent content or category.",
      },
      {
        name: "className",
        type: "string",
        required: false,
        description:
          "Additional Tailwind CSS classes to customize the folder container’s layout or spacing externally.",
      },
    ],
  },

  [formatName("Terminal Card")]: {
    description:
      "A dynamic terminal-style card component with typing animation and syntax highlighting. Ideal for showcasing commands or code snippets with copy-to-clipboard functionality and visually appealing terminal interface. Built with React, Framer Motion, Tailwind CSS, and SyntaxHighlighter.",

    import: `import TerminalCard from '@/components/lightswind/TerminalCard';`,

    usage: `import TerminalCard from '@/components/lightswind/TerminalCard';

<TerminalCard command="npm install your-package-name" language="bash" />;`,

    props: [
      {
        name: "command",
        type: "string",
        required: true,
        description:
          "The command or code snippet to be displayed with a typing animation and syntax highlighting.",
      },
      {
        name: "language",
        type: "string",
        required: false,
        default: `"tsx"`,
        description:
          "Specifies the language used for syntax highlighting (e.g., 'tsx', 'js', 'bash'). Defaults to 'tsx'.",
      },
      {
        name: "className",
        type: "string",
        required: false,
        description:
          "Additional Tailwind CSS classes to customize the outer container's layout or styling.",
      },
    ],
  },

  [formatName("Sliding Cards")]: {
    description:
      "An interactive stack of sliding cards with 3D depth and swipe gesture functionality. Each card can display an icon and customized background. Ideal for showcasing features, testimonials, or data cards in a visually appealing and animated format. Built with React, Tailwind CSS, and custom swipe logic.",

    import: `import SlidingCards from '@/components/lightswind/SlidingCards';`,

    usage: `import { FaStar, FaBolt, FaHeart } from 'react-icons/fa';
import SlidingCards from '@/components/lightswind/SlidingCards';

const cardItems = [
  { id: 1, icon: <FaStar />, bgClass: 'bg-gradient-to-br from-yellow-400 to-red-400' },
  { id: 2, icon: <FaBolt />, bgClass: 'bg-gradient-to-br from-purple-400 to-pink-400' },
  { id: 3, icon: <FaHeart />, bgClass: 'bg-gradient-to-br from-teal-400 to-cyan-300' },
];

<SlidingCards cards={cardItems} cardSize="w-20 h-20" className="mx-auto" />;`,

    props: [
      {
        name: "cards",
        type: "CardContent[]",
        required: true,
        description:
          "An array of card objects containing `id`, optional `icon`, and optional `bgClass` to render each card in the stack.",
      },
      {
        name: "className",
        type: "string",
        required: false,
        description:
          "Additional Tailwind CSS classes to customize the outer container's layout or styling.",
      },
      {
        name: "cardSize",
        type: "string",
        required: false,
        default: `"w-24 h-24"`,
        description:
          "Tailwind classes to define the size of the icons/cards. Defaults to `w-24 h-24`.",
      },
    ],
  },

  [formatName("Interactive Card")]: {
    description:
      "A responsive and animated 3D hover card built with Framer Motion and Tailwind CSS. It responds to cursor position with rotation and a glowing radial gradient. Perfect for enhancing UI with interactive visual depth and modern appeal.",

    import: `import { InteractiveCard } from '@/components/lightswind/InteractiveCard';`,

    usage: `import { InteractiveCard } from '@/components/lightswind/InteractiveCard';

<InteractiveCard
  InteractiveColor="#00f0ff"
  tailwindBgClass="bg-gray-900 dark:bg-gray-800"
  className="text-white text-center flex items-center justify-center font-semibold text-lg"
>
  Hover Me!
</InteractiveCard>;`,

    props: [
      {
        name: "children",
        type: "React.ReactNode",
        required: true,
        description: "The content displayed inside the card.",
      },
      {
        name: "className",
        type: "string",
        required: false,
        description:
          "Additional Tailwind CSS classes for customizing the inner content layout or style.",
      },
      {
        name: "InteractiveColor",
        type: "string",
        required: false,
        default: `"#07eae6ff"`,
        description:
          "The color used for the interactive radial glow effect on hover.",
      },
      {
        name: "borderRadius",
        type: "string",
        required: false,
        default: `"48px"`,
        description:
          "The border radius for the card, affecting both the outer and inner layers.",
      },
      {
        name: "rotationFactor",
        type: "number",
        required: false,
        default: `0.4`,
        description:
          "Controls the amount of 3D rotation applied based on pointer position.",
      },
      {
        name: "transitionDuration",
        type: "number",
        required: false,
        default: `0.3`,
        description: "Duration of transition animations (in seconds).",
      },
      {
        name: "transitionEasing",
        type: "string",
        required: false,
        default: `"easeInOut"`,
        description: "Easing function for the animations.",
      },
      {
        name: "tailwindBgClass",
        type: "string",
        required: false,
        default: `"bg-transparent"`,
        description:
          "Tailwind classes used to define the card background, allowing full customization and dark mode support.",
      },
    ],
  },

  [formatName("Top Sticky Bar")]: {
    description:
      "A versatile and animated sticky bar component that can appear at the top of the viewport. It supports both external control via a `show` prop and automatic visibility based on scroll position, offering customizable content, appearance, and animation.",

    import: `import { TopStickyBar } from '@/components/lightswind/TopStickyBar';`,

    usage: `import { TopStickyBar } from '@/components/lightswind/TopStickyBar';

// Option 1: Controlled externally (e.g., by a button or parent state)
<TopStickyBar show={true} className="bg-primarylw text-white">
  <p>This is a custom message!</p>
</TopStickyBar>

// Option 2: Automatic visibility on scroll
// Ensure your page has enough content to scroll
<TopStickyBar showOnScroll={true} scrollThreshold={250} className="bg-green-700 text-yellow-300">
  <p className="font-semibold">Scroll down to see me!</p>
</TopStickyBar>;`,

    props: [
      {
        name: "children",
        type: "React.ReactNode",
        required: true,
        description:
          "The content to display inside the sticky bar (e.g., text, icons, other components).",
      },
      {
        name: "show",
        type: "boolean",
        required: false,
        default: "`false`",
        description:
          "Controls the visibility of the bar. Set to `true` to show, `false` to hide. This prop is ignored if `showOnScroll` is `true`.",
      },
      {
        name: "showOnScroll",
        type: "boolean",
        required: false,
        default: "`false`",
        description:
          "If `true`, the bar's visibility is automatically controlled by the scroll position. If `false` or undefined, the `show` prop determines visibility.",
      },
      {
        name: "scrollThreshold",
        type: "number",
        required: false,
        default: "`200`",
        description:
          "The scroll position (in pixels from the top) after which the bar becomes visible, when `showOnScroll` is `true`.",
      },
      {
        name: "className",
        type: "string",
        required: false,
        description:
          "Additional Tailwind CSS classes to apply to the bar for custom background, text color, padding, etc. These will override default styling.",
      },
      {
        name: "duration",
        type: "number",
        required: false,
        default: "`0.4`",
        description:
          "The animation duration in seconds for the bar's appearance and disappearance.",
      },
      {
        name: "ease",
        type: "Easing | Easing[]",
        required: false,
        default: `"easeInOut"`,
        description:
          "The easing function for the animation. Can be a Framer Motion easing string (e.g., 'linear', 'easeOut') or a cubic-bezier array.",
      },
      {
        name: "initialY",
        type: "number",
        required: false,
        default: `-50`,
        description:
          "The initial vertical offset (in pixels) from the top before the bar's animation begins.",
      },
      {
        name: "visibleY",
        type: "number",
        required: false,
        default: `0`,
        description:
          "The vertical offset (in pixels) from the top when the bar is fully visible.",
      },
      {
        name: "hiddenY",
        type: "number",
        required: false,
        default: `-50`,
        description:
          "The vertical offset (in pixels) from the top when the bar is fully hidden (after animation).",
      },
    ],
  },

  [formatName("Particles Background")]: {
    description:
      "A customizable and responsive particle animation background using particles.js. Ideal for adding dynamic visual flair to hero sections or full-page layouts. Supports custom particle colors, sizes, count per device type, and styling options.",

    import: `import ParticlesBackground from '@/components/lightswind/ParticlesBackground';`,

    usage: `import ParticlesBackground from '@/components/lightswind/ParticlesBackground';

// Basic usage with default values
<ParticlesBackground />

// Custom colors, size, count, and z-index
<ParticlesBackground
  colors={['#00ffff', '#ff00ff', '#ffaa00']}
  size={4}
  countDesktop={80}
  countTablet={60}
  countMobile={40}
  zIndex={-1}
  height="100vh"
/>;`,

    props: [
      {
        name: "colors",
        type: "string[]",
        required: false,
        default: "`['#ff223e', '#5d1eb2', '#ff7300']`",
        description:
          "An array of hex or CSS color strings to apply to the particles. Can use single or multiple colors.",
      },
      {
        name: "size",
        type: "number",
        required: false,
        default: "`3`",
        description:
          "Base size of each particle in pixels. Randomization is applied for variation.",
      },
      {
        name: "countDesktop",
        type: "number",
        required: false,
        default: "`60`",
        description:
          "Number of particles to display on desktop screens (width > 1024px).",
      },
      {
        name: "countTablet",
        type: "number",
        required: false,
        default: "`50`",
        description:
          "Number of particles to display on tablet screens (768px < width ≤ 1024px).",
      },
      {
        name: "countMobile",
        type: "number",
        required: false,
        default: "`40`",
        description:
          "Number of particles to display on mobile screens (width ≤ 768px).",
      },
      {
        name: "zIndex",
        type: "number",
        required: false,
        default: "`0`",
        description:
          "Controls the stacking order of the background. Lower values place it further behind other elements.",
      },
      {
        name: "height",
        type: "string",
        required: false,
        default: "`'100vh'`",
        description:
          "The height of the particle canvas. Accepts any valid CSS height value such as `100vh`, `500px`, etc.",
      },
    ],
  },

  [formatName("Globe")]: {
    description:
      "A fully customizable and interactive 3D globe built with the `cobe` library. Supports theming, lighting, rotation, mouse interactions, and custom markers. Ideal for showcasing global presence, user locations, or ambient visual flair.",

    import: `import Globe from '@/components/lightswind/Globe';`,

    usage: `import Globe from '@/components/lightswind/Globe';

// Basic usage with default values
<Globe />

// Custom appearance and behavior
<Globe
  theta={0.2}
  dark={1}
  scale={1.2}
  diffuse={1.5}
  baseColor="#1a1a1a"
  markerColor="#ff0000"
  glowColor="#444444"
/>`,

    props: [
      {
        name: "className",
        type: "string",
        required: false,
        default: "`''`",
        description:
          "Optional Tailwind or custom CSS classes to apply to the globe container.",
      },
      {
        name: "theta",
        type: "number",
        required: false,
        default: "`0.25`",
        description:
          "Initial vertical rotation of the globe in radians. Controls the 'tilt' of the globe.",
      },
      {
        name: "dark",
        type: "number",
        required: false,
        default: "`1`",
        description:
          "Controls the ambient darkness of the globe (0 = fully lit, 1 = very dark).",
      },
      {
        name: "scale",
        type: "number",
        required: false,
        default: "`1.1`",
        description:
          "Zoom level or scale of the globe. Higher values make the globe appear larger.",
      },
      {
        name: "diffuse",
        type: "number",
        required: false,
        default: "`1.2`",
        description:
          "Amount of light diffusion on the globe's surface. Higher values produce a softer light effect.",
      },
      {
        name: "mapSamples",
        type: "number",
        required: false,
        default: "`40000`",
        description:
          "Number of sample points used to render the globe texture. Higher values improve quality at the cost of performance.",
      },
      {
        name: "mapBrightness",
        type: "number",
        required: false,
        default: "`10`",
        description: "Brightness factor applied to the globe's texture map.",
      },
      {
        name: "baseColor",
        type: "`[number, number, number]` or `string`",
        required: false,
        default: "`'#ffffff'`",
        description:
          "The base RGB or hex color for the globe's surface. Accepts normalized RGB arrays or hex strings.",
      },
      {
        name: "markerColor",
        type: "`[number, number, number]` or `string`",
        required: false,
        default: "`'#ffffff'`",
        description:
          "The color used for markers on the globe. Accepts normalized RGB arrays or hex strings.",
      },
      {
        name: "glowColor",
        type: "`[number, number, number]` or `string`",
        required: false,
        default: "`'#ffffff'`",
        description:
          "The glow highlight color used around the edges of the globe. Accepts normalized RGB arrays or hex strings.",
      },
    ],
  },

  [formatName("Sparkle Particles")]: {
    description:
      "Highly customizable particle animation built with `@tsparticles/react`. Supports dynamic theming, motion direction, interactivity, collisions, and advanced customization. Ideal for background visual effects or interactive UI embellishments.",

    import: `import { SparkleParticles } from '@/components/lightswind/SparkleParticles';`,

    usage: `import { SparkleParticles } from '@/components/lightswind/SparkleParticles';

// Basic usage
<SparkleParticles />

// Custom usage
<SparkleParticles
  className="absolute inset-0 z-0"
  maxParticleSize={2.5}
  minParticleSize={1}
  baseDensity={600}
  maxSpeed={2}
  minMoveSpeed={0.2}
  maxOpacity={0.8}
  customDirection="top"
  opacityAnimationSpeed={5}
  minParticleOpacity={0.2}
  particleColor="#00ffcc"
  enableParallax={true}
  enableHoverGrab={true}
  backgroundColor="transparent"
  zIndexLevel={-1}
  clickEffect={true}
  hoverMode="repulse"
  particleCount={6}
  particleShape="star"
  enableCollisions={true}
/>`,

    props: [
      {
        name: "className",
        type: "string",
        required: false,
        default: "`''`",
        description:
          "Optional Tailwind or custom CSS classes for positioning and styling.",
      },
      {
        name: "maxParticleSize",
        type: "number",
        required: false,
        default: "`1.2`",
        description: "Maximum size of each particle.",
      },
      {
        name: "minParticleSize",
        type: "number | null",
        required: false,
        default: "`null`",
        description:
          "Minimum size of particles. Defaults to a fraction of `maxParticleSize` if not set.",
      },
      {
        name: "baseDensity",
        type: "number",
        required: false,
        default: "`800`",
        description: "Base number of particles rendered.",
      },
      {
        name: "maxSpeed",
        type: "number",
        required: false,
        default: "`1.5`",
        description: "Maximum movement speed of particles.",
      },
      {
        name: "minMoveSpeed",
        type: "number | null",
        required: false,
        default: "`null`",
        description: "Minimum movement speed of particles.",
      },
      {
        name: "maxOpacity",
        type: "number",
        required: false,
        default: "`1`",
        description: "Maximum opacity for particles.",
      },
      {
        name: "minParticleOpacity",
        type: "number | null",
        required: false,
        default: "`null`",
        description:
          "Minimum opacity. Defaults to a fraction of `maxOpacity` if not set.",
      },
      {
        name: "opacityAnimationSpeed",
        type: "number",
        required: false,
        default: "`3`",
        description: "Speed of opacity animation for twinkling effect.",
      },
      {
        name: "customDirection",
        type: `"top" | "bottom" | "left" | "right" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | "none" | ""`,
        required: false,
        default: "`''`",
        description: "Direction of particle movement.",
      },
      {
        name: "particleColor",
        type: "string",
        required: false,
        default: "`#ffffff` (dark mode) or `#000000` (light mode)",
        description:
          "Hex color code for particle fill. Automatically adapts to dark/light mode unless specified.",
      },
      {
        name: "backgroundColor",
        type: "string",
        required: false,
        default: "`'transparent'`",
        description: "Background color of the particles container.",
      },
      {
        name: "enableParallax",
        type: "boolean",
        required: false,
        default: "`false`",
        description: "Enables parallax movement on hover.",
      },
      {
        name: "enableHoverGrab",
        type: "boolean",
        required: false,
        default: "`false`",
        description: "Enables interactive hover effect with particles.",
      },
      {
        name: "clickEffect",
        type: "boolean",
        required: false,
        default: "`true`",
        description: "Enables particles to be pushed on click.",
      },
      {
        name: "hoverMode",
        type: `"grab" | "repulse" | "bubble"`,
        required: false,
        default: "`'grab'`",
        description: "Mode of interactivity when hovering over particles.",
      },
      {
        name: "zIndexLevel",
        type: "number",
        required: false,
        default: "`1`",
        description:
          "Z-index level for particles container. Useful for layering.",
      },
      {
        name: "particleCount",
        type: "number",
        required: false,
        default: "`4`",
        description: "Number of particles to add per interaction.",
      },
      {
        name: "particleShape",
        type: `"circle" | "square" | "triangle" | "star" | "edge"`,
        required: false,
        default: "`'circle'`",
        description: "Shape of particles rendered.",
      },
      {
        name: "enableCollisions",
        type: "boolean",
        required: false,
        default: "`false`",
        description: "Enable bouncing collision detection between particles.",
      },
      {
        name: "userOptions",
        type: "Record<string, any>",
        required: false,
        default: "`{}`",
        description:
          "Custom override options passed directly to `tsparticles` config.",
      },
    ],
  },

  [formatName("Image Reveal")]: {
    description:
      "An animated image hover reveal component built with Framer Motion. Displays a floating image near the cursor when hovering over each label. Perfect for showcasing visual categories, portfolios, or galleries with interactive feedback.",

    import: `import ImageReveal from '@/components/lightswind/ImageReveal';`,

    usage: `import ImageReveal from '@/components/lightswind/ImageReveal';

// Basic usage
<ImageReveal />`,

    props: [
      {
        name: "className",
        type: "string",
        required: false,
        default: "`''`",
        description:
          "Optional Tailwind or custom CSS classes to apply to the outer container.",
      },
      {
        name: "imageWidth",
        type: "number | string",
        required: false,
        default: "`300`",
        description:
          "The width of the floating image shown on hover (only on large screens).",
      },
      {
        name: "imageHeight",
        type: "number | string",
        required: false,
        default: "`400`",
        description:
          "The height of the floating image shown on hover (only on large screens).",
      },
      {
        name: "visualData",
        type: `{
  key: number;
  url: string;
  label: string;
}[]`,
        required: false,
        default: "`[...]`",
        description:
          "Array of items to be displayed with hover interaction. Each includes a label and image URL.",
      },
    ],
  },

  [formatName("Image Trail Effect")]: {
    description:
      "An animated mouse trail image effect built with React. Displays a trail of floating images that follow the user's cursor. Ideal for creating visually engaging and interactive sections on landing pages or portfolios.",

    import: `import ImageTrailEffect from '@/components/lightswind/ImageTrailEffect';`,

    usage: `import ImageTrailEffect from '@/components/lightswind/ImageTrailEffect';

<ImageTrailEffect
  imageSources={[
    '/images/trail1.jpg',
    '/images/trail2.jpg',
    '/images/trail3.jpg'
  ]}
  content={<h1 className="text-3xl font-bold">Hover Me!</h1>}
/>`,

    props: [
      {
        name: "imageSources",
        type: "string[]",
        required: true,
        default: "-",
        description: "An array of image URLs to be used in the mouse trail.",
      },
      {
        name: "content",
        type: "ReactNode",
        required: false,
        default: "`undefined`",
        description:
          "Optional JSX content rendered within the trail container.",
      },
      {
        name: "containerClassName",
        type: "string",
        required: false,
        default: "`''`",
        description:
          "Optional Tailwind or custom CSS classes for the container.",
      },
      {
        name: "imageClassName",
        type: "string",
        required: false,
        default: "`'w-40 h-48'`",
        description: "Tailwind/CSS classes to style each trail image.",
      },
      {
        name: "triggerDistance",
        type: "number",
        required: false,
        default: "`20`",
        description:
          "Controls the distance threshold (relative to screen width) to trigger the next image in the trail.",
      },
      {
        name: "maxTrailImages",
        type: "number",
        required: false,
        default: "`5`",
        description: "Maximum number of images visible in the trail at once.",
      },
      {
        name: "useFadeEffect",
        type: "boolean",
        required: false,
        default: "`false`",
        description:
          "If true, images in the trail will fade out after a short delay.",
      },
    ],
  },

  [formatName("Text Scroll Marquee")]: {
    description:
      "A horizontally scrolling text marquee built with React, Motion One, and Tailwind CSS. It supports directional scrolling, optional scroll-based motion, delay, and full customization via props.",

    import: `import TextScrollMarquee from '@/components/lightswind/TextScrollMarquee';`,

    usage: `import TextScrollMarquee from '@/components/lightswind/TextScrollMarquee';

<TextScrollMarquee
  baseVelocity={1}
  direction="left"
  className="text-3xl font-bold uppercase text-primarylw"
  scrollDependent={false}
  delay={500}
>
  🚀 Welcome to the Future of Fast UI! 🚀
</TextScrollMarquee>`,

    props: [
      {
        name: "children",
        type: "string",
        required: true,
        default: "-",
        description:
          "The scrolling text content to be rendered repeatedly in the marquee.",
      },
      {
        name: "baseVelocity",
        type: "number",
        required: true,
        default: "`1`",
        description:
          "Controls the base speed of the marquee (positive number).",
      },
      {
        name: "direction",
        type: "'left' | 'right'",
        required: false,
        default: "`'left'`",
        description: "Determines the scroll direction of the marquee content.",
      },
      {
        name: "scrollDependent",
        type: "boolean",
        required: false,
        default: "`false`",
        description:
          "If true, the marquee scrolls faster based on scroll velocity. Useful for parallax effects.",
      },
      {
        name: "delay",
        type: "number",
        required: false,
        default: "`0`",
        description:
          "Optional delay (in milliseconds) before the animation starts.",
      },
      {
        name: "className",
        type: "string",
        required: false,
        default: "`''`",
        description:
          "Optional Tailwind or custom CSS classes to style the marquee text.",
      },
    ],
  },

  [formatName("Drag Order List")]: {
    description:
      "A draggable, reorderable list built using React, Motion One, and Tailwind CSS. Items can be rearranged vertically via drag-and-drop gestures, with smooth animation and visual feedback.",

    import: `import { DragOrderList } from '@/components/lightswind/DragOrderList';`,

    usage: `import { DragOrderList } from '@/components/lightswind/DragOrderList';

const items = [
  {
    id: 1,
    title: "Task One",
    subtitle: "This is the first task",
    date: "2025-07-29",
    link: "https://example.com/task-1"
  },
  {
    id: 2,
    title: "Task Two",
    subtitle: "This is the second task",
    date: "2025-07-28"
  },
];

<DragOrderList
  items={items}
  onReorder={(newOrder) => console.log("Reordered items:", newOrder)}
/>`,

    props: [
      {
        name: "items",
        type: "DragItem[]",
        required: true,
        default: "-",
        description:
          "Array of draggable items. Each item should include `id`, `title`, `subtitle`, `date`, and optional `link`.",
      },
      {
        name: "onReorder",
        type: "(items: DragItem[]) => void",
        required: false,
        default: "`undefined`",
        description:
          "Callback function triggered after the list is reordered. Receives the updated list of items.",
      },
    ],
  },

  [formatName("Bento Grid")]: {
    description:
      "A responsive and visually interactive bento-style grid layout component to showcase features, services, or categories. Built with React and Tailwind CSS, each card supports icon, title, description, and optional animated or visual background.",

    import: `import { BentoGrid } from '@/components/lightswind/BentoGrid';`,

    usage: `import { BentoGrid } from '@/components/lightswind/BentoGrid';
import {
  FileTextIcon,
  FolderArchiveIcon,
  Share2Icon,
  CalendarIcon,
} from "lucide-react";

import {
  SlidingCardsDemo,
  GlassFolderDemo,
  GlowingCardsDemo,
  StackListDemo,
} from "@/components/previews";

const cards = [
  {
    icon: FileTextIcon,
    title: "Save your files",
    description: "We automatically save your files as you type.",
    className: "col-span-3 lg:col-span-1",
    background: <SlidingCardsDemo />,
  },
  {
    icon: FolderArchiveIcon,
    title: "Notifications",
    description: "Get notified when something happens.",
    className: "col-span-3 lg:col-span-2",
    background: <GlassFolderDemo />,
  },
  {
    icon: Share2Icon,
    title: "Integrations",
    description: "Supports 100+ integrations and counting.",
    className: "col-span-3 lg:col-span-2 h-[20rem]",
    background: <GlowingCardsDemo />,
  },
  {
    icon: CalendarIcon,
    title: "Calendar",
    description: "Use the calendar to filter your files by date.",
    className: "col-span-3 lg:col-span-1",
    background: <StackListDemo />,
  },
];

<BentoGrid cards={cards} columns={3} className="mt-10" />;`,

    props: [
      {
        name: "cards",
        type: "BentoCardData[]",
        required: true,
        default: "-",
        description:
          "Array of card objects to display in the grid. Each object contains a title, description, icon component, and optional styles or background.",
      },
      {
        name: "columns",
        type: "number",
        required: false,
        default: "`3`",
        description:
          "Number of columns for large screen (≥1024px). Automatically adjusts to 1 column on mobile and 2 on small screens.",
      },
      {
        name: "rowHeight",
        type: "string",
        required: false,
        default: "`'auto'`",
        description:
          "Optional fixed height for grid rows. Currently not used in inline styles but reserved for future use or advanced styling.",
      },
      {
        name: "className",
        type: "string",
        required: false,
        default: "`''`",
        description:
          "Additional Tailwind CSS classes for the outer grid container.",
      },
      {
        name: "...props",
        type: "HTMLDivElement attributes",
        required: false,
        default: "-",
        description:
          "Any additional props like `id`, `style`, or `aria-*` will be passed to the grid container.",
      },
    ],
  },

  [formatName("Video Text")]: {
    description:
      "A versatile component that masks a video inside text, creating a dynamic and engaging visual effect. It allows customization of font properties and video playback, powered by React, Tailwind CSS, and Framer Motion for optional animations.",

    import: `import { VideoText } from '@/components/lightswind/VideoText';`, // Adjust path based on your project structure

    usage: `import { VideoText } from '@/components/lightswind/VideoText';

// Example with basic usage and default text properties
<VideoText src="/videos/ocean.mp4">
  EXPLORE
</VideoText>

// Example with custom font size, weight, and a simple Framer Motion animation
<VideoText
  src="/videos/cityscape.mp4"
  fontSize={18} // 18vw
  fontWeight={800}
  fontFamily="Arial Black, sans-serif"
  className="w-full h-[50vh]" // Example: full width, 50% viewport height
  autoPlay
  muted
  loop
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 1.5, ease: "easeOut" }}
>
  MOTION TEXT
</VideoText>

// Example with a different HTML element as the container
<VideoText
  as="h1"
  src="/videos/waterfall.mp4"
  fontSize={25}
  fontWeight="bold"
  textAnchor="start"
  dominantBaseline="hanging"
>
  NATURE'S BEAUTY
</VideoText>`,

    props: [
      {
        name: "src",
        type: "string",
        required: true,
        default: "-",
        description:
          "The URL of the video file to be displayed inside the text mask.",
      },
      {
        name: "children",
        type: "ReactNode",
        required: true,
        default: "-",
        description:
          "The text content that will serve as the mask for the video. Can be a string or other React nodes.",
      },
      {
        name: "className",
        type: "string",
        required: false,
        default: "`undefined`",
        description:
          "Optional additional CSS class names for the main container of the component.",
      },
      {
        name: "autoPlay",
        type: "boolean",
        required: false,
        default: "`true`",
        description:
          "Whether the video should start playing automatically when loaded.",
      },
      {
        name: "muted",
        type: "boolean",
        required: false,
        default: "`true`",
        description: "Whether the video's audio should be muted.",
      },
      {
        name: "loop",
        type: "boolean",
        required: false,
        default: "`true`",
        description:
          "Whether the video should loop back to the start when it reaches the end.",
      },
      {
        name: "preload",
        type: '`"auto" | "metadata" | "none"`',
        required: false,
        default: '`"auto"`',
        description:
          "Specifies how the video should be preloaded: `auto` (browser decides), `metadata` (fetch metadata only), or `none` (no preloading).",
      },
      {
        name: "fontSize",
        type: "string | number",
        required: false,
        default: "`20` (interpreted as `20vw`)",
        description:
          "The font size for the text mask. Numbers are interpreted as viewport width units (e.g., `20` becomes `20vw`). Strings can be any valid CSS font-size (e.g., `'100px'`, `'15em'`).",
      },
      {
        name: "fontWeight",
        type: "string | number",
        required: false,
        default: '`"bold"`',
        description:
          'The font weight for the text mask (e.g., `"normal"`, `"bold"`, `500`, `900`).',
      },
      {
        name: "textAnchor",
        type: "string",
        required: false,
        default: '`"middle"`',
        description:
          'Determines how the text is aligned relative to its `x` position (e.g., `"start"`, `"middle"`, `"end"`).',
      },
      {
        name: "dominantBaseline",
        type: "string",
        required: false,
        default: '`"middle"`',
        description:
          'Specifies how the text baseline is aligned relative to its `y` position (e.g., `"auto"`, `"ideographic"`, `"alphabetic"`, `"middle"`).',
      },
      {
        name: "fontFamily",
        type: "string",
        required: false,
        default: '`"sans-serif"`',
        description:
          'The font family for the text mask (e.g., `"Arial, sans-serif"`, `"Impact"`).',
      },
      {
        name: "as",
        type: '`"div" | "span" | "section" | "article" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6"`',
        required: false,
        default: '`"div"`',
        description:
          "The HTML element type to render as the component's root container. This element will also be a Framer Motion component.",
      },
      {
        name: "`...motionProps`",
        type: '`HTMLMotionProps<"div">`', // Or specify the exact type if you constrain 'as' further
        required: false,
        default: "`undefined`",
        description:
          "Any valid Framer Motion props for an HTML element (e.g., `initial`, `animate`, `transition`, `whileHover`, `variants`). These props are applied directly to the root container specified by the `as` prop.",
      },
    ],
  },

  [formatName("Typing Text")]: {
    description:
      "A sleek animated typing component that reveals each character with a smooth shimmer effect. Ideal for hero sections, headers, or attention-grabbing intros. Built with React, Framer Motion, and Tailwind CSS.",

    import: `import { TypingText } from '@/components/lightswind/TypingText';`,

    usage: `import { TypingText } from '@/components/lightswind/TypingText';

<TypingText
  delay={0.5}
  duration={2}
  fontSize="text-5xl"
  fontWeight="font-extrabold"
  color="text-primarylw"
  letterSpacing="tracking-wider"
  align="center"
>
  Welcome to the Future of UI
</TypingText>`,

    props: [
      {
        name: "children",
        type: "ReactNode",
        required: true,
        default: "-",
        description:
          "Text content to animate. Can include plain text or nested elements (only the raw text will be extracted and animated).",
      },
      {
        name: "as",
        type: "ElementType",
        required: false,
        default: "`div`",
        description:
          "HTML or React element to render as the root wrapper (e.g. `h1`, `span`).",
      },
      {
        name: "className",
        type: "string",
        required: false,
        default: "`''`",
        description:
          "Optional Tailwind utility classes for additional styling on the root container.",
      },
      {
        name: "delay",
        type: "number",
        required: false,
        default: "`0`",
        description:
          "Time in seconds to delay the start of the typing animation.",
      },
      {
        name: "duration",
        type: "number",
        required: false,
        default: "`2`",
        description: "Total duration (in seconds) for typing the entire text.",
      },
      {
        name: "fontSize",
        type: "string",
        required: false,
        default: "`text-4xl`",
        description: "Tailwind class to control font size of the text.",
      },
      {
        name: "fontWeight",
        type: "string",
        required: false,
        default: "`font-bold`",
        description: "Tailwind class to control font weight of the text.",
      },
      {
        name: "color",
        type: "string",
        required: false,
        default: "`text-white`",
        description: "Tailwind class to control text color.",
      },
      {
        name: "letterSpacing",
        type: "string",
        required: false,
        default: "`tracking-wide`",
        description: "Tailwind class to control letter spacing of the text.",
      },
      {
        name: "align",
        type: `"left" | "center" | "right"`,
        required: false,
        default: "`left`",
        description:
          "Controls text alignment and justification within the container.",
      },
      {
        name: "loop",
        type: "boolean",
        required: false,
        default: "`false`",
        description:
          "If true, the animation cursor will loop (only relevant if cursor is enabled). Cursor is removed by default in this version.",
      },
    ],
  },

  [formatName("Trusted Users")]: {
    description:
      "A visually appealing component to showcase social proof by displaying user avatars, a star rating, and a customizable caption. Perfect for landing pages, testimonials, or feature highlights. Built with React and Tailwind CSS.",

    import: `import { TrustedUsers } from '@/components/lightswind/TrustedUsers';`,

    usage: `import { TrustedUsers } from '@/components/lightswind/TrustedUsers';

<TrustedUsers
  avatars={[
    '/avatars/user1.jpg',
    '/avatars/user2.jpg',
    '/avatars/user3.jpg',
    '/avatars/user4.jpg',
  ]}
  rating={5}
  totalUsersText="5,000+"
  caption="Loved by"
  starColorClass="text-yellow-400"
  ringColors={[
    "ring-pink-500",
    "ring-green-500",
    "ring-blue-500",
    "ring-purple-500"
  ]}
/>`,

    props: [
      {
        name: "avatars",
        type: "string[]",
        required: true,
        default: "-",
        description: "Array of avatar image URLs to display.",
      },
      {
        name: "rating",
        type: "number",
        required: false,
        default: "`5`",
        description: "Number of stars to show in the rating (1–5).",
      },
      {
        name: "totalUsersText",
        type: "string | number", // Updated type
        required: false,
        default: '`"1000+"`',
        description: "Text showing how many users trust the product.",
      },
      {
        name: "caption",
        type: "string",
        required: false,
        default: '`"Trusted by"`',
        description: "Caption shown before the total users text.",
      },
      {
        name: "className",
        type: "string",
        required: false,
        default: "`''`",
        description:
          "Optional Tailwind CSS classes to customize outer container.",
      },
      {
        name: "starColorClass",
        type: "string",
        required: false,
        default: '`"text-yellow-400"`',
        description: "Tailwind class to style star icons (color, size).",
      },
      {
        name: "ringColors",
        type: "string[]",
        required: false,
        default: "`[]`",
        description:
          "Optional Tailwind ring color classes for each avatar image. Falls back to `ring-blue-900` if not provided.",
      },
    ],
  },

  [formatName("Shine Button")]: {
    description:
      "A reusable, customizable button component with a professional animated gradient shine effect. Supports solid hex or gradient backgrounds, responsive sizing, and full Tailwind CSS compatibility. Ideal for call-to-action or donation prompts.",

    import: `import { ShineButton } from '@/components/lightswind/ShineButton';`,

    usage: `import { ShineButton } from '@/components/lightswind/ShineButton';

<ShineButton 
  label="Donate Now" 
  size="lg" 
  bgColor="linear-gradient(325deg, hsl(217 100% 56%) 0%, hsl(194 100% 69%) 55%, hsl(217 100% 56%) 90%)" 
  onClick={() => alert('Thanks for your support!')} 
/>`,

    props: [
      {
        name: "label",
        type: "string",
        required: false,
        default: '`"Shine Button"`',
        description: "Text to display inside the button.",
      },
      {
        name: "onClick",
        type: "() => void",
        required: false,
        default: "`undefined`",
        description: "Click handler function triggered on button press.",
      },
      {
        name: "className",
        type: "string",
        required: false,
        default: "`''`",
        description: "Optional Tailwind CSS classes for button customization.",
      },
      {
        name: "size",
        type: `"sm" | "md" | "lg"`,
        required: false,
        default: '`"md"`',
        description: "Controls padding and font size of the button.",
      },
      {
        name: "bgColor",
        type: "string",
        required: false,
        default:
          "`linear-gradient(325deg, hsl(217 100% 56%) 0%, hsl(194 100% 69%) 55%, hsl(217 100% 56%) 90%)`",
        description:
          "Sets background. Accepts solid hex (e.g. `#10b981`) or full CSS gradient string.",
      },
    ],
  },

  [formatName("Ripple Button")]: {
    description:
      "A modern ripple-effect button component with animated background circles. Ideal for calls to action, download prompts, or interactive UI elements. Highly customizable with colors, sizes, and responsive support. Built with React and CSS-in-JS.",

    import: `import RippleButton from '@/components/lightswind/RippleButton';`,

    usage: `
<RippleButton 
  text="Click Me" 
  bgColor="#111827" 
  circleColor="#3B82F6"
  width="200px"
  height="50px"
/>
  `,

    props: [
      {
        name: "text",
        type: "string",
        required: false,
        default: '"Click Me"',
        description: "Text displayed inside the button.",
      },
      {
        name: "bgColor",
        type: "string",
        required: false,
        default: '"#000000"',
        description:
          "Background color of the button. Accepts any valid CSS color.",
      },
      {
        name: "circleColor",
        type: "string",
        required: false,
        default: '"#173eff"',
        description: "Color of the ripple effect circles.",
      },
      {
        name: "width",
        type: "string",
        required: false,
        default: '"auto"',
        description: "Width of the button (e.g., '200px', '100%').",
      },
      {
        name: "height",
        type: "string",
        required: false,
        default: '"auto"',
        description: "Height of the button (e.g., '50px').",
      },
    ],
  },

  [formatName("3D Perspective Card")]: {
    description:
      "A modern interactive 3D card component with dynamic lighting and depth effects based on mouse movement. Ideal for portfolios, product showcases, or visually engaging UI elements. Built with React and CSS.",

    import: ` import { ThreeDPerspectiveCard } from '@/components/lightswind/ThreeDPerspectiveCard';`,

    usage: `import { ThreeDPerspectiveCard } from '@/components/lightswind/ThreeDPerspectiveCard';

<ThreeDPerspectiveCard
  image="/images/sample.jpg"
  title="Explore 3D"
  width="300px"
  height="350px"
  titleFontSize="35px"
/> `,

    props: [
      {
        name: "image",
        type: "string",
        required: true,
        default: "-",
        description: "The background image URL for the 3D card.",
      },

      {
        name: "width",
        type: "string",
        required: false,
        default: '"300px"',
        description: "Width of the 3D card.",
      },
      {
        name: "height",
        type: "string",
        required: false,
        default: '"350px"',
        description: "Height of the 3D card.",
      },
    ],
  },

  [formatName("3d Model Viewer")]: {
    description:
      "An interactive 3D model viewer component for a variety of file formats including GLTF, GLB, FBX, and OBJ. It features dynamic lighting, environmental presets, and full user control over rotation and zoom. It's a versatile component for displaying 3D assets in web applications.",

    import: ` import ModelViewer from '@/components/lightswind/ModelViewer';`,

    usage: `import ModelViewer from '@/components/lightswind/ModelViewer';

<ModelViewer
  url="https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/FlightHelmet/glTF/FlightHelmet.gltf"
  autoRotate={true}
  autoRotateSpeed={1.0}
  environmentPreset="studio"
/>`,

    props: [
      {
        name: "url",
        type: "string",
        required: true,
        default: "-",
        description:
          "The URL of the 3D model file to be loaded (e.g., .gltf, .glb, .fbx, .obj).",
      },

      {
        name: "width",
        type: "string | number",
        required: false,
        default: '"100%"',
        description: "The width of the viewer container.",
      },
      {
        name: "height",
        type: "string | number",
        required: false,
        default: '"100%"',
        description: "The height of the viewer container.",
      },
      {
        name: "defaultZoom",
        type: "number",
        required: false,
        default: "2",
        description: "The initial zoom level of the camera.",
      },
      {
        name: "minZoomDistance",
        type: "number",
        required: false,
        default: "0.5",
        description: "The minimum distance the camera can zoom in.",
      },
      {
        name: "maxZoomDistance",
        type: "number",
        required: false,
        default: "10",
        description: "The maximum distance the camera can zoom out.",
      },
      {
        name: "enableManualRotation",
        type: "boolean",
        required: false,
        default: "true",
        description:
          "Enables or disables manual camera rotation with mouse or touch.",
      },
      {
        name: "enableManualZoom",
        type: "boolean",
        required: false,
        default: "true",
        description:
          "Enables or disables manual camera zooming with mouse wheel or pinch gesture.",
      },
      {
        name: "ambientIntensity",
        type: "number",
        required: false,
        default: "0.3",
        description: "Intensity of the ambient light in the scene.",
      },
      {
        name: "keyLightIntensity",
        type: "number",
        required: false,
        default: "1",
        description: "Intensity of the main directional light.",
      },
      {
        name: "fillLightIntensity",
        type: "number",
        required: false,
        default: "0.5",
        description: "Intensity of the fill directional light.",
      },
      {
        name: "rimLightIntensity",
        type: "number",
        required: false,
        default: "0.8",
        description: "Intensity of the rim directional light.",
      },
      {
        name: "environmentPreset",
        type: "string",
        required: false,
        default: '"forest"',
        description:
          "A pre-configured environment preset for lighting and reflections. Options: 'city', 'sunset', 'night', 'dawn', 'studio', 'apartment', 'forest', 'park', 'none'.",
      },
      {
        name: "autoRotate",
        type: "boolean",
        required: false,
        default: "false",
        description: "If true, the model will automatically rotate.",
      },
      {
        name: "autoRotateSpeed",
        type: "number",
        required: false,
        default: "0.35",
        description: "Speed of the auto-rotation.",
      },
      {
        name: "onModelLoaded",
        type: "() => void",
        required: false,
        default: "-",
        description:
          "Callback function triggered when the 3D model has finished loading.",
      },
    ],
  },

  [formatName("Scroll Carousel")]: {
    description:
      "A responsive and animated scrollable carousel that displays feature cards. On desktop, it provides smooth horizontal scrolling with GSAP + ScrollTrigger pinning and progress tracking. On mobile, it animates cards vertically with fade-in and slide effects. Supports dynamic rows, custom max scroll height, and animated progress bar.",

    import: `import ScrollCarousel from '@/components/lightswind/ScrollCarousel';`,

    usage: `import ScrollCarousel from '@/components/lightswind/ScrollCarousel';

const features = [
  {
    icon: Send,
    title: "Instant Payments",
    description: "Send money anywhere in the world instantly.",
    image: "https://images.pexels.com/photos/9934462/pexels-photo-9934462.jpeg",
  },
  {
    icon: Globe,
    title: "Global Access",
    description: "Access your wallet from any device worldwide.",
    image: "https://images.pexels.com/photos/6988085/pexels-photo-6988085.jpeg",
  },
  {
    icon: Shield,
    title: "Secure Transactions",
    description: "Your payments are protected with top-level security.",
    image: "https://images.pexels.com/photos/6863184/pexels-photo-6863184.jpeg",
  },
];

<ScrollCarousel
  features={features}
  className="my-20"
  maxScrollHeight={2000}
/>`,

    props: [
      {
        name: "features",
        type: "FeatureItem[]",
        required: true,
        default: "-",
        description:
          "Array of feature objects, each containing icon, title, description, and optional image.",
      },
      {
        name: "className",
        type: "string",
        required: false,
        default: '"-"',
        description:
          "Additional CSS/Tailwind classes to apply to the main container.",
      },
      {
        name: "maxScrollHeight",
        type: "number",
        required: false,
        default: "calculated dynamically",
        description:
          "Sets a maximum scroll distance for the horizontal scroll effect on desktop.",
      },
    ],
  },

  [formatName("Trial Button")]: {
    description:
      "A reusable, animated button component with a shiny gradient effect. " +
      "It integrates Tailwind CSS for base styling and custom CSS for advanced gradient " +
      "animations, pseudo-elements for shimmer effects, and hover/focus interactions. " +
      "Supports light and dark themes automatically.",

    import: `import { TrialButton } from '@/components/lightswind/TrialButton';`,

    usage: `import { TrialButton } from '@/components/lightswind/TrialButton';

<TrialButton onClick={() => console.log("Trial started!")}>
  Start Free Trial
</TrialButton>`,

    props: [
      {
        name: "children",
        type: "React.ReactNode",
        required: true,
        default: "-",
        description: "The text or elements to display inside the button.",
      },
      {
        name: "onClick",
        type: "(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void",
        required: false,
        default: "-",
        description: "Callback function that runs when the button is clicked.",
      },
      {
        name: "className",
        type: "string",
        required: false,
        default: "-",
        description:
          "Additional Tailwind or custom CSS classes to apply to the button.",
      },
      {
        name: "disabled",
        type: "boolean",
        required: false,
        default: "false",
        description: "Disables the button and prevents interactions.",
      },
    ],
  },

  [formatName("3D Scroll Trigger")]: {
    description:
      "A high-performance horizontal scroll component with smooth, velocity-based animation. " +
      "Automatically repeats its children for an infinite 3D-like scrolling effect, ideal for galleries, tickers, or interactive carousels.",
    import: `import { 
    ThreeDScrollTriggerContainer, 
    ThreeDScrollTriggerRow 
  } from '@/components/lightswind/ThreeDScrollTrigger';`,

    usage: `import { 
    ThreeDScrollTriggerContainer, 
    ThreeDScrollTriggerRow 
  } from '@/components/lightswind/ThreeDScrollTrigger';

<ThreeDScrollTriggerContainer>
  <ThreeDScrollTriggerRow baseVelocity={5} direction={1}>
    <div className="px-4 py-2 bg-primarylw text-white rounded-lg">
      Item 1
    </div>
    <div className="px-4 py-2 bg-green-500 text-white rounded-lg">
      Item 2
    </div>
    <div className="px-4 py-2 bg-red-500 text-white rounded-lg">
      Item 3
    </div>
  </ThreeDScrollTriggerRow>
</ThreeDScrollTriggerContainer>`,

    props: [
      {
        name: "children",
        type: "React.ReactNode",
        required: true,
        default: "-",
        description:
          "The elements to display inside the scrolling row. Each child will be repeated to create an infinite scroll effect.",
      },
      {
        name: "baseVelocity",
        type: "number",
        required: false,
        default: "5",
        description:
          "Controls the base speed of the scroll in pixels per second. Positive values scroll right, negative scroll left.",
      },
      {
        name: "direction",
        type: "1 | -1",
        required: false,
        default: "1",
        description:
          "Sets the direction of the scroll. `1` moves the content to the right, `-1` moves it to the left. Scroll velocity from the page scroll will be factored in automatically.",
      },
      {
        name: "className",
        type: "string",
        required: false,
        default: "-",
        description:
          "Additional Tailwind or custom CSS classes applied to the container or row.",
      },
    ],
  },

  [formatName("Aurora Shader")]: {
    description:
      "A high-performance, interactive aurora shader effect rendered with WebGL via OGL. " +
      "It displays dynamic, colorful aurora waves that respond smoothly to mouse movement and " +
      "time, creating an immersive visual effect suitable for backgrounds or hero sections.",

    import: `import AuroraShader from '@/components/lightswind/AuroraShader';`,

    usage: `import AuroraShader from '@/components/lightswind/AuroraShader';

<AuroraShader
  colorStops={['#5227FF', '#7cff67', '#5227FF']}
  amplitude={1.0}
  blend={0.5}
  speed={1.0}
/>`,

    props: [
      {
        name: "colorStops",
        type: "string[]",
        required: false,
        default: "['#5227FF', '#7cff67', '#5227FF']",
        description:
          "An array of three colors defining the gradient of the aurora. Colors are interpolated " +
          "from left to right across the screen.",
      },
      {
        name: "amplitude",
        type: "number",
        required: false,
        default: "1.0",
        description:
          "Controls the height or strength of the wave distortion. Higher values produce taller, more exaggerated aurora waves.",
      },
      {
        name: "blend",
        type: "number",
        required: false,
        default: "0.5",
        description:
          "Determines the softness of the wave edges. Smaller values create sharper edges, larger values produce smoother transitions.",
      },
      {
        name: "speed",
        type: "number",
        required: false,
        default: "1.0",
        description:
          "Controls the animation speed of the aurora. Higher values make the aurora flow faster.",
      },
      {
        name: "className",
        type: "string",
        required: false,
        default: "'w-full h-full absolute bottom-0'",
        description:
          "Custom Tailwind or CSS classes applied to the container wrapping the aurora shader canvas.",
      },
    ],
  },

  [formatName("Sparkle Navbar")]: {
    description:
      "A reusable, animated navigation menu component built with React, TypeScript, and GSAP. " +
      "It features a dynamic active state indicator with a glowing strike-through effect, " +
      "smooth transitions, and customizable colors. Ideal for modern websites needing " +
      "interactive navigation with engaging micro-animations.",

    import: `import SparkleNavbar from '@/components/lightswind/SparkleNavbar';`,

    usage: `import SparkleNavbar from '@/components/lightswind/SparkleNavbar';

<SparkleNavbar
  items={['Home', 'About', 'Services', 'Contact']}
  color="#1E90FF"
/>`,

    props: [
      {
        name: "items",
        type: "string[]",
        required: true,
        default: "[]",
        description:
          "An array of strings representing the navigation menu items. " +
          "Each string is rendered as a clickable button in the navigation bar.",
      },
      {
        name: "color",
        type: "string",
        required: false,
        default: "'#00fffc'",
        description:
          "The accent color used for active states, text shadows, box shadows, " +
          "and glowing strike-through animations. Accepts any valid CSS color value.",
      },
    ],
  },


  [formatName("Iphone16 Pro")]: {
    description:
      "A high-fidelity, reusable iPhone 16 Pro SVG component built with React and TypeScript. " +
      "It supports displaying images or videos on the screen, a dynamic island, camera dot, " +
      "and customizable frame, bezel, and screen properties. Ideal for showcasing mobile app " +
      "mockups, interactive demos, or marketing visuals with realistic device frames.",

    import: `import { Iphone16Pro } from '@/components/lightswind/Iphone16Pro';`,

    usage: `import { Iphone16Pro } from '@/components/lightswind/Iphone16Pro';

<Iphone16Pro
  width={433}
  height={882}
  src="/path/to/image.jpg"
  videoSrc="/path/to/video.mp4"
  showIsland={true}
  islandWidth={130}
  islandHeight={40}
  frameColor="white"
  frameDarkColor="black"
  bezelColor="neutral-100"
  screenRadius={55}
  shadow={true}
  rounded={true}
  contentClassName="object-cover"
  contentStyle={{ borderRadius: '55px' }}
  showCamera={true}
  screenGradient="#ff00ff,#00ffff"
  hoverAnimation={true}
/>`,

    props: [
      {
        name: "width",
        type: "number",
        required: false,
        default: "433",
        description: "The overall width of the iPhone frame in pixels.",
      },
      {
        name: "height",
        type: "number",
        required: false,
        default: "882",
        description: "The overall height of the iPhone frame in pixels.",
      },
      {
        name: "src",
        type: "string",
        required: false,
        default: "undefined",
        description: "The URL of an image to display on the phone screen.",
      },
      {
        name: "videoSrc",
        type: "string",
        required: false,
        default: "undefined",
        description: "The URL of a video to display on the phone screen. Auto-plays, loops, and is muted.",
      },
      {
        name: "showIsland",
        type: "boolean",
        required: false,
        default: "true",
        description: "Whether to display the dynamic island at the top of the screen.",
      },
      {
        name: "islandWidth",
        type: "number",
        required: false,
        default: "125",
        description: "The width of the dynamic island in pixels.",
      },
      {
        name: "islandHeight",
        type: "number",
        required: false,
        default: "40",
        description: "The height of the dynamic island in pixels.",
      },
      {
        name: "frameColor",
        type: "string",
        required: false,
        default: "'white'",
        description: "The color of the iPhone frame in light mode. Accepts any valid CSS color.",
      },
      {
        name: "frameDarkColor",
        type: "string",
        required: false,
        default: "'black'",
        description: "The color of the iPhone frame in dark mode. Accepts any valid CSS color.",
      },
      {
        name: "bezelColor",
        type: "string",
        required: false,
        default: "'neutral-100'",
        description: "The color of the bezel around the screen. Accepts any valid CSS color.",
      },
      {
        name: "screenRadius",
        type: "number",
        required: false,
        default: "55",
        description: "The border radius of the screen area, controlling how rounded the corners are.",
      },
      {
        name: "shadow",
        type: "boolean",
        required: false,
        default: "true",
        description: "Whether to apply a drop shadow to the iPhone frame.",
      },
      {
        name: "rounded",
        type: "boolean",
        required: false,
        default: "true",
        description: "Whether the iPhone frame corners should be rounded.",
      },
      {
        name: "contentClassName",
        type: "string",
        required: false,
        default: "''",
        description: "Custom CSS class for the image or video displayed inside the screen.",
      },
      {
        name: "contentStyle",
        type: "React.CSSProperties",
        required: false,
        default: "{}",
        description: "Custom inline styles applied to the image or video inside the screen.",
      },
      {
        name: "showCamera",
        type: "boolean",
        required: false,
        default: "true",
        description: "Whether to display the camera dot near the top of the screen.",
      },
      {
        name: "screenGradient",
        type: "string",
        required: false,
        default: "undefined",
        description: "Optional gradient overlay for the screen background. Format: 'color1,color2'.",
      },
      {
        name: "hoverAnimation",
        type: "boolean",
        required: false,
        default: "true",
        description: "Whether to apply subtle hover animation on the phone frame.",
      },
    ],
  },


  [formatName("Breadcrumb")]: {
    description:
      "A flexible, accessible breadcrumb navigation component built with React and TypeScript. " +
      "It supports links, pages, separators, ellipsis, and custom child elements, " +
      "allowing users to easily indicate their current location in a hierarchy.",

    import: `import { 
    Breadcrumb, 
    BreadcrumbList, 
    BreadcrumbItem, 
    BreadcrumbLink, 
    BreadcrumbPage, 
    BreadcrumbSeparator, 
    BreadcrumbEllipsis 
  } from '@/components/lightswind/Breadcrumb';`,

    usage: `import { 
    Breadcrumb, 
    BreadcrumbList, 
    BreadcrumbItem, 
    BreadcrumbLink, 
    BreadcrumbPage, 
    BreadcrumbSeparator, 
    BreadcrumbEllipsis 
  } from '@/components/lightswind/Breadcrumb';

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
      <BreadcrumbSeparator />
    </BreadcrumbItem>
    <BreadcrumbItem>
      <BreadcrumbLink href="/components">Components</BreadcrumbLink>
      <BreadcrumbSeparator />
    </BreadcrumbItem>
    <BreadcrumbItem>
      <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>`,

    props: [
      {
        name: "Breadcrumb",
        type: "React.FC",
        required: true,
        default: "-",
        description:
          "The root wrapper for the breadcrumb navigation. Accepts any children, typically a BreadcrumbList.",
      },
      {
        name: "BreadcrumbList",
        type: "React.FC",
        required: true,
        default: "-",
        description:
          "Wraps all breadcrumb items and handles layout styling such as spacing and text size.",
      },
      {
        name: "BreadcrumbItem",
        type: "React.FC",
        required: true,
        default: "-",
        description:
          "Represents a single breadcrumb item. Should contain either BreadcrumbLink or BreadcrumbPage and optionally a BreadcrumbSeparator.",
      },
      {
        name: "BreadcrumbLink",
        type: "React.FC<{ href?: string; asChild?: boolean }>",
        required: false,
        default: "-",
        description:
          "Renders a clickable breadcrumb link. If `asChild` is true, the link can wrap a custom React element.",
      },
      {
        name: "BreadcrumbPage",
        type: "React.FC",
        required: false,
        default: "-",
        description:
          "Renders the current page as plain text. Has aria attributes for accessibility.",
      },
      {
        name: "BreadcrumbSeparator",
        type: "React.FC",
        required: false,
        default: "<ChevronRight />",
        description:
          "Renders a visual separator between breadcrumb items. Can accept custom children or defaults to a ChevronRight icon.",
      },
      {
        name: "BreadcrumbEllipsis",
        type: "React.FC",
        required: false,
        default: "<MoreHorizontal />",
        description:
          "Displays an ellipsis icon for collapsed breadcrumb items. Typically used in responsive or long breadcrumb paths.",
      },
    ],
  },




  [formatName("Pagination")]: {
    description:
      "A fully accessible pagination component built with React and TypeScript. " +
      "It provides navigation controls for multi-page content, including page numbers, previous/next buttons, and ellipsis for collapsed pages.",

    import: `import { 
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis
  } from '@/components/lightswind/Pagination';`,

    usage: `import { 
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis
  } from '@/components/lightswind/Pagination';

<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious href="#" />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#" isActive>
        1
      </PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">2</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationEllipsis />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">5</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationNext href="#" />
    </PaginationItem>
  </PaginationContent>
</Pagination>`,

    props: [
      {
        name: "Pagination",
        type: "React.FC<React.ComponentProps<'nav'>>",
        required: true,
        default: "-",
        description:
          "The root wrapper for the pagination navigation. Renders as a `<nav>` element with proper aria-label for accessibility.",
      },
      {
        name: "PaginationContent",
        type: "React.FC<React.ComponentProps<'ul'>>",
        required: true,
        default: "-",
        description:
          "Wraps all pagination items inside a `<ul>`. Handles flexbox layout for aligning page controls.",
      },
      {
        name: "PaginationItem",
        type: "React.FC<React.ComponentProps<'li'>>",
        required: true,
        default: "-",
        description:
          "Represents a single pagination item. Typically wraps `PaginationLink`, `PaginationPrevious`, `PaginationNext`, or `PaginationEllipsis`.",
      },
      {
        name: "PaginationLink",
        type: "React.FC<{ isActive?: boolean; sizeValue?: 'default' | 'sm' | 'lg' | 'icon' } & React.ComponentProps<'a'>>",
        required: false,
        default: "sizeValue = 'icon'",
        description:
          "Renders an individual page link. Supports an `isActive` state for the current page and allows size customization.",
      },
      {
        name: "PaginationPrevious",
        type: "React.FC<React.ComponentProps<typeof PaginationLink>>",
        required: false,
        default: "-",
        description:
          "Renders a button to navigate to the previous page. Includes a left chevron icon and accessible label.",
      },
      {
        name: "PaginationNext",
        type: "React.FC<React.ComponentProps<typeof PaginationLink>>",
        required: false,
        default: "-",
        description:
          "Renders a button to navigate to the next page. Includes a right chevron icon and accessible label.",
      },
      {
        name: "PaginationEllipsis",
        type: "React.FC<React.ComponentProps<'span'>>",
        required: false,
        default: "<MoreHorizontal />",
        description:
          "Displays an ellipsis icon to represent collapsed page numbers. Useful for long paginations.",
      },
    ],
  },





  [formatName("Sidebar")]: {
    description:
      "A fully featured, animated, and accessible sidebar component system built with React, TypeScript, and Framer Motion. " +
      "It supports collapsible behavior, active menu indicators, grouping, headers, footers, and smooth animations.",

    import: `import { 
    SidebarProvider,
    useSidebar,
    SidebarRoot as Sidebar,
    SidebarTrigger,
    SidebarHeader,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarFooter,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton
  } from "@/components/lightswind/Sidebar";`,

    usage: `import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/lightswind/Sidebar";

<SidebarProvider defaultExpanded>
  <Sidebar>
    <SidebarHeader>
      <span className="font-bold">My App</span>
      <SidebarTrigger />
    </SidebarHeader>

    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Main</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem value="dashboard">
              <SidebarMenuButton>Dashboard</SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem value="settings">
              <SidebarMenuButton>Settings</SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>

    <SidebarFooter>
      <span>Footer content</span>
    </SidebarFooter>
  </Sidebar>
</SidebarProvider>`,

    props: [
      {
        name: "SidebarProvider",
        type: "React.FC<{ defaultExpanded?: boolean; expanded?: boolean; onExpandedChange?: (expanded: boolean) => void }>",
        required: true,
        default: "defaultExpanded = true",
        description:
          "Context provider for the sidebar system. Manages expanded/collapsed state, active menu item, and indicator positioning. Supports controlled and uncontrolled modes.",
      },
      {
        name: "useSidebar",
        type: "() => SidebarContextType",
        required: false,
        default: "-",
        description:
          "Hook to access the sidebar context. Provides state (`expanded`, `activeMenuItem`) and actions (`setActiveMenuItem`, `onChange`, `updateIndicatorPosition`).",
      },
      {
        name: "Sidebar (SidebarRoot)",
        type: "React.FC<React.HTMLAttributes<HTMLDivElement>>",
        required: true,
        default: "-",
        description:
          "The root wrapper for the sidebar. Handles positioning, expanded/collapsed behavior, and base styles.",
      },
      {
        name: "SidebarTrigger",
        type: "React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>>",
        required: false,
        default: "-",
        description:
          "A button that toggles the sidebar open or closed. Automatically switches between left/right chevron icons based on state.",
      },
      {
        name: "SidebarHeader",
        type: "React.FC<React.HTMLAttributes<HTMLDivElement>>",
        required: false,
        default: "-",
        description:
          "The header section of the sidebar. Often used to display app name/logo and the trigger button.",
      },
      {
        name: "SidebarContent",
        type: "React.FC<React.HTMLAttributes<HTMLDivElement>>",
        required: false,
        default: "-",
        description:
          "The scrollable main content area of the sidebar. Contains groups and menus.",
      },
      {
        name: "SidebarGroup",
        type: "React.FC<React.HTMLAttributes<HTMLDivElement>>",
        required: false,
        default: "-",
        description:
          "A container for logically grouping menu items. Typically contains a label and group content.",
      },
      {
        name: "SidebarGroupLabel",
        type: "React.FC<React.HTMLAttributes<HTMLDivElement>>",
        required: false,
        default: "-",
        description:
          "Displays a label for a group of items. Automatically hidden when the sidebar is collapsed.",
      },
      {
        name: "SidebarGroupContent",
        type: "React.FC<React.HTMLAttributes<HTMLDivElement>>",
        required: false,
        default: "-",
        description:
          "Holds the actual menu items inside a group.",
      },
      {
        name: "SidebarFooter",
        type: "React.FC<React.HTMLAttributes<HTMLDivElement>>",
        required: false,
        default: "-",
        description:
          "Footer section of the sidebar. Often used for secondary links or actions.",
      },
      {
        name: "SidebarMenu",
        type: "React.FC<React.HTMLAttributes<HTMLDivElement>>",
        required: false,
        default: "-",
        description:
          "Wrapper for menu items. Also manages the animated indicator that highlights the active item.",
      },
      {
        name: "SidebarMenuItem",
        type: "React.FC<{ value?: string } & Omit<React.HTMLAttributes<HTMLDivElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'onAnimationEnd'>>",
        required: false,
        default: "value = auto-generated ID",
        description:
          "Represents a single sidebar menu item. Registers itself for indicator positioning and in-view animations.",
      },
      {
        name: "SidebarMenuButton",
        type: "React.FC<{ asChild?: boolean; value?: string } & React.HTMLAttributes<HTMLDivElement>>",
        required: false,
        default: "asChild = false",
        description:
          "Clickable menu button inside a menu item. Handles active state, animations, and styling for expanded/collapsed modes. Supports `asChild` to pass custom elements.",
      },
    ],
  },



  [formatName("Plasma Globe")]: {
    description:
      "A dynamic and visually striking plasma globe background component built with React and OGL. " +
      "It renders a fully animated plasma sphere with multiple filaments, supporting real-time mouse interaction, speed, and intensity control. " +
      "The background is transparent by default, allowing users to overlay any custom background color.",

    import: `import PlasmaGlobe from '@/components/PlasmaGlobe';`,

    usage: `import PlasmaGlobe from '@/components/PlasmaGlobe';

<PlasmaGlobe 
  speed={1.2} 
  intensity={1.5} 
/>`,

    props: [
      {
        name: "speed",
        type: "number",
        required: false,
        default: "1.0",
        description:
          "Controls the global speed of the plasma animation. Higher values make the filaments move faster.",
      },
      {
        name: "intensity",
        type: "number",
        required: false,
        default: "1.0",
        description:
          "Controls the brightness and color intensity of the plasma filaments. Higher values produce more vivid colors.",
      },
    ]
  },




  [formatName("Toggle Theme")]: {
    description:
      "An accessible button component that toggles between light and dark themes, " +
      "utilizing the modern View Transition API for smooth, customizable full-page animations.",

    import: `import { ToggleTheme } from "@/components/lightswind/toggle-theme";`,

    usage: `// 1. Simple usage with default 'circle-spread' animation
<ToggleTheme />

// 2. Controlled duration and custom animation
<ToggleTheme
  duration={600}
  animationType="diag-down-right"
  className="bg-gray-100 dark:bg-gray-700"
/>`,

    props: [
      {
        name: "ToggleTheme",
        type: "React.FC<ToggleThemeProps>",
        required: true,
        default: "-",
        description:
          "The primary button component that controls and animates the theme toggle. Observes the `dark` class on the `documentElement`.",
      },
      {
        name: "duration",
        type: "number",
        required: false,
        default: "400",
        description:
          "The duration of the CSS or Web Animation API animation in milliseconds.",
      },
      {
        name: "animationType",
        type: `AnimationType | undefined`,
        required: false,
        default: `"circle-spread"`,
        description:
          "The specific type of animation to run via the View Transition API. Options include spatial wipes, morphs, and fades.",
      },
      {
        name: "AnimationType (Type Definition)",
        type: `"none" | "circle-spread" | "round-morph" | "swipe-left" | "swipe-up" | "diag-down-right" | "fade-in-out" | "shrink-grow" | "flip-x-in" | "split-vertical" | "swipe-right" | "swipe-down" | "wave-ripple"`,
        required: false,
        default: "-",
        description:
          "The union type defining all available animation effects for the full-page transition.",
      },
    ],
  },







  [formatName("Beam Circle")]: {
    description:
      "A dynamic, orbit-based visual component where icons revolve around a customizable center element. " +
      "It simulates rotating energy beams or planetary motion with full Framer Motion animation control. " +
      "Perfect for loaders, dashboards, hero animations, or brand identity effects.",

    import: `import { BeamCircle } from "@/components/lightswind/beam-circle";`,

    usage: `// 1. Default beam circle with animated orbits
<BeamCircle />

// 2. Custom size, center icon, orbit colors, and line thickness
<BeamCircle
  size={400}
  centerIcon={<Zap className="text-yellow-400" size={40} />}
  orbits={[
    {
      id: 1,
      radiusFactor: 0.25,
      speed: 10,
      icon: <MessageSquare className="text-primarylw" />,
      iconSize: 24,
      orbitColor: "rgba(0, 150, 255, 0.3)",
      orbitThickness: 3,
    },
    {
      id: 2,
      radiusFactor: 0.55,
      speed: 14,
      icon: <Briefcase className="text-green-400" />,
      iconSize: 30,
      orbitThickness: 2,
    },
  ]}
/>`,


    props: [
      {
        name: "BeamCircle",
        type: "React.FC<BeamCircleProps>",
        required: true,
        default: "-",
        description:
          "The main animated component that renders multiple orbiting icons around a central animated element. Built with Framer Motion and Lucide icons.",
      },
      {
        name: "size",
        type: "number",
        required: false,
        default: "300",
        description:
          "The overall diameter of the circular animation area, controlling both orbit radii and center size.",
      },
      {
        name: "centerIcon",
        type: "React.ReactNode",
        required: false,
        default: "<Sun />",
        description:
          "The central icon or React node rendered at the center. Accepts any valid React element, such as Lucide icons or custom components.",
      },
      {
        name: "orbits",
        type: "OrbitConfig[]",
        required: false,
        default: "Default pre-configured orbits with 4 rotating icons",
        description:
          "An array of orbit configuration objects defining radius, color, animation speed, icon, and line thickness for each orbit.",
      },
      {
        name: "OrbitConfig (Type Definition)",
        type: `{
  id: number;
  radiusFactor: number; // factor of total size
  speed: number; // rotation duration (seconds)
  icon: React.ReactNode; // orbiting icon
  iconSize: number;
  orbitColor?: string; // custom border color
  orbitThickness?: number; // line thickness (px)
}`,
        required: false,
        default: "-",
        description:
          "Defines a single orbit ring's characteristics and motion properties. Each orbit moves independently with smooth looping animation.",
      },
    ],
  },








  [formatName("Chain Carousel")]: {
    description:
      "A horizontally scrolling carousel component for displaying blockchain chains, tokens, or custom items. " +
      "It features auto-scroll with smooth Framer Motion animations, center highlighting, left/right mirrored displays, " +
      "and an interactive search dropdown for selecting and focusing on specific items. " +
      "Perfect for dashboards, explorers, and interactive listings.",

    import: `import ChainCarousel from "@/components/lightswind/chain-carousel";`,

    usage: `// 1. Default carousel with auto-scroll
<ChainCarousel items={chainsList} />

// 2. Custom visible items, scroll speed, and selection callback
<ChainCarousel
  items={chainsList}
  visibleItemCount={7}
  scrollSpeedMs={2000}
  onChainSelect={(id, name) => console.log("Selected:", id, name)}
/>`,

    props: [
      {
        name: "items",
        type: "ChainItem[]",
        required: true,
        default: "-",
        description:
          "Array of items to display in the carousel. Each item must include `id`, `name`, and an icon, with optional `details` and `logo`.",
      },
      {
        name: "scrollSpeedMs",
        type: "number",
        required: false,
        default: "1500",
        description:
          "Time in milliseconds between auto-scroll steps. Controls the rotation speed of the carousel.",
      },
      {
        name: "visibleItemCount",
        type: "number",
        required: false,
        default: "9",
        description:
          "The number of carousel items visible at once. Should be an odd number to keep a center-focused item.",
      },
      {
        name: "className",
        type: "string",
        required: false,
        default: "-",
        description: "Optional custom class name for the main container div.",
      },
      {
        name: "onChainSelect",
        type: "(chainId: ChainItem['id'], chainName: string) => void",
        required: false,
        default: "-",
        description:
          "Callback fired when a chain/item is selected from the search dropdown. Receives the item's ID and name.",
      },
      {
        name: "ChainItem (Type Definition)",
        type: `{
  id: string | number;       // Unique identifier
  name: string;              // Display name
  icon: LucideIcon;          // Lucide icon component
  details?: string;          // Optional secondary line or description
  logo?: string;             // Optional image URL for the item
}`,
        required: true,
        default: "-",
        description:
          "Defines the structure for a single carousel item, including icon, optional details, and optional logo image.",
      },
    ],
  },






  [formatName("Interactive Grid Background")]: {
    description:
      "A fully interactive grid background component with glowing trails and idle animations. " +
      "The grid reacts to mouse movement, creating a smooth trail effect, and automatically animates random cells when idle. " +
      "Supports light/dark mode, glow effects, and optional fade overlays for visual depth.",

    import: `import InteractiveGridBackground from "@/components/lightswind/interactive-grid-background";`,

    usage: `// 1. Default interactive grid background
<InteractiveGridBackground />

// 2. Custom grid size, colors, trail, and glow
<InteractiveGridBackground
  gridSize={40}
  gridColor="#d1d5db"
  darkGridColor="#1f2937"
  effectColor="rgba(0,255,255,0.5)"
  darkEffectColor="rgba(255,0,255,0.5)"
  trailLength={5}
  glow
  glowRadius={30}
  showFade
  fadeIntensity={25}
/>

// 3. With overlay content
<InteractiveGridBackground>
  <h1 className="text-white text-3xl">Welcome!</h1>
</InteractiveGridBackground>`,

    props: [
      {
        name: "gridSize",
        type: "number",
        required: false,
        default: "50",
        description: "Size of each grid cell in pixels."
      },
      {
        name: "gridColor",
        type: "string",
        required: false,
        default: "#e5e7eb",
        description: "Color of the grid lines in light mode."
      },
      {
        name: "darkGridColor",
        type: "string",
        required: false,
        default: "#27272a",
        description: "Color of the grid lines in dark mode."
      },
      {
        name: "effectColor",
        type: "string",
        required: false,
        default: "rgba(0,0,0,0.5)",
        description: "Trail/glow color in light mode."
      },
      {
        name: "darkEffectColor",
        type: "string",
        required: false,
        default: "rgba(255,255,255,0.5)",
        description: "Trail/glow color in dark mode."
      },
      {
        name: "trailLength",
        type: "number",
        required: false,
        default: "3",
        description: "Number of previous cells to display as a fading trail."
      },
      {
        name: "width",
        type: "number",
        required: false,
        default: "window.innerWidth",
        description: "Width of the canvas in pixels."
      },
      {
        name: "height",
        type: "number",
        required: false,
        default: "window.innerHeight",
        description: "Height of the canvas in pixels."
      },
      {
        name: "idleSpeed",
        type: "number",
        required: false,
        default: "0.2",
        description: "Speed of idle animation when mouse is inactive."
      },
      {
        name: "glow",
        type: "boolean",
        required: false,
        default: "true",
        description: "Whether the trail cells have a glowing effect."
      },
      {
        name: "glowRadius",
        type: "number",
        required: false,
        default: "20",
        description: "Blur radius of the glow effect."
      },
      {
        name: "children",
        type: "React.ReactNode",
        required: false,
        default: "-",
        description: "Any content to overlay on top of the grid."
      },
      {
        name: "showFade",
        type: "boolean",
        required: false,
        default: "true",
        description: "Whether to display a fading overlay mask."
      },
      {
        name: "fadeIntensity",
        type: "number",
        required: false,
        default: "20",
        description: "Controls how far the fade extends (percentage)."
      },
      {
        name: "idleRandomCount",
        type: "number",
        required: false,
        default: "5",
        description: "Number of randomly moving cells during idle state."
      },
    ],
  },






  [formatName("Beam Grid Background")]: {
    description:
      "A visually dynamic grid background with animated beam effects and interactive highlights. " +
      "Beams move across the grid in both X and Y directions, with optional glow effects and multi-level highlights around the mouse pointer. " +
      "Supports light/dark mode, idle animations, and optional fade overlays. Ideal for hero sections, dashboards, or any immersive UI background.",

    import: `import BeamGridBackground from "@/components/lightswind/beam-grid-background";`,

    usage: `// 1. Default Beam Grid Background
<BeamGridBackground />

// 2. Custom beam colors, speed, glow, and count
<BeamGridBackground
  gridSize={40}
  gridColor="#d1d5db"
  darkGridColor="#1f2937"
  beamColor="rgba(0,180,255,0.8)"
  darkBeamColor="rgba(0,255,255,0.8)"
  beamCount={8}
  extraBeamCount={3}
  beamThickness={3}
  beamGlow
  glowIntensity={50}
  idleSpeed={1.15}
/>

// 3. Render as a regular container (not background) with children overlay
<BeamGridBackground asBackground={false}>
  <h1 className="text-white text-3xl">Welcome!</h1>
</BeamGridBackground>`,

    props: [
      {
        name: "gridSize",
        type: "number",
        required: false,
        default: "40",
        description: "Size of each grid cell in pixels."
      },
      {
        name: "gridColor",
        type: "string",
        required: false,
        default: "#e5e7eb",
        description: "Color of the grid lines in light mode."
      },
      {
        name: "darkGridColor",
        type: "string",
        required: false,
        default: "#27272a",
        description: "Color of the grid lines in dark mode."
      },
      {
        name: "beamColor",
        type: "string",
        required: false,
        default: "rgba(0,180,255,0.8)",
        description: "Color of the beams in light mode."
      },
      {
        name: "darkBeamColor",
        type: "string",
        required: false,
        default: "rgba(0,255,255,0.8)",
        description: "Color of the beams in dark mode."
      },
      {
        name: "beamSpeed",
        type: "number",
        required: false,
        default: "0.1",
        description: "Base speed of the beam animation."
      },
      {
        name: "beamThickness",
        type: "number",
        required: false,
        default: "3",
        description: "Line width of the beams."
      },
      {
        name: "beamGlow",
        type: "boolean",
        required: false,
        default: "true",
        description: "Whether beams have a glowing effect."
      },
      {
        name: "glowIntensity",
        type: "number",
        required: false,
        default: "50",
        description: "Intensity of the glow effect."
      },
      {
        name: "beamCount",
        type: "number",
        required: false,
        default: "8",
        description: "Number of primary moving beams."
      },
      {
        name: "extraBeamCount",
        type: "number",
        required: false,
        default: "3",
        description: "Number of additional secondary beams for visual richness."
      },
      {
        name: "idleSpeed",
        type: "number",
        required: false,
        default: "1.15",
        description: "Multiplier for beam speed when in idle (no mouse movement)."
      },
      {
        name: "interactive",
        type: "boolean",
        required: false,
        default: "true",
        description: "Whether mouse movement triggers multi-level interactive highlights."
      },
      {
        name: "asBackground",
        type: "boolean",
        required: false,
        default: "true",
        description: "Whether the component behaves as a full-screen background."
      },
      {
        name: "showFade",
        type: "boolean",
        required: false,
        default: "true",
        description: "Whether to display a radial fade overlay mask."
      },
      {
        name: "fadeIntensity",
        type: "number",
        required: false,
        default: "20",
        description: "Controls how far the fade extends (percentage)."
      },
      {
        name: "className",
        type: "string",
        required: false,
        default: "-",
        description: "Optional custom class name for the main container div."
      },
      {
        name: "children",
        type: "React.ReactNode",
        required: false,
        default: "-",
        description: "Content rendered inside the grid when `asBackground` is false."
      },
    ],
  },








  [formatName("Electro Border")]: {
    description:
      "A dynamic animated border with an electric, distortion-based effect. " +
      "Supports optional glow and aura layers for an energized or minimal look.",

    import: `import ElectroBorder from "@/components/lightswind/electro-border";`,

    usage: `// 1. Default Electric Border
<ElectroBorder>
  <div className="p-8 text-white">Electric Energy!</div>
</ElectroBorder>

// 2. Only Electric Border (no glow or aura)
<ElectroBorder effects={false}>
  <div className="p-8 text-white">Pure Electric Border</div>
</ElectroBorder>

// 3. Electric Border with Glow Only
<ElectroBorder aura={false}>
  <div className="p-8 text-white">Glow Only</div>
</ElectroBorder>

// 4. Electric Border with Aura Only
<ElectroBorder glow={false}>
  <div className="p-8 text-white">Aura Only</div>
</ElectroBorder>

// 5. Custom speed, distortion, and color
<ElectroBorder
  borderColor="#00ffff"
  borderWidth={3}
  distortion={1.8}
  animationSpeed={1.5}
  glowBlur={40}
  glow
  aura
>
  <div className="p-10 text-white">Custom Lightning Frame</div>
</ElectroBorder>`,

    props: [
      {
        name: "borderColor",
        type: "string",
        required: false,
        default: "#00fffc",
        description: "Main color of the electric border."
      },
      {
        name: "borderWidth",
        type: "number",
        required: false,
        default: "2",
        description: "Thickness of the border in pixels."
      },
      {
        name: "distortion",
        type: "number",
        required: false,
        default: "1",
        description: "Intensity of the border’s distortion effect. Higher values create a wilder electric animation."
      },
      {
        name: "animationSpeed",
        type: "number",
        required: false,
        default: "0.8",
        description: "Speed multiplier for the electric animation. Increase to make movement faster."
      },
      {
        name: "radius",
        type: "string | number",
        required: false,
        default: "inherit",
        description: "Sets border corner radius (e.g. `8px` or `50%`)."
      },
      {
        name: "glow",
        type: "boolean",
        required: false,
        default: "true",
        description: "Toggles the glowing halo effect around the border."
      },
      {
        name: "aura",
        type: "boolean",
        required: false,
        default: "true",
        description: "Toggles the ambient radial aura background effect."
      },
      {
        name: "effects",
        type: "boolean",
        required: false,
        default: "true",
        description: "Enables or disables all visual effects (glow and aura). When false, only the electric border animation is shown."
      },
      {
        name: "glowBlur",
        type: "number",
        required: false,
        default: "30",
        description: "Blur intensity for the glow and aura effects."
      },
      {
        name: "className",
        type: "string",
        required: false,
        default: "-",
        description: "Optional custom class name for the main container div."
      },
      {
        name: "style",
        type: "React.CSSProperties",
        required: false,
        default: "-",
        description: "Inline styles applied to the root container."
      },
      {
        name: "children",
        type: "React.ReactNode",
        required: false,
        default: "-",
        description: "Content rendered inside the bordered container."
      },
    ],
  },




  [formatName("Rays Background")]: {
    description:
      "A vibrant, conic and radial-based animated background effect inspired by cosmic light rays. " +
      "Perfect for hero sections, modals, or theme transitions with full Tailwind and dark/light mode support.",

    import: `import RaysBackground from "@/components/lightswind/rays-background";`,

    usage: `// 1. Default Animated Dark Rays Background
<RaysBackground>
  <div className="flex items-center justify-center h-screen text-white text-3xl">
    Radiant Energy
  </div>
</RaysBackground>

// 2. Static Light Rays Background
<RaysBackground theme="light" animated={false}>
  <div className="flex items-center justify-center h-screen text-black text-3xl">
    Calm Glow
  </div>
</RaysBackground>

// 3. Custom Colors and Blur Intensity
<RaysBackground
  colors={{
    purple: "#9b5de5",
    yellow: "#f9c74f",
    pink: "#f15bb5",
    teal: "#00f5d4",
    blue: "#4361ee",
  }}
  blurAmount={10}
  opacity={0.8}
>
  <div className="flex items-center justify-center h-screen text-white text-3xl">
    Custom Spectrum
  </div>
</RaysBackground>

// 4. Faster Animation with Higher Speed
<RaysBackground animationSpeed={2}>
  <div className="flex items-center justify-center h-screen text-white text-3xl">
    Fast Rays
  </div>
</RaysBackground>

// 5. Using as a Layered Background Wrapper
<div className="relative h-screen">
  <RaysBackground opacity={0.6} className="z-0" />
  <div className="relative z-10 flex items-center justify-center h-full text-white text-3xl">
    Foreground Content
  </div>
</div>`,

    props: [
      {
        name: "theme",
        type: "'light' | 'dark'",
        required: false,
        default: "'dark'",
        description:
          "Determines the blending and visual tone of the rays effect. Use `'light'` for bright UIs or `'dark'` for deep cosmic visuals."
      },
      {
        name: "animated",
        type: "boolean",
        required: false,
        default: "true",
        description: "Toggles the continuous rotation and hue-rotation animations of the rays."
      },
      {
        name: "animationSpeed",
        type: "number",
        required: false,
        default: "1",
        description:
          "Speed multiplier for all animations. `1` is normal, `2` is double speed, `0.5` is half speed."
      },
      {
        name: "opacity",
        type: "number",
        required: false,
        default: "0.7",
        description:
          "Overall opacity of the colored rays layer, allowing subtle or intense visual blending."
      },
      {
        name: "colors",
        type: "{ purple?: string; yellow?: string; pink?: string; teal?: string; blue?: string; }",
        required: false,
        default: `{ purple: 'rgba(169, 73, 207, 1)', yellow: 'rgba(238, 248, 86, 1)', pink: 'rgba(248, 72, 202, 1)', teal: 'rgba(119, 235, 195, 1)', blue: 'rgba(77, 71, 214, 1)' }`,
        description:
          "Defines the custom color palette used in the conic-gradient rays. Each color smoothly transitions into the next."
      },
      {
        name: "blurAmount",
        type: "number",
        required: false,
        default: "6",
        description:
          "Defines the blur intensity for the color rays layer in pixels. Higher values create a smoother diffusion."
      },
      {
        name: "children",
        type: "React.ReactNode",
        required: false,
        default: "-",
        description:
          "Content rendered on top of the rays background. Commonly used for hero sections or centered content."
      },
      {
        name: "className",
        type: "string",
        required: false,
        default: "-",
        description:
          "Additional Tailwind or custom CSS classes applied to the root wrapper. Useful for z-index or positioning."
      },
    ],
  },









  [formatName("Fall Beam Background")]: {
    description:
      "A lightweight, animated background effect featuring vertical, glowing 'beams' or lines that continuously fall. " +
      "Ideal for subtle data-stream, matrix, or sci-fi themes. It supports custom colors and line density.",

    import: `import FallBeamBackground from "@/components/lightswind/fall-beam-background";`,

    usage: `// 1. Default (20 Lines, Cyan Glow) with Content
<div className="relative h-96 w-full overflow-hidden rounded-xl bg-gray-900">
  <FallBeamBackground lineCount={20} beamColorClass="cyan-400">
    <h2 className="relative z-20 text-white text-3xl font-bold">
      Data Stream Active
    </h2>
  </FallBeamBackground>
</div>

// 2. Red Glow with Dense Lines
<div className="relative h-72 w-full overflow-hidden bg-black">
  <FallBeamBackground 
    lineCount={50} 
    beamColorClass="red-400" 
    displayText="Warning: System Offline"
  />
</div>

// 3. Subtle Green Glow
<div className="relative h-64 w-full overflow-hidden rounded-lg bg-gray-800">
  <FallBeamBackground lineCount={15} beamColorClass="green-400" />
</div>

// 4. Using the className prop for custom sizing/margins
<FallBeamBackground 
  lineCount={30} 
  beamColorClass="blue-400" 
  className="h-full w-full absolute top-0 left-0" 
/>`,

    props: [
      {
        name: "lineCount",
        type: "number",
        required: false,
        default: "20",
        description:
          "The total number of falling beam lines to render. Higher counts increase density and visual noise."
      },
      {
        name: "beamColorClass",
        type: "string",
        required: false,
        default: "'cyan-400'",
        description:
          "A Tailwind color class (e.g., `'red-400'`, `'blue-400'`, `'green-400'`) used to define the glow color of the falling beam trail."
      },
      {
        name: "displayText",
        type: "string",
        required: false,
        default: "undefined",
        description:
          "Optional text string displayed prominently over the background effect. Includes a dark fade at the bottom."
      },
      {
        name: "className",
        type: "string",
        required: false,
        default: "''",
        description:
          "Additional Tailwind or custom CSS classes applied to the root container. Useful for overriding default positioning or layout (e.g., margins)."
      },
    ],
  },





  [formatName("3D Image Carousel")]: {
    description:
      "A responsive, 3D-styled image slider with a cascade effect that smoothly transitions between slides. " +
      "Supports drag, touch, and autoplay interactions, while remaining fully Tailwind-compatible for design customization. " +
      "Only minimal embedded CSS is used to maintain the 3D stacking and positioning logic.",

    import: `import ThreeDImageCarousel from "@/components/lightswind/three-d-image-carousel";`,

    usage: `// 1. Default Usage (5 visible items, no autoplay)
const slides = [
  { id: 1, src: "/images/slide1.jpg", href: "/product/1" },
  { id: 2, src: "/images/slide2.jpg", href: "/product/2" },
  { id: 3, src: "/images/slide3.jpg", href: "/product/3" },
  { id: 4, src: "/images/slide4.jpg", href: "/product/4" },
  { id: 5, src: "/images/slide5.jpg", href: "/product/5" },
];

<ThreeDImageCarousel slides={slides} className="my-12" />

// 2. Autoplay enabled with 4-second delay
<ThreeDImageCarousel 
  slides={slides} 
  autoplay={true} 
  delay={4} 
/>

// 3. Show only 3 visible items (center-focused layout)
<ThreeDImageCarousel 
  slides={slides} 
  itemCount={3}
/>

// 4. Disable pause on hover (continuous autoplay)
<ThreeDImageCarousel 
  slides={slides} 
  autoplay={true} 
  pauseOnHover={false}
/>

// 5. Custom styled container using Tailwind utilities
<ThreeDImageCarousel 
  slides={slides} 
  autoplay={true} 
  className="max-w-6xl mx-auto bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6"
/>`,

    props: [
      {
        name: "slides",
        type: "Slide[]",
        required: true,
        default: "[]",
        description:
          "An array of slide objects containing 'id', 'src', and 'href' properties. Each slide represents an image with an optional link destination."
      },
      {
        name: "itemCount",
        type: "3 | 5",
        required: false,
        default: "5",
        description:
          "The number of visible items in the carousel. Can be either 3 (compact view) or 5 (expanded 3D view)."
      },
      {
        name: "autoplay",
        type: "boolean",
        required: false,
        default: "false",
        description:
          "If true, the carousel automatically advances through slides at the specified delay interval."
      },
      {
        name: "delay",
        type: "number",
        required: false,
        default: "3",
        description:
          "The time delay in seconds between slide transitions when autoplay is enabled."
      },
      {
        name: "pauseOnHover",
        type: "boolean",
        required: false,
        default: "true",
        description:
          "Pauses the autoplay when the user hovers the cursor over the carousel area. Set to false to disable pausing."
      },
      {
        name: "className",
        type: "string",
        required: false,
        default: "''",
        description:
          "Additional Tailwind or custom CSS classes applied to the main carousel container. Useful for margins, padding, background, or layout customization."
      },
    ],
  },






  [formatName("3d Slider")]: {
    description:
      "A responsive, 3D image/content slider with a smooth, cascaded stacking effect. " +
      "It uses Framer Motion for the complex 3D transforms (translateX, translateY, rotate) " +
      "and handles interactivity via global document event listeners for mouse wheel, drag, and touch gestures. " +
      "The component is styled using Tailwind CSS and is fully self-contained.",

    import: `import ThreeDSlider from './ThreeDSlider'; // Adjust path as needed`,

    usage: `// 1. Define the items data
const sliderItems = [
  { title: "First Item", num: "01", imageUrl: "/images/image1.jpg", data: { id: 1 } },
  { title: "Second Item", num: "02", imageUrl: "/images/image2.jpg", data: { id: 2 } },
  { title: "Third Item", num: "03", imageUrl: "/images/image3.jpg", data: { id: 3 } },
  { title: "Fourth Item", num: "04", imageUrl: "/images/image4.jpg", data: { id: 4 } },
  { title: "Fifth Item", num: "05", imageUrl: "/images/image5.jpg", data: { id: 5 } },
];

// 2. Default Usage
<ThreeDSlider items={sliderItems} />

// 3. Custom Interaction Speeds and Click Handler
const handleItemClick = (item, index) => {
  console.log(\`Clicked item \${item.num}: \${item.title} at index \${index}\`);
};

<ThreeDSlider
  items={sliderItems}
  speedWheel={0.03} // Slightly faster wheel scroll
  speedDrag={-0.15} // Slightly more sensitive drag
  onItemClick={handleItemClick}
  containerStyle={{ background: '#333', height: '90vh' }}
/>`,

    props: [
      {
        name: "items",
        type: "SliderItemData[]",
        required: true,
        default: "[]",
        description:
          "An array of data objects to populate the slider items. Each item requires 'title', 'num', and 'imageUrl'."
      },
      {
        name: "speedWheel",
        type: "number",
        required: false,
        default: "0.02",
        description:
          "The sensitivity factor for mouse wheel scrolling. Higher values result in faster transitions."
      },
      {
        name: "speedDrag",
        type: "number",
        required: false,
        default: "-0.1",
        description:
          "The sensitivity factor for mouse/touch dragging. A negative value is used to match the movement direction."
      },
      {
        name: "containerStyle",
        type: "CSSProperties",
        required: false,
        default: "{}",
        description:
          "Optional custom inline CSS styles applied to the main slider container element."
      },
      {
        name: "onItemClick",
        type: "(item: SliderItemData, index: number) => void",
        required: false,
        default: "undefined",
        description:
          "Optional callback function executed when a slider item is clicked. The slider will also smoothly transition to the clicked item."
      },
    ],
  },


















  [formatName("Infinite WebGL Scroll")]: {
    description: "A premium infinite 2D canvas WebGL scroll gallery showcasing dynamic displacement rendering and native physics drag. Renders extremely fast and responds seamlessly to user input.",
    import: "import InfiniteWebGLScroll from '@/components/lightswind/infinite-webgl-scroll';",
    usage: `<div className="relative w-full h-[600px] overflow-hidden rounded-xl">
  <InfiniteWebGLScroll 
    images={["https://images.unsplash.com/photo-1749587452499-ea1fd591e63f?w=400"]} 
  />
</div>`,
    props: [
      { name: "images", type: "string[]", description: "Array of image URLs to load into the WebGL texture buffers. Defaults to a placeholder set if empty.", required: false },
      { name: "imageWidth", type: "number", description: "Base width of each rendered image cell within the canvas.", required: false, default: "150" },
      { name: "imageHeight", type: "number", description: "Base height of each rendered image cell within the canvas.", required: false, default: "150" },
      { name: "gap", type: "number", description: "Spacing between cells in pixels.", required: false, default: "20" },
      { name: "inertia", type: "number", description: "Drag deceleration factor. Closer to 1 glides further.", required: false, default: "0.95" },
      { name: "bulgeStrength", type: "number", description: "Intensity of the displacement bulge effect at the center.", required: false, default: "0.6" },
      { name: "bulgeRadius", type: "number", description: "Size of the affected displacement area relative to the canvas.", required: false, default: "1.5" },
      { name: "className", type: "string", description: "Classes passed to the wrapping container.", required: false }
    ],
  },

  [formatName("Dot Grid Background")]: {
    description:
      "An interactive hexagonal dot-grid background. Drag in any direction — dots scale by proximity to center with smooth inertia physics. Fully configurable: dot size, color, spacing, scale falloff, and momentum. Built on Canvas API for 60 FPS with zero layout cost.",
    import: 'import DotGridBackground from "@/components/lightswind/dot-grid-background"',
    usage: `import DotGridBackground from "@/components/lightswind/dot-grid-background";

export default function Page() {
  return (
    <div className="w-full h-screen">
      <DotGridBackground
        cols={20}
        dotSize={7}
        dotSpacing={3.6}
        dotColor="#ffffff"
        backgroundColor="#000000"
        scaleFactor={6}
        inertiaDamping={0.92}
        inertia
      >
        {/* Your content layered on top */}
        <div className="flex items-center justify-center h-full">
          <h1 className="text-white text-4xl font-bold">Hello World</h1>
        </div>
      </DotGridBackground>
    </div>
  );
}`,
    props: [
      { name: "cols", type: "number", description: "Number of dot columns. More columns = denser grid. Grid automatically extends 3× wider for panning room.", required: false, default: "20" },
      { name: "dotSize", type: "number", description: "Diameter of each dot in pixels at maximum scale.", required: false, default: "7" },
      { name: "dotSpacing", type: "number", description: "Cell size multiplier relative to dotSize. Controls inter-dot gap.", required: false, default: "3.6" },
      { name: "dotColor", type: "string", description: "CSS color string for dot fill. Accepts hex, rgb, hsl, named colors.", required: false, default: '"#ffffff"' },
      { name: "backgroundColor", type: "string", description: "Canvas background color rendered beneath the dots.", required: false, default: '"#000000"' },
      { name: "scaleFactor", type: "number", description: "Exponent controlling how sharply dot size falls off from the center. Higher values create a tighter, more focused radial bloom.", required: false, default: "6" },
      { name: "inertiaDamping", type: "number", description: "Friction applied per frame to the velocity vector after drag release. Range 0–1; values closer to 1 produce longer glide.", required: false, default: "0.92" },
      { name: "inertia", type: "boolean", description: "Enable momentum/inertia physics after drag ends.", required: false, default: "true" },
      { name: "minScale", type: "number", description: "Floor value for dot scale — prevents distant dots from vanishing entirely.", required: false, default: "0.04" },
      { name: "className", type: "string", description: "Additional Tailwind or CSS classes applied to the outer wrapper div.", required: false },
      { name: "children", type: "React.ReactNode", description: "Content rendered in an absolute layer above the canvas. Pointer events pass through by default.", required: false },
    ],
    examples: [
      {
        title: "Vibrant Color Theme",
        description: "Swap dot and background colors for a vivid on-dark presentation.",
        code: `<DotGridBackground
  dotColor="#6366f1"
  backgroundColor="#0a0a0f"
  scaleFactor={8}
  dotSize={9}
/>`,
      },
      {
        title: "Tight Bloom — High Scale Factor",
        description: "Increase scaleFactor for a laser-focused radial hot-spot.",
        code: `<DotGridBackground
  scaleFactor={12}
  cols={24}
  dotSpacing={3}
  dotSize={6}
/>`,
      },
      {
        title: "Hero Section with Overlay Content",
        description: "Layer a centered CTA above the interactive grid.",
        code: `<div className="w-full h-screen">
  <DotGridBackground dotColor="#fff" backgroundColor="#030712">
    <div className="flex flex-col items-center justify-center h-full gap-4 pointer-events-auto">
      <h1 className="text-6xl font-black text-white">Lightswind UI</h1>
      <p className="text-white/50 text-lg">Drag the background to explore</p>
    </div>
  </DotGridBackground>
</div>`,
      },
    ],
  },

  [formatName("Looping Words")]: {
    description: "An animated, professional looping words effect inspired by Osmo. It displays a list of words vertically and animates them upwards sequentially while highlighting the currently active word with an animated corner-bracket selector. Built with Framer Motion for smooth, seamless infinite scrolling.",
    import: `import { LoopingWords } from "@/components/lightswind/looping-words";`,
    usage: `import { LoopingWords } from "@/components/lightswind/looping-words";

export default function App() {
  const words = [
    "Framer Motion",
    "Looping",
    "Words",
    "Selector",
    "Made with"
  ];

  return (
    <div className="w-full h-[400px] flex items-center justify-center bg-background">
      <LoopingWords words={words} />
    </div>
  );
}`,
    props: [
      { name: "words", type: "string[]", description: "Array of words to loop through.", required: true },
      { name: "className", type: "string", description: "Optional class name for the wrapper container.", required: false },
    ],
  },
  [formatName("Infinite Drift")]: {
    description: "A high-performance Three.js based image marquee with independent horizontal bands, custom vertex shaders for curvature effects, and smooth inertial scrolling. Ideal for hero sections or premium galleries.",
    import: 'import { InfiniteDrift } from "@/components/lightswind/infinite-drift"',
    usage: `import { InfiniteDrift } from "@/components/lightswind/infinite-drift";

const bands = [
  {
    speed: 1.0,
    rotation: 7,
    curveAmount: 40.0,
    images: ["/img1.jpg", "/img2.jpg", "/img3.jpg"],
  },
  {
    speed: 1.3,
    offsetY: -100,
    images: ["/img4.jpg", "/img5.jpg", "/img6.jpg"],
  }
];

export function Gallery() {
  return (
    <InfiniteDrift bands={bands} height={600} />
  );
}`,
    props: [
      { name: "bands", type: "InfiniteDriftBand[]", description: "Array of band configurations including images, speed, and rotation.", required: false },
      { name: "height", type: "string | number", description: "Container height.", default: "600", required: false },
      { name: "gap", type: "number", description: "Gap between images in pixels.", default: "20", required: false },
      { name: "imageHeight", type: "number", description: "Height of images in pixels.", default: "100", required: false },
      { name: "inertia", type: "number", description: "Scroll friction (0 to 1).", default: "0.92", required: false },
    ],
  },
};
