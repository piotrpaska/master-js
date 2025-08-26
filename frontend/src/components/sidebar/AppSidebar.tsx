import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../ui/sidebar';
import {
  IconDashboard,
  IconDeviceTablet,
  IconList,
  IconMapRoute,
  IconRobot,
  IconSettings,
  IconTableExport,
  IconTrophy,
  IconUser,
} from '@tabler/icons-react';
import { AspectRatio } from '../ui/aspect-ratio';

const dashboardItems = [
  {
    title: 'Dashboard',
    icon: <IconDashboard />,
    url: '/',
  },
  {
    title: 'Athletes',
    icon: <IconUser />,
    url: '/athletes',
  },
  {
    title: 'Start lists',
    icon: <IconList />,
    url: '/start-lists',
  },
  {
    title: 'Devices',
    icon: <IconRobot />,
    url: '/devices',
  },
  {
    title: 'Export Results',
    icon: <IconTableExport />,
    url: '/export-results',
  },
  {
    title: 'Settings',
    icon: <IconSettings />,
    url: '/settings',
  },
];

const viewsItems = [
  {
    title: 'Leaderboard',
    icon: <IconTrophy />,
    url: '/leaderboard',
  },
  {
    title: 'Track Records',
    icon: <IconMapRoute />,
    url: '/track-records',
  },
  {
    title: 'Start line tablet',
    icon: <IconDeviceTablet />,
    url: '/start-line-tablet',
  },
];

const categories = [
  {
    title: 'Dashboard',
    items: dashboardItems,
  },
  {
    title: 'Views',
    items: viewsItems,
  },
];

export default function AppSidebar(): React.JSX.Element {
  return (
    <Sidebar>
      <SidebarHeader>
        <AspectRatio ratio={16 / 9}>
          <img
            src="/dynamic-timing-nobg.png"
            alt="Dynamic Timing"
            className="object-contain"
          />
        </AspectRatio>
      </SidebarHeader>
      <SidebarContent>
        {categories.map((category) => (
          <SidebarGroup key={category.title}>
            <SidebarGroupLabel>{category.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {category.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        {item.icon}
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
