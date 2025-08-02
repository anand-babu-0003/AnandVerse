
"use server";

import { firestore } from '@/lib/firebaseConfig';
import { collection, doc, getDocs, setDoc, deleteDoc, query, orderBy, Timestamp } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import type { Certification as LibCertificationType } from '@/lib/types';
import { certificationAdminSchema, type CertificationAdminFormData } from '@/lib/adminSchemas';
import { defaultCertificationsDataForClient } from '@/lib/data';

const certificationsCollectionRef = () => {
    if (!firestore) throw new Error("Firestore not initialized");
    return collection(firestore, 'certifications');
};

const certificationDocRef = (id: string) => {
    if (!firestore) throw new Error("Firestore not initialized");
    return doc(firestore, 'certifications', id);
};

export async function getCertificationsAction(): Promise<LibCertificationType[]> {
    if (!firestore) {
        console.warn("Firestore not initialized in getCertificationsAction. Returning default client data.");
        return JSON.parse(JSON.stringify(defaultCertificationsDataForClient));
    }
    try {
        const q = query(certificationsCollectionRef(), orderBy('date', 'desc'));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            return [];
        }

        return snapshot.docs.map(docSnap => {
            const data = docSnap.data();
            return {
                id: docSnap.id,
                name: data.name || 'Untitled Certification',
                issuingBody: data.issuingBody || 'Unknown Body',
                date: data.date || 'N/A',
            } as LibCertificationType;
        });
    } catch (error) {
        console.error("Error fetching certifications from Firestore:", error);
        return JSON.parse(JSON.stringify(defaultCertificationsDataForClient));
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
    if (!firestore) {
        return { 
            message: "Firestore is not initialized.", 
            status: 'error', 
            formDataOnError: Object.fromEntries(formData.entries()) as unknown as CertificationAdminFormData
        };
    }

    const idFromForm = formData.get('id');
    const rawData: CertificationAdminFormData = {
        id: (idFromForm && typeof idFromForm === 'string' && idFromForm.trim() !== '') ? idFromForm.trim() : undefined,
        name: String(formData.get('name') || ''),
        issuingBody: String(formData.get('issuingBody') || ''),
        date: String(formData.get('date') || ''),
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
    let certId = data.id;
    if (!certId) {
        certId = `cert_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    }

    const certToSave: Omit<LibCertificationType, 'id'> = {
        name: data.name,
        issuingBody: data.issuingBody,
        date: data.date,
    };

    try {
        await setDoc(certificationDocRef(certId), certToSave, { merge: true });
        
        const savedData: LibCertificationType = { id: certId, ...certToSave };

        revalidatePath('/certifications');
        revalidatePath('/admin/certifications');

        return {
            message: `Certification "${savedData.name}" ${data.id ? 'updated' : 'added'} successfully!`,
            status: 'success',
            savedCertification: savedData,
            errors: {},
        };
    } catch (error) {
        console.error("Error saving certification to Firestore:", error);
        return {
            message: "An unexpected server error occurred while saving the certification.",
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
    if (!itemId) {
        return { success: false, message: "No certification ID provided for deletion." };
    }
    if (!firestore) {
      return { success: false, message: "Firestore not initialized." };
    }
    try {
        await deleteDoc(certificationDocRef(itemId));
        revalidatePath('/certifications');
        revalidatePath('/admin/certifications');
        return { success: true, message: `Certification (ID: ${itemId}) deleted successfully!` };
    } catch (error) {
        console.error("Error deleting certification from Firestore:", error);
        return { success: false, message: "Failed to delete certification due to a server error." };
    }
}
