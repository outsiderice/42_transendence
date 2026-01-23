import { FastifyInstance } from "fastify";
import { Pong } from "./Pong.js";
import  { Player } from "./Player.js"

import { FastifyJWT } from '@fastify/jwt';

declare module 'fastify' {
  interface FastifyInstance {
    jwt: FastifyJWT;
  }
}

export function player_controls(player: Player, game: Pong){
    player.webSocket.on("message", (message: string) => {
      try {
        const data = JSON.parse(message.toString());
        if (data.type === "KEY_EVENT") {
          const { key, pressed } = data;
          // Only the correct player can move their specific paddle
          if (player.side === -1) { // First person to connect (Left)
            if (key === 'w' || key === 'W') game.leftPaddle.moveUp = pressed;
            if (key === 's' || key === 'S') game.leftPaddle.moveDown = pressed;
          } else if (player.side === 1) { // Second person to connect (Right)
            if (key === 'ArrowUp') game.rightPaddle.moveUp = pressed;
            if (key === 'ArrowDown') game.rightPaddle.moveDown = pressed;
          }
        }
      } catch (e) {
        console.log("Failed to parse message");
      }
    });
  }

export function game_end(game: Pong, player1: Player, player2: Player) {
  let winnerSide = game.score.whoWon();
  let winner: Player;
  let loser: Player;
  let winnerPoints: number;
  let loserPoints: number;
  winner = player1;
  if (winnerSide === "left") {
    winner = player1;
    loser = player2;
    winnerPoints = game.score.getLeftScore();
    loserPoints = game.score.getRightScore();
  }
  else if (winnerSide === "right") {
    winner = player2;
    loser = player1;
    winnerPoints = game.score.getRightScore();
    loserPoints = game.score.getLeftScore();
  }
  let winerNick = winner.nick;
  // hacer el post a la database;
    // HERE GOES POST
  // inform each front-end that the game is over
  const finalMsg = JSON.stringify({ type: "GAME_OVER", winerNick});
  player1.webSocket.send(finalMsg);
  player2.webSocket.send(finalMsg);
  player1.webSocket.close();
  player2.webSocket.close();
  // maybe send winner
}

export function close_game(player: Player, gameInterval: NodeJS.Timeout) {
  player.webSocket.on("close", () => {
    clearInterval(gameInterval);
    console.log(`Player ${player.nick} disconnected. Game stopped.`);
  });
}

  export function start_game(player1: Player, player2: Player){
    const game = new Pong(800, 600);
    player_controls(player1, game);
    player_controls(player2, game);

    // Inform players of their sides -- is it necessary?
    player1.webSocket.send(JSON.stringify({ type: "ASSIGN_SIDE", side: "LEFT" }));
    player2.webSocket.send(JSON.stringify({ type: "ASSIGN_SIDE", side: "RIGHT" }));


    const gameInterval = setInterval(() => {
      game.update();
      if (game.endGame()) {
        game_end(game, player1, player2);
        clearInterval(gameInterval);
        return;
      }
      const state = JSON.stringify({
        type: "STATE_UPDATE",
        state: game.getGameState()
      });
      player1.webSocket.send(state);
      player2.webSocket.send(state);
    }, 1000 / 60);

    close_game(player1, gameInterval);
    close_game(player2, gameInterval);
  }
  
export async function pongGame(fastify: FastifyInstance) {
  // one game instance shared by everyone, to change for matchmaking
  let players: any[] = [];
  let rooms: Map<number, any> = new Map();
  let current_side = -1;

  // Shared Game Loop: Sends the ball/paddle positions to EVERYONE

  console.log("SERVER CHECK: Multiplayer Pong logic is starting...");

  fastify.get("/ws/pong", { websocket: true }, async (connection, req) => {
    const socket = (connection as any).socket || connection;
    const { token } = req.query as { token?: string };
    
    if (!token) {
        fastify.log.warn("Connection attempt blocked: No token provided.");
        connection.socket.close(1008, "Policy Violation: Token Required");
        return;
    }

    try {
      // 3. VERIFY IDENTITY (Using your existing @fastify/jwt)
      // This will throw an error if the token is fake or expired
      const decoded = await fastify.jwt.verify(token) as any;
      console.log("Decoded Object:", JSON.stringify(decoded, null, 2));

      const userId = decoded.id;
      const isAlreadyWaiting = players.some(p => p.id === decoded.id);
      if (isAlreadyWaiting) {
        console.log(`⚠️ User ${decoded.username} tried to join twice.`);
        socket.send(JSON.stringify({ 
            type: "ERROR", 
            message: "You are already in the matchmaking queue!" 
        }));
        // We don't close the socket immediately so they see the message, 
        // or you can just return to ignore the second connection.
        return;
      }
      console.log(`✅ Verified User: ${decoded.username} (ID: ${userId})`);

      const player = new Player(decoded.id, socket, decoded.nickname, decoded.username, -1);
      players.push(player);
      console.log("--- HANDSHAKE REACHED ---");
      if (players.length >= 2){
        let player1 = players.shift()!;
        let player2 = players.shift()!;
        player2.side = 1;    
        start_game(player1, player2);
      } else {
        socket.send(JSON.stringify({ type: "INFO", msg: "Waiting for opponent..." }));
      }
    } catch (err) {
      console.log("❌ JWT Verification Failed:", err);
      socket.close(1008, "Invalid Token");
      return;
    }   
  });
}