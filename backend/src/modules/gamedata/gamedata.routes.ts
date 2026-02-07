import { FastifyInstance } from 'fastify';
import { createGameController, getAllGamesController } from './gamesdata.controllers';
import { GameSchema } from './gamedata.schema';

export const gamesDataRoutes = async (app: FastifyInstance) => {
  app.post('/games', {
    schema: {
      tags : ['game_data'],
      body: GameSchema,
      response: {
        201: GameSchema,
        400: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        },
        500: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        }
      }
    }
  }, createGameController);

 
  app.get('/games',
    {
      schema: {
        querystring: {
          type: 'object',
          required: ['user_1'],
          properties: {
            user_1: { type: 'number' }
          }
        }
      }
    },getAllGamesController);
}

