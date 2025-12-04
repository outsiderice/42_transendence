import { FastifyRequest, FastifyReply } from 'fastify';
import { DBClient, User } from '../../../services/dbClient';

/**
 * GET /users - Obtener todos los usuarios
 */
export const getAllUsersController = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const users = await DBClient.getAllUsers();
    reply.status(200).send(users);
  } catch (error) {
    console.error('Error in getAllUsersController:', error);
    reply.status(500).send({
      error: 'Error al obtener usuarios',
      details: error instanceof Error ? error.message : String(error),
    });
  }
};

/**
 * GET /users/:id - Obtener usuario por ID
 */
export const getUserByIdController = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const id = parseInt(request.params.id, 10);

    if (isNaN(id)) {
      return reply.status(400).send({
        error: 'ID inválido',
      });
    }

    const user = await DBClient.getUserById(id);

    if (!user) {
      return reply.status(404).send({
        error: 'Usuario no encontrado',
      });
    }

    reply.status(200).send(user);
  } catch (error) {
    console.error('Error in getUserByIdController:', error);
    reply.status(500).send({
      error: 'Error al obtener usuario',
      details: error instanceof Error ? error.message : String(error),
    });
  }
};

/**
 * GET /users/by-username/:username - Obtener usuario por username
 */
export const getUserByUsernameController = async (
  request: FastifyRequest<{ Params: { username: string } }>,
  reply: FastifyReply
) => {
  try {
    const { username } = request.params;

    if (!username || username.trim() === '') {
      return reply.status(400).send({
        error: 'Username es requerido',
      });
    }

    const user = await DBClient.getUserByUsername(username);

    if (!user) {
      return reply.status(404).send({
        error: 'Usuario no encontrado',
      });
    }

    reply.status(200).send(user);
  } catch (error) {
    console.error('Error in getUserByUsernameController:', error);
    reply.status(500).send({
      error: 'Error al obtener usuario',
      details: error instanceof Error ? error.message : String(error),
    });
  }
};

/**
 * POST /users - Crear nuevo usuario
 */
export const createUserController = async (
  request: FastifyRequest<{ Body: Omit<User, 'id' | 'created_at' | 'updated_at'> }>,
  reply: FastifyReply
) => {
  try {
    const { username, email, password, nickname, avatar } = request.body;

    // Validaciones básicas
    if (!username || !email || !password) {
      return reply.status(400).send({
        error: 'username, email y password son requeridos',
      });
    }

    if (username.trim().length < 3) {
      return reply.status(400).send({
        error: 'username debe tener al menos 3 caracteres',
      });
    }

    if (password.length < 6) {
      return reply.status(400).send({
        error: 'password debe tener al menos 6 caracteres',
      });
    }

    // Verificar si el usuario ya existe
    const existingUsername = await DBClient.getUserByUsername(username);
    if (existingUsername) {
      return reply.status(409).send({
        error: 'El username ya está registrado',
      });
    }

    const newUser = await DBClient.createUser({
      username,
      email,
      password,
      ...(nickname && { nickname }),
      ...(avatar && { avatar }),
    });

    reply.status(201).send(newUser);
  } catch (error) {
    console.error('Error in createUserController:', error);
    reply.status(500).send({
      error: 'Error al crear usuario',
      details: error instanceof Error ? error.message : String(error),
    });
  }
};

/**
 * PUT /users/:id - Actualizar usuario
 */
export const updateUserController = async (
  request: FastifyRequest<{ Params: { id: string }; Body: Partial<User> }>,
  reply: FastifyReply
) => {
  try {
    const id = parseInt(request.params.id, 10);
    if (isNaN(id)) {
      return reply.status(400).send({ error: 'ID inválido' });
    }

    const existingUser = await DBClient.getUserById(id);
    if (!existingUser) {
      return reply.status(404).send({ error: 'Usuario no encontrado' });
    }

    const allowedFields: (keyof User)[] = ['username', 'email', 'password', 'nickname', 'avatar'];
    const fieldsToUpdate: Partial<User> = {};

    for (const key of allowedFields) {
      const value = request.body[key];
      if (value !== undefined) {
        // Cast seguro para evitar error de TypeScript
        (fieldsToUpdate as any)[key] = value;
      }
    }

    const updatedUser = await DBClient.updateUser(id, fieldsToUpdate);

    if (!updatedUser) {
      return reply.status(500).send({ error: 'No se pudo actualizar el usuario' });
    }

    reply.status(200).send(updatedUser);
  } catch (error) {
    console.error('Error in updateUserController:', error);
    reply.status(500).send({
      error: 'Error al actualizar usuario',
      details: error instanceof Error ? error.message : String(error),
    });
  }
};

/**
 * DELETE /users/:id - Eliminar usuario
 */
export const deleteUserController = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const id = parseInt(request.params.id, 10);

    if (isNaN(id)) {
      return reply.status(400).send({
        error: 'ID inválido',
      });
    }

    const user = await DBClient.getUserById(id);

    if (!user) {
      return reply.status(404).send({
        error: 'Usuario no encontrado',
      });
    }

    const deleted = await DBClient.deleteUser(id);

    if (deleted) {
      return reply.status(200).send({
        message: 'Usuario eliminado correctamente',
      });
    }

    reply.status(500).send({
      error: 'Error al eliminar usuario',
    });
  } catch (error) {
    console.error('Error in deleteUserController:', error);
    reply.status(500).send({
      error: 'Error al eliminar usuario',
      details: error instanceof Error ? error.message : String(error),
    });
  }
};