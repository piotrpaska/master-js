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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/collapsible';
import { Button } from '../ui/button';
import { ChevronDown } from 'lucide-react';

export default function OptionsField({
  form,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}) {
  return (
    <Collapsible>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center justify-between w-full text-xl font-semibold"
        >
          Options
          <ChevronDown />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="border-b">
        <div className="space-y-4 p-4 mt-4">
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
      </CollapsibleContent>
    </Collapsible>
  );
}
