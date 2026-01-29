import { FastifyInstance } from 'fastify';
import {
	registerUserController,
 	loginUserController,
 	refreshTokenController,
	logoutUserController,
//  getCallbackController
} from './authController';


// schemas
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
  },
  required: ['id', 'username', 'email'],
};

export const UserRefreshSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    username: { type: 'string' },
  },
  required: ['id', 'username'],
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

//controller bodies types
export type RegisterUserBody = {
  username: string;
  email: 	string;
  password: string;
};

export type LoginUserBody = {
  username: string;
  password: string;
};

export type SafeUserResponese = {
  id:		number | undefined;
  username: string;
  email: 	string;
};

export type UserRefreshResponese = {
  id:		number;
  username: string;
};

//routes
export const authRoutes = async (app: FastifyInstance) => {
  // REGISTER USER

  app.post<{ Body: RegisterUserBody }>('/auth/register', {
    schema: {
      tags: ['Auth'],
      body: CreateUserSchema,
      response: {
        201: {UserSafeSchema: {type: 'object'}},
        400: { type: 'object', properties: { error: { type: 'string' } } },
        409: { type: 'object', properties: { error: { type: 'string' } } },
      },
    },
  }, registerUserController);

  // LOGIN USER
  app.post<{ Body: LoginUserBody }>('/auth/login', {
    schema: {
      tags: ['Auth'],
      body: LoginUserSchema,
      response: {
        200: {UserSafeSchema: {type: 'object'}},
        400: { type: 'object', properties: { error: { type: 'string' } } },
        404: { type: 'object', properties: { error: { type: 'string' } } },
      },
    },
  }, loginUserController);

  // REFRESH TOKEN
  app.post<{ Body: { refreshToken: string } }>('/auth/refresh', {
    schema: {
      tags: ['Auth'],
      },
      response: {
              	201: { UserRefreshSchema: {type: 'object'}},
        		401: { type: 'object', properties: { error: { type: 'string' } } },
		},
      }, refreshTokenController);

	app.post(
 	 '/auth/logout',
 	 {
  	  schema: {
     	 tags: ['Auth'],
      	response: {
        	200: {
         	 description: 'User successfully logged out',
          	type: 'null',
        	},
      	},
    	},
  	},
  	logoutUserController
	);

//   // GITHUB OAUTH CALLBACK
//   app.get('/auth/github/callback', {
//     schema: {
//       tags: ['Auth'],
//       response: { 
//         200: UserSchema,           
//         },
//       },
//     },getCallbackController);
}
