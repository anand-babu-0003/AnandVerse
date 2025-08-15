
import { getPortfolioItemsAction } from '@/actions/admin/portfolioActions';
import { PortfolioItemsList } from '@/components/admin/portfolio/portfolio-items-list';
import { PageHeader } from '@/components/shared/page-header';

export default async function AdminPortfolioPage() {
  const portfolioItems = await getPortfolioItemsAction();

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Manage Portfolio" 
        subtitle="Add, edit, or delete the projects showcased on your site."
        className="text-left py-0"
      />
      <PortfolioItemsList initialPortfolioItems={portfolioItems} />
    </div>
  );
}
