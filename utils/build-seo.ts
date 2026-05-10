
import { generateSitemap } from './generate-sitemap';

/**
 * Main build script for SEO-related tasks
 * This can be run as part of the build process
 */
async function buildSeo() {
  const baseUrl = process.env.BASE_URL || 'https://lighswind.com';
  
  try {
    console.log('Starting SEO build process...');
    
    // Generate template-specific SEO files
    
    // Generate sitemap.xml
    await generateSitemap({
      baseUrl,
      outputPath: './public/sitemap.xml'
    });
    
    console.log('SEO build process complete!');
  } catch (error) {
    console.error('Error in SEO build process:', error);
    process.exit(1);
  }
}

// Run the build process
// Use ES modules approach
if (import.meta.url.endsWith('build-seo.ts')) {
  buildSeo().catch(console.error);
}
