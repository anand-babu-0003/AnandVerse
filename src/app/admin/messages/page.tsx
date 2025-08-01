import { PageHeader } from '@/components/shared/page-header';
import { getContactMessagesAction } from '@/actions/admin/messagesActions';
import MessagesClientPage from '@/components/admin/MessagesClientPage';

// This is now a pure Server Component.
// It fetches data and passes it down to the client component.
export default async function AdminMessagesPage() {
  const initialMessages = await getContactMessagesAction();
  return (
    <div className="space-y-6">
        <PageHeader title="Contact Messages" subtitle="Messages received from your site visitors." className="py-0 text-left" />
        <MessagesClientPage initialMessages={initialMessages} />
    </div>
  );
}
