import Fastify from 'fastify';
import 'dotenv/config';
import { initializeDatabase } from './config/sqlite';
import { usersRoutes } from './modules/users/users.routes';

const PORT = Number(process.env.DB_SERVICE_PORT) || 3001;
const HOST = process.env.DB_SERVICE_HOST || '0.0.0.0';

const app = Fastify({ logger: true });

const start = async () => {
  try {
    // Inicializar base de datos
    initializeDatabase();

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
