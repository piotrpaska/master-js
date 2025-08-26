import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '../ui/button';
import { useState } from 'react';
import StartList from '@/interfaces/startList';
import EditEntries from './EditEntries';
import { Popover, PopoverTrigger } from '../ui/popover';
import { Check, ChevronsUpDown, Plus, Trash } from 'lucide-react';
import { PopoverContent } from '@radix-ui/react-popover';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command';
import { cn } from '@/lib/utils';
import axiosInstance from '@/lib/api';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Separator } from '../ui/separator';
import RecordsTable from './RecordsTable';
import DetailedStartList from '@/interfaces/detailedStartList';

export default function StartListManagementScreen(): React.JSX.Element {
  const [selectedStartListId, setSelectedStartListId] = useState<string | null>(
    null
  );

  const { isFetching, data: startLists } = useQuery({
    queryKey: ['startLists'],
    queryFn: async () => {
      const response = await axiosInstance.get<StartList[]>('/start-list');
      return response.data;
    },
  });

  const { data: detailedSelectedStartListData } = useQuery({
    queryKey: ['selectedStartList', selectedStartListId],
    queryFn: async () => {
      if (!selectedStartListId) return null;
      const response = await axiosInstance.get<DetailedStartList>(
        `/start-list/${selectedStartListId}`
      );
      return response.data;
    },
    enabled: !!selectedStartListId,
  });

  return (
    <div className="h-full min-w-full flex flex-col">
      <main className="flex-1 overflow-y-auto">
        {isFetching ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Loading start lists...</p>
          </div>
        ) : (
          <div className="flex flex-col justify-center md:justify-start md:flex-row w-full gap-4">
            <SelectStartList
              startLists={startLists || []}
              selectedStartList={selectedStartListId}
              setSelectedStartList={setSelectedStartListId}
            />
          </div>
        )}
        <Tabs className="mt-4" defaultValue="editEntries">
          <TabsList>
            <TabsTrigger value="editEntries">Edit entries</TabsTrigger>
            <TabsTrigger value="viewEntries">Edit sessions</TabsTrigger>
          </TabsList>
          <TabsContent value="editEntries">
            {selectedStartListId && detailedSelectedStartListData ? (
              <div>
                <EditEntries startList={detailedSelectedStartListData} />
              </div>
            ) : (
              <p className="text-center text-muted-foreground mt-24">
                Please select a start list to edit or create a new one.
              </p>
            )}
          </TabsContent>
          <TabsContent value="viewEntries">
            {selectedStartListId && detailedSelectedStartListData ? (
              <RecordsTable startList={detailedSelectedStartListData} />
            ) : (
              <p className="text-center text-muted-foreground mt-24">
                Please select a start list to edit or create a new one.
              </p>
            )}
          </TabsContent>
        </Tabs>

        {selectedStartListId && (
          <div className="flex flex-col justify-center">
            <Separator className="mb-2" />

            <DeleteStartListButton
              startListId={selectedStartListId}
              setSelectedStartList={setSelectedStartListId}
            />
          </div>
        )}
      </main>
    </div>
  );
}

function SelectStartList({
  startLists,
  selectedStartList,
  setSelectedStartList,
}: {
  startLists: StartList[];
  selectedStartList: string | null;
  setSelectedStartList: (list: string | null) => void;
}): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const queryClient = useQueryClient();

  const addNewStartListMutation = useMutation({
    mutationFn: async (title: string) => {
      const response = await axiosInstance.post<StartList>('/start-list', {
        title,
      });
      return response.data as StartList;
    },
    onSuccess: async (data) => {
      setInputValue('');
      queryClient.invalidateQueries({ queryKey: ['startLists'] });
      setSelectedStartList(null);
      setOpen(false);
      toast.success(`Start list "${data.title}" created successfully`);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.error('Error creating start list:', error);
      toast.error(error.response?.data.message || 'Error creating start list');
    },
  });

  const addNewStartList = async (): Promise<void> => {
    if (inputValue.trim() === '') {
      return;
    }
    addNewStartListMutation.mutate(inputValue.trim());
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="md:w-[300px] justify-between"
        >
          {selectedStartList
            ? startLists.find((list) => list.id === selectedStartList)?.title
            : 'Select Start List'}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0 z-100">
        <Command>
          <CommandInput
            placeholder="Search Start Lists..."
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandList>
            <CommandEmpty className="flex flex-col items-center">
              <Button
                variant="ghost"
                className="w-full"
                onClick={addNewStartList}
              >
                Add start list &quot;{inputValue}&quot;
                <Plus className="ml-2 h-4 w-4" />
              </Button>
            </CommandEmpty>
            {startLists.map((list) => (
              <CommandItem
                key={list.id}
                onSelect={() => {
                  setSelectedStartList(list.id);
                  setOpen(false);
                  queryClient.invalidateQueries({ queryKey: ['startLists'] });
                }}
                className="cursor-pointer"
              >
                {list.title}
                <Check
                  className={cn(
                    'ml-auto',
                    selectedStartList === list.id ? 'opacity-100' : 'opacity-0'
                  )}
                />
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function DeleteStartListButton({
  startListId,
  setSelectedStartList,
}: {
  startListId: string;
  setSelectedStartList: (arg0: string | null) => void;
}): React.JSX.Element {
  const queryClient = useQueryClient();

  const deleteStartListMutation = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.delete<StartList>(
        `/start-list/${startListId}`
      );
      return response.data;
    },
    onSuccess: async (data) => {
      queryClient.invalidateQueries({
        queryKey: ['startLists'],
      });
      setSelectedStartList(null);
      toast.success(`Start list "${data.title}" deleted successfully`);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.error('Error deleting start list:', error);
      toast.error(error.response?.data.message || 'Error deleting start list');
    },
  });

  const deleteStartList = async (): Promise<void> => {
    deleteStartListMutation.mutate();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          className="text-muted-foreground"
          loading={deleteStartListMutation.isPending}
        >
          <Trash />
          Delete Start List
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Start List</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this start list? This action cannot
            be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-row w-full justify-between">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deleteStartList} asChild>
            <Button loading={deleteStartListMutation.isPending}>Delete</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
