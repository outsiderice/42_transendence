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
    const friends = await DBClient.getAllFriends(user_1);

    const filteredFriends: Friends[] = friends.filter(
     (friend: Friends) => friend.petition_status === 0
    );
    
    reply.status(200).send(filteredFriends); 
  } catch (error) {
    console.error('Error in getAllFriendsController:', error);
    reply.status(500).send({
      error: 'Error al obtener amigos',
      details: error instanceof Error ? error.message : String(error),
    });
  }
};

export const getPetitionFriendsController = async (
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
    const friends = await DBClient.getAllFriends(user_1);

    const filteredFriends: Friends[] = friends.filter(
     (friend: Friends) => friend.petition_status === user_1
    );
    
    reply.status(200).send(filteredFriends); 
  } catch (error) {
    console.error('Error in getPetitionFriendsController:', error);
    reply.status(500).send({
      error: 'Error al obtener solicitudes de amistad',
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
    petition_status = user_2;

    if (user_1 === user_2) {
      return reply.status(400).send({
        error: 'No puedes crear una relación contigo mismo',
      });
    }

    const user1Exists = await DBClient.getUserById(user_1);
    const user2Exists = await DBClient.getUserById(user_2);

    if (!user1Exists || !user2Exists) {
    return reply.status(400).send({
        error: 'Uno o ambos usuarios no existen'
    });
    }

    const normalizedUser1 = Math.min(user_1, user_2);
    const normalizedUser2 = Math.max(user_1, user_2);

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
    
    const newRelation = await DBClient.createFriendPetition({
      user_1: normalizedUser1,
      user_2: normalizedUser2,
      petition_status: Number(petition_status),
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
  
  export const acceptFriendPetitionController = async (
    request: FastifyRequest<{ Querystring: { id: number } }>,
    reply: FastifyReply
  ) => {
    try {
      const { id } = request.query; 
      await DBClient.acceptFriendPetition(id);
      return reply.status(200).send({ message: 'Solicitud de amistad aceptada' });
    } catch (error) {
      console.error('Error accepting friend petition:', error);
      return reply.status(500).send({
        error: 'Error al aceptar la solicitud de amistad',
        details: error instanceof Error ? error.message : String(error),
      });
    }
  };


  export const deleteFriendPetitionController = async (
  request: FastifyRequest<{ Querystring: { id: number } }>,
  reply: FastifyReply
) => {
  try {
    const { id } = request.query;
    await DBClient.deleteFriendPetition(id);

    return reply.status(200).send({
      message: 'Solicitud de amistad eliminada'
    });
  } catch (error) {
    console.error('Error deleting friend petition:', error);

    return reply.status(500).send({
      error: 'Error al eliminar la solicitud de amistad',
      details: error instanceof Error ? error.message : String(error),
    });
  }
};



