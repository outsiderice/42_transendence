import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';

/** 
LIST OF places where jwt plugin needs to be used as prehandler:
  authenticate:
  [] - POST /api/auth/logout
  [] - PUT /api/me
  [] - GET /api/me
  [] - GET /api/users
  [x] - GET /api/users/:id
  [] - POST /api/users/:id/add-friend
  [] - DELETE /api/users/:id/remove-friend
  [] - POST /api/games

  pageauthenticate:
  [] - GET /play-online
  [] - GET /dashboard
  [] - GET /settings
  [] - GET /users
  [] - GET /users/:id
 */


export default fp(async function (fastify: FastifyInstance) {
  fastify.register(jwt, {
    secret: process.env.JWT_SECRET || 'supersecretkey',
    cookie: {
      cookieName: 'refreshToken',
      signed: false,
    },
  });

  fastify.decorate("authenticateApi", async function(request: FastifyRequest, reply: FastifyReply) {
  try {
      
      const payload = await request.jwtVerify() as { id: number; username: string; type?: string;};
      if (payload.type !== 'access') {
        return reply.code(401).send({
          error: 'Invalid token type',
          message: 'Please provide a valid access token'
        });
      }
    } catch (err) {
      reply.code(401).send({
        error: 'Authentication required',
        message: 'Please provide a valid token'
      });
    }
  })

  fastify.decorate("authenticatePage", async function(request: FastifyRequest, reply: FastifyReply) {
  try {
      const payload = await request.jwtVerify() as { id: number; username: string; type?: string;};
      if (payload.type !== 'access') {
        return reply.code(401).send({
          error: 'Invalid token type',
          message: 'Please provide a valid access token'
        });
      }
    } catch (err) {
      reply.redirect('/sign-in');
    }
  })
});