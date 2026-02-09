import { db } from '../../config/sqlite';

export interface GameDB {
  id?: number;
  player1_id: number;
  player1_username?: string;
  player1_nickname?: string;
  player2_id: number;
  player2_username?: string;
  player2_nickname?: string;
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

   static getAllGames(user_1: number): GameDB[] {
       const stmt = db.prepare(`
			SELECT
				g.id,
				g.player1_id,
				u1.player1_username AS player1_username,
				u1.player1_nickname AS player1_nickname,
				g.player2_id,
				u2.player2_username AS player2_username,
				u2.player2_nickname AS player2_nickname,
				g.player1_score,
				g.player2_score,
				g.winner_id,
				g.created_at,
				g.updated_at
			FROM games g
			JOIN users u1 ON u1.id = g.player1_id
			JOIN users u2 ON u2.id = g.player2_id
			WHERE g.player1_id = ? OR g.player2_id = ?
			ORDER BY g.created_at DESC
		`);
       const rows = stmt.all(user_1, user_1) as GameDB[];
       return Array.isArray(rows) ? rows : [];
   }
}
