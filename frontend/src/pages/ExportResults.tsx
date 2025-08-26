import ExportForm from '@/components/exportResultsModal/ExportForm';
import ResultsList from '@/components/resultsList/ResultsList';

export default function ExportResultsPage(): React.JSX.Element {
  return (
    <div className="flex justify-center h-full">
      <div className="md:w-3/4">
        <ExportForm />
        <ResultsList />
      </div>
    </div>
  );
}
