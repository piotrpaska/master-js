export class CreateDeviceDto {
  id: string;
  name: string;
  type: 'sensor' | 'speaker';
}
