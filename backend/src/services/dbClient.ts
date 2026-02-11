import { Game } from '../modules/gamedata/gamedata.schema';
const DB_SERVICE_URL = process.env.DB_SERVICE_URL || 'http://localhost:3001';
const DB_API_KEY = process.env.DB_API_KEY || '';

//Intefaces
export interface User {
  id?: number;
  username: string;
  githubid?: string;
  email?: string;
  password?: string;
  oldpassword?: string;
  nickname?: string;
  avatar?: string;
  created_at?: string;
  updated_at?: string;
}

export default interface Friends {
  id?: number;
  user_1: number;
  user_2: number;
  petition_status: number;
}

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
//Interfaces end here

//DB Fetch helper
async function dbFetch(path: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    'x-api-key': DB_API_KEY || 'JoseMiguel',
    ...(options.headers as Record<string, string>),
  };

  if (options.body !== undefined && options.body !== null) {
    headers['Content-Type'] = 'application/json';
  }

  if (options.method === 'DELETE' && !options.body) {
    delete headers['Content-Type'];
  }

  const res = await fetch(`${DB_SERVICE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok && res.status !== 404) {
    throw new Error(`DB Service error: ${res.status} ${res.statusText}`);
  }

  return res;
}
//DB Fetch helper end here

//Users related methods
export class DBClient {
  static async getAllUsers(): Promise<User[]> {
    const res = await dbFetch('/api/users', { method: 'GET' });
    return await res.json();
  }

  static async getUserById(id: number): Promise<User | null> {
    const res = await dbFetch(`/api/users/${id}`, { method: 'GET' });
    if (res.status === 404) return null;
    return await res.json();
  }

  static async getUserByGithubId(githubid: string): Promise<User | null> {
    const res = await dbFetch(`/api/users/${githubid}`, { method: 'GET' });
    if (res.status === 404) return null;
    return await res.json();
  }

  static async getUserByUsername(username: string): Promise<User | null> {
    const res = await dbFetch(`/api/users/by-username/${username}`, { method: 'GET' });
    if (res.status === 404) return null;
    return await res.json();
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    const res = await dbFetch(`/api/users/by-email/${email}`, { method: 'GET' });
    if (res.status === 404) return null;
    return await res.json();
  }

  static async createUser(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    const res = await dbFetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
    return await res.json();
  }

  static async createGithubUser(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    const res = await dbFetch('/api/githubusers', {
      method: 'POST',
      body: JSON.stringify(user),
    });
    return await res.json();
  }

static async createFriendPetition(friendPetition: Omit<Friends, 'id'>): Promise<Friends> {
  const res = await dbFetch('/api/friends', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', // 🔑 obligatorio
    },
    body: JSON.stringify({
      user_1: Number(friendPetition.user_1),
      user_2: Number(friendPetition.user_2),
      petition_status: String(friendPetition.petition_status),
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`DB Service error: ${res.status} ${text}`);
  }

  return await res.json();
}

  static async updateUser(id: number, updates: Partial<User>): Promise<User | null> {
    const res = await dbFetch(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    if (res.status === 404) return null;
    return await res.json();
  }

  static async deleteUser(id: number) {
    const res = await dbFetch(`/api/users/${id}`, {
      method: 'DELETE',
    });

    const data = await res.json().catch(() => ({}));

    return {
      status: res.status,
      data,
    };
  }
  //users related methods end here

  
  // Games related methods
  static async createGame(game: Omit<Game, 'id'>): Promise<any> {
    console.log('DBClient.createGame called with:', game);
    const res = await dbFetch('/api/games', {
      method: 'POST',
      body: JSON.stringify(game),
    });
    return await res.json();
  }

  static async getAllGames(user_1: number): Promise<Game[]> {
    try {
      const res = await dbFetch(`/api/games?user_1=${user_1}`);
      const data = await res.json();
      console.log('Data received from /games:', data);
      //🔒 VALIDACIÓN EN RUNTIME
      if (Array.isArray(data)) {
        return data as Game[];
      }

     return [];
    } catch {
      return [];
    }
  }
  //games related methods end here


  //Friends related methods
  static async getAllFriends(user_1: number): Promise<Friends[]> {
    try {
      const res = await dbFetch(`/api/friends?user_1=${user_1}`);
      
      const data = await res.json();
      console.log('Data received from /friends:', data);
      
      if (Array.isArray(data)) {
        return data as Friends[];
      }

      return [];
    } catch {
      return [];
    }
  }

  static async getAllFriendsPetitions(user_1: number): Promise<Friends[]> {
    try {
      const res = await dbFetch(`/api/friendsPetitions?user_1=${user_1}`);
      
      const data = await res.json();
      console.log('Data received from /friendsPetitions:', data);
      
      if (Array.isArray(data)) {
        return data as Friends[];
      }

      return [];
    } catch {
      return [];
    }
  }

  static async getAllPetitions(user_1: number): Promise<Petitions[]> {
    try {
      const res = await dbFetch(`/api/petitions?user_1=${user_1}`);
      
      const data = await res.json();
      console.log('Data received from /petitions:', data);
      
      if (Array.isArray(data)) {
        return data as Petitions[];
      }

      return [];
    } catch {
      return [];
    }
  }

  static async createFriendPetition(friendPetition: Omit<Friends, 'id'>): Promise<Friends> {
    const res = await dbFetch('/api/friends', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', 
      },
      body: JSON.stringify({
        user_1: Number(friendPetition.user_1),
        user_2: Number(friendPetition.user_2),
        petition_status: String(friendPetition.petition_status),
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`DB Service error: ${res.status} ${text}`);
    }

    return await res.json();
  }

  // Accept Friend Petition
  static async acceptFriendPetition(id: number): Promise<void> {
    const res = await dbFetch(`/api/friends/accept?id=${id}`, {
      method: 'PUT',
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`DB Service error: ${res.status} ${text}`);
    }
    return;
  }

  // Delete Friend Petition
  static async deleteFriendPetition(id: number): Promise<void> {
    const res = await dbFetch(`/api/friends?id=${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`DB Service error: ${res.status} ${text}`);
    }
    return;
  }

  //friends related methods end here
}
