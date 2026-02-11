import { db } from '../../config/sqlite';

export interface Petitions {
    id?: number;
    user_1: number;
    user_1_username: string;
    user_1_nickname: string;
    user_1_avatar: string;
    user_2: number;
    user_2_username: string;
    user_2_nickname: string;
    user_2_avatar: string;
    petition_status: number;
}

export interface Friends {
    id?: number;
    user_1: number;
	user_1
    user_2: number;
    petition_status: number;
}

export class friendsService{
    static postFriendPetition(friends: Friends): Friends {
      const stmt = db.prepare(`
        INSERT INTO relationship (user_1,user_2,petition_status)
        VALUES (?, ?, ?)
      `);

      const result = stmt.run(
        friends.user_1,
        friends.user_2,
        friends.petition_status
      );
      return {
          id: Number(result.lastInsertRowid),
          ...friends,
      };
    }

   static getAllFriends(user_1: number): Friends[] {
    const stmt = db.prepare(`
    	SELECT *
    	FROM relationship
    	WHERE (user_1 = ? OR user_2 = ?)
      	AND petition_status = 0
  	`);
    const rows = stmt.all(user_1, user_1) as Friends[];
    
    return rows;
  }

  static getAllFriendsPetitions(user_1: number): Friends[] {
    const stmt = db.prepare(`
    	SELECT *
    	FROM relationship
    	WHERE (user_1 = ? OR user_2 = ?) and petition_status =?;
      	
  	`);
    const rows = stmt.all(user_1, user_1,user_1) as Friends[];
    
    return rows;
  }



   static getAllPetitions(user_1: number): Friends[] {
    const stmt = db.prepare(`
    	SELECT
			r.id AS id,

			r.user_1 AS user_1_id,
			u1.username AS user_1_username,
			u1.nickname AS user_1_nickname,

			r.user_2 AS user_2_id,
			u2.username AS user_2_username,
			u2.nickname AS user_2_nickname,

			r.petition_status AS status
    	FROM relationship r
		JOIN users u1 ON u1.id = r.user_1
		JOIN users u2 ON u2.id = r.user_2
    	WHERE (r.user_1 = ? OR r.user_2 = ?)
      		AND petition_status <> user_1 
  	`);
    const rows = stmt.all(user_1, user_1) as Petitions[];
    return rows;
  }

  static AcceptFriendPetition(id: number): void {
    const stmt = db.prepare(`
      UPDATE relationship
      SET petition_status = 0
      WHERE id = ?
    `);
    stmt.run(id);
  }

  static DeleteFriendPetition(id: number): void {
    const stmt = db.prepare(`
      DELETE FROM relationship
      WHERE id = ?
    `);
    stmt.run(id);
  }
}
