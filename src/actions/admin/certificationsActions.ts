
"use server";

import { getAdminFirestore } from '@/lib/firebaseAdmin';
import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  addDoc, 
  deleteDoc, 
  updateDoc, 
  getDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';
import type { Certification as LibCertificationType } from '@/lib/types';
import { certificationAdminSchema, type CertificationAdminFormData } from '@/lib/adminSchemas';
import { defaultCertificationsDataForClient } from '@/lib/data';

export async function getCertificationsAction(): Promise<LibCertificationType[]> {
  try {
    const adminDb = getAdminFirestore();
    const q = adminDb.collection('certifications').orderBy('date', 'desc');
    const snapshot = await q.get();

    if (snapshot.empty) {
      return [];
    }

    return snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      const createdAt = (data.createdAt as Timestamp)?.toDate().toISOString() || new Date(0).toISOString();
      const updatedAt = (data.updatedAt as Timestamp)?.toDate().toISOString() || createdAt;

      return {
        id: docSnap.id,
        name: data.name || 'Untitled Certification',
        issuingBody: data.issuingBody || 'Unknown Body',
        date: data.date || 'N/A',
        imageUrl: data.imageUrl || '',
        credentialId: data.credentialId || '',
        credentialUrl: data.credentialUrl || '',
        createdAt,
        updatedAt
      } as LibCertificationType;
    });
  } catch (error) {
    console.error("Error fetching certifications from Admin Firestore:", error);
    return JSON.parse(JSON.stringify(defaultCertificationsDataForClient || []));
  }
}

export type CertificationFormState = {
    message: string;
    status: 'success' | 'error' | 'idle';
    errors?: Partial<Record<keyof CertificationAdminFormData, string[]>>;
    formDataOnError?: CertificationAdminFormData;
    savedCertification?: LibCertificationType;
};

export async function saveCertificationAction(
    prevState: CertificationFormState,
    formData: FormData
): Promise<CertificationFormState> {
    const adminDb = getAdminFirestore();
    
    const idFromForm = formData.get('id');
    const rawData: CertificationAdminFormData = {
        id: (idFromForm && typeof idFromForm === 'string' && idFromForm.trim() !== '') ? idFromForm.trim() : undefined,
        name: String(formData.get('name') || ''),
        issuingBody: String(formData.get('issuingBody') || ''),
        date: String(formData.get('date') || ''),
        imageUrl: String(formData.get('imageUrl') || ''),
        credentialId: String(formData.get('credentialId') || ''),
        credentialUrl: String(formData.get('credentialUrl') || ''),
    };
    
    const validatedFields = certificationAdminSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return {
            message: "Failed to save certification. Please check errors.",
            status: 'error',
            errors: validatedFields.error.flatten().fieldErrors,
            formDataOnError: rawData,
        };
    }

    const data = validatedFields.data;
    const certId = data.id;
    let finalCertId: string;

    try {
        const dataToSave = {
            name: data.name,
            issuingBody: data.issuingBody,
            date: data.date,
            imageUrl: data.imageUrl || '',
            credentialId: data.credentialId || '',
            credentialUrl: data.credentialUrl || '',
            updatedAt: serverTimestamp(),
        };

        if (certId) {
            finalCertId = certId;
            const certRef = adminDb.collection('certifications').doc(finalCertId);
            await updateDoc(certRef, dataToSave);
        } else {
            const collectionRef = adminDb.collection('certifications');
            const newDocRef = await addDoc(collectionRef, {
                ...dataToSave,
                createdAt: serverTimestamp(),
            });
            finalCertId = newDocRef.id;
        }

        revalidatePath('/certifications');
        revalidatePath('/admin/certifications');

        const savedDocRef = adminDb.collection('certifications').doc(finalCertId);
        const savedDoc = await getDoc(savedDocRef);
        const savedData = savedDoc.data();

        if (!savedData) {
          throw new Error("Failed to retrieve saved certification.");
        }

        const finalSavedCertification: LibCertificationType = {
            id: finalCertId,
            name: savedData.name,
            issuingBody: savedData.issuingBody,
            date: savedData.date,
            imageUrl: savedData.imageUrl,
            credentialId: savedData.credentialId,
            credentialUrl: savedData.credentialUrl,
            createdAt: (savedData.createdAt as Timestamp)?.toDate().toISOString(),
            updatedAt: (savedData.updatedAt as Timestamp)?.toDate().toISOString(),
        };

        return {
            message: `Certification "${finalSavedCertification.name}" ${data.id ? 'updated' : 'added'} successfully!`,
            status: 'success',
            savedCertification: finalSavedCertification,
            errors: {},
        };
    } catch (error) {
        console.error("Error saving certification to Firestore:", error);
        return {
            message: "An unexpected server error occurred while saving.",
            status: 'error',
            errors: {},
            formDataOnError: rawData,
        };
    }
}

export type DeleteCertificationResult = {
    success: boolean;
    message: string;
};

export async function deleteCertificationAction(itemId: string): Promise<DeleteCertificationResult> {
    if (!itemId) return { success: false, message: "No certification ID provided for deletion." };
    
    try {
        const adminDb = getAdminFirestore();
        const certRef = adminDb.collection('certifications').doc(itemId);
        await deleteDoc(certRef);
        revalidatePath('/certifications');
        revalidatePath('/admin/certifications');
        return { success: true, message: `Certification (ID: ${itemId}) deleted successfully!` };
    } catch (error) {
        console.error("Error deleting certification from Firestore:", error);
        return { success: false, message: "Failed to delete certification due to a server error." };
