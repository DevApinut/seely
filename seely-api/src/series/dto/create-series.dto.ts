// create-series.dto.ts
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createSeriesSchema = z
  .object({
    name: z.string().min(1, 'name is required'),
    year: z.number().min(4, 'year is required'),
    review: z.string().min(1, 'review is required'),    
    score: z.number().min(1, 'score is required'),
    imageUrl: z.url('image must be a valid URL').optional(),
    rating: z.object({
      id: z
        .number()
        .int()
        .min(1, 'rating.id must be a number between 1 - 6')
        .max(6, 'rating.id must be a number between 1 - 6'),
    }),    
  })
  .strict();

export class CreateSeriesDto extends createZodDto(createSeriesSchema){}
