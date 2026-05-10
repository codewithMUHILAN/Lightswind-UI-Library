import fs from "fs";
import path from "path";
import { blocks } from "./blocks-data"; // Import blocks data

interface SitemapOptions {
  baseUrl: string;
  outputPath: string;
}

/**
 * Generates a sitemap.xml file with all routes and templates
 * Run this script during build or as a scheduled task
 */
export async function generateSitemap(options: SitemapOptions): Promise<void> {
  const { baseUrl, outputPath } = options;

  try {
    // Start with standard routes
    const staticRoutes = [
      "/",
      "/blocks", // Changed from /templates to /blocks for clarity based on user request
      "/components",
      "/components/installation",
      "/about",
      "/profile",
    ];

    // Add entries for static routes
    let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticRoutes
        .map(
          (route) => `
  <url>
    <loc>${baseUrl}${route}</loc>

  </url>
`
          // <changefreq>${route === "/" ? "daily" : "weekly"}</changefreq>
          // <priority>${route === "/" ? "1.0" : "0.7"}</priority>
        )
        .join("")}`;

    // Add entries for pricing and installation
    //     <changefreq>monthly</changefreq>
    // <priority>0.8</priority>
    sitemapContent += `

  <url>
    <loc>${baseUrl}/pricing</loc>

  </url>


  <url>
    <loc>${baseUrl}/components/installation</loc>
 
  </url>`;
    //  <changefreq>weekly</changefreq>
    //   <priority>0.7</priority>

    // Track unique categories for category pages
    const categories = new Set<string>();

    // Add entries for individual blocks
    blocks.forEach((block: any) => {
      if (block.category) categories.add(block.category.toLowerCase());

      const categorySlug = block.category ? block.category.toLowerCase() : "uncategorized";
      sitemapContent += `
  <url>
    <loc>${baseUrl}/blocks/${categorySlug}/${block.id}</loc>
  </url>`;
    });

    // Add entries for category pages
    categories.forEach((categorySlug) => {
      sitemapContent += `
  <url>
    <loc>${baseUrl}/blocks/${categorySlug}</loc>
  </url>`;
    });

    //     <changefreq>monthly</changefreq>
    // <priority>0.6</priority>


    // Close the sitemap XML
    sitemapContent += "\n</urlset>";

    // Create directories if they don't exist
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write the sitemap file
    fs.writeFileSync(outputPath, sitemapContent);
    console.log(`Sitemap generated at ${outputPath}`);
  } catch (error) {
    console.error("Error generating sitemap:", error);
  }
}

// This can be run directly - use correct ES module check
if (import.meta.url === import.meta.url) {
  const baseUrl = process.env.BASE_URL || "https://lightswind.com";
  const outputPath = path.join(process.cwd(), "public/sitemap.xml");

  generateSitemap({
    baseUrl,
    outputPath,
  }).catch(console.error);
}
