
"use server";

import { 
  collection, 
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  Timestamp,
  orderBy,
} from 'firebase/firestore';
import { firestore } from '@/lib/firebaseConfig';
import { revalidatePath } from 'next/cache';
import type { PortfolioItem as LibPortfolioItemType } from '@/lib/types';
import { portfolioItemAdminSchema, type PortfolioAdminFormData } from '@/lib/adminSchemas';
import { defaultPortfolioItemsDataForClient } from '@/lib/data'; 

const defaultPortfolioItemStructure: Omit<LibPortfolioItemType, 'id' | 'createdAt' | 'updatedAt'> = {
  title: 'Untitled Project',
  description: 'Default description for a new project.',
  longDescription: 'More detailed default description for a new project.',
  images: ['https://placehold.co/600x400.png?text=ProjectImage'],
  tags: ['new-project'],
  slug: `new-project-${Date.now()}`,
  dataAiHint: 'project placeholder',
  readmeContent: '# New Project README\\n\\nThis is a placeholder README content for a newly added project. Please update it with relevant information.',
  liveUrl: '',
  repoUrl: '',
};

export async function getPortfolioItemsAction(): Promise<LibPortfolioItemType[]> {
  if (!firestore) {
    console.error("Firestore not initialized. Returning default data.");
    return JSON.parse(JSON.stringify(defaultPortfolioItemsDataForClient));
  }
  try {
    const q = query(collection(firestore, 'portfolioItems'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return [];
    }

    return snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      const createdAt = (data.createdAt as Timestamp)?.toDate().toISOString() || new Date(0).toISOString();
      const updatedAt = (data.updatedAt as Timestamp)?.toDate().toISOString() || createdAt;
      
      return {
        id: docSnap.id,
        title: data.title || defaultPortfolioItemStructure.title,
        description: data.description || defaultPortfolioItemStructure.description,
        longDescription: data.longDescription || defaultPortfolioItemStructure.longDescription,
        images: Array.isArray(data.images) && data.images.length > 0 ? data.images : [...defaultPortfolioItemStructure.images],
        tags: Array.isArray(data.tags) ? data.tags : [...defaultPortfolioItemStructure.tags],
        liveUrl: data.liveUrl || '',
        repoUrl: data.repoUrl || '',
        slug: data.slug || `project-${docSnap.id}`,
        dataAiHint: data.dataAiHint || defaultPortfolioItemStructure.dataAiHint,
        readmeContent: data.readmeContent || defaultPortfolioItemStructure.readmeContent,
        createdAt: createdAt,
        updatedAt: updatedAt,
      } as LibPortfolioItemType;
    });
  } catch (error) {
    console.error("Error fetching portfolio items from Firestore:", error);
    return JSON.parse(JSON.stringify(defaultPortfolioItemsDataForClient));
  }
}

export async function getPortfolioItemBySlugAction(slug: string): Promise<LibPortfolioItemType | null> {
  if (!firestore) {
    console.error("Firestore not initialized. Cannot fetch portfolio item.");
    return null;
  }
  if (!slug || typeof slug !== 'string' || slug.trim() === '') {
    return null;
  }
  
  try {
    const collRef = collection(firestore, 'portfolioItems');
    const q = query(collRef, where("slug", "==", slug));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.warn(`No portfolio item found with slug: ${slug}`);
      return null;
    }
    
    const docSnap = snapshot.docs[0]; 
    const data = docSnap.data();
    const createdAt = (data.createdAt as Timestamp)?.toDate().toISOString() || new Date(0).toISOString();
    const updatedAt = (data.updatedAt as Timestamp)?.toDate().toISOString() || createdAt;

    return {
      id: docSnap.id,
      title: data.title || defaultPortfolioItemStructure.title,
      description: data.description || defaultPortfolioItemStructure.description,
      longDescription: data.longDescription || defaultPortfolioItemStructure.longDescription,
      images: Array.isArray(data.images) && data.images.length > 0 ? data.images : [...defaultPortfolioItemStructure.images],
      tags: Array.isArray(data.tags) ? data.tags : [...defaultPortfolioItemStructure.tags],
      liveUrl: data.liveUrl || '',
      repoUrl: data.repoUrl || '',
      slug: data.slug, 
      dataAiHint: data.dataAiHint || defaultPortfolioItemStructure.dataAiHint,
      readmeContent: data.readmeContent || defaultPortfolioItemStructure.readmeContent,
      createdAt: createdAt,
      updatedAt: updatedAt,
    } as LibPortfolioItemType;
  } catch (error) {
    console.error(`Error fetching portfolio item by slug ${slug} from Firestore:`, error);
    return null;
  }
}

export type PortfolioFormState = {
  message: string;
  status: 'success' | 'error' | 'idle';
  errors?: Partial<Record<keyof PortfolioAdminFormData, string[]>>;
  formDataOnError?: PortfolioAdminFormData; 
  savedProject?: LibPortfolioItemType;
};

export async function savePortfolioItemAction(
  prevState: PortfolioFormState,
  formData: FormData
): Promise<PortfolioFormState> {
  if (!firestore) {
    return {
      message: "Firestore not initialized. Cannot save project.",
      status: 'error',
    };
  }
  const rawData: PortfolioAdminFormData = {
    id: formData.get('id') as string || undefined,
    title: String(formData.get('title') || ''),
    description: String(formData.get('description') || ''),
    longDescription: String(formData.get('longDescription') || ''),
    image1: String(formData.get('image1') || ''),
    image2: String(formData.get('image2') || ''),
    tagsString: String(formData.get('tagsString') || ''),
    liveUrl: String(formData.get('liveUrl') || ''),
    repoUrl: String(formData.get('repoUrl') || ''),
    slug: String(formData.get('slug') || ''),
    dataAiHint: String(formData.get('dataAiHint') || ''),
    readmeContent: String(formData.get('readmeContent') || ''),
  };

  const validatedFields = portfolioItemAdminSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      message: "Failed to save project. Please check errors.",
      status: 'error',
      errors: validatedFields.error.flatten().fieldErrors,
      formDataOnError: rawData,
    };
  }

  const data = validatedFields.data;
  
  const imagesFromForm: string[] = [];
  if (data.image1 && data.image1.trim() !== '') imagesFromForm.push(data.image1);
  if (data.image2 && data.image2.trim() !== '') imagesFromForm.push(data.image2);
  
  const finalImages = (imagesFromForm.length > 0)
    ? imagesFromForm
    : (!data.id ? [...defaultPortfolioItemStructure.images] : []);

  const tags: string[] = data.tagsString ? data.tagsString.split(',').map(tag => tag.trim()).filter(tag => tag) : [];

  let projectId = data.id;

  try {
    const collRef = collection(firestore, 'portfolioItems');
    const slugCheckQuery = query(collRef, where("slug", "==", data.slug));
    const slugSnapshot = await getDocs(slugCheckQuery);
    let slugIsTaken = false;
    if (!slugSnapshot.empty) {
      if (projectId) {
        slugIsTaken = slugSnapshot.docs.some(doc => doc.id !== projectId);
      } else {
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

    const projectData = {
      title: data.title,
      description: data.description,
      longDescription: data.longDescription || '',
      images: finalImages,
      tags,
      liveUrl: data.liveUrl || '',
      repoUrl: data.repoUrl || '',
      slug: data.slug,
      dataAiHint: data.dataAiHint || defaultPortfolioItemStructure.dataAiHint,
      readmeContent: data.readmeContent || defaultPortfolioItemStructure.readmeContent,
      updatedAt: serverTimestamp(),
    };

    if (projectId) {
      const docRef = doc(firestore, 'portfolioItems', projectId);
      await updateDoc(docRef, projectData);
    } else {
      const newProjectRef = await addDoc(collRef, { ...projectData, createdAt: serverTimestamp() });
      projectId = newProjectRef.id;
    }
    
    const savedDocRef = doc(firestore, 'portfolioItems', projectId!);
    const savedDoc = await getDoc(savedDocRef);
    if (!savedDoc.exists) throw new Error("Failed to retrieve saved project from Firestore.");

    const savedData = savedDoc.data()!;
    const createdAt = (savedData.createdAt as Timestamp)?.toDate().toISOString();
    const updatedAt = (savedData.updatedAt as Timestamp)?.toDate().toISOString();

    const finalSavedProject: LibPortfolioItemType = { ...savedData, id: projectId!, createdAt, updatedAt } as LibPortfolioItemType;

    revalidatePath('/portfolio');
    revalidatePath('/'); 
    if (finalSavedProject.slug) revalidatePath(`/portfolio/${finalSavedProject.slug}`);
    revalidatePath('/admin/portfolio');

    return {
      message: `Project "${finalSavedProject.title}" ${data.id ? 'updated' : 'added'} successfully!`,
      status: 'success',
      savedProject: finalSavedProject,
      errors: {},
    };

  } catch (error) {
    console.error("Error saving portfolio project to Firestore:", error);
    return {
      message: "An unexpected server error occurred.",
      status: 'error',
      errors: {},
      formDataOnError: rawData,
    };
  }
}

export type DeletePortfolioItemResult = {
    success: boolean;
    message: string;
};

export async function deletePortfolioItemAction(itemId: string): Promise<DeletePortfolioItemResult> {
    if (!firestore) {
        return { success: false, message: "Firestore not initialized." };
    }
    if (!itemId) return { success: false, message: "No item ID provided." };

    try {
        const docRef = doc(firestore, 'portfolioItems', itemId);
        await deleteDoc(docRef);

        revalidatePath('/portfolio');
        revalidatePath('/');
        revalidatePath('/admin/portfolio');
        
        return { success: true, message: `Project deleted successfully!` };
        
    } catch (error) {
        console.error("Error deleting portfolio item from Firestore:", error);
        return { success: false, message: "Failed to delete project due to a server error." };
    }
}
