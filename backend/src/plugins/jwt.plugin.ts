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
	namespace: 'accessJWT',
    secret: process.env.JWT_SECRET || 'supersecretkey',
	cookie: {
		cookieName: 'accessToken',
		signed: false,
	}
  });

  fastify.register(jwt, {
	namespace: 'refreshJWT',
    secret: process.env.JWT_SECRET || 'supersecretkey',
    cookie: {
      cookieName: 'refreshToken',
      signed: false,
	}
  });

  fastify.decorate("authenticateApi", async function(request: FastifyRequest, reply: FastifyReply) {
  try {
      
      const payload = await request.accessJWT.jwtVerify({onlyCookie: true}) as { id: number; username: string; type?: string;};
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
      const payload = await request.accessJWT.jwtVerify({onlyCookie: true}) as { id: number; username: string; type?: string;};
		console.log("hell");
      if (payload.type !== 'access') {
        return reply.code(401).send({
          error: 'Invalid token type',
          message: 'Please provide a valid access token'
        });
      }
    } catch (err) {
      reply.redirect('/sign_in');
    }
  })
	fastify.decorateReply(
		"generateTokens", async function (user: {
			id: string;
			username: string;
			nickname: string;
		}) {

    //generar JWTs
    const accessToken = await this.jwtSign(
      { 
        id:       user.id,
        username: user.username,
        nickname: user.nickname,
        type:     'access'
      },
      { expiresIn: '15m' }
    );

    const refreshToken = await this.jwtSign(
      { 
        id:       user.id,
        username: user.username,
        nickname: user.nickname,
        type:     'refresh'
      },
      { expiresIn: '7d' }
    );

    this.setCookie('accessToken', accessToken, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 15,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    this.setCookie('refreshToken', refreshToken, {
      httpOnly: true,
      path: '/auth/refresh',
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });
	}

);}
