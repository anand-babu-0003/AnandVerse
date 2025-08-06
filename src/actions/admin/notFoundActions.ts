
"use server";

import type { z } from 'zod';
import { getAdminFirestore } from '@/lib/firebaseAdmin';
import { doc, getDoc, setDoc } from 'firebase-admin/firestore';
import type { NotFoundPageData } from '@/lib/types';
import { notFoundPageAdminSchema, type NotFoundPageAdminFormData } from '@/lib/adminSchemas';
import { revalidatePath } from 'next/cache';
import { defaultNotFoundPageDataForClient } from '@/lib/data';

const notFoundPageDocRef = () => {
  const adminDb = getAdminFirestore();
  return adminDb.collection('app_config').doc('notFoundPageDoc');
}

export async function getNotFoundPageDataAction(): Promise<NotFoundPageData> {
  try {
    const docSnap = await notFoundPageDocRef().get();
    if (docSnap.exists) {
      const data = docSnap.data();
      return {
        imageSrc: data.imageSrc || defaultNotFoundPageDataForClient.imageSrc,
        dataAiHint: data.dataAiHint || defaultNotFoundPageDataForClient.dataAiHint,
        heading: data.heading || defaultNotFoundPageDataForClient.heading,
        message: data.message || defaultNotFoundPageDataForClient.message,
        buttonText: data.buttonText || defaultNotFoundPageDataForClient.buttonText,
      };
    } else {
      console.warn("Not Found Page document not found in Firestore. Returning default data.");
      return JSON.parse(JSON.stringify(defaultNotFoundPageDataForClient));
    }
  } catch (error) {
    console.error("Error fetching Not Found Page data from Firestore:", error);
    return JSON.parse(JSON.stringify(defaultNotFoundPageDataForClient));
  }
}

export type UpdateNotFoundPageDataFormState = {
  message: string;
  status: 'success' | 'error' | 'idle';
  errors?: z.inferFlattenedErrors<typeof notFoundPageAdminSchema>['fieldErrors'];
  data?: NotFoundPageAdminFormData;
};

export async function updateNotFoundPageDataAction(
  prevState: UpdateNotFoundPageDataFormState,
  formData: FormData
): Promise<UpdateNotFoundPageDataFormState> {
  let currentData: NotFoundPageData;
  try {
    currentData = await getNotFoundPageDataAction();
  } catch (e) {
     console.error("Failed to read current 404 page data before update:", e);
     return { message: "Failed to read current settings. Update aborted.", status: 'error' };
  }

  let rawData: NotFoundPageAdminFormData | undefined = undefined;
  try {
    rawData = {
      imageSrc: String(formData.get('imageSrc') || currentData.imageSrc),
      dataAiHint: String(formData.get('dataAiHint') || currentData.dataAiHint),
      heading: String(formData.get('heading') || currentData.heading),
      message: String(formData.get('message') || currentData.message),
      buttonText: String(formData.get('buttonText') || currentData.buttonText),
    };

    const validatedFields = notFoundPageAdminSchema.safeParse(rawData);

    if (!validatedFields.success) {
      const fieldErrors = validatedFields.error.flatten().fieldErrors;
      return {
        message: "Failed to update 404 page settings. Please check errors.",
        status: 'error',
        errors: fieldErrors,
        data: rawData,
      };
    }

    const dataToSave: NotFoundPageData = {
      imageSrc: validatedFields.data.imageSrc || defaultNotFoundPageDataForClient.imageSrc,
      dataAiHint: validatedFields.data.dataAiHint || defaultNotFoundPageDataForClient.dataAiHint,
      heading: validatedFields.data.heading,
      message: validatedFields.data.message,
      buttonText: validatedFields.data.buttonText,
    };

    await setDoc(notFoundPageDocRef(), dataToSave, { merge: true });

    revalidatePath('/', 'layout');
    revalidatePath('/admin/not-found-settings');


    return {
      message: "404 Page settings updated successfully!",
      status: 'success',
      data: validatedFields.data,
      errors: {},
    };

  } catch (error) {
    console.error("Admin 404 Page Action: An unexpected error occurred:", error);
    const errorResponseData: NotFoundPageAdminFormData = rawData || {
      imageSrc: String(formData.get('imageSrc') || defaultNotFoundPageDataForClient.imageSrc),
      dataAiHint: String(formData.get('dataAiHint') || defaultNotFoundPageDataForClient.dataAiHint),
      heading: String(formData.get('heading') || defaultNotFoundPageDataForClient.heading),
      message: String(formData.get('message') || defaultNotFoundPageDataForClient.message),
      buttonText: String(formData.get('buttonText') || defaultNotFoundPageDataForClient.buttonText),
    };
    const errorMessage = (error instanceof Error && 'code' in error)
      ? `Firebase error (${(error as any).code}): ${(error as Error).message}`
      : (error instanceof Error ? error.message : "An unknown server error occurred.");

    return {
      message: `An unexpected server error occurred while updating 404 page settings: ${errorMessage}`,
      status: '