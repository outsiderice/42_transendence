import 'fastify';

declare module 'fastify' {
  interface FastifyInstance {
    // permissive declaration to avoid conflicts with plugin-provided types
    swagger?: (...args: any[]) => any;
  }
}
