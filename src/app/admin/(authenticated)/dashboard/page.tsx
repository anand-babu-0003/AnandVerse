
import { getContactMessagesAction } from '@/actions/admin/messagesActions';
import { getPortfolioItemsAction } from '@/actions/admin/portfolioActions';
import { getSkillsAction } from '@/actions/admin/skillsActions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Inbox, Sparkles, UserCircle } from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboardPage() {
  const [messages, portfolioItems, skills] = await Promise.all([
    getContactMessagesAction(),
    getPortfolioItemsAction(),
    getSkillsAction(),
  ]);

  const stats = [
    { title: 'Portfolio Projects', value: portfolioItems.length, icon: Briefcase, href: '/admin/portfolio' },
    { title: 'Total Skills', value: skills.length, icon: Sparkles, href: '/admin/skills' },
    { title: 'Unread Messages', value: messages.length, icon: Inbox, href: '/admin/messages' },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's a quick overview of your site.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Link href={stat.href} key={stat.title}>
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

       <Card>
        <CardHeader>
          <CardTitle>Quick Links</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <Link href="/admin/portfolio" className="flex items-center gap-3 rounded-lg p-3 text-muted-foreground transition-all hover:bg-muted hover:text-primary">
            <Briefcase className="h-5 w-5" /> Manage Portfolio
          </Link>
           <Link href="/admin/skills" className="flex items-center gap-3 rounded-lg p-3 text-muted-foreground transition-all hover:bg-muted hover:text-primary">
            <Sparkles className="h-5 w-5" /> Manage Skills
          </Link>
          <Link href="/admin/about" className="flex items-center gap-3 rounded-lg p-3 text-muted-foreground transition-all hover:bg-muted hover:text-primary">
            <UserCircle className="h-5 w-5" /> Edit About Page
          </Link>
           <Link href="/admin/messages" className="flex items-center gap-3 rounded-lg p-3 text-muted-foreground transition-all hover:bg-muted hover:text-primary">
            <Inbox className="h-5 w-5" /> View Messages
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
