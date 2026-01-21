export const GameSchema = {
  type: 'object',
  required: ['player1_id', 'player2_id', 'player1_score', 'player2_score', 'winner_id'],
  properties: {
    id: { type: ['number'] },
    player1_id: { type: 'number' },
    player2_id: { type: 'number' },
    player1_score: { type: 'number' },
    player2_score: { type: 'number' },
    winner_id: { type: 'number' },
    status: { type: 'string' },
    created_at: { type: 'string' },
    updated_at: { type: 'string' },
  },
};
