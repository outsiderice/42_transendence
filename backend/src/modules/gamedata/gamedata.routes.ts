import { FastifyInstance } from 'fastify';
import { createGameController } from './gamesdata.controllers';
import { GameSchema } from './gamedata.schema';

export const gamesDataRoutes = async (app: FastifyInstance) => {
  app.post('/games', {
    schema: {
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
};
