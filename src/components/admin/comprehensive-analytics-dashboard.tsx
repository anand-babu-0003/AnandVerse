"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye, 
  MousePointer,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Calendar,
  RefreshCw,
  Download,
  Filter,
  Activity,
  MessageSquare,
  BookOpen,
  Briefcase
} from 'lucide-react';
import { fetchAllDataFromFirestore } from '@/actions/fetchAllDataAction';
import { getPublishedBlogPostsActionOptimized } from '@/actions/admin/blogActionsOptimized';
import { fetchAllContactMessages } from '@/actions/fetchAllDataAction';
import type { AppData } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface AnalyticsData {
  totalViews: number;
  uniqueVisitors: number;
  pageViews: number;
  bounceRate: number;
  avgSessionDuration: string;
  topPages: Array<{ page: string; views: number }>;
  deviceTypes: Array<{ device: string; count: number; percentage: number }>;
  trafficSources: Array<{ source: string; count: number; percentage: number }>;
  contentStats: {
    totalBlogPosts: number;
    totalPortfolioItems: number;
    totalMessages: number;
    totalSkills: number;
  };
  recentActivity: Array<{
    type: string;
    description: string;
    timestamp: string;
    count?: number;
  }>;
}

interface AnalyticsDashboardProps {}

export default function ComprehensiveAnalyticsDashboard({}: AnalyticsDashboardProps) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [appData, setAppData] = useState<AppData | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [data, blogPosts, messages] = await Promise.all([
        fetchAllDataFromFirestore(),
        getPublishedBlogPostsActionOptimized(),
        fetchAllContactMessages()
      ]);

      setAppData(data);

      // Generate mock analytics data (in a real app, this would come from analytics service)
      const mockAnalytics: AnalyticsData = {
        totalViews: Math.floor(Math.random() * 10000) + 5000,
        uniqueVisitors: Math.floor(Math.random() * 3000) + 2000,
        pageViews: Math.floor(Math.random() * 15000) + 8000,
        bounceRate: Math.floor(Math.random() * 30) + 40,
        avgSessionDuration: `${Math.floor(Math.random() * 3) + 2}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
        topPages: [
          { page: '/', views: Math.floor(Math.random() * 2000) + 1500 },
          { page: '/about', views: Math.floor(Math.random() * 1000) + 800 },
          { page: '/portfolio', views: Math.floor(Math.random() * 1200) + 900 },
          { page: '/blog', views: Math.floor(Math.random() * 800) + 600 },
          { page: '/contact', views: Math.floor(Math.random() * 600) + 400 }
        ],
        deviceTypes: [
          { device: 'Desktop', count: Math.floor(Math.random() * 2000) + 1500, percentage: 65 },
          { device: 'Mobile', count: Math.floor(Math.random() * 1000) + 800, percentage: 30 },
          { device: 'Tablet', count: Math.floor(Math.random() * 200) + 100, percentage: 5 }
        ],
        trafficSources: [
          { source: 'Direct', count: Math.floor(Math.random() * 1500) + 1000, percentage: 45 },
          { source: 'Google', count: Math.floor(Math.random() * 1000) + 800, percentage: 30 },
          { source: 'Social Media', count: Math.floor(Math.random() * 500) + 300, percentage: 15 },
          { source: 'Referral', count: Math.floor(Math.random() * 300) + 200, percentage: 10 }
        ],
        contentStats: {
          totalBlogPosts: blogPosts.length,
          totalPortfolioItems: data.portfolioItems.length,
          totalMessages: messages.length,
          totalSkills: data.skills.length
        },
        recentActivity: [
          {
            type: 'page_view',
            description: 'Home page viewed',
            timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
            count: Math.floor(Math.random() * 50) + 10
          },
          {
            type: 'contact_form',
            description: 'New contact message received',
            timestamp: new Date(Date.now() - Math.random() * 7200000).toISOString()
          },
          {
            type: 'blog_view',
            description: 'Blog post viewed',
            timestamp: new Date(Date.now() - Math.random() * 10800000).toISOString(),
            count: Math.floor(Math.random() * 20) + 5
          },
          {
            type: 'portfolio_view',
            description: 'Portfolio item viewed',
            timestamp: new Date(Date.now() - Math.random() * 14400000).toISOString(),
            count: Math.floor(Math.random() * 15) + 3
          }
        ]
      };

      setAnalyticsData(mockAnalytics);
    } catch (error) {
      console.error('Error loading analytics data:', error);
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Failed to load analytics data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Track your website performance and user engagement</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={loadAnalyticsData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.uniqueVisitors.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.pageViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+15%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Session</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.avgSessionDuration}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+5%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="traffic">Traffic</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Pages */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Top Pages
                </CardTitle>
                <CardDescription>Most visited pages on your site</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.topPages.map((page, index) => (
                    <div key={page.page} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-muted-foreground w-6">
                          {index + 1}
                        </span>
                        <span className="text-sm">{page.page}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${(page.views / Math.max(...analyticsData.topPages.map(p => p.views))) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-12 text-right">
                          {page.views.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Device Types */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Device Types
                </CardTitle>
                <CardDescription>Traffic by device category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.deviceTypes.map((device) => (
                    <div key={device.device} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {device.device === 'Desktop' && <Monitor className="h-4 w-4" />}
                        {device.device === 'Mobile' && <Smartphone className="h-4 w-4" />}
                        {device.device === 'Tablet' && <Tablet className="h-4 w-4" />}
                        <span className="text-sm">{device.device}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${device.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-12 text-right">
                          {device.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="traffic" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Traffic Sources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Traffic Sources
                </CardTitle>
                <CardDescription>Where your visitors come from</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.trafficSources.map((source) => (
                    <div key={source.source} className="flex items-center justify-between">
                      <span className="text-sm">{source.source}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${source.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-12 text-right">
                          {source.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Performance Metrics
                </CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Bounce Rate</span>
                    <Badge variant={analyticsData.bounceRate < 50 ? "default" : "destructive"}>
                      {analyticsData.bounceRate}%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Avg. Session Duration</span>
                    <span className="text-sm font-medium">{analyticsData.avgSessionDuration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Pages per Session</span>
                    <span className="text-sm font-medium">
                      {(analyticsData.pageViews / analyticsData.uniqueVisitors).toFixed(1)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.contentStats.totalBlogPosts}</div>
                <p className="text-xs text-muted-foreground">Published articles</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Portfolio Items</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.contentStats.totalPortfolioItems}</div>
                <p className="text-xs text-muted-foreground">Showcased projects</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Contact Messages</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.contentStats.totalMessages}</div>
                <p className="text-xs text-muted-foreground">Inquiries received</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Skills</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.contentStats.totalSkills}</div>
                <p className="text-xs text-muted-foreground">Technical skills</p>
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
              <CardDescription>Latest user interactions and events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                    <div className="flex-shrink-0">
                      {activity.type === 'page_view' && <Eye className="h-4 w-4 text-blue-500" />}
                      {activity.type === 'contact_form' && <MessageSquare className="h-4 w-4 text-green-500" />}
                      {activity.type === 'blog_view' && <BookOpen className="h-4 w-4 text-purple-500" />}
                      {activity.type === 'portfolio_view' && <Briefcase className="h-4 w-4 text-orange-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.timestamp).toLocaleString()}
                        {activity.count && ` • ${activity.count} times`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
