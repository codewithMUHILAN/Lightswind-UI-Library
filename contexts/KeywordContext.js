"use client";

import React, { createContext, useContext, useMemo } from "react";

// Create the context
const KeywordContext = createContext();

// Create the provider component
export const KeywordProvider = ({ children }) => {
  // Define the keyword structure
  const keywordStructure = useMemo(
    () => ({
      Components: [
        "alerts",
        "buttons",
        "buttons-groups",
        "breadcrumbs",
        "clipboards",
        "dropdowns",
        "date-pickers",
        "inputs",
        "loaders",
        "marquees",
        "menus",
        "paginations",
        "progress-bars",
        "skeletons",
        "sticky-bars",
        "tabs",
        "texts",
        "toasts",
        "tooltips",
      ],
      "Application Ui": [
        "backgrounds",
        "cards",
        "gallerys",
        "forms",
        "forms-buttons",
        "footers",
        "navbars",
        "sidebars",
        "sections",
      ],
      "Application Page": [
        "appointment-forms",
        "ai-page",
        "blogs-page",
        "business-page",
        "checkout-page",
        "hero-sections",
        "portfolio-page",
        "q&a-section",
        "ecommerce-cards",
        "ecommerce-page",
        "subscription-page",
      ],
    }),
    []
  );

  const keywordMapping = useMemo(
    () => ({
      "Core Components": "core",
      "Application Ui": "applicationui",
      "Application Page": "applicationpage",
    }),
    []
  );

  // Provide the data to children components
  return (
    <KeywordContext.Provider value={{ keywordStructure, keywordMapping }}>
      {children}
    </KeywordContext.Provider>
  );
};

// Create a custom hook for easy access to the context
export const useKeywordContext = () => {
  const context = useContext(KeywordContext);
  if (!context) {
    throw new Error("useKeywordContext must be used within a KeywordProvider");
  }
  return context;
};
