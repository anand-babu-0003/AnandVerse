
"use server";

import { getAdminFirestore } from '@/lib/firebaseAdmin';
import type { AboutMeData } from '@/lib/types';
import { defaultAboutMeDataForClient } from '@/lib/data';

// This is a server-side only action, so it should use the Admin SDK.
export async function getAboutMeDataAction(): Promise<AboutMeData> {
  try {
    const adminDb = getAdminFirestore();
    const docRef = adminDb.collection('app_config').doc('aboutMeDoc');
    const docSnap = await docRef.get();
    
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
    console.error("Error fetching About Me data from Admin Firestore:", error);
    return JSON.parse(JSON.stringify(defaultAboutMeDataForClient)); 
  }
}
