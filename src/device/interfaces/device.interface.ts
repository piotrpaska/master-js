export interface Device {
  id: string;
  name: string;
  type: 'sensor' | 'speaker';
  lastHeartbeat: Date | null;
  liveConnected: boolean;
}
