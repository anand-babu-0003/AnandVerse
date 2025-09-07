"use client";

import { useState, useEffect, useCallback } from 'react';
import { 
  fetchAllDataFromFirestore,
  fetchAllPortfolioItems,
  fetchAllSkills,
  fetchAboutMeData,
  fetchSiteSettings,
  fetchNotFoundPageData,
  fetchAllContactMessages,
  fetchAllAnnouncements,
  getFirestoreStats
} from '@/actions/fetchAllDataAction';
import type { 
  PortfolioItem, 
  Skill, 
  AboutMeData, 
  SiteSettings, 
  NotFoundPageData,
  ContactMessage,
  AppData 
} from '@/lib/types';

interface UseFirestoreDataReturn {
  // Data
  portfolioItems: PortfolioItem[];
  skills: Skill[];
  aboutMe: AboutMeData | null;
  siteSettings: SiteSettings | null;
  notFoundPage: NotFoundPageData | null;
  contactMessages: ContactMessage[];
  announcements: any[];
  
  // Loading states
  isLoading: boolean;
  isPortfolioLoading: boolean;
  isSkillsLoading: boolean;
  isAboutMeLoading: boolean;
  isSiteSettingsLoading: boolean;
  isContactMessagesLoading: boolean;
  isAnnouncementsLoading: boolean;
  
  // Error states
  error: string | null;
  portfolioError: string | null;
  skillsError: string | null;
  aboutMeError: string | null;
  siteSettingsError: string | null;
  contactMessagesError: string | null;
  announcementsError: string | null;
  
  // Stats
  stats: {
    portfolioItems: number;
    skills: number;
    contactMessages: number;
    announcements: number;
    lastUpdated: string;
  } | null;
  
  // Actions
  refetchAll: () => Promise<void>;
  refetchPortfolio: () => Promise<void>;
  refetchSkills: () => Promise<void>;
  refetchAboutMe: () => Promise<void>;
  refetchSiteSettings: () => Promise<void>;
  refetchContactMessages: () => Promise<void>;
  refetchAnnouncements: () => Promise<void>;
  refetchStats: () => Promise<void>;
}

export function useFirestoreData(): UseFirestoreDataReturn {
  // Data state
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [aboutMe, setAboutMe] = useState<AboutMeData | null>(null);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [notFoundPage, setNotFoundPage] = useState<NotFoundPageData | null>(null);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isPortfolioLoading, setIsPortfolioLoading] = useState(false);
  const [isSkillsLoading, setIsSkillsLoading] = useState(false);
  const [isAboutMeLoading, setIsAboutMeLoading] = useState(false);
  const [isSiteSettingsLoading, setIsSiteSettingsLoading] = useState(false);
  const [isContactMessagesLoading, setIsContactMessagesLoading] = useState(false);
  const [isAnnouncementsLoading, setIsAnnouncementsLoading] = useState(false);
  
  // Error states
  const [error, setError] = useState<string | null>(null);
  const [portfolioError, setPortfolioError] = useState<string | null>(null);
  const [skillsError, setSkillsError] = useState<string | null>(null);
  const [aboutMeError, setAboutMeError] = useState<string | null>(null);
  const [siteSettingsError, setSiteSettingsError] = useState<string | null>(null);
  const [contactMessagesError, setContactMessagesError] = useState<string | null>(null);
  const [announcementsError, setAnnouncementsError] = useState<string | null>(null);
  
  // Stats
  const [stats, setStats] = useState<{
    portfolioItems: number;
    skills: number;
    contactMessages: number;
    announcements: number;
    lastUpdated: string;
  } | null>(null);

  // Fetch functions
  const fetchPortfolio = useCallback(async () => {
    setIsPortfolioLoading(true);
    setPortfolioError(null);
    try {
      const data = await fetchAllPortfolioItems();
      setPortfolioItems(data);
    } catch (err) {
      setPortfolioError(err instanceof Error ? err.message : 'Failed to fetch portfolio items');
    } finally {
      setIsPortfolioLoading(false);
    }
  }, []);

  const fetchSkills = useCallback(async () => {
    setIsSkillsLoading(true);
    setSkillsError(null);
    try {
      const data = await fetchAllSkills();
      setSkills(data);
    } catch (err) {
      setSkillsError(err instanceof Error ? err.message : 'Failed to fetch skills');
    } finally {
      setIsSkillsLoading(false);
    }
  }, []);

  const fetchAboutMe = useCallback(async () => {
    setIsAboutMeLoading(true);
    setAboutMeError(null);
    try {
      const data = await fetchAboutMeData();
      setAboutMe(data);
    } catch (err) {
      setAboutMeError(err instanceof Error ? err.message : 'Failed to fetch about me data');
    } finally {
      setIsAboutMeLoading(false);
    }
  }, []);

  const fetchSiteSettings = useCallback(async () => {
    setIsSiteSettingsLoading(true);
    setSiteSettingsError(null);
    try {
      const data = await fetchSiteSettings();
      setSiteSettings(data);
    } catch (err) {
      setSiteSettingsError(err instanceof Error ? err.message : 'Failed to fetch site settings');
    } finally {
      setIsSiteSettingsLoading(false);
    }
  }, []);

  const fetchContactMessages = useCallback(async () => {
    setIsContactMessagesLoading(true);
    setContactMessagesError(null);
    try {
      const data = await fetchAllContactMessages();
      setContactMessages(data);
    } catch (err) {
      setContactMessagesError(err instanceof Error ? err.message : 'Failed to fetch contact messages');
    } finally {
      setIsContactMessagesLoading(false);
    }
  }, []);

  const fetchAnnouncements = useCallback(async () => {
    setIsAnnouncementsLoading(true);
    setAnnouncementsError(null);
    try {
      const data = await fetchAllAnnouncements();
      setAnnouncements(data);
    } catch (err) {
      setAnnouncementsError(err instanceof Error ? err.message : 'Failed to fetch announcements');
    } finally {
      setIsAnnouncementsLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const data = await getFirestoreStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  }, []);

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchAllDataFromFirestore();
      setPortfolioItems(data.portfolioItems);
      setSkills(data.skills);
      setAboutMe(data.aboutMe);
      setSiteSettings(data.siteSettings);
      setNotFoundPage(data.notFoundPage || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch all data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchAll();
    fetchStats();
  }, [fetchAll, fetchStats]);

  return {
    // Data
    portfolioItems,
    skills,
    aboutMe,
    siteSettings,
    notFoundPage,
    contactMessages,
    announcements,
    
    // Loading states
    isLoading,
    isPortfolioLoading,
    isSkillsLoading,
    isAboutMeLoading,
    isSiteSettingsLoading,
    isContactMessagesLoading,
    isAnnouncementsLoading,
    
    // Error states
    error,
    portfolioError,
    skillsError,
    aboutMeError,
    siteSettingsError,
    contactMessagesError,
    announcementsError,
    
    // Stats
    stats,
    
    // Actions
    refetchAll: fetchAll,
    refetchPortfolio: fetchPortfolio,
    refetchSkills: fetchSkills,
    refetchAboutMe: fetchAboutMe,
    refetchSiteSettings: fetchSiteSettings,
    refetchContactMessages: fetchContactMessages,
    refetchAnnouncements: fetchAnnouncements,
    refetchStats: fetchStats,
  };
}

// Specialized hooks for specific data types
export function usePortfolioData() {
  const { portfolioItems, isPortfolioLoading, portfolioError, refetchPortfolio } = useFirestoreData();
  return { portfolioItems, isLoading: isPortfolioLoading, error: portfolioError, refetch: refetchPortfolio };
}

export function useSkillsData() {
  const { skills, isSkillsLoading, skillsError, refetchSkills } = useFirestoreData();
  return { skills, isLoading: isSkillsLoading, error: skillsError, refetch: refetchSkills };
}

export function useAboutMeData() {
  const { aboutMe, isAboutMeLoading, aboutMeError, refetchAboutMe } = useFirestoreData();
  return { aboutMe, isLoading: isAboutMeLoading, error: aboutMeError, refetch: refetchAboutMe };
}

export function useSiteSettingsData() {
  const { siteSettings, isSiteSettingsLoading, siteSettingsError, refetchSiteSettings } = useFirestoreData();
  return { siteSettings, isLoading: isSiteSettingsLoading, error: siteSettingsError, refetch: refetchSiteSettings };
}

export function useContactMessagesData() {
  const { contactMessages, isContactMessagesLoading, contactMessagesError, refetchContactMessages } = useFirestoreData();
  return { contactMessages, isLoading: isContactMessagesLoading, error: contactMessagesError, refetch: refetchContactMessages };
}

export function useAnnouncementsData() {
  const { announcements, isAnnouncementsLoading, announcementsError, refetchAnnouncements } = useFirestoreData();
  return { announcements, isLoading: isAnnouncementsLoading, error: announcementsError, refetch: refetchAnnouncements };
}

export function useFirestoreStats() {
  const { stats, refetchStats } = useFirestoreData();
  return { stats, refetch: refetchStats };
}
