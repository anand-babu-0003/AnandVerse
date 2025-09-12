"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  ExternalLink,
  Search,
  Filter,
  Briefcase,
  Calendar,
  Star,
  Code,
  Image,
  Save,
  X,
  Globe,
  Github,
  Play
} from 'lucide-react';
import { fetchAllPortfolioItems } from '@/actions/fetchAllDataAction';
import { savePortfolioItemAction, deletePortfolioItemAction } from '@/actions/admin/portfolioActions';
import type { PortfolioItem } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useTransition } from 'react';

interface PortfolioManagementProps {}

export default function ComprehensivePortfolioManagement({}: PortfolioManagementProps) {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  // Form state - ensure all fields have default values to prevent controlled/uncontrolled input errors
  const [itemForm, setItemForm] = useState({
    title: '',
    description: '',
    longDescription: '',
    imageUrl: '',
    liveUrl: '',
    githubUrl: '',
    technologies: [] as string[],
    slug: '',
    dataAiHint: '',
    readmeContent: ''
  });

  // Separate state for technologies input to allow typing commas and spaces
  const [technologiesInput, setTechnologiesInput] = useState('');

  // Function to process technologies input
  const processTechnologies = () => {
    const technologies = technologiesInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);
    setItemForm({ ...itemForm, technologies });
  };

  useEffect(() => {
    loadPortfolioItems();
  }, []);

  const loadPortfolioItems = async () => {
    try {
      setLoading(true);
      const items = await fetchAllPortfolioItems();
      // Ensure items is an array and each item has required properties
      const safeItems = Array.isArray(items) ? items.map(item => ({
        ...item,
        technologies: Array.isArray(item.technologies) ? item.technologies : [],
        status: item.status || 'draft',
        featured: Boolean(item.featured),
        order: Number(item.order) || 0
      })) : [];
      setPortfolioItems(safeItems);
    } catch (error) {
      console.error('Error loading portfolio items:', error);
      setPortfolioItems([]); // Set empty array on error
      toast({
        title: "Error",
        description: "Failed to load portfolio items",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveItem = async () => {
    if (!itemForm.title || !itemForm.description) {
      toast({
        title: "Error",
        description: "Title and description are required",
        variant: "destructive"
      });
      return;
    }

    startTransition(async () => {
      try {
        // Generate slug if not provided
        const generatedSlug = itemForm.slug || itemForm.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || '';
        
        // Validate slug format
        const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
        if (!slugRegex.test(generatedSlug)) {
          toast({
            title: "Error",
            description: "Invalid slug format. Slug must contain only lowercase letters, numbers, and hyphens.",
            variant: "destructive"
          });
          return;
        }

        const formData = new FormData();
        formData.append('id', selectedItem?.id || '');
        formData.append('title', itemForm.title || '');
        formData.append('description', itemForm.description || '');
        formData.append('longDescription', itemForm.longDescription || '');
        formData.append('image1', itemForm.imageUrl || '');
        formData.append('image2', ''); // Second image field
        formData.append('tagsString', technologiesInput);
        formData.append('liveUrl', itemForm.liveUrl || '');
        formData.append('repoUrl', itemForm.githubUrl || '');
        formData.append('slug', generatedSlug);
        formData.append('dataAiHint', itemForm.dataAiHint || itemForm.title || '');
        formData.append('readmeContent', itemForm.readmeContent || itemForm.longDescription || '');

        const result = await savePortfolioItemAction({ message: '', status: 'idle' }, formData);
        
        if (result.status === 'success') {
          toast({
            title: "Success",
            description: result.message
          });
          setIsEditDialogOpen(false);
          setSelectedItem(null);
          loadPortfolioItems();
        } else {
          console.error('Portfolio save error:', result);
          
          // Show detailed error messages
          let errorMessage = result.message || "Failed to save project";
          
          // Add field-specific errors to the main error message
          if (result.errors) {
            const fieldErrors = Object.entries(result.errors)
              .filter(([_, errors]) => errors && errors.length > 0)
              .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
              .join('\n');
            
            if (fieldErrors) {
              errorMessage += `\n\nValidation errors:\n${fieldErrors}`;
              console.error('Field validation errors:', fieldErrors);
            }
          }
          
          toast({
            title: "Error Saving Project",
            description: errorMessage,
            variant: "destructive",
            duration: 8000 // Show longer for detailed errors
          });
        }
      } catch (error) {
        console.error('Portfolio save exception:', error);
        toast({
          title: "Error",
          description: `Failed to save portfolio item: ${error instanceof Error ? error.message : 'Unknown error'}`,
          variant: "destructive"
        });
      }
    });
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this portfolio item?')) return;

    try {
      const result = await deletePortfolioItemAction(itemId);
      if (result.success) {
        toast({
          title: "Success",
          description: result.message
        });
        loadPortfolioItems();
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete portfolio item",
        variant: "destructive"
      });
    }
  };

  const openEditDialog = (item?: PortfolioItem) => {
    if (item) {
      setSelectedItem(item);
      setItemForm({
        title: item.title || '',
        description: item.description || '',
        longDescription: item.longDescription || '',
        imageUrl: item.imageUrl || '',
        liveUrl: item.liveUrl || '',
        githubUrl: item.githubUrl || '',
        technologies: item.technologies || [],
        slug: item.slug || item.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || '',
        dataAiHint: item.dataAiHint || item.title || '',
        readmeContent: item.readmeContent || item.longDescription || ''
      });
      setTechnologiesInput((item.technologies || []).join(', '));
    } else {
      setSelectedItem(null);
      setItemForm({
        title: '',
        description: '',
        longDescription: '',
        imageUrl: '',
        liveUrl: '',
        githubUrl: '',
        technologies: [],
        slug: '',
        dataAiHint: '',
        readmeContent: ''
      });
      setTechnologiesInput('');
    }
    setIsEditDialogOpen(true);
  };

  const filteredItems = (portfolioItems || []).filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.technologies && Array.isArray(item.technologies) && item.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase())));
    
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading portfolio items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Portfolio Management</h1>
          <p className="text-muted-foreground">Manage your portfolio projects and showcase your work</p>
        </div>
        <Button onClick={() => openEditDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portfolioItems?.length || 0}</div>
          </CardContent>
        </Card>


      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.length > 0 ? (
          filteredItems.map((item, index) => (
            <Card key={item.id || `portfolio-item-${index}`} className="overflow-hidden">
              <div className="relative aspect-video">
                <img
                  src={item.images?.[0] || 'https://placehold.co/400x300.png?text=Project'}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg line-clamp-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {item.technologies && Array.isArray(item.technologies) && item.technologies.slice(0, 3).map((tech, techIndex) => (
                      <Badge key={`${item.id || 'item'}-tech-${techIndex}-${tech}`} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {item.technologies && Array.isArray(item.technologies) && item.technologies.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{item.technologies.length - 3} more
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {item.liveUrl && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={item.liveUrl} target="_blank" rel="noopener noreferrer">
                          <Globe className="h-3 w-3 mr-1" />
                          Live
                        </a>
                      </Button>
                    )}
                    {item.githubUrl && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={item.githubUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="h-3 w-3 mr-1" />
                          Code
                        </a>
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t">
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(item)}>
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a href={`/portfolio/${item.slug}`} target="_blank" rel="noopener noreferrer">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </a>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No portfolio items found</p>
          </div>
        )}
      </div>

      {/* Edit Item Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedItem ? 'Edit Portfolio Item' : 'Create New Portfolio Item'}
            </DialogTitle>
            <DialogDescription>
              {selectedItem ? 'Update your portfolio item details' : 'Add a new project to your portfolio'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Title *</label>
                <Input
                  value={itemForm.title}
                  onChange={(e) => setItemForm({ ...itemForm, title: e.target.value })}
                  placeholder="Project title"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Description *</label>
              <Textarea
                value={itemForm.description}
                onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                placeholder="Brief project description"
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Long Description</label>
              <Textarea
                value={itemForm.longDescription}
                onChange={(e) => setItemForm({ ...itemForm, longDescription: e.target.value })}
                placeholder="Detailed project description"
                rows={5}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Image URL</label>
                <Input
                  value={itemForm.imageUrl}
                  onChange={(e) => setItemForm({ ...itemForm, imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Technologies (comma-separated)</label>
                <Input
                  value={technologiesInput}
                  onChange={(e) => setTechnologiesInput(e.target.value)}
                  onBlur={processTechnologies}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      processTechnologies();
                    }
                  }}
                  placeholder="React, TypeScript, Node.js"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Live URL</label>
                <Input
                  value={itemForm.liveUrl}
                  onChange={(e) => setItemForm({ ...itemForm, liveUrl: e.target.value })}
                  placeholder="https://example.com or example.com"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter the full URL (https://example.com) or just the domain (example.com)
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">GitHub URL</label>
                <Input
                  value={itemForm.githubUrl}
                  onChange={(e) => setItemForm({ ...itemForm, githubUrl: e.target.value })}
                  placeholder="https://github.com/username/repo"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter the full GitHub repository URL
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Slug</label>
                <Input
                  value={itemForm.slug}
                  onChange={(e) => setItemForm({ ...itemForm, slug: e.target.value })}
                  placeholder="my-awesome-project"
                />
              </div>
              <div>
                <label className="text-sm font-medium">AI Hint (for content generation)</label>
                <Input
                  value={itemForm.dataAiHint}
                  onChange={(e) => setItemForm({ ...itemForm, dataAiHint: e.target.value })}
                  placeholder="e.g., 'a modern e-commerce platform'"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">README Content (Markdown)</label>
              <Textarea
                value={itemForm.readmeContent}
                onChange={(e) => setItemForm({ ...itemForm, readmeContent: e.target.value })}
                placeholder="## Project Overview\n\nThis project..."
                rows={8}
              />
            </div>

          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSaveItem} disabled={isPending}>
              <Save className="h-4 w-4 mr-2" />
              {isPending ? 'Saving...' : 'Save Item'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
