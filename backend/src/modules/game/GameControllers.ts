import { FastifyRequest } from 'fastify';
import { pongGame } from ".pongGame.ts";

export const gameController = (
	connection: SocketStream,
	request: FastifyRequest,
) => {
	try {
		const username = await request.jwtVerify() as { 
			username : string; 
		}
		console.log(username + " wants to connect\n");
		
	}
}

