
import { PageHeader } from '@/components/shared/page-header';
import { getContactMessagesAction } from '@/actions/admin/messagesActions';
import MessagesClientPage from '@/components/admin/MessagesClientPage';

export default async function AdminMessagesPage() {
  const initialMessages = await getContactMessagesAction();
  return (
    <div className="space-y-6">
        <PageHeader title="Contact Messages" subtitle="Messages received from your site visitors." className="py-0 text-left" />
        <MessagesClientPage initialMessages={initialMessages} />
    </div>
  );
}
