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
import type { Notification } from '@/lib/types';
import { revalidatePath } from 'next/cache';

// Collection reference
const notificationsCollectionRef = () => {
  if (!firestore) throw new Error("Firestore not initialized");
  return collection(firestore, 'notifications');
};

const notificationDocRef = (id: string) => {
  if (!firestore) throw new Error("Firestore not initialized");
  return doc(firestore, 'notifications', id);
};

// Create notification
export async function createNotificationAction(
  type: 'info' | 'success' | 'warning' | 'error',
  title: string,
  message: string,
  actionUrl?: string,
  actionText?: string
): Promise<{ success: boolean; notificationId?: string; error?: string }> {
  if (!firestore) {
    return { success: false, error: "Firestore not initialized" };
  }

  try {
    const notificationData = {
      type,
      title,
      message,
      read: false,
      actionUrl: actionUrl || '',
      actionText: actionText || '',
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(notificationsCollectionRef(), notificationData);
    
    revalidatePath('/admin/dashboard');
    
    return { success: true, notificationId: docRef.id };
  } catch (error) {
    console.error('Error creating notification:', error);
    return { success: false, error: 'Failed to create notification' };
  }
}

// Get all notifications
export async function getNotificationsAction(): Promise<Notification[]> {
  if (!firestore) {
    console.warn("Firestore not initialized in getNotificationsAction. Returning empty array.");
    return [];
  }

  try {
    const q = query(notificationsCollectionRef(), orderBy('createdAt', 'desc'), limit(50));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return [];
    }

    return snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      const createdAt = data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt || new Date().toISOString());
      
      return {
        id: docSnap.id,
        type: data.type || 'info',
        title: data.title || '',
        message: data.message || '',
        read: data.read || false,
        createdAt: createdAt,
        actionUrl: data.actionUrl || '',
        actionText: data.actionText || '',
      } as Notification;
    });
  } catch (error) {
    console.error("Error fetching notifications from Firestore:", error);
    return [];
  }
}

// Get unread notifications
export async function getUnreadNotificationsAction(): Promise<Notification[]> {
  if (!firestore) {
    console.warn("Firestore not initialized in getUnreadNotificationsAction. Returning empty array.");
    return [];
  }

  try {
    const q = query(
      notificationsCollectionRef(), 
      where('read', '==', false),
      orderBy('createdAt', 'desc'),
      limit(20)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return [];
    }

    return snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      const createdAt = data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt || new Date().toISOString());
      
      return {
        id: docSnap.id,
        type: data.type || 'info',
        title: data.title || '',
        message: data.message || '',
        read: data.read || false,
        createdAt: createdAt,
        actionUrl: data.actionUrl || '',
        actionText: data.actionText || '',
      } as Notification;
    });
  } catch (error) {
    console.error("Error fetching unread notifications from Firestore:", error);
    return [];
  }
}

// Mark notification as read
export async function markNotificationAsReadAction(notificationId: string): Promise<{ success: boolean; error?: string }> {
  if (!notificationId) {
    return { success: false, error: "No notification ID provided" };
  }
  if (!firestore) {
    return { success: false, error: "Firestore not initialized" };
  }

  try {
    await setDoc(notificationDocRef(notificationId), {
      read: true,
      updatedAt: serverTimestamp(),
    }, { merge: true });

    revalidatePath('/admin/dashboard');
    
    return { success: true };
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return { success: false, error: 'Failed to mark notification as read' };
  }
}

// Mark all notifications as read
export async function markAllNotificationsAsReadAction(): Promise<{ success: boolean; error?: string }> {
  if (!firestore) {
    return { success: false, error: "Firestore not initialized" };
  }

  try {
    const unreadNotifications = await getUnreadNotificationsAction();
    
    const batch = firestore.batch();
    unreadNotifications.forEach(notification => {
      const docRef = notificationDocRef(notification.id);
      batch.update(docRef, {
        read: true,
        updatedAt: serverTimestamp(),
      });
    });

    await batch.commit();
    
    revalidatePath('/admin/dashboard');
    
    return { success: true };
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return { success: false, error: 'Failed to mark all notifications as read' };
  }
}

// Delete notification
export async function deleteNotificationAction(notificationId: string): Promise<{ success: boolean; error?: string }> {
  if (!notificationId) {
    return { success: false, error: "No notification ID provided" };
  }
  if (!firestore) {
    return { success: false, error: "Firestore not initialized" };
  }

  try {
    await deleteDoc(notificationDocRef(notificationId));
    
    revalidatePath('/admin/dashboard');
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting notification:', error);
    return { success: false, error: 'Failed to delete notification' };
  }
}

// Delete all notifications
export async function deleteAllNotificationsAction(): Promise<{ success: boolean; error?: string }> {
  if (!firestore) {
    return { success: false, error: "Firestore not initialized" };
  }

  try {
    const allNotifications = await getNotificationsAction();
    
    const batch = firestore.batch();
    allNotifications.forEach(notification => {
      const docRef = notificationDocRef(notification.id);
      batch.delete(docRef);
    });

    await batch.commit();
    
    revalidatePath('/admin/dashboard');
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting all notifications:', error);
    return { success: false, error: 'Failed to delete all notifications' };
  }
}

// System notification helpers
export async function notifyNewContactMessageAction(messageId: string, clientName: string): Promise<void> {
  await createNotificationAction(
    'info',
    'New Contact Message',
    `You have a new message from ${clientName}`,
    `/admin/messages`,
    'View Message'
  );
}

export async function notifyNewBlogPostAction(postTitle: string): Promise<void> {
  await createNotificationAction(
    'success',
    'Blog Post Published',
    `Your blog post "${postTitle}" has been published successfully`,
    `/blog`,
    'View Post'
  );
}

export async function notifyPortfolioUpdateAction(projectTitle: string): Promise<void> {
  await createNotificationAction(
    'info',
    'Portfolio Updated',
    `Your project "${projectTitle}" has been updated`,
    `/portfolio`,
    'View Project'
  );
}

export async function notifySystemErrorAction(errorMessage: string): Promise<void> {
  await createNotificationAction(
    'error',
    'System Error',
    `An error occurred: ${errorMessage}`,
    undefined,
    undefined
  );
}
