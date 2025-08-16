
"use client";

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormState, useFormStatus } from 'react-dom';
import type { AboutMeData } from '@/lib/types';
import { aboutMeSchema } from '@/lib/adminSchemas';
import { updateAboutDataAction, type UpdateAboutDataFormState } from '@/actions/admin/aboutActions';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Loader2, Save, Mail, Linkedin, Github, Twitter } from 'lucide-react';

type ContactSocialsFormData = Pick<AboutMeData, 'email' | 'linkedinUrl' | 'githubUrl' | 'twitterUrl'>;

const contactSocialsSchema = aboutMeSchema.pick({
  email: true,
  linkedinUrl: true,
  githubUrl: true,
  twitterUrl: true,
});

interface ContactSocialsFormProps {
  aboutMeData: AboutMeData;
}

const initialState: UpdateAboutDataFormState = { message: '', status: 'idle' };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
      ) : (
        <><Save className="mr-2 h-4 w-4" /> Save Contact Info</>
      )}
    </Button>
  );
}

export function ContactSocialsForm({ aboutMeData }: ContactSocialsFormProps) {
  const { toast } = useToast();
  const [formState, formAction] = useFormState(updateAboutDataAction, initialState);

  const form = useForm<ContactSocialsFormData>({
    resolver: zodResolver(contactSocialsSchema),
    defaultValues: {
      email: aboutMeData.email || '',
      linkedinUrl: aboutMeData.linkedinUrl || '',
      githubUrl: aboutMeData.githubUrl || '',
      twitterUrl: aboutMeData.twitterUrl || '',
    },
  });

  React.useEffect(() => {
    if (formState.status === 'success' && formState.data) {
      toast({ title: "Success!", description: formState.message });
      form.reset({
        email: formState.data.email || '',
        linkedinUrl: formState.data.linkedinUrl || '',
        githubUrl: formState.data.githubUrl || '',
        twitterUrl: formState.data.twitterUrl || '',
      });
    } else if (formState.status === 'error') {
      toast({ title: "Error", description: formState.message, variant: "destructive" });
    }
  }, [formState, toast, form]);

  return (
    <Form {...form}>
      <form action={formAction}>
        <Card>
          <CardHeader>
            <CardTitle>Contact & Social Media</CardTitle>
            <CardDescription>Update your public contact email and social media links.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><Mail className="mr-2 h-4 w-4" /> Email</FormLabel>
                  <FormControl><Input placeholder="your.email@example.com" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="linkedinUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><Linkedin className="mr-2 h-4 w-4" /> LinkedIn URL</FormLabel>
                  <FormControl><Input placeholder="https://linkedin.com/in/yourprofile" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="githubUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><Github className="mr-2 h-4 w-4" /> GitHub URL</FormLabel>
                  <FormControl><Input placeholder="https://github.com/yourusername" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="twitterUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><Twitter className="mr-2 h-4 w-4" /> Twitter (X) URL</FormLabel>
                  <FormControl><Input placeholder="https://twitter.com/yourusername" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="border-t px-6 py-4 flex justify-end">
            <SubmitButton />
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
