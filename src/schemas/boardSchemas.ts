import z from 'zod';

// description String    @default("Add description here\n🟢 You can add multiline description\n🟢 Let's start...")
// isSaved     Boolean   @default(false)
// slug        String
// icon        String    @default("📃")
// userId      String
export const boardCreateSchema = z.object({
  title: z
    .string()
    .trim()
    .min(4, { message: 'Title is required and cannot be empty or whitespace. Minimum length - 4s.' }),
  description: z.string().optional(),
  isSaved: z.boolean().optional(),
  slug: z.string().optional(),
  icon: z.string().optional(),
});

export type BoardCreateSchemaType = z.infer<typeof boardCreateSchema>;

export const boardUpdateSchema = z.object({
  title: z
    .string()
    .trim()
    .min(4, { message: 'Title is required and cannot be empty or whitespace. Minimum length - 4s.' })
    .optional(),
  description: z.string().optional(),
  isSaved: z.boolean().optional(),
  icon: z.string().optional(),
});

export type BoardUpdateSchemaType = z.infer<typeof boardUpdateSchema>;
