
"use client";

import * as React from 'react';
import type { Skill as LibSkillType } from '@/lib/types';
import type { SkillAdminFormData } from '@/lib/adminSchemas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { skillAdminSchema } from '@/lib/adminSchemas';
import { saveSkillAction, deleteSkillAction } from '@/actions/admin/skillsActions';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Pencil, Trash2, PlusCircle, Package, Loader2 } from 'lucide-react';
import { lucideIconsMap, skillCategories, commonSkillNamesTuple } from '@/lib/data';

interface SkillsListProps {
  initialSkills: LibSkillType[];
}

function SkillForm({ skill, onFormSubmit, onCancel }: { skill?: LibSkillType | null; onFormSubmit: (values: LibSkillType) => void, onCancel: () => void }) {
  const form = useForm<SkillAdminFormData>({
    resolver: zodResolver(skillAdminSchema),
    defaultValues: {
      id: skill?.id || undefined,
      name: skill?.name || '',
      category: skill?.category || 'Languages',
      proficiency: skill?.proficiency ?? undefined,
    },
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { toast } = useToast();
  
  const onSubmit = async (values: SkillAdminFormData) => {
    setIsSubmitting(true);
    const formData = new FormData();
    if(values.id) formData.append('id', values.id);
    formData.append('name', values.name);
    formData.append('category', values.category);
    if (values.proficiency !== undefined && values.proficiency !== null) {
      formData.append('proficiency', String(values.proficiency));
    }
    
    // @ts-ignore - The action expects a specific prevState which we don't have here, but it's not used for this logic path.
    const result = await saveSkillAction(null, formData);
    
    if (result.status === 'success' && result.savedSkill) {
      toast({ title: 'Success!', description: result.message });
      onFormSubmit(result.savedSkill);
    } else {
      toast({ title: 'Error', description: result.message, variant: 'destructive' });
    }
    setIsSubmitting(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <DialogHeader>
          <DialogTitle>{skill ? 'Edit Skill' : 'Add New Skill'}</DialogTitle>
          <DialogDescription>
            {skill ? `Update the details for "${skill.name}".` : 'Fill in the details for the new skill.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
            <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Skill Name</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a skill" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    {commonSkillNamesTuple.map(name => (
                        <SelectItem key={name} value={name}>{name}</SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Category</FormLabel>
                 <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    {skillCategories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="proficiency"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Proficiency (0-100, optional)</FormLabel>
                <FormControl>
                    <Input 
                      type="number" 
                      placeholder="e.g., 90" 
                      {...field} 
                      value={field.value ?? ''}
                      onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                    />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save Skill'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export function SkillsList({ initialSkills }: SkillsListProps) {
  const [skills, setSkills] = React.useState(initialSkills);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingSkill, setEditingSkill] = React.useState<LibSkillType | null>(null);

  const { toast } = useToast();

  const handleEdit = (skill: LibSkillType) => {
    setEditingSkill(skill);
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingSkill(null);
    setIsDialogOpen(true);
  };

  const handleFormSubmit = (savedSkill: LibSkillType) => {
    if (editingSkill) {
      setSkills(skills.map(s => s.id === savedSkill.id ? savedSkill : s));
    } else {
      setSkills([savedSkill, ...skills]);
    }
    setIsDialogOpen(false);
    setEditingSkill(null);
  };

  const handleDelete = async (skillId: string) => {
    const result = await deleteSkillAction(skillId);
    if (result.success) {
      setSkills(skills.filter(s => s.id !== skillId));
      toast({ title: 'Success', description: result.message });
    } else {
      toast({ title: 'Error', description: result.message, variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Skill
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
            <SkillForm 
                skill={editingSkill} 
                onFormSubmit={handleFormSubmit}
                onCancel={() => setIsDialogOpen(false)}
            />
        </DialogContent>
      </Dialog>
      
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Skill</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Proficiency</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {skills.map((skill) => {
              const IconComponent = lucideIconsMap[skill.iconName] || Package;
              return (
                <TableRow key={skill.id}>
                  <TableCell className="font-medium flex items-center gap-3">
                     <IconComponent className="h-5 w-5 text-muted-foreground" />
                    <span>{skill.name}</span>
                  </TableCell>
                  <TableCell>{skill.category}</TableCell>
                  <TableCell>
                    {skill.proficiency !== undefined && skill.proficiency !== null ? (
                      <div className="flex items-center gap-2">
                        <Progress value={skill.proficiency} className="w-24 h-2" />
                        <span>{skill.proficiency}%</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(skill)}>
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                         <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                           <Trash2 className="h-4 w-4" />
                           <span className="sr-only">Delete</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the skill &quot;{skill.name}&quot;. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(skill.id)} className="bg-destructive hover:bg-destructive/90">
                            Yes, delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      {skills.length === 0 && (
         <div className="text-center py-10 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">No skills found. Click &quot;Add New Skill&quot; to get started.</p>
        </div>
      )}
    </div>
  );
}

    