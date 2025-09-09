import type React from 'react';
import type { LucideIcon } from 'lucide-react';

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  images: string[];
  tags: string[];
  liveUrl?: string;
  repoUrl?: string;
  slug: string;
  dataAiHint?: string;
  readmeContent?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Skill {
  id: string;
  name: string;
  iconName: string;
  category: 'Languages' | 'Frontend' | 'Backend' | 'DevOps' | 'Tools' | 'Other';
  proficiency?: number | null;
}

export interface SocialLink {
  id: string;
  name: string;
  url?: string;
  baseUrl?: string;
  icon: LucideIcon | React.ElementType;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  period: string;
}

export interface AboutMeData {
  name: string;
  title: string;
  bio: string;
  profileImage: string;
  dataAiHint: string;
  experience: Experience[];
  education: Education[];
  email?: string;
  phone?: string;
  location?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  twitterUrl?: string;
}

export interface SiteSettings {
  siteName: string;
  defaultMetaDescription: string;
  defaultMetaKeywords?: string;
  siteOgImageUrl?: string;
  maintenanceMode?: boolean;
  skillsPageMetaTitle?: string; 
  skillsPageMetaDescription?: string; 
}

export interface NotFoundPageData {
  imageSrc: string;
  dataAiHint: string;
  heading: string;
  message: string;
  buttonText: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  submittedAt: string;
}

// NEW BLOG TYPES
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  status: 'draft' | 'published' | 'archived';
  tags: string[];
  category: string;
  readTime: number;
  views: number;
  likes: number;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  postCount: number;
}

export interface BlogComment {
  id: string;
  postId: string;
  authorName: string;
  authorEmail: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  parentId?: string;
  replies?: BlogComment[];
}

// NEW TESTIMONIAL TYPES
export interface Testimonial {
  id: string;
  clientName: string;
  clientTitle: string;
  clientCompany: string;
  clientImage?: string;
  content: string;
  rating: number;
  projectId?: string;
  status: 'pending' | 'approved' | 'featured';
  createdAt: string;
  updatedAt: string;
}

// NEW ANALYTICS TYPES
export interface AnalyticsData {
  id: string;
  page: string;
  views: number;
  uniqueVisitors: number;
  bounceRate: number;
  avgTimeOnPage: number;
  date: string;
  referrer?: string;
  userAgent?: string;
  country?: string;
  device?: string;
}

export interface VisitorSession {
  id: string;
  sessionId: string;
  startTime: string;
  endTime?: string;
  pages: string[];
  referrer?: string;
  userAgent?: string;
  country?: string;
  device?: string;
  isNewVisitor: boolean;
}

// NEW NOTIFICATION TYPES
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
  actionText?: string;
}

// NEW AI FEATURES TYPES
export interface AIGeneratedContent {
  id: string;
  type: 'blog_post' | 'project_description' | 'seo_meta' | 'email_response';
  prompt: string;
  generatedContent: string;
  model: string;
  createdAt: string;
  status: 'generated' | 'reviewed' | 'used' | 'rejected';
}

// ENHANCED APP DATA
export interface AppData {
  portfolioItems: PortfolioItem[];
  skills: Skill[];
  aboutMe: AboutMeData;
  siteSettings: SiteSettings;
  notFoundPage?: NotFoundPageData;
  blogPosts: BlogPost[];
  blogCategories: BlogCategory[];
  testimonials: Testimonial[];
  analytics: AnalyticsData[];
  notifications: Notification[];
}