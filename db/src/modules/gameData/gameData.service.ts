import { db } from '../../config/sqlite';


export interface GameData {
    id?: number;
    player1_id: number;
    player2_id?: number;
    status?: string;
    winner_id?: string;
}
/*
CREATE TABLE IF NOT EXISTS games (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      player1_id INTEGER NOT NULL,
      player2_id INTEGER,
      winner_id INTEGER,
      status TEXT DEFAULT 'pending',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (player1_id) REFERENCES users(id),
      FOREIGN KEY (player2_id) REFERENCES users(id),
      FOREIGN KEY (winner_id) REFERENCES users(id)
    );
    */
export class gameDataService{
    static  postGamePetition(gameData: GameData): GameData {
        console.log('lalalalala\n');
        console.log('playerid',gameData.player1_id);
        const stmt = db.prepare(`
        INSERT INTO gameData (player1_id)
        VALUES (?)
      `);

      const result =  stmt.run(
        Number (gameData.player1_id),
        
      );
      console.log('lelele',result);
      return {
          id: Number(result.lastInsertRowid),
          ...gameData,
      };
    }
}
