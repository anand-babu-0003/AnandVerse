
"use server";

import { getAdminFirestore, getAuthenticatedUser } from '@/lib/firebaseAdminConfig';
import { revalidatePath } from 'next/cache';
import type { ContactMessage } from '@/lib/types';
import { Timestamp } from 'firebase-admin/firestore';

const messagesCollectionRef = async () => {
  return (await getAdminFirestore()).collection('contactMessages');
}

const messageDocRef = async (id: string) => {
  return (await getAdminFirestore()).collection('contactMessages').doc(id);
}

export async function getContactMessagesAction(): Promise<ContactMessage[]> {
  try {
    await getAuthenticatedUser();
  } catch (authError) {
    console.error("Authentication error in getContactMessagesAction:", authError);
    return []; 
  }

  const adminFirestore = await getAdminFirestore();
  
  try {
    const collectionRef = await messagesCollectionRef();
    const snapshot = await collectionRef.orderBy('submittedAt', 'desc').get();
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      const submittedAt = data.submittedAt instanceof Timestamp 
                       ? data.submittedAt.toDate().toISOString() 
                       : (typeof data.submittedAt === 'string' ? data.submittedAt : new Date().toISOString()); 
      return {
        id: docSnap.id,
        name: data.name || 'N/A',
        email: data.email || 'N/A',
        message: data.message || '',
        submittedAt: submittedAt,
      } as ContactMessage;
    });
  } catch (error) {
    console.error("Error fetching contact messages from Firestore:", error);
    return []; 
  }
}

export type DeleteMessageResult = {
    success: boolean;
    message: string;
};

export async function deleteContactMessageAction(messageId: string): Promise<DeleteMessageResult> {
    try {
        await getAuthenticatedUser();
    } catch (authError) {
        return { success: false, message: (authError as Error).message };
    }
    if (!messageId) {
        return { success: false, message: "No message ID provided for deletion." };
    }
    
    try {
        const docRef = await messageDocRef(messageId);
        await docRef.delete();
        revalidatePath('/admin/messages');
        return { success: true, message: `Message (ID: ${messageId}) deleted successfully!` };
    } catch (error) {
        console.error("Error deleting contact message from Firestore:", error);
        return { success: false, message: "Failed to delete message due to a server error." };
    }
}
