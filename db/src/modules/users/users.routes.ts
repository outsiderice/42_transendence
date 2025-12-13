import { FastifyInstance } from "fastify";
import { UsersService } from "./users.service";
import { CreateUserInput, UpdateUserInput } from "./users.types";
import { UserSchema } from "./users.schemas";

export const usersRoutes = async (app: FastifyInstance) => {

  // CREATE
  app.post<{ Body: CreateUserInput }>("/users", {
    schema: { tags: ["Users"], body: UserSchema, response: { 201: UserSchema } },
  }, async (req, reply) => {
    const { Username, Email, Password, Nickname, Avatar } = req.body;
    if (await UsersService.getUserByUsername(Username)) return reply.status(409).send({ error: "Usuario ya existe" });
    if (await UsersService.getUserByEmail(Email)) return reply.status(409).send({ error: "Email ya registrado" });

    const newUser = await UsersService.createUser({ Username, Email, Password, Nickname, Avatar });
    return reply.status(201).send(newUser);
  });

  // READ ALL
  app.get("/users", {
    schema: { tags: ["Users"], response: { 200: { type: "array", items: UserSchema } } },
  }, async (req, reply) => {
    return reply.send(await UsersService.getAllUsers());
  });

  // READ ONE
  app.get<{ Params: { Id: string } }>("/users/:Id", {
    schema: { tags: ["Users"], response: { 200: UserSchema } },
  }, async (req, reply) => {
    const Id = parseInt(req.params.Id, 10);
    if (isNaN(Id)) return reply.status(400).send({ error: "ID inválido" });

    const user = await UsersService.getUserById(Id);
    if (!user) return reply.status(404).send({ error: "Usuario no encontrado" });

    return reply.send(user);
  });

  // UPDATE
  app.put<{ Params: { Id: string }; Body: UpdateUserInput }>("/users/:Id", {
    schema: { tags: ["Users"], body: UserSchema, response: { 200: UserSchema } },
  }, async (req, reply) => {
    const Id = parseInt(req.params.Id, 10);
    if (isNaN(Id)) return reply.status(400).send({ error: "ID inválido" });

    const updatedUser = await UsersService.updateUser(Id, req.body);
    return reply.send(updatedUser);
  });

  // DELETE
  app.delete<{ Params: { Id: string } }>("/users/:Id", {
    schema: { tags: ["Users"] },
  }, async (req, reply) => {
    const Id = parseInt(req.params.Id, 10);
    if (isNaN(Id)) return reply.status(400).send({ error: "ID inválido" });

    await UsersService.deleteUser(Id);
    return reply.send({ message: "Usuario eliminado correctamente" });
  });

};
