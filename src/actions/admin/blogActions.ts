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
import { processImageInput } from '@/lib/image-storage';
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
  return doc(firestore, 'blogCategories', id);
};

// BLOG POSTS ACTIONS
export type BlogPostFormState = {
  message: string;
  status: 'success' | 'error' | 'idle';
  errors?: Partial<Record<keyof BlogPostAdminFormData, string[]>>;
  formDataOnError?: BlogPostAdminFormData;
  savedPost?: BlogPost;
};

export async function getBlogPostsAction(): Promise<BlogPost[]> {
  if (!firestore) {
    console.warn("Firestore not initialized in getBlogPostsAction. Returning empty array.");
    return [];
  }

  try {
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

export async function getPublishedBlogPostsAction(): Promise<BlogPost[]> {
  if (!firestore) {
    console.warn("Firestore not initialized in getPublishedBlogPostsAction. Returning empty array.");
    return [];
  }

  try {
    // First, get all blog posts and filter client-side to avoid index requirements
    // This is more efficient for small datasets and avoids composite index issues
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

export async function getBlogPostBySlugAction(slug: string): Promise<BlogPost | null> {
  if (!slug || typeof slug !== 'string' || slug.trim() === '') {
    console.warn("getBlogPostBySlugAction: Invalid or empty slug provided.");
    return null;
  }
  
  if (!firestore) {
    console.warn(`Firestore not initialized in getBlogPostBySlugAction for slug: ${slug}. Returning null.`);
    return null;
  }

  try {
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
      seoTitle: data.seoTitle || '',
      seoDescription: data.seoDescription || '',
      seoKeywords: Array.isArray(data.seoKeywords) ? data.seoKeywords : [],
    } as BlogPost;
  } catch (error) {
    console.error(`Error fetching blog post by slug ${slug}:`, error);
    return null;
  }
}

export async function saveBlogPostAction(
  prevState: BlogPostFormState,
  formData: FormData
): Promise<BlogPostFormState> {
  if (!firestore) {
    return { 
      message: "Firestore is not initialized. Cannot save blog post.", 
      status: 'error', 
      formDataOnError: Object.fromEntries(formData.entries()) as unknown as BlogPostAdminFormData 
    };
  }

  const rawData: BlogPostAdminFormData = {
    id: formData.get('id') as string || undefined,
    title: String(formData.get('title') || ''),
    slug: String(formData.get('slug') || ''),
    excerpt: String(formData.get('excerpt') || ''),
    content: String(formData.get('content') || ''),
    featuredImage: String(formData.get('featuredImage') || ''),
    author: String(formData.get('author') || ''),
    status: formData.get('status') as 'draft' | 'published' | 'archived' || 'draft',
    tagsString: String(formData.get('tagsString') || ''),
    category: String(formData.get('category') || ''),
    seoTitle: String(formData.get('seoTitle') || ''),
    seoDescription: String(formData.get('seoDescription') || ''),
    seoKeywordsString: String(formData.get('seoKeywordsString') || ''),
  };

  const validatedFields = blogPostAdminSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      message: "Failed to save blog post. Please check errors.",
      status: 'error',
      errors: validatedFields.error.flatten().fieldErrors,
      formDataOnError: rawData,
    };
  }

  const data = validatedFields.data;
  
  const tags: string[] = data.tagsString ? data.tagsString.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
  const seoKeywords: string[] = data.seoKeywordsString ? data.seoKeywordsString.split(',').map(keyword => keyword.trim()).filter(keyword => keyword) : [];
  
  // Process featured image - upload to storage if it's a base64 data URL
  let processedFeaturedImage = data.featuredImage;
  
  // Image processing is now enabled since Firebase is working
  const ENABLE_IMAGE_PROCESSING = true;
  
  if (ENABLE_IMAGE_PROCESSING && data.featuredImage && data.featuredImage.trim() !== '') {
    try {
      // Only process if it's a base64 data URL (starts with data:image/)
      if (data.featuredImage.startsWith('data:image/')) {
        const imageResult = await processImageInput(data.featuredImage, 'blog-images');
        if (imageResult.success && imageResult.url) {
          processedFeaturedImage = imageResult.url;
        } else {
          console.warn('Failed to process featured image:', imageResult.error);
          // If processing fails, use empty string to avoid Firestore errors
          processedFeaturedImage = '';
        }
      }
      // If it's already a URL, keep it as is
    } catch (error) {
      console.error('Error processing featured image:', error);
      // If processing fails, use empty string to avoid Firestore errors
      processedFeaturedImage = '';
    }
  } else if (data.featuredImage && data.featuredImage.startsWith('data:image/')) {
    // If image processing is disabled and we have a base64 image, use empty string
    console.warn('Image processing disabled, skipping base64 image');
    processedFeaturedImage = '';
  }
  
  // Calculate read time (average 200 words per minute)
  const wordCount = data.content.split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  // Validate and sanitize data before saving to Firestore
  // Check for extremely large strings that might cause Firestore errors
  const maxStringLength = 1000000; // 1MB limit for individual fields
  
  const postDataForFirestore: Omit<BlogPost, 'id' | 'publishedAt' | 'updatedAt'> & { 
    updatedAt: any, 
    publishedAt?: any 
  } = {
    title: (data.title || '').trim().substring(0, maxStringLength),
    slug: (data.slug || '').trim().substring(0, maxStringLength),
    excerpt: (data.excerpt || '').trim().substring(0, maxStringLength),
    content: (data.content || '').trim().substring(0, maxStringLength),
    featuredImage: (processedFeaturedImage || '').trim().substring(0, maxStringLength),
    author: (data.author || 'Admin').trim().substring(0, maxStringLength),
    status: data.status || 'draft',
    tags: Array.isArray(tags) ? tags : [],
    category: (data.category || 'General').trim().substring(0, maxStringLength),
    readTime: readTime || 1,
    seoTitle: (data.seoTitle || '').trim().substring(0, maxStringLength),
    seoDescription: (data.seoDescription || '').trim().substring(0, maxStringLength),
    seoKeywords: Array.isArray(seoKeywords) ? seoKeywords : [],
    updatedAt: serverTimestamp(),
  };
  
  let postId = data.id;

  try {
    // Check for slug uniqueness
    const slugCheckQuery = query(blogPostsCollectionRef(), where("slug", "==", data.slug));
    const slugSnapshot = await getDocs(slugCheckQuery);
    let slugIsTaken = false;
    if (!slugSnapshot.empty) {
      if (postId) { // Editing existing post
        slugIsTaken = slugSnapshot.docs.some(doc => doc.id !== postId);
      } else { // Adding new post
        slugIsTaken = true;
      }
    }

    if (slugIsTaken) {
      return {
        message: `Slug "${data.slug}" is already in use. Please choose a unique slug.`,
        status: 'error',
        errors: { slug: [`Slug "${data.slug}" is already in use.`] },
        formDataOnError: rawData,
      };
    }

    if (postId) { 
      await setDoc(blogPostDocRef(postId), postDataForFirestore, { merge: true });
    } else { 
      postDataForFirestore.publishedAt = serverTimestamp(); 
      const newPostRef = await addDoc(blogPostsCollectionRef(), postDataForFirestore);
      postId = newPostRef.id;
    }
    
    const savedDoc = await getDoc(blogPostDocRef(postId!)); 
    if (!savedDoc.exists()) {
        throw new Error("Failed to retrieve saved blog post from Firestore after save operation.");
    }
    const savedData = savedDoc.data()!;
    
    const publishedAtRaw = data.id ? savedData.publishedAt : postDataForFirestore.publishedAt;
    const publishedAt = publishedAtRaw instanceof Timestamp ? publishedAtRaw.toDate().toISOString() : (publishedAtRaw ? new Date().toISOString() : new Date(0).toISOString());
    const updatedAt = savedData.updatedAt instanceof Timestamp ? savedData.updatedAt.toDate().toISOString() : new Date().toISOString();

    const finalSavedPost: BlogPost = {
      id: postId!,
      title: savedData.title || postDataForFirestore.title,
      slug: savedData.slug || postDataForFirestore.slug,
      excerpt: savedData.excerpt || postDataForFirestore.excerpt,
      content: savedData.content || postDataForFirestore.content,
      featuredImage: savedData.featuredImage || postDataForFirestore.featuredImage,
      author: savedData.author || postDataForFirestore.author,
      publishedAt: publishedAt,
      updatedAt: updatedAt,
      status: savedData.status || postDataForFirestore.status,
      tags: savedData.tags || postDataForFirestore.tags,
      category: savedData.category || postDataForFirestore.category,
      readTime: savedData.readTime || postDataForFirestore.readTime,
      seoTitle: savedData.seoTitle || postDataForFirestore.seoTitle,
      seoDescription: savedData.seoDescription || postDataForFirestore.seoDescription,
      seoKeywords: savedData.seoKeywords || postDataForFirestore.seoKeywords,
    };

    revalidatePath('/blog');
    revalidatePath('/');
    if (finalSavedPost.slug) {
      revalidatePath(`/blog/${finalSavedPost.slug}`);
    }
    revalidatePath('/admin/blog');

    return {
      message: `Blog post "${finalSavedPost.title}" ${data.id ? 'updated' : 'added'} successfully!`,
      status: 'success',
      savedPost: finalSavedPost,
      errors: {},
    };

  } catch (error) {
    console.error("Error saving blog post to Firestore:", error);
    return {
      message: "An unexpected server error occurred while saving the blog post. Please try again.",
      status: 'error',
      errors: {},
      formDataOnError: rawData,
    };
  }
}

export type DeleteBlogPostResult = {
    success: boolean;
    message: string;
};

export async function deleteBlogPostAction(postId: string): Promise<DeleteBlogPostResult> {
    if (!postId) {
        return { success: false, message: "No post ID provided for deletion." };
    }
    if (!firestore) {
      return { success: false, message: "Firestore not initialized. Cannot delete blog post." };
    }
    try {
        const postDocSnap = await getDoc(blogPostDocRef(postId));
        if (!postDocSnap.exists()) {
             return { success: false, message: `Blog post (ID: ${postId}) not found for deletion.` };
        }
        const postToDeleteData = postDocSnap.data();
        await deleteDoc(blogPostDocRef(postId));

        revalidatePath('/blog');
        revalidatePath('/');
        if (postToDeleteData?.slug) {
          revalidatePath(`/blog/${postToDeleteData.slug}`);
        }
        revalidatePath('/admin/blog');
        return { success: true, message: `Blog post (ID: ${postId}, Title: ${postToDeleteData?.title || 'N/A'}) deleted successfully!` };
        
    } catch (error) {
        console.error("Error deleting blog post from Firestore:", error);
        return { success: false, message: "Failed to delete blog post due to a server error." };
    }
}

// BLOG CATEGORIES ACTIONS
export type BlogCategoryFormState = {
  message: string;
  status: 'success' | 'error' | 'idle';
  errors?: Partial<Record<keyof BlogCategoryAdminFormData, string[]>>;
  formDataOnError?: BlogCategoryAdminFormData;
  savedCategory?: BlogCategory;
};

export async function getBlogCategoriesAction(): Promise<BlogCategory[]> {
  if (!firestore) {
    console.warn("Firestore not initialized in getBlogCategoriesAction. Returning empty array.");
    return [];
  }

  try {
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

export async function saveBlogCategoryAction(
  prevState: BlogCategoryFormState,
  formData: FormData
): Promise<BlogCategoryFormState> {
  if (!firestore) {
    return { 
      message: "Firestore is not initialized. Cannot save blog category.", 
      status: 'error', 
      formDataOnError: Object.fromEntries(formData.entries()) as unknown as BlogCategoryAdminFormData 
    };
  }

  const rawData: BlogCategoryAdminFormData = {
    id: formData.get('id') as string || undefined,
    name: String(formData.get('name') || ''),
    slug: String(formData.get('slug') || ''),
    description: String(formData.get('description') || ''),
    color: String(formData.get('color') || ''),
  };

  const validatedFields = blogCategoryAdminSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      message: "Failed to save blog category. Please check errors.",
      status: 'error',
      errors: validatedFields.error.flatten().fieldErrors,
      formDataOnError: rawData,
    };
  }

  const data = validatedFields.data;
  
  const categoryDataForFirestore: Omit<BlogCategory, 'id' | 'postCount'> = {
    name: data.name,
    slug: data.slug,
    description: data.description || '',
    color: data.color || '#3B82F6',
  };
  
  let categoryId = data.id;

  try {
    // Check for slug uniqueness
    const slugCheckQuery = query(blogCategoriesCollectionRef(), where("slug", "==", data.slug));
    const slugSnapshot = await getDocs(slugCheckQuery);
    let slugIsTaken = false;
    if (!slugSnapshot.empty) {
      if (categoryId) { // Editing existing category
        slugIsTaken = slugSnapshot.docs.some(doc => doc.id !== categoryId);
      } else { // Adding new category
        slugIsTaken = true;
      }
    }

    if (slugIsTaken) {
      return {
        message: `Slug "${data.slug}" is already in use. Please choose a unique slug.`,
        status: 'error',
        errors: { slug: [`Slug "${data.slug}" is already in use.`] },
        formDataOnError: rawData,
      };
    }

    if (categoryId) { 
      await setDoc(blogCategoryDocRef(categoryId), categoryDataForFirestore, { merge: true });
    } else { 
      const newCategoryRef = await addDoc(blogCategoriesCollectionRef(), categoryDataForFirestore);
      categoryId = newCategoryRef.id;
    }
    
    const savedDoc = await getDoc(blogCategoryDocRef(categoryId!)); 
    if (!savedDoc.exists()) {
        throw new Error("Failed to retrieve saved blog category from Firestore after save operation.");
    }
    const savedData = savedDoc.data()!;

    const finalSavedCategory: BlogCategory = {
      id: categoryId!,
      name: savedData.name || categoryDataForFirestore.name,
      slug: savedData.slug || categoryDataForFirestore.slug,
      description: savedData.description || categoryDataForFirestore.description,
      color: savedData.color || categoryDataForFirestore.color,
      postCount: savedData.postCount || 0,
    };

    revalidatePath('/blog');
    revalidatePath('/admin/blog');

    return {
      message: `Blog category "${finalSavedCategory.name}" ${data.id ? 'updated' : 'added'} successfully!`,
      status: 'success',
      savedCategory: finalSavedCategory,
      errors: {},
    };

  } catch (error) {
    console.error("Error saving blog category to Firestore:", error);
    return {
      message: "An unexpected server error occurred while saving the blog category. Please try again.",
      status: 'error',
      errors: {},
      formDataOnError: rawData,
    };
  }
}

export type DeleteBlogCategoryResult = {
    success: boolean;
    message: string;
};

export async function deleteBlogCategoryAction(categoryId: string): Promise<DeleteBlogCategoryResult> {
    if (!categoryId) {
        return { success: false, message: "No category ID provided for deletion." };
    }
    if (!firestore) {
      return { success: false, message: "Firestore not initialized. Cannot delete blog category." };
    }
    try {
        const categoryDocSnap = await getDoc(blogCategoryDocRef(categoryId));
        if (!categoryDocSnap.exists()) {
             return { success: false, message: `Blog category (ID: ${categoryId}) not found for deletion.` };
        }
        const categoryToDeleteData = categoryDocSnap.data();
        await deleteDoc(blogCategoryDocRef(categoryId));

        revalidatePath('/blog');
        revalidatePath('/admin/blog');
        return { success: true, message: `Blog category (ID: ${categoryId}, Name: ${categoryToDeleteData?.name || 'N/A'}) deleted successfully!` };
        
    } catch (error) {
        console.error("Error deleting blog category from Firestore:", error);
        return { success: false, message: "Failed to delete blog category due to a server error." };
    }
}
