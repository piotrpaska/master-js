import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useMasterSocket } from '@/hooks/MasterSocket';
import StartList from '@/interfaces/startList';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

const formSchema = z.object({
  startListId: z.string().min(1, 'Start list ID is required'),
  mode: z.enum(['best', 'all']),
  fileName: z.string().nullable().optional(),
});

export default function ExportForm() {
  const { data: masterData } = useMasterSocket();

  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startListId: masterData?.activeStartList?.id || '',
      mode: 'best',
      fileName: '',
    },
  });

  const { data: startLists } = useQuery({
    queryKey: ['startLists'],
    queryFn: async () => {
      const response = await axiosInstance.get('/start-list');
      return response.data as StartList[];
    },
    refetchOnWindowFocus: true,
  });

  const exportMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const response = await axiosInstance.post(
        '/results/export-to-csv',
        {
          startListId: data.startListId,
          mode: data.mode,
          fileName: data.fileName || undefined, // Use undefined if fileName is empty
        },
        {
          responseType: 'blob', // Ensure we get a blob response for file download
        }
      );

      return response;
    },
    onSuccess: async (response) => {
      toast.success('Results exported successfully!');
      console.log('Export response:', response);

      const disposition = response.headers?.['content-disposition'];
      let fileName = 'results.csv';
      if (
        disposition &&
        typeof disposition === 'string' &&
        disposition.includes('filename=')
      ) {
        fileName = disposition.split('filename=')[1].replace(/"/g, '').trim();
      }

      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      form.reset();
      queryClient.invalidateQueries({ queryKey: ['results'] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.error('Export failed:', error);
      toast.error(
        `Export failed: ${error.response?.data.message || 'Unknown error'}`
      );
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => exportMutation.mutate(data))}
        className="space-y-4 grid grid-cols-4 gap-x-4"
      >
        <FormField
          control={form.control}
          name="startListId"
          render={({ field }) => (
            <FormItem className="col-span-4 md:col-span-3">
              <FormLabel>Start List</FormLabel>
              <Select defaultValue={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Start List" />
                </SelectTrigger>
                <SelectContent>
                  {startLists?.map((list) => (
                    <SelectItem key={list.id} value={list.id}>
                      {list.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mode"
          render={({ field }) => (
            <FormItem className="col-span-4 md:col-span-1">
              <FormLabel>Mode</FormLabel>
              <Select defaultValue={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="best">Best</SelectItem>
                  <SelectItem value="all">All</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fileName"
          render={({ field }) => (
            <FormItem className="col-span-4">
              <FormLabel>File Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter file name"
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="mt-4"
          loading={exportMutation.isPending}
        >
          Export Results
        </Button>
      </form>
    </Form>
  );
}
