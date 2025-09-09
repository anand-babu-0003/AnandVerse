"use server";

import { firestore } from '@/lib/firebaseConfig';
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  setDoc, 
  addDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp, 
  Timestamp, 
  writeBatch 
} from 'firebase/firestore';
import type { BlogPost, BlogCategory } from '@/lib/types';
import { blogPostAdminSchema, blogCategoryAdminSchema, type BlogPostAdminFormData, type BlogCategoryAdminFormData } from '@/lib/adminSchemas';
import { revalidatePath } from 'next/cache';

// Collection references
const blogPostsCollectionRef = () => {
  if (!firestore) throw new Error("Firestore not initialized");
  return collection(firestore, 'blogPosts');
};

const blogCategoriesCollectionRef = () => {
  if (!firestore) throw new Error("Firestore not initialized");
  return collection(firestore, 'blogCategories');
};

const blogPostDocRef = (id: string) => {
  if (!firestore) throw new Error("Firestore not initialized");
  return doc(firestore, 'blogPosts', id);
};

const blogCategoryDocRef = (id: string) => {
  if (!firestore) throw new Error("Firestore not initialized");
  return collection(firestore, 'blogCategories', id);
};

// OPTIMIZED BLOG POSTS ACTIONS - No composite index required
export type BlogPostFormState = {
  message: string;
  status: 'success' | 'error' | 'idle';
  errors?: Partial<Record<keyof BlogPostAdminFormData, string[]>>;
  formDataOnError?: BlogPostAdminFormData;
  savedPost?: BlogPost;
};

/**
 * Get all blog posts (optimized - no composite index required)
 * This approach fetches all posts and filters client-side for small datasets
 */
export async function getBlogPostsActionOptimized(): Promise<BlogPost[]> {
  if (!firestore) {
    console.warn("Firestore not initialized in getBlogPostsActionOptimized. Returning empty array.");
    return [];
  }

  try {
    // Use only single field ordering to avoid composite index requirements
    const q = query(blogPostsCollectionRef(), orderBy('publishedAt', 'desc'));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return [];
    }

    return snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      const publishedAt = data.publishedAt instanceof Timestamp ? data.publishedAt.toDate().toISOString() : (data.publishedAt || new Date().toISOString());
      const updatedAt = data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt || new Date().toISOString());
      
      return {
        id: docSnap.id,
        title: data.title || 'Untitled Post',
        slug: data.slug || docSnap.id,
        excerpt: data.excerpt || '',
        content: data.content || '',
        featuredImage: data.featuredImage || '',
        author: data.author || 'Admin',
        publishedAt: publishedAt,
        updatedAt: updatedAt,
        status: data.status || 'draft',
        tags: Array.isArray(data.tags) ? data.tags : [],
        category: data.category || 'General',
        readTime: data.readTime || 5,
        views: data.views || 0,
        likes: data.likes || 0,
        seoTitle: data.seoTitle || '',
        seoDescription: data.seoDescription || '',
        seoKeywords: Array.isArray(data.seoKeywords) ? data.seoKeywords : [],
      } as BlogPost;
    });
  } catch (error) {
    console.error("Error fetching blog posts from Firestore:", error);
    return [];
  }
}

/**
 * Get published blog posts only (optimized - no composite index required)
 * This approach fetches all posts and filters client-side
 */
export async function getPublishedBlogPostsActionOptimized(): Promise<BlogPost[]> {
  if (!firestore) {
    console.warn("Firestore not initialized in getPublishedBlogPostsActionOptimized. Returning empty array.");
    return [];
  }

  try {
    // Use only single field ordering to avoid composite index requirements
    const q = query(blogPostsCollectionRef(), orderBy('publishedAt', 'desc'));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return [];
    }

    // Filter for published posts only and map to BlogPost objects
    return snapshot.docs
      .filter(docSnap => {
        const data = docSnap.data();
        return data.status === 'published';
      })
      .map(docSnap => {
        const data = docSnap.data();
        const publishedAt = data.publishedAt instanceof Timestamp ? data.publishedAt.toDate().toISOString() : (data.publishedAt || new Date().toISOString());
        const updatedAt = data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt || new Date().toISOString());
        
        return {
          id: docSnap.id,
          title: data.title || 'Untitled Post',
          slug: data.slug || docSnap.id,
          excerpt: data.excerpt || '',
          content: data.content || '',
          featuredImage: data.featuredImage || '',
          author: data.author || 'Admin',
          publishedAt: publishedAt,
          updatedAt: updatedAt,
          status: data.status || 'draft',
          tags: Array.isArray(data.tags) ? data.tags : [],
          category: data.category || 'General',
          readTime: data.readTime || 5,
          views: data.views || 0,
          likes: data.likes || 0,
          seoTitle: data.seoTitle || '',
          seoDescription: data.seoDescription || '',
          seoKeywords: Array.isArray(data.seoKeywords) ? data.seoKeywords : [],
        } as BlogPost;
      });
  } catch (error) {
    console.error("Error fetching published blog posts from Firestore:", error);
    return [];
  }
}

/**
 * Get blog post by slug (optimized - uses single field query)
 */
export async function getBlogPostBySlugActionOptimized(slug: string): Promise<BlogPost | null> {
  if (!slug || typeof slug !== 'string' || slug.trim() === '') {
    console.warn("getBlogPostBySlugActionOptimized: Invalid or empty slug provided.");
    return null;
  }
  
  if (!firestore) {
    console.warn(`Firestore not initialized in getBlogPostBySlugActionOptimized for slug: ${slug}. Returning null.`);
    return null;
  }

  try {
    // Use single field query - no composite index required
    const q = query(blogPostsCollectionRef(), where("slug", "==", slug));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.warn(`No blog post found with slug: ${slug}`);
      return null;
    }
    
    const docSnap = snapshot.docs[0]; 
    const data = docSnap.data();
    const publishedAt = data.publishedAt instanceof Timestamp ? data.publishedAt.toDate().toISOString() : (data.publishedAt || new Date().toISOString());
    const updatedAt = data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt || new Date().toISOString());

    return {
      id: docSnap.id,
      title: data.title || 'Untitled Post',
      slug: data.slug,
      excerpt: data.excerpt || '',
      content: data.content || '',
      featuredImage: data.featuredImage || '',
      author: data.author || 'Admin',
      publishedAt: publishedAt,
      updatedAt: updatedAt,
      status: data.status || 'draft',
      tags: Array.isArray(data.tags) ? data.tags : [],
      category: data.category || 'General',
      readTime: data.readTime || 5,
      views: data.views || 0,
      likes: data.likes || 0,
      seoTitle: data.seoTitle || '',
      seoDescription: data.seoDescription || '',
      seoKeywords: Array.isArray(data.seoKeywords) ? data.seoKeywords : [],
    } as BlogPost;
  } catch (error) {
    console.error(`Error fetching blog post by slug ${slug}:`, error);
    return null;
  }
}

/**
 * Get blog categories (optimized - uses single field ordering)
 */
export async function getBlogCategoriesActionOptimized(): Promise<BlogCategory[]> {
  if (!firestore) {
    console.warn("Firestore not initialized in getBlogCategoriesActionOptimized. Returning empty array.");
    return [];
  }

  try {
    // Use single field ordering - no composite index required
    const q = query(blogCategoriesCollectionRef(), orderBy('name', 'asc'));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return [];
    }

    return snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      
      return {
        id: docSnap.id,
        name: data.name || 'Unnamed Category',
        slug: data.slug || docSnap.id,
        description: data.description || '',
        color: data.color || '#3B82F6',
        postCount: data.postCount || 0,
      } as BlogCategory;
    });
  } catch (error) {
    console.error("Error fetching blog categories from Firestore:", error);
    return [];
  }
}
