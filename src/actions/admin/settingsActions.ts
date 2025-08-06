
"use server";

import type { z } from 'zod';
import { getAdminFirestore } from '@/lib/firebaseAdmin';
import { doc, getDoc, setDoc } from 'firebase-admin/firestore';
import type { SiteSettings } from '@/lib/types';
import { siteSettingsAdminSchema, type SiteSettingsAdminFormData } from '@/lib/adminSchemas';
import { revalidatePath } from 'next/cache';
import { defaultSiteSettingsForClient } from '@/lib/data';

export async function getSiteSettingsAction(): Promise<SiteSettings> {
  try {
    const adminDb = getAdminFirestore();
    const docRef = adminDb.collection('app_config').doc('siteSettingsDoc');
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      const data = docSnap.data();
      return {
        siteName: data?.siteName || defaultSiteSettingsForClient.siteName,
        defaultMetaDescription: data?.defaultMetaDescription || defaultSiteSettingsForClient.defaultMetaDescription,
        defaultMetaKeywords: data?.defaultMetaKeywords || defaultSiteSettingsForClient.defaultMetaKeywords,
        siteOgImageUrl: data?.siteOgImageUrl || defaultSiteSettingsForClient.siteOgImageUrl,
        maintenanceMode: typeof data?.maintenanceMode === 'boolean' ? data.maintenanceMode : defaultSiteSettingsForClient.maintenanceMode,
        skillsPageMetaTitle: data?.skillsPageMetaTitle || defaultSiteSettingsForClient.skillsPageMetaTitle, 
        skillsPageMetaDescription: data?.skillsPageMetaDescription || defaultSiteSettingsForClient.skillsPageMetaDescription,
        faviconUrl: data?.faviconUrl || defaultSiteSettingsForClient.faviconUrl,
        appleTouchIconUrl: data?.appleTouchIconUrl || defaultSiteSettingsForClient.appleTouchIconUrl,
      };
    } else {
      console.warn("Site settings document not found in Firestore. Returning default settings.");
      return JSON.parse(JSON.stringify(defaultSiteSettingsForClient));
    }
  } catch (error) {
    console.error("Error fetching site settings from Admin Firestore:", error);
    return JSON.parse(JSON.stringify(defaultSiteSettingsForClient));
  }
}

export type UpdateSiteSettingsFormState = {
  message: string;
  status: 'success' | 'error' | 'idle';
  errors?: z.inferFlattenedErrors<typeof siteSettingsAdminSchema>['fieldErrors'];
  data?: SiteSettingsAdminFormData;
};

export async function updateSiteSettingsAction(
  prevState: UpdateSiteSettingsFormState,
  formData: FormData
): Promise<UpdateSiteSettingsFormState> {
  let currentSettings: SiteSettings;
  try {
    currentSettings = await getSiteSettingsAction(); 
  } catch (e) {
     console.error("Failed to read current site settings before update:", e);
     return { message: "Failed to read current settings. Update aborted.", status: 'error' };
  }

  let rawData: SiteSettingsAdminFormData | undefined = undefined;
  try {
    rawData = {
      siteName: String(formData.get('siteName') || currentSettings.siteName),
      defaultMetaDescription: String(formData.get('defaultMetaDescription') || currentSettings.defaultMetaDescription),
      defaultMetaKeywords: String(formData.get('defaultMetaKeywords') || currentSettings.defaultMetaKeywords || ''),
      siteOgImageUrl: String(formData.get('siteOgImageUrl') || currentSettings.siteOgImageUrl || ''),
      maintenanceMode: formData.get('maintenanceMode') === 'on',
      skillsPageMetaTitle: String(formData.get('skillsPageMetaTitle') || currentSettings.skillsPageMetaTitle || ''), 
      skillsPageMetaDescription: String(formData.get('skillsPageMetaDescription') || currentSettings.skillsPageMetaDescription || ''),
      faviconUrl: String(formData.get('faviconUrl') || currentSettings.faviconUrl || ''),
      appleTouchIconUrl: String(formData.get('appleTouchIconUrl') || currentSettings.appleTouchIconUrl || ''),
    };

    const validatedFields = siteSettingsAdminSchema.safeParse(rawData);

    if (!validatedFields.success) {
      const fieldErrors = validatedFields.error.flatten().fieldErrors;
      return {
        message: "Failed to update site settings. Please check errors.",
        status: 'error',
        errors: fieldErrors,
        data: rawData,
      };
    }

    const dataToSave: SiteSettings = {
      siteName: validatedFields.data.siteName,
      defaultMetaDescription: validatedFields.data.defaultMetaDescription,
      defaultMetaKeywords: validatedFields.data.defaultMetaKeywords || '',
      siteOgImageUrl: validatedFields.data.siteOgImageUrl || '',
      maintenanceMode: validatedFields.data.maintenanceMode || false,
      skillsPageMetaTitle: validatedFields.data.skillsPageMetaTitle || '',
      skillsPageMetaDescription: validatedFields.data.skillsPageMetaDescription || '',
      faviconUrl: validatedFields.data.faviconUrl || defaultSiteSettingsForClient.faviconUrl,
      appleTouchIconUrl: validatedFields.data.appleTouchIconUrl || defaultSiteSettingsForClient.appleTouchIconUrl,
    };
    
    const adminDb = getAdminFirestore();
    const siteSettingsDocRef = adminDb.collection('app_config').doc('siteSettingsDoc');
    await setDoc(siteSettingsDocRef, dataToSave, { merge: true });

    revalidatePath('/', 'layout'); 

    return {
      message: "Site settings updated successfully!",
      status: 'success',
      data: validatedFields.data, 
      errors: {},
    };

  } catch (error) {
    console.error("Admin SiteSettings Action: An unexpected error occurred:", error);
    const errorResponseData: SiteSettingsAdminFormData = rawData || (Object.fromEntries(formData.entries()) as unknown as SiteSettingsAdminFormData);
    const errorMessage = (error instanceof Error && 'code' in error)
      ? `Firebase error (${(error as any).code}): ${(error as Error).message}`
      : (error instanceof Error ? error.message : "An unknown server error occurred.");

    return {
      message: `An unexpected server error occurred while updating site settings: ${errorMessage}`,
      status: 'error',
      errors: {},
      data: errorResponseData,
    };
  }
}
