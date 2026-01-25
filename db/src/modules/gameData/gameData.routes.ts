import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { gameDataService, GameData } from './gameData.service';

export const gameDataRoutes = async (app: FastifyInstance) => {
    // CREATE Friend Petition
    app.post<{ Body: GameData }>('/gameData', {
      schema: {
        tags: ['gameData'],
        body: {
          type: 'object',
          required: ['player1_id'],
          properties: {
            player1_id: { type: 'number' },
          }, 
        },
      } as any,
    }, async (request: FastifyRequest<{ Body: GameData }>, reply: FastifyReply) => {
      try {
        const { player1_id} = request.body;
        console.log(player1_id,'\n');
        const newGameData = await gameDataService.postGamePetition({ player1_id });
        console.log('lulululu\n');
        reply.status(201).send(newGameData);
      } catch (error) {
        console.log(error.message);
        console.log('lolololo\n');
        reply.status(400).send({ error: (error as Error).message });
      }
    });
};