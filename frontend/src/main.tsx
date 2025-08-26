import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App, { Dashboard } from './App.tsx';
import './style.css';
import { createBrowserRouter, RouterProvider } from 'react-router';
import LiveResultsPage from './pages/LiveResultsPage.tsx';
import { MasterSocketProvider } from './contexts/MasterCommSocket';
import { ThemeProvider } from './contexts/ThemeProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import AthleteManagmentScreen from './components/athleteManagmentScreen/AthleteManagmentScreen.tsx';
import StartListManagementScreen from './components/startListManagementScreen/StartListManagementScreen.tsx';
import StartLineTablet from './pages/StartLineTablet.tsx';
import { Outlet } from 'react-router';
import ExportResultsPage from './pages/ExportResults.tsx';
import SettingsPage from './pages/SettingsPage.tsx';
import DevicesPage from './pages/DevicesPage.tsx';
import TrackRecordsPage from './pages/TrackRecordsPage.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <App>
        <Outlet />
      </App>
    ),
    children: [
      {
        path: '',
        element: <Dashboard />,
      },
      {
        path: 'devices',
        element: <DevicesPage />,
      },
      {
        path: 'athletes',
        element: <AthleteManagmentScreen />,
      },
      {
        path: 'start-lists',
        element: <StartListManagementScreen />,
      },
      {
        path: 'leaderboard',
        element: <LiveResultsPage />,
      },
      {
        path: 'track-records',
        element: <TrackRecordsPage />,
      },
      {
        path: 'export-results',
        element: <ExportResultsPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },
  {
    path: 'start-line-tablet',
    element: <StartLineTablet />,
  },
]);

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="dst-desktop-theme">
        <MasterSocketProvider>
          <RouterProvider router={router} />
          <Toaster theme="dark" richColors />
        </MasterSocketProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
