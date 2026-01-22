import { FastifyInstance } from "fastify";
import { Pong } from "./Pong.js";
import  { Player } from "./Player.js"

import { FastifyJWT } from '@fastify/jwt';

declare module 'fastify' {
  interface FastifyInstance {
    jwt: FastifyJWT;
  }
}

export async function pongGame(fastify: FastifyInstance) {
  // one game instance shared by everyone, to change for matchmaking
  const game = new Pong(800, 600);
  let players: any[] = [];

  console.log("SERVER CHECK: Multiplayer Pong logic is starting...");

  fastify.get("/ws/pong", { websocket: true }, (connection, req) => {
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
      const decoded = fastify.jwt.verify(token);
      console.log("Decoded Object:", JSON.stringify(decoded, null, 2));    
      const userId = decoded.id;

      console.log(`✅ Verified User: ${decoded.username} (ID: ${userId})`);
      Player

      const isLeft = Array.from(players.keys())[0] === userId;
      /*socket.send(JSON.stringify({ 
        type: "ASSIGN_SIDE", 
        side: isLeft ? "LEFT" : "RIGHT",
        user: decoded.username 
      }));*/

    } catch (err) {
      console.log("❌ JWT Verification Failed:", err);
      socket.close(1008, "Invalid Token");
      return;
    }
      
    console.log("--- HANDSHAKE REACHED ---");
    
    // Check if player can join
    if (players.length < 2) {
      players.push(socket);
      const isLeft = players.indexOf(socket) === 0;
      socket.send(JSON.stringify({ type: "ASSIGN_SIDE", side: isLeft ? "LEFT" : "RIGHT" }));
      fastify.log.info(`Player joined as ${isLeft ? "LEFT" : "RIGHT"}`);
    } else {
      socket.send(JSON.stringify({ type: "INFO", msg: "Game full, you are spectating" }));
      players.push(socket);
      fastify.log.info("Spectator joined");
    }

    // Shared Game Loop: Sends the ball/paddle positions to EVERYONE
    const gameInterval = setInterval(() => {
      game.update();
      const state = JSON.stringify({
        type: "STATE_UPDATE",
        state: game.getGameState()
      });

      players.forEach(p => {
        if (p.readyState === 1) p.send(state);
      });
    }, 1000 / 60);

    socket.on("message", (message: string) => {
      try {
        const data = JSON.parse(message.toString());
        if (data.type === "KEY_EVENT") {
          const { key, pressed } = data;
          const playerIndex = players.indexOf(socket);

          // Only the correct player can move their specific paddle
          if (playerIndex === 0) { // First person to connect (Left)
            if (key === 'w' || key === 'W') game.leftPaddle.moveUp = pressed;
            if (key === 's' || key === 'S') game.leftPaddle.moveDown = pressed;
          } else if (playerIndex === 1) { // Second person to connect (Right)
            if (key === 'ArrowUp') game.rightPaddle.moveUp = pressed;
            if (key === 'ArrowDown') game.rightPaddle.moveDown = pressed;
          }
        }
      } catch (e) {
        fastify.log.error("Failed to parse message");
      }
    });

    socket.on("close", () => {
      clearInterval(gameInterval);
      players = players.filter(p => p !== socket);
      fastify.log.info("A user disconnected");
    });
  });
}