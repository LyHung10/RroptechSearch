import { z } from 'zod';

export const CreatePropertySchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  price: z.number().positive(),
  area: z.number().positive(),
  bedrooms: z.number().int().nonnegative(),
  bathrooms: z.number().int().nonnegative(),
  lat: z.number(),
  lng: z.number(),
  image: z.string().url(),
  category: z.string().min(2),
  location: z.string().min(2),
});

export type CreatePropertyDto = z.infer<typeof CreatePropertySchema>;
