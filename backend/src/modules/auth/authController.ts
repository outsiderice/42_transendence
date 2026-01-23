import { FastifyRequest, FastifyReply } from 'fastify';
import { RegisterUserBody, LoginUserBody, SafeUserResponese } from './authRoutes';
import { DBClient } from '../../services/dbClient';
import * as bcrypt from 'bcrypt';


export const registerUserController = async (
  request: FastifyRequest<{ Body: RegisterUserBody }>,
  reply: FastifyReply
) => {
  try {
    const { username, email, password} = request.body;

    // Validaciones básicas
    if (!username || !email || !password) {
      return reply.status(400).send({
        error: 'username, email y password son requeridos',
      });
    }

    if (username.trim().length < 3) {
      return reply.status(400).send({
        error: 'username debe tener al menos 3 caracteres',
      });
    }

    if (password.length < 6) {
      return reply.status(400).send({
        error: 'password debe tener al menos 6 caracteres',
      });
    }

    // Verificar si el usuario ya existe
    const existingUsername = await DBClient.getUserByUsername(username);
    if (existingUsername) {
      return reply.status(409).send({
        error: 'El username ya está registrado',
      });
    }

    const existingEmail = await DBClient.getUserByEmail(email);
    if (existingEmail) {
      return reply.status(409).send({
        error: 'El email ya está registrado',
      });
    }

    // generar contraseña hasheada 
    const saltRounds = 10;
    const hash = bcrypt.hashSync(password, saltRounds);
    console.log('Hashed password:', hash);
    console.log('Original password:', password);
        
    // Crear el usuario con la contraseña hasheada
    const newUser = await DBClient.createUser({
      username,
      email,
      password: hash,
    });
  
    //evita devolver el password en la respuesta
    const safeUser: SafeUserResponese = {
      username: newUser.username,
      email: newUser.email,
    };

	await reply.generateTokens(newUser);

    reply.status(201).send({ safeUser });
  } catch (error) {
    console.error('Error in createUserController:', error);
    reply.status(500).send({
      error: 'Error al crear usuario',
      details: error instanceof Error ? error.message : String(error),
    });
  }
};
/*
* POST /users - Login usuario
*/
export const loginUserController = async (
  request: FastifyRequest<{ Body: LoginUserBody }>,
  reply: FastifyReply
) => {
  try {
    const { username, password } = request.body;

    // Validaciones básicas
    if (!username || !password) {
      return reply.status(400).send({
        error: 'username, email y password son requeridos',
      });
    }

    // Verificar si el usuario ya existe
    const existingUsername = await DBClient.getUserByUsername(username);
    if (!existingUsername) {
      return reply.status(409).send({
        error: 'El username no existe',
      });
    }

    // comparar contraseña hasheada
    const passwordMatch = bcrypt.compareSync(password, existingUsername.password);
    console.log('Password match:', passwordMatch);
    console.log('Input password:', password);
    console.log('Stored hashed password:', existingUsername.password);  
        
    if (!passwordMatch) {
      return reply.status(401).send({
        error: 'Contraseña incorrecta',
      });
    }
    //evita devolver el password en la respuesta

    const safeUser: SafeUserResponese = {
      username: existingUsername.username,
      email: existingUsername.email,
    };
	await reply.generateTokens(existingUsername);

    console.log('User logged in:', safeUser);
    reply.status(200).send({ user: safeUser});
  } catch (error) {
    console.error('Error in loginUserController:', error);
    reply.status(500).send({
      error: 'Error al loggear usuario',
      details: error instanceof Error ? error.message : String(error),
    });
  }
};

/**
 * POST /refresh - actualizar token
 */
export const refreshTokenController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {

    const payload = await request.jwtVerify({onlyCookie: true, }) as {
      id: number;
      username: string;
      nickname:string;
      type?: string;
    };

    if (payload.type !== 'refresh') {
      return reply.code(401).send({ error: 'Invalid refresh token' });
    }

    //generar nuevo token de acceso
    const newToken = await reply.jwtSign(
      { 
        id: payload.id,
        username: payload.username,
        nickname: payload.nickname,
        type: 'access'
      },
      { expiresIn: '15m' }
    );

    reply.setCookie('accessToken', newToken, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 15,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    return reply.code(204).send();
  } catch {
    return reply.code(401).send({ error: 'Invalid or expired refresh token' });
  }
};

// /**
//  * GET /callback - OAuth callback
//  */
// export const getCallbackController = async (
//   request: FastifyRequest,
//   reply: FastifyReply
// ) => {
//   try {
//     //get user info from github
//     const accessToken = await request.server.githubOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);
    
//     const githubUserRes = await fetch('https://api.github.com/user', {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         Accept: 'application/vnd.github+json',
//       },
//     });

//     const githubEmailRes = await fetch('https://api.github.com/user/emails', {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         Accept: 'application/vnd.github+json',
//       },
//     });

//     const githubUser = await githubUserRes.json();
//     const githubEmail = await githubEmailRes.json();

//     //check if user exists in database
//     const existingUser = await DBClient.getUserByUsername(githubUser.login);
//     //then call login or register logic
//   } catch (error) {

//   }
