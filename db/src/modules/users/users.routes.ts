import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { UsersService, User } from './users.service';


export default async (app: FastifyInstance) => {
  // CREATE
  app.post<{ Body: User; }>('/users', {
    schema: {
      tags: ['Users'],
      body: {
        type: 'object',
        required: ['username', 'email', 'password'],
        properties: {
          username: { type: 'string' },
          email: { type: 'string' },
          password: { type: 'string' },
          nickname: { type: 'string' },
          avatar: { type: 'string' },
        },
      },
    } as any,
  }, async (request: FastifyRequest<{ Body: User; }>, reply: FastifyReply) => {
    try {
      const { username, email, password, nickname, avatar } = request.body;

      // Validación básica
      if (!username || !email || !password) {
        return reply.status(400).send({
          error: 'username, email y password son requeridos',
        });
      }

      // Verificar si el usuario ya existe
      const existingUsername = UsersService.getUserByUsername(username);
      if (existingUsername) {
        return reply.status(409).send({
          error: 'El usuario ya existe',
        });
      }

      const existingEmail = UsersService.getUserByEmail(email);
      if (existingEmail) {
        return reply.status(409).send({
          error: 'El email ya está registrado',
        });
      }

      const newUser = UsersService.createUser({
        username,
        email,
        password,
        nickname,
        avatar,
      });

      return reply.status(201).send(newUser);
    } catch (error) {
      console.log(error);
      return reply.status(500).send({
        error: 'Error al crear usuario mamon',
        details: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // READ ALL
  app.get('/users', {
    schema: {
      tags: ['Users'],
    } as any,
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const users = UsersService.getAllUsers();
      return reply.send(users);
    } catch (error) {
      return reply.status(500).send({
        error: 'Error al obtener usuarios',
        details: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // READ ONE BY ID
  app.get<{ Params: { id: number; }; }>('/users/:id', {
    schema: {
      tags: ['Users'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'number' },
        },
      },
    } as any,
  }, async (request: FastifyRequest<{ Params: { id: number; }; }>, reply: FastifyReply) => {
    try {
      const id = request.params.id;

      if (isNaN(id)) {
        return reply.status(400).send({
          error: 'ID inválido',
        });
      }

      const user = UsersService.getUserById(id);

      if (!user) {
        return reply.status(404).send({
          error: 'Usuario no encontrado',
        });
      }

      return reply.send(user);
    } catch (error) {
      return reply.status(500).send({
        error: 'Error al obtener usuario',
        details: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // READ ONE BY USERNAME
  app.get<{ Params: { username: string; }; }>('/users/by-username/:username', {
    schema: {
      tags: ['Users'],
      params: {
        type: 'object',
        properties: {
          username: { type: 'string' },
        },
      },
    } as any,
  }, async (request: FastifyRequest<{ Params: { username: string; }; }>, reply: FastifyReply) => {
    try {
      const { username } = request.params;

      const user = UsersService.getUserByUsername(username);

      if (!user) {
        return reply.status(404).send({
          error: 'Usuario no encontrado',
        });
      }

      return reply.send(user);
    } catch (error) {
      return reply.status(500).send({
        error: 'Error al obtener usuario',
        details: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // UPDATE
  app.put<{ Params: { id: number; }; Body: Partial<User>; }>('/users/:id', {
    schema: {
      tags: ['Users'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'number' },
        },
      },
      body: {
        type: 'object',
        properties: {
          username: { type: 'string' },
          email: { type: 'string' },
          password: { type: 'string' },
          nickname: { type: 'string' },
          avatar: { type: 'string' },
        },
      },
    } as any,
  }, async (request: FastifyRequest<{ Params: { id: number; }; Body: Partial<User>; }>, reply: FastifyReply) => {
    try {
      const id = request.params.id;

      if (isNaN(id)) {
        return reply.status(400).send({
          error: 'ID inválido',
        });
      }

      const user = UsersService.getUserById(id);

      if (!user) {
        return reply.status(404).send({
          error: 'Usuario no encontrado',
        });
      }

      const updatedUser = UsersService.updateUser(id, request.body);

      return reply.send(updatedUser);
    } catch (error) {
      return reply.status(500).send({
        error: 'Error al actualizar usuario',
        details: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // DELETE
  app.delete<{ Params: { id: number; }; }>('/users/:id', {
    schema: {
      tags: ['Users'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'number' },
        },
      },
    } as any,
  }, async (request: FastifyRequest<{ Params: { id: number; }; }>, reply: FastifyReply) => {
    try {
      const id = request.params.id;

      if (isNaN(id)) {
        return reply.status(400).send({
          error: 'ID inválido',
        });
      }

      const user = UsersService.getUserById(id);

      if (!user) {
        return reply.status(404).send({
          error: 'Usuario no encontrado',
        });
      }
      const changes = UsersService.deleteUser(id);

      if (changes === false) {
        return reply.status(404).send({
          error: 'Usuario no encontrado',
        });
      }

      return reply.status(200).send({
        message: 'Usuario eliminado correctamente',
      });

    } catch (error) {
      return reply.status(500).send({
    error: 'Error al eliminar usuario',
    details: error instanceof Error ? error.message : String(error),
  });
    }
  });
};
