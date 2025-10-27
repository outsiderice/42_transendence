import Fastify from 'fastify';
import {usersRoutes} from './modules/users/usersRoutes';
import Swagger from "@fastify/swagger";
import SwaggerUI from "@fastify/swagger-ui";

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '127.0.0.1';

const app = Fastify({logger : true});

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
  await usersRoutes(app);
  await app.listen({ port: PORT, host: HOST }).then(() => {
    console.log('Server is running on http://localhost:3000');
  });
  
};
start();
