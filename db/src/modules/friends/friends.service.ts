import { db } from '../../config/sqlite';

export interface Friends {
    id?: number;
    user_1: number;
    user_2: number;
    petition_status: boolean;
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
      friends.petition_status,
      friends.petition_status || 0,  
    );
    return {
        id: Number(result.lastInsertRowid),
        ...friends,
      };
}


}