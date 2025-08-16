
"use client";

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import type { AboutMeData } from '@/lib/types';
import { profileBioSchema, type ProfileBioData } from '@/lib/adminSchemas';
import { updateProfileBioDataAction, type UpdateProfileBioDataFormState } from '@/actions/admin/aboutActions';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Loader2, Save } from 'lucide-react';

interface ProfileBioFormProps {
  aboutMeData: AboutMeData;
}

function SubmitButton({ isPending }: { isPending: boolean }) {
  return (
    <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
      {isPending ? (
        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
      ) : (
        <><Save className="mr-2 h-4 w-4" /> Save Profile & Bio</>
      )}
    </Button>
  );
}

export function ProfileBioForm({ aboutMeData }: ProfileBioFormProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [formState, setFormState] = React.useState<UpdateProfileBioDataFormState>({ message: '', status: 'idle' });

  const form = useForm<ProfileBioData>({
    resolver: zodResolver(profileBioSchema),
    defaultValues: {
      name: aboutMeData.name || '',
      title: aboutMeData.title || '',
      bio: aboutMeData.bio || '',
      profileImage: aboutMeData.profileImage || '',
      dataAiHint: aboutMeData.dataAiHint || '',
    },
  });

  const onSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await updateProfileBioDataAction(formState, formData);
      setFormState(result);

      if (result.status === 'success') {
        toast({ title: "Success!", description: result.message });
        if (result.data) {
          form.reset(result.data);
        }
      } else if (result.status === 'error') {
        toast({ title: "Error", description: result.message, variant: "destructive" });
        if (result.errors) {
          Object.keys(result.errors).forEach((key) => {
            const field = key as keyof ProfileBioData;
            const message = result.errors?.[field]?.join(', ');
            if (message) {
              form.setError(field, { type: 'server', message });
            }
          });
        }
      }
    });
  };

  return (
    <Form {...form}>
      <form action={onSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Profile & Biography</CardTitle>
            <CardDescription>Update your personal information and the main bio displayed on the site.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl><Input placeholder="Your full name" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Professional Title</FormLabel>
                  <FormControl><Input placeholder="e.g., Full-Stack Developer" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Biography</FormLabel>
                  <FormControl><Textarea placeholder="Tell your story..." {...field} rows={6} /></FormControl>
                  <FormDescription>This text will appear on your 'About Me' page.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="profileImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Image URL</FormLabel>
                  <FormControl><Input placeholder="https://example.com/your-photo.jpg" {...field} /></FormControl>
                   <FormDescription>The main image used for your profile on the Home and About pages.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dataAiHint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Image AI Hint</FormLabel>
                  <FormControl><Input placeholder="e.g., developer portrait" {...field} /></FormControl>
                   <FormDescription>A 1-2 word hint for AI tools to understand the image content (e.g., for generating alternative images).</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="border-t px-6 py-4 flex justify-end">
            <SubmitButton isPending={isPending} />
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
