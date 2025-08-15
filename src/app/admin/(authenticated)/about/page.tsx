
import { getAboutMeDataAction } from '@/actions/getAboutMeDataAction';
import { PageHeader } from '@/components/shared/page-header';
import { defaultAboutMeDataForClient } from '@/lib/data';
import AdminAboutMeForm from '@/components/admin/about/about-form';
import { ScrollAnimationWrapper } from '@/components/shared/scroll-animation-wrapper';

export default async function AdminAboutPage() {
  const aboutMeData = await getAboutMeDataAction();
  const displayedData = aboutMeData || defaultAboutMeDataForClient;

  return (
    <ScrollAnimationWrapper>
        <div className="space-y-8">
            <PageHeader 
            title="Manage About Page" 
            subtitle="Update your biography, experience, education, and contact information."
            className="text-left py-0"
            />
            <AdminAboutMeForm aboutMeData={displayedData} />
        </div>
    </ScrollAnimationWrapper>
  );
}
