
import { createZodDto } from 'nestjs-zod';
import { createSeriesSchema } from './create-series.dto';

const updateFoodRecipeDtoSchema = createSeriesSchema.partial();

export class UpdateSeriesDto extends createZodDto(
  updateFoodRecipeDtoSchema,
) {}