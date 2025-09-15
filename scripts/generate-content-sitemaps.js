const fs = require('fs');
const path = require('path');

// This script generates content-specific sitemaps (blog, portfolio, pages)
async function generateContentSitemaps() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://anandverse.com';
  
  try {
    console.log('🚀 Generating content-specific sitemaps...');
    
    // Generate static pages sitemap
    const staticPages = [
      { url: '/', priority: 1.0, changefreq: 'weekly' },
      { url: '/about', priority: 0.5, changefreq: 'monthly' },
      { url: '/contact', priority: 0.5, changefreq: 'monthly' },
      { url: '/skills', priority: 0.6, changefreq: 'monthly' },
      { url: '/privacy', priority: 0.3, changefreq: 'yearly' },
      { url: '/terms', priority: 0.3, changefreq: 'yearly' },
      { url: '/cookies', priority: 0.3, changefreq: 'yearly' },
    ];
    
    const pagesSitemap = generateSitemap(staticPages, siteUrl);
    fs.writeFileSync(path.join(process.cwd(), 'public', 'sitemap-pages.xml'), pagesSitemap);
    console.log('✅ Generated sitemap-pages.xml');
    
    // Try to generate blog sitemap if blog actions exist
    try {
      // Note: In a real implementation, you would import your blog actions here
      // For now, we'll create an empty blog sitemap that can be populated
      const blogPages = [
        // Blog posts would be fetched from your blog actions
        // { url: '/blog/example-post', priority: 0.7, changefreq: 'weekly' }
      ];
      
      const blogSitemap = generateSitemap(blogPages, siteUrl);
      fs.writeFileSync(path.join(process.cwd(), 'public', 'sitemap-blog.xml'), blogSitemap);
      console.log('✅ Generated sitemap-blog.xml');
    } catch (error) {
      console.log('⚠️ Blog sitemap generation skipped (no blog data available)');
    }
    
    // Try to generate portfolio sitemap if portfolio actions exist
    try {
      // Note: In a real implementation, you would import your portfolio actions here
      // For now, we'll create an empty portfolio sitemap that can be populated
      const portfolioPages = [
        // Portfolio items would be fetched from your portfolio actions
        // { url: '/portfolio/example-project', priority: 0.8, changefreq: 'monthly' }
      ];
      
      const portfolioSitemap = generateSitemap(portfolioPages, siteUrl);
      fs.writeFileSync(path.join(process.cwd(), 'public', 'sitemap-portfolio.xml'), portfolioSitemap);
      console.log('✅ Generated sitemap-portfolio.xml');
    } catch (error) {
      console.log('⚠️ Portfolio sitemap generation skipped (no portfolio data available)');
    }
    
    console.log('🎉 Content-specific sitemaps generation completed!');
    
  } catch (error) {
    console.error('❌ Error generating content sitemaps:', error);
  }
}

function generateSitemap(pages, siteUrl) {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${siteUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
  
  return sitemap;
}

// Run if called directly
if (require.main === module) {
  generateContentSitemaps();
}

module.exports = { generateContentSitemaps };
