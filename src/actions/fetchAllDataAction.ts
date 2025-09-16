import { firestore } from '@/lib/firebaseConfig';
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  query, 
  orderBy, 
  limit,
  where,
  Timestamp 
} from 'firebase/firestore';
import type { 
  PortfolioItem, 
  Skill, 
  AboutMeData, 
  SiteSettings, 
  NotFoundPageData,
  ContactMessage,
  AppData 
} from '@/lib/types';
import { 
  defaultPortfolioItemsDataForClient,
  defaultSkillsDataForClient,
  defaultAboutMeDataForClient,
  defaultSiteSettingsForClient,
  defaultNotFoundPageDataForClient
} from '@/lib/data';

// Collection names
const COLLECTIONS = {
  PORTFOLIO: 'portfolioItems',
  SKILLS: 'skills',
  ABOUT_ME: 'app_config',
  SITE_SETTINGS: 'app_config',
  NOT_FOUND: 'app_config',
  CONTACT_MESSAGES: 'contactMessages',
  ANNOUNCEMENTS: 'announcements'
} as const;

// Document IDs
const DOC_IDS = {
  ABOUT_ME: 'aboutMeDoc',
  SITE_SETTINGS: 'siteSettingsDoc',
  NOT_FOUND: 'notFoundPageDoc'
} as const;

/**
 * Fetch all portfolio items from Firestore
 */
export async function fetchAllPortfolioItems(): Promise<PortfolioItem[]> {
  if (!firestore) {
    console.warn("Firestore not initialized. Returning default portfolio data.");
    return [...defaultPortfolioItemsDataForClient];
  }

  try {
    const portfolioRef = collection(firestore, COLLECTIONS.PORTFOLIO);
    const q = query(portfolioRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const portfolioItems: PortfolioItem[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      portfolioItems.push({
        id: doc.id,
        title: data.title || 'Untitled Project',
        description: data.description || '',
        longDescription: data.longDescription || '',
        images: Array.isArray(data.images) ? data.images : [],
        tags: Array.isArray(data.tags) ? data.tags : [],
        liveUrl: data.liveUrl || '',
        repoUrl: data.repoUrl || '',
        slug: data.slug || doc.id,
        dataAiHint: data.dataAiHint || '',
        readmeContent: data.readmeContent || '',
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      });
    });

    // Only log in development and if there are issues
    if (process.env.NODE_ENV === 'development' && portfolioItems.length === 0) {
      console.warn('No portfolio items found in Firestore');
    }
    return portfolioItems;
  } catch (error) {
    console.error("Error fetching portfolio items from Firestore:", error);
    return [...defaultPortfolioItemsDataForClient];
  }
}

/**
 * Fetch all skills from Firestore
 */
export async function fetchAllSkills(): Promise<Skill[]> {
  if (!firestore) {
    console.warn("Firestore not initialized. Returning default skills data.");
    return [...defaultSkillsDataForClient];
  }

  try {
    const skillsRef = collection(firestore, COLLECTIONS.SKILLS);
    const q = query(skillsRef, orderBy('name', 'asc'));
    const querySnapshot = await getDocs(q);
    
    const skills: Skill[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      skills.push({
        id: doc.id,
        name: data.name || 'Unknown Skill',
        iconName: data.iconName || 'Code',
        category: data.category || 'Other',
        proficiency: data.proficiency || null,
      });
    });

    // Only log in development and if there are issues
    if (process.env.NODE_ENV === 'development' && skills.length === 0) {
      console.warn('No skills found in Firestore');
    }
    return skills;
  } catch (error) {
    console.error("Error fetching skills from Firestore:", error);
    return [...defaultSkillsDataForClient];
  }
}

/**
 * Fetch about me data from Firestore
 */
export async function fetchAboutMeData(): Promise<AboutMeData> {
  if (!firestore) {
    console.warn("Firestore not initialized. Returning default about me data.");
    return JSON.parse(JSON.stringify(defaultAboutMeDataForClient));
  }

  try {
    const aboutMeRef = doc(firestore, COLLECTIONS.ABOUT_ME, DOC_IDS.ABOUT_ME);
    const docSnap = await getDoc(aboutMeRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data() as Partial<AboutMeData>;
      const defaultData = defaultAboutMeDataForClient;
      
      const aboutMeData: AboutMeData = {
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
        email: data.email || defaultData.email,
        linkedinUrl: data.linkedinUrl || defaultData.linkedinUrl,
        githubUrl: data.githubUrl || defaultData.githubUrl,
        twitterUrl: data.twitterUrl || defaultData.twitterUrl,
      };

      // Only log in development and if there are issues
    if (process.env.NODE_ENV === 'development' && !aboutMeData) {
      console.warn('No about me data found in Firestore');
    }
      return aboutMeData;
    } else {
      console.warn("About Me document not found in Firestore. Returning default data.");
      return JSON.parse(JSON.stringify(defaultAboutMeDataForClient));
    }
  } catch (error) {
    console.error("Error fetching about me data from Firestore:", error);
    return JSON.parse(JSON.stringify(defaultAboutMeDataForClient));
  }
}

/**
 * Fetch site settings from Firestore
 */
export async function fetchSiteSettings(): Promise<SiteSettings> {
  if (!firestore) {
    console.warn("Firestore not initialized. Returning default site settings.");
    return JSON.parse(JSON.stringify(defaultSiteSettingsForClient));
  }

  try {
    const settingsRef = doc(firestore, COLLECTIONS.SITE_SETTINGS, DOC_IDS.SITE_SETTINGS);
    const docSnap = await getDoc(settingsRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data() as Partial<SiteSettings>;
      const defaultData = defaultSiteSettingsForClient;
      
      const siteSettings: SiteSettings = {
        siteName: data.siteName || defaultData.siteName,
        defaultMetaDescription: data.defaultMetaDescription || defaultData.defaultMetaDescription,
        defaultMetaKeywords: data.defaultMetaKeywords || defaultData.defaultMetaKeywords,
        siteOgImageUrl: data.siteOgImageUrl || defaultData.siteOgImageUrl,
        maintenanceMode: data.maintenanceMode || defaultData.maintenanceMode,
        skillsPageMetaTitle: data.skillsPageMetaTitle || defaultData.skillsPageMetaTitle,
        skillsPageMetaDescription: data.skillsPageMetaDescription || defaultData.skillsPageMetaDescription,
      };

      // Only log in development and if there are issues
    if (process.env.NODE_ENV === 'development' && !siteSettings) {
      console.warn('No site settings found in Firestore');
    }
      return siteSettings;
    } else {
      console.warn("Site settings document not found in Firestore. Returning default data.");
      return JSON.parse(JSON.stringify(defaultSiteSettingsForClient));
    }
  } catch (error) {
    console.error("Error fetching site settings from Firestore:", error);
    return JSON.parse(JSON.stringify(defaultSiteSettingsForClient));
  }
}

/**
 * Fetch not found page data from Firestore
 */
export async function fetchNotFoundPageData(): Promise<NotFoundPageData> {
  if (!firestore) {
    console.warn("Firestore not initialized. Returning default not found page data.");
    return JSON.parse(JSON.stringify(defaultNotFoundPageDataForClient));
  }

  try {
    const notFoundRef = doc(firestore, COLLECTIONS.NOT_FOUND, DOC_IDS.NOT_FOUND);
    const docSnap = await getDoc(notFoundRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data() as Partial<NotFoundPageData>;
      const defaultData = defaultNotFoundPageDataForClient;
      
      const notFoundData: NotFoundPageData = {
        imageSrc: data.imageSrc || defaultData.imageSrc,
        dataAiHint: data.dataAiHint || defaultData.dataAiHint,
        heading: data.heading || defaultData.heading,
        message: data.message || defaultData.message,
        buttonText: data.buttonText || defaultData.buttonText,
      };

      // Only log in development and if there are issues
    if (process.env.NODE_ENV === 'development' && !notFoundData) {
      console.warn('No not found page data found in Firestore');
    }
      return notFoundData;
    } else {
      console.warn("Not found page document not found in Firestore. Returning default data.");
      return JSON.parse(JSON.stringify(defaultNotFoundPageDataForClient));
    }
  } catch (error) {
    console.error("Error fetching not found page data from Firestore:", error);
    return JSON.parse(JSON.stringify(defaultNotFoundPageDataForClient));
  }
}

/**
 * Fetch all contact messages from Firestore
 */
export async function fetchAllContactMessages(): Promise<ContactMessage[]> {
  if (!firestore) {
    console.warn("Firestore not initialized. Returning empty contact messages array.");
    return [];
  }

  try {
    const messagesRef = collection(firestore, COLLECTIONS.CONTACT_MESSAGES);
    const q = query(messagesRef, orderBy('submittedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const messages: ContactMessage[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      messages.push({
        id: doc.id,
        name: data.name || 'Anonymous',
        email: data.email || '',
        message: data.message || '',
        submittedAt: data.submittedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      });
    });

    // Only log in development and if there are critical issues
    if (process.env.NODE_ENV === 'development' && messages.length === 0) {
      // Don't warn about empty contact messages - this is normal for new sites
      // console.warn('No contact messages found in Firestore');
    }
    return messages;
  } catch (error) {
    console.error("Error fetching contact messages from Firestore:", error);
    return [];
  }
}

/**
 * Fetch all announcements from Firestore
 */
export async function fetchAllAnnouncements(): Promise<any[]> {
  if (!firestore) {
    console.warn("Firestore not initialized. Returning empty announcements array.");
    return [];
  }

  try {
    const announcementsRef = collection(firestore, COLLECTIONS.ANNOUNCEMENTS);
    const q = query(announcementsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const announcements: any[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      announcements.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      });
    });

    // Only log in development and if there are critical issues
    if (process.env.NODE_ENV === 'development' && announcements.length === 0) {
      // Don't warn about empty announcements - this is normal for new sites
      // console.warn('No announcements found in Firestore');
    }
    return announcements;
  } catch (error) {
    console.error("Error fetching announcements from Firestore:", error);
    return [];
  }
}

/**
 * Fetch ALL data from Firestore in parallel
 */
export async function fetchAllDataFromFirestore(): Promise<AppData> {
  // Only log in development and if there are critical issues
  // if (process.env.NODE_ENV === 'development') {
  //   console.log("Starting comprehensive data fetch from Firestore...");
  // }
  
  try {
    // Fetch all data in parallel for better performance
    const [
      portfolioItems,
      skills,
      aboutMe,
      siteSettings,
      notFoundPage,
      contactMessages,
      announcements
    ] = await Promise.all([
      fetchAllPortfolioItems(),
      fetchAllSkills(),
      fetchAboutMeData(),
      fetchSiteSettings(),
      fetchNotFoundPageData(),
      fetchAllContactMessages(),
      fetchAllAnnouncements()
    ]);

    const appData: AppData = {
      portfolioItems,
      skills,
      aboutMe,
      siteSettings,
      notFoundPage,
      // Note: contactMessages and announcements are not part of AppData type
      // but we fetched them for completeness
    };

    // Only log in development and if there are issues
    if (process.env.NODE_ENV === 'development') {
      const hasIssues = portfolioItems.length === 0 || skills.length === 0 || !aboutMe || !siteSettings || !notFoundPage;
      if (hasIssues) {
        console.warn("Some data missing from Firestore:", {
          portfolioItems: portfolioItems.length,
          skills: skills.length,
          contactMessages: contactMessages.length,
          announcements: announcements.length,
          hasAboutMe: !!aboutMe,
          hasSiteSettings: !!siteSettings,
          hasNotFoundPage: !!notFoundPage
        });
      }
    }

    return appData;
  } catch (error) {
    console.error("Error fetching all data from Firestore:", error);
    
    // Return default data structure on error
    return {
      portfolioItems: [...defaultPortfolioItemsDataForClient],
      skills: [...defaultSkillsDataForClient],
      aboutMe: JSON.parse(JSON.stringify(defaultAboutMeDataForClient)),
      siteSettings: JSON.parse(JSON.stringify(defaultSiteSettingsForClient)),
      notFoundPage: JSON.parse(JSON.stringify(defaultNotFoundPageDataForClient))
    };
  }
}

/**
 * Fetch data with caching and error handling
 */
export async function fetchDataWithCache<T>(
  fetchFunction: () => Promise<T>,
  cacheKey: string,
  cacheTimeout: number = 5 * 60 * 1000 // 5 minutes default
): Promise<T> {
  // Simple in-memory cache (in production, consider using Redis or similar)
  const cache = new Map<string, { data: T; timestamp: number }>();
  
  const now = Date.now();
  const cached = cache.get(cacheKey);
  
  if (cached && (now - cached.timestamp) < cacheTimeout) {
    // console.log(`Using cached data for ${cacheKey}`);
    return cached.data;
  }

  try {
    const data = await fetchFunction();
    cache.set(cacheKey, { data, timestamp: now });
    // console.log(`Cached data for ${cacheKey}`);
    return data;
  } catch (error) {
    console.error(`Error fetching data for ${cacheKey}:`, error);
    throw error;
  }
}

/**
 * Get Firestore collection statistics
 */
export async function getFirestoreStats(): Promise<{
  portfolioItems: number;
  skills: number;
  contactMessages: number;
  announcements: number;
  lastUpdated: string;
}> {
  if (!firestore) {
    return {
      portfolioItems: 0,
      skills: 0,
      contactMessages: 0,
      announcements: 0,
      lastUpdated: new Date().toISOString()
    };
  }

  try {
    const [
      portfolioSnapshot,
      skillsSnapshot,
      messagesSnapshot,
      announcementsSnapshot
    ] = await Promise.all([
      getDocs(collection(firestore, COLLECTIONS.PORTFOLIO)),
      getDocs(collection(firestore, COLLECTIONS.SKILLS)),
      getDocs(collection(firestore, COLLECTIONS.CONTACT_MESSAGES)),
      getDocs(collection(firestore, COLLECTIONS.ANNOUNCEMENTS))
    ]);

    return {
      portfolioItems: portfolioSnapshot.size,
      skills: skillsSnapshot.size,
      contactMessages: messagesSnapshot.size,
      announcements: announcementsSnapshot.size,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error("Error getting Firestore stats:", error);
    return {
      portfolioItems: 0,
      skills: 0,
      contactMessages: 0,
      announcements: 0,
      lastUpdated: new Date().toISOString()
    };
  }
}
