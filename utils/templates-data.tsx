import {
    ActivityIcon,
    BookOpenIcon,
    BriefcaseIcon,
    CalendarIcon,
    CoffeeIcon,
    FileTextIcon,
    GlobeIcon,
    GridIcon,
    HeartIcon,
    LayoutDashboard,
    RocketIcon,
    ShoppingCartIcon,
    StarIcon,
    TargetIcon,
    UserIcon,
    UsersIcon,
} from "lucide-react";
import { LucideIcon } from "lucide-react";
import { FaReact } from "react-icons/fa";
import { IconType } from "react-icons";

// Define the templateCategory interface and categories array
export interface templateCategory {
    id: string;
    name: string;
    description: string;
    icon: LucideIcon;
    count: number;
}




export const templateCategories: templateCategory[] = [
    {
        id: "all",
        name: "All Templates",
        description: "Browse all available templates",
        icon: GridIcon,
        count: 0,
    },
    {
        id: "portfolio",
        name: "Portfolio",
        description:
            "Modern portfolio websites to showcase your work, skills, and achievements",
        icon: StarIcon,
        count: 24,
    },
    {
        id: "ai-website",
        name: "AI Website",
        description:
            "Complete online store templates with product pages, carts, and checkout",
        icon: ShoppingCartIcon,
        count: 20,
    },
    {
        id: "admin-dashboard",
        name: "Admin Dashboard",
        description:
            "Complete, feature-rich admin dashboard templates for SaaS and Enterprise apps",
        icon: LayoutDashboard,
        count: 1,
    },
    // {
    //   id: "business",
    //   name: "Business",
    //   description: "Professional business and corporate website templates",
    //   icon: BriefcaseIcon,
    //   count: 18,
    // },
    // {
    //   id: "agency",
    //   name: "Agency",
    //   description:
    //     "Creative agency templates to highlight services and case studies",
    //   icon: UsersIcon,
    //   count: 16,
    // },
    {
        id: "saas",
        name: "SaaS / Startup",
        description: "High-converting landing pages and full multi-page sites for SaaS products and modern startups.",
        icon: RocketIcon,
        count: 0,
    },
    {
        id: "agency",
        name: "Creative Agency",
        description: "Professional agency templates designed to showcase services, case studies, and team profiles.",
        icon: UsersIcon,
        count: 0,
    },
];

export interface template {
    id: string;
    title: string;
    description: string;
    category: string;
    isPaid: boolean;
    coverImage: string;
    previewUrl: string;
    downloadUrl: string;
    sourceCodeUrl?: string;
    tags: string[];
    difficulty: "beginner" | "intermediate" | "advanced";
    createdAt: string;
    updatedAt: string;
    techLogo: IconType[]; // ✅ Correctly typed as an array of IconType
    price: number;
    indianPrice?: number;
    originalPrice?: number;
    oldindianPrice?: number;
}

// Create a new component for the SVG
const ViteJsIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        width="100"
        height="100"
        viewBox="0 0 48 48"
        {...props}
    >
        <linearGradient
            id="oOTIjsOjTqJdvfy5S4iCZa_dJjTWMogzFzg_gr1"
            x1="13.315"
            x2="38.005"
            y1="514.906"
            y2="481.377"
            gradientTransform="matrix(1 0 0 -1 0 514)"
            gradientUnits="userSpaceOnUse"
        >
            <stop offset="0" stopColor="#41d1ff"></stop>
            <stop offset="1" stopColor="#9231be"></stop>
        </linearGradient>
        <path
            fill="url(#oOTIjsOjTqJdvfy5S4iCZa_dJjTWMogzFzg_gr1)"
            d="M44.86,9.976L25.023,45.448c-0.41,0.732-1.462,0.737-1.878,0.008L2.915,9.979 C2.462,9.185,3.141,8.223,4.041,8.384l19.859,3.55c0.127,0.023,0.256,0.022,0.383-0.001l19.443-3.544 C44.623,8.225,45.305,9.18,44.86,9.976z"
        ></path>
        <linearGradient
            id="oOTIjsOjTqJdvfy5S4iCZb_dJjTWMogzFzg_gr2"
            x1="25.502"
            x2="37.131"
            y1="508.764"
            y2="428.99"
            gradientTransform="matrix(1 0 0 -1 0 514)"
            gradientUnits="userSpaceOnUse"
        >
            <stop offset="0" stopColor="#fed100"></stop>
            <stop offset="1" stopColor="#e36001"></stop>
        </linearGradient>
        <path
            fill="url(#oOTIjsOjTqJdvfy5S4iCZb_dJjTWMogzFzg_gr2)"
            d="M33.574,3.01L19.019,5.862c-0.239,0.047-0.416,0.25-0.431,0.493l-0.895,15.121 c-0.021,0.356,0.306,0.633,0.654,0.552l4.052-0.935c-0.379-0.081,0.722,0.246,0.644,0.628l-1.204,5.895 c-0.081,0.397,0.291,0.736,0.679,0.618l2.503-0.76c0.388-0.118,0.761,0.222,0.679,0.62l-1.913,9.26 c-0.12,0.579,0.651,0.895,0.972,0.398l0.215-0.332l11.86-23.669c0.199-0.396-0.144-0.848-0.579-0.764l-4.171,0.805 c-0.392,0.076-0.725-0.289-0.615-0.673l2.722-9.438C34.301,3.299,33.967,2.933,33.574,3.01z"
        ></path>
    </svg>
);

export const templatess: template[] = [
    // Hero Sections
    {
        id: "portfolio01",
        title: "Animated Professional Portfolio",
        description:
            "A modern, animated portfolio template to showcase your work and skills. Fully customizable and free to use, perfect for developers, designers, and creative professionals.",
        category: "portfolio",
        isPaid: false,
        coverImage:
            "https://codewithmuhilan.com/Extra-Assets/lightswind/lwportfiolio01.mp4",
        previewUrl: "https://lwportfolio01.muhilanorg.in/",
        downloadUrl:
            "",
        tags: ["particles", "animation", "modern"],
        difficulty: "advanced",
        createdAt: "2025-06-26",
        updatedAt: "2025-06-26",
        techLogo: [ViteJsIcon, FaReact],
        sourceCodeUrl: 'Animated-Professional-Portfolio-Lightswind-UI',
        price: 0,
        originalPrice: 20,
    },
    {
        id: "aiwebsite01",
        title: "Codebase Animated Website",
        description:
            "A modern, animated website template for codebase ai brand with professional sections. Fully customizable and free to use, perfect for developers, designers, and creative professionals.",
        category: "ai-website",
        isPaid: true,
        coverImage:
            "https://codewithmuhilan.com/Extra-Assets/lightswind/aiwebsite01.mp4",
        previewUrl: "https://lwaiwebsite.muhilanorg.in/",
        downloadUrl:
            "",
        tags: ["particles", "animation", "modern", 'ai-website'],
        difficulty: "advanced",
        createdAt: "2025-06-26",
        updatedAt: "2025-06-26",
        techLogo: [ViteJsIcon, FaReact],
        sourceCodeUrl: 'Codebase-Animated-Website-Lightswind-UI',
        price: 49,
        originalPrice: 99,
    },
    {
        id: "astral-admin",
        title: "Astral Engine - Enterprise Dashboard",
        description:
            "The most advanced Lightswind UI dashboard template for modern enterprises. Features GSAP interactive animations, advanced analytical reports with Recharts, comprehensive support center, and ultra-premium enterprise aesthetics. Fully optimized for high-performance SaaS applications.",
        category: "admin-dashboard",
        isPaid: true,
        coverImage:
            "https://codewithmuhilan.com/Extra-Assets/lightswind/astral-dashboard-preview.png",
        previewUrl: "https://lwdashboard01.muhilanorg.in/",
        downloadUrl:
            "",
        tags: ["admin", "dashboard", "gsap", "analytics", "premium", "enterprise"],
        difficulty: "advanced",
        createdAt: "2026-03-03",
        updatedAt: "2026-03-03",
        techLogo: [ViteJsIcon, FaReact],
        sourceCodeUrl: 'astral-engine-dashboard',
        price: 79,
        originalPrice: 149,
    },
    {
        id: "nexus-saas",
        title: "Nexus - Animated SaaS AI Website",
        description:
            "A high-performance Nexus SaaS template with dual-theme (light/dark) support. Features interactive animations, 3D card tilt, scroll progress blur, morphing background blobs, and a professional integration showcase.",
        category: "saas",
        isPaid: true,
        coverImage:
            "https://codewithmuhilan.com/Extra-Assets/lightswind/nexus-preview.png",
        previewUrl: "https://lwwebapp01.muhilanorg.in/",
        downloadUrl:
            "",
        tags: ["saas", "ai", "animations", "modern", "premium"],
        difficulty: "advanced",
        createdAt: "2026-03-30",
        updatedAt: "2026-03-30",
        techLogo: [ViteJsIcon, FaReact],
        sourceCodeUrl: 'nexus-animated-saas-website',
        price: 79,
        originalPrice: 199,
    },
];

// Utility functions
export const gettemplatesByCategory = (categoryId: string): template[] => {
    if (categoryId === "all") {
        return templatess;
    }
    return templatess.filter((template) => template.category === categoryId);
};

export const gettemplateById = (id: string): template | undefined => {
    return templatess.find((template) => template.id === id || template.sourceCodeUrl === id);
};

export const searchtemplates = (query: string): template[] => {
    const lowercaseQuery = query.toLowerCase();
    return templatess.filter(
        (template) =>
            template.title.toLowerCase().includes(lowercaseQuery) ||
            template.description.toLowerCase().includes(lowercaseQuery) ||
            template.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery))
    );
};

export const filtertemplates = (
    categoryId: string = "all",
    searchQuery: string = "",
    isPaidFilter?: boolean,
    difficultyFilter?: string
): template[] => {
    let filteredtemplates = gettemplatesByCategory(categoryId);

    if (searchQuery) {
        const searchResults = searchtemplates(searchQuery);
        filteredtemplates = filteredtemplates.filter((template) =>
            searchResults.some((searchtemplate) => searchtemplate.id === template.id)
        );
    }

    if (isPaidFilter !== undefined) {
        filteredtemplates = filteredtemplates.filter(
            (template) => template.isPaid === isPaidFilter
        );
    }

    if (difficultyFilter && difficultyFilter !== "all") {
        filteredtemplates = filteredtemplates.filter(
            (template) => template.difficulty === difficultyFilter
        );
    }

    return filteredtemplates;
};

// Update category counts
templateCategories.forEach((category) => {
    if (category.id === "all") {
        category.count = templatess.length;
    } else {
        category.count = templatess.filter(
            (template) => template.category === category.id
        ).length;
    }
});
