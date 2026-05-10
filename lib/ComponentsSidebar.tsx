"use client";
import React, { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger as SidebarToggle,
  useSidebar,
} from "../lightswind/sidebar";
import { LayoutGrid, X } from "lucide-react";
import { cn } from "../lib/utils";
import { useRouter } from "next/navigation";
import {
  uiComponents,
  formComponents,
  layoutComponents,
  navigationComponents,
  // utilityComponents,
  animatedComponents,
  gettingStartedCategories,
} from "../utils/component-categories";
import AdvancedSearch from "../showcase/AdvancedSearch";

interface ComponentsSidebarProps {
  onSelect: (componentName: string) => void;
  activeComponent: string | null;
  isMobileView?: boolean;
  onClose?: () => void;
}

// Type fix: Add optional id property to make TypeScript happy
type ComponentType = {
  name: string;
  id?: string;
  icon: any;
};

export const ComponentsSidebar = ({
  onSelect,
  activeComponent,
  isMobileView = false,
  onClose,
}: ComponentsSidebarProps) => {
  const { expanded, setActiveMenuItem } = useSidebar();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Set the active menu item when activeComponent changes
  useEffect(() => {
    if (activeComponent) {
      setActiveMenuItem(activeComponent);
    }
  }, [activeComponent, setActiveMenuItem]);

  // All components combined for search
  const allComponents = [
    ...gettingStartedCategories,
    ...uiComponents,
    ...formComponents,
    ...layoutComponents,
    ...navigationComponents,
    // ...utilityComponents,
    ...animatedComponents,
  ] as ComponentType[];

  // Map components to search results format
  const searchResults = allComponents.map((component) => ({
    id: component.id || component.name,
    name: component.name,
    category: getComponentCategory(component),
    icon: component.icon,
    path: `/components?component=${encodeURIComponent(
      component.id || component.name
    )}`,
  }));

  // Filter components based on search query
  const filterComponents = (components: ComponentType[]) => {
    if (!searchQuery) return components;
    return components.filter((component) =>
      component.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Filtered components
  const filteredGettingStartedCategories = filterComponents(
    gettingStartedCategories as ComponentType[]
  );
  const filteredUiComponents = filterComponents(uiComponents as ComponentType[]);
  const filteredFormComponents = filterComponents(formComponents as ComponentType[]);
  const filteredLayoutComponents = filterComponents(layoutComponents as ComponentType[]);
  const filteredNavigationComponents = filterComponents(navigationComponents as ComponentType[]);
  // const filteredUtilityComponents = filterComponents(utilityComponents);
  const filteredAnimatedComponents = filterComponents(animatedComponents as ComponentType[]);

  // Check if we have any filtered results
  const hasResults =
    filteredGettingStartedCategories.length > 0 ||
    filteredUiComponents.length > 0 ||
    filteredFormComponents.length > 0 ||
    filteredLayoutComponents.length > 0 ||
    filteredNavigationComponents.length > 0 ||
    //  filteredUtilityComponents.length > 0 ||
    filteredAnimatedComponents.length > 0;

  // Handle search input changes
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setShowSearchResults(query.trim().length > 0);
  };

  // Handle component selection
  const handleComponentSelect = (component: ComponentType) => {
    const componentName = component.id || component.name;
    onSelect(componentName);
    router.push(`/components?component=${encodeURIComponent(componentName)}`);

    if (isMobileView) {
      onClose?.(); // Close sidebar after selection on mobile
    }
  };

  // Determine component category
  function getComponentCategory(component: ComponentType) {

    if (gettingStartedCategories.includes(component as any)) return "Getting Started";
    if (uiComponents.includes(component as any)) return "UI Elements";
    if (formComponents.includes(component as any)) return "Form Controls";
    if (layoutComponents.includes(component as any)) return "Layout";
    if (navigationComponents.includes(component as any)) return "Navigation";
    // if (utilityComponents.includes(component)) return "Utilities";
    if (animatedComponents.includes(component as any)) return "Animated";
    return "Components";
  }

  // Component menu item
  const ComponentMenuItem = ({ component, category }: { component: ComponentType, category: string }) => (
    <SidebarMenuItem
      key={component.id || component.name}
      value={component.id || component.name}
    >
      <SidebarMenuButton
        value={component.id || component.name}
        onClick={() => handleComponentSelect(component)}
        className={cn(
          "transition-all duration-300 z-10",
          (component.id || component.name) === activeComponent
            ? "text-primary font-medium"
            : ""
        )}
      >
        {(() => {
          const Icon = component.icon;
          return React.createElement(Icon as any, {
            className: cn(
              "h-4 w-4 transition-colors duration-300",
              (component.id || component.name) === activeComponent
                ? "text-primary"
                : ""
            )
          });
        })()}
        <span>{component.name}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );

  return (
    <Sidebar
      className={cn(
        "border-r min-h-screen",
        isMobileView ? "fixed inset-0 z-50 " : ""
      )}
    >
      <SidebarHeader className="h-16 border-b ">
        <div
          className={cn(
            "flex items-center gap-2 font-semibold",
            expanded ? "justify-between w-full" : "justify-center"
          )}
        >
          {expanded && (
            <div className="flex items-center gap-2">
              <LayoutGrid className="h-5 w-5" />
              Components
            </div>
          )}
          {!expanded && <LayoutGrid className="h-5 w-5" />}

          <div className="flex items-center">
            {isMobileView && expanded && (
              <button
                onClick={onClose}
                className="mr-2 p-1 rounded-md hover:bg-accent transition-colors duration-200"
                aria-label="Close sidebar"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <SidebarToggle className="relative left-0 top-0 md:flex hidden" />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="overflow-hidden">
        {expanded && (
          <div className="px-3 py-2">
            <AdvancedSearch
              className="text-xs"
              placeholder="Search comp..."
              onSearch={handleSearch}
              results={searchResults.filter((result) =>
                result.name.toLowerCase().includes(searchQuery.toLowerCase())
              )}
              onSelect={(result) => {
                const component = allComponents.find(
                  (c) => (c.id || c.name) === result.name
                );
                if (component) {
                  handleComponentSelect(component);
                }
              }}
              searchParam="search"
            />
          </div>
        )}

        {/* Show a message when no results are found */}
        {searchQuery && !hasResults && expanded && (
          <div className="px-4 py-3 text-sm text-muted-foreground">
            No components found
          </div>
        )}

        {/* Quick results for search */}
        {searchQuery && expanded && hasResults && (
          <SidebarGroup>
            <SidebarGroupLabel>Search Results</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filterComponents(allComponents).map((component) => (
                  <ComponentMenuItem
                    key={component.id || component.name}
                    component={component}
                    category={getComponentCategory(component)}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Getting Started section */}
        {(!searchQuery || filteredGettingStartedCategories.length > 0) && (
          <SidebarGroup>
            <SidebarGroupLabel>Getting Started</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredGettingStartedCategories.map((component) => (
                  <ComponentMenuItem
                    key={component.id || component.name}
                    component={component}
                    category="getting-started"
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {(!searchQuery || filteredAnimatedComponents.length > 0) && (
          <SidebarGroup>
            <SidebarGroupLabel>Animated</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredAnimatedComponents.map((component) => (
                  <ComponentMenuItem
                    key={component.name}
                    component={component}
                    category="animated"
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Only show categories if not searching or if there are filtered results */}
        {(!searchQuery || filteredUiComponents.length > 0) && (
          <SidebarGroup>
            <SidebarGroupLabel>UI Elements</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredUiComponents.map((component) => (
                  <ComponentMenuItem
                    key={component.name}
                    component={component}
                    category="ui"
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {(!searchQuery || filteredFormComponents.length > 0) && (
          <SidebarGroup>
            <SidebarGroupLabel>Form Controls</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredFormComponents.map((component) => (
                  <ComponentMenuItem
                    key={component.name}
                    component={component}
                    category="form"
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {(!searchQuery || filteredLayoutComponents.length > 0) && (
          <SidebarGroup>
            <SidebarGroupLabel>Layout</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredLayoutComponents.map((component) => (
                  <ComponentMenuItem
                    key={component.name}
                    component={component}
                    category="layout"
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {(!searchQuery || filteredNavigationComponents.length > 0) && (
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredNavigationComponents.map((component) => (
                  <ComponentMenuItem
                    key={component.name}
                    component={component}
                    category="navigation"
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* {(!searchQuery || filteredUtilityComponents.length > 0) && (
          <SidebarGroup>
            <SidebarGroupLabel>Utilities</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredUtilityComponents.map((component) => (
                  <ComponentMenuItem
                    key={component.name}
                    component={component}
                    category="utilities"
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )} */}
      </SidebarContent>
    </Sidebar>
  );
};
