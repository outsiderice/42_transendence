import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
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
app.get<{ Querystring: { user_1: number } }>('/games', {
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
    }, async (request: FastifyRequest<{ Querystring: { user_1: number } }>, reply: FastifyReply) => {
      try {
        const { user_1 } = request.query;
        const games = await GamesService.getAllGames(user_1);
        reply.status(200).send(games);
      } catch (error) {
        reply.status(400).send({ error: (error as Error).message });
      }
    });

};
