import { FastifyReply, FastifyRequest } from 'fastify'

declare module 'fastify' {
  interface FastifyInstance {
    authenticateApi(
      request: FastifyRequest,
      reply: FastifyReply
    ): Promise<void>

    authenticatePage(
      request: FastifyRequest,
      reply: FastifyReply
    ): Promise<void>
  }
}