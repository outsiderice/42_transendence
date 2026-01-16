import { FastifyInstance } from "fastify";

//callback route for oauth providers
export async function oauthRoutes(fastify: FastifyInstance) {
//get token and user info from github
//populate request.user with user info
//check if user exists in database
//then call login or register logic
}