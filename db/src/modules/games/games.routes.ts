import { FastifyInstance } from 'fastify';
import { GamesService, GameDB } from './games.service';
import { GameSchema } from './games.schema';

export const gamesRoutes = async (app: FastifyInstance) => {
  app.post<{ Body: GameDB; }>('/games',
    {
      schema: {
        body: GameSchema,
        response: {
          201: GameSchema
        }
      }
    },
    (request, reply) => {
      const game = request.body as any;
      console.log(game, '\n---\n');

      const createdGame = GamesService.createGame(game);

      reply.status(201).send(createdGame);
    }
  );
};
