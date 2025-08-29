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
import StartList from '@/interfaces/startList';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import Session from '@/interfaces/session';

const formSchema = z.object({
  startListId: z.string().min(1, 'Start List ID is required'),
  sessionId: z.string().min(1, 'Session ID is required'),
  mode: z.enum(['best', 'all']),
  fileName: z.string().nullable().optional(),
});

export default function ExportForm() {
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sessionId: '',
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

  const { data: sessions } = useQuery({
    queryKey: ['sessions', form.watch('startListId')],
    queryFn: async () => {
      const response = await axiosInstance.get<Session[]>('/session');
      return response.data.filter(
        (session) => session.startListId === form.watch('startListId')
      );
    },
    enabled: !!form.watch('startListId'),
  });

  const exportMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const response = await axiosInstance.post(
        '/results/export-to-csv',
        {
          sessionId: data.sessionId,
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
            <FormItem className="col-span-4 md:col-span-2">
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
          name="sessionId"
          render={({ field }) => (
            <FormItem className="col-span-4 md:col-span-2">
              <FormLabel>Session</FormLabel>
              <Select defaultValue={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Session" />
                </SelectTrigger>
                <SelectContent>
                  {sessions?.map((session) => (
                    <SelectItem key={session.id} value={session.id}>
                      {session.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fileName"
          render={({ field }) => (
            <FormItem className="col-span-4 md:col-span-3">
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
