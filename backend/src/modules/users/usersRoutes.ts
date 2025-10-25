import {FastifyInstance} from 'fastify';
import {usersController} from './usersControllers';

export const usersRoutes = (app: FastifyInstance) => {
  app.get('/users',usersController);

  app.get('/moco', () => {
    return { users: "moco" };

  });

};


