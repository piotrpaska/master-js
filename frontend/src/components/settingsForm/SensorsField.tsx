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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

export default function SensorsField({
  form,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'sensors',
  });

  if (!form.getValues('sensors')) {
    return <p>No sensors available</p>;
  }

  if (fields.length === 0) {
    return (
      <Button
        variant="ghost"
        onClick={() => append({ id: '', name: '', type: 'start', trackId: '' })}
        className="text-center w-full"
      >
        Add Sensor
      </Button>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-lg shadow p-4">
        <ul className="divide-y divide-border">
          {fields.map((sensor, index) => (
            <li key={sensor.id} className="py-3">
              <div className="flex items-center gap-4">
                <div className="flex flex-col gap-4 flex-1">
                  <div className="flex gap-2">
                    <FormField
                      control={form.control}
                      name={`sensors.${index}.id`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ID</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              size={1}
                              className="text-center"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`sensors.${index}.name`}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Sensor Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex gap-2">
                    <FormField
                      control={form.control}
                      name={`sensors.${index}.type`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type</FormLabel>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue placeholder="Select Type" />
                              </SelectTrigger>

                              <SelectContent>
                                <SelectItem value="start">Start</SelectItem>
                                <SelectItem value="finish">Stop</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`sensors.${index}.trackId`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Track ID</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Track ID"
                              {...field}
                              size={3}
                              className="text-center"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="h-full">
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
            onClick={() =>
              append({ id: '', name: '', type: 'start', trackId: '' })
            }
          >
            Add sensor
          </li>
        </ul>
      </div>
    </div>
  );
}
