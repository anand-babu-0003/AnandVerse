
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Briefcase, UserCircle, Settings, Inbox, Award, PlusCircle, User, View } from 'lucide-react';
import { getContactMessagesAction } from '@/actions/admin/messagesActions';
import { getPortfolioItemsAction } from '@/actions/admin/portfolioActions';
import { getSkillsAction } from '@/actions/admin/skillsActions';
import { getAboutMeDataAction } from '@/actions/getAboutMeDataAction';
import { getCertificationsAction } from '@/actions/admin/certificationsActions';

export default async function AdminDashboardPage() {
  const [messages, portfolioItems, skills, aboutMe, certifications] = await Promise.all([
    getContactMessagesAction(),
    getPortfolioItemsAction(),
    getSkillsAction(),
    getAboutMeDataAction(),
    getCertificationsAction(),
  ]);

  const stats = [
    {
      title: "Portfolio Projects",
      count: portfolioItems.length,
      icon: Briefcase,
      href: "/admin/portfolio",
      buttonLabel: "Manage Portfolio",
    },
    {
      title: "Contact Messages",
      count: messages.length,
      icon: Inbox,
      href: "/admin/messages",
      buttonLabel: "View Messages",
    },
    {
      title: "Total Skills",
      count: skills.length,
      icon: Award,
      href: "/admin/skills",
      buttonLabel: "Manage Skills",
    },
    {
      title: "Certifications",
      count: certifications.length,
      icon: Award,
      href: "/admin/certifications",
      buttonLabel: "Manage Certifications",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary font-headline">Welcome Back, {aboutMe.name.split(' ')[0]}!</h1>
          <p className="text-muted-foreground mt-1">Here's a quick overview of your site. Ready to get started?</p>
        </div>
        <Button asChild>
          <Link href="/admin/portfolio">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Project
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.count}</div>
              <Button asChild variant="link" className="px-0 text-xs text-muted-foreground">
                <Link href={stat.href}>
                  {stat.buttonLabel} <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Manage Content</CardTitle>
            <CardDescription>Update the core content pages of your website.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Link href="/admin/about" className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted transition-colors">
              <div className="flex items-center gap-3">
                <UserCircle className="h-5 w-5 text-primary" />
                <span className="font-medium">About Page</span>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>
            <Link href="/admin/settings" className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted transition-colors">
              <div className="flex items-center gap-3">
                <Settings className="h-5 w-5 text-primary" />
                <span className="font-medium">Site Settings & SEO</span>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>
            <Link href="/admin/not-found-settings" className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted transition-colors">
              <div className="flex items-center gap-3">
                <View className="h-5 w-5 text-primary" />
                <span className="font-medium">404 Page Settings</span>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Recent Messages</CardTitle>
            <CardDescription>A quick look at the latest contact form submissions.</CardDescription>
          </CardHeader>
          <CardContent>
            {messages.length > 0 ? (
              <div className="space-y-4">
                {messages.slice(0, 2).map((msg) => (
                  <div key={msg.id} className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                        <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium leading-none">{msg.name}</p>
                      <p className="text-sm text-muted-foreground truncate">{msg.message}</p>
                    </div>
                  </div>
                ))}
                {messages.length > 2 && (
                    <Button asChild variant="secondary" className="w-full mt-4">
                        <Link href="/admin/messages">View All Messages</Link>
                    </Button>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No messages yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
