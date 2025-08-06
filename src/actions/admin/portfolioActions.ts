
"use server";

import { getAdminFirestore, getAuthenticatedUser } from '@/lib/firebaseAdminConfig';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
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
  readmeContent: '# New Project README\n\nThis is a placeholder README content for a newly added project. Please update it with relevant information.',
  liveUrl: '',
  repoUrl: '',
};

const portfolioCollectionRef = async () => {
  return (await getAdminFirestore()).collection('portfolioItems');
}

const portfolioDocRef = async (id: string) => {
  return (await getAdminFirestore()).collection('portfolioItems').doc(id);
}

// Action to get all portfolio items
export async function getPortfolioItemsAction(): Promise<LibPortfolioItemType[]> {
  const adminFirestore = await getAdminFirestore();
  try {
    const q = (await portfolioCollectionRef()).orderBy('createdAt', 'desc');
    const snapshot = await q.get();

    if (snapshot.empty) {
      return [];
    }

    return snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      const createdAt = data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt || new Date(0).toISOString());
      const updatedAt = data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt || new Date(0).toISOString());
      
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
    return JSON.parse(JSON.stringify(defaultPortfolioItemsDataForClient));  // Fallback on error
  }
}

// Action to get a single portfolio item by its slug
export async function getPortfolioItemBySlugAction(slug: string): Promise<LibPortfolioItemType | null> {
  if (!slug || typeof slug !== 'string' || slug.trim() === '') {
    console.warn("getPortfolioItemBySlugAction: Invalid or empty slug provided.");
    return null;
  }
  
  const adminFirestore = await getAdminFirestore();

  try {
    const q = (await portfolioCollectionRef()).where("slug", "==", slug);
    const snapshot = await q.get();

    if (snapshot.empty) {
      console.warn(`No portfolio item found with slug: ${slug}`);
      return null;
    }
    
    const docSnap = snapshot.docs[0]; 
    const data = docSnap.data();
    const createdAt = data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt || new Date(0).toISOString());
    const updatedAt = data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt || new Date(0).toISOString());

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
    console.error(`Error fetching portfolio item by slug ${slug}:`, error);
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
  try {
    await getAuthenticatedUser();
  } catch (authError) {
    return { message: (authError as Error).message, status: 'error' };
  }
  
  const adminFirestore = await getAdminFirestore();

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
    const collRef = await portfolioCollectionRef();
    const slugCheckQuery = collRef.where("slug", "==", data.slug);
    const slugSnapshot = await slugCheckQuery.get();
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

    if (projectId) {
      const docRef = await portfolioDocRef(projectId);
      const docSnap = await docRef.get();
      if (!docSnap.exists) throw new Error("Trying to update a project that does not exist.");

      const existingData = docSnap.data();
      const projectDataForFirestore: Omit<LibPortfolioItemType, 'id' | 'createdAt' | 'updatedAt'> & { updatedAt: any, createdAt: any } = {
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
        updatedAt: FieldValue.serverTimestamp(),
        createdAt: existingData?.createdAt || FieldValue.serverTimestamp(),
      };
      await docRef.update(projectDataForFirestore);
    } else {
      const projectDataForFirestore: Omit<LibPortfolioItemType, 'id'> & { createdAt?: any, updatedAt?: any } = {
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
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      };
      const newProjectRef = await collRef.add(projectDataForFirestore);
      projectId = newProjectRef.id;
    }
    
    const savedDocRef = await portfolioDocRef(projectId!);
    const savedDoc = await savedDocRef.get();
    if (!savedDoc.exists()) {
        throw new Error("Failed to retrieve saved project from Firestore after save operation.");
    }
    const savedData = savedDoc.data()!;
    const createdAt = savedData.createdAt instanceof Timestamp ? savedData.createdAt.toDate().toISOString() : new Date(0).toISOString();
    const updatedAt = savedData.updatedAt instanceof Timestamp ? savedData.updatedAt.toDate().toISOString() : new Date().toISOString();

    const finalSavedProject: LibPortfolioItemType = {
      id: projectId!,
      title: savedData.title,
      description: savedData.description,
      longDescription: savedData.longDescription,
      images: savedData.images,
      tags: savedData.tags,
      liveUrl: savedData.liveUrl,
      repoUrl: savedData.repoUrl,
      slug: savedData.slug,
      dataAiHint: savedData.dataAiHint,
      readmeContent: savedData.readmeContent,
      createdAt,
      updatedAt,
    };

    revalidatePath('/portfolio');
    revalidatePath('/'); 
    if (finalSavedProject.slug) {
      revalidatePath(`/portfolio/${finalSavedProject.slug}`);
    }
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
      message: "An unexpected server error occurred while saving the project. Please try again.",
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
    try {
        await getAuthenticatedUser();
    } catch (authError) {
        return { success: false, message: (authError as Error).message };
    }
    if (!itemId) {
        return { success: false, message: "No item ID provided for deletion." };
    }
    try {
        const docRef = await portfolioDocRef(itemId);
        const projectDocSnap = await docRef.get();
        if (!projectDocSnap.exists()) {
             return { success: false, message: `Project (ID: ${itemId}) not found for deletion.` };
        }
        const projectToDeleteData = projectDocSnap.data();
        await docRef.delete();

        revalidatePath('/portfolio');
        revalidatePath('/'); 
        if (projectToDeleteData?.slug) {
          revalidatePath(`/portfolio/${projectToDeleteData.slug}`);
        }
        revalidatePath('/admin/portfolio');
        return { success: true, message: `Project (ID: ${itemId}, Title: ${projectToDeleteData?.title || 'N/A'}) deleted successfully!` };
        
    } catch (error) {
        console.error("Error deleting portfolio item from Firestore:", error);
        return { success: false, message: "Failed to delete project due to a server error." };
    }
}
