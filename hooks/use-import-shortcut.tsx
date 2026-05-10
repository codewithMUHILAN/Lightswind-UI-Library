
import * as React from "react";

type UseImportShortcutOptions = {
  componentList: string[];
  debounceMs?: number;
};

type ImportShortcutState = {
  componentName: string | null;
  visible: boolean;
  position: { x: number; y: number };
};

export function useImportShortcut({ 
  componentList = [], 
  debounceMs = 500 
}: UseImportShortcutOptions) {
  const [shortcutState, setShortcutState] = React.useState<ImportShortcutState>({
    componentName: null,
    visible: false,
    position: { x: 0, y: 0 },
  });
  const debounceTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Detect component name in text and show import shortcut
  const detectComponent = React.useCallback((text: string, position: { x: number; y: number }) => {
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set a debounce timer to avoid excessive updates
    debounceTimerRef.current = setTimeout(() => {
      // Find the word the cursor is on
      const words = text.split(/\s+/);
      
      // Improved component detection with more patterns
      const foundComponent = componentList.find(component => 
        words.some(word => {
          const normalizedWord = word.trim();
          return normalizedWord === component || 
            normalizedWord === `<${component}>` || 
            normalizedWord.includes(`<${component}`) ||
            normalizedWord === `${component}` ||
            // More specific check for Toast component
            (component === "Toast" && normalizedWord.toLowerCase().includes("toast"))
        })
      );

      if (foundComponent) {
        setShortcutState({
          componentName: foundComponent,
          visible: true,
          position,
        });
      } else {
        hideShortcut();
      }
    }, debounceMs);
  }, [componentList, debounceMs]);

  const hideShortcut = React.useCallback(() => {
    setShortcutState(prev => ({ ...prev, visible: false }));
  }, []);

  // Cleanup timer on unmount
  React.useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    shortcutState,
    detectComponent,
    hideShortcut,
  };
}
