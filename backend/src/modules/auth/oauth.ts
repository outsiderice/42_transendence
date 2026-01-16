import { FastifyInstance } from "fastify";

//callback route for oauth providers
export async function oauthCallbackRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/auth/oauth/callback/:provider",
    async (request, reply) => {
      const { provider } = request.params as { provider: string };

      // Handle OAuth callback logic here
      // This typically involves exchanging a code for an access token,
      // fetching user info from the provider, and creating or updating
      // a user in your database.

      return reply.send({ message: `OAuth callback for provider: ${provider}` });
    })
  ;
}