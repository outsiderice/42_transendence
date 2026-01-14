import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { friendsService, Friends } from './friends.service';

export const friendsRoutes = async (app: FastifyInstance) => {
  // CREATE Friend Petition
  app.post<{ Body: Friends }>('/friends', {
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
    } as any,
  }, async (request: FastifyRequest<{ Body: Friends }>, reply: FastifyReply) => {
    try {
      const { user_1, user_2, petition_status } = request.body;
      const newFriendRetalion = await friendsService.postFriendPetition({ user_1, user_2, petition_status });
      reply.status(201).send(newFriendRetalion);
    } catch (error) {
      reply.status(400).send({ error: (error as Error).message });
    }
  });
    // READ ALL Friends
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
    }, async (request: FastifyRequest<{ Querystring: { user_1: number } }>, reply: FastifyReply) => {
      try {
        const { user_1 } = request.query;
        const friends = await friendsService.getAllFriends(user_1);
        reply.status(200).send(friends);
      } catch (error) {
        reply.status(400).send({ error: (error as Error).message });
      }
    });
}