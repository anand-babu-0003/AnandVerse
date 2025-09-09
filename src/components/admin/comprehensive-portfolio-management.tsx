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
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  // Form state
  const [itemForm, setItemForm] = useState<Partial<PortfolioItem>>({
    title: '',
    description: '',
    longDescription: '',
    imageUrl: '',
    liveUrl: '',
    githubUrl: '',
    technologies: [],
    category: 'Web Development',
    status: 'published',
    featured: false,
    order: 0
  });

  useEffect(() => {
    loadPortfolioItems();
  }, []);

  const loadPortfolioItems = async () => {
    try {
      setLoading(true);
      const items = await fetchAllPortfolioItems();
      setPortfolioItems(items);
    } catch (error) {
      console.error('Error loading portfolio items:', error);
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
        const formData = new FormData();
        formData.append('id', selectedItem?.id || '');
        formData.append('title', itemForm.title || '');
        formData.append('description', itemForm.description || '');
        formData.append('longDescription', itemForm.longDescription || '');
        formData.append('imageUrl', itemForm.imageUrl || '');
        formData.append('liveUrl', itemForm.liveUrl || '');
        formData.append('githubUrl', itemForm.githubUrl || '');
        formData.append('technologiesString', (itemForm.technologies || []).join(', '));
        formData.append('category', itemForm.category || 'Web Development');
        formData.append('status', itemForm.status || 'published');
        formData.append('featured', itemForm.featured ? 'on' : '');
        formData.append('order', String(itemForm.order || 0));

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
          toast({
            title: "Error",
            description: result.message,
            variant: "destructive"
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to save portfolio item",
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
        ...item,
        technologies: item.technologies || []
      });
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
        category: 'Web Development',
        status: 'published',
        featured: false,
        order: 0
      });
    }
    setIsEditDialogOpen(true);
  };

  const categories = Array.from(new Set(portfolioItems.map(item => item.category)));
  const filteredItems = portfolioItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portfolioItems.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portfolioItems.filter(p => p.status === 'published').length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Featured</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portfolioItems.filter(p => p.featured).length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Code className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
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
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="relative aspect-video">
                <img
                  src={item.imageUrl || 'https://placehold.co/400x300.png?text=Project'}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                {item.featured && (
                  <Badge className="absolute top-2 left-2 bg-yellow-500">
                    <Star className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                )}
                <Badge 
                  variant={item.status === 'published' ? 'default' : 'secondary'}
                  className="absolute top-2 right-2"
                >
                  {item.status}
                </Badge>
              </div>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg line-clamp-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {item.technologies.slice(0, 3).map((tech) => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {item.technologies.length > 3 && (
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
              <div>
                <label className="text-sm font-medium">Category</label>
                <Select value={itemForm.category} onValueChange={(value) => setItemForm({ ...itemForm, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Web Development">Web Development</SelectItem>
                    <SelectItem value="Mobile Development">Mobile Development</SelectItem>
                    <SelectItem value="Desktop Application">Desktop Application</SelectItem>
                    <SelectItem value="UI/UX Design">UI/UX Design</SelectItem>
                    <SelectItem value="Data Science">Data Science</SelectItem>
                    <SelectItem value="Machine Learning">Machine Learning</SelectItem>
                    <SelectItem value="DevOps">DevOps</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
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
                  value={(itemForm.technologies || []).join(', ')}
                  onChange={(e) => setItemForm({ ...itemForm, technologies: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
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
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <label className="text-sm font-medium">GitHub URL</label>
                <Input
                  value={itemForm.githubUrl}
                  onChange={(e) => setItemForm({ ...itemForm, githubUrl: e.target.value })}
                  placeholder="https://github.com/username/repo"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Status</label>
                <Select value={itemForm.status} onValueChange={(value: any) => setItemForm({ ...itemForm, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Order</label>
                <Input
                  type="number"
                  value={itemForm.order}
                  onChange={(e) => setItemForm({ ...itemForm, order: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={itemForm.featured}
                  onChange={(e) => setItemForm({ ...itemForm, featured: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="featured" className="text-sm font-medium">Featured</label>
              </div>
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
