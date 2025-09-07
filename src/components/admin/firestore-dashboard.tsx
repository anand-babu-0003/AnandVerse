"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Database, 
  RefreshCw, 
  Download, 
  Eye, 
  Edit, 
  Trash2,
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  Mail,
  MessageSquare,
  Briefcase,
  Code,
  Settings,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { useFirestoreData } from '@/hooks/useFirestoreData';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function FirestoreDashboard() {
  const {
    portfolioItems,
    skills,
    aboutMe,
    siteSettings,
    contactMessages,
    announcements,
    isLoading,
    error,
    stats,
    refetchAll,
    refetchStats
  } = useFirestoreData();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('overview');

  const handleRefreshAll = async () => {
    await Promise.all([refetchAll(), refetchStats()]);
  };

  const exportData = (data: any, filename: string) => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredPortfolioItems = portfolioItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredSkills = skills.filter(skill =>
    skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    skill.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredContactMessages = contactMessages.filter(message =>
    message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading Firestore data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Error Loading Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={handleRefreshAll} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Database className="h-8 w-8" />
            Firestore Dashboard
          </h1>
          <p className="text-muted-foreground">
            Comprehensive view of all data stored in Firestore
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleRefreshAll} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh All
          </Button>
          <Button onClick={() => exportData({
            portfolioItems,
            skills,
            aboutMe,
            siteSettings,
            contactMessages,
            announcements,
            stats
          }, 'firestore-data-export.json')}>
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Portfolio Items</p>
                  <p className="text-2xl font-bold">{stats.portfolioItems}</p>
                </div>
                <Briefcase className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Skills</p>
                  <p className="text-2xl font-bold">{stats.skills}</p>
                </div>
                <Code className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Contact Messages</p>
                  <p className="text-2xl font-bold">{stats.contactMessages}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Announcements</p>
                  <p className="text-2xl font-bold">{stats.announcements}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search across all data..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* About Me Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  About Me Data
                </CardTitle>
              </CardHeader>
              <CardContent>
                {aboutMe ? (
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium">{aboutMe.name}</p>
                      <p className="text-sm text-muted-foreground">{aboutMe.title}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="secondary">{aboutMe.experience.length} Experiences</Badge>
                      <Badge variant="secondary">{aboutMe.education.length} Education</Badge>
                    </div>
                    <Button size="sm" variant="outline" className="w-full">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No about me data available</p>
                )}
              </CardContent>
            </Card>

            {/* Site Settings Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Site Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                {siteSettings ? (
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium">{siteSettings.siteName}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {siteSettings.defaultMetaDescription}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={siteSettings.maintenanceMode ? "destructive" : "secondary"}>
                        {siteSettings.maintenanceMode ? "Maintenance Mode" : "Active"}
                      </Badge>
                    </div>
                    <Button size="sm" variant="outline" className="w-full">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No site settings available</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Portfolio Tab */}
        <TabsContent value="portfolio" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Portfolio Items ({filteredPortfolioItems.length})</h3>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPortfolioItems.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-1">
                      {item.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                      ))}
                      {item.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">+{item.tags.length - 3}</Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="skills" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Skills ({filteredSkills.length})</h3>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Skill
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSkills.map((skill) => (
              <Card key={skill.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{skill.name}</h4>
                    <Badge variant="secondary">{skill.category}</Badge>
                  </div>
                  {skill.proficiency && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Proficiency</span>
                        <span>{skill.proficiency}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${skill.proficiency}%` }}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* About Tab */}
        <TabsContent value="about" className="space-y-4">
          {aboutMe ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="font-medium">Name</p>
                    <p className="text-muted-foreground">{aboutMe.name}</p>
                  </div>
                  <div>
                    <p className="font-medium">Title</p>
                    <p className="text-muted-foreground">{aboutMe.title}</p>
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">{aboutMe.email || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="font-medium">Bio</p>
                    <p className="text-muted-foreground line-clamp-4">{aboutMe.bio}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Experience & Education</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="font-medium">Experience ({aboutMe.experience.length})</p>
                    <ScrollArea className="h-32">
                      <div className="space-y-2">
                        {aboutMe.experience.map((exp) => (
                          <div key={exp.id} className="p-2 bg-muted rounded">
                            <p className="font-medium text-sm">{exp.role}</p>
                            <p className="text-xs text-muted-foreground">{exp.company}</p>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                  <div>
                    <p className="font-medium">Education ({aboutMe.education.length})</p>
                    <ScrollArea className="h-32">
                      <div className="space-y-2">
                        {aboutMe.education.map((edu) => (
                          <div key={edu.id} className="p-2 bg-muted rounded">
                            <p className="font-medium text-sm">{edu.degree}</p>
                            <p className="text-xs text-muted-foreground">{edu.institution}</p>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No about me data available</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Messages Tab */}
        <TabsContent value="messages" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Contact Messages ({filteredContactMessages.length})</h3>
            <Button size="sm" variant="outline" onClick={() => exportData(contactMessages, 'contact-messages.json')}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
          <div className="space-y-4">
            {filteredContactMessages.map((message) => (
              <Card key={message.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-medium">{message.name}</p>
                      <p className="text-sm text-muted-foreground">{message.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {new Date(message.submittedAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(message.submittedAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm line-clamp-3">{message.message}</p>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline">
                      <Mail className="h-4 w-4 mr-1" />
                      Reply
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Announcements Tab */}
        <TabsContent value="announcements" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Announcements ({announcements.length})</h3>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Announcement
            </Button>
          </div>
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <Card key={announcement.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-medium">{announcement.title || 'Untitled Announcement'}</p>
                      <p className="text-sm text-muted-foreground">
                        {announcement.description || 'No description'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {new Date(announcement.createdAt).toLocaleDateString()}
                      </p>
                      <Badge variant={announcement.isActive ? "default" : "secondary"}>
                        {announcement.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
