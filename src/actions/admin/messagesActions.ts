
"use server";

import { getAdminFirestore } from '@/lib/firebaseAdmin';
import { doc, deleteDoc, Timestamp } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';
import type { ContactMessage } from '@/lib/types';

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

export async function deleteContactMessageAction(messageId: string): Promise<DeleteMessageResult> {
    if (!messageId) return { success: false, message: "No message ID provided." };
    
    try {
        const adminDb = getAdminFirestore();
        const docRef = adminDb.collection('contactMessages').doc(messageId);
        await deleteDoc(docRef);
        revalidatePath('/admin/messages');
        return { success: true, message: `Message deleted successfully!` };
    } catch (error) {
        console.error("Error deleting contact message from Firestore:", error);
        return { success: false, message: "Failed to delete message due to a server error." };
    }
}
