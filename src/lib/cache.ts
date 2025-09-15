import { unstable_cache } from 'next/cache';

// Cache configuration
const CACHE_TAGS = {
  PORTFOLIO: 'portfolio',
  SKILLS: 'skills',
  ABOUT: 'about',
  SETTINGS: 'settings',
  BLOG: 'blog',
  MESSAGES: 'messages',
  ANNOUNCEMENTS: 'announcements',
} as const;

const CACHE_TIMES = {
  SHORT: 300, // 5 minutes
  MEDIUM: 1800, // 30 minutes
  LONG: 3600, // 1 hour
  VERY_LONG: 86400, // 24 hours
} as const;

// Cached data fetchers
export const getCachedPortfolioItems = unstable_cache(
  async () => {
    const { fetchAllDataFromFirestore } = await import('@/actions/fetchAllDataAction');
    const data = await fetchAllDataFromFirestore();
    return data.portfolioItems;
  },
  ['portfolio-items'],
  {
    tags: [CACHE_TAGS.PORTFOLIO],
    revalidate: CACHE_TIMES.LONG,
  }
);

export const getCachedSkills = unstable_cache(
  async () => {
    const { fetchAllDataFromFirestore } = await import('@/actions/fetchAllDataAction');
    const data = await fetchAllDataFromFirestore();
    return data.skills;
  },
  ['skills'],
  {
    tags: [CACHE_TAGS.SKILLS],
    revalidate: CACHE_TIMES.VERY_LONG,
  }
);

export const getCachedAboutMe = unstable_cache(
  async () => {
    const { fetchAllDataFromFirestore } = await import('@/actions/fetchAllDataAction');
    const data = await fetchAllDataFromFirestore();
    return data.aboutMe;
  },
  ['about-me'],
  {
    tags: [CACHE_TAGS.ABOUT],
    revalidate: CACHE_TIMES.LONG,
  }
);

export const getCachedSiteSettings = unstable_cache(
  async () => {
    const { getSiteSettingsAction } = await import('@/actions/admin/settingsActions');
    return await getSiteSettingsAction();
  },
  ['site-settings'],
  {
    tags: [CACHE_TAGS.SETTINGS],
    revalidate: CACHE_TIMES.MEDIUM,
  }
);

export const getCachedBlogPosts = unstable_cache(
  async () => {
    const { getPublishedBlogPostsActionOptimized } = await import('@/actions/admin/blogActionsOptimized');
    return await getPublishedBlogPostsActionOptimized();
  },
  ['blog-posts'],
  {
    tags: [CACHE_TAGS.BLOG],
    revalidate: CACHE_TIMES.MEDIUM,
  }
);

// Cache invalidation helpers
export async function revalidatePortfolio() {
  const { revalidateTag } = await import('next/cache');
  revalidateTag(CACHE_TAGS.PORTFOLIO);
}

export async function revalidateSkills() {
  const { revalidateTag } = await import('next/cache');
  revalidateTag(CACHE_TAGS.SKILLS);
}

export async function revalidateAbout() {
  const { revalidateTag } = await import('next/cache');
  revalidateTag(CACHE_TAGS.ABOUT);
}

export async function revalidateSettings() {
  const { revalidateTag } = await import('next/cache');
  revalidateTag(CACHE_TAGS.SETTINGS);
}

export async function revalidateBlog() {
  const { revalidateTag } = await import('next/cache');
  revalidateTag(CACHE_TAGS.BLOG);
}

export async function revalidateMessages() {
  const { revalidateTag } = await import('next/cache');
  revalidateTag(CACHE_TAGS.MESSAGES);
}

export async function revalidateAnnouncements() {
  const { revalidateTag } = await import('next/cache');
  revalidateTag(CACHE_TAGS.ANNOUNCEMENTS);
}

// Revalidate all caches
export async function revalidateAll() {
  const { revalidatePath } = await import('next/cache');
  revalidatePath('/', 'layout');
}

