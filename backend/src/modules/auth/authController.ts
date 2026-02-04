import { FastifyRequest, FastifyReply } from 'fastify';
import { RegisterUserBody, LoginUserBody, SafeUserResponese, GithubEmail } from './authRoutes';
import { DBClient } from '../../services/dbClient';
import { findOrCreateGithubUser } from './githubOauth';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


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

    if (password.length < 8) {
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
    
        
    // Crear el usuario con la contraseña hasheada
    const newUser = await DBClient.createUser({
      username,
      email,
      password: hash,
	nickname:username,	
    });
  
    //evita devolver el password en la respuesta
    const safeUser: SafeUserResponese = {
	    id:		newUser.id,
      username: newUser.username,
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
	    id: existingUsername.id,
      username: existingUsername.username,
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

	const refreshToken = request.cookies.refreshToken;
	
	if (!refreshToken){
		return reply.code(401).send({error: "No refresh token"});
	}

    const payload = jwt.verify(refreshToken, process.env.JWT_SECRET);

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
      sameSite: 'none',
      secure: true,
    });

	const safeUser: SafeUserResponese = {
		id:	payload.id,
		username: payload.username,
	};
	
	console.log("Auth token refreshed successfull\n");
	console.log(safeUser);
    reply.status(201).send({safeUser});
  } catch(err) {
	console.error("Refresh failed: ", err);
    return reply.status(401).send({ error: 'Invalid or expired refresh token' });
  }
};

/**
 * POST /logout - quita las cookies de session
 */
export const logoutUserController = async (
	request:	FastifyRequest,
	reply:		FastifyReply,
) => {
	reply
	.setCookie('accessToken', '', {
		path: '/',
		httpOnly: true,
		secure: true,
		sameSite: true,
		maxAge: 0,
	})
	.setCookie('refreshToken', '', {
		path: '/api/auth/refresh',
		httpOnly: true,
		secure: true,
		sameSite: true,
		maxAge: 0,
	})
	.status(200)
	.send(null)
};

/**
 * GET /callback - OAuth callback
 */
export const getCallbackController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    //get user info from github
    const accessToken = await request.server.githubOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);
	const token = accessToken.token.access_token    
    const githubUserRes = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${token}`,
		Accept: 'application/vnd.github+json',
      },
    });
    const githubEmailRes = await fetch('https://api.github.com/user/emails', {
      headers: {
        Authorization: `Bearer ${token}`,
		Accept: 'application/vnd.github+json',
      },
    });

    const githubUser = await githubUserRes.json();
    const githubEmails = await githubEmailRes.json() as GithubEmail[];

    const email = githubEmails.find(
      (emailObj: any) => emailObj.primary
    )?.email ?? null;

    const user = await findOrCreateGithubUser({
      githubid: githubUser.id,
      username: githubUser.login,
      email: email,
      avatar: githubUser.avatar,
    });
	
	const safeUser: SafeUserResponese = {
		id:			user.id,
		username:	user.username,
	}

    //generar JWTs
	await reply.generateTokens(user);

    reply.status(200).send({ safeUser });
  } catch (error) {
    console.error('Error in getCallbackController:', error);
    reply.status(500).send({
      error: 'Error en autenticación con GitHub',
      details: error instanceof Error ? error.message : String(error),
    });
  }
};
