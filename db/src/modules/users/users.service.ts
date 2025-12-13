import { prisma } from "../../config/prisma";
import { CreateUserInput, UpdateUserInput } from "./users.types";

export class UsersService {
  static async createUser(data: CreateUserInput) {
    return prisma.user.create({ data });
  }
  static async getUserById(Id: number) {
    return prisma.user.findUnique({ where: { Id } });
  }
  static async getUserByUsername(Username: string) {
    return prisma.user.findUnique({ where: { Username } });
  }
  static async getUserByEmail(Email: string) {
    return prisma.user.findUnique({ where: { Email } });
  }
  static async getAllUsers() {
    return prisma.user.findMany();
  }
  static async updateUser(Id: number, updates: UpdateUserInput) {
    return prisma.user.update({ where: { Id }, data: updates });
  }
  static async deleteUser(Id: number) {
    await prisma.user.delete({ where: { Id } });
    return true;
  }
}
