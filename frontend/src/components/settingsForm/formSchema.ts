import z from 'zod';

export const formSchema = z.object({
  resultsDir: z.string().min(1, 'Results directory is required'),
  speaker: z.object({
    enabled: z.boolean(),
    id: z.string().min(1, 'ID is required').optional(),
    name: z.string().min(1, 'Name is required'),
  }),
  tracks: z.array(
    z.object({
      id: z.string().min(1, 'ID is required'),
      name: z.string().min(1, 'Name is required'),
      color: z.string().min(1, 'Color is required'),
    })
  ),
  sensors: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      type: z.enum(['start', 'finish']),
      trackId: z.string(),
    })
  ),
  options: z.object({
    blockEntryAfterRun: z.boolean(),
  }),
});
