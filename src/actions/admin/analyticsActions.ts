"use server";

import { firestore } from '@/lib/firebaseConfig';
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  setDoc, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp, 
  Timestamp 
} from 'firebase/firestore';
import type { AnalyticsData, VisitorSession } from '@/lib/types';

// Collection references
const analyticsCollectionRef = () => {
  if (!firestore) throw new Error("Firestore not initialized");
  return collection(firestore, 'analytics');
};

const sessionsCollectionRef = () => {
  if (!firestore) throw new Error("Firestore not initialized");
  return collection(firestore, 'visitorSessions');
};

// Track page view
export async function trackPageViewAction(
  page: string,
  referrer?: string,
  userAgent?: string,
  country?: string,
  device?: string
): Promise<void> {
  if (!firestore) {
    console.warn("Firestore not initialized. Cannot track page view.");
    return;
  }

  try {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // Check if analytics data exists for today
    const todayQuery = query(
      analyticsCollectionRef(),
      where('date', '==', today),
      where('page', '==', page)
    );
    
    const existingDocs = await getDocs(todayQuery);
    
    if (!existingDocs.empty) {
      // Update existing record
      const doc = existingDocs.docs[0];
      const data = doc.data();
      await setDoc(doc.ref, {
        ...data,
        views: data.views + 1,
        uniqueVisitors: data.uniqueVisitors + 1, // Simplified - in real app, you'd track unique visitors properly
        updatedAt: serverTimestamp(),
      });
    } else {
      // Create new record
      await addDoc(analyticsCollectionRef(), {
        page,
        views: 1,
        uniqueVisitors: 1,
        bounceRate: 0,
        avgTimeOnPage: 0,
        date: today,
        referrer: referrer || '',
        userAgent: userAgent || '',
        country: country || '',
        device: device || '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error("Error tracking page view:", error);
  }
}

// Track visitor session
export async function trackVisitorSessionAction(
  sessionId: string,
  pages: string[],
  referrer?: string,
  userAgent?: string,
  country?: string,
  device?: string,
  isNewVisitor: boolean = true
): Promise<void> {
  if (!firestore) {
    console.warn("Firestore not initialized. Cannot track visitor session.");
    return;
  }

  try {
    await addDoc(sessionsCollectionRef(), {
      sessionId,
      startTime: serverTimestamp(),
      pages,
      referrer: referrer || '',
      userAgent: userAgent || '',
      country: country || '',
      device: device || '',
      isNewVisitor,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error tracking visitor session:", error);
  }
}

// Get analytics data
export async function getAnalyticsDataAction(
  dateRange: '7d' | '30d' | '90d' | '1y' | 'custom' = '30d',
  startDate?: string,
  endDate?: string,
  page?: string
): Promise<AnalyticsData[]> {
  if (!firestore) {
    console.warn("Firestore not initialized. Cannot get analytics data.");
    return [];
  }

  try {
    let start: Date;
    let end: Date = new Date();

    switch (dateRange) {
      case '7d':
        start = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        start = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        start = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        start = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
        break;
      case 'custom':
        start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        end = endDate ? new Date(endDate) : new Date();
        break;
      default:
        start = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }

    const startDateStr = start.toISOString().split('T')[0];
    const endDateStr = end.toISOString().split('T')[0];

    let q = query(
      analyticsCollectionRef(),
      where('date', '>=', startDateStr),
      where('date', '<=', endDateStr),
      orderBy('date', 'desc')
    );

    if (page) {
      q = query(
        analyticsCollectionRef(),
        where('date', '>=', startDateStr),
        where('date', '<=', endDateStr),
        where('page', '==', page),
        orderBy('date', 'desc')
      );
    }

    const snapshot = await getDocs(q);

    return snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        page: data.page || '',
        views: data.views || 0,
        uniqueVisitors: data.uniqueVisitors || 0,
        bounceRate: data.bounceRate || 0,
        avgTimeOnPage: data.avgTimeOnPage || 0,
        date: data.date || '',
        referrer: data.referrer || '',
        userAgent: data.userAgent || '',
        country: data.country || '',
        device: data.device || '',
      } as AnalyticsData;
    });
  } catch (error) {
    console.error("Error getting analytics data:", error);
    return [];
  }
}

// Get visitor sessions
export async function getVisitorSessionsAction(
  limitCount: number = 100
): Promise<VisitorSession[]> {
  if (!firestore) {
    console.warn("Firestore not initialized. Cannot get visitor sessions.");
    return [];
  }

  try {
    const q = query(
      sessionsCollectionRef(),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      const startTime = data.startTime instanceof Timestamp ? data.startTime.toDate().toISOString() : (data.startTime || new Date().toISOString());
      const endTime = data.endTime instanceof Timestamp ? data.endTime.toDate().toISOString() : (data.endTime || '');
      
      return {
        id: docSnap.id,
        sessionId: data.sessionId || '',
        startTime: startTime,
        endTime: endTime,
        pages: Array.isArray(data.pages) ? data.pages : [],
        referrer: data.referrer || '',
        userAgent: data.userAgent || '',
        country: data.country || '',
        device: data.device || '',
        isNewVisitor: data.isNewVisitor || false,
      } as VisitorSession;
    });
  } catch (error) {
    console.error("Error getting visitor sessions:", error);
    return [];
  }
}

// Get analytics summary
export async function getAnalyticsSummaryAction(): Promise<{
  totalViews: number;
  totalUniqueVisitors: number;
  topPages: { page: string; views: number }[];
  topReferrers: { referrer: string; count: number }[];
  deviceStats: { device: string; count: number }[];
  countryStats: { country: string; count: number }[];
  recentSessions: number;
}> {
  if (!firestore) {
    return {
      totalViews: 0,
      totalUniqueVisitors: 0,
      topPages: [],
      topReferrers: [],
      deviceStats: [],
      countryStats: [],
      recentSessions: 0,
    };
  }

  try {
    // Get last 30 days of data
    const analyticsData = await getAnalyticsDataAction('30d');
    const sessions = await getVisitorSessionsAction(1000);

    // Calculate totals
    const totalViews = analyticsData.reduce((sum, data) => sum + data.views, 0);
    const totalUniqueVisitors = analyticsData.reduce((sum, data) => sum + data.uniqueVisitors, 0);

    // Top pages
    const pageViews: { [key: string]: number } = {};
    analyticsData.forEach(data => {
      pageViews[data.page] = (pageViews[data.page] || 0) + data.views;
    });
    const topPages = Object.entries(pageViews)
      .map(([page, views]) => ({ page, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    // Top referrers
    const referrerCounts: { [key: string]: number } = {};
    analyticsData.forEach(data => {
      if (data.referrer) {
        referrerCounts[data.referrer] = (referrerCounts[data.referrer] || 0) + 1;
      }
    });
    const topReferrers = Object.entries(referrerCounts)
      .map(([referrer, count]) => ({ referrer, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Device stats
    const deviceCounts: { [key: string]: number } = {};
    analyticsData.forEach(data => {
      if (data.device) {
        deviceCounts[data.device] = (deviceCounts[data.device] || 0) + 1;
      }
    });
    const deviceStats = Object.entries(deviceCounts)
      .map(([device, count]) => ({ device, count }))
      .sort((a, b) => b.count - a.count);

    // Country stats
    const countryCounts: { [key: string]: number } = {};
    analyticsData.forEach(data => {
      if (data.country) {
        countryCounts[data.country] = (countryCounts[data.country] || 0) + 1;
      }
    });
    const countryStats = Object.entries(countryCounts)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Recent sessions (last 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentSessions = sessions.filter(session => 
      new Date(session.startTime) > oneDayAgo
    ).length;

    return {
      totalViews,
      totalUniqueVisitors,
      topPages,
      topReferrers,
      deviceStats,
      countryStats,
      recentSessions,
    };
  } catch (error) {
    console.error("Error getting analytics summary:", error);
    return {
      totalViews: 0,
      totalUniqueVisitors: 0,
      topPages: [],
      topReferrers: [],
      deviceStats: [],
      countryStats: [],
      recentSessions: 0,
    };
  }
}
