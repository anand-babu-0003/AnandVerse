
"use server";

import { firestore } from '@/lib/firebaseConfig';
import { collection, query, orderBy, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import type { ContactMessage } from '@/lib/types';

// Note: With this setup, Firestore rules must allow read/delete access 
// for authenticated users on the 'contactMessages' collection.
// Authentication state is managed on the client in the admin layout.

export async function getContactMessagesAction(): Promise<ContactMessage[]> {
  if (!firestore) return [];

  try {
    const q = query(collection(firestore, 'contactMessages'), orderBy('submittedAt', 'desc'));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      const submittedAt = data.submittedAt?.toDate().toISOString() 
                       || new Date().toISOString();
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
    if (!firestore) return { success: false, message: "Firestore not initialized." };
    if (!messageId) return { success: false, message: "No message ID provided." };
    
    try {
        const docRef = doc(firestore, 'contactMessages', messageId);
        await deleteDoc(docRef);
        revalidatePath('/admin/messages');
        return { success: true, message: `Message deleted successfully!` };
    } catch (error) {
        console.error("Error deleting contact message from Firestore:", error);
        return { success: false, message: "Failed to delete message. This could be due to Firestore rules." };
    }
}
