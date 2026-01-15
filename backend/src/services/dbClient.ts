// HTTP Client para conectar con el DB Service
const DB_SERVICE_URL = process.env.DB_SERVICE_URL || 'http://localhost:3001';
const DB_API_KEY = process.env.DB_API_KEY || '';

export interface User {
  id?: number;
  username: string;
  email: string;
  password: string;
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

async function dbFetch(path: string, options: RequestInit = {}) {
  const headers = {
    ...(options.headers || {}),
    'x-api-key': DB_API_KEY ||'JoseMiguel',          // ✅ API key añadida automáticamente
    'Content-Type': 'application/json',
  };

  const res = await fetch(`${DB_SERVICE_URL}${path}`, { ...options, headers });

  if (!res.ok && res.status !== 404) {
    throw new Error(`DB Service error: ${res.status} ${res.statusText}`);
  }

  return res;
}

export class DBClient {
  static async getAllUsers(): Promise<User[]> {
    const res = await dbFetch('/api/users', { method: 'GET' });
    return await res.json();
  }

 static async getAllFriends(user_1: number): Promise<Friends[]> {
  try {
    const res = await dbFetch(`/api/friends?user_1=${user_1}`);
    //if (!res.ok) return []; // fallo HTTP → array vacío

    const data = await res.json();
    console.log('Data received from /friends:', data);
    //🔒 VALIDACIÓN EN RUNTIME
    if (Array.isArray(data)) {
      return data as Friends[];
    }

    // Si viene cualquier otra cosa (objeto vacío, undefined, etc.)
    return [];
  } catch {
    return [];
  }
}

  

  static async getUserById(id: number): Promise<User | null> {
    const res = await dbFetch(`/api/users/${id}`, { method: 'GET' });
    if (res.status === 404) return null;
    return await res.json();
  }

  static async getUserByUsername(username: string): Promise<User | null> {
    const res = await dbFetch(`/api/users/by-username/${username}`, { method: 'GET' });
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

  static async deleteUser(id: number): Promise<boolean> {
    const res = await dbFetch(`/api/users/${id}`, { method: 'DELETE' });
    if (res.status === 404) return false;
    return true;
  }
}
