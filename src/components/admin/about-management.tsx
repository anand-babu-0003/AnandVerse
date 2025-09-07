"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
  Mail,
  Linkedin,
  Github,
  Twitter,
  MapPin,
  Phone,
  Calendar,
  Briefcase,
  GraduationCap,
  Image as ImageIcon,
  Link as LinkIcon,
  Upload,
  Eye,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAboutMeData } from '@/hooks/useFirestoreData';
import { 
  updateProfileBioDataAction, 
  updateExperienceDataAction, 
  updateEducationDataAction,
  updateAboutDataAction 
} from '@/actions/admin/aboutActions';
import { useToast } from '@/hooks/use-toast';
import type { AboutMeData, Experience, Education } from '@/lib/types';

export default function AboutManagement() {
  const { aboutMe, isLoading, error, refetch } = useAboutMeData();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isExperienceDialogOpen, setIsExperienceDialogOpen] = useState(false);
  const [isEducationDialogOpen, setIsEducationDialogOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async (data: Partial<AboutMeData>) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', data.name || '');
      formData.append('title', data.title || '');
      formData.append('bio', data.bio || '');
      formData.append('email', data.email || '');
      formData.append('linkedinUrl', data.linkedinUrl || '');
      formData.append('githubUrl', data.githubUrl || '');
      formData.append('twitterUrl', data.twitterUrl || '');
      formData.append('profileImage', data.profileImage || '');
      formData.append('dataAiHint', data.dataAiHint || '');

      const result = await updateProfileBioDataAction({ message: '', status: 'idle' }, formData);
      
      if (result.status === 'success') {
        toast({
          title: "Success",
          description: result.message,
        });
        setIsEditing(false);
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
        description: "Failed to save about me data",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddExperience = () => {
    setEditingExperience(null);
    setIsExperienceDialogOpen(true);
  };

  const handleEditExperience = (experience: Experience) => {
    setEditingExperience(experience);
    setIsExperienceDialogOpen(true);
  };

  const handleDeleteExperience = async (experienceId: string) => {
    if (confirm('Are you sure you want to delete this experience?')) {
      try {
        if (!aboutMe) return;
        
        const updatedExperience = aboutMe.experience.filter(exp => exp.id !== experienceId);
        const formData = new FormData();
        
        updatedExperience.forEach((exp, index) => {
          formData.append(`experience.${index}.id`, exp.id);
          formData.append(`experience.${index}.role`, exp.role);
          formData.append(`experience.${index}.company`, exp.company);
          formData.append(`experience.${index}.period`, exp.period);
          formData.append(`experience.${index}.description`, exp.description);
        });

        const result = await updateExperienceDataAction({ message: '', status: 'idle' }, formData);
        
        if (result.status === 'success') {
          toast({
            title: "Success",
            description: "Experience deleted successfully!",
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
          description: "Failed to delete experience",
          variant: "destructive",
        });
      }
    }
  };

  const handleAddEducation = () => {
    setEditingEducation(null);
    setIsEducationDialogOpen(true);
  };

  const handleEditEducation = (education: Education) => {
    setEditingEducation(education);
    setIsEducationDialogOpen(true);
  };

  const handleDeleteEducation = async (educationId: string) => {
    if (confirm('Are you sure you want to delete this education entry?')) {
      try {
        if (!aboutMe) return;
        
        const updatedEducation = aboutMe.education.filter(edu => edu.id !== educationId);
        const formData = new FormData();
        
        updatedEducation.forEach((edu, index) => {
          formData.append(`education.${index}.id`, edu.id);
          formData.append(`education.${index}.degree`, edu.degree);
          formData.append(`education.${index}.institution`, edu.institution);
          formData.append(`education.${index}.period`, edu.period);
        });

        const result = await updateEducationDataAction({ message: '', status: 'idle' }, formData);
        
        if (result.status === 'success') {
          toast({
            title: "Success",
            description: "Education entry deleted successfully!",
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
          description: "Failed to delete education entry",
          variant: "destructive",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading about me data...</p>
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

  if (!aboutMe) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">No about me data available</p>
          <Button onClick={() => setIsEditing(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create About Me
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">About Me Management</h2>
          <p className="text-muted-foreground">
            Manage your personal information and professional background
          </p>
        </div>
        <Button onClick={handleEdit} className="w-full sm:w-auto">
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Experience</p>
                <p className="text-2xl font-bold">{aboutMe.experience.length}</p>
              </div>
              <Briefcase className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Education</p>
                <p className="text-2xl font-bold">{aboutMe.education.length}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Social Links</p>
                <p className="text-2xl font-bold">
                  {[aboutMe.linkedinUrl, aboutMe.githubUrl, aboutMe.twitterUrl].filter(Boolean).length}
                </p>
              </div>
              <LinkIcon className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Profile Complete</p>
                <p className="text-2xl font-bold">
                  {Math.round(([
                    aboutMe.name,
                    aboutMe.title,
                    aboutMe.bio,
                    aboutMe.email,
                    aboutMe.profileImage
                  ].filter(Boolean).length / 5) * 100)}%
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList>
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="social">Social Links</TabsTrigger>
        </TabsList>

        {/* Personal Information */}
        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Your basic personal and professional details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{aboutMe.bio}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Profile Image</Label>
                <div className="mt-2">
                  {aboutMe.profileImage ? (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <img 
                        src={aboutMe.profileImage} 
                        alt="Profile" 
                        className="h-16 w-16 rounded-full object-cover flex-shrink-0"
                        data-ai-hint={aboutMe.dataAiHint}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-muted-foreground break-all">
                          {aboutMe.profileImage}
                        </p>
                        {aboutMe.dataAiHint && (
                          <p className="text-xs text-muted-foreground">
                            AI Hint: {aboutMe.dataAiHint}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">No profile image set</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Experience */}
        <TabsContent value="experience" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-lg font-semibold">Work Experience</h3>
            <Button onClick={handleAddExperience} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Experience
            </Button>
          </div>
          
          <div className="space-y-4">
            {aboutMe.experience.map((exp) => (
              <Card key={exp.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{exp.role}</h4>
                      <p className="text-primary font-medium">{exp.company}</p>
                      <p className="text-sm text-muted-foreground mb-3">{exp.period}</p>
                      <p className="text-sm text-muted-foreground">{exp.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEditExperience(exp)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-destructive"
                        onClick={() => handleDeleteExperience(exp.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Education */}
        <TabsContent value="education" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-lg font-semibold">Education</h3>
            <Button onClick={handleAddEducation} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Education
            </Button>
          </div>
          
          <div className="space-y-4">
            {aboutMe.education.map((edu) => (
              <Card key={edu.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{edu.degree}</h4>
                      <p className="text-primary font-medium">{edu.institution}</p>
                      <p className="text-sm text-muted-foreground">{edu.period}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEditEducation(edu)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-destructive"
                        onClick={() => handleDeleteEducation(edu.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Social Links */}
        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LinkIcon className="h-5 w-5" />
                Social Media Links
              </CardTitle>
              <CardDescription>
                Your social media and professional profiles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Linkedin className="h-5 w-5 text-blue-600" />
                  <div className="flex-1">
                    <Label className="text-sm font-medium">LinkedIn</Label>
                    <p className="text-sm text-muted-foreground">
                      {aboutMe.linkedinUrl ? (
                        <a href={aboutMe.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          {aboutMe.linkedinUrl}
                        </a>
                      ) : (
                        'Not provided'
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Github className="h-5 w-5 text-gray-800" />
                  <div className="flex-1">
                    <Label className="text-sm font-medium">GitHub</Label>
                    <p className="text-sm text-muted-foreground">
                      {aboutMe.githubUrl ? (
                        <a href={aboutMe.githubUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          {aboutMe.githubUrl}
                        </a>
                      ) : (
                        'Not provided'
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Twitter className="h-5 w-5 text-blue-400" />
                  <div className="flex-1">
                    <Label className="text-sm font-medium">Twitter</Label>
                    <p className="text-sm text-muted-foreground">
                      {aboutMe.twitterUrl ? (
                        <a href={aboutMe.twitterUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          {aboutMe.twitterUrl}
                        </a>
                      ) : (
                        'Not provided'
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <Label className="text-sm font-medium">Email</Label>
                    <p className="text-sm text-muted-foreground">
                      {aboutMe.email ? (
                        <a href={`mailto:${aboutMe.email}`} className="text-primary hover:underline">
                          {aboutMe.email}
                        </a>
                      ) : (
                        'Not provided'
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit About Me</DialogTitle>
            <DialogDescription>
              Update your personal information and professional details.
            </DialogDescription>
          </DialogHeader>
          <AboutMeForm 
            aboutMe={aboutMe}
            onSubmit={handleSave}
            onCancel={() => setIsEditing(false)}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Experience Dialog */}
      <Dialog open={isExperienceDialogOpen} onOpenChange={setIsExperienceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingExperience ? 'Edit Experience' : 'Add Experience'}
            </DialogTitle>
            <DialogDescription>
              {editingExperience ? 'Update the experience details.' : 'Add a new work experience.'}
            </DialogDescription>
          </DialogHeader>
          <ExperienceForm 
            experience={editingExperience}
            onSubmit={(exp) => {
              console.log('Save experience:', exp);
              setIsExperienceDialogOpen(false);
              setEditingExperience(null);
            }}
            onCancel={() => {
              setIsExperienceDialogOpen(false);
              setEditingExperience(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Education Dialog */}
      <Dialog open={isEducationDialogOpen} onOpenChange={setIsEducationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingEducation ? 'Edit Education' : 'Add Education'}
            </DialogTitle>
            <DialogDescription>
              {editingEducation ? 'Update the education details.' : 'Add a new education entry.'}
            </DialogDescription>
          </DialogHeader>
          <EducationForm 
            education={editingEducation}
            onSubmit={(edu) => {
              console.log('Save education:', edu);
              setIsEducationDialogOpen(false);
              setEditingEducation(null);
            }}
            onCancel={() => {
              setIsEducationDialogOpen(false);
              setEditingEducation(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface AboutMeFormProps {
  aboutMe: AboutMeData;
  onSubmit: (data: Partial<AboutMeData>) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

function AboutMeForm({ aboutMe, onSubmit, onCancel, isSubmitting = false }: AboutMeFormProps) {
  const [formData, setFormData] = useState({
    name: aboutMe.name,
    title: aboutMe.title,
    bio: aboutMe.bio,
    email: aboutMe.email || '',
    linkedinUrl: aboutMe.linkedinUrl || '',
    githubUrl: aboutMe.githubUrl || '',
    twitterUrl: aboutMe.twitterUrl || '',
    profileImage: aboutMe.profileImage || '',
    dataAiHint: aboutMe.dataAiHint || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
            className="w-full"
          />
        </div>
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            required
            className="w-full"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
        />
      </div>

      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
          rows={4}
          required
        />
      </div>

      <div>
        <Label htmlFor="profileImage">Profile Image URL</Label>
        <Input
          id="profileImage"
          type="url"
          value={formData.profileImage}
          onChange={(e) => setFormData(prev => ({ ...prev, profileImage: e.target.value }))}
          placeholder="https://example.com/your-photo.jpg"
        />
        {formData.profileImage && (
          <div className="mt-2">
            <img 
              src={formData.profileImage} 
              alt="Profile preview" 
              className="h-20 w-20 rounded-full object-cover border"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="dataAiHint">Profile Image AI Hint</Label>
        <Input
          id="dataAiHint"
          value={formData.dataAiHint}
          onChange={(e) => setFormData(prev => ({ ...prev, dataAiHint: e.target.value }))}
          placeholder="e.g., developer portrait"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
          <Input
            id="linkedinUrl"
            type="url"
            value={formData.linkedinUrl}
            onChange={(e) => setFormData(prev => ({ ...prev, linkedinUrl: e.target.value }))}
            placeholder="https://linkedin.com/in/username"
            className="w-full"
          />
        </div>
        <div>
          <Label htmlFor="githubUrl">GitHub URL</Label>
          <Input
            id="githubUrl"
            type="url"
            value={formData.githubUrl}
            onChange={(e) => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
            placeholder="https://github.com/username"
            className="w-full"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="twitterUrl">Twitter URL</Label>
        <Input
          id="twitterUrl"
          type="url"
          value={formData.twitterUrl}
          onChange={(e) => setFormData(prev => ({ ...prev, twitterUrl: e.target.value }))}
          placeholder="https://twitter.com/username"
        />
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting} className="w-full sm:w-auto">
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
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

interface ExperienceFormProps {
  experience?: Experience | null;
  onSubmit: (experience: Partial<Experience>) => void;
  onCancel: () => void;
}

function ExperienceForm({ experience, onSubmit, onCancel }: ExperienceFormProps) {
  const [formData, setFormData] = useState({
    role: experience?.role || '',
    company: experience?.company || '',
    period: experience?.period || '',
    description: experience?.description || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="role">Role</Label>
          <Input
            id="role"
            value={formData.role}
            onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
            required
            className="w-full"
          />
        </div>
        <div>
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            value={formData.company}
            onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
            required
            className="w-full"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="period">Period</Label>
        <Input
          id="period"
          value={formData.period}
          onChange={(e) => setFormData(prev => ({ ...prev, period: e.target.value }))}
          placeholder="e.g., Jan 2020 - Present"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
          required
        />
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button type="submit" className="w-full sm:w-auto">
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
      </div>
    </form>
  );
}

interface EducationFormProps {
  education?: Education | null;
  onSubmit: (education: Partial<Education>) => void;
  onCancel: () => void;
}

function EducationForm({ education, onSubmit, onCancel }: EducationFormProps) {
  const [formData, setFormData] = useState({
    degree: education?.degree || '',
    institution: education?.institution || '',
    period: education?.period || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="degree">Degree</Label>
        <Input
          id="degree"
          value={formData.degree}
          onChange={(e) => setFormData(prev => ({ ...prev, degree: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label htmlFor="institution">Institution</Label>
        <Input
          id="institution"
          value={formData.institution}
          onChange={(e) => setFormData(prev => ({ ...prev, institution: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label htmlFor="period">Period</Label>
        <Input
          id="period"
          value={formData.period}
          onChange={(e) => setFormData(prev => ({ ...prev, period: e.target.value }))}
          placeholder="e.g., 2018 - 2022"
          required
        />
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button type="submit" className="w-full sm:w-auto">
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
      </div>
    </form>
  );
}
