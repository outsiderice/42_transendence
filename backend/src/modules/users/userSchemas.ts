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
    oldpassword: { type: 'string' },
    nickname: { type: 'string' },
    avatar: { type: 'string' },
  },
};

export const LoginUserSchema = {
  type: 'object',
  required: ['username', 'password'],
  properties: {
    username: { type: 'string' },
    password: { type: 'string' },
  },
};

export const UserSafeSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    username: { type: 'string' },
    email: { type: 'string' },
    nickname: { type: 'string' },
    avatar: { type: 'string' },
    created_at: { type: 'string' },
    updated_at: { type: 'string' },
  },
  required: ['id', 'username', 'email', 'created_at', 'updated_at'],
};
