export const UserSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    username: { type: 'string' },
    email: { type: 'string' },
    password: { type: 'string' },
    nickname: { type: 'string' },
    avatar: { type: 'string' },
  },
};

export const CreateUserSchema = {
  type: 'object',
  required: ['username', 'email', 'password'],
  properties: {
    username: { type: 'string' },
    email: { type: 'string' },
    password: { type: 'string' },
    nickname: { type: 'string' },
    avatar: { type: 'string' },
  },
};

export const UpdateUserSchema = {
  type: 'object',
  properties: {
    username: { type: 'string' },
    email: { type: 'string' },
    password: { type: 'string' },
    nickname: { type: 'string' },
    avatar: { type: 'string' },
  },
};
