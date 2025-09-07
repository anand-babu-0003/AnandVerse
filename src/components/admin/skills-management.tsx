"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { 
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  Search,
  Code,
  Award,
  TrendingUp,
  Save,
  X,
  Star,
  Zap,
  Shield,
  Users,
  Target
} from 'lucide-react';
import { useSkillsData } from '@/hooks/useFirestoreData';
import { saveSkillAction, deleteSkillAction } from '@/actions/admin/skillsActions';
import { useToast } from '@/hooks/use-toast';
import type { Skill } from '@/lib/types';

const SKILL_CATEGORIES = [
  'Languages',
  'Frontend',
  'Backend',
  'DevOps',
  'Tools',
  'Other'
] as const;

const SKILL_ICONS = [
  'Code', 'Star', 'Zap', 'Shield', 'Users', 'Target', 'Award', 'TrendingUp'
] as const;

export default function SkillsManagement() {
  const { skills, isLoading, error, refetch } = useSkillsData();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || skill.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (skillId: string) => {
    if (confirm('Are you sure you want to delete this skill?')) {
      try {
        const result = await deleteSkillAction(skillId);
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
          description: "Failed to delete skill",
          variant: "destructive",
        });
      }
    }
  };

  const handleSave = async (skill: Partial<Skill>) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      if (skill.id) formData.append('id', skill.id);
      formData.append('name', skill.name || '');
      formData.append('category', skill.category || 'Other');
      formData.append('proficiency', skill.proficiency?.toString() || '');

      const result = await saveSkillAction({ message: '', status: 'idle' }, formData);
      
      if (result.status === 'success') {
        toast({
          title: "Success",
          description: result.message,
        });
        setIsAddDialogOpen(false);
        setIsEditDialogOpen(false);
        setEditingSkill(null);
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
        description: "Failed to save skill",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate statistics
  const categoryStats = SKILL_CATEGORIES.map(category => ({
    category,
    count: skills.filter(skill => skill.category === category).length
  }));

  const averageProficiency = skills.length > 0 
    ? Math.round(skills.reduce((sum, skill) => sum + (skill.proficiency || 0), 0) / skills.length)
    : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading skills...</p>
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
          <h2 className="text-2xl font-bold">Skills Management</h2>
          <p className="text-muted-foreground">
            Manage your technical skills and proficiency levels
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
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
            <SkillForm 
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
            placeholder="Search skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {SKILL_CATEGORIES.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Skills</p>
                <p className="text-2xl font-bold">{skills.length}</p>
              </div>
              <Code className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Categories</p>
                <p className="text-2xl font-bold">{categoryStats.filter(stat => stat.count > 0).length}</p>
              </div>
              <Award className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Proficiency</p>
                <p className="text-2xl font-bold">{averageProficiency}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Expert Level</p>
                <p className="text-2xl font-bold">
                  {skills.filter(skill => (skill.proficiency || 0) >= 90).length}
                </p>
              </div>
              <Star className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Skills by Category</CardTitle>
          <CardDescription>Distribution of skills across different categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categoryStats.map(({ category, count }) => (
              <div key={category} className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-sm text-muted-foreground">{category}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSkills.map((skill) => (
          <Card key={skill.id} className="group hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Code className="h-6 w-6 text-primary" />
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
                    <DropdownMenuItem onClick={() => handleEdit(skill)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDelete(skill.id)}
                      className="text-destructive"
                    >
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
                    <span className="font-medium">{skill.proficiency}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${skill.proficiency}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Beginner</span>
                    <span>Expert</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Skill</DialogTitle>
            <DialogDescription>
              Update the skill details and proficiency level.
            </DialogDescription>
          </DialogHeader>
          {editingSkill && (
            <SkillForm 
              skill={editingSkill}
              onSubmit={handleSave}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setEditingSkill(null);
              }}
              isSubmitting={isSubmitting}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface SkillFormProps {
  skill?: Skill;
  onSubmit: (skill: Partial<Skill>) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

function SkillForm({ skill, onSubmit, onCancel, isSubmitting = false }: SkillFormProps) {
  const [formData, setFormData] = useState({
    name: skill?.name || '',
    category: skill?.category || 'Other',
    iconName: skill?.iconName || 'Code',
    proficiency: skill?.proficiency || 50,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Skill Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="e.g., React, Python, Docker"
          required
        />
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SKILL_CATEGORIES.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="iconName">Icon</Label>
        <Select value={formData.iconName} onValueChange={(value) => setFormData(prev => ({ ...prev, iconName: value }))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SKILL_ICONS.map(icon => (
              <SelectItem key={icon} value={icon}>{icon}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="proficiency">Proficiency Level: {formData.proficiency}%</Label>
        <div className="mt-2">
          <Slider
            value={[formData.proficiency]}
            onValueChange={(value) => setFormData(prev => ({ ...prev, proficiency: value[0] }))}
            max={100}
            min={0}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Beginner (0%)</span>
            <span>Intermediate (50%)</span>
            <span>Expert (100%)</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
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
