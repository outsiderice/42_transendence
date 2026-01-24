import { FastifyInstance } from "fastify";
import { Game } from '../../services/dbClient';
import {
    getAllGamesController,
    createGameController
} from '.Controllers/gameControllers';


//game schema
export const GameSchema = {
    type:'object',
    required: ['id', 'player1', 'player2', 'score1', 'score2'],
    properties: {
        id: {type: 'number'},
        player1: {type: 'string'},
        player2:  {type: 'string'},
        score1: {type: 'number'},
        score2: {type: 'number'},
        diff: {type: 'number'},
        created_at: { type: 'string' },
        updated_at: { type: 'string' },
    },
};

export const CreateGameSchema = {
    type: 'object',
    required: ['player1', 'player2', 'score1', 'score2'],
    properties: {
        player1: {type: 'string'},
        player2:  {type: 'string'},
        score1: {type: 'number'},
        score2: {type: 'number'},
        diff: {type: 'number'},        
    },
};

export const gameRoutes = async(app: FastifyInstance)=>{
    
   //CREATE
    app.post<{ Body: Omit<Game, 'id' | 'created_at' | 'updated_at'> }>('/games', {
        schema: {
            tags: ['Games'],
            body: CreateGameSchema,
            response: {
                201: GameSchema,
                400: { type: 'object', properties: { error: { type: 'string' } } },
                409: { type: 'object', properties: { error: { type: 'string' } } },
            }
        }
    }, createGameController);

    //READ GAME by
    app.get<{ Params: { username: string } }>('/play-online', {
            preHandler: app.authenticateApi,
        }
    }