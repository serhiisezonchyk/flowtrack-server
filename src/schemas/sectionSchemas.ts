import z from 'zod';

export const sectionUpdateSchema = z.object({
  title: z
    .string()
    .trim()
    .min(4, { message: 'Title is required and cannot be empty or whitespace. Minimum length - 4s.' }),
});

export type SectionCreateSchemaType = z.infer<typeof sectionUpdateSchema>;
