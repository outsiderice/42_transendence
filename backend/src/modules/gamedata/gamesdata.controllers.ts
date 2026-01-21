import { FastifyRequest, FastifyReply } from 'fastify';
import { DBClient } from '../../services/dbClient';

export const createGameController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const game = request.body as { player1_id: number, player2_id: number, winner_id: number, status: string };

    if (!game || !game.player1_id || !game.player2_id || !game.winner_id || !game.status) {
      return reply.status(400).send({ error: 'player1_id, player2_id, winner_id y status son obligatorios' });
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
