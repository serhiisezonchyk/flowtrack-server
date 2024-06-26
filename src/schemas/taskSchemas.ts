import z from 'zod';

export const taskUpdateSchema = z.object({
  title: z.string().min(4, { message: 'Task title should be more than 4 s.' }).optional(),
  content: z.string().optional(),
  deadline: z.date().optional().nullable(),
});

export type TaskUpdateSchemaType = z.infer<typeof taskUpdateSchema>;
