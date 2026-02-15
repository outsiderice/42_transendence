import { FastifyRequest, FastifyReply } from 'fastify';
import { DBClient } from '../../services/dbClient';


export const createGameController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const game = request.body as { player1_id: number, player2_id: number, player1_score: number, player2_score: number, winner_id: number };

    if (!game || !game.player1_id || !game.player2_id || !game.player1_score || !game.player2_score || !game.winner_id) {
      return reply.status(400).send({ error: 'player1_id, player2_id, player1_score, player2_score y winner_id son obligatorios' });
    }
    console.log('Creating game with player1_id:', game.player1_id, game);
    const createdGame = await DBClient.createGame(game);


    console.log(createdGame);

    // IMPORTANT: ensure player1_id exists
    if (!createdGame || !createdGame.player1_id) {
      return reply.status(500).send({
        error: 'El juego se creó pero no devolvió player1_id',
      });
    }

    return reply.status(201).send(createdGame);
  } catch (error) {
    console.error('Error creating game:', error);
    return reply.status(500).send({ error: 'Error al crear el juego' });
  }
};


export const getAllGamesController = async (
  request: FastifyRequest<{ Querystring: { user_1: number } }>,
  reply: FastifyReply
) => {
  try {
    const { user_1 } = request.query;
    const user = await DBClient.getUserById(user_1);

    if (!user) {
      return reply.status(404).send({
        error: 'Usuario no encontrado',
      });
    }
    const games = await DBClient.getAllGames(user_1);

	console.log(games);
    reply.status(200).send(games);
  } catch (error) {
    console.error('Error in getAllGamesController:', error);
    reply.status(500).send({
      error: 'Error al obtener juegos',
      details: error instanceof Error ? error.message : String(error),
    });
  }
};
