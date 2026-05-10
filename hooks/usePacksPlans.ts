import { useState, useEffect } from 'react';

export interface PackPlan {
    id: string;
    description: string;
    features?: string[];
    indianPrice: string;
    link: string;
    price: string;
    svgPath: string;
    title: string;
}

const usePacksPlans = () => {
    const [packPlans, setPacksPlans] = useState<PackPlan[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const packsPlansData: PackPlan[] = [
        {
            id: "2X3WbCaV1KRaf3y4N1PY",
            description: "Access to a variety of core UI components.",
            features: [
                "✔ Buttons, inputs, forms",
                "✔ Tables, modals, alerts",
                "✔ Advanced navigation"
            ],
            indianPrice: "Free",
            link: "#core-components",
            price: "Free",
            svgPath: "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" strokeWidth=\"1.5\" stroke=\"currentColor\" class=\"size-6\"> <path strokeLinecap=\"round\" strokeLinejoin=\"round\" d=\"M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z\" /> </svg>",
            title: "Components"
        },
        {
            id: "9s2lzTHeRUngbg9pn4tX",
            description: "sdsdsd",
            indianPrice: "999",
            link: "#application-page",
            price: "69",
            svgPath: "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" strokeWidth=\"1.5\" stroke=\"currentColor\" class=\"size-6\"> <path strokeLinecap=\"round\" strokeLinejoin=\"round\" d=\"M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z\" /> </svg>",
            title: "Application Page"
        },
        {
            id: "v1IBOkR58ufqAzndcvHt",
            description: "Get a variety of professionally designed application UI components.",
            features: [
                "✔ Responsive layouts",
                "✔ Pre-built themes",
                "✔ Multiple UI elements"
            ],
            indianPrice: "999",
            link: "#application-ui",
            price: "69",
            svgPath: "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" strokeWidth=\"1.5\" stroke=\"currentColor\" class=\"size-6\"> <path strokeLinecap=\"round\" strokeLinejoin=\"round\" d=\"M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 0 1-1.125-1.125v-3.75ZM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-8.25ZM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-2.25Z\" /> </svg>",
            title: "Application Ui"
        }
    ];

    useEffect(() => {
        const loadPacks = async () => {
            try {
                // Directly set the data from the local constant
                setPacksPlans(packsPlansData);
            } catch (err: any) {
                // In this setup, an error here would be unexpected unless due to
                // a very unusual state management issue, but it's good practice
                // to keep the error handling for potential future changes.
                setError(err.message);
                console.error('Error loading packs plans:', err);
            } finally {
                setLoading(false);
            }
        };

        loadPacks();
    }, []);

    return { packPlans, loading, error };
};

export default usePacksPlans;
