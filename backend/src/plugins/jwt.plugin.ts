import fp from 'fastify-plugin';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import jwt from '@fastify/jwt';

export default fp(async function (fastify: FastifyInstance) {

  // --- Register access JWT ---
  fastify.register(jwt, {
    namespace: 'accessJWT',
    secret: process.env.JWT_SECRET || 'supersecretkey',
    cookie: {
      cookieName: 'accessToken',
      signed: false,
    }
  });

  // --- Register refresh JWT ---
  fastify.register(jwt, {
    namespace: 'refreshJWT',
    secret: process.env.JWT_SECRET || 'supersecretkey',
    cookie: {
      cookieName: 'refreshToken',
      signed: false,
    }
  });

  // --- Authenticate API requests ---
  fastify.decorate("authenticateApi", async function(request: FastifyRequest, reply: FastifyReply) {
    try {
      const payload = await request.accessJWT.jwtVerify({ onlyCookie: true }) as { id: number; username: string; type?: string; };
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
      const payload = await request.accessJWT.jwtVerify({ onlyCookie: true }) as { id: number; username: string; type?: string; };
      console.log("hell"); // optional debug
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

    const accessToken = await this.accessJWT.jwtSign(
      { id: user.id, username: user.username, nickname: user.nickname, type: 'access' },
      { expiresIn: '15m' }
    );

    const refreshToken = await this.refreshJWT.jwtSign(
      { id: user.id, username: user.username, nickname: user.nickname, type: 'refresh' },
      { expiresIn: '7d' }
    );

    // --- Set cookies ---
    this.setCookie('accessToken', accessToken, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 15, // 15 minutes
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    this.setCookie('refreshToken', refreshToken, {
      httpOnly: true,
      path: '/auth/refresh',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });

  });

});

