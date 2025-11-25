import {FastifyInstance} from 'fastify';
import {usersController} from './usersControllers';
import {usersController2} from './usersControllers';

export const usersRoutes = (app: FastifyInstance) => {
  app.get('/users', usersController);

  app.get<{Params: {id: number}}>('/testy/:id', {handler: usersController2});

};
