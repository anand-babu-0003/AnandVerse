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

  // Static pages with smart priority and change frequency strategy
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0, // Homepage - highest priority
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9, // Portfolio listing - high priority
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9, // Blog listing - high priority
    },
    {
      url: `${baseUrl}/skills`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6, // Skills page - medium priority
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5, // About page - medium priority
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5, // Contact page - medium priority
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3, // Privacy - low priority
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3, // Terms - low priority
    },
    {
      url: `${baseUrl}/cookies`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3, // Cookies - low priority
    },
  ];

  // Blog posts with smart priority strategy
  const blogPages = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7, // Individual blog posts - medium-high priority
  }));

  // Portfolio items with smart priority strategy
  const portfolioPages = portfolioItems.map((item) => ({
    url: `${baseUrl}/portfolio/${item.slug}`,
    lastModified: new Date(item.updatedAt || item.createdAt || new Date()),
    changeFrequency: 'monthly' as const,
    priority: 0.8, // Individual portfolio projects - high priority
  }));

  return [...staticPages, ...blogPages, ...portfolioPages];
}
