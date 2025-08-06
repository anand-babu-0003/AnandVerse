"use server";

import { getAdminFirestore } from '@/lib/firebaseAdmin';
import { 
  doc, 
  setDoc, 
  writeBatch, 
  collection, 
  getDocs, 
  serverTimestamp, 
  deleteDoc,
  Timestamp
} from 'firebase-admin/firestore';
import { 
  defaultSiteSettingsForClient,
  defaultAboutMeDataForClient,
  defaultSkillsDataForClient,
  defaultPortfolioItemsDataForClient,
  defaultNotFoundPageDataForClient
} from '@/lib/data';
import type { SiteSettings, AboutMeData, Skill, PortfolioItem, Experience, Education, Certification, NotFoundPageData } from '@/lib/types';

export interface SeedDetails {
  siteSettings: { status: 'success' | 'error'; message?: string; count: number };
  aboutMe: { status: 'success' | 'error'; message?: string; count: number };
  skills: { status: 'success' | 'error'; message?: string; deletedCount: number; addedCount: number };
  portfolioItems: { status: 'success' | 'error'; message?: string; deletedCount: number; addedCount: number };
  notFoundPage: { status: 'success' | 'error'; message?: string; count: number };
}

export interface SeedResult {
  success: boolean;
  message: string;
  details: SeedDetails;
  error?: any;
}

async function clearCollection(collectionPath: string): Promise<number> {
  const adminDb = getAdminFirestore();
  const collectionRef = adminDb.collection(collectionPath);
  const snapshot = await getDocs(collectionRef);
  if (snapshot.empty) {
    return 0;
  }
  const batch = adminDb.batch();
  snapshot.docs.forEach(docSnap => batch.delete(docSnap.ref));
  await batch.commit();
  return snapshot.size;
}

export async function seedFirestoreWithMockDataAction(): Promise<SeedResult> {
  const adminDb = getAdminFirestore();
  const details: SeedDetails = {
    siteSettings: { status: 'error', count: 0 },
    aboutMe: { status: 'error', count: 0 },
    skills: { status: 'error', deletedCount: 0, addedCount: 0 },
    portfolioItems: { status: 'error', deletedCount: 0, addedCount: 0 },
    notFoundPage: { status: 'error', count: 0 },
  };

  try {
    // 1. Seed Site Settings
    try {
      const siteSettingsRef = adminDb.collection('app_config').doc('siteSettingsDoc');
      const settingsToSeed: SiteSettings = defaultSiteSettingsForClient;
      await setDoc(siteSettingsRef, settingsToSeed);
      details.siteSettings = { status: 'success', count: 1, message: "Site settings seeded." };
    } catch (e) {
      console.error("Error seeding site settings:", e);
      details.siteSettings = { status: 'error', count: 0, message: (e as Error).message };
      throw e;
    }

    // 2. Seed About Me Data
    try {
      const aboutMeRef = adminDb.collection('app_config').doc('aboutMeDoc');
      const aboutMeDataToSeed: AboutMeData = {
        ...defaultAboutMeDataForClient,
        experience: defaultAboutMeDataForClient.experience.map((exp, i) => ({ ...exp, id: exp.id || `exp_seed_${i}` })),
        education: defaultAboutMeDataForClient.education.map((edu, i) => ({ ...edu, id: edu.id || `edu_seed_${i}` })),
        certifications: defaultAboutMeDataForClient.certifications.map((cert, i) => ({ ...cert, id: cert.id || `cert_seed_${i}` })),
      };
      await setDoc(aboutMeRef, aboutMeDataToSeed);
      details.aboutMe = { status: 'success', count: 1, message: "About Me data seeded." };
    } catch (e) {
      console.error("Error seeding About Me data:", e);
      details.aboutMe = { status: 'error', count: 0, message: (e as Error).message };
      throw e;
    }
    
    // 3. Seed Skills
    try {
      const deletedSkillsCount = await clearCollection('skills');
      details.skills.deletedCount = deletedSkillsCount;
      const skillsBatch = adminDb.batch();
      let addedSkillsCount = 0;
      defaultSkillsDataForClient.forEach(skill => {
        const skillRef = adminDb.collection('skills').doc(skill.id);
        skillsBatch.set(skillRef, skill);
        addedSkillsCount++;
      });
      await skillsBatch.commit();
      details.skills = { ...details.skills, status: 'success', addedCount: addedSkillsCount, message: `${deletedSkillsCount} skills deleted, ${addedSkillsCount} skills added.`};
    } catch (e) {
      console.error("Error seeding skills:", e);
      details.skills = { ...details.skills, status: 'error', message: (e as Error).message };
      throw e;
    }

    // 4. Seed Portfolio Items
    try {
      const deletedPortfolioCount = await clearCollection('portfolioItems');
      details.portfolioItems.deletedCount = deletedPortfolioCount;
      const portfolioBatch = adminDb.batch();
      let addedPortfolioCount = 0;
      defaultPortfolioItemsDataForClient.forEach(item => {
        const itemRef = adminDb.collection('portfolioItems').doc(item.id);
        const itemToSeed = {
          ...item,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        portfolioBatch.set(itemRef, itemToSeed);
        addedPortfolioCount++;
      });
      await portfolioBatch.commit();
      details.portfolioItems = { ...details.portfolioItems, status: 'success', addedCount: addedPortfolioCount, message: `${deletedPortfolioCount} portfolio items deleted, ${addedPortfolioCount} portfolio items added.`};
    } catch (e) {
      console.error("Error seeding portfolio items:", e);
      details.portfolioItems = { ...details.portfolioItems, status: 'error', message: (e as Error).message };
      throw e;
    }

    // 5. Seed Not Found Page Data
    try {
      const notFoundPageRef = adminDb.collection('app_config').doc('notFoundPageDoc');
      const notFoundDataToSeed: NotFoundPageData = defaultNotFoundPageDataForClient;
      await setDoc(notFoundPageRef, notFoundDataToSeed);
      details.notFoundPage = { status: 'success', count: 1, message: "404 Page data seeded." };
    } catch (e) {
      console.error("Error seeding 404 Page data:", e);
      details.notFoundPage = { status: 'error', count: 0, message: (e as Error).message };
      throw e;
    }

    return {
      success: true,
      message: "Firestore successfully seeded with mock data!",
      details,
    };

  } catch (error) {
    console.error("Overall error during Firestore seeding:", error);
    return {
      success: false,
      message: "An error occurred during Firestore seeding. Check console for details.",
      details,
      error: (error as Error).message,
    };
  }
}