import { useState, useEffect } from "react";

export interface Block {
    id: string;
    title: string;
    description: string;
    category: string | string[];
    isPaid: boolean;
    coverImage: string;
}

export interface BlockCategory {
    id: string;
    name: string;
    description: string;
    icon: string;
    count: number;
}

export interface Template {
    id: string;
    title: string;
    description: string;
    category: string;
    coverImage: string;
    previewUrl: string;
    price: string | number;
}

export interface ProductResponse {
    blockCategories: BlockCategory[];
    componentCategories: any[];
    components: any[];
    blocks: Block[];
    templates: Template[];
    baseUrl: string;
}

export const useProducts = () => {
    const [data, setData] = useState<ProductResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Determine API URL
    const PRO_API_URL = 
        process.env.NEXT_PUBLIC_PRO_API_URL || 
        process.env.NEXT_PUBLIC_PRO_SITE_URL || 
        (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') 
            ? `http://${window.location.hostname}:3001` 
            : "https://pro.lightswind.com");

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                console.log(`📡 Fetching products from: ${PRO_API_URL}/api/products`);
                
                let response;
                try {
                    response = await fetch(`${PRO_API_URL}/api/products`);
                } catch (err: any) {
                    console.warn(`⚠️ Local API fetch failed: ${err.message}. Trying production fallback...`);
                    // If local fails, try production fallback
                    if (PRO_API_URL.includes('localhost')) {
                         response = await fetch("https://pro.lightswind.com/api/products");
                    } else {
                        throw err;
                    }
                }

                if (response && response.ok) {
                    const json = await response.json();
                    setData(json);
                } else if (response) {
                    console.error("Failed to fetch products:", response.status);
                    // One last try with production if we got a non-ok response from localhost
                    if (PRO_API_URL.includes('localhost')) {
                        const fallbackResponse = await fetch("https://pro.lightswind.com/api/products");
                        if (fallbackResponse.ok) {
                            const json = await fallbackResponse.json();
                            setData(json);
                        }
                    }
                }
            } catch (error: any) {
                console.error("Error fetching products:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [PRO_API_URL]);

    return { data, loading, error };
};
