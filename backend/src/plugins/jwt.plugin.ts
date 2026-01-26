import fp from 'fastify-plugin';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import jwt from '@fastify/jwt';

export default fp(async function (fastify: FastifyInstance) {

  fastify.register(jwt, {
    secret: process.env.JWT_SECRET || 'supersecretkey',
	cookie: {
		cookieName: 'accessToken',
		signed: false,
	},
  });

	console.log(process.env.JWT_SECRET);

  // --- Authenticate API requests ---
  fastify.decorate("authenticateApi", async function(request: FastifyRequest, reply: FastifyReply) {
    try {
      const payload = await request.jwtVerify({ onlyCookie: true }) as { id: number; username: string; type?: string; };
      console.log("authenticateApi called"); // optional debug
      if (payload.type !== 'access') {
        return reply.code(401).send({
          error: 'Invalid token type',
          message: 'Please provide a valid access token'
        });
      }
    } catch {
      reply.code(401).send({
        error: 'Authentication required',
        message: 'Please provide a valid token'
      });
    }
  });

  // --- Authenticate Page requests ---
  fastify.decorate("authenticatePage", async function(request: FastifyRequest, reply: FastifyReply) {
    try {
      const payload = await request.jwtVerify({ onlyCookie: true }) as { id: number; username: string; type?: string; };
      if (payload.type !== 'access') {
        return reply.code(401).send({
          error: 'Invalid token type',
          message: 'Please provide a valid access token'
        });
      }
    } catch {
      reply.redirect('/sign_in');
    }
  });

  // --- Generate both access and refresh tokens ---
  fastify.decorateReply("generateTokens", async function(user: { id: string; username: string; nickname: string }) {

    const accessToken = await this.jwtSign(
      { id: user.id, username: user.username, nickname: user.nickname, type: 'access' },
      { expiresIn: '15m' }
    );

    const refreshToken = await this.jwtSign(
      { id: user.id, username: user.username, nickname: user.nickname, type: 'refresh' },
      { expiresIn: '7d' }
    );

    // --- Set cookies ---
    this.setCookie('accessToken', accessToken, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 15, // 15 minutes
      sameSite: 'none',
      secure: true,
    });

    this.setCookie('refreshToken', refreshToken, {
      httpOnly: true,
      path: '/api/auth/refresh',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      sameSite: 'none',
      secure: true,
    });

  });

});

