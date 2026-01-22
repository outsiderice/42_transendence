import { FastifyInstance, FastifyRequest } from "fastify";
import {
	GameController
} from '.Controllers/gameControllers';

export	const gameRoutes = async (app:FastifyInstance) => {
	app.get<{
		Querystring: {accessToken: string }
	}>(
		'ws/play',
		{
			websocket: true,
			prehandler: app.authenticatePage,
		},
			(connection:SocketStream, request:FastifyRequest) => {
				gameController(connection, request)
			}
	)	
}

