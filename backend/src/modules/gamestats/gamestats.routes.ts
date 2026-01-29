// src/modules/dashboard/dashboard.routes.ts

import { FastifyInstance } from 'fastify'
import  calculateGameStats  from './gamestats.controller'
import { DBClient } from '../../services/dbClient' // ajusta la ruta si hace falta

export async function dashboardRoutes(app: FastifyInstance) {

  app.get(
    '/dashboard/:userId',
    async (request, reply) => {
      try {
        const { userId } = request.params as { userId: string }
        const numericUserId = Number(userId)

        if (Number.isNaN(numericUserId)) {
          return reply.status(400).send({ error: 'userId inválido' })
        }

        const games = await DBClient.getAllGames(numericUserId)

        const stats = calculateGameStats(numericUserId, games)

        return reply.status(200).send({
          totalGames: games.length,
          stats
        })
      } catch (error) {
        console.error('Dashboard error:', error)
        return reply.status(500).send({
          error: 'Error al obtener dashboard'
        })
      }
    }
  )

}
