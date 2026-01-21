import { db } from '../../config/sqlite';

export interface GameDB {
  id?: number;
  player1_id: number;
  player2_id: number;
  winner_id: number;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export class GamesService {
  static createGame(game: GameDB): GameDB {
    const stmt = db.prepare(`
      INSERT INTO games (player1_id, player2_id, winner_id, status)
      VALUES (?, ?, ?, ?)
    `);

    const result = stmt.run(
      game.player1_id,
      game.player2_id ?? null,
      game.winner_id ?? null,
      game.status
    );

    return {
      id: Number(result.lastInsertRowid),
      ...game
    };
  }
}