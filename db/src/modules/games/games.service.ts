import { db } from '../../config/sqlite';

export interface GameDB {
  id?: number;
  player1_id: number;
  player2_id: number;
  player1_score: number;
  player2_score: number;
  winner_id: number;
  created_at?: string;
  updated_at?: string;
}

export class GamesService {
  static createGame(game: GameDB): GameDB {
    const stmt = db.prepare(`
      INSERT INTO games (player1_id, player2_id, player1_score, player2_score, winner_id)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      game.player1_id,
      game.player2_id ?? null,
      game.player1_score,
      game.player2_score,
      game.winner_id ?? null,
      
    );

    return {
      ...game,
      id: Number(result.lastInsertRowid)   
    }
  }
}