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
  });

  fastify.decorate("authenticateApi", async function(request: FastifyRequest, reply: FastifyReply) {
  try {
      // This will verify the JWT and populate request.user
      await request.jwtVerify();
    } catch (err) {
      reply.code(401).send({
        error: 'Authentication required',
        message: 'Please provide a valid token'
      });
    }
  })

  fastify.decorate("authenticatePage", async function(request: FastifyRequest, reply: FastifyReply) {
  try {
      // This will verify the JWT and populate request.user
      await request.jwtVerify();
    } catch (err) {
      reply.redirect('/sign-in');
    }
  })

    fastify.decorate("verifyRefreshToken", async function(request: FastifyRequest, reply: FastifyReply) {
  try {
      // This will verify the JWT and populate request.user
      await request.jwtVerify();
    } catch (err) {
      reply.code(401).send({
        error: 'Authentication required',
        message: 'Authentication has expired, please log in again'
      });
    }
  })
})