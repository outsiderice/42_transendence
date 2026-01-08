import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';

export default fp(async function (fastify: FastifyInstance) {
  fastify.register(jwt, {
    secret: process.env.JWT_SECRET || 'supersecretkey',
  });

  fastify.decorate("authenticate", async function(request: FastifyRequest, reply: FastifyReply) {
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
})