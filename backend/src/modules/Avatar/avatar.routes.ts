import { FastifyInstance } from "fastify"
import path from "path"
import { randomUUID } from "crypto"
import { Readable } from "stream"
import { User, DBClient}from "./../../services/dbClient"
import {avatarService} from "./../../services/avatarService"

export async function avatarRoutes(app: FastifyInstance) {

  /*    POST AVATAR  */

  app.post(
    "/avatar/:id",
    {
//    preHandler: app.authenticateApi,
      schema: {
        description: "Upload user avatar",
        tags: ["Avatar"],
        consumes: ["multipart/form-data"], // Para Swagger UI
        params: {
          type: "object",
          properties: {
            id: { type: "string" },
          },
          required: ["id"],
        },
        response: {
          201: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              avatar: { type: "string" },
            },
          },
          400: {
            type: "object",
            properties: { error: { type: "string" } },
          },
          404: {
            type: "object",
            properties: { error: { type: "string" } },
          },
          415: {
            type: "object",
            properties: { error: { type: "string" } },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const { id } = request.params as { id: string };
        const numericId = Number(id);
  
        if (Number.isNaN(numericId)) {
          return reply.status(400).send({ error: "Invalid user id" });
        }
  
        const part = await request.file();
        const buffer = await part.toBuffer();
  
        if (!part) {
          return reply.status(400).send({ error: "File required" });
        }
        
        const isValid = await avatarService.validateAvatar(part.mimetype);

       
        if (!isValid) {
          return reply.status(415).send({ error: "Invalid image file" });
        }
  
        const user = await DBClient.getUserById(numericId);
        if (!user) {
          return reply.status(404).send({ error: "User not found" });
        }
  
        if (user.avatar && user.avatar != "avatar") {
          try {
            await avatarService.deleteAvatar(user.avatar);
          } catch (err) {
            console.warn("Old avatar delete failed:", err);
          }
        }
  
        const extension = path.extname(part.filename) || ".png";
        const safeUsername = user.username.replace(/[^a-zA-Z0-9_-]/g, "");
        const filename = `${safeUsername}_${randomUUID()}${extension}`;
          
        await avatarService.uploadAvatar( { file: Readable.from(buffer) }, filename);
  
        const updatedUser: Partial<User> = { avatar: filename };
        await DBClient.updateUser(numericId, updatedUser);
  
        return reply.status(201).send({ success: true, avatar: filename });
      } catch (error) {
        console.error("Post avatar error:", error);
        return reply.status(415).send({ error: "Error uploading avatar" });
      }
    }
  );
  
}
