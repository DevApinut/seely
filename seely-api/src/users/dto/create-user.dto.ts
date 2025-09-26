import z from "zod";
import { Role } from "../entities/user.entity";
import { createZodDto } from "nestjs-zod";

const createUserSchema = z.object({
  username: z.string().min(3, 'username is required'),
  password: z.string().min(3, 'password is required'),
  role: z.enum(Role, 'role should be USER or ADMIN')
})

export class CreateUserDto 
  extends createZodDto(createUserSchema) {}
