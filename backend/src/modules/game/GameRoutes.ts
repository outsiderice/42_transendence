import { FastifyInstance, FastifyRequest } from "fastify";
import { gameController } from './GameControllers';

export const gameRoutes = async (app: FastifyInstance) => {
  app.get('/ws/play', { websocket: true }, (connection: WebsocketHandler, request: FastifyRequest) => {
    
    gameController(connection, request);

  });
};


