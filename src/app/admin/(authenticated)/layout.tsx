
'use client';

import * as React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  BarChart3,
  Bot,
  Briefcase,
  BookOpen,
  Home,
  Inbox,
  LayoutDashboard,
  LogOut,
  Settings,
  Sparkles,
  UserCircle,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { getAboutMeDataAction } from '@/actions/getAboutMeDataAction';
import type { AboutMeData } from '@/lib/types';
import { defaultAboutMeDataForClient } from '@/lib/data';

function Header({
  aboutMeData,
}: {
  aboutMeData: AboutMeData | null;
}) {
  const router = useRouter();
  const isMobile = useIsMobile();

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isAdminLoggedIn');
    }
    router.replace('/admin/login');
  };

  return (
    <SidebarHeader
      data-sub-header="true"
      className="flex h-14 sm:h-16 flex-row items-center justify-between border-b bg-background px-3 sm:px-4 py-2"
    >
      <div className="flex items-center gap-2 sm:gap-3">
        <SidebarTrigger className={cn('md:hidden', isMobile && 'hidden')} />
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-primary hover:text-accent transition-colors duration-200"
        >
          <Home className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-xs sm:text-sm font-medium">View Site</span>
        </Link>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <span className="text-xs sm:text-sm text-muted-foreground hidden sm:inline">
          Welcome, {aboutMeData?.name?.split(' ')[0] || 'Admin'}
        </span>
        <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
          <AvatarImage src={aboutMeData?.profileImage} alt={aboutMeData?.name} />
          <AvatarFallback>
            {aboutMeData?.name
              ? aboutMeData.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
              : 'A'}
          </AvatarFallback>
        </Avatar>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </SidebarHeader>
  );
}

function NavMenu() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const isMobile = useIsMobile();

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };
  
  const adminNavItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/admin/messages', label: 'Messages', icon: Inbox },
    { href: '/admin/blog', label: 'Blog', icon: BookOpen },
    { href: '/admin/portfolio', label: 'Portfolio', icon: Briefcase },
    { href: '/admin/skills', label: 'Skills', icon: Sparkles },
    { href: '/admin/ai-tools', label: 'AI Tools', icon: Bot },
    { href: '/admin/about', label: 'About Page', icon: UserCircle },
    { href: '/admin/settings', label: 'Site Settings', icon: Settings },
  ];

  return (
    <SidebarMenu>
      {adminNavItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href} onClick={handleLinkClick}>
            <SidebarMenuButton
              isActive={pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href))}
              tooltip={item.label}
              className="text-sm sm:text-base"
            >
              <item.icon className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">{item.label}</span>
              <span className="sm:hidden text-xs">{item.label.split(' ')[0]}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

export default function AuthenticatedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [aboutMeData, setAboutMeData] = React.useState<AboutMeData | null>(null);

  React.useEffect(() => {
    let isMounted = true;
    
    async function fetchData() {
        try {
            const data = await getAboutMeDataAction();
            if (isMounted) {
                setAboutMeData(data || defaultAboutMeDataForClient);
            }
        } catch {
            if (isMounted) {
                setAboutMeData(defaultAboutMeDataForClient);
            }
        }
    }
    
    fetchData();
    
    return () => {
        isMounted = false;
    };
  }, []);


  return (
    <SidebarProvider>
      <Sidebar
        variant="sidebar"
        collapsible="icon"
        className="border-sidebar-border"
      >
        <SidebarHeader>
          <Link href="/admin/dashboard" className="flex items-center gap-2 py-2 font-semibold">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              className="text-primary h-6 w-6"
            >
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="group-data-[collapsible=icon]:hidden">
              Admin Panel
            </span>
          </Link>
        </SidebarHeader>
        <SidebarSeparator />
        <SidebarContent className="p-2">
            <NavMenu />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <Header aboutMeData={aboutMeData} />
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
