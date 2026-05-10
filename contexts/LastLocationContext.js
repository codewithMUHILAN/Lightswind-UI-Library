"use client";
import React, { createContext, useState, useContext, useEffect } from "react";
import { usePathname } from "next/navigation";

const LastLocationContext = createContext();

export const useLastLocation = () => {
  return useContext(LastLocationContext);
};

// Utility functions for encoding and decoding
const encodeLocation = (location) => window.btoa(location);
const decodeLocation = (encodedLocation) => {
  try {
    return window.atob(encodedLocation);
  } catch (e) {
    return null; // Return null if decoding fails
  }
};


export const LastLocationProvider = ({ children }) => {
  const location = usePathname();
  const [lastLocation, setLastLocation] = useState(null);

  // Only run this in the browser
  useEffect(() => {
    const storedLocation = typeof window !== "undefined" ? localStorage.getItem("lastLocation") : null;
    if (storedLocation) {
      setLastLocation(decodeLocation(storedLocation));
    }
  }, []);

  useEffect(() => {
    if (location && location !== "/login") {
      const encodedLocation = encodeLocation(location);
      localStorage.setItem("lastLocation", encodedLocation);
      setLastLocation(location);
    }
  }, [location]);

  return (
    <LastLocationContext.Provider value={{ lastLocation, setLastLocation }}>
      {children}
    </LastLocationContext.Provider>
  );
};
