import { MetadataRoute } from 'next';
import { getPublishedBlogPostsActionOptimized } from '@/actions/admin/blogActionsOptimized';
import { fetchAllPortfolioItems } from '@/actions/fetchAllDataAction';
import { getSiteSettingsAction } from '@/actions/admin/settingsActions';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get dynamic site settings for base URL
  const siteSettings = await getSiteSettingsAction();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://anandverse.com';
  
  // Get dynamic content
  const [blogPosts, portfolioItems] = await Promise.all([
    getPublishedBlogPostsActionOptimized(),
    fetchAllPortfolioItems()
  ]);

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/skills`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
  ];

  // Blog posts
  const blogPages = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Portfolio items
  const portfolioPages = portfolioItems.map((item) => ({
    url: `${baseUrl}/portfolio/${item.slug}`,
    lastModified: new Date(item.updatedAt || item.createdAt || new Date()),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...blogPages, ...portfolioPages];
}
