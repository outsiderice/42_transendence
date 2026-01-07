import fp from 'fastify-plugin'
import fastifyJwt from '@fastify/jwt'
import { FastifyInstance } from 'fastify'

interface JwtUserPayload {
  id: string
  username: string
}

export default fp(
  async (fastify: FastifyInstance) => {

    // Access token
    fastify.register(fastifyJwt, {
      secret: process.env.JWT_ACCESS_SECRET!,
      sign: {
        expiresIn: '1h'
      }
    })

    // Refresh token
    fastify.register(fastifyJwt, {
      secret: process.env.JWT_REFRESH_SECRET!,
      namespace: 'refresh',
      sign: {
        expiresIn: '7d'
      }
    })

    // verify token
    fastify.decorate(
      'authenticate',
      async (request) => {
        await request.jwtVerify()
      }
    )

    // verify refresh token
    fastify.decorate('verifyRefreshToken', async (request) => {
        await request.jwtVerify({ namespace: 'refresh' })
      }
    )

    // Generate access token
    fastify.decorate(
      'signAccessToken',
      (user: {
        id: string
        username: string
      }) => {
        const payload: JwtUserPayload = {
          id: user.id,
          username: user.username,
        }

        return fastify.jwt.sign(payload)
      }
    )

    // Generate refresh token
    fastify.decorate(
      'signRefreshToken',
      (userId: string) => {
        return fastify.refreshJwt.sign({
          sub: userId
        })
      }
    )
  },
  {
    name: 'jwt-plugin'
  }
)
