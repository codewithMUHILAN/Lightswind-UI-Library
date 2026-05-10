
/**
 * SEO Validation Helper
 * 
 * This utility helps validate the SEO setup on the client side.
 * Run it in the console to check if all SEO elements are correctly set up.
 */

export function validateSEO() {
  if (typeof window === 'undefined') return {};

  const results = {
    title: document.title,
    metaTags: {} as Record<string, string>,
    og: {} as Record<string, string>,
    twitter: {} as Record<string, string>,
    structuredData: [] as any[],
    canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') || 'Missing',
    semanticStructure: {
      hasMain: Boolean(document.querySelector('main')),
      hasArticle: Boolean(document.querySelector('article')),
      hasSection: Boolean(document.querySelector('section')),
      hasHeader: Boolean(document.querySelector('header')),
      hasNav: Boolean(document.querySelector('nav')),
      hasAside: Boolean(document.querySelector('aside')),
      hasFooter: Boolean(document.querySelector('footer')),
    },
    imgWithAlt: {
      total: document.querySelectorAll('img').length,
      withAlt: document.querySelectorAll('img[alt]').length,
      withoutAlt: document.querySelectorAll('img:not([alt])').length,
    },
    issues: [] as string[]
  };
  
  // Check meta tags
  document.querySelectorAll('meta').forEach(tag => {
    if (tag.getAttribute('name')) {
      results.metaTags[tag.getAttribute('name')!] = tag.getAttribute('content') || '';
    } else if (tag.getAttribute('property')?.startsWith('og:')) {
      results.og[tag.getAttribute('property')!] = tag.getAttribute('content') || '';
    } else if (tag.getAttribute('name')?.startsWith('twitter:')) {
      results.twitter[tag.getAttribute('name')!] = tag.getAttribute('content') || '';
    }
  });
  
  // Check structured data
  document.querySelectorAll('script[type="application/ld+json"]').forEach(tag => {
    try {
      results.structuredData.push(JSON.parse(tag.textContent || '{}'));
    } catch (e) {
      results.issues.push('Invalid JSON in structured data');
    }
  });
  
  // Check for issues
  if (!results.metaTags['description']) {
    results.issues.push('Missing meta description');
  }
  
  if (!results.metaTags['keywords']) {
    results.issues.push('Missing meta keywords');
  }
  
  if (!results.og['og:title']) {
    results.issues.push('Missing og:title');
  }
  
  if (!results.og['og:description']) {
    results.issues.push('Missing og:description');
  }
  
  if (!results.og['og:image']) {
    results.issues.push('Missing og:image');
  }
  
  if (!results.twitter['twitter:card']) {
    results.issues.push('Missing twitter:card');
  }
  
  if (results.imgWithAlt.withoutAlt > 0) {
    results.issues.push(`${results.imgWithAlt.withoutAlt} images missing alt attributes`);
  }
  
  if (!results.semanticStructure.hasMain) {
    results.issues.push('Missing <main> element');
  }

  if (results.structuredData.length === 0) {
    results.issues.push('No structured data found');
  }
  
  return {
    score: 100 - (results.issues.length * 10),
    results,
    passedCheck: results.issues.length === 0
  };
}

// Make available in window for easy testing
if (typeof window !== 'undefined') {
  (window as any).validateSEO = validateSEO;
}

export default validateSEO;
