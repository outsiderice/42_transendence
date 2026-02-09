export interface Game {
  id?: number;
  player1_id: number;
  player1_username?: string;
  player1_nickname?: string;
  player2_id: number;
  player2_username?: string;
  player2_nickname?: string;
  winner_id: number ;
  player1_score?: number;
  player2_score?: number;
  created_at?: string;
  updated_at?: string;
}

export const GameSchema = {
  type: 'object',
  required: ['player1_id', 'player2_id', 'player1_score', 'player2_score', 'winner_id'],
  properties: {
    id: { type: 'number' },
    player1_id: { type: 'number' },
	player1_username: { type : 'string'},
	player1_nickname: { type : 'string'},
    player2_id: { type: 'number' },
	player2_username: { type : 'string'},
	player2_nickname: { type : 'string'},
    winner_id: { type: 'number' },
    player1_score: { type: 'number' },
    player2_score: { type: 'number' },
    created_at: { type: 'string' },
    updated_at: { type: 'string' },
  },
  
};

