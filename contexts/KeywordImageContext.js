"use client"; // 👈 This tells Next.js to treat this file as a Client Component
import { createContext, useContext } from "react";

// Define the keyword images mapping
const keywordImages = {
  alerts: "https://codewithmuhilan.com/Banner_Assets/Alerts-Banner.png",
  buttons: "https://codewithmuhilan.com/Banner_Assets/Buttons-Banner.png",
  backgrounds:
    "https://codewithmuhilan.com/Banner_Assets/Anime-Background-Banner.png",
  cards: "https://codewithmuhilan.com/Banner_Assets/cards-Keyword-Banner.png",
  "buttons-groups":
    "https://codewithmuhilan.com/Banner_Assets/Buttons-Group-Banner.png",
  tabs: "https://codewithmuhilan.com/Banner_Assets/Tabs-Keyword-Banner.png",
  breadcrumbs:
    "https://codewithmuhilan.com/Banner_Assets/Breadcrumbs-Banner.png",
  clipboards: "https://codewithmuhilan.com/Banner_Assets/copytoclipboard.png",
  "date-pickers":
    "https://codewithmuhilan.com/Banner_Assets/DatePicker-Banner.png",
  dropdowns:
    "https://codewithmuhilan.com/Banner_Assets/Dropdown-Keyword-Banner.png",
  inputs: "https://codewithmuhilan.com/Banner_Assets/Anime-Input-Banner.png",
  menus:
    "https://codewithmuhilan.com/Banner_Assets/Dropdown-Keyword-Banner.png",
  loaders:
    "https://codewithmuhilan.com/Banner_Assets/loader-Keyword-Banner.png",
  navbars:
    "https://codewithmuhilan.com/Banner_Assets/Navbar-Keyword-Banner.png",
  marquees: "https://codewithmuhilan.com/Banner_Assets/Marquee-Banner.png",
  paginations:
    "https://codewithmuhilan.com/Banner_Assets/Pagination-Keyword-Banner.png",
  "progress-bars": "https://codewithmuhilan.com/Banner_Assets/progressbar.png",
  texts: "https://codewithmuhilan.com/Banner_Assets/Anime-Text-Banner.png",
  gallerys:
    "https://codewithmuhilan.com/Banner_Assets/Gallery-Keyword-Banner.png",
  forms: "https://codewithmuhilan.com/Banner_Assets/Forms-Keyword-Banner.png",
  sidebars:
    "https://codewithmuhilan.com/Banner_Assets/Sidebar-Keyword-Banner.png",
  skeletons: "https://codewithmuhilan.com/Banner_Assets/skeletons.png",
  "sticky-bars": "https://codewithmuhilan.com/Banner_Assets/sticky-bars.png",
  "shopping-page":
    "https://codewithmuhilan.com/Banner_Assets/Shoppage-Keyword-Banner.png",
  "subscription-page":
    "https://codewithmuhilan.com/Banner_Assets/Subscription-Keyword-Banner.png",
  toasts: "https://codewithmuhilan.com/Banner_Assets/toasts.png",
  tooltips: "https://codewithmuhilan.com/Banner_Assets/tooltips.png",

  "forms-buttons":
    "https://codewithmuhilan.com/Banner_Assets/FormButton-Banner.png",
  footers: "https://codewithmuhilan.com/Banner_Assets/Footer-Banner.png",
  sections: "https://codewithmuhilan.com/Banner_Assets/Section-Banner.png",

  "appointment-forms":
    "https://codewithmuhilan.com/Banner_Assets/appointment-forms-Banner.png",
  "ai-page": "https://codewithmuhilan.com/Banner_Assets/ai-page-Banner.png",
  "blogs-page":
    "https://codewithmuhilan.com/Banner_Assets/blogs-page-Banner.png",
  "checkout-page":
    "https://codewithmuhilan.com/Banner_Assets/checkout-page-Banner.png",
  "hero-sections":
    "https://codewithmuhilan.com/Banner_Assets/hero-sections-Banner.png",
  "q&a-section":
    "https://codewithmuhilan.com/Banner_Assets/q&a-section-Banner.png",
  "portfolio-page":
    "https://codewithmuhilan.com/Banner_Assets/portfolio-page-Banner.png",
  "ecommerce-page":
    "https://codewithmuhilan.com/Banner_Assets/ecommerce-page-Banner.png",
  "ecommerce-cards":
    "https://codewithmuhilan.com/Banner_Assets/ecommerce-cards-Banner.png",
};

// Create a context
const KeywordImageContext = createContext(keywordImages);

// Custom hook for using the context
export const useKeywordImages = () => useContext(KeywordImageContext);

// Provider component
export const KeywordImageProvider = ({ children }) => {
  return (
    <KeywordImageContext.Provider value={keywordImages}>
      {children}
    </KeywordImageContext.Provider>
  );
};
