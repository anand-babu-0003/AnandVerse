"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  Search,
  Filter,
  Calendar,
  Tag,
  ExternalLink,
  Github,
  Image as ImageIcon,
  Save,
  X,
  Upload,
  EyeIcon,
  Code,
  Link as LinkIcon
} from 'lucide-react';
import { usePortfolioData } from '@/hooks/useFirestoreData';
import { savePortfolioItemAction, deletePortfolioItemAction } from '@/actions/admin/portfolioActions';
import { useToast } from '@/hooks/use-toast';
import type { PortfolioItem } from '@/lib/types';

// Simple Markdown Preview Component
function MarkdownPreview({ content }: { content: string }) {
  const formatMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>')
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-4 mb-2">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>')
      .replace(/^\* (.*$)/gim, '<li class="ml-4">• $1</li>')
      .replace(/^- (.*$)/gim, '<li class="ml-4">• $1</li>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/\n/g, '<br>');
  };

  return (
    <div 
      dangerouslySetInnerHTML={{ __html: formatMarkdown(content) }}
      className="prose prose-sm max-w-none"
    />
  );
}

export default function PortfolioManagement() {
  const { portfolioItems, isLoading, error, refetch } = usePortfolioData();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get unique categories from tags
  const categories = Array.from(new Set(portfolioItems.flatMap(item => item.tags)));

  const filteredItems = portfolioItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || item.tags.includes(selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (item: PortfolioItem) => {
    setEditingItem(item);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (itemId: string) => {
    if (confirm('Are you sure you want to delete this portfolio item?')) {
      try {
        const result = await deletePortfolioItemAction(itemId);
        if (result.success) {
          toast({
            title: "Success",
            description: result.message,
          });
          refetch();
        } else {
          toast({
            title: "Error",
            description: result.message,
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete portfolio item",
          variant: "destructive",
        });
      }
    }
  };

  const handleSave = async (item: Partial<PortfolioItem>) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      if (item.id) formData.append('id', item.id);
      formData.append('title', item.title || '');
      formData.append('description', item.description || '');
      formData.append('longDescription', item.longDescription || '');
      formData.append('tagsString', item.tags?.join(', ') || '');
      formData.append('liveUrl', item.liveUrl || '');
      formData.append('repoUrl', item.repoUrl || '');
      formData.append('slug', item.slug || item.title?.toLowerCase().replace(/\s+/g, '-') || '');
      formData.append('dataAiHint', item.dataAiHint || '');
      formData.append('readmeContent', item.readmeContent || '');
      
      // Handle images
      if (item.images && item.images.length > 0) {
        formData.append('image1', item.images[0] || '');
        formData.append('image2', item.images[1] || '');
      }

      const result = await savePortfolioItemAction({ message: '', status: 'idle' }, formData);
      
      if (result.status === 'success') {
        toast({
          title: "Success",
          description: result.message,
        });
        // Reset all dialog states
        setIsAddDialogOpen(false);
        setIsEditDialogOpen(false);
        setEditingItem(null);
        refetch();
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error saving portfolio item:', error);
      toast({
        title: "Error",
        description: "Failed to save portfolio item",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading portfolio items...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={refetch}>Retry</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Portfolio Management</h2>
          <p className="text-muted-foreground">
            Manage your portfolio items and showcase your work
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Portfolio Item</DialogTitle>
              <DialogDescription>
                Create a new portfolio item to showcase your work.
              </DialogDescription>
            </DialogHeader>
            <PortfolioForm 
              key="add-form"
              onSubmit={handleSave}
              onCancel={() => setIsAddDialogOpen(false)}
              isSubmitting={isSubmitting}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search portfolio items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-input bg-background rounded-md text-sm"
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold">{portfolioItems.length}</p>
              </div>
              <ImageIcon className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Categories</p>
                <p className="text-2xl font-bold">{categories.length}</p>
              </div>
              <Tag className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">With Live URLs</p>
                <p className="text-2xl font-bold">
                  {portfolioItems.filter(item => item.liveUrl).length}
                </p>
              </div>
              <ExternalLink className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
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
                    <DropdownMenuItem onClick={() => window.open(`/portfolio/${item.slug}`, '_blank')}>
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEdit(item)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDelete(item.id)}
                      className="text-destructive"
                    >
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
                  {item.liveUrl && (
                    <Button size="sm" variant="outline" className="flex-1" asChild>
                      <a href={item.liveUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Live
                      </a>
                    </Button>
                  )}
                  {item.repoUrl && (
                    <Button size="sm" variant="outline" className="flex-1" asChild>
                      <a href={item.repoUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4 mr-1" />
                        Code
                      </a>
                    </Button>
                  )}
                </div>
                
                <div className="text-xs text-muted-foreground">
                  Created: {new Date(item.createdAt || '').toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Portfolio Item</DialogTitle>
            <DialogDescription>
              Update the portfolio item details.
            </DialogDescription>
          </DialogHeader>
          {editingItem && (
            <PortfolioForm 
              key={`edit-form-${editingItem.id}`}
              item={editingItem}
              onSubmit={handleSave}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setEditingItem(null);
              }}
              isSubmitting={isSubmitting}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface PortfolioFormProps {
  item?: PortfolioItem;
  onSubmit: (item: Partial<PortfolioItem>) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

function PortfolioForm({ item, onSubmit, onCancel, isSubmitting = false }: PortfolioFormProps) {
  const [formData, setFormData] = useState(() => ({
    title: item?.title || '',
    description: item?.description || '',
    longDescription: item?.longDescription || '',
    tags: item?.tags?.join(', ') || '',
    liveUrl: item?.liveUrl || '',
    repoUrl: item?.repoUrl || '',
    dataAiHint: item?.dataAiHint || '',
    image1: item?.images?.[0] || '',
    image2: item?.images?.[1] || '',
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const images = [formData.image1, formData.image2].filter(Boolean);
    onSubmit({
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      images: images,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={formData.title.toLowerCase().replace(/\s+/g, '-')}
              disabled
              className="bg-muted"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Short Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
            required
            placeholder="Brief description of your project..."
          />
        </div>

        <div>
          <Label htmlFor="tags">Tags (comma-separated)</Label>
          <Input
            id="tags"
            value={formData.tags}
            onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
            placeholder="React, Next.js, TypeScript"
          />
        </div>
      </div>

      {/* Images */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Project Images</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="image1">Image URL 1</Label>
            <Input
              id="image1"
              type="url"
              value={formData.image1}
              onChange={(e) => setFormData(prev => ({ ...prev, image1: e.target.value }))}
              placeholder="https://example.com/image1.jpg"
            />
            {formData.image1 && (
              <div className="mt-2">
                <img 
                  src={formData.image1} 
                  alt="Preview" 
                  className="w-full h-32 object-cover rounded-md border"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
          <div>
            <Label htmlFor="image2">Image URL 2</Label>
            <Input
              id="image2"
              type="url"
              value={formData.image2}
              onChange={(e) => setFormData(prev => ({ ...prev, image2: e.target.value }))}
              placeholder="https://example.com/image2.jpg"
            />
            {formData.image2 && (
              <div className="mt-2">
                <img 
                  src={formData.image2} 
                  alt="Preview" 
                  className="w-full h-32 object-cover rounded-md border"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Long Description with Markdown */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Detailed Description</h3>
        <Tabs defaultValue="write" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="write" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Write
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <EyeIcon className="h-4 w-4" />
              Preview
            </TabsTrigger>
          </TabsList>
          <TabsContent value="write" className="space-y-2">
            <Label htmlFor="longDescription">Markdown Content</Label>
            <Textarea
              id="longDescription"
              value={formData.longDescription}
              onChange={(e) => setFormData(prev => ({ ...prev, longDescription: e.target.value }))}
              rows={8}
              placeholder="Write your detailed project description using Markdown..."
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Supports Markdown syntax: **bold**, *italic*, `code`, [links](url), # headers, - lists, etc.
            </p>
          </TabsContent>
          <TabsContent value="preview" className="space-y-2">
            <Label>Preview</Label>
            <div className="min-h-[200px] p-4 border rounded-md bg-muted/50">
              {formData.longDescription ? (
                <div className="prose prose-sm max-w-none">
                  <MarkdownPreview content={formData.longDescription} />
                </div>
              ) : (
                <p className="text-muted-foreground italic">No content to preview</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* URLs */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Project Links</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="liveUrl">Live URL</Label>
            <Input
              id="liveUrl"
              type="url"
              value={formData.liveUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, liveUrl: e.target.value }))}
              placeholder="https://example.com"
            />
          </div>
          <div>
            <Label htmlFor="repoUrl">Repository URL</Label>
            <Input
              id="repoUrl"
              type="url"
              value={formData.repoUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, repoUrl: e.target.value }))}
              placeholder="https://github.com/user/repo"
            />
          </div>
        </div>
      </div>

      {/* AI Hint */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Additional Information</h3>
        <div>
          <Label htmlFor="dataAiHint">AI Hint</Label>
          <Textarea
            id="dataAiHint"
            value={formData.dataAiHint}
            onChange={(e) => setFormData(prev => ({ ...prev, dataAiHint: e.target.value }))}
            rows={2}
            placeholder="Additional context for AI processing..."
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
