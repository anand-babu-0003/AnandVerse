"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Search, Share2, Globe } from 'lucide-react';
import type { SiteSettings } from '@/lib/types';

interface SEOPreviewProps {
  siteSettings: SiteSettings;
  isLive?: boolean;
}

export function SEOPreview({ siteSettings, isLive = false }: SEOPreviewProps) {
  const [previewData, setPreviewData] = useState({
    title: siteSettings.siteName || 'Your Site Name',
    description: siteSettings.defaultMetaDescription || 'Your site description',
    keywords: siteSettings.defaultMetaKeywords || '',
    ogImage: siteSettings.siteOgImageUrl || '',
  });

  useEffect(() => {
    setPreviewData({
      title: siteSettings.siteName || 'Your Site Name',
      description: siteSettings.defaultMetaDescription || 'Your site description',
      keywords: siteSettings.defaultMetaKeywords || '',
      ogImage: siteSettings.siteOgImageUrl || '',
    });
  }, [siteSettings]);

  const titleLength = previewData.title.length;
  const descriptionLength = previewData.description.length;
  const keywordsArray = previewData.keywords.split(',').map(k => k.trim()).filter(Boolean);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            SEO Preview
            {isLive && <Badge variant="secondary" className="ml-2">Live</Badge>}
          </CardTitle>
          <CardDescription>
            Preview how your site will appear in search results and social media
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Google Search Preview */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Google Search Result</span>
            </div>
            <div className="border rounded-lg p-4 bg-background">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Globe className="h-3 w-3 text-green-600" />
                  <span className="text-sm text-green-600">anandverse.com</span>
                </div>
                <h3 className="text-lg text-blue-600 hover:underline cursor-pointer line-clamp-1">
                  {previewData.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {previewData.description}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>Keywords: {keywordsArray.slice(0, 3).join(', ')}</span>
                  {keywordsArray.length > 3 && <span>+{keywordsArray.length - 3} more</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Social Media Preview */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Share2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Social Media Preview</span>
            </div>
            <div className="border rounded-lg p-4 bg-background">
              <div className="space-y-3">
                {previewData.ogImage && (
                  <div className="aspect-video bg-gray-100 rounded overflow-hidden">
                    <img 
                      src={previewData.ogImage} 
                      alt="Open Graph Image"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg line-clamp-2">
                    {previewData.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {previewData.description}
                  </p>
                  <div className="text-xs text-muted-foreground">
                    anandverse.com
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SEO Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Title Length</span>
                <Badge variant={titleLength > 60 ? "destructive" : titleLength > 50 ? "secondary" : "default"}>
                  {titleLength}/60
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                {titleLength > 60 ? "Too long" : titleLength < 30 ? "Too short" : "Optimal"}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Description Length</span>
                <Badge variant={descriptionLength > 160 ? "destructive" : descriptionLength > 120 ? "secondary" : "default"}>
                  {descriptionLength}/160
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                {descriptionLength > 160 ? "Too long" : descriptionLength < 120 ? "Too short" : "Optimal"}
              </div>
            </div>
          </div>

          {/* Keywords */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Keywords</span>
              <Badge variant="outline">{keywordsArray.length} keywords</Badge>
            </div>
            <div className="flex flex-wrap gap-1">
              {keywordsArray.slice(0, 10).map((keyword, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {keyword}
                </Badge>
              ))}
              {keywordsArray.length > 10 && (
                <Badge variant="outline" className="text-xs">
                  +{keywordsArray.length - 10} more
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
