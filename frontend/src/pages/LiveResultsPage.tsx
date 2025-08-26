import RecordsTable from '@/components/recordsTable/RecordsTable';
import { useMasterSocket } from '@/hooks/MasterSocket';

export default function LiveResultsPage(): React.JSX.Element {
  const { socket, data } = useMasterSocket();

  if (socket?.disconnected) {
    return <div>Socket disconnected. Please check your connection.</div>;
  }

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">
        Live Results for{' '}
        <span className="italic font-normal">
          {data?.activeStartList?.title}
        </span>
      </h1>
      <RecordsTable />
    </div>
  );
}
