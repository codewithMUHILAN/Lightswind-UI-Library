import { useEffect, useState } from "react";

export interface Plan {
  id: string;
  title: string;
  price: string;
  indianPrice?: string;
  oldindianPrice?: string;
  oldprice?: string;
  description: string;
  isPopular?: boolean;
  svgPath: string;
  KeyFeatures: string;
  features: string[];
  additionalFeatures?: string[];
  Supports?: string[];
  link?: string;
  popular?: string;
  clipPath?: boolean;
  currency?: string;
}

const usePricingPlans = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  const pricingPlansData: Plan[] = [
    {
      KeyFeatures: "Key Features:",
      Supports: [
        "✔Community Support Only",
        "✔Limited Time Access and Latest Updates",
      ],
      additionalFeatures: [
        "✔ Download Encrypted Components Only",
        "✖ Access to All-Components Decrypted Files",
        "✖ No premium templates",
      ],
      description: "Perfect for individuals exploring Lightswind UI.",
      features: [
        "✔ Access to all Components Files ",
        "✔ Access to Animated Components Files",
        "✖ Access to Paid Blocks Files",
        "✖ Access to Old Version Files",
        "✖ Access to Future Lunches",
        "✖ Access to Ai Assistance",
        "✖ Access to Paid Templates",
      ],
      id: "2shkfa6EJefgkePDZPKa",
      link: "#get-started",
      price: "Free",
      svgPath:
        '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" class="size-6">   <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" /> </svg>',
      title: "Free Plan",
    },
    {
      KeyFeatures: "Key Features",
      Supports: [
        "✔Email and Community Support",
        "✔Lifetime Access and Latest Updates",
      ],
      additionalFeatures: [
        "✔ Downloadable All Files Offline",
        "✔ Access to All-Components Decrypted Files",
        "✔All Templates and Designs",
      ],
      clipPath: true,
      currency: "USD",
      description:
        "Best for professionals and teams needing advanced features.",
      features: [
        "✔ Access to all Components Files",
        "✔ Access to Animated Components Files",
        "✔ Access to Paid Blocks Files",
        "✔ Access to Old Version Files",
        "✔ Access to Future Lunches",
        "✔ Access to Ai Assistance",
        "✔ Access to Paid Templates",
      ],
      id: "REmRzvKv2rw3j9haJNbE",
      indianPrice: "3499",
      isPopular: true,
      link: "#premium-purchase",
      oldindianPrice: "5499",
      oldprice: "199",
      popular: "Most Popular",
      price: "99",
      svgPath:
        '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" class="size-6">   <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" /> </svg>',
      title: "Premium Plan",
    },
    {
      KeyFeatures: "Key Features:",
      Supports: [
        "✔Email and Community Support",
        "✔Lifetime Access and Latest Updates",
      ],
      additionalFeatures: [
        "✔ Downloadable All Files Offline",
        "✔ Access to All-Components Decrypted Files",
        "✔ All Templates and Designs",
      ],
      currency: "USD",
      description:
        "Ideal for small to medium-sized teams working collaboratively.",
      features: [
        "✔ Access to all Components Files",
        "✔ Access to Animated Components Files",
        "✔ Access to Paid Blocks Files",
        "✔ Access to Old Version Files",
        "✔ Access to Future Lunches",
        "✔ Access to Ai Assistance",
        "✔ Access to Paid Templates",
      ],
      id: "ZRFxJrsbYg6yRnV7QvLU",
      indianPrice: "9999",
      link: "#team-purchase",
      oldindianPrice: "14999",
      oldprice: "499",
      price: "299",
      svgPath:
        '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" class="size-6">   <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" /> </svg>',
      title: "Team Plan",
    },
  ];

  useEffect(() => {
    // Simulate an asynchronous fetch operation with a slight delay if needed
    const loadPlans = async () => {
      try {
        // In a real scenario, you might have a small delay here if you want to mimic network latency
        // await new Promise(resolve => setTimeout(resolve, 500));
        setPlans(pricingPlansData);
      } catch (error) {
        console.error("Error loading plans: ", error);
      } finally {
        setLoading(false);
      }
    };

    loadPlans();
  }, []);

  return { plans, loading };
};

export default usePricingPlans;
