import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const UpdateSuggestSchema = z
  .object({    
    score: z.number().int().min(1, 'score is require 1-10').max(10,'score is require 1-10'),         
  })
  .strict();
export class UpdateSuggestDto extends createZodDto(UpdateSuggestSchema) {}
