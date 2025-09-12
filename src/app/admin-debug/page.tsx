"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { fetchAllDataFromFirestore } from '@/actions/fetchAllDataAction';
import { getPublishedBlogPostsActionOptimized } from '@/actions/admin/blogActionsOptimized';
import { fetchAllContactMessages, fetchAllAnnouncements } from '@/actions/fetchAllDataAction';
import type { AppData, BlogPost, ContactMessage, Announcement } from '@/lib/types';
import { RefreshCw, Database, AlertCircle, CheckCircle } from 'lucide-react';

interface DebugData {
  appData: AppData | null;
  blogPosts: BlogPost[];
  messages: ContactMessage[];
  announcements: Announcement[];
  loading: boolean;
  error: string | null;
  lastFetch: string | null;
}

export default function AdminDebugPage() {
  const [debugData, setDebugData] = useState<DebugData>({
    appData: null,
    blogPosts: [],
    messages: [],
    announcements: [],
    loading: false,
    error: null,
    lastFetch: null
  });

  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const fetchData = async () => {
    setDebugData(prev => ({ ...prev, loading: true, error: null }));
    setLogs([]);
    
    try {
      addLog('Starting data fetch...');
      
      // Fetch all data in parallel
      const [appData, blogPosts, messages, announcements] = await Promise.all([
        fetchAllDataFromFirestore(),
        getPublishedBlogPostsActionOptimized(),
        fetchAllContactMessages(),
        fetchAllAnnouncements()
      ]);

      addLog(`App data fetched: ${JSON.stringify({
        portfolioItems: appData.portfolioItems.length,
        skills: appData.skills.length,
        hasAboutMe: !!appData.aboutMe,
        hasSiteSettings: !!appData.siteSettings
      })}`);

      addLog(`Blog posts fetched: ${blogPosts.length}`);
      addLog(`Messages fetched: ${messages.length}`);
      addLog(`Announcements fetched: ${announcements.length}`);

      setDebugData({
        appData,
        blogPosts,
        messages,
        announcements,
        loading: false,
        error: null,
        lastFetch: new Date().toISOString()
      });

      addLog('Data fetch completed successfully');
    } catch (error: any) {
      addLog(`Error fetching data: ${error.message}`);
      setDebugData(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <AlertCircle className="h-4 w-4 text-red-500" />
    );
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Admin Debug Dashboard</h1>
        <p className="text-muted-foreground">
          Debug data fetching and display issues
        </p>
      </div>

      {/* Refresh Button */}
      <div className="flex justify-center">
        <Button 
          onClick={fetchData} 
          disabled={debugData.loading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${debugData.loading ? 'animate-spin' : ''}`} />
          {debugData.loading ? 'Fetching...' : 'Refresh Data'}
        </Button>
      </div>

      {/* Error Display */}
      {debugData.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{debugData.error}</AlertDescription>
        </Alert>
      )}

      {/* Data Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">App Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {getStatusIcon(!!debugData.appData)}
              <span className="text-sm">
                {debugData.appData ? 'Loaded' : 'Not loaded'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {getStatusIcon(debugData.blogPosts.length > 0)}
              <span className="text-sm">
                {debugData.blogPosts.length} posts
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {getStatusIcon(debugData.messages.length >= 0)}
              <span className="text-sm">
                {debugData.messages.length} messages
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Announcements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {getStatusIcon(debugData.announcements.length >= 0)}
              <span className="text-sm">
                {debugData.announcements.length} announcements
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Data Display */}
      {debugData.appData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              App Data Details
            </CardTitle>
            <CardDescription>
              Detailed breakdown of fetched data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Portfolio Items</h4>
                <div className="space-y-1">
                  <div className="text-sm">Count: {debugData.appData.portfolioItems.length}</div>
                  {debugData.appData.portfolioItems.length > 0 && (
                    <div className="text-sm text-muted-foreground">
                      First item: {debugData.appData.portfolioItems[0].title}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Skills</h4>
                <div className="space-y-1">
                  <div className="text-sm">Count: {debugData.appData.skills.length}</div>
                  {debugData.appData.skills.length > 0 && (
                    <div className="text-sm text-muted-foreground">
                      First skill: {debugData.appData.skills[0].name}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">About Me</h4>
                <div className="text-sm">
                  {debugData.appData.aboutMe ? 'Available' : 'Not available'}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Site Settings</h4>
                <div className="text-sm">
                  {debugData.appData.siteSettings ? 'Available' : 'Not available'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Blog Posts Details */}
      {debugData.blogPosts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Blog Posts Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {debugData.blogPosts.slice(0, 3).map((post, index) => (
                <div key={post.id || index} className="p-3 border rounded-lg">
                  <div className="font-medium">{post.title}</div>
                  <div className="text-sm text-muted-foreground">
                    Status: {post.status} | Published: {post.publishedAt}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Messages Details */}
      {debugData.messages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Contact Messages Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {debugData.messages.slice(0, 3).map((message, index) => (
                <div key={message.id || index} className="p-3 border rounded-lg">
                  <div className="font-medium">From: {message.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Email: {message.email} | Date: {message.submittedAt}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Debug Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Debug Logs</CardTitle>
          <CardDescription>
            Detailed execution logs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-lg max-h-64 overflow-y-auto">
            {logs.length > 0 ? (
              logs.map((log, index) => (
                <div key={index} className="text-sm font-mono text-muted-foreground mb-1">
                  {log}
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground">No logs yet</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Last Fetch Time */}
      {debugData.lastFetch && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-sm text-muted-foreground">
              Last fetch: {new Date(debugData.lastFetch).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
