
"use server";

import { firestore } from '@/lib/firebaseConfig';
import { collection, doc, getDocs, getDoc, setDoc, deleteDoc, query, orderBy, Timestamp, addDoc, serverTimestamp } from 'firebase/firestore';
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
        return JSON.parse(JSON.stringify(defaultCertificationsDataForClient || []));
    }
    try {
        const q = query(certificationsCollectionRef(), orderBy('date', 'desc'));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            return [];
        }

        return snapshot.docs.map(docSnap => {
            const data = docSnap.data();
            // Firestore timestamps can be null if the document was created before the field was added
            const createdAt = data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : new Date(0).toISOString();
            const updatedAt = data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : createdAt;

            return {
                id: docSnap.id,
                name: data.name || 'Untitled Certification',
                issuingBody: data.issuingBody || 'Unknown Body',
                date: data.date || 'N/A',
                imageUrl: data.imageUrl || '',
                credentialId: data.credentialId || '',
                credentialUrl: data.credentialUrl || '',
                createdAt: createdAt,
                updatedAt: updatedAt
            } as LibCertificationType;
        });
    } catch (error) {
        console.error("Error fetching certifications from Firestore:", error);
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

    try {
        let finalCertId: string;
        
        if (certId) {
            // --- UPDATE PATH ---
            finalCertId = certId;
            const certRef = certificationDocRef(finalCertId);
            const docSnap = await getDoc(certRef);
            if (!docSnap.exists()) {
                throw new Error("Attempted to update a certification that does not exist.");
            }
            const existingData = docSnap.data();

            const certDataToUpdate = {
                name: data.name,
                issuingBody: data.issuingBody,
                date: data.date,
                imageUrl: data.imageUrl || '',
                credentialId: data.credentialId || '',
                credentialUrl: data.credentialUrl || '',
                createdAt: existingData.createdAt || serverTimestamp(), // Preserve original creation date
                updatedAt: serverTimestamp(),
            };
            await setDoc(certRef, certDataToUpdate);
        } else {
            // --- CREATE PATH ---
            const collectionRef = certificationsCollectionRef();
            const certDataToCreate = {
                name: data.name,
                issuingBody: data.issuingBody,
                date: data.date,
                imageUrl: data.imageUrl || '',
                credentialId: data.credentialId || '',
                credentialUrl: data.credentialUrl || '',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            };
            const newDocRef = await addDoc(collectionRef, certDataToCreate);
            finalCertId = newDocRef.id;
        }

        // --- FETCH AND RETURN SAVED DATA ---
        const savedDoc = await getDoc(certificationDocRef(finalCertId));
        if (!savedDoc.exists()) {
             throw new Error("Failed to retrieve saved certification from Firestore after save operation.");
        }
        const savedData = savedDoc.data();
        // Wait briefly for server timestamp to populate if needed, or handle it being a server-side object
        await new Promise(resolve => setTimeout(resolve, 100)); // Small delay can sometimes help with timestamp propagation
        const finalSnap = await getDoc(certificationDocRef(finalCertId));
        const finalData = finalSnap.data()!;

        const createdAt = finalData.createdAt instanceof Timestamp ? finalData.createdAt.toDate().toISOString() : new Date().toISOString();
        const updatedAt = finalData.updatedAt instanceof Timestamp ? finalData.updatedAt.toDate().toISOString() : new Date().toISOString();
        
        const finalSavedCertification: LibCertificationType = {
            id: finalCertId,
            name: finalData.name,
            issuingBody: finalData.issuingBody,
            date: finalData.date,
            imageUrl: finalData.imageUrl,
            credentialId: finalData.credentialId,
            credentialUrl: finalData.credentialUrl,
            createdAt: createdAt,
            updatedAt: updatedAt,
        };

        revalidatePath('/certifications');
        revalidatePath('/admin/certifications');

        return {
            message: `Certification "${finalSavedCertification.name}" ${data.id ? 'updated' : 'added'} successfully!`,
            status: 'success',
            savedCertification: finalSavedCertification,
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
