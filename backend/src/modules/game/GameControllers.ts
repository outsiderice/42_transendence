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
//		const { username } = await request.jwtVerify<{ username: string }>({
//		token: accessToken,
//		onlyCookie: false,
//		})
//		console.log(username + " wants to connect\n");
		
	}
	catch (err){
		console.log("something went wrong\n", err);
	}
}

