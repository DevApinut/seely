

import { createZodDto } from 'nestjs-zod';
import { createSuggestSchema } from './create-suggest.dto';

const UpdateSuggestSchema = createSuggestSchema.partial();

export class UpdateSuggestDto extends createZodDto(
  UpdateSuggestSchema,
) {}