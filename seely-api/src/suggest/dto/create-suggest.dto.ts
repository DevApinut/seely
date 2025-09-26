import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createSuggestSchema = z
  .object({
    series_id: z.number().int().min(1, 'serires is required'), 
    score: z.number().int().min(1, 'score is require 1-10').max(10,'score is require 1-10'),         
  })
  .strict();
export class CreateSuggestDto extends createZodDto(createSuggestSchema) {}


