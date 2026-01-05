
import Fastify from "fastify";
import jwt from "@fastify/jwt";
import cors from "@fastify/cors";
import Swagger from "@fastify/swagger";
import SwaggerUI from "@fastify/swagger-ui";
import 'dotenv/config';

import { usersRoutes } from "./modules/users/usersRoutes";
import { authRoutes } from "./modules/auth/authRoutes";

const app = Fastify({ logger: true });

app.register(jwt, {
  secret: process.env.JWT_SECRET || 'supersecretkey',
});

app.register(cors, {
  origin: true,       // cambiar a nuestro dominio cuando pasemos a produccion
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
});

app.register(Swagger, {
  openapi: {
    info: {
      title: "Transendence API",
      version: "1.0.0",
    },
  },
});

app.register(SwaggerUI, {
  routePrefix: "/docs",
  uiConfig: {
    docExpansion: "list",
    deepLinking: false,
  },
});

// const start = async () => {
//   await app.register(Swagger, {
//     openapi: {
//       info: {
//         title: "API Example",
//         version: "1.0.0",
//       },
//     },
//   });

//   await app.register(SwaggerUI, {
//     routePrefix: "/docs",
//     uiConfig: {
//       docExpansion: "list",
//       deepLinking: false,
//     },
//   });

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

const start = async () => {
  app.register(usersRoutes);
  app.register(authRoutes);
    await app.listen({ port: PORT, ...(HOST ? { host: HOST } : {}) }).then(() => {
      console.log("Server is running on http://localhost:3000");
    });
};

start();
