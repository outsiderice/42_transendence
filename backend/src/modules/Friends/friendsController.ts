import { FastifyRequest, FastifyReply } from 'fastify';
import Friends, { DBClient } from '../../services/dbClient';

export const getAllFriendsController = async (
  request: FastifyRequest<{ Querystring: { user_1: number } }>,
  reply: FastifyReply
) => {
  try {
    const { user_1 } = request.query;
    const user = await DBClient.getUserById(user_1);

    if (!user) {
      return reply.status(404).send({
        error: 'Usuario no encontrado',
      });
    }
    const posiblefriends = await DBClient.getAllFriends(user_1);
    
    const friends : Friends[] = [];

    // Accepted relationship
    for (const pFriend of posiblefriends)
    {
      if (pFriend.petition_status === 0)
      {
        friends.push(pFriend);
      }
    }

    reply.status(200).send(friends);
  } catch (error) {
    console.error('Error in getAllFriendsController:', error);
    reply.status(500).send({
      error: 'Error al obtener amigos',
      details: error instanceof Error ? error.message : String(error),
    });
  }
};

export const getAllFriendsPetitionController = async (
  request: FastifyRequest<{ Querystring: { user_1: number } }>,
  reply: FastifyReply
) => {
  try {
    const { user_1 } = request.query;
    const user = await DBClient.getUserById(user_1);

    if (!user) {
      return reply.status(404).send({
        error: 'Usuario no encontrado',
      });
    }
    const posiblefriends = await DBClient.getAllFriends(user_1);
    
    const friends : Friends[] = [];

    //Pendant relationship
    for (const pFriend of posiblefriends)
    {
      if (pFriend.petition_status === user_1)
      {
        friends.push(pFriend);
      }
    }

    reply.status(200).send(friends);
  } catch (error) {
    console.error('Error in getAllFriendsController:', error);
    reply.status(500).send({
      error: 'Error al obtener amigos',
      details: error instanceof Error ? error.message : String(error),
    });
  }
};

export const createFriendPetitionController = async (
  request: FastifyRequest<{ Body: Friends }>,
  reply: FastifyReply
) => {
  try {
    let { user_1, user_2, petition_status } = request.body;

    // 1. Validación básica
    if (user_1 === user_2) {
      return reply.status(400).send({
        error: 'No puedes crear una relación contigo mismo',
      });
    }

    // Suponiendo que tienes un servicio UsersService o DBClient
    const user1Exists = await DBClient.getUserById(user_1);
    const user2Exists = await DBClient.getUserById(user_2);

    if (!user1Exists || !user2Exists) {
    return reply.status(400).send({
        error: 'Uno o ambos usuarios no existen'
    });
    }

    const requested = user_2;//

    // 2. Normalizar orden
    const normalizedUser1 = Math.min(user_1, user_2);
    const normalizedUser2 = Math.max(user_1, user_2);

    // 3. Comprobar si la relación ya existe (API DB)
    const existingRelation = await DBClient.getAllFriends(normalizedUser1);
    if (existingRelation.length > 0 ) 
        {
        for (const relation of existingRelation) {
        if (
            (relation.user_1 === normalizedUser1 && relation.user_2 === normalizedUser2) ||
            (relation.user_1 === normalizedUser2 && relation.user_2 === normalizedUser1)
        )   {
                return reply.status(409).send({
                error: 'La relación de amistad ya existe',
                });
            };
            console.log("la relacion es",relation);
    }}
    // 4. Crear la relación (API DB)
    const newRelation = await DBClient.createFriendPetition({
      user_1: normalizedUser1,
      user_2: normalizedUser2,
      petition_status: Number(requested),
    });

    return reply.status(201).send(newRelation);
  } catch (error) {
    console.error('Error creating friend petition:', error);

    return reply.status(500).send({
      error: 'Error al crear la relación de amistad',
      details: error instanceof Error ? error.message : String(error),
    });
  }
};

