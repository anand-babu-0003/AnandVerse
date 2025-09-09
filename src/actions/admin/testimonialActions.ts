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
  Timestamp 
} from 'firebase/firestore';
import type { Testimonial } from '@/lib/types';
import { testimonialAdminSchema, type TestimonialAdminFormData } from '@/lib/adminSchemas';
import { revalidatePath } from 'next/cache';

// Collection reference
const testimonialsCollectionRef = () => {
  if (!firestore) throw new Error("Firestore not initialized");
  return collection(firestore, 'testimonials');
};

const testimonialDocRef = (id: string) => {
  if (!firestore) throw new Error("Firestore not initialized");
  return doc(firestore, 'testimonials', id);
};

// Get all testimonials
export async function getTestimonialsAction(): Promise<Testimonial[]> {
  if (!firestore) {
    console.warn("Firestore not initialized in getTestimonialsAction. Returning empty array.");
    return [];
  }

  try {
    const q = query(testimonialsCollectionRef(), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return [];
    }

    return snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      const createdAt = data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt || new Date().toISOString());
      const updatedAt = data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt || new Date().toISOString());
      
      return {
        id: docSnap.id,
        clientName: data.clientName || 'Anonymous',
        clientTitle: data.clientTitle || '',
        clientCompany: data.clientCompany || '',
        clientImage: data.clientImage || '',
        content: data.content || '',
        rating: data.rating || 5,
        projectId: data.projectId || '',
        status: data.status || 'pending',
        createdAt: createdAt,
        updatedAt: updatedAt,
      } as Testimonial;
    });
  } catch (error) {
    console.error("Error fetching testimonials from Firestore:", error);
    return [];
  }
}

// Get approved testimonials
export async function getApprovedTestimonialsAction(): Promise<Testimonial[]> {
  if (!firestore) {
    console.warn("Firestore not initialized in getApprovedTestimonialsAction. Returning empty array.");
    return [];
  }

  try {
    const q = query(
      testimonialsCollectionRef(), 
      where('status', 'in', ['approved', 'featured']),
      orderBy('status', 'desc'), // featured first
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return [];
    }

    return snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      const createdAt = data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt || new Date().toISOString());
      const updatedAt = data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt || new Date().toISOString());
      
      return {
        id: docSnap.id,
        clientName: data.clientName || 'Anonymous',
        clientTitle: data.clientTitle || '',
        clientCompany: data.clientCompany || '',
        clientImage: data.clientImage || '',
        content: data.content || '',
        rating: data.rating || 5,
        projectId: data.projectId || '',
        status: data.status || 'pending',
        createdAt: createdAt,
        updatedAt: updatedAt,
      } as Testimonial;
    });
  } catch (error) {
    console.error("Error fetching approved testimonials from Firestore:", error);
    return [];
  }
}

// Get featured testimonials
export async function getFeaturedTestimonialsAction(limitCount: number = 3): Promise<Testimonial[]> {
  if (!firestore) {
    console.warn("Firestore not initialized in getFeaturedTestimonialsAction. Returning empty array.");
    return [];
  }

  try {
    const q = query(
      testimonialsCollectionRef(), 
      where('status', '==', 'featured'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return [];
    }

    return snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      const createdAt = data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt || new Date().toISOString());
      const updatedAt = data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt || new Date().toISOString());
      
      return {
        id: docSnap.id,
        clientName: data.clientName || 'Anonymous',
        clientTitle: data.clientTitle || '',
        clientCompany: data.clientCompany || '',
        clientImage: data.clientImage || '',
        content: data.content || '',
        rating: data.rating || 5,
        projectId: data.projectId || '',
        status: data.status || 'pending',
        createdAt: createdAt,
        updatedAt: updatedAt,
      } as Testimonial;
    });
  } catch (error) {
    console.error("Error fetching featured testimonials from Firestore:", error);
    return [];
  }
}

// Save testimonial
export type TestimonialFormState = {
  message: string;
  status: 'success' | 'error' | 'idle';
  errors?: Partial<Record<keyof TestimonialAdminFormData, string[]>>;
  formDataOnError?: TestimonialAdminFormData;
  savedTestimonial?: Testimonial;
};

export async function saveTestimonialAction(
  prevState: TestimonialFormState,
  formData: FormData
): Promise<TestimonialFormState> {
  if (!firestore) {
    return { 
      message: "Firestore is not initialized. Cannot save testimonial.", 
      status: 'error', 
      formDataOnError: Object.fromEntries(formData.entries()) as unknown as TestimonialAdminFormData 
    };
  }

  const rawData: TestimonialAdminFormData = {
    id: formData.get('id') as string || undefined,
    clientName: String(formData.get('clientName') || ''),
    clientTitle: String(formData.get('clientTitle') || ''),
    clientCompany: String(formData.get('clientCompany') || ''),
    clientImage: String(formData.get('clientImage') || ''),
    content: String(formData.get('content') || ''),
    rating: Number(formData.get('rating') || 5),
    projectId: String(formData.get('projectId') || ''),
    status: formData.get('status') as 'pending' | 'approved' | 'featured' || 'pending',
  };

  const validatedFields = testimonialAdminSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      message: "Failed to save testimonial. Please check errors.",
      status: 'error',
      errors: validatedFields.error.flatten().fieldErrors,
      formDataOnError: rawData,
    };
  }

  const data = validatedFields.data;
  
  const testimonialDataForFirestore: Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'> & { 
    updatedAt: any, 
    createdAt?: any 
  } = {
    clientName: data.clientName,
    clientTitle: data.clientTitle,
    clientCompany: data.clientCompany,
    clientImage: data.clientImage || '',
    content: data.content,
    rating: data.rating,
    projectId: data.projectId || '',
    status: data.status,
    updatedAt: serverTimestamp(),
  };
  
  let testimonialId = data.id;

  try {
    if (testimonialId) { 
      await setDoc(testimonialDocRef(testimonialId), testimonialDataForFirestore, { merge: true });
    } else { 
      testimonialDataForFirestore.createdAt = serverTimestamp(); 
      const newTestimonialRef = await addDoc(testimonialsCollectionRef(), testimonialDataForFirestore);
      testimonialId = newTestimonialRef.id;
    }
    
    const savedDoc = await getDoc(testimonialDocRef(testimonialId!)); 
    if (!savedDoc.exists()) {
        throw new Error("Failed to retrieve saved testimonial from Firestore after save operation.");
    }
    const savedData = savedDoc.data()!;
    
    const createdAtRaw = data.id ? savedData.createdAt : testimonialDataForFirestore.createdAt;
    const createdAt = createdAtRaw instanceof Timestamp ? createdAtRaw.toDate().toISOString() : (createdAtRaw ? new Date().toISOString() : new Date(0).toISOString());
    const updatedAt = savedData.updatedAt instanceof Timestamp ? savedData.updatedAt.toDate().toISOString() : new Date().toISOString();

    const finalSavedTestimonial: Testimonial = {
      id: testimonialId!,
      clientName: savedData.clientName || testimonialDataForFirestore.clientName,
      clientTitle: savedData.clientTitle || testimonialDataForFirestore.clientTitle,
      clientCompany: savedData.clientCompany || testimonialDataForFirestore.clientCompany,
      clientImage: savedData.clientImage || testimonialDataForFirestore.clientImage,
      content: savedData.content || testimonialDataForFirestore.content,
      rating: savedData.rating || testimonialDataForFirestore.rating,
      projectId: savedData.projectId || testimonialDataForFirestore.projectId,
      status: savedData.status || testimonialDataForFirestore.status,
      createdAt: createdAt,
      updatedAt: updatedAt,
    };

    revalidatePath('/');
    revalidatePath('/about');
    revalidatePath('/admin/testimonials');

    return {
      message: `Testimonial from ${finalSavedTestimonial.clientName} ${data.id ? 'updated' : 'added'} successfully!`,
      status: 'success',
      savedTestimonial: finalSavedTestimonial,
      errors: {},
    };

  } catch (error) {
    console.error("Error saving testimonial to Firestore:", error);
    return {
      message: "An unexpected server error occurred while saving the testimonial. Please try again.",
      status: 'error',
      errors: {},
      formDataOnError: rawData,
    };
  }
}

// Delete testimonial
export type DeleteTestimonialResult = {
    success: boolean;
    message: string;
};

export async function deleteTestimonialAction(testimonialId: string): Promise<DeleteTestimonialResult> {
    if (!testimonialId) {
        return { success: false, message: "No testimonial ID provided for deletion." };
    }
    if (!firestore) {
      return { success: false, message: "Firestore not initialized. Cannot delete testimonial." };
    }
    try {
        const testimonialDocSnap = await getDoc(testimonialDocRef(testimonialId));
        if (!testimonialDocSnap.exists()) {
             return { success: false, message: `Testimonial (ID: ${testimonialId}) not found for deletion.` };
        }
        const testimonialToDeleteData = testimonialDocSnap.data();
        await deleteDoc(testimonialDocRef(testimonialId));

        revalidatePath('/');
        revalidatePath('/about');
        revalidatePath('/admin/testimonials');
        return { success: true, message: `Testimonial from ${testimonialToDeleteData?.clientName || 'Unknown'} deleted successfully!` };
        
    } catch (error) {
        console.error("Error deleting testimonial from Firestore:", error);
        return { success: false, message: "Failed to delete testimonial due to a server error." };
    }
}

// Update testimonial status
export async function updateTestimonialStatusAction(
  testimonialId: string, 
  status: 'pending' | 'approved' | 'featured'
): Promise<{ success: boolean; message: string }> {
  if (!testimonialId) {
    return { success: false, message: "No testimonial ID provided." };
  }
  if (!firestore) {
    return { success: false, message: "Firestore not initialized." };
  }

  try {
    await setDoc(testimonialDocRef(testimonialId), {
      status,
      updatedAt: serverTimestamp(),
    }, { merge: true });

    revalidatePath('/');
    revalidatePath('/about');
    revalidatePath('/admin/testimonials');

    return { 
      success: true, 
      message: `Testimonial status updated to ${status} successfully!` 
    };
  } catch (error) {
    console.error("Error updating testimonial status:", error);
    return { 
      success: false, 
      message: "Failed to update testimonial status due to a server error." 
    };
  }
}
