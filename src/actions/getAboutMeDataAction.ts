
"use server";

import { adminFirestore } from '@/lib/firebaseAdminConfig';
import { Timestamp } from 'firebase-admin/firestore';
import type { AboutMeData } from '@/lib/types';
import { defaultAboutMeDataForClient } from '@/lib/data';

const aboutMeDocRef = () => {
  if (!adminFirestore) throw new Error("Firestore Admin SDK not initialized");
  return adminFirestore.collection('app_config').doc('aboutMeDoc');
}

export async function getAboutMeDataAction(): Promise<AboutMeData> {
  if (!adminFirestore) {
    console.warn("Firestore Admin SDK not initialized in getAboutMeDataAction. Returning default data.");
    return JSON.parse(JSON.stringify(defaultAboutMeDataForClient)); // Return a deep clone
  }

  try {
    const docSnap = await aboutMeDocRef().get();
    if (docSnap.exists) {
      const data = docSnap.data() as Partial<AboutMeData>;
      const defaultData = defaultAboutMeDataForClient;
      
      return {
        name: data.name || defaultData.name,
        title: data.title || defaultData.title,
        bio: data.bio || defaultData.bio,
        profileImage: data.profileImage || defaultData.profileImage,
        dataAiHint: data.dataAiHint || defaultData.dataAiHint,
        experience: (Array.isArray(data.experience) ? data.experience : defaultData.experience).map(exp => ({ 
            ...exp, 
            id: exp.id || `exp_fetch_${Date.now()}_${Math.random().toString(36).substring(2, 7)}` 
        })),
        education: (Array.isArray(data.education) ? data.education : defaultData.education).map(edu => ({ 
            ...edu, 
            id: edu.id || `edu_fetch_${Date.now()}_${Math.random().toString(36).substring(2, 7)}` 
        })),
        certifications: [], // Certifications are managed separately
        email: data.email || defaultData.email,
        linkedinUrl: data.linkedinUrl || defaultData.linkedinUrl,
        githubUrl: data.githubUrl || defaultData.githubUrl,
        twitterUrl: data.twitterUrl || defaultData.twitterUrl,
      };
    } else {
      console.warn("About Me document not found in Firestore. Returning default data.");
      return JSON.parse(JSON.stringify(defaultAboutMeDataForClient)); 
    }
  } catch (error) {
    console.error("Error fetching About Me data from Firestore:", error);
    return JSON.parse(JSON.stringify(defaultAboutMeDataForClient)); 
  }
}
