export interface Game {
  id?: number;
  player1_id: number;
  player2_id: number;
  winner_id: number ;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export const GameSchema = {
  type: 'object',
  required: ['player1_id', 'player2_id', 'winner_id', 'status'],
  properties: {
    id: { type: 'number' },
    player1_id: { type: 'number' },
    player2_id: { type: 'number' },
    winner_id: { type: 'number' },
    status: { type: 'string' },
    created_at: { type: 'string' },
    updated_at: { type: 'string' },
  },
  
};

