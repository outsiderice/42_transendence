import Fastify from "fastify";
import websocket from "@fastify/websocket";
import { usersRoutes } from "./modules/users/usersRoutes";
import { authRoutes } from "./modules/auth/authRoutes";
import { pongGame } from "./modules/game/pongGame.js";
import Swagger from "@fastify/swagger";
import SwaggerUI from "@fastify/swagger-ui";
import 'dotenv/config';
import cors from "@fastify/cors";

// 1. Setup the basic App
const app = Fastify({ logger: true });

// 2. Setup Security
app.register(cors, {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
});

const start = async () => {
  // 3. Register Plugins
  await app.register(websocket);
  
  await app.register(Swagger, {
    openapi: { info: { title: "API Example", version: "1.0.0" } },
  });

  await app.register(SwaggerUI, {
    routePrefix: "/docs",
  });

  // 4. Register Game and Routes
  // We use await here to make sure the websocket plugin is ready
  await app.register(usersRoutes);
  await app.register(authRoutes);
  await app.register(pongGame);

  // 5. Define connection details correctly for Docker
  // '0.0.0.0' is the "magic number" that lets Docker talk to the outside world
  const LISTEN_PORT = Number(process.env.PORT) || 3000;
  const LISTEN_HOST = '0.0.0.0'; 

  try {
    await app.listen({ port: LISTEN_PORT, host: LISTEN_HOST });
    console.log(`🚀 Server is listening on http://${LISTEN_HOST}:${LISTEN_PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();