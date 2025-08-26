import { Track } from '@/interfaces/track';
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { IconSettings } from '@tabler/icons-react';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import axiosInstance from '@/lib/api';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

const Incident = {
  DNF: 'DNF',
  DSQ: 'DSQ',
  DNS: 'DNS',
} as const;
type Incident = (typeof Incident)[keyof typeof Incident];

export default function ActionsModal({
  track,
}: {
  track: Track;
}): React.JSX.Element {
  const startTrackMutation = useMutation({
    mutationFn: () => {
      const response = axiosInstance.put(`/track/${track.id}/start`);
      return response;
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      console.log('Error starting track:', error);
      toast.error(
        `Failed to start track: ${
          error.response?.data?.message || error.message
        }`
      );
    },
  });

  const simpleStopMutation = useMutation({
    mutationFn: () => axiosInstance.put(`/track/${track.id}/pause`),
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(
        `Failed to pause track: ${
          error.response?.data?.message || error.message
        }`
      );
    },
  });

  if (!track) {
    return <></>;
  }

  const handleStartTrack = (): void => {
    startTrackMutation.mutate();
  };

  const handleSimpleStop = (): void => {
    simpleStopMutation.mutate();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" size="icon" className="size-8">
          <IconSettings className="size-5" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>Actions for {track.name}</DialogHeader>
        <Button
          onClick={handleStartTrack}
          disabled={track.running}
          loading={startTrackMutation.isPending}
        >
          Start
        </Button>
        <Button
          onClick={handleSimpleStop}
          loading={simpleStopMutation.isPending}
          disabled={!track.running}
        >
          Simple stop
        </Button>
        <IncidentSelect track={track} />
      </DialogContent>
    </Dialog>
  );
}

function IncidentSelect({ track }: { track: Track }): React.JSX.Element {
  const [selectedIncident, setSelectedIncident] = useState<Incident>(
    Incident.DNF
  );

  const stopWithIncidentMutation = useMutation({
    mutationFn: (incident: Incident) =>
      axiosInstance.put(`/track/${track.id}/incident`, { status: incident }),
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(
        `Failed to report incident: ${
          error.response?.data?.message || error.message
        }`
      );
    },
  });

  const handleStopWithIncident = (incident: Incident): void => {
    stopWithIncidentMutation.mutate(incident);
  };

  const handleChange = (value: Incident): void => {
    setSelectedIncident(value);
  };

  return (
    <div className="flex flex-col space-y-2">
      <Select
        value={selectedIncident}
        onValueChange={handleChange}
        disabled={!track.running || stopWithIncidentMutation.isPending}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select incident" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={Incident.DNF}>DNF</SelectItem>
          <SelectItem value={Incident.DSQ}>DSQ</SelectItem>
          <SelectItem value={Incident.DNS}>DNS</SelectItem>
        </SelectContent>
      </Select>
      <Button
        onClick={() => handleStopWithIncident(selectedIncident)}
        disabled={!track.running}
        loading={stopWithIncidentMutation.isPending}
      >
        Stop with incident
      </Button>
    </div>
  );
}
