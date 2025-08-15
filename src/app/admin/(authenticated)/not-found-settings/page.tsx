
import AdminNotFoundSettingsForm from "@/components/admin/not-found/not-found-settings-form";
import { PageHeader } from "@/components/shared/page-header";
import { getNotFoundPageDataAction } from "@/actions/admin/notFoundActions";
import { defaultNotFoundPageDataForClient } from "@/lib/data";

export default async function AdminNotFoundSettingsPage() {
    const notFoundData = await getNotFoundPageDataAction();
    const displayedData = notFoundData || defaultNotFoundPageDataForClient;

    return (
        <div className="space-y-8">
            <PageHeader
                title="Customize 404 Page"
                subtitle="Edit the content and appearance of your 'Page Not Found' error page."
                className="text-left py-0"
            />
            <AdminNotFoundSettingsForm notFoundPageData={displayedData} />
        </div>
    );
}
