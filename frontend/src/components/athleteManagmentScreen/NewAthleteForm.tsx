import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/api';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
});

export default function NewAthleteForm(): React.JSX.Element {
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const response = await axiosInstance.post('/athlete', data);
      return response.data;
    },
    onSuccess: () => {
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['athletes'] });
      toast.success('Athlete added successfully!');
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(
        `Error adding athlete: ${error.response?.data.message || error.message}`
      );
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>): void => {
    console.log('Form submitted:', data);
    mutation.mutate(data);
    // Handle form submission logic here
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter athlete name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" loading={mutation.isPending}>
          Add Athlete
        </Button>
      </form>
    </Form>
  );
}
