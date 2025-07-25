
"use client";

import { useEffect } from 'react'; 
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useForm, type Path } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Info, Save, Loader2, Wrench, Settings2, ListChecks } from 'lucide-react'; 

import { siteSettingsAdminSchema, type SiteSettingsAdminFormData } from '@/lib/adminSchemas';
import { updateSiteSettingsAction, type UpdateSiteSettingsFormState } from '@/actions/admin/settingsActions';
import type { SiteSettings } from '@/lib/types';

// This is the new parent server component
export default async function AdminSettingsPage() {
    const initialData = await getSiteSettingsAction();
    return <SettingsAdminClientPage initialData={initialData} />;
}


const initialFormState: UpdateSiteSettingsFormState = { message: '', status: 'idle', errors: {}, data: undefined };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>
      ) : (
        <><Save className="mr-2 h-4 w-4" />Save Settings</>
      )}
    </Button>
  );
}

// Client Component for the form
function SettingsAdminClientPage({ initialData }: { initialData: SiteSettings }) {
    const { toast } = useToast();
    const [settingsState, settingsFormAction] = useActionState(updateSiteSettingsAction, initialFormState);

    const form = useForm<SiteSettingsAdminFormData>({
      resolver: zodResolver(siteSettingsAdminSchema),
      defaultValues: initialData, 
    });

    useEffect(() => {
        if (settingsState.status === 'success' && settingsState.message) {
          toast({ title: "Success!", description: settingsState.message });
          if (settingsState.data) form.reset(settingsState.data); 
        } else if (settingsState.status === 'error') {
          toast({ title: "Error Saving Settings", description: settingsState.message || "An error occurred.", variant: "destructive" });
          if (settingsState.data) form.reset(settingsState.data);
          
          if (settingsState.errors) {
            Object.entries(settingsState.errors).forEach(([fieldName, fieldErrorMessages]) => {
              if (Array.isArray(fieldErrorMessages) && fieldErrorMessages.length > 0) {
                form.setError(fieldName as Path<SiteSettingsAdminFormData>, { type: 'server', message: fieldErrorMessages.join(', ') });
              }
            });
          }
        }
      }, [settingsState, toast, form]);

    return (
        <div className="space-y-8">
            <PageHeader title="Site Settings" subtitle="Manage general configuration, SEO, and other site-wide settings." className="py-0 text-left"/>
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
                <Form {...form}>
                <form action={settingsFormAction} className="space-y-8">
                    <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2"><Settings2 className="h-6 w-6 text-primary" /> General Site Information & SEO</CardTitle><CardDescription>Basic information and default SEO settings for your website.</CardDescription></CardHeader>
                        <CardContent className="space-y-4">
                            <FormField control={form.control} name="siteName" render={({ field }) => (<FormItem><FormLabel>Site Name</FormLabel><FormControl><Input {...field} placeholder="Your Awesome Portfolio" /></FormControl><FormMessage /><p className="text-xs text-muted-foreground">Used in browser tab titles and default Open Graph title.</p></FormItem>)} />
                            <FormField control={form.control} name="defaultMetaDescription" render={({ field }) => (<FormItem><FormLabel>Default Meta Description</FormLabel><FormControl><Input {...field} placeholder="A brief description of your site for search engines." /></FormControl><FormMessage /><p className="text-xs text-muted-foreground">General SEO description (max 160 characters) and default Open Graph description.</p></FormItem>)} />
                            <FormField control={form.control} name="defaultMetaKeywords" render={({ field }) => (<FormItem><FormLabel>Default Meta Keywords (Optional)</FormLabel><FormControl><Input {...field} placeholder="e.g., web developer, portfolio, react" /></FormControl><FormMessage /><p className="text-xs text-muted-foreground">Comma-separated keywords. Modern SEO largely ignores this.</p></FormItem>)} />
                            <FormField control={form.control} name="siteOgImageUrl" render={({ field }) => (<FormItem><FormLabel>Default Open Graph Image URL (Optional)</FormLabel><FormControl><Input {...field} placeholder="https://example.com/default-og-image.png" /></FormControl><FormMessage /><p className="text-xs text-muted-foreground">URL for a default image (e.g., 1200x630px) used when sharing on social media.</p></FormItem>)} />
                            <FormField control={form.control} name="maintenanceMode" render={({ field }) => (<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4"><div className="space-y-0.5"><FormLabel className="text-base flex items-center gap-2"><Wrench className="h-4 w-4" />Maintenance Mode</FormLabel><p className="text-xs text-muted-foreground pl-6">If enabled, a maintenance banner will be shown to users.</p></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} name={field.name} /></FormControl></FormItem>)} />
                        </CardContent>
                        <CardFooter className="flex justify-end"><SubmitButton /></CardFooter>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2"><ListChecks className="h-6 w-6 text-primary" /> Skills Page SEO</CardTitle><CardDescription>Customize the meta title and description specifically for your Skills page.</CardDescription></CardHeader>
                        <CardContent className="space-y-4">
                            <FormField control={form.control} name="skillsPageMetaTitle" render={({ field }) => (<FormItem><FormLabel>Skills Page Meta Title</FormLabel><FormControl><Input {...field} placeholder="My Skills | Your Site Name" /></FormControl><FormMessage /><p className="text-xs text-muted-foreground">The title that appears in browser tabs and search results for the /skills page.</p></FormItem>)} />
                            <FormField control={form.control} name="skillsPageMetaDescription" render={({ field }) => (<FormItem><FormLabel>Skills Page Meta Description</FormLabel><FormControl><Input {...field} placeholder="A summary of my technical skills and expertise." /></FormControl><FormMessage /><p className="text-xs text-muted-foreground">A brief description (max 160 characters) for the /skills page, used by search engines.</p></FormItem>)} />
                        </CardContent>
                        <CardFooter className="flex justify-end"><SubmitButton /></CardFooter>
                    </Card>
                </form>
                </Form>
                
                <Card>
                  <CardHeader><CardTitle>Favicon Management</CardTitle><CardDescription>Information on managing your site's browser icon.</CardDescription></CardHeader>
                  <CardContent>
                    <Alert variant="default" className="mt-0">
                      <Info className="h-4 w-4" />
                      <AlertTitle>Favicon Management Instructions</AlertTitle>
                      <AlertDescription>
                        To change your site's favicon:
                        <ol className="list-decimal list-inside mt-1 text-xs space-y-1">
                          <li>Create `favicon.ico` (typically 32x32 or 16x16 pixels).</li>
                          <li>Create `apple-touch-icon.png` (typically 180x180 pixels).</li>
                          <li>Place both files in your project's `public/` directory, replacing any existing ones.</li>
                          <li>Next.js automatically serves these. Clear browser cache and restart your development server to see changes.</li>
                        </ol>
                        <p className="mt-2 text-xs">direct uploade is not available now.</p>
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
            </div>
        </div>
    );
}
