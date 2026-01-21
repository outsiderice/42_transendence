export const GameSchema = {
  type: 'object',
  required: ['player1_id', 'player2_id', 'winner_id', 'status'],
  properties: {
    id: { type: ['number'] },
    player1_id: { type: 'number' },
    player2_id: { type: 'number' },
    winner_id: { type: 'number' },
    status: { type: 'string' },
    created_at: { type: 'string' },
    updated_at: { type: 'string' },
  },
};
