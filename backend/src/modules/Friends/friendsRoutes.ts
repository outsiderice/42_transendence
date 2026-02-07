import { FastifyInstance } from 'fastify';
import Friends, { DBClient } from '../../services/dbClient';
import {
    getAllFriendsController,
    createFriendPetitionController,
    getPetitionFriendsController,
    acceptFriendPetitionController,
    deleteFriendPetitionController
} from './friendsController';

export const FriendSchema = {
    type: 'object',
    required: [ 'user_1', 'user_2', 'petition_status'],
    properties: {
        id: { type: 'number' },
        user_1: { type: 'number' },
        user_2: { type: 'number' },
        petition_status: { type: 'number' },
    },
};
export const friendsRoutes = async (app: FastifyInstance) => {
    app.get<{ Querystring: { user_1: number } }>('/friends', {
        schema: {
            tags: ['Friends'],
            querystring: {
                type: 'object',
                required: ['user_1'],
                properties: {
                    user_1: { type: 'number' },
                },
            },
        } as any,
    }, getAllFriendsController);

    app.get<{ Querystring: { user_1: number } }>('/friendsPetitions', {
        schema: {
            tags: ['Friends'],
            querystring: {
                type: 'object',
                required: ['user_1'],
                properties: {
                    user_1: { type: 'number' },
                },
            },
        } as any,
    }, getPetitionFriendsController);


   app.post<{ Body: Friends }>(
  '/friends',
  {
    schema: {
      tags: ['Friends'],
      body: {
        type: 'object',
        required: ['user_1', 'user_2', 'petition_status'],
        properties: {
          user_1: { type: 'number' },
          user_2: { type: 'number' },
          petition_status: { type: 'number' },
        },
      },
    },
  },
  createFriendPetitionController
);

app.put<{ Querystring: { id: number } }>(
  '/friends/accept',
  {
    schema: {
      tags: ['Friends'],
      querystring: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'number' },
        },
      },
    },
  },
  acceptFriendPetitionController
);


app.delete<{ Querystring: { id: number } }>(
  '/friends',
  {
    schema: {
      tags: ['Friends'],
      querystring: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'number' },
        },
      },
    },
  },
  deleteFriendPetitionController
);


}


