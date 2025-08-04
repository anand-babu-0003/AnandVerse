
"use server";

import { adminFirestore, getAuthenticatedUser } from '@/lib/firebaseAdminConfig';
import { revalidatePath } from 'next/cache';
import type { Skill as LibSkillType } from '@/lib/types';
import { skillAdminSchema, type SkillAdminFormData } from '@/lib/adminSchemas';
import { defaultSkillsDataForClient, lucideIconsMap } from '@/lib/data'; 
import { Timestamp } from 'firebase-admin/firestore';

const skillsCollectionRef = () => {
  if (!adminFirestore) throw new Error("Firestore Admin SDK not initialized");
  return adminFirestore.collection('skills');
}

const skillDocRef = (id: string) => {
  if (!adminFirestore) throw new Error("Firestore Admin SDK not initialized");
  return adminFirestore.collection('skills').doc(id);
}

export async function getSkillsAction(): Promise<LibSkillType[]> {
  if (!adminFirestore) {
    console.warn("Firestore not initialized in getSkillsAction. Returning default client skills.");
    return JSON.parse(JSON.stringify(defaultSkillsDataForClient)); 
  }
  try {
    const snapshot = await skillsCollectionRef().orderBy('category', 'asc').orderBy('name', 'asc').get();

    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        name: data.name || 'Unnamed Skill',
        category: data.category || 'Other',
        iconName: data.iconName || 'Package',
        proficiency: (data.proficiency === undefined || data.proficiency === null) ? null : Number(data.proficiency),
      } as LibSkillType;
    });
  } catch (error) {
    console.error("Error fetching skills from Firestore:", error);
    // You might still want to return default data to prevent the client from crashing
    return JSON.parse(JSON.stringify(defaultSkillsDataForClient)); 
  }
}

export type SkillFormState = {
  message: string;
  status: 'success' | 'error' | 'idle';
  errors?: Partial<Record<keyof SkillAdminFormData, string[]>>;
  formDataOnError?: SkillAdminFormData;
  savedSkill?: LibSkillType;
};

export async function saveSkillAction(
  prevState: SkillFormState,
  formData: FormData
): Promise<SkillFormState> {
    try {
        await getAuthenticatedUser();
    } catch (authError) {
        return { message: (authError as Error).message, status: 'error' };
    }
  
  const idFromForm = formData.get('id');
  const rawData: SkillAdminFormData = {
    id: (idFromForm && typeof idFromForm === 'string' && idFromForm.trim() !== '') ? idFromForm.trim() : undefined,
    name: String(formData.get('name') || ''),
    category: String(formData.get('category') || 'Other') as LibSkillType['category'],
    proficiency: formData.get('proficiency') as any, 
  };

  const validatedFields = skillAdminSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      message: "Failed to save skill. Please check errors.",
      status: 'error',
      errors: validatedFields.error.flatten().fieldErrors as SkillFormState['errors'],
      formDataOnError: rawData,
    };
  }

  const data = validatedFields.data; 
  let skillId = data.id; 
  
  const determinedIconName = lucideIconsMap[data.name] ? data.name : 'Package';

  const skillToSave: Omit<LibSkillType, 'id'> = {
    name: data.name,
    category: data.category,
    iconName: determinedIconName,
    proficiency: data.proficiency === undefined ? null : data.proficiency,
  };

  try {
    if (skillId) {
        await skillDocRef(skillId).update(skillToSave);
    } else {
        // For new skills, let Firestore generate the ID
        const newDocRef = await skillsCollectionRef().add(skillToSave);
        skillId = newDocRef.id;
    }
    
    const savedSkillData: LibSkillType = {
      id: skillId,
      ...skillToSave,
    };

    revalidatePath('/skills');
    revalidatePath('/admin/skills');
    revalidatePath('/'); 

    return {
      message: `Skill "${savedSkillData.name}" ${data.id ? 'updated' : 'added'} successfully!`,
      status: 'success',
      savedSkill: savedSkillData,
      errors: {},
    };

  } catch (error) {
    console.error("Error saving skill to Firestore:", error);
    return {
      message: "An unexpected server error occurred while saving the skill.",
      status: 'error',
      errors: {}, 
      formDataOnError: rawData,
    };
  }
}

export type DeleteSkillResult = {
    success: boolean;
    message: string;
};

export async function deleteSkillAction(itemId: string): Promise<DeleteSkillResult> {
    try {
        await getAuthenticatedUser();
    } catch (authError) {
        return { success: false, message: (authError as Error).message };
    }
    if (!itemId) {
        return { success: false, message: "No skill ID provided for deletion." };
    }
    try {
        await skillDocRef(itemId).delete();
        revalidatePath('/skills');
        revalidatePath('/admin/skills');
        revalidatePath('/');
        return { success: true, message: `Skill (ID: ${itemId}) deleted successfully!` };
    } catch (error) {
        console.error("Error deleting skill from Firestore:", error);
        return { success: false, message: "Failed to delete skill due to a server error." };
    }
}
