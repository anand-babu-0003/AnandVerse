
"use client";

import * as React from 'react';
import { useForm, useFieldArray, type FieldArrayWithId } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import type { Education } from '@/lib/types';
import { educationSectionSchema, type EducationSectionData } from '@/lib/adminSchemas';
import { updateEducationDataAction, type UpdateEducationDataFormState } from '@/actions/admin/aboutActions';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Loader2, Save, Trash2, PlusCircle } from 'lucide-react';

interface EducationFormProps {
  education: Education[];
}

const initialState: UpdateEducationDataFormState = { message: '', status: 'idle', data: { education: [] } };

function SubmitButton({ isPending }: { isPending: boolean }) {
  return (
    <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
      {isPending ? (
        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
      ) : (
        <><Save className="mr-2 h-4 w-4" /> Save Education</>
      )}
    </Button>
  );
}

export function EducationForm({ education: initialEducation }: EducationFormProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [formState, setFormState] = React.useState<UpdateEducationDataFormState>(initialState);

  const form = useForm<EducationSectionData>({
    resolver: zodResolver(educationSectionSchema),
    defaultValues: {
      education: initialEducation || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "education",
  });

  const addNewEducation = () => {
    append({
      id: `new_edu_${fields.length}_${Date.now()}`,
      degree: '',
      institution: '',
      period: '',
    });
  };

  const onSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await updateEducationDataAction(formState, formData);
      setFormState(result);
      if (result.status === 'success') {
        toast({ title: "Success!", description: result.message });
        if (result.data?.education) {
          form.reset({ education: result.data.education });
        }
      } else if (result.status === 'error') {
        toast({ title: "Error", description: result.message, variant: "destructive" });
      }
    });
  };

  return (
    <Form {...form}>
      <form action={onSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Education</CardTitle>
            <CardDescription>Manage your academic background. Add, edit, or remove educational qualifications.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {fields.map((field: FieldArrayWithId<EducationSectionData, "education", "id">, index: number) => (
              <div key={field.id} className="space-y-4 p-4 border rounded-md relative">
                <input type="hidden" {...form.register(`education.${index}.id`)} />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`education.${index}.degree`}
                      render={({ field: formField }) => (
                        <FormItem>
                          <FormLabel>Degree / Certificate</FormLabel>
                          <FormControl><Input placeholder="e.g., M.S. in Computer Science" {...formField} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`education.${index}.institution`}
                      render={({ field: formField }) => (
                        <FormItem>
                          <FormLabel>Institution</FormLabel>
                          <FormControl><Input placeholder="e.g., Tech University" {...formField} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
                 <FormField
                  control={form.control}
                  name={`education.${index}.period`}
                  render={({ field: formField }) => (
                    <FormItem>
                      <FormLabel>Period</FormLabel>
                      <FormControl><Input placeholder="e.g., 2018 - 2020" {...formField} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="button" variant="destructive" size="sm" className="absolute top-2 right-2" onClick={() => remove(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addNewEducation}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Education
            </Button>
          </CardContent>
          <CardFooter className="border-t px-6 py-4 flex justify-end">
            <SubmitButton isPending={isPending} />
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
