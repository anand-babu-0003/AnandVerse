
import { getCertificationsAction } from '@/actions/admin/certificationsActions';
import CertificationsAdminClientPage from '@/components/admin/CertificationsAdminClientPage';

export default async function AdminCertificationsPage() {
  const initialCertifications = await getCertificationsAction();
  return <CertificationsAdminClientPage initialCertifications={initialCertifications} />;
}
