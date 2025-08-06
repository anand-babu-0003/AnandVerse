
import { PageHeader } from '@/components/shared/page-header';
import { getSiteSettingsAction } from '@/actions/admin/settingsActions';
import SettingsAdminClientPage from '@/components/admin/SettingsAdminClientPage';

// Server Component to fetch initial data
export default async function AdminSettingsPage() {
    const initialData = await getSiteSettingsAction();
    return (
        <div className="space-y-8">
            <PageHeader
                title="Site Settings"
                subtitle="Manage general configuration, SEO, and other site-wide settings."
                className="py-0 text-left"
            />
            <SettingsAdminClientPage initialData={initialData} />
        </div>
    );
}
