
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import seoManager from '../api/seoManager';

interface SEOOptions {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: string;
  ogUrl?: string;
  twitterCard?: string;
  twitterSite?: string;
  twitterImage?: string;
  canonical?: string;
}

/**
 * Hook to update SEO metadata from any component
 * This uses direct DOM manipulation via seoManager
 */
export function useSEO(options: SEOOptions) {
  const pathname = usePathname();

  useEffect(() => {
    // Update metadata when component mounts or options change
    seoManager.updateMetadata(pathname || "/", options);

    // Clean up is not strictly necessary since next route will update the metadata
    return () => {
      // No cleanup needed
    };
  }, [pathname, options]);

  // Helper function to dynamically update specific SEO fields
  const updateSEO = (newOptions: Partial<SEOOptions>) => {
    seoManager.updateMetadata(pathname || "/", newOptions);
  };

  return { updateSEO };
}

export default useSEO;
