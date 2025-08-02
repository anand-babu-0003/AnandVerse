
import { PageHeader } from '@/components/shared/page-header';
import { getAboutMeDataAction } from '@/actions/getAboutMeDataAction';
import AboutAdminClientPage from '@/components/admin/AboutAdminClientPage';

export default async function AdminAboutPage() {
  const initialData = await getAboutMeDataAction();
  return (
    <div className="space-y-6">
        <PageHeader 
          title="Manage About Page"
          subtitle="Edit your profile, bio, experience, education, and certifications."
          className="py-0 text-left" 
        />
        <AboutAdminClientPage initialData={initialData} />
    </div>
  );
}
