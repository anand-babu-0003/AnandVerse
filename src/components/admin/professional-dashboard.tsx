"use client";

import { useState, useEffect } from 'react';
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
  BarChart3,
  Users,
  FileText,
  Globe,
  Activity,
  Zap,
  Shield,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Bell,
  BellOff,
  Pencil,
  Save,
  X,
  Upload,
  Image as ImageIcon,
  Link as LinkIcon,
  Tag,
  Award,
  BookOpen,
  MapPin,
  Phone,
  ExternalLink
} from 'lucide-react';
import { useFirestoreData } from '@/hooks/useFirestoreData';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

interface DashboardStats {
  totalPortfolioItems: number;
  totalSkills: number;
  totalMessages: number;
  totalAnnouncements: number;
  recentMessages: number;
  activeAnnouncements: number;
  lastUpdated: string;
}

export default function ProfessionalDashboard() {
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
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Calculate dashboard statistics
  const dashboardStats: DashboardStats = {
    totalPortfolioItems: portfolioItems.length,
    totalSkills: skills.length,
    totalMessages: contactMessages.length,
    totalAnnouncements: announcements.length,
    recentMessages: contactMessages.filter(msg => {
      const msgDate = new Date(msg.submittedAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return msgDate > weekAgo;
    }).length,
    activeAnnouncements: announcements.filter(ann => ann.isActive).length,
    lastUpdated: stats?.lastUpdated || new Date().toISOString()
  };

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
          <p className="text-muted-foreground">Loading dashboard data...</p>
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
              Error Loading Dashboard
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                <Database className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="hidden xs:inline">Professional Dashboard</span>
                <span className="xs:hidden">Dashboard</span>
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Manage your portfolio data and site content
              </p>
            </div>
            <div className="flex flex-col xs:flex-row gap-2 w-full sm:w-auto">
              <Button onClick={handleRefreshAll} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button 
                onClick={() => exportData({
                  portfolioItems,
                  skills,
                  aboutMe,
                  siteSettings,
                  contactMessages,
                  announcements,
                  stats
                }, 'portfolio-data-export.json')}
                size="sm"
              >
                <Download className="h-4 w-4 mr-2" />
                Export All
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Portfolio Items</p>
                  <p className="text-2xl sm:text-3xl font-bold">{dashboardStats.totalPortfolioItems}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    <TrendingUp className="h-3 w-3 inline mr-1" />
                    Active projects
                  </p>
                </div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Briefcase className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Skills</p>
                  <p className="text-2xl sm:text-3xl font-bold">{dashboardStats.totalSkills}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    <Code className="h-3 w-3 inline mr-1" />
                    Technologies
                  </p>
                </div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Code className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Messages</p>
                  <p className="text-2xl sm:text-3xl font-bold">{dashboardStats.totalMessages}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    <MessageSquare className="h-3 w-3 inline mr-1" />
                    {dashboardStats.recentMessages} this week
                  </p>
                </div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Announcements</p>
                  <p className="text-2xl sm:text-3xl font-bold">{dashboardStats.totalAnnouncements}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    <Bell className="h-3 w-3 inline mr-1" />
                    {dashboardStats.activeAnnouncements} active
                  </p>
                </div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Bell className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search across all data..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="icon" className="w-full sm:w-auto">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 h-auto">
            <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
            <TabsTrigger value="portfolio" className="text-xs sm:text-sm">Portfolio</TabsTrigger>
            <TabsTrigger value="skills" className="text-xs sm:text-sm">Skills</TabsTrigger>
            <TabsTrigger value="about" className="text-xs sm:text-sm">About</TabsTrigger>
            <TabsTrigger value="messages" className="text-xs sm:text-sm">Messages</TabsTrigger>
            <TabsTrigger value="announcements" className="text-xs sm:text-sm">Announcements</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>
                    Latest updates and interactions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {contactMessages.slice(0, 5).map((message, index) => (
                      <div key={message.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <Mail className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{message.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(message.submittedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          New
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Quick Stats
                  </CardTitle>
                  <CardDescription>
                    Key performance indicators
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Portfolio Completion</span>
                      <span className="text-sm text-muted-foreground">
                        {Math.round((portfolioItems.length / 10) * 100)}%
                      </span>
                    </div>
                    <Progress value={Math.min((portfolioItems.length / 10) * 100, 100)} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Skills Coverage</span>
                      <span className="text-sm text-muted-foreground">
                        {Math.round((skills.length / 20) * 100)}%
                      </span>
                    </div>
                    <Progress value={Math.min((skills.length / 20) * 100, 100)} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Response Rate</span>
                      <span className="text-sm text-muted-foreground">98%</span>
                    </div>
                    <Progress value={98} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* About Me Summary */}
            {aboutMe && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    About Me Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Personal Info</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-muted-foreground">Name:</span> {aboutMe.name}</p>
                        <p><span className="text-muted-foreground">Title:</span> {aboutMe.title}</p>
                        <p><span className="text-muted-foreground">Email:</span> {aboutMe.email || 'Not set'}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Experience</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-muted-foreground">Positions:</span> {aboutMe.experience.length}</p>
                        <p><span className="text-muted-foreground">Education:</span> {aboutMe.education.length}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Social Links</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-muted-foreground">LinkedIn:</span> {aboutMe.linkedinUrl ? 'Set' : 'Not set'}</p>
                        <p><span className="text-muted-foreground">GitHub:</span> {aboutMe.githubUrl ? 'Set' : 'Not set'}</p>
                        <p><span className="text-muted-foreground">Twitter:</span> {aboutMe.twitterUrl ? 'Set' : 'Not set'}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Portfolio Items ({filteredPortfolioItems.length})</h3>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Portfolio Item</DialogTitle>
                    <DialogDescription>
                      Create a new portfolio item to showcase your work.
                    </DialogDescription>
                  </DialogHeader>
                  {/* Add portfolio form would go here */}
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPortfolioItems.map((item) => (
                <Card key={item.id} className="group hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg line-clamp-1">{item.title}</CardTitle>
                        <CardDescription className="line-clamp-2 mt-1">
                          {item.description}
                        </CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
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
          <TabsContent value="skills" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Skills ({filteredSkills.length})</h3>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Skill
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Skill</DialogTitle>
                    <DialogDescription>
                      Add a new skill to your portfolio.
                    </DialogDescription>
                  </DialogHeader>
                  {/* Add skill form would go here */}
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSkills.map((skill) => (
                <Card key={skill.id} className="group hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Code className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{skill.name}</h4>
                          <Badge variant="secondary" className="text-xs">{skill.category}</Badge>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    {skill.proficiency && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Proficiency</span>
                          <span>{skill.proficiency}%</span>
                        </div>
                        <Progress value={skill.proficiency} className="h-2" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about" className="space-y-6">
            {aboutMe ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Name</Label>
                        <p className="text-sm text-muted-foreground mt-1">{aboutMe.name}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Title</Label>
                        <p className="text-sm text-muted-foreground mt-1">{aboutMe.title}</p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Email</Label>
                      <p className="text-sm text-muted-foreground mt-1">{aboutMe.email || 'Not provided'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Bio</Label>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-4">{aboutMe.bio}</p>
                    </div>
                    <Button className="w-full">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit About Me
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Experience & Education
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold">Experience ({aboutMe.experience.length})</h4>
                        <Button size="sm" variant="outline">
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                      <ScrollArea className="h-32">
                        <div className="space-y-2">
                          {aboutMe.experience.map((exp) => (
                            <div key={exp.id} className="p-3 bg-muted/50 rounded-lg">
                              <p className="font-medium text-sm">{exp.role}</p>
                              <p className="text-xs text-muted-foreground">{exp.company} • {exp.period}</p>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold">Education ({aboutMe.education.length})</h4>
                        <Button size="sm" variant="outline">
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                      <ScrollArea className="h-32">
                        <div className="space-y-2">
                          {aboutMe.education.map((edu) => (
                            <div key={edu.id} className="p-3 bg-muted/50 rounded-lg">
                              <p className="font-medium text-sm">{edu.degree}</p>
                              <p className="text-xs text-muted-foreground">{edu.institution} • {edu.period}</p>
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
                  <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No about me data available</p>
                  <Button className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Create About Me
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Contact Messages ({filteredContactMessages.length})</h3>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => exportData(contactMessages, 'contact-messages.json')}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
            
            <div className="space-y-4">
              {filteredContactMessages.map((message) => (
                <Card key={message.id} className="group hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">{message.name}</p>
                          <p className="text-sm text-muted-foreground">{message.email}</p>
                        </div>
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
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{message.message}</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Mail className="h-4 w-4 mr-1" />
                        Reply
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View Full
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
          <TabsContent value="announcements" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Announcements ({announcements.length})</h3>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Announcement
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Announcement</DialogTitle>
                    <DialogDescription>
                      Create a new announcement for your site.
                    </DialogDescription>
                  </DialogHeader>
                  {/* Add announcement form would go here */}
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <Card key={announcement.id} className="group hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{announcement.title || 'Untitled Announcement'}</h4>
                          <Badge variant={announcement.isActive ? "default" : "secondary"}>
                            {announcement.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {announcement.description || 'No description'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          {new Date(announcement.createdAt).toLocaleDateString()}
                        </p>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
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
    </div>
  );
}
