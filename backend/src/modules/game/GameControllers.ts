import { FastifyRequest } from 'fastify';
import { pongGame } from "./pongGame.ts";

export const gameController = async (
	connection: WebsocketHandler,
	request: FastifyRequest,
) => {
	const socket = (connection as any).socket ?? connection;
	try {
		const payload = await request.jwtVerify<{
			id: number;
			username: string;
			nickname: string;
		}>();


		console.log(payload.username, " wants to connect");
		pongGame( socket, payload);
	}
	catch (err){
		console.log("Auth failed\n", err);
		socket.close(1008, "Invalid token");
	}
}

