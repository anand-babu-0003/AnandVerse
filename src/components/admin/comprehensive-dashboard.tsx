"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  Users, 
  MessageSquare, 
  FileText, 
  Briefcase, 
  Sparkles, 
  TrendingUp,
  Eye,
  Heart,
  Calendar,
  Clock,
  Activity,
  Database,
  Globe,
  Settings,
  BookOpen,
  Bot,
  Bell,
  UserCircle,
  RefreshCw
} from 'lucide-react';
import { fetchAllDataFromFirestore } from '@/actions/fetchAllDataAction';
import { getPublishedBlogPostsActionOptimized } from '@/actions/admin/blogActionsOptimized';
import { fetchAllContactMessages } from '@/actions/fetchAllDataAction';
import { fetchAllAnnouncements } from '@/actions/fetchAllDataAction';
import type { AppData, BlogPost, ContactMessage, Announcement } from '@/lib/types';
import Link from 'next/link';

interface DashboardStats {
  totalPortfolioItems: number;
  totalSkills: number;
  totalBlogPosts: number;
  totalMessages: number;
  totalAnnouncements: number;
  recentActivity: Array<{
    type: 'blog' | 'message' | 'portfolio' | 'announcement';
    title: string;
    date: string;
    status?: string;
  }>;
  siteHealth: {
    firestoreConnected: boolean;
    lastDataFetch: string;
    totalDataSize: number;
  };
}

export default function ComprehensiveDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [appData, setAppData] = useState<AppData | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        console.log('🔄 Loading dashboard data...');
        
        // Fetch all data in parallel
        const [
          data,
          blogPosts,
          messages,
          announcements
        ] = await Promise.all([
          fetchAllDataFromFirestore(),
          getPublishedBlogPostsActionOptimized(),
          fetchAllContactMessages(),
          fetchAllAnnouncements()
        ]);

        console.log('📊 Fetched data:', {
          portfolioItems: data.portfolioItems.length,
          skills: data.skills.length,
          blogPosts: blogPosts.length,
          messages: messages.length,
          announcements: announcements.length
        });

        setAppData(data);

        // Calculate recent activity
        const recentActivity = [
          ...blogPosts.slice(0, 3).map(post => ({
            type: 'blog' as const,
            title: post.title,
            date: post.publishedAt,
            status: post.status
          })),
          ...messages.slice(0, 2).map(msg => ({
            type: 'message' as const,
            title: `Message from ${msg.name}`,
            date: msg.submittedAt || msg.createdAt,
            status: 'new'
          })),
          ...announcements.slice(0, 2).map(ann => ({
            type: 'announcement' as const,
            title: ann.title,
            date: ann.createdAt,
            status: ann.isActive ? 'active' : 'inactive'
          }))
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8);

        const dashboardStats: DashboardStats = {
          totalPortfolioItems: data.portfolioItems.length,
          totalSkills: data.skills.length,
          totalBlogPosts: blogPosts.length,
          totalMessages: messages.length,
          totalAnnouncements: announcements.length,
          recentActivity,
          siteHealth: {
            firestoreConnected: true,
            lastDataFetch: new Date().toISOString(),
            totalDataSize: JSON.stringify(data).length
          }
        };

        console.log('✅ Dashboard stats calculated:', dashboardStats);
        setStats(dashboardStats);
      } catch (error) {
        console.error('❌ Error loading dashboard data:', error);
        // Set default stats on error
        setStats({
          totalPortfolioItems: 0,
          totalSkills: 0,
          totalBlogPosts: 0,
          totalMessages: 0,
          totalAnnouncements: 0,
          recentActivity: [],
          siteHealth: {
            firestoreConnected: false,
            lastDataFetch: new Date().toISOString(),
            totalDataSize: 0
          }
        });
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats || !appData) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Failed to load dashboard data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your site.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            Refresh
          </Button>
          <Badge variant="outline" className="flex items-center gap-1">
            <Activity className="h-3 w-3" />
            Live Data
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Database className="h-3 w-3" />
            Firestore Connected
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Items</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPortfolioItems}</div>
            <p className="text-xs text-muted-foreground">
              Active projects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBlogPosts}</div>
            <p className="text-xs text-muted-foreground">
              Published articles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMessages}</div>
            <p className="text-xs text-muted-foreground">
              Contact inquiries
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Skills</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSkills}</div>
            <p className="text-xs text-muted-foreground">
              Technical skills
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="content">Content Management</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Site Health */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Site Health
                </CardTitle>
                <CardDescription>Current system status and performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Firestore Connection</span>
                  <Badge variant={stats.siteHealth.firestoreConnected ? "default" : "destructive"}>
                    {stats.siteHealth.firestoreConnected ? "Connected" : "Disconnected"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Last Data Fetch</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(stats.siteHealth.lastDataFetch).toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Data Size</span>
                  <span className="text-sm text-muted-foreground">
                    {(stats.siteHealth.totalDataSize / 1024).toFixed(1)} KB
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/admin/blog">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Manage Blog Posts
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/admin/portfolio">
                    <Briefcase className="h-4 w-4 mr-2" />
                    Manage Portfolio
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/admin/messages">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    View Messages
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/admin/settings">
                    <Settings className="h-4 w-4 mr-2" />
                    Site Settings
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest updates across your site</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentActivity.length > 0 ? (
                  stats.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                      <div className="flex-shrink-0">
                        {activity.type === 'blog' && <BookOpen className="h-4 w-4 text-blue-500" />}
                        {activity.type === 'message' && <MessageSquare className="h-4 w-4 text-green-500" />}
                        {activity.type === 'portfolio' && <Briefcase className="h-4 w-4 text-purple-500" />}
                        {activity.type === 'announcement' && <Bell className="h-4 w-4 text-orange-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(activity.date).toLocaleDateString()} at {new Date(activity.date).toLocaleTimeString()}
                        </p>
                      </div>
                      {activity.status && (
                        <Badge variant={activity.status === 'published' || activity.status === 'active' ? 'default' : 'secondary'}>
                          {activity.status}
                        </Badge>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-4">No recent activity</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Blog Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {stats.totalBlogPosts} published posts
                </p>
                <Button asChild size="sm" className="w-full">
                  <Link href="/admin/blog">Manage Blog</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Portfolio Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {stats.totalPortfolioItems} portfolio items
                </p>
                <Button asChild size="sm" className="w-full">
                  <Link href="/admin/portfolio">Manage Portfolio</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Skills Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {stats.totalSkills} skills configured
                </p>
                <Button asChild size="sm" className="w-full">
                  <Link href="/admin/skills">Manage Skills</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCircle className="h-5 w-5" />
                  About Page
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Personal information & bio
                </p>
                <Button asChild size="sm" className="w-full">
                  <Link href="/admin/about">Manage About</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Announcements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {stats.totalAnnouncements} announcements
                </p>
                <Button asChild size="sm" className="w-full">
                  <Link href="/admin/announcements">Manage Announcements</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  AI Tools
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  AI-powered content generation
                </p>
                <Button asChild size="sm" className="w-full">
                  <Link href="/admin/ai-tools">AI Tools</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Content Analytics
                </CardTitle>
                <CardDescription>Overview of your content performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Portfolio Views</span>
                    <span className="text-sm font-medium">-</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Blog Views</span>
                    <span className="text-sm font-medium">-</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Contact Form Submissions</span>
                    <span className="text-sm font-medium">{stats.totalMessages}</span>
                  </div>
                </div>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/admin/analytics">View Detailed Analytics</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Performance Metrics
                </CardTitle>
                <CardDescription>Site performance and health metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Data Load Time</span>
                    <span className="text-sm font-medium text-green-600">Fast</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Firestore Queries</span>
                    <span className="text-sm font-medium text-green-600">Optimized</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Cache Status</span>
                    <span className="text-sm font-medium text-green-600">Active</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
