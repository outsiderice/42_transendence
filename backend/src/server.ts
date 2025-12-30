
import Fastify from "fastify";
import { usersRoutes } from "./modules/users/usersRoutes";
import Swagger from "@fastify/swagger";
import SwaggerUI from "@fastify/swagger-ui";
import 'dotenv/config';
import cors from "@fastify/cors";



const PORT = Number(process.env.PORT);
const HOST = process.env.HOST;

const app = Fastify({ logger: true });

app.register(require('@fastify/jwt'), {
  secret: process.env.JWT_SECRET,
})

app.register(cors, {
  origin: true,       // cambiar a nuestro dominio cuando pasemos a produccion
  credentials: true,
});

const start = async () => {
  await app.register(Swagger, {
    openapi: {
      info: {
        title: "API Example",
        version: "1.0.0",
      },
    },
  });

  await app.register(SwaggerUI, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "list",
      deepLinking: false,
    },
  });

app.register(usersRoutes);
  await app.listen({ port: PORT, ...(HOST ? { host: HOST } : {}) }).then(() => {
    console.log("Server is running on http://localhost:3000");
  });
};

start();
