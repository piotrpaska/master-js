export default class GenerateResultsToCsvDto {
  sessionId: string;
  mode: 'best' | 'all';
  fileName?: string;
}
