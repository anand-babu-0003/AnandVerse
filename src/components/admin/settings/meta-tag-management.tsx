'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Save, 
  RefreshCw, 
  Eye, 
  Copy, 
  Check, 
  AlertTriangle,
  Search,
  Share2,
  Twitter,
  Globe,
  Settings,
  FileText,
  Home,
  User,
  Briefcase,
  BookOpen,
  Mail,
  Shield,
  Scale,
  Cookie
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PageMetaTags } from '@/lib/types';
import type { SiteSettings } from '@/lib/types';

interface MetaTagManagementProps {
  siteSettings: SiteSettings;
  onSave: (data: any) => Promise<void>;
  isLoading?: boolean;
}

const PAGE_CONFIGS = [
  {
    id: 'home',
    label: 'Home Page',
    icon: Home,
    description: 'Main landing page meta tags',
    path: '/'
  },
  {
    id: 'about',
    label: 'About Page',
    icon: User,
    description: 'About page meta tags',
    path: '/about'
  },
  {
    id: 'portfolio',
    label: 'Portfolio Page',
    icon: Briefcase,
    description: 'Portfolio listing page meta tags',
    path: '/portfolio'
  },
  {
    id: 'blog',
    label: 'Blog Page',
    icon: BookOpen,
    description: 'Blog listing page meta tags',
    path: '/blog'
  },
  {
    id: 'contact',
    label: 'Contact Page',
    icon: Mail,
    description: 'Contact page meta tags',
    path: '/contact'
  },
  {
    id: 'privacy',
    label: 'Privacy Policy',
    icon: Shield,
    description: 'Privacy policy page meta tags',
    path: '/privacy'
  },
  {
    id: 'terms',
    label: 'Terms of Service',
    icon: Scale,
    description: 'Terms of service page meta tags',
    path: '/terms'
  },
  {
    id: 'cookies',
    label: 'Cookie Policy',
    icon: Cookie,
    description: 'Cookie policy page meta tags',
    path: '/cookies'
  }
];

const MetaTagForm: React.FC<{
  metaTags: PageMetaTags;
  onChange: (metaTags: PageMetaTags) => void;
  pageConfig: typeof PAGE_CONFIGS[0];
  siteSettings: SiteSettings;
}> = ({ metaTags, onChange, pageConfig, siteSettings }) => {
  const [copied, setCopied] = useState<string | null>(null);
  const [showTwitterTags, setShowTwitterTags] = useState<boolean>(false);

  const handleCopy = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const updateMetaTag = (field: keyof PageMetaTags, value: any) => {
    onChange({
      ...metaTags,
      [field]: value
    });
  };

  const generatePreview = () => {
    const title = metaTags.title || `${pageConfig.label} | ${siteSettings.siteName}`;
    const description = metaTags.description || 'Default description';
    
    return {
      title,
      description,
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://anandverse.com'}${pageConfig.path}`
    };
  };

  const preview = generatePreview();

  return (
    <div className="space-y-6">
      {/* Basic Meta Tags */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Basic Meta Tags
          </CardTitle>
          <CardDescription>
            Essential meta tags for search engines and browsers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`title-${pageConfig.id}`}>
                Page Title
                <Badge variant="secondary" className="ml-2 text-xs">
                  {metaTags.title?.length || 0}/70
                </Badge>
              </Label>
              <Input
                id={`title-${pageConfig.id}`}
                value={metaTags.title || ''}
                onChange={(e) => updateMetaTag('title', e.target.value)}
                placeholder={`${pageConfig.label} | ${siteSettings.siteName}`}
                maxLength={70}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`canonical-${pageConfig.id}`}>
                Canonical URL
              </Label>
              <div className="flex gap-2">
                <Input
                  id={`canonical-${pageConfig.id}`}
                  value={metaTags.canonicalUrl || ''}
                  onChange={(e) => updateMetaTag('canonicalUrl', e.target.value)}
                  placeholder={preview.url}
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopy(preview.url, 'canonical')}
                >
                  {copied === 'canonical' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`description-${pageConfig.id}`}>
              Meta Description
              <Badge variant="secondary" className="ml-2 text-xs">
                {metaTags.description?.length || 0}/160
              </Badge>
            </Label>
            <Textarea
              id={`description-${pageConfig.id}`}
              value={metaTags.description || ''}
              onChange={(e) => updateMetaTag('description', e.target.value)}
              placeholder="Enter a compelling description for search engines"
              maxLength={160}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`keywords-${pageConfig.id}`}>
              Keywords
              <Badge variant="secondary" className="ml-2 text-xs">
                {metaTags.keywords?.length || 0}/200
              </Badge>
            </Label>
            <Input
              id={`keywords-${pageConfig.id}`}
              value={metaTags.keywords || ''}
              onChange={(e) => updateMetaTag('keywords', e.target.value)}
              placeholder="web developer, portfolio, react, nextjs"
              maxLength={200}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id={`noindex-${pageConfig.id}`}
              checked={metaTags.noIndex || false}
              onCheckedChange={(checked) => updateMetaTag('noIndex', checked)}
            />
            <Label htmlFor={`noindex-${pageConfig.id}`}>
              No Index (Prevent search engines from indexing this page)
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id={`nofollow-${pageConfig.id}`}
              checked={metaTags.noFollow || false}
              onCheckedChange={(checked) => updateMetaTag('noFollow', checked)}
            />
            <Label htmlFor={`nofollow-${pageConfig.id}`}>
              No Follow (Prevent search engines from following links on this page)
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Open Graph Meta Tags */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Open Graph Meta Tags
          </CardTitle>
          <CardDescription>
            Meta tags for social media sharing (Facebook, LinkedIn, etc.)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`og-title-${pageConfig.id}`}>
                OG Title
                <Badge variant="secondary" className="ml-2 text-xs">
                  {metaTags.ogTitle?.length || 0}/95
                </Badge>
              </Label>
              <Input
                id={`og-title-${pageConfig.id}`}
                value={metaTags.ogTitle || ''}
                onChange={(e) => updateMetaTag('ogTitle', e.target.value)}
                placeholder={metaTags.title || `${pageConfig.label} | ${siteSettings.siteName}`}
                maxLength={95}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`og-image-${pageConfig.id}`}>
                OG Image URL
              </Label>
              <Input
                id={`og-image-${pageConfig.id}`}
                value={metaTags.ogImage || ''}
                onChange={(e) => updateMetaTag('ogImage', e.target.value)}
                placeholder="https://example.com/og-image.jpg"
                type="url"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`og-description-${pageConfig.id}`}>
              OG Description
              <Badge variant="secondary" className="ml-2 text-xs">
                {metaTags.ogDescription?.length || 0}/200
              </Badge>
            </Label>
            <Textarea
              id={`og-description-${pageConfig.id}`}
              value={metaTags.ogDescription || ''}
              onChange={(e) => updateMetaTag('ogDescription', e.target.value)}
              placeholder={metaTags.description || "Enter a compelling description for social media"}
              maxLength={200}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Twitter Meta Tags - Optional */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Twitter className="h-5 w-5" />
              <CardTitle>Twitter Meta Tags</CardTitle>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id={`show-twitter-${pageConfig.id}`}
                checked={showTwitterTags}
                onCheckedChange={setShowTwitterTags}
              />
              <Label htmlFor={`show-twitter-${pageConfig.id}`} className="text-sm">
                {showTwitterTags ? 'Hide' : 'Show'} Twitter Tags
              </Label>
            </div>
          </div>
          <CardDescription>
            Optional meta tags specifically for Twitter sharing. If not set, Open Graph tags will be used.
          </CardDescription>
        </CardHeader>
        {showTwitterTags && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`twitter-title-${pageConfig.id}`}>
                  Twitter Title
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {metaTags.twitterTitle?.length || 0}/70
                  </Badge>
                </Label>
                <Input
                  id={`twitter-title-${pageConfig.id}`}
                  value={metaTags.twitterTitle || ''}
                  onChange={(e) => updateMetaTag('twitterTitle', e.target.value)}
                  placeholder={metaTags.ogTitle || metaTags.title || `${pageConfig.label} | ${siteSettings.siteName}`}
                  maxLength={70}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`twitter-image-${pageConfig.id}`}>
                  Twitter Image URL
                </Label>
                <Input
                  id={`twitter-image-${pageConfig.id}`}
                  value={metaTags.twitterImage || ''}
                  onChange={(e) => updateMetaTag('twitterImage', e.target.value)}
                  placeholder="https://example.com/twitter-image.jpg"
                  type="url"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`twitter-description-${pageConfig.id}`}>
                Twitter Description
                <Badge variant="secondary" className="ml-2 text-xs">
                  {metaTags.twitterDescription?.length || 0}/200
                </Badge>
              </Label>
              <Textarea
                id={`twitter-description-${pageConfig.id}`}
                value={metaTags.twitterDescription || ''}
                onChange={(e) => updateMetaTag('twitterDescription', e.target.value)}
                placeholder={metaTags.ogDescription || metaTags.description || "Enter a compelling description for Twitter"}
                maxLength={200}
                rows={3}
              />
            </div>

            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Note:</strong> If Twitter meta tags are not specified, Twitter will automatically use your Open Graph tags. 
                You only need to set these if you want different content for Twitter than other social platforms.
              </p>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Preview
          </CardTitle>
          <CardDescription>
            How this page will appear in search results and social media
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border rounded-lg p-4 bg-muted/30">
            <div className="space-y-2">
              <div className="text-blue-600 text-sm font-medium truncate">
                {preview.title}
              </div>
              <div className="text-green-700 text-xs">
                {preview.url}
              </div>
              <div className="text-gray-600 text-sm">
                {preview.description}
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleCopy(preview.title, 'title')}
            >
              {copied === 'title' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              Copy Title
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleCopy(preview.description, 'description')}
            >
              {copied === 'description' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              Copy Description
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const MetaTagManagement: React.FC<MetaTagManagementProps> = ({
  siteSettings,
  onSave,
  isLoading = false
}) => {
  const [activeTab, setActiveTab] = useState('home');
  const [metaTagsData, setMetaTagsData] = useState<Record<string, PageMetaTags>>(() => {
    const initial: Record<string, PageMetaTags> = {};
    
    PAGE_CONFIGS.forEach(config => {
      const key = `${config.id}PageMetaTags` as keyof SiteSettings;
      initial[config.id] = (siteSettings[key] as PageMetaTags) || {};
    });
    
    return initial;
  });

  const { toast } = useToast();

  const handleSave = async () => {
    try {
      const updateData: any = {};
      
      PAGE_CONFIGS.forEach(config => {
        const key = `${config.id}PageMetaTags` as keyof SiteSettings;
        updateData[key] = metaTagsData[config.id];
      });

      await onSave(updateData);
      
      toast({
        title: "Meta Tags Updated",
        description: "All page meta tags have been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update meta tags. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleMetaTagsChange = (pageId: string, metaTags: PageMetaTags) => {
    setMetaTagsData(prev => ({
      ...prev,
      [pageId]: metaTags
    }));
  };

  const currentPageConfig = PAGE_CONFIGS.find(config => config.id === activeTab);
  const currentMetaTags = metaTagsData[activeTab] || {};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Meta Tag Management</h2>
          <p className="text-muted-foreground">
            Configure SEO meta tags for all pages on your website
          </p>
        </div>
        <Button onClick={handleSave} disabled={isLoading} className="btn-modern">
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? 'Saving...' : 'Save All Changes'}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
          {PAGE_CONFIGS.map((config) => {
            const Icon = config.icon;
            return (
              <TabsTrigger key={config.id} value={config.id} className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{config.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {PAGE_CONFIGS.map((config) => (
          <TabsContent key={config.id} value={config.id} className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <config.icon className="h-5 w-5" />
              <div>
                <h3 className="text-lg font-semibold">{config.label}</h3>
                <p className="text-sm text-muted-foreground">{config.description}</p>
              </div>
            </div>

            <MetaTagForm
              metaTags={currentMetaTags}
              onChange={(metaTags) => handleMetaTagsChange(config.id, metaTags)}
              pageConfig={config}
              siteSettings={siteSettings}
            />
          </TabsContent>
        ))}
      </Tabs>

      <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
        <AlertTriangle className="h-5 w-5 text-amber-500" />
        <div className="flex-1">
          <p className="text-sm font-medium">SEO Best Practices</p>
          <p className="text-xs text-muted-foreground">
            Keep titles under 70 characters, descriptions under 160 characters, and use relevant keywords for better search engine visibility.
          </p>
        </div>
      </div>
    </div>
  );
};
