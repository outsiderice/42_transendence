import { FastifyRequest } from 'fastify';
import { SocketStream } from '@fastify/websocket';
//import { pongGame } from ".pongGame.ts";

export const gameController = async (
	connection: SocketStream,
	request: FastifyRequest,
) => {
	try {
		const payload = await request.jwtVerify<{username: string}>();
		const {username} = payload;
		console.log(`${username} wants to connect`);
		
	}
	catch (err){
		console.log("something went wrong\n", err);
	}
}

