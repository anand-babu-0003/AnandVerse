import { PageHeader } from '@/components/shared/page-header';
import { getNotFoundPageDataAction } from '@/actions/admin/notFoundActions';
import NotFoundSettingsForm from '@/components/admin/NotFoundSettingsForm';

export default async function AdminNotFoundSettingsPage() {
    const initialData = await getNotFoundPageDataAction();
    return (
        <div className="space-y-8">
            <PageHeader
                title="404 Page Settings"
                subtitle="Customize the content displayed on your 'Page Not Found' page."
                className="py-0 text-left"
            />
            <NotFoundSettingsForm initialData={initialData} />
        </div>
    );
}
