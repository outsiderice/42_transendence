import { FastifyInstance } from 'fastify'
import { heartbeat, getOnlineUserIds } from './presence.Controllers.js'
import { DBClient } from '../../services/dbClient.js'

export async function presenceRoutes(app: FastifyInstance) {

  app.post('/presence/heartbeat/:userId',  async (req) => {
      const { userId } = req.params as { userId: string }
      heartbeat(userId)
      return { ok: true }
    })

  app.get('/presence', async () => {
    return getOnlineUserIds()
  })

  app.get('/presence/friends/:userId', async (req) => {
    const { userId } = req.params as { userId: string }
    const friends = DBClient.getAllFriends(Number(userId))
    const friendsList = await friends
    const friendIds: number[] = []

    for (const friend of friendsList) {
        let friendId: number
        if (friend.user_1 === Number(userId)) {
            friendId = friend.user_2
        } else {
            friendId = friend.user_1
        }
        friendIds.push(friendId)
    }
  
    const onlineIdsSet = new Set(getOnlineUserIds().map(id => Number(id)))
    const onlineFriendIds = friendIds.filter(id => onlineIdsSet.has(id))

    return { onlineFriendIds }
    })
  
}
