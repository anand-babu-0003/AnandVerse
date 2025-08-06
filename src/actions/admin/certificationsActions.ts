
"use server";

import { getAdminFirestore, getAuthenticatedUser } from '@/lib/firebaseAdminConfig';
import { revalidatePath } from 'next/cache';
import type { Certification as LibCertificationType } from '@/lib/types';
import { certificationAdminSchema, type CertificationAdminFormData } from '@/lib/adminSchemas';
import { defaultCertificationsDataForClient } from '@/lib/data';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';

const certificationsCollectionRef = async () => {
    return (await getAdminFirestore()).collection('certifications');
};

const certificationDocRef = async (id: string) => {
    return (await getAdminFirestore()).collection('certifications').doc(id);
};

export async function getCertificationsAction(): Promise<LibCertificationType[]> {
    const adminFirestore = await getAdminFirestore();
    try {
        const collectionRef = await certificationsCollectionRef();
        const snapshot = await collectionRef.orderBy('date', 'desc').get();

        if (snapshot.empty) {
            return [];
        }

        return snapshot.docs.map(docSnap => {
            const data = docSnap.data();
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
    try {
        await getAuthenticatedUser();
    } catch (authError) {
        return { message: (authError as Error).message, status: 'error' };
    }
    
    const adminFirestore = await getAdminFirestore();

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
            finalCertId = certId;
            const certRef = await certificationDocRef(finalCertId);
            const docSnap = await certRef.get();
            if (!docSnap.exists) {
                throw new Error("Attempted to update a certification that does not exist.");
            }
            const certDataToUpdate = {
                name: data.name,
                issuingBody: data.issuingBody,
                date: data.date,
                imageUrl: data.imageUrl || '',
                credentialId: data.credentialId || '',
                credentialUrl: data.credentialUrl || '',
                updatedAt: FieldValue.serverTimestamp(),
            };
            await certRef.update(certDataToUpdate);
        } else {
            const collectionRef = await certificationsCollectionRef();
            const certDataToCreate = {
                name: data.name,
                issuingBody: data.issuingBody,
                date: data.date,
                imageUrl: data.imageUrl || '',
                credentialId: data.credentialId || '',
                credentialUrl: data.credentialUrl || '',
                createdAt: FieldValue.serverTimestamp(),
                updatedAt: FieldValue.serverTimestamp(),
            };
            const newDocRef = await collectionRef.add(certDataToCreate);
            finalCertId = newDocRef.id;
        }

        revalidatePath('/certifications');
        revalidatePath('/admin/certifications');

        const savedDocRef = await certificationDocRef(finalCertId);
        const savedDoc = await savedDocRef.get();
        if (!savedDoc.exists) {
             throw new Error("Failed to retrieve saved certification from Firestore after save operation.");
        }
        
        const finalData = savedDoc.data()!;
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
    try {
        await getAuthenticatedUser();
    } catch (authError) {
        return { success: false, message: (authError as Error).message };
    }
    if (!itemId) {
        return { success: false, message: "No certification ID provided for deletion." };
    }
    try {
        const certRef = await certificationDocRef(itemId);
        await certRef.delete();
        revalidatePath('/certifications');
        revalidatePath('/admin/certifications');
        return { success: true, message: `Certification (ID: ${itemId}) deleted successfully!` };
    } catch (error) {
        console.error("Error deleting certification from Firestore:", error);
        return { success: false, message: "Failed to delete certification due to a server error." };
    }
}
