import { useQuery } from '@tanstack/react-query';
import AthletesTable from './AthletesTable';
import NewAthleteForm from './NewAthleteForm';
import axiosInstance from '@/lib/api';
import { Loader2 } from 'lucide-react';

export default function AthleteManagmentScreen(): React.JSX.Element {
  const { data, isLoading } = useQuery({
    queryKey: ['athletes'],
    queryFn: async () => {
      const response = await axiosInstance.get('/athlete');
      return response.data;
    },
    refetchOnWindowFocus: true,
  });

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-start flex-col md:flex-row-reverse gap-4 h-full">
        <div className="w-full md:w-2/3">
          <NewAthleteForm />
        </div>
        <div className="h-full w-full">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
            </div>
          ) : (
            <AthletesTable athletes={data || []} />
          )}
        </div>
      </div>
    </div>
  );
}
