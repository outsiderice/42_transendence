import { FastifyRequest, FastifyReply } from 'fastify';
import { DBClient, User } from '../../../services/dbClient';
import * as bcrypt from 'bcrypt';



const AVATAR_PREFIX = 'api/public/avatars';

function buildAvatarUrl(filename?: string): string {
  if (!filename) { 
    return ''; 
  }
  return `${AVATAR_PREFIX}/${filename}`;
}

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



export const getUserFriendsController = async (
  request: FastifyRequest<{ Params: { id: number } }>,
  reply: FastifyReply
) => {
  const userId = request.params.id;

  const relations = await DBClient.getAllFriends (userId);

  const friendIds = [
    ...new Set(
      relations.map(r =>
        r.user_1 === userId ? r.user_2 : r.user_1
      )
    )
  ];

  const users = (await Promise.all(
    friendIds.map(id => DBClient.getUserById(id))
  )).filter(Boolean);

  return users;
};

export const getUserPetitionsController = async (
  request: FastifyRequest<{ Params: { id: number } }>,
  reply: FastifyReply
) => {
  const userId = request.params.id;

  const petitions = await DBClient.getAllPetitions (userId);

  return petitions;
};

/**
 * GET /users/:id - Obtener usuario por ID
 */
export const getUserByIdController = async (
  request: FastifyRequest<{ Params: { id: number } }>,
  reply: FastifyReply
) => {
  try {
    const id = request.params.id;

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
    user.avatar = buildAvatarUrl(user.avatar);

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
    user.avatar = buildAvatarUrl(user.avatar);

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
* POST /users - Register nuevo usuario
 */
export const registerUserController = async (
  request: FastifyRequest<{ Body: Omit<User, 'id' | 'created_at' | 'updated_at'> }>,
  reply: FastifyReply
) => {
  try {
    const { username, email, password,nickname, avatar} = request.body;
    
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

    // generar contraseña hasheada 
    const saltRounds = 10;
    const hash = bcrypt.hashSync(password, saltRounds);
    console.log('Hashed password:', hash);
    console.log('Original password:', password);
        
    // Crear el usuario con la contraseña hasheada
    const newUser = await DBClient.createUser({
      username,
      email,
      password: hash,
      avatar : "avatar.jpg",
      ...(nickname && { nickname }),
     
    });
    //evita devolver el password en la respuesta
    const { password: _, ...safeUser } = newUser;

    reply.status(201).send(safeUser);
  } catch (error) {
    console.error('Error in createUserController:', error);
    reply.status(500).send({
      error: 'Error al crear usuario',
      details: error instanceof Error ? error.message : String(error),
    });
  }
};
/*
* POST /users - Login usuario
*/
export const loginUserController = async (
  request: FastifyRequest<{ Body: { username: string;  password: string } }>,
  reply: FastifyReply
) => {
  try {
    const { username, password } = request.body;

    // Validaciones básicas
    if (!username || !password) {
      return reply.status(400).send({
        error: 'username, email y password son requeridos',
      });
    }

    // Verificar si el usuario ya existe
    const existingUsername = await DBClient.getUserByUsername(username);
    if (!existingUsername) {
      return reply.status(409).send({
        error: 'El username no existe',
      });
    }

    // comparar contraseña hasheada
    const passwordMatch = bcrypt.compareSync(password, existingUsername.password);
    console.log('Password match:', passwordMatch);
    console.log('Input password:', password);
    console.log('Stored hashed password:', existingUsername.password);  
        
    if (!passwordMatch) {
      return reply.status(401).send({
        error: 'Contraseña incorrecta',
      });
    }
    //evita devolver el password en la respuesta
    const { password: _, ...safeUser } = existingUsername;

    reply.status(201).send(safeUser);
  } catch (error) {
    console.error('Error in loginUserController:', error);
    reply.status(500).send({
      error: 'Error al loggear usuario',
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
  request: FastifyRequest<{ Params: { id: number }; Body: Partial<User> }>,
  reply: FastifyReply
) => {
  try {
    const id = request.params.id;
    if (isNaN(id)) {
      return reply.status(400).send({ error: 'ID inválido' });
    }

    const existingUser = await DBClient.getUserById(id);
    if (!existingUser) {
      return reply.status(404).send({ error: 'Usuario no encontrado' });
    }

    const allowedFields: (keyof User)[] = ['username', 'email', 'password','oldpassword', 'nickname', 'avatar'];
    const fieldsToUpdate: Partial<User> = {};
    const passwordtocheck: string = allowedFields.includes('oldpassword') && request.body.oldpassword ? request.body.oldpassword : '';
    for (const key of allowedFields) {
      const value = request.body[key];
      if (value !== undefined) {
        if (key === 'password') {
          if (typeof value !== 'string' || value.length < 8 ) {
            return reply.status(400).send({ error: 'La contraseña debe tener al menos 8 caracteres' });
          }
          if (!passwordtocheck || passwordtocheck.trim() === '') {
            return reply.status(400).send({ error: 'La contraseña antigua es requerida para cambiar la contraseña' });
          }
          const isOldPasswordCorrect = bcrypt.compareSync(passwordtocheck, existingUser.password);
          if (!isOldPasswordCorrect) {
            return reply.status(401).send({ error: 'La contraseña antigua es incorrecta' });
          }
          const saltRounds = 10;
          const password: string = value as string;
          const hash = bcrypt.hashSync(password, saltRounds);
          (fieldsToUpdate as any)[key] = hash;
        } else {
          (fieldsToUpdate as any)[key] = value;
        }
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
}


/**
 * DELETE /users/:id - Eliminar usuario
 */
export const deleteUserController = async (
  request: FastifyRequest<{ Params: { id: number } }>,
  reply: FastifyReply
) => {
  try {
    const id = request.params.id;
    if (isNaN(id)) {
      return reply.status(400).send({
        error: 'ID inválido',
      });
    }

    const user = await DBClient.getUserById(id);
    console.log('User to delete:\n\n', user); 

  if (!user || Object.values(user).length === 0) {
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

