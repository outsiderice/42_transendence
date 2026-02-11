import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { friendsService, Friends, Petitions } from './friends.service';

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
    // READ ALL Friends by user_1 id
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
    }, async (request: FastifyRequest<{ Querystring: { user_1: number } }>, reply: FastifyReply) => {
      try {
        const { user_1 } = request.query;
        const friends = await friendsService.getAllFriendsPetitions(user_1);
        reply.status(200).send(friends);
      } catch (error) {
        reply.status(400).send({ error: (error as Error).message });
      }
    });

    // READ ALL Petitions by user_1 id
    app.get<{ Querystring: { user_1: number } }>('/petitions', {
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
        const friends = await friendsService.getAllPetitions(user_1);
        reply.status(200).send(friends);
      } catch (error) {
        reply.status(400).send({ error: (error as Error).message });
      }
    });

      // ACCEPT Friend Petition
    app.put<{ Querystring: { id: number } }>('/friends/accept', {
      schema: {
        tags: ['Friends'],
        querystring: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'number' },
          },
        },
      } as any,
    }, async (request: FastifyRequest<{ Querystring: { id: number } }>, reply: FastifyReply) => {
      try {
        const { id } = request.query;
        await friendsService.AcceptFriendPetition(id);
        reply.status(200).send({ message: 'Friend petition accepted' });
      } catch (error) {
        reply.status(400).send({ error: (error as Error).message });
      }
    });

    // DELETE Friend Petition
    app.delete<{ Querystring: { id: number } }>('/friends', {
      schema: {
        tags: ['Friends'],
        querystring: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'number' },
          },
        },
      } as any,
    }, async (request: FastifyRequest<{ Querystring: { id: number } }>, reply: FastifyReply) => {
      try {
        const { id } = request.query;
        await friendsService.DeleteFriendPetition(id);
        reply.status(200).send({ message: 'Friend petition deleted' });
      } catch (error) {
        reply.status(400).send({ error: (error as Error).message });
      }
    });
} 
