import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { formSchema } from './formSchema';
import z from 'zod';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Trash } from 'lucide-react';

export default function TracksField({
  form,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'tracks',
  });

  if (!form.getValues('tracks')) {
    return <p>No tracks available</p>;
  }

  if (fields.length === 0) {
    return (
      <Button
        variant="ghost"
        onClick={() => append({ id: '', name: '', color: '' })}
        className="text-center w-full"
      >
        Add Track
      </Button>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-lg shadow p-4">
        <ul className="divide-y divide-border">
          {fields.map((track, index) => (
            <li key={track.id} className="py-3">
              <div className="flex items-end gap-3">
                <FormField
                  control={form.control}
                  name={`tracks.${index}.id`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID</FormLabel>
                      <FormControl>
                        <Input {...field} size={1} className="text-center" />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`tracks.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Track Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Track Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`tracks.${index}.color`}
                  render={({ field }) => (
                    <FormItem className="w-8">
                      <FormLabel>Color</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Track Color"
                          {...field}
                          type="color"
                          className="p-1"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="ml-auto">
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => remove(index)}
                  >
                    <Trash />
                  </Button>
                </div>
              </div>
            </li>
          ))}
          <li
            className="p-3 hover:bg-muted flex items-center text-center justify-center gap-2 text-primary hover:cursor-pointer"
            role="button"
            onClick={() => append({ id: '', name: '', color: '' })}
          >
            Add track
          </li>
        </ul>
      </div>
    </div>
  );
}
