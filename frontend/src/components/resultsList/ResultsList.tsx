import axiosInstance from '@/lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '../ui/button';
import { Download, Eye, Loader2, RefreshCcw, Trash } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import React from 'react';
import RecordsView from './RecordsView';

export default function ResultsList() {
  const queryClient = useQueryClient();

  const [recordsToView, setRecordsToView] = React.useState<
    Record<string, string>[]
  >([]);
  const [open, setOpen] = React.useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['results'],
    queryFn: async () => {
      const response = await axiosInstance.get<string[]>('/results');
      return response.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (result: string) => {
      // Use axiosInstance to match your API config and avoid SSL issues
      return await axiosInstance.get(`/results/${result}`, {
        responseType: 'blob',
      });
    },
    onSuccess: (response) => {
      console.log(response);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const contentDisposition = response.headers['content-disposition'];
      link.download = contentDisposition
        ? contentDisposition.split('filename=')[1]?.replace(/"/g, '') ||
          'result.csv'
        : 'result.csv';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
  });

  const viewMutation = useMutation({
    mutationFn: async (result: string) => {
      // Use axiosInstance to match your API config and avoid SSL issues
      return await axiosInstance.get(`/results/${result}`, {
        responseType: 'blob',
      });
    },
    onSuccess: async (data) => {
      const blob = new Blob([data.data], { type: 'text/csv' });
      const text = await blob.text();
      const lines = text.split('\n').filter(Boolean);
      const headers = lines[0].split(',');
      const records = lines.slice(1).map((line) => {
        const values = line.split(',').map((v) => v.trim());
        return headers.reduce<Record<string, string>>((acc, header, idx) => {
          acc[header.trim()] = values[idx] ?? '';
          return acc;
        }, {});
      });
      // You can now use `records` as a list of Record<string, string>
      console.log(records);
      setRecordsToView(records);
      setOpen(true);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (result: string) => {
      await axiosInstance.delete(`/results/${result}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['results'] });
    },
  });

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <h1 className="text-2xl font-bold">Results List</h1>
        <Button variant="ghost" size="icon" onClick={() => refetch()}>
          <RefreshCcw />
        </Button>
      </div>
      {isLoading ? (
        <p className="text-muted-foreground">
          <Loader2 className="animate-spin mr-2 inline" />
          Loading...
        </p>
      ) : data ? (
        data.length > 0 ? (
          <ul className="rounded-lg shadow divide-y divide-border">
            {data.map((result) => (
              <li
                key={result}
                className="px-4 py-2 flex justify-between items-center"
              >
                {result}

                <div className="flex gap-4">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => viewMutation.mutate(result)}
                  >
                    <Eye />
                  </Button>

                  <Button size="icon" onClick={() => mutation.mutate(result)}>
                    <Download />
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger
                      asChild
                      disabled={deleteMutation.isPending}
                    >
                      <Button size="icon" variant="destructive">
                        <Trash />
                      </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Changes</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to save these changes?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogAction asChild>
                          <Button
                            onClick={() => deleteMutation.mutate(result)}
                            variant="destructive"
                            className="text-white"
                          >
                            Delete
                          </Button>
                        </AlertDialogAction>
                        <AlertDialogCancel asChild>
                          <Button variant="outline" autoFocus>
                            Cancel
                          </Button>
                        </AlertDialogCancel>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">No results found.</p>
        )
      ) : (
        <p className="text-muted-foreground">No results found.</p>
      )}

      <RecordsView records={recordsToView} open={open} setOpen={setOpen} />
    </div>
  );
}
