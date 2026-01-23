import { FastifyInstance, FastifyRequest } from "fastify";
import { SocketStream } from '@fastify/websocket';
import { gameController } from './GameControllers';

export const gameRoutes = async (app: FastifyInstance) => {
  app.get('/ws/play', { websocket: true }, (connection: SocketStream, request: FastifyRequest) => {
    
    // Check JWT from cookie
    const token = request.cookies.accessToken;
    if (!token) {
      return connection.socket.close(1008, 'Unauthorized access');
    }

    // Authorized: call game controller
    gameController(connection, request);

  });
};


