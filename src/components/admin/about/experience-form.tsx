
"use client";

import * as React from 'react';
import { useForm, useFieldArray, type FieldArrayWithId } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormState, useFormStatus } from 'react-dom';
import type { Experience } from '@/lib/types';
import { experienceSectionSchema, type ExperienceSectionData } from '@/lib/adminSchemas';
import { updateExperienceDataAction, type UpdateExperienceDataFormState } from '@/actions/admin/aboutActions';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Loader2, Save, Trash2, PlusCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface ExperienceFormProps {
  experience: Experience[];
}

const initialState: UpdateExperienceDataFormState = { message: '', status: 'idle', data: { experience: [] } };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
      ) : (
        <><Save className="mr-2 h-4 w-4" /> Save Experience</>
      )}
    </Button>
  );
}

export function ExperienceForm({ experience: initialExperience }: ExperienceFormProps) {
  const { toast } = useToast();
  const [formState, formAction] = useFormState(updateExperienceDataAction, initialState);

  const form = useForm<ExperienceSectionData>({
    resolver: zodResolver(experienceSectionSchema),
    defaultValues: {
      experience: initialExperience || [],
    },
  });
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "experience",
  });

  const addNewExperience = () => {
    append({
      id: `new_exp_${fields.length}_${Date.now()}`,
      role: '',
      company: '',
      period: '',
      description: '',
    });
  };

  React.useEffect(() => {
    if (formState.status === 'success') {
      toast({ title: "Success!", description: formState.message });
      if (formState.data?.experience) {
        form.reset({ experience: formState.data.experience });
      }
    } else if (formState.status === 'error') {
      toast({ title: "Error", description: formState.message, variant: "destructive" });
    }
  }, [formState, toast, form]);

  return (
    <Form {...form}>
       <form action={formAction}>
        <Card>
          <CardHeader>
            <CardTitle>Work Experience</CardTitle>
            <CardDescription>Manage your professional journey. Add, edit, or remove work experiences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {fields.map((field: FieldArrayWithId<ExperienceSectionData, "experience", "id">, index: number) => (
              <div key={field.id} className="space-y-4 p-4 border rounded-md relative">
                 <input type="hidden" {...form.register(`experience.${index}.id`)} />
                 
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`experience.${index}.role`}
                      render={({ field: formField }) => (
                        <FormItem>
                          <FormLabel>Role / Title</FormLabel>
                          <FormControl><Input placeholder="e.g., Senior Developer" {...formField} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name={`experience.${index}.company`}
                      render={({ field: formField }) => (
                        <FormItem>
                          <FormLabel>Company</FormLabel>
                          <FormControl><Input placeholder="e.g., Tech Solutions Inc." {...formField} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
                 <FormField
                  control={form.control}
                  name={`experience.${index}.period`}
                  render={({ field: formField }) => (
                    <FormItem>
                      <FormLabel>Period</FormLabel>
                      <FormControl><Input placeholder="e.g., 2022 - Present" {...formField} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name={`experience.${index}.description`}
                  render={({ field: formField }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl><Textarea placeholder="Describe your responsibilities and achievements..." {...formField} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="button" variant="destructive" size="sm" className="absolute top-2 right-2" onClick={() => remove(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
             <Button type="button" variant="outline" size="sm" onClick={addNewExperience}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Experience
            </Button>
          </CardContent>
          <CardFooter className="border-t px-6 py-4 flex justify-end">
            <SubmitButton />
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
