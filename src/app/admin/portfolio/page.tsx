
import { getPortfolioItemsAction } from '@/actions/admin/portfolioActions';
import PortfolioAdminClientPage from '@/components/admin/PortfolioAdminClientPage';

export default async function AdminPortfolioPage() {
  const initialProjects = await getPortfolioItemsAction();
  return <PortfolioAdminClientPage initialProjects={initialProjects} />;
}
