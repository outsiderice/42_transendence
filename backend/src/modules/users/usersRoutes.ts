import {FastifyInstance} from 'fastify';
import {usersController} from './usersControllers';

export const usersRoutes = (app: FastifyInstance) => {
  app.get('/users', usersController);

  app.get('/moco', () => {
    return { users: "moco" };

  });

  app.get<{Params: {id: number}}>('/testy/:id', {handler: usersController2});

};
