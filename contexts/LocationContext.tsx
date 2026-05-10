"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

interface Location {
    ip: string;
    city: string;
    region: string;
    country_name: string;
    country_code: string;
    latitude: number;
    longitude: number;
    org: string;
}

interface LocationContextType {
    location: Location | null;
    loading: boolean;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [location, setLocation] = useState<Location | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLocation = async () => {
            try {
                const response = await fetch("/api/location");
                const data = await response.json();
                // ipwho.is returns success: true/false. 
                if (data.success) {
                    setLocation({
                        ip: data.ip,
                        city: data.city,
                        region: data.region,
                        country_name: data.country,
                        country_code: data.country_code,
                        latitude: data.latitude,
                        longitude: data.longitude,
                        org: data.connection?.org || data.org
                    });
                } else {
                    console.warn("Location fetch failed:", data.message);
                }
            } catch (error) {
                console.error("Error fetching location data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLocation();
    }, []);

    return (
        <LocationContext.Provider value={{ location, loading }}>
            {children}
        </LocationContext.Provider>
    );
};

export const useLocationData = () => {
    const context = useContext(LocationContext);
    if (!context) {
        throw new Error("useLocationData must be used within a LocationProvider");
    }
    return context;
};
