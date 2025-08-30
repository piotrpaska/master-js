import RecordsTable from '@/components/recordsTable/RecordsTable';
import { useMasterSocket } from '@/hooks/MasterSocket';
import { useEffect } from 'react';

export default function LiveResultsPage(): React.JSX.Element {
  const { socket, data } = useMasterSocket();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const startScroll = () => {
      interval = setInterval(() => {
        if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
          clearInterval(interval);

          setTimeout(() => {
            window.scrollTo({
              top: 0,
              behavior: 'smooth',
            });

            setTimeout(() => {
              startScroll();
            }, 2000);
          }, 1000);
        } else {
          window.scrollBy(0, 2);
        }
      }, 50);
    };

    startScroll();

    return () => clearInterval(interval);
  }, []);

  if (socket?.disconnected) {
    return <div>Socket disconnected. Please check your connection.</div>;
  }

  return (
    <div className="p-1 md:p-4">
      <h1 className="mb-4 text-2xl xl:text-3xl font-bold">
        Leaderboard{' '}
        <span className="italic font-normal">
          {data?.activeStartList?.title}{' '}
        </span>
        <span className="font-semibold ">
          {data?.activeStartList?.session?.title}
        </span>
      </h1>
      <RecordsTable />
    </div>
  );
}
