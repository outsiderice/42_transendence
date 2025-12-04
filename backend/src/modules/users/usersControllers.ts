import { FastifyReply, FastifyRequest } from "fastify";

export const usersController = (req: FastifyRequest, res: FastifyReply) => {
  
  throw new Error('This is my test error');

  return { users: 'users'}
};

export const usersController2 = (req: FastifyRequest<{Params: {id: number}}>, res: FastifyReply) => {
  
  const params = req.params;

  return { users: params.id }
};

export const usersController3 = (req: FastifyRequest<{Querystring: {test: string}}>, res: FastifyReply) => {
  const test = req.query.test;

  return res.status(200).send(test)
};
