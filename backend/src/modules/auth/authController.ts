import { FastifyInstance } from 'fastify';
import fastify, { FastifyRequest, FastifyReply } from 'fastify';
import { DBClient, User } from '../../services/dbClient';
import * as bcrypt from 'bcrypt';


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
      ...(nickname && { nickname }),
      ...(avatar && { avatar }),
    });
    //evita devolver el password en la respuesta
    const { password: _, ...safeUser } = newUser;

    //generar JWT
    const token = await reply.jwtSign(
      { 
        id: newUser.id,
        username: newUser.username,
        nickname: newUser.nickname,
        avatar: newUser.avatar
      },
      { expiresIn: '1h' }
    );

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

    //generar JWT
    const token = await reply.jwtSign(
      { 
        id: existingUsername.id,
        username: existingUsername.username,
        nickname: existingUsername.nickname,
        avatar: existingUsername.avatar
      },
      { expiresIn: '1h' }
    );

    reply.status(201).send({ user: safeUser, token });
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