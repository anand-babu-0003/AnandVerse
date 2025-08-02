
import { PageHeader } from '@/components/shared/page-header';
import { getAboutMeDataAction } from '@/actions/getAboutMeDataAction';
import AboutAdminClientPage from '@/components/admin/AboutAdminClientPage';

// This is the parent server component that fetches initial data.
export default async function AdminAboutPage() {
  const initialData = await getAboutMeDataAction();
  return <AboutAdminClientPage initialData={initialData} />;
}
