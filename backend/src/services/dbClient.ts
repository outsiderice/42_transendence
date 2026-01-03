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
