
"use server";

import { z } from 'zod';
import { getAdminFirestore, getAuthenticatedUser } from '@/lib/firebaseAdminConfig';
import { FieldValue } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache'; 

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

    try {
        await getAuthenticatedUser();
    } catch (authError) {
        return { message: (authError as Error).message, status: 'error' };
    }
  
  const adminFirestore = await getAdminFirestore();

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
    const announcementsCollection = adminFirestore.collection('announcements');
    await announcementsCollection.add({
      message,
      createdAt: FieldValue.serverTimestamp(),
      isActive: true, // Default to active
    });

    // Revalidate relevant paths if needed, though onSnapshot handles client updates
    // revalidatePath('/'); 

    return {
      message: "Announcement published successfully!",
      status: 'success',
    };

  } catch (error) {
    console.error("Error publishing announcement to Firestore:", error);
    return {
      message: "An unexpected error occurred while publishing the announcement. Please try again later.",
      status: 'error',
    };
  }
}
