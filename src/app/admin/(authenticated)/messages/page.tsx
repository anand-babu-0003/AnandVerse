
import { getContactMessagesAction } from '@/actions/admin/messagesActions';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessagesTable } from '@/components/admin/messages/messages-table';

export default async function AdminMessagesPage() {
  const messages = await getContactMessagesAction();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Contact Messages"
        subtitle="Here are the messages submitted through your contact form."
        className="text-left py-0"
      />
      <Card>
        <CardHeader>
          <CardTitle>Inbox</CardTitle>
          <CardDescription>
            You have {messages.length} message{messages.length === 1 ? '' : 's'}.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <MessagesTable messages={messages} />
        </CardContent>
      </Card>
    </div>
  );
}
