import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

export default function RecordsView({
  records,
  open,
  setOpen,
}: {
  records: Record<string, string>[];
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="min-w-screen h-full flex flex-col">
          <DialogHeader>
            <DialogTitle>Records</DialogTitle>
            <DialogDescription>List of all records.</DialogDescription>
          </DialogHeader>
          <div className="overflow-auto h-full">
            <Table>
              <TableHeader>
                <TableRow>
                  {records.length > 0 &&
                    Object.keys(records[0]).map((key) => (
                      <TableHead key={key}>{key}</TableHead>
                    ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record, idx) => (
                  <TableRow key={idx}>
                    {Object.values(record).map((value, i) => (
                      <TableCell key={i}>{value}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
