// HTTP Client para conectar con el DB Service
const DB_SERVICE_URL = process.env.DB_SERVICE_URL || 'http://localhost:3001';

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

export class DBClient {
  /**
   * GET /api/users - Obtener todos los usuarios
   */
  static async getAllUsers(): Promise<User[]> {
    try {
      const response = await fetch(`${DB_SERVICE_URL}/api/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`DB Service error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting users from DB:', error);
      throw error;
    }
  }

  /**
   * GET /api/users/:id - Obtener usuario por ID
   */
  static async getUserById(id: number): Promise<User | null> {
    try {
      const response = await fetch(`${DB_SERVICE_URL}/api/users/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        throw new Error(`DB Service error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting user by ID from DB:', error);
      throw error;
    }
  }

  /**
   * GET /api/users/by-username/:username - Obtener usuario por username
   */
  static async getUserByUsername(username: string): Promise<User | null> {
    try {
      const response = await fetch(`${DB_SERVICE_URL}/api/users/by-username/${username}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        throw new Error(`DB Service error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting user by username from DB:', error);
      throw error;
    }
  }

  /**
   * POST /api/users - Crear nuevo usuario
   */
  static async createUser(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    try {
      const response = await fetch(`${DB_SERVICE_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        throw new Error(`DB Service error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating user in DB:', error);
      throw error;
    }
  }

  /**
   * PUT /api/users/:id - Actualizar usuario
   */
  static async updateUser(id: number, updates: Partial<User>): Promise<User | null> {
    try {
      const response = await fetch(`${DB_SERVICE_URL}/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        throw new Error(`DB Service error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating user in DB:', error);
      throw error;
    }
  }

  /**
   * DELETE /api/users/:id - Eliminar usuario
   */
  static async deleteUser(id: number): Promise<boolean> {
    try {
      const response = await fetch(`${DB_SERVICE_URL}/api/users/${id}`, {
        method: 'DELETE',
        
      });

      if (response.status === 404) {
        return false;
      }

      if (!response.ok) {
        throw new Error(`DB Service error: ${response.status} ${response.statusText}`);
      }

      return true;
    } catch (error) {
      console.error('Error deleting user from DB:', error);
      throw error;
    }
  }
}
