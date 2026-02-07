import { FastifyInstance } from "fastify"
import path from "path"
import { randomUUID } from "crypto"
import { Readable } from "stream"
import { User, DBClient}from "./../../services/dbClient"
import ServiceAvatar from "./../services/avatarService"


const avatarService = new ServiceAvatar()

const AVATAR_DIR = path.join(process.cwd(), "uploads", "avatars")

export async function avatarRoutes(app: FastifyInstance) {

  /*      GET AVATAR    */

  app.get("/avatar/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const numericId = Number(id)

      if (Number.isNaN(numericId)) {
        return reply.status(400).send({ error: "Invalid user id" })
      }

      const user = await DBClient.getUserById(numericId)

      if (!user) {
        return reply.status(404).send({ error: "User not found" })
      }

      if (!user.avatar) {
        return reply.status(404).send({ error: "User has no avatar" })
      }

     
      const stream = await avatarService.download(user.avatar)

      reply.type("application/octet-stream")
      return reply.send(stream)

    } catch (error) {
      console.error("Get avatar error:", error)
      return reply.status(500).send({
        error: "Error retrieving avatar"
      })
    }
  })

  /*    POST AVATAR  */

  app.post("/avatar/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const numericId = Number(id)

      if (Number.isNaN(numericId)) {
        return reply.status(400).send({ error: "Invalid user id" })
      }

      const part = await request.file()

      if (!part) {
        return reply.status(400).send({ error: "File required" })
      }

      
      const buffer = await part.toBuffer()
      const validationStream = Readable.from(buffer)

      const isValid = await avatarService.validate(validationStream)

      if (!isValid) {
        return reply.status(415).send({ error: "Invalid image file" })
      }

      const user = await DBClient.getUserById(numericId)
      if (!user) {
        return reply.status(404).send({ error: "User not found" })
      }

      if (user.avatar) {
        try {
          await avatarService.delete(user.avatar)
        } catch (err) {
          console.warn("Old avatar delete failed:", err)
        }
      }

      const extension = path.extname(part.filename) || ".png"
      const safeUsername = user.username.replace(/[^a-zA-Z0-9_-]/g, "")
      const filename = `${safeUsername}_${randomUUID()}${extension}`
      const uploadStream = Readable.from(buffer)

      await avatarService.upload(uploadStream, filename)

      const updatedUser: Partial<User> = {
        avatar: filename
      }
    
      await DBClient.updateUser(numericId, updatedUser)
      return reply.status(201).send({
        success: true,
        avatar: filename
      })

    } catch (error) {
      console.error("Post avatar error:", error)
      return reply.status(500).send({
        error: "Error uploading avatar"
      })
    }
  })
}
