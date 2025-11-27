import {FastifyInstance} from 'fastify';
import {usersController, usersController2, usersController3} from './usersControllers';

export const usersRoutes = (app: FastifyInstance) => {
  app.get('/users', usersController);

  app.get<{Params: {id: number}}>('/test1/:id', {handler: usersController2});

  app.get<{Querystring: {test: string}}>('/test2', {
    schema: {
      querystring: {
        type: "object" ,
        properties: {
          test: {type: "string"}
        },
        required: ["test"]
      }
    },
    handler: usersController3}
  );

  app.setErrorHandler((error: Error, req: FastifyRequest, res: FasfyReply) => {
    console.error(error)

    return res.status(409).send({ok: false});
  })

}
