"use client";  // 👈 This tells Next.js to treat this file as a Client Component

import { createContext, useContext, useState, useEffect, useRef } from 'react';

export interface Component {
    id: string;
    title: string;
    description: string;
    keywords: string[];
    htmlcode: string;
    reactcode: string;
    height?: string;
    snippetheight?: string;
    iframeBgColor?: string;
    projectId: string; // Changed to mandatory
    displayOrder?: string;
    hidden?: string | boolean;
    compcoding?: string;
    paid?: string;
}

interface DataContextType {
    componentsData: Component[];
    isLoading: boolean;
    addComponent: (newComponent: Partial<Component>) => Promise<void>;
    updateComponent: (id: string, updatedComponent: Partial<Component>) => Promise<void>;
    deleteComponent: (id: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL || '/api/components';
const SAVE_BASE_API_URL = process.env.NEXT_PUBLIC_SAVE_API_URL || '/api/components';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [componentsData, setComponentsData] = useState<Component[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Use a ref to prevent saving during initial fetch or double-firing in Strict Mode
    const isInitialized = useRef(false);

    // Fetch data from remote JSON
    useEffect(() => {
        const fetchData = async () => {
            // Append timestamp to bypass server-side caching (LiteSpeed/Cloudflare)
            const timestamp = new Date().getTime();
            const API_URL = `${BASE_API_URL}?t=${timestamp}`;

            try {
                const response = await fetch(API_URL, {
                    headers: {
                        'Authorization': `Bearer ${API_KEY}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch data: ${response.status}`);
                }

                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    const data = await response.json();
                    // Handle both array and object wrapper formats
                    const validData = Array.isArray(data) ? data : data.components || [];
                    setComponentsData(validData);
                    isInitialized.current = true; // Mark as initialized
                } else {
                    throw new Error("Received non-JSON response from API");
                }
            } catch (error) {
                console.error("Error fetching components:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [API_KEY, BASE_API_URL]);

    // Helper to save data to remote server
    const saveData = async (newData: Component[]) => {
        if (!isInitialized.current) return; // Don't save if not initialized

        const timestamp = new Date().getTime();
        const SAVE_API_URL = `${SAVE_BASE_API_URL}?t=${timestamp}`;

        try {
            await fetch(SAVE_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                },
                body: JSON.stringify(newData),
            });
        } catch (error) {
            console.error("Error saving components:", error);
            // Ideally, you would revert the local state here or show a toast notification
        }
    };

    // Add new component
    const addComponent = async (newComponent: Partial<Component>) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newItem = { id, projectId: id, ...newComponent } as Component;

        // Calculate new state first
        const updatedList = [...componentsData, newItem];

        // Update UI immediately (Optimistic)
        setComponentsData(updatedList);

        // Then save to server
        await saveData(updatedList);
    };

    // Update a component
    const updateComponent = async (id: string, updatedComponent: Partial<Component>) => {
        // Calculate new state first
        const updatedList = componentsData.map(item =>
            (item.id === id ? { ...item, ...updatedComponent } : item)
        );

        // Update UI immediately (Optimistic)
        setComponentsData(updatedList);

        // Then save to server
        await saveData(updatedList);
    };

    // Delete a component
    const deleteComponent = async (id: string) => {
        // Calculate new state first
        const updatedList = componentsData.filter(item => item.id !== id);

        // Update UI immediately (Optimistic)
        setComponentsData(updatedList);

        // Then save to server
        await saveData(updatedList);
    };

    return (
        <DataContext.Provider value={{ componentsData, isLoading, addComponent, updateComponent, deleteComponent }}>
            {children}
        </DataContext.Provider>
    );
};

// Custom hook to access the context data
export const useDataContext = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error("useDataContext must be used within a DataProvider");
    }
    return context;
};

