const fs = require('fs');
const path = require('path');

// This script generates RSS feeds for blog posts
async function generateRSSFeed() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://anandverse.com';
  
  try {
    console.log('🚀 Generating RSS feed...');
    
    // Try to fetch blog posts (in a real implementation, import your blog actions)
    const blogPosts = [
      // Blog posts would be fetched from your blog actions
      // {
      //   title: 'Example Blog Post',
      //   slug: 'example-blog-post',
      //   excerpt: 'This is an example blog post...',
      //   publishedAt: new Date(),
      //   updatedAt: new Date()
      // }
    ];
    
    const rssContent = generateRSSContent(blogPosts, siteUrl);
    fs.writeFileSync(path.join(process.cwd(), 'public', 'feed.xml'), rssContent);
    console.log('✅ Generated feed.xml (RSS feed)');
    
  } catch (error) {
    console.error('❌ Error generating RSS feed:', error);
  }
}

function generateRSSContent(posts, siteUrl) {
  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>AnandVerse - Developer Blog</title>
    <description>Latest insights, tutorials, and thoughts on web development and technology</description>
    <link>${siteUrl}</link>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <generator>Next.js RSS Generator</generator>
    <managingEditor>contact@anandverse.com (AnandVerse)</managingEditor>
    <webMaster>contact@anandverse.com (AnandVerse)</webMaster>
    
    ${posts.map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.excerpt || post.title}]]></description>
      <link>${siteUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${siteUrl}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <lastBuildDate>${new Date(post.updatedAt || post.publishedAt).toUTCString()}</lastBuildDate>
      <category>Technology</category>
    </item>`).join('')}
    
    ${posts.length === 0 ? `
    <!-- RSS feed generated but no blog posts available yet -->
    <item>
      <title>Welcome to AnandVerse Blog</title>
      <description>Stay tuned for exciting content about web development, technology, and more!</description>
      <link>${siteUrl}/blog</link>
      <guid isPermaLink="true">${siteUrl}/blog</guid>
      <pubDate>${new Date().toUTCString()}</pubDate>
      <category>Announcement</category>
    </item>` : ''}
  </channel>
</rss>`;
  
  return rss;
}

// Run if called directly
if (require.main === module) {
  generateRSSFeed();
}

module.exports = { generateRSSFeed };
