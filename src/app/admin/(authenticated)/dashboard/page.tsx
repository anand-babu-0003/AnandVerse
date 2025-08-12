
import { getContactMessagesAction } from '@/actions/admin/messagesActions';
import { getPortfolioItemsAction } from '@/actions/admin/portfolioActions';
import { getSkillsAction } from '@/actions/admin/skillsActions';
import { getAboutMeDataAction } from '@/actions/getAboutMeDataAction';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Briefcase,
  Inbox,
  Sparkles,
  UserCircle,
  Settings,
  FileQuestion,
} from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboardPage() {
  const [messages, portfolioItems, skills, aboutMe] = await Promise.all([
    getContactMessagesAction(),
    getPortfolioItemsAction(),
    getSkillsAction(),
    getAboutMeDataAction(),
  ]);

  const stats = [
    {
      title: 'Portfolio Projects',
      value: portfolioItems.length,
      icon: Briefcase,
      href: '/admin/portfolio',
      description: 'Total projects showcased.',
    },
    {
      title: 'Total Skills',
      value: skills.length,
      icon: Sparkles,
      href: '/admin/skills',
      description: 'Skills listed on your site.',
    },
    {
      title: 'Unread Messages',
      value: messages.length,
      icon: Inbox,
      href: '/admin/messages',
      description: 'New contact form submissions.',
    },
  ];
  
  const quickLinks = [
    { href: '/admin/portfolio', label: 'Manage Portfolio', icon: Briefcase },
    { href: '/admin/skills', label: 'Manage Skills', icon: Sparkles },
    { href: '/admin/about', label: 'Edit About Page', icon: UserCircle },
    { href: '/admin/settings', label: 'Site Settings', icon: Settings },
    { href: '/admin/not-found-settings', label: '404 Page', icon: FileQuestion },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary">
          Welcome back, {aboutMe?.name?.split(' ')[0] || 'Admin'}!
        </h1>
        <p className="text-lg text-muted-foreground">
          Here&apos;s a quick overview of your site&apos;s content.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Link href={stat.href} key={stat.title}>
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer shadow-sm hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground pt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Jump directly to the section you want to edit.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {quickLinks.map((link) => (
            <Link key={link.href} href={link.href} className="flex items-center gap-3 rounded-lg p-3 text-muted-foreground transition-all hover:bg-accent hover:text-primary -m-3">
              <div className="bg-primary/10 p-2 rounded-md">
                <link.icon className="h-5 w-5 text-primary" />
              </div>
              <span className="font-medium">{link.label}</span>
            </Link>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
