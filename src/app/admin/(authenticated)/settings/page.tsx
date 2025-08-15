
import { getSiteSettingsAction } from '@/actions/admin/settingsActions';
import AdminSettingsForm from '@/components/admin/settings/settings-form';
import AdminSeedDatabase from '@/components/admin/settings/seed-database';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollAnimationWrapper } from '@/components/shared/scroll-animation-wrapper';

export default async function AdminSettingsPage() {
  const siteSettings = await getSiteSettingsAction();

  return (
    <ScrollAnimationWrapper>
        <div className="space-y-8">
            <PageHeader 
            title="Site Settings" 
            subtitle="Manage global settings for your website, including SEO metadata and maintenance mode."
            className="text-left py-0"
            />
            <AdminSettingsForm siteSettings={siteSettings} />
            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>
                  This action will reset your entire site content to its original default state. 
                  <strong className="font-semibold">All your current data will be permanently deleted.</strong>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdminSeedDatabase />
              </CardContent>
            </Card>
        </div>
    </ScrollAnimationWrapper>
  );
}
