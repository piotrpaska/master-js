import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axiosInstance from '@/lib/api';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import React from 'react';
import { formSchema } from './formSchema';
import TracksField from './TracksField';
import SensorsField from './SensorsField';
import { Button } from '../ui/button';
import { toast } from 'sonner';
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
import { Separator } from '../ui/separator';
import OptionsField from './OptionsField';

export default function SettingsForm() {
  type SettingsFormData = z.infer<typeof formSchema>;

  const { data, refetch } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const response = await axiosInstance.get<SettingsFormData>('/config');
      console.log('Fetched settings:', response.data);
      return response.data as SettingsFormData;
    },
  });

  const mutation = useMutation({
    mutationFn: async (newData: z.infer<typeof formSchema>) => {
      const response = await axiosInstance.put('/config', newData);
      console.log('Updated settings:', response.data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Settings updated successfully');
    },
    onError: () => {
      toast.error('Failed to update settings');
    },
  });

  const form = useForm<SettingsFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: data || {},
  });

  const onReset = async () => {
    await refetch();
    form.reset(data);
  };

  // Update default values when data changes (e.g., on page enter)
  React.useEffect(() => {
    if (data) {
      form.reset(data);
    }
  }, [data, form]);

  const onSubmit = (data: SettingsFormData) => {
    console.log(data);
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} id="settings-form">
        <div className="flex flex-col md:flex-row w-full gap-4">
          <div className="flex flex-col gap-4 w-full md:w-1/4">
            <FormField
              control={form.control}
              name="resultsDir"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Results Directory</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Results Directory"
                      {...field}
                      onFocus={(e) => {
                        e.target.select();
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="col-span-1 row-span-3 border p-2 flex flex-col gap-4 items-center justify-stretch">
              <FormField
                control={form.control}
                name="speaker.enabled"
                render={({ field }) => (
                  <FormItem className="flex items-center">
                    <FormLabel>Speaker Enabled</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="speaker.id"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>Speaker ID</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Speaker ID"
                        {...field}
                        disabled={!form.watch('speaker.enabled')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="speaker.name"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>Speaker Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Speaker Name"
                        {...field}
                        disabled={!form.watch('speaker.enabled')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <OptionsField form={form} />
          </div>

          <div className="flex flex-col md:flex-row w-full md:w-3/4 gap-4">
            <div className="col-span-3 row-span-full border p-4 md:w-1/2">
              <h2 className="text-lg font-semibold">Tracks</h2>
              <TracksField form={form} />
            </div>

            <div className="col-span-3 row-span-full border p-4 md:w-1/2">
              <h2 className="text-lg font-semibold">Sensors</h2>
              <SensorsField form={form} />
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-4 gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild disabled={!form.formState.isDirty}>
              <Button size="lg">Save Changes</Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Changes</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to save these changes?
                </AlertDialogDescription>
              </AlertDialogHeader>

              <p>
                <span className="text-red-500 font-semibold">WARNING</span>{' '}
                <span className="text-blue-500 font-semibold">(Tracks)</span>
                <br />
                After saving the new configuration, all{' '}
                <span className="text-blue-500 font-semibold">TRACKS</span> will
                be <span className="text-red-500 font-semibold">RESET</span>.
                <br />
                Please make sure that no tracks are currently running.
              </p>

              {form.formState.dirtyFields.resultsDir && (
                <p>
                  <span className="text-yellow-500 font-semibold">WARNING</span>{' '}
                  <span className="text-blue-500 font-semibold">
                    (Results Directory)
                  </span>
                  <br />
                  Results directory has been modified. <br />
                  If there are saved CSV files in the old directory, they won't
                  be accessible from the app anymore.
                </p>
              )}

              <Separator />

              <p className="text-sm">
                All data including records, start lists and athletes will be
                safe.
              </p>

              <AlertDialogFooter>
                <AlertDialogAction type="submit" form="settings-form">
                  Save
                </AlertDialogAction>
                <AlertDialogCancel asChild>
                  <Button variant="outline" autoFocus>
                    Cancel
                  </Button>
                </AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button type="button" variant="outline" size="lg" onClick={onReset}>
            Reset
          </Button>
        </div>
      </form>
    </Form>
  );
}
