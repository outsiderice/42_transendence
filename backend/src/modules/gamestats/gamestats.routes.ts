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

  app.get(
  '/ranking/users',
  async (request, reply) => {
    try {

      const users = await DBClient.getAllUsers()
      const validUsers = users.filter(
        (user): user is typeof user & { id: number } => user.id !== undefined
      )

      const ranking = await Promise.all(
        validUsers.map(async (user) => {

          const games = await DBClient.getAllGames(user.id)

          const stats = calculateGameStats(user.id, games)

          return {
            id: user.id,
            nickname: user.nickname === null ? user.username: user.nickname,
            username : user.username,
            wins: stats.wins,
            winRate: stats.winRate
          }
        })
      )

      const top10 = ranking
        .sort((a, b) => b.wins - a.wins)
        .slice(0, 10)

      return reply.status(200).send(top10)

    } catch (error) {
      console.error('Ranking error:', error)
      return reply.status(500).send({
        error: 'Error al obtener ranking'
      })
    }
  }
)

}
