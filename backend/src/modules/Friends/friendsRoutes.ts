import { FastifyInstance } from 'fastify';
import Friends from '../../services/dbClient';
import {
    getAllFriendsController,
    createFriendPetitionController,
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
}


