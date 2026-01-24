import { FastifyInstance } from 'fastify'
import { heartbeat, getOnlineUserIds } from './presence.Controllers.js'

export async function presenceRoutes(app: FastifyInstance) {

  app.post('/presence/heartbeat/:userId',  async (req) => {
      const { userId } = req.params as { userId: string }
      heartbeat(userId)
      return { ok: true }
    })

  app.get('/presence', async () => {
    return getOnlineUserIds()
  })
}
