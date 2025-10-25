import Fastify from 'fastify';
import {usersRoutes} from './modules/users/usersRoutes';

const app = Fastify({logger : true});


const start = async () => {
  await usersRoutes(app);
  await app.listen({ port: 3000 }).then(() => {
    console.log('Server is running on http://localhost:3000');
  });
};
start();