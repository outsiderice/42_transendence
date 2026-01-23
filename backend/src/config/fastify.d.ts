import { FastifyReply, FastifyRequest } from 'fastify'
import { OAuth2Namespace } from '@fastify/oauth2'

declare module 'fastify' {
  interface FastifyInstance {
    authenticateApi(
      request: FastifyRequest,
      reply: FastifyReply
    ): Promise<void>;

    authenticatePage(
      request: FastifyRequest,
      reply: FastifyReply
    ): Promise<void>;
	generateTokens(user:{ 
		id: string;
		username: string;
		nickname: string;
	}): Promise<void>;

    githubOAuth2: OAuth2Namespace;
  }
}
