
"use server";

import { getAdminFirestore } from '@/lib/firebaseAdmin';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc,
  getDocs,
  query,
  orderBy,
} from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';
import type { Skill as LibSkillType } from '@/lib/types';
import { skillAdminSchema, type SkillAdminFormData } from '@/lib/adminSchemas';
import { defaultSkillsDataForClient, lucideIconsMap } from '@/lib/data';

export async function getSkillsAction(): Promise<LibSkillType[]> {
  try {
    const adminDb = getAdminFirestore();
    const q = query(adminDb.collection('skills'), orderBy('category', 'asc'), orderBy('name', 'asc'));
    const snapshot = await getDocs(q);

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
    console.error("Error fetching skills from Admin Firestore:", error);
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
  const adminDb = getAdminFirestore();
  
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
    const docRef = skillId ? adminDb.collection('skills').doc(skillId) : doc(adminDb.collection('skills'));
    if (!skillId) {
      skillId = docRef.id;
    }
    await setDoc(docRef, skillToSave, { merge: true });
    
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
      message: "An unexpected server error occurred.",
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
    if (!itemId) return { success: false, message: "No skill ID provided for deletion." };
    
    try {
        const adminDb = getAdminFirestore();
        const docRef = adminDb.collection('skills').doc(itemId);
        await deleteDoc(docRef);
        revalidatePath('/skills');
        revalidatePath('/admin/skills');
        revalidatePath('/');
        return { success: true, message: `Skill (ID: ${itemId}) deleted successfully!` };
    } catch (error) {
        console.error("Error deleting skill from Firestore:", error);
        return { success: false, message: "Failed to delete skill." };
    }