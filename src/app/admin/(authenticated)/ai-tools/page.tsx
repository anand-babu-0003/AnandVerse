"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bot,
  FileText,
  Briefcase,
  Search,
  Mail,
  Sparkles,
  Copy,
  Check,
  History,
  RefreshCw
} from 'lucide-react';
import { 
  generateBlogPostAction,
  generateProjectDescriptionAction,
  generateSEOMetaAction,
  generateEmailResponseAction,
  getAIContentHistoryAction,
  updateAIContentStatusAction
} from '@/actions/admin/aiActions';
import { toast } from '@/hooks/use-toast';
import type { AIGeneratedContent } from '@/lib/types';

export default function AIToolsPage() {
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [contentHistory, setContentHistory] = useState<AIGeneratedContent[]>([]);
  const [copiedContent, setCopiedContent] = useState<string>('');

  // Blog Post Generation
  const [blogTopic, setBlogTopic] = useState('');
  const [blogTone, setBlogTone] = useState<'professional' | 'casual' | 'technical' | 'creative'>('professional');
  const [blogLength, setBlogLength] = useState<'short' | 'medium' | 'long'>('medium');

  // Project Description Generation
  const [projectName, setProjectName] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [features, setFeatures] = useState('');

  // SEO Meta Generation
  const [seoTitle, setSeoTitle] = useState('');
  const [seoContent, setSeoContent] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');

  // Email Response Generation
  const [emailInquiryType, setEmailInquiryType] = useState('');
  const [clientName, setClientName] = useState('');
  const [projectDetails, setProjectDetails] = useState('');

  const handleGenerateBlogPost = async () => {
    if (!blogTopic.trim()) {
      toast({
        title: "Error",
        description: "Please enter a blog topic",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await generateBlogPostAction(blogTopic, blogTone, blogLength);
      if (result.success && result.content) {
        setGeneratedContent(result.content);
        toast({
          title: "Success",
          description: "Blog post generated successfully!",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to generate blog post",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate blog post",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateProjectDescription = async () => {
    if (!projectName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a project name",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const techArray = technologies.split(',').map(t => t.trim()).filter(t => t);
      const featuresArray = features.split(',').map(f => f.trim()).filter(f => f);
      
      const result = await generateProjectDescriptionAction(projectName, techArray, featuresArray);
      if (result.success && result.content) {
        setGeneratedContent(result.content);
        toast({
          title: "Success",
          description: "Project description generated successfully!",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to generate project description",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate project description",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSEOMeta = async () => {
    if (!seoTitle.trim()) {
      toast({
        title: "Error",
        description: "Please enter a page title",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const keywordsArray = seoKeywords.split(',').map(k => k.trim()).filter(k => k);
      
      const result = await generateSEOMetaAction(seoTitle, seoContent, keywordsArray);
      if (result.success && result.meta) {
        const metaContent = `Title: ${result.meta.title}\n\nDescription: ${result.meta.description}\n\nKeywords: ${result.meta.keywords.join(', ')}`;
        setGeneratedContent(metaContent);
        toast({
          title: "Success",
          description: "SEO meta generated successfully!",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to generate SEO meta",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate SEO meta",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateEmailResponse = async () => {
    if (!emailInquiryType.trim() || !clientName.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await generateEmailResponseAction(emailInquiryType, clientName, projectDetails);
      if (result.success && result.content) {
        setGeneratedContent(result.content);
        toast({
          title: "Success",
          description: "Email response generated successfully!",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to generate email response",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate email response",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyContent = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedContent(content);
      toast({
        title: "Success",
        description: "Content copied to clipboard!",
      });
      setTimeout(() => setCopiedContent(''), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy content",
        variant: "destructive",
      });
    }
  };

  const loadContentHistory = async () => {
    try {
      const history = await getAIContentHistoryAction();
      setContentHistory(history);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load content history",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'generated': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'reviewed': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'used': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">AI Content Tools</h1>
          <p className="text-muted-foreground">
            Generate content using AI to speed up your workflow
          </p>
        </div>
        <Button onClick={loadContentHistory} variant="outline" size="sm">
          <History className="h-4 w-4 mr-2" />
          Load History
        </Button>
      </div>

      <Tabs defaultValue="blog" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="blog" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Blog Posts
          </TabsTrigger>
          <TabsTrigger value="project" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Projects
          </TabsTrigger>
          <TabsTrigger value="seo" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            SEO Meta
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
          </TabsTrigger>
        </TabsList>

        {/* Blog Post Generation */}
        <TabsContent value="blog" className="space-y-6">
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Generate Blog Post
              </CardTitle>
              <CardDescription>
                Create engaging blog post content with AI assistance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="blog-topic">Blog Topic *</Label>
                  <Input
                    id="blog-topic"
                    placeholder="e.g., Modern Web Development Trends"
                    value={blogTopic}
                    onChange={(e) => setBlogTopic(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="blog-tone">Tone</Label>
                  <select
                    id="blog-tone"
                    value={blogTone}
                    onChange={(e) => setBlogTone(e.target.value as any)}
                    className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground"
                  >
                    <option value="professional">Professional</option>
                    <option value="casual">Casual</option>
                    <option value="technical">Technical</option>
                    <option value="creative">Creative</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="blog-length">Length</Label>
                <select
                  id="blog-length"
                  value={blogLength}
                  onChange={(e) => setBlogLength(e.target.value as any)}
                  className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground"
                >
                  <option value="short">Short (300 words)</option>
                  <option value="medium">Medium (800 words)</option>
                  <option value="long">Long (1500 words)</option>
                </select>
              </div>

              <Button 
                onClick={handleGenerateBlogPost} 
                disabled={loading || !blogTopic.trim()}
                className="btn-modern w-full"
              >
                {loading ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                Generate Blog Post
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Project Description Generation */}
        <TabsContent value="project" className="space-y-6">
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Generate Project Description
              </CardTitle>
              <CardDescription>
                Create detailed project descriptions for your portfolio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="project-name">Project Name *</Label>
                <Input
                  id="project-name"
                  placeholder="e.g., E-commerce Platform"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="technologies">Technologies (comma-separated)</Label>
                <Input
                  id="technologies"
                  placeholder="e.g., React, Node.js, MongoDB, Tailwind CSS"
                  value={technologies}
                  onChange={(e) => setTechnologies(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="features">Key Features (comma-separated)</Label>
                <Textarea
                  id="features"
                  placeholder="e.g., User authentication, Payment processing, Admin dashboard"
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                  rows={3}
                />
              </div>

              <Button 
                onClick={handleGenerateProjectDescription} 
                disabled={loading || !projectName.trim()}
                className="btn-modern w-full"
              >
                {loading ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                Generate Description
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Meta Generation */}
        <TabsContent value="seo" className="space-y-6">
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Generate SEO Meta
              </CardTitle>
              <CardDescription>
                Create optimized meta titles, descriptions, and keywords
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seo-title">Page Title *</Label>
                <Input
                  id="seo-title"
                  placeholder="e.g., Web Development Services"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="seo-content">Page Content</Label>
                <Textarea
                  id="seo-content"
                  placeholder="Brief description of the page content..."
                  value={seoContent}
                  onChange={(e) => setSeoContent(e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="seo-keywords">Keywords (comma-separated)</Label>
                <Input
                  id="seo-keywords"
                  placeholder="e.g., web development, portfolio, services"
                  value={seoKeywords}
                  onChange={(e) => setSeoKeywords(e.target.value)}
                />
              </div>

              <Button 
                onClick={handleGenerateSEOMeta} 
                disabled={loading || !seoTitle.trim()}
                className="btn-modern w-full"
              >
                {loading ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                Generate SEO Meta
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Response Generation */}
        <TabsContent value="email" className="space-y-6">
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Generate Email Response
              </CardTitle>
              <CardDescription>
                Create professional email responses for client inquiries
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="inquiry-type">Inquiry Type *</Label>
                  <Input
                    id="inquiry-type"
                    placeholder="e.g., Web Development Project"
                    value={emailInquiryType}
                    onChange={(e) => setEmailInquiryType(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client-name">Client Name *</Label>
                  <Input
                    id="client-name"
                    placeholder="e.g., John Smith"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="project-details">Project Details</Label>
                <Textarea
                  id="project-details"
                  placeholder="Brief description of the project or inquiry..."
                  value={projectDetails}
                  onChange={(e) => setProjectDetails(e.target.value)}
                  rows={3}
                />
              </div>

              <Button 
                onClick={handleGenerateEmailResponse} 
                disabled={loading || !emailInquiryType.trim() || !clientName.trim()}
                className="btn-modern w-full"
              >
                {loading ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                Generate Email Response
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Generated Content Display */}
      {generatedContent && (
        <Card className="card-modern">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Generated Content
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleCopyContent(generatedContent)}
              >
                {copiedContent === generatedContent ? (
                  <Check className="h-4 w-4 mr-2" />
                ) : (
                  <Copy className="h-4 w-4 mr-2" />
                )}
                {copiedContent === generatedContent ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm text-foreground">
                {generatedContent}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content History */}
      {contentHistory.length > 0 && (
        <Card className="card-modern">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Content History
            </CardTitle>
            <CardDescription>
              Previously generated AI content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contentHistory.slice(0, 10).map((content) => (
                <div key={content.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(content.status)}>
                        {content.status}
                      </Badge>
                      <Badge variant="outline">
                        {content.type.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(content.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {content.prompt}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopyContent(content.generatedContent)}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
