import { UseFormReturn } from 'react-hook-form';
import z from 'zod';
import { formSchema } from './formSchema';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '../ui/form';
import { Switch } from '../ui/switch';
import { Input } from '../ui/input';

export default function OptionsField({
  form,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}) {
  return (
    <div>
      <h1 className="text-lg font-semibold mb-4">Options</h1>

      <div className="space-y-4 border-2 rounded-2xl p-4">
        <FormField
          control={form.control}
          name="options.blockEntryAfterRun"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between">
              <div className="space-y-0.5">
                <FormLabel>Block entry after run</FormLabel>
                <FormDescription>
                  Prevent new entries from being added after the run has
                  started.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="options.countdown"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between">
              <div className="space-y-0.5">
                <FormLabel>Countdown</FormLabel>
                <FormDescription>
                  Set the countdown duration in seconds.
                </FormDescription>
              </div>
              <FormControl>
                <Input
                  type="number"
                  value={field.value}
                  min={0}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  className="border rounded-md p-2"
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
