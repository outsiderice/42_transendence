import { db } from '../../config/sqlite';

export interface User {
  id?: number;
  username: string;
  githubid?: string;
  email?: string;
  password?: string;
  nickname?: string;
  avatar?: string;
  created_at?: string;
  updated_at?: string;
}

export class UsersService {
  // CREATE
  static createUser(user: User): User {
    const stmt = db.prepare(`
      INSERT INTO users (username, githubid, email, password, nickname, avatar)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      user.username,
	  user.githubid || null,
      user.email || null,
      user.password || null,
      user.nickname || null,
      user.avatar || null
    );

    return {
      id: Number(result.lastInsertRowid),
      ...user,
    };
  }

  // READ ONE
  static getUserById(id: number): User | undefined {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(id) as User | undefined;
  }

  // READ ONE BY USERNAME
  static getUserByUsername(username: string): User | undefined {
    const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
    return stmt.get(username) as User | undefined;
  }

  // READ ONE BY GITHUBID
    static getUserByGithubId(githubid: string): User | undefined {
    const stmt = db.prepare('SELECT * FROM users WHERE githubid = ?');
    return stmt.get(githubid) as User | undefined;
  }

  // READ ONE BY EMAIL
  static getUserByEmail(email: string): User | undefined {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email) as User | undefined;
  }

  // READ ALL
  static getAllUsers(): User[] {
    const stmt = db.prepare('SELECT * FROM users');
    return stmt.all() as User[];
  }

  // UPDATE
  static updateUser(id: number, updates: Partial<User>): User | undefined {
    const fields: string[] = [];
    const values: unknown[] = [];

    if (updates.username !== undefined) {
      fields.push('username = ?');
      values.push(updates.username);
    }
    if (updates.email !== undefined) {
      fields.push('email = ?');
      values.push(updates.email);
    }
    if (updates.password !== undefined) {
      fields.push('password = ?');
      values.push(updates.password);
    }
    if (updates.nickname !== undefined) {
      fields.push('nickname = ?');
      values.push(updates.nickname);
    }
    if (updates.avatar !== undefined) {
      fields.push('avatar = ?');
      values.push(updates.avatar);
    }

    if (fields.length === 0) return this.getUserById(id);

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    const stmt = db.prepare(query);
    stmt.run(...values);

    return this.getUserById(id);
  }

  // DELETE
  static deleteUser(id: number): boolean {
	try{
    const stmt = db.prepare('DELETE FROM users WHERE id = ?');
    const result = stmt.run(id);
	console.log('DB DELETE RESULT:', result); 
    return (result.changes as number) > 0;
	} catch (err){
	console.error('RAW DB ERROR in deleteUser:', err); // <-- log full DB error
    throw err;
	}
  }
}
