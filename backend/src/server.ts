// external imports
import 'dotenv/config';
import Fastify from "fastify";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import oauthPlugin from "@fastify/oauth2";
import Swagger from "@fastify/swagger";
import SwaggerUI from "@fastify/swagger-ui";

//our plugins
import jwtplugin from './plugins/jwt.plugin';

//our routes
import { usersRoutes } from "./modules/users/usersRoutes";
import { authRoutes } from "./modules/auth/authRoutes";

const app = Fastify({ logger: true });

app.register(cors, {
  origin: true,       // cambiar a nuestro dominio cuando pasemos a produccion
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
});

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
    await app.listen({ port: PORT, ...(HOST ? { host: HOST } : {}) }).then(() => {
      console.log("Server is running on http://localhost:3000");
    });
};

start();
