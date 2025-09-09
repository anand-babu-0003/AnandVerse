"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar, 
  User, 
  Tag, 
  Search,
  Filter,
  BookOpen,
  Clock,
  TrendingUp,
  MessageSquare,
  FileText,
  Save,
  X
} from 'lucide-react';
import { 
  getBlogPostsActionOptimized, 
  getPublishedBlogPostsActionOptimized,
  getBlogCategoriesActionOptimized
} from '@/actions/admin/blogActionsOptimized';
import { 
  saveBlogPostAction,
  deleteBlogPostAction,
  saveBlogCategoryAction,
  deleteBlogCategoryAction
} from '@/actions/admin/blogActions';
import type { BlogPost, BlogCategory, BlogPostFormState, BlogCategoryFormState } from '@/actions/admin/blogActions';
import { useToast } from '@/hooks/use-toast';
import { useTransition } from 'react';

interface BlogManagementProps {}

export default function ComprehensiveBlogManagement({}: BlogManagementProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [publishedPosts, setPublishedPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  // Form states
  const [postForm, setPostForm] = useState<Partial<BlogPost>>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    author: 'Admin',
    status: 'draft',
    tags: [],
    category: 'General',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: []
  });

  const [categoryForm, setCategoryForm] = useState<Partial<BlogCategory>>({
    name: '',
    slug: '',
    description: '',
    color: '#3B82F6'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [allPosts, published, allCategories] = await Promise.all([
        getBlogPostsActionOptimized(),
        getPublishedBlogPostsActionOptimized(),
        getBlogCategoriesActionOptimized()
      ]);
      
      setPosts(allPosts);
      setPublishedPosts(published);
      setCategories(allCategories);
    } catch (error) {
      console.error('Error loading blog data:', error);
      toast({
        title: "Error",
        description: "Failed to load blog data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSavePost = async () => {
    if (!postForm.title || !postForm.slug) {
      toast({
        title: "Error",
        description: "Title and slug are required",
        variant: "destructive"
      });
      return;
    }

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append('id', selectedPost?.id || '');
        formData.append('title', postForm.title || '');
        formData.append('slug', postForm.slug || '');
        formData.append('excerpt', postForm.excerpt || '');
        formData.append('content', postForm.content || '');
        formData.append('featuredImage', postForm.featuredImage || '');
        formData.append('author', postForm.author || 'Admin');
        formData.append('status', postForm.status || 'draft');
        formData.append('tagsString', (postForm.tags || []).join(', '));
        formData.append('category', postForm.category || 'General');
        formData.append('seoTitle', postForm.seoTitle || '');
        formData.append('seoDescription', postForm.seoDescription || '');
        formData.append('seoKeywordsString', (postForm.seoKeywords || []).join(', '));

        const result = await saveBlogPostAction({ message: '', status: 'idle' }, formData);
        
        if (result.status === 'success') {
          toast({
            title: "Success",
            description: result.message
          });
          setIsEditDialogOpen(false);
          setSelectedPost(null);
          loadData();
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
          description: "Failed to save blog post",
          variant: "destructive"
        });
      }
    });
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    try {
      const result = await deleteBlogPostAction(postId);
      if (result.success) {
        toast({
          title: "Success",
          description: result.message
        });
        loadData();
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
        description: "Failed to delete blog post",
        variant: "destructive"
      });
    }
  };

  const handleSaveCategory = async () => {
    if (!categoryForm.name || !categoryForm.slug) {
      toast({
        title: "Error",
        description: "Name and slug are required",
        variant: "destructive"
      });
      return;
    }

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append('id', '');
        formData.append('name', categoryForm.name || '');
        formData.append('slug', categoryForm.slug || '');
        formData.append('description', categoryForm.description || '');
        formData.append('color', categoryForm.color || '#3B82F6');

        const result = await saveBlogCategoryAction({ message: '', status: 'idle' }, formData);
        
        if (result.status === 'success') {
          toast({
            title: "Success",
            description: result.message
          });
          setIsCategoryDialogOpen(false);
          setCategoryForm({ name: '', slug: '', description: '', color: '#3B82F6' });
          loadData();
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
          description: "Failed to save category",
          variant: "destructive"
        });
      }
    });
  };

  const openEditDialog = (post?: BlogPost) => {
    if (post) {
      setSelectedPost(post);
      setPostForm({
        ...post,
        tags: post.tags || [],
        seoKeywords: post.seoKeywords || []
      });
    } else {
      setSelectedPost(null);
      setPostForm({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        featuredImage: '',
        author: 'Admin',
        status: 'draft',
        tags: [],
        category: 'General',
        seoTitle: '',
        seoDescription: '',
        seoKeywords: []
      });
    }
    setIsEditDialogOpen(true);
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || post.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading blog data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Blog Management</h1>
          <p className="text-muted-foreground">Manage your blog posts and categories</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => openEditDialog()}>
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
          <Button variant="outline" onClick={() => setIsCategoryDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Category
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{posts.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publishedPosts.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{posts.filter(p => p.status === 'draft').length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
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
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Posts List */}
      <Card>
        <CardHeader>
          <CardTitle>Blog Posts ({filteredPosts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{post.title}</h3>
                      <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                        {post.status}
                      </Badge>
                      <Badge variant="outline">{post.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {post.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readTime} min read
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(post)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer">
                        <Eye className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDeletePost(post.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No blog posts found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Post Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedPost ? 'Edit Blog Post' : 'Create New Blog Post'}
            </DialogTitle>
            <DialogDescription>
              {selectedPost ? 'Update your blog post details' : 'Create a new blog post'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Title *</label>
                <Input
                  value={postForm.title}
                  onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                  placeholder="Enter post title"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Slug *</label>
                <Input
                  value={postForm.slug}
                  onChange={(e) => setPostForm({ ...postForm, slug: e.target.value })}
                  placeholder="post-slug"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Excerpt</label>
              <Textarea
                value={postForm.excerpt}
                onChange={(e) => setPostForm({ ...postForm, excerpt: e.target.value })}
                placeholder="Brief description of the post"
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Content</label>
              <Textarea
                value={postForm.content}
                onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                placeholder="Write your blog post content here..."
                rows={10}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Featured Image URL</label>
                <Input
                  value={postForm.featuredImage}
                  onChange={(e) => setPostForm({ ...postForm, featuredImage: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Author</label>
                <Input
                  value={postForm.author}
                  onChange={(e) => setPostForm({ ...postForm, author: e.target.value })}
                  placeholder="Author name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Status</label>
                <Select value={postForm.status} onValueChange={(value: any) => setPostForm({ ...postForm, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <Select value={postForm.category} onValueChange={(value) => setPostForm({ ...postForm, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Tags (comma-separated)</label>
              <Input
                value={(postForm.tags || []).join(', ')}
                onChange={(e) => setPostForm({ ...postForm, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                placeholder="react, nextjs, typescript"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">SEO Title</label>
                <Input
                  value={postForm.seoTitle}
                  onChange={(e) => setPostForm({ ...postForm, seoTitle: e.target.value })}
                  placeholder="SEO optimized title"
                />
              </div>
              <div>
                <label className="text-sm font-medium">SEO Keywords (comma-separated)</label>
                <Input
                  value={(postForm.seoKeywords || []).join(', ')}
                  onChange={(e) => setPostForm({ ...postForm, seoKeywords: e.target.value.split(',').map(k => k.trim()).filter(Boolean) })}
                  placeholder="seo, keywords, here"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">SEO Description</label>
              <Textarea
                value={postForm.seoDescription}
                onChange={(e) => setPostForm({ ...postForm, seoDescription: e.target.value })}
                placeholder="SEO optimized description"
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSavePost} disabled={isPending}>
              <Save className="h-4 w-4 mr-2" />
              {isPending ? 'Saving...' : 'Save Post'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Category Dialog */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
            <DialogDescription>Add a new blog category</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name *</label>
              <Input
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                placeholder="Category name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Slug *</label>
              <Input
                value={categoryForm.slug}
                onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                placeholder="category-slug"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={categoryForm.description}
                onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                placeholder="Category description"
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Color</label>
              <Input
                type="color"
                value={categoryForm.color}
                onChange={(e) => setCategoryForm({ ...categoryForm, color: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCategory} disabled={isPending}>
              {isPending ? 'Saving...' : 'Save Category'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
