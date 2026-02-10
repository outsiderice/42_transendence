// modules/users/usersRoutes.ts
import { FastifyInstance } from 'fastify';
import { User } from '../../services/dbClient';
import {
  getAllUsersController,
  getUserByIdController,
  getUserByUsernameController,
  createUserController,
  updateUserController,
  deleteUserController,
  getUserFriendsController,
  getUserPetitionsController
} from './Controllers/userControllers';

// Schemas para Fastify + Swagger
export const UserSchema = {
  type: 'object',
  required: ['id', 'username', 'email', 'password'],
  properties: {
    id: { type: 'number' },
    username: { type: 'string' },
    email: { type: 'string' },
    password: { type: 'string' },
    nickname: { type: 'string' },
    avatar: { type: 'string' },
    created_at: { type: 'string' },
    updated_at: { type: 'string' },
  },
};

export const LoginUserSchema = {
  type: 'object',
  required: ['username', 'password'],
  properties: {
    username: { type: 'string' },
    password: { type: 'string' },
  },
};

export const UserSafeSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    username: { type: 'string' },
    email: { type: 'string' },
    nickname: { type: 'string' },
    avatar: { type: 'string' },
    created_at: { type: 'string' },
    updated_at: { type: 'string' },
  },
  required: ['id', 'username', 'email', 'created_at', 'updated_at'],
};

export const CreateUserSchema = {
  type: 'object',
  required: ['username', 'email', 'password'],
  properties: {
    username: { type: 'string' },
    email: { type: 'string' },
    password: { type: 'string' },
    nickname: { type: 'string' },
    avatar: { type: 'string' },
  },
};

export const UpdateUserSchema = {
  type: 'object',
  properties: {
    username: { type: 'string' },
    email: { type: 'string' },
    password: { type: 'string' },
    oldpassword: { type: 'string' },
    nickname: { type: 'string' },
    avatar: { type: 'string' },
  },
};

export const PetitionSchema = {
  type: 'object',
  required: [
	'id', 
	'user_1_id', 
	'user_1_username',
	'user_1_nickname',
	'user_2_id', 
	'user_2_username',
	'user_2_nickname',
	'petition_status'
	],
  properties: {
    id: { type: 'number' },
    user_1_id: { type: 'number' },
	user_1_username: { type : 'string'},
	user_1_nickname: { type : 'string'},
    user_2_id: { type: 'number' },
	user_2_username: { type : 'string'},
	user_2_nickname: { type : 'string'},
    status: { type: 'number' },
  },
};

export const usersRoutes = async (app: FastifyInstance) => {

  // READ ALL
  app.get('/users', {
    schema: {
      tags: ['Users'],
      response: { 200: { type: 'array', items: UserSchema } },
    },
  }, getAllUsersController);

  //user friends
  app.get<{ Params: { id: number } }>('/usersFriends/:id', {
  schema: {
    tags: ['Users'],
    params: {
      type: 'object',
      required: ['id'],
      properties: {
        id: { type: 'number' }
      }
    },
    response: { 200: { type: 'array', items: UserSchema } },
  } as any
}, getUserFriendsController);


  //user pending petitions
  app.get<{ Params: { id: number } }>('/usersPetitions/:id', {
  schema: {
    tags: ['Users'],
    params: {
      type: 'object',
      required: ['id'],
      properties: {
        id: { type: 'number' }
      }
    },
    response: { 200: { type: 'array', items: PetitionSchema } },
  } as any
}, getUserPetitionsController);

  // READ BY ID
  app.get<{ Params: { id: string } }>('/users/:id', {
    preHandler: app.authenticateApi,
    schema: {
      tags: ['Users'],
      security: [{ accessToken: [] }],
      params: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] },
      response: {
        200: UserSchema,
        400: { type: 'object', properties: { error: { type: 'string' } } },
        404: { type: 'object', properties: { error: { type: 'string' } } },
      },
    },
  }, getUserByIdController);

  // READ BY USERNAME
  app.get<{ Params: { username: string } }>('/users/by-username/:username', {
    preHandler: app.authenticateApi,
    schema: {
      tags: ['Users'],
      security: [{ accessToken: [] }],
      params: { type: 'object', properties: { username: { type: 'string' } }, required: ['username'] },
      response: {
        200: UserSchema,
        404: { type: 'object', properties: { error: { type: 'string' } } },
      },
    },
  }, getUserByUsernameController);

  // UPDATE
  app.put<{ Params: { id: string }; Body: Partial<User> }>('/users/:id', {
    schema: {
      tags: ['Users'],
      params: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] },
      body: UpdateUserSchema,
      response: {
        200: UserSchema,
        400: { type: 'object', properties: { error: { type: 'string' } } },
        404: { type: 'object', properties: { error: { type: 'string' } } },
      },
    },
  }, updateUserController);

  // DELETE
  app.delete<{ Params: { id: string } }>('/users/:id', {
    schema: {
      tags: ['Users'],
      params: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] },
      response: {
        200: { type: 'object', properties: { message: { type: 'string' } } },
        400: { type: 'object', properties: { error: { type: 'string' } } },
        404: { type: 'object', properties: { error: { type: 'string' } } },
      },
    },
  }, deleteUserController);
};
