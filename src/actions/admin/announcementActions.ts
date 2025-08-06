
"use server";

import { z } from 'zod';
import { firestore } from '@/lib/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { revalidatePath } from 'next/cache'; 

// Note: With this setup, Firestore rules must allow write access 
// for authenticated users on the 'announcements' collection.
// Authentication state is managed on the client in the admin layout.

const announcementSchema = z.object({
  message: z.string().min(5, { message: "Announcement message must be at least 5 characters long." }).max(500, { message: "Announcement cannot exceed 500 characters." }),
});

export type AnnouncementFormState = {
  message: string;
  status: 'success' | 'error' | 'idle';
  errors?: {
    message?: string[];
  };
};

export async function submitAnnouncementAction(
  prevState: AnnouncementFormState,
  formData: FormData
): Promise<AnnouncementFormState> {

  if (!firestore) {
    return { message: "Firestore not initialized.", status: 'error' };
  }

  const validatedFields = announcementSchema.safeParse({
    message: formData.get('message'),
  });

  if (!validatedFields.success) {
    return {
      message: "Failed to publish announcement. Please check the errors.",
      status: 'error',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { message } = validatedFields.data;

  try {
    const announcementsCollection = collection(firestore, 'announcements');
    await addDoc(announcementsCollection, {
      message,
      createdAt: serverTimestamp(),
      isActive: true, // Default to active
    });

    revalidatePath('/admin/announcements'); 

    return {
      message: "Announcement published successfully!",
      status: 'success',
    };

  } catch (error) {
    console.error("Error publishing announcement to Firestore:", error);
    return {
      message: "An unexpected error occurred while publishing the announcement. This could be due to Firestore rules. Please try again later.",
      status: 'error',
    };
  }
}
