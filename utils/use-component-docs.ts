
import { ComponentDoc, componentDocs } from "./component-docs";

// Combine the original and additional component docs
export const useComponentDocs = () => {
  // Create a sorted copy of the component docs to ensure consistent order
  const sortedComponentDocs: Record<string, ComponentDoc> = {};
  
  // Get all keys and sort them alphabetically
  const sortedKeys = Object.keys(componentDocs).sort();
  
  // Build the sorted object
  sortedKeys.forEach(key => {
    sortedComponentDocs[key] = componentDocs[key];
  });
  
  return {
    componentDocs: sortedComponentDocs
  };
}; 
