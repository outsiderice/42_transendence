import Fastify from 'fastify';
import type { FastifyRequest, FastifyReply } from 'fastify';
import 'dotenv/config';
import { initializeDatabase } from './config/sqlite';
import { usersRoutes } from './modules/users/users.routes';


const DB_API_KEY = process.env.DB_API_KEY || 'JoseMiguel';
const PORT = Number(process.env.DB_SERVICE_PORT) || 3001;
const HOST = process.env.DB_SERVICE_HOST || '0.0.0.0';

const app = Fastify({ logger: true });

const start = async () => {
  try {
    // Inicializar base de datos
    initializeDatabase();

    //apy-key
    

// Hook global para validar API key
      app.addHook('onRequest', async (request: FastifyRequest, reply: FastifyReply) => {
    // Solo proteger rutas que empiezan con /api
    if (!request.url.startsWith('/api'))
      return;

    const apiKey = request.headers['x-api-key'];
    if (apiKey !== DB_API_KEY) {
      return reply.status(401).send({ error: 'Unauthorized: invalid API key' });
    }
  });


    // Registrar rutas
    app.register(usersRoutes, { prefix: '/api' });

    // Health check
    app.get('/health', async () => {
      return { status: 'ok', service: 'db-service' };
    });

    // Iniciar servidor
    await app.listen({ port: PORT, host: HOST });
    console.log(`DB Service running on http://${HOST}:${PORT}`);
    console.log(`Swagger UI available at http://localhost:${PORT}/docs`);
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

start();
