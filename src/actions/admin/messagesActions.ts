
"use server";

import { getAdminFirestore } from '@/lib/firebaseAdmin';
import { firestore } from '@/lib/firebaseConfig';
import { doc, deleteDoc } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import type { ContactMessage } from '@/lib/types';
import { Timestamp } from 'firebase-admin/firestore';

// Use Admin SDK for server-side data fetching
export async function getContactMessagesAction(): Promise<ContactMessage[]> {
  try {
    const adminDb = getAdminFirestore();
    const snapshot = await adminDb.collection('contactMessages').orderBy('submittedAt', 'desc').get();
    
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      const submittedAt = (data.submittedAt as Timestamp)?.toDate().toISOString() 
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
    console.error("Error fetching contact messages from Admin Firestore:", error);
    return []; 
  }
}

export type DeleteMessageResult = {
    success: boolean;
    message: string;
};

// Use Client SDK for write operations from the browser (as an authenticated user)
export async function deleteContactMessageAction(messageId: string): Promise<DeleteMessageResult> {
    if (!firestore) return { success: false, message: "Client Firestore not initialized." };
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
