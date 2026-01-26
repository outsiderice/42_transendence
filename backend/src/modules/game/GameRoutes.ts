import { FastifyInstance, FastifyRequest } from "fastify";
import { SocketStream } from '@fastify/websocket';
import { gameController } from './GameControllers';

export const gameRoutes = async (app: FastifyInstance) => {
  app.get('/ws/play', { websocket: true }, (connection: SocketStream, request: FastifyRequest) => {
    
    gameController(connection, request);

  });
};


