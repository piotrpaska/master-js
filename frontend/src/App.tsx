import CountdownPanel from './components/countdown/CountdownPanel';
import TrackGrid from './components/tracks/TracksGrid';
import { useMasterSocket } from './hooks/MasterSocket';
import React from 'react';
import ActiveEntriesList from './components/activeEntries/ActiveEntriesList';
import ActiveStartListSelector from './components/startLists/ActiveStartListSelector';
import RecordsTable from './components/recordsTable/RecordsTable';
import { SidebarProvider, SidebarTrigger } from './components/ui/sidebar';
import AppSidebar from './components/sidebar/AppSidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from './components/ui/breadcrumb';
//import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export function App({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  console.log('VITE_MASTER_API_URL:', import.meta.env.VITE_MASTER_API_URL);
  console.log(
    'VITE_MASTER_COUNTDOWN_SOCKET_URL:',
    import.meta.env.VITE_MASTER_COUNTDOWN_SOCKET_URL
  );
  console.log(
    'VITE_MASTER_API_SOCKET_URL:',
    import.meta.env.VITE_MASTER_API_SOCKET_URL
  );

  return (
    <SidebarProvider>
      {/*<div className="flex justify-between items-center">
        <MenuBar />
        <Button size="icon" variant="ghost">
          <IconSettings className="size-6" />
        </Button>
      </div>*/}
      <AppSidebar />
      <main className="p-4 flex flex-col w-full">
        <div className="flex items-center mb-4">
          <SidebarTrigger className="mr-2" />

          <Breadcrumb>
            <BreadcrumbList>
              {(() => {
                const pathname = window.location.pathname;
                const segments = pathname.split('/').filter(Boolean);
                const breadcrumbItems = segments.map((segment, idx) => {
                  const href = '/' + segments.slice(0, idx + 1).join('/');
                  // Replace "-" with space and capitalize first letter
                  const label = segment
                    .replace(/-/g, ' ')
                    .replace(/^./, (c) => c.toUpperCase());
                  return { href, label };
                });
                // Add Home as the first breadcrumb
                breadcrumbItems.unshift({ href: '/', label: 'Home' });

                return breadcrumbItems.map((item, idx) => (
                  <React.Fragment key={item.href}>
                    <BreadcrumbItem>
                      <BreadcrumbLink href={item.href}>
                        {item.label}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    {idx < breadcrumbItems.length - 1 && (
                      <BreadcrumbSeparator />
                    )}
                  </React.Fragment>
                ));
              })()}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}

export function Dashboard(): React.JSX.Element {
  const { data } = useMasterSocket();

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <CountdownPanel />
        </div>
      </div>
      <TrackGrid />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
        <div>
          <h2 className="text-lg font-semibold mb-2">
            Active Start List:{' '}
            <span className="text-blue-500">
              {data?.activeStartList?.title || 'None'}
            </span>
            <span className="text-gray-500">
              {data?.activeStartList?.session?.title
                ? ` (Session: ${data.activeStartList.session.title})`
                : ''}
            </span>
          </h2>
          <ActiveStartListSelector />
          <div className="mb-4" />
          <ActiveEntriesList />
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Top 3 - Records</h2>
          <RecordsTable limit={3} />
        </div>
      </div>
    </>
  );
}

export default App;
