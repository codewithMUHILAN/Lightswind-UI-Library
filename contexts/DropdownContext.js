import React, { createContext, useState, useContext } from 'react';

// Create the Dropdown context
const DropdownContext = createContext();

// Custom hook for easy access to context
export const useDropdownContext = () => {
  return useContext(DropdownContext);
};

// Provider Component
export const DropdownProvider = ({ children }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = (state) => {
    setDropdownOpen(state);
  };

  return (
    <DropdownContext.Provider value={{ dropdownOpen, toggleDropdown }}>
      {children}
    </DropdownContext.Provider>
  );
};
