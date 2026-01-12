import { FastifyInstance } from "fastify";
import { Pong } from "./Pong.js";

export async function pongGame(fastify: FastifyInstance) {
  console.log("SERVER CHECK: The Pong Plugin has started!");

  const game = new Pong(800, 600);

  fastify.get("/ws/pong", { websocket: true }, (connection, req) => {
    // In newer Fastify Websocket versions, 'connection' IS the socket
    // or it contains a 'socket' property. Let's make it robust:
    const socket = (connection as any).socket || connection;

    fastify.log.info("Game Client Connected");

    const gameInterval = setInterval(() => {
      game.update();
      // Use the socket directly
      socket.send(JSON.stringify({
        type: "STATE_UPDATE",
        state: game.getGameState()
      }));
    }, 1000 / 60);

    socket.on("message", (message: string) => {
      try {
        const data = JSON.parse(message.toString());
        if (data.type === "KEY_EVENT") {
            const { key, pressed } = data;
            if (key === 'w' || key === 'W') game.leftPaddle.moveUp = pressed;
            if (key === 's' || key === 'S') game.leftPaddle.moveDown = pressed;
            if (key === 'ArrowUp') game.rightPaddle.moveUp = pressed;
            if (key === 'ArrowDown') game.rightPaddle.moveDown = pressed;
        }
      } catch (e) {
        fastify.log.error("Failed to parse WS message");
      }
    });

    socket.on("close", () => {
      clearInterval(gameInterval);
      fastify.log.info("Game Client Disconnected");
    });
  });
}