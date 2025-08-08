import { getAboutMeDataAction } from '@/actions/getAboutMeDataAction';
import AboutAdminClientPage from '@/components/admin/AboutAdminClientPage';
import FullScreenLoader from '@/components/shared/FullScreenLoader';
import { PageHeader } from '@/components/shared/page-header';

// This is the server component that fetches initial data.
export default async function AdminAboutPage() {
  const initialData = await getAboutMeDataAction();

  if (!initialData) {
    return <FullScreenLoader />; 
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Manage About Page"
        subtitle="Edit your profile, bio, experience, education, and contact information."
        className="py-0 text-left" 
      />
      <AboutAdminClientPage initialData={initialData} />
    </div>
  );
}
