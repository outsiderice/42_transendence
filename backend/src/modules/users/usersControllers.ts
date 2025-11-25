import { FastifyReply, FastifyRequest } from "fastify";

export const usersController = (req: FastifyRequest, res: FastifyReply) => {
  return { users: 'users' }

};

export const usersController2 = (req: FastifyRequest<Params: <{Params: {id: number}}>, res: FastifyReply) => {
  
  const params = req.params;

  return { users: params.id }
};
