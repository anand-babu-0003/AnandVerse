
"use server";

import { firestore } from '@/lib/firebaseConfig';
import { collection, getDocs, doc, deleteDoc, setDoc, query, orderBy, Timestamp, serverTimestamp } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import type { ContactMessage } from '@/lib/types';

const messagesCollectionRef = () => {
  if (!firestore) throw new Error("Firestore not initialized");
  return collection(firestore, 'contactMessages');
}

const messageDocRef = (id: string) => {
  if (!firestore) throw new Error("Firestore not initialized");
  return doc(firestore, 'contactMessages', id);
}

export async function getContactMessagesAction(): Promise<ContactMessage[]> {
  if (!firestore) {
    console.warn("Firestore not initialized in getContactMessagesAction. Returning empty array.");
    return [];
  }
  try {
    const q = query(messagesCollectionRef(), orderBy('submittedAt', 'desc'));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      // Ensure submittedAt is always a string (ISO format)
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
    if (!messageId) {
        return { success: false, message: "No message ID provided for deletion." };
    }
    if (!firestore) {
      return { success: false, message: "Firestore not initialized. Cannot delete message." };
    }
    try {
        await deleteDoc(messageDocRef(messageId));
        revalidatePath('/admin/messages');
        return { success: true, message: `Message (ID: ${messageId}) deleted successfully!` };
    } catch (error) {
        console.error("Error deleting contact message from Firestore:", error);
        return { success: false, message: "Failed to delete message due to a server error." };
    }
}

export type MarkMessageAsReadResult = {
    success: boolean;
    message: string;
};

export async function markMessageAsReadAction(messageId: string): Promise<MarkMessageAsReadResult> {
    if (!messageId) {
        return { success: false, message: "No message ID provided." };
    }
    if (!firestore) {
        return { success: false, message: "Firestore not initialized. Cannot mark message as read." };
    }
    try {
        const messageRef = messageDocRef(messageId);
        await setDoc(messageRef, { isRead: true, readAt: serverTimestamp() }, { merge: true });
        revalidatePath('/admin/messages');
        return { success: true, message: `Message (ID: ${messageId}) marked as read successfully!` };
    } catch (error) {
        console.error("Error marking message as read in Firestore:", error);
        return { success: false, message: "Failed to mark message as read due to a server error." };
    }
}


    