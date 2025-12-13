import { User as PrismaUser, Prisma } from "@prisma/client";

// Tipo completo generado por Prisma
export type User = PrismaUser;

// DTO público (para devolver en la API sin password)
export type PublicUser = Omit<User, "Password">;

// DTO para crear un usuario
export type CreateUserInput = Prisma.UserCreateInput;

// DTO para actualizar un usuario
export type UpdateUserInput = Partial<Prisma.UserUpdateInput>;
