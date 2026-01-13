import { FastifyInstance } from 'fastify';
import { User } from '../../services/dbClient';
import {
 registerUserController,
  loginUserController,
  refreshTokenController
} from './authController';

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
  required: ['id', 'username', 'email'],
};

export const CreateUserSchema = {
  type: 'object',
  required: ['username', 'email', 'password'],
  properties: {
    username: { type: 'string' },
    email: { type: 'string' },
    password: { type: 'string' }
  },
};

export const authRoutes = async (app: FastifyInstance) => {
  // REGISTER USER

  app.post<{ Body: Omit<User, 'id' | 'nickname' | 'avatar' | 'created_at' | 'updated_at'> }>('/auth/register', {
    schema: {
      tags: ['Auth'],
      body: CreateUserSchema,
      response: {
        201: UserSafeSchema,
        400: { type: 'object', properties: { error: { type: 'string' } } },
        409: { type: 'object', properties: { error: { type: 'string' } } },
      },
    },
  }, registerUserController);

  // LOGIN USER
  app.post<{ Body: { username: string; password: string } }>('/auth/login', {
    schema: {
      tags: ['Auth'],
      body: LoginUserSchema,
      response: {
        200: UserSafeSchema,
        400: { type: 'object', properties: { error: { type: 'string' } } },
        404: { type: 'object', properties: { error: { type: 'string' } } },
      },
    },
  }, loginUserController);

  // REFRESH TOKEN
  app.post<{ Body: { refreshToken: string } }>('/auth/refresh', {
    schema: {
      tags: ['Auth'],
      body: {
        type: "object",
        required: ["refreshToken"],
        properties: {
          refreshToken: { type: "string" },
        },
      },
      response: {
              200: {
                type: "object",
                properties: {
                  accessToken: { type: "string" },
                },
              },
      },
    },
  },refreshTokenController);
};