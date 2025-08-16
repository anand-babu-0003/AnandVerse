
"use client";

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import type { SiteSettings } from '@/lib/types';
import { siteSettingsAdminSchema, type SiteSettingsAdminFormData } from '@/lib/adminSchemas';
import { updateSiteSettingsAction, type UpdateSiteSettingsFormState } from '@/actions/admin/settingsActions';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Save } from 'lucide-react';

interface AdminSettingsFormProps {
  siteSettings: SiteSettings;
}

const initialState: UpdateSiteSettingsFormState = { message: '', status: 'idle' };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
      ) : (
        <><Save className="mr-2 h-4 w-4" /> Save Changes</>
      )}
    </Button>
  );
}

export default function AdminSettingsForm({ siteSettings }: AdminSettingsFormProps) {
  const { toast } = useToast();
  const [formState, formAction] = useActionState(updateSiteSettingsAction, initialState);

  const form = useForm<SiteSettingsAdminFormData>({
    resolver: zodResolver(siteSettingsAdminSchema),
    defaultValues: {
      siteName: siteSettings.siteName || '',
      defaultMetaDescription: siteSettings.defaultMetaDescription || '',
      defaultMetaKeywords: siteSettings.defaultMetaKeywords || '',
      siteOgImageUrl: siteSettings.siteOgImageUrl || '',
      maintenanceMode: siteSettings.maintenanceMode || false,
      skillsPageMetaTitle: siteSettings.skillsPageMetaTitle || '',
      skillsPageMetaDescription: siteSettings.skillsPageMetaDescription || '',
    },
  });

  React.useEffect(() => {
    if (formState.status === 'success') {
      toast({ title: "Success!", description: formState.message });
    } else if (formState.status === 'error') {
      toast({ title: "Error", description: formState.message, variant: "destructive" });
      if (formState.errors) {
        Object.keys(formState.errors).forEach((key) => {
          const field = key as keyof SiteSettingsAdminFormData;
          const message = formState.errors?.[field]?.join(', ');
          if (message) {
            form.setError(field, { type: 'server', message });
          }
        });
      }
    }
  }, [formState, toast, form]);

  return (
    <Form {...form}>
      <form action={formAction}>
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Manage the main configuration for your site.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="siteName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Site Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Portfolio Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="siteOgImageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Share Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/og-image.png" {...field} />
                  </FormControl>
                   <FormDescription>
                    This image will be used when your site is shared on social media (e.g., Twitter, Facebook). Recommended size: 1200x630px.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="maintenanceMode"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Maintenance Mode</FormLabel>
                    <FormDescription>
                      Enable to show a maintenance banner to all visitors. You will still be able to access the admin panel.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        
        <Card className="mt-8">
            <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
                <CardDescription>
                    Manage default search engine optimization settings for your site. These can be overridden on a per-page basis.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <FormField
                control={form.control}
                name="defaultMetaDescription"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Default Meta Description</FormLabel>
                    <FormControl>
                        <Textarea placeholder="A brief description of your portfolio and what you do." {...field} />
                    </FormControl>
                    <FormDescription>
                        A good meta description is 150-160 characters long.
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="defaultMetaKeywords"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Default Meta Keywords</FormLabel>
                    <FormControl>
                        <Input placeholder="web developer, react, nextjs, portfolio" {...field} />
                    </FormControl>
                     <FormDescription>
                        A comma-separated list of relevant keywords for search engines.
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </CardContent>
        </Card>

        <Card className="mt-8">
            <CardHeader>
                <CardTitle>Skills Page SEO</CardTitle>
                <CardDescription>
                    Customize the SEO metadata specifically for your Skills page.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                 <FormField
                control={form.control}
                name="skillsPageMetaTitle"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Skills Page Meta Title</FormLabel>
                    <FormControl>
                        <Input placeholder="My Technical Skills & Expertise" {...field} />
                    </FormControl>
                    <FormDescription>
                        The title that appears in the browser tab and search results for the skills page.
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="skillsPageMetaDescription"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Skills Page Meta Description</FormLabel>
                    <FormControl>
                        <Textarea placeholder="A showcase of my technical skills..." {...field} />
                    </FormControl>
                    <FormDescription>
                        A specific description for your skills page (150-160 characters).
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
               <SubmitButton />
            </CardFooter>
        </Card>

      </form>
    </Form>
  );
}
