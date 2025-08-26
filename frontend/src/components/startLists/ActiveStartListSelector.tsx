import React from 'react';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/api';
import StartList from '@/interfaces/startList';
import Session from '@/interfaces/session';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField } from '../ui/form';
import { toast } from 'sonner';
import { useMasterSocket } from '@/hooks/MasterSocket';

const formSchema = z.object({
  selectedStartListId: z.string(),
  selectedSessionId: z.string().optional(),
});

export default function ActiveStartListSelector(): React.JSX.Element {
  const { data: masterSocketData } = useMasterSocket();

  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { data: startLists, isFetching } = useQuery({
    queryKey: ['startLists'],
    queryFn: async () => {
      const response = await axiosInstance.get('/start-list');
      return response.data as StartList[];
    },
    enabled: !!masterSocketData,
    refetchOnWindowFocus: true,
  });

  const mutation = useMutation({
    mutationFn: async ({
      selectedStartListId,
      selectedSessionId,
    }: z.infer<typeof formSchema>) => {
      const response = await axiosInstance.put(
        `/start-list/${selectedStartListId}/activate`,
        {
          sessionId: selectedSessionId,
        }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success('Start list activated successfully!');
      queryClient.invalidateQueries({ queryKey: ['startLists'] });
    },
    onError: (error) => {
      console.error('Error activating start list:', error);
      toast.error('Failed to activate start list. Please try again.');
    },
  });

  const { data: sessions, isFetching: isFetchingSessions } = useQuery({
    queryKey: ['sessions', form.watch('selectedStartListId')],
    queryFn: async () => {
      const response = await axiosInstance.get('/session');
      return (response.data as Session[]).filter(
        (session) =>
          session.startListId === form.getValues('selectedStartListId')
      );
    },
    enabled: !!masterSocketData,
    refetchOnWindowFocus: true,
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    mutation.mutate(data);
    // You can handle session selection here if needed
    form.reset(); // Reset the form after submission
  }

  if (isFetching || isFetchingSessions) {
    return <div>Loading...</div>;
  }

  return (
    <Form {...form}>
      <form
        className="flex gap-4 items-center"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="selectedStartListId"
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select active start list" />
              </SelectTrigger>
              <SelectContent>
                {startLists?.map((startList) => (
                  <SelectItem key={startList.id} value={startList.id}>
                    {startList.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />

        <FormField
          control={form.control}
          name="selectedSessionId"
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select session (optional)" />
              </SelectTrigger>
              <SelectContent>
                {sessions?.map((session: Session) => (
                  <SelectItem key={session.id} value={session.id}>
                    {session.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />

        <Button type="submit" loading={mutation.isPending}>
          Confirm Selection
        </Button>
      </form>
    </Form>
  );
}
