
import { PageHeader } from '@/components/shared/page-header';
import AdminAnnouncementPanel from '@/components/announcements/AdminAnnouncementPanel';
import { ScrollAnimationWrapper } from '@/components/shared/scroll-animation-wrapper';

export default function AnnouncementsAdminPage() {
  return (
    <ScrollAnimationWrapper>
        <div className="space-y-8">
            <PageHeader 
            title="Manage Announcements" 
            subtitle="Create and publish site-wide announcements for your visitors."
            className="text-left py-0"
            />
            <AdminAnnouncementPanel />
        </div>
    </ScrollAnimationWrapper>
  );
}
