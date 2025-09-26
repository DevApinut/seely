import { createZodDto } from "nestjs-zod";
import z from "zod";

const loginDtoSchema = z.object({
  username: z.string().min(1, 'username is required'),
  password: z.string().min(1, 'password is required'),
})

export class LoginDto extends createZodDto(loginDtoSchema) {}
