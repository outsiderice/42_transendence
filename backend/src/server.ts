import Fastify from "fastify";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import oauthPlugin from "@fastify/oauth2";
import Swagger from "@fastify/swagger";
import SwaggerUI from "@fastify/swagger-ui";

//our plugins
import jwtplugin from './plugins/jwt.plugin';

//our routes
import websocket from "@fastify/websocket";
import { usersRoutes } from "./modules/users/usersRoutes";
import { authRoutes } from "./modules/auth/authRoutes";
import { friendsRoutes } from "./modules/Friends/friendsRoutes";

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
app.register(websocket);
app.register(cookie);

app.register(oauthPlugin, {
  name: 'githubOAuth2',
  scope: ['user:email'],
  credentials: {
    client: {
      id: process.env.CLIENT_ID || '',
      secret: process.env.CLIENT_SECRET || '',
    },
    auth: oauthPlugin.GITHUB_CONFIGURATION,
  },
  startRedirectPath: '/auth/github/login',
  callbackUri: 'http://localhost:3000/auth/github/callback',
  cookie: {
    secure: true,
  }
});

app.register(Swagger, {
  openapi: {
    info: {
      title: "Transendence API",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        accessToken: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
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

app.register(jwtplugin);

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

const start = async () => {
  app.register(usersRoutes);
  app.register(authRoutes);
  app.register(friendsRoutes);
  app.register(pongGame);
  await app.listen({ port: PORT, ...(HOST ? { host: HOST } : {}) }).then(() => {
      console.log("Server is running on http://localhost:3000");
    });
};


start();