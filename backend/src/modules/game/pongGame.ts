import { FastifyInstance } from "fastify";
import { Pong } from "./Pong.js";


export async function pongGame(fastify: FastifyInstance) {
  // one game instance shared by everyone
  const game = new Pong(800, 600);
  let players: any[] = [];

  console.log("SERVER CHECK: Multiplayer Pong logic is starting...");

  fastify.get("/ws/pong", { websocket: true }, (connection, req) => {
    const socket = (connection as any).socket || connection;
    
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