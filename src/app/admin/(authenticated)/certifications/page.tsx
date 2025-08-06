
import { getCertificationsAction } from '@/actions/admin/certificationsActions';
import CertificationsAdminClientPage from '@/components/admin/CertificationsAdminClientPage';

// Server Component to fetch initial data
export default async function AdminCertificationsPage() {
  const initialCertifications = await getCertificationsAction();
  return <CertificationsAdminClientPage initialCertifications={initialCertifications} />;
}
