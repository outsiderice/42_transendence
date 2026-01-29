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

export async function game_end(game: Pong, player1: Player, player2: Player) {
  let winnerSide = game.score.whoWon();
  let winner = player1;
  if (winnerSide === "right") {
    winner = player2;
  }
  let winnerName = winner.userName;
  // Data to be send to DATABASE
  const gameData = {
    player1_id: Number(player1.id),
    player2_id: Number(player2.id),
    winner_id: Number(winner.id),
    player1_score: Number(game.score.getLeftScore()),
    player2_score: Number(game.score.getRightScore())
  };
  
  try {
    const response = await fetch("https://symmetrical-carnival-x79xwxwvxqv26v97-3000.app.github.dev/games", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(gameData),
      signal: AbortSignal.timeout(5000) // 5 second timeout so game doesn't hang forever
    });

    if (response.ok) {
      const savedGame = await response.json();
      console.log(`🏆 DB Success: Game #${savedGame.id} saved.`);
    } else {
      // Handle specific HTTP errors (400, 401, 500, etc.)
      const errorText = await response.text();
      console.error(`❌ DB Rejected (${response.status}):`, errorText);
    }
  } catch (err: any) {
    if (err.name === 'TimeoutError') {
      console.error("❌ DB Error: The request timed out.");
    } else {
      console.error("❌ DB Network Error: Connection refused or DNS failure.");
    }
  }
  // inform each front-end that the game is over
  const finalMsg = JSON.stringify({ type: "GAME_OVER", winnerName});
  // check if the socket still open before sending, 1 == OPEN
  [player1, player2].forEach(p => {
    if (p.webSocket.readyState === 1) {
      p.webSocket.send(finalMsg);
      p.webSocket.close();
    }
  });
  //player1.webSocket.send(finalMsg);
  //player2.webSocket.send(finalMsg);
  //player1.webSocket.close();
  //player2.webSocket.close();
}


export function close_socket_waiting(player: Player, players: any[]) {
  player.webSocket.on("close", () => {
    const index = players.indexOf(player);

    if (index !== -1) {
      players.splice(index, 1);
      console.log(`Player ${player.userName} removed from waiting list. Queue size: ${players.length}`);
    } else {
      // This happens if they were already moved to a game before the socket closed
      console.log(`Player ${player.userName} disconnected, but was not in the waiting list.`);
    }
  });
}

export function close_game(player: Player, gameInterval: NodeJS.Timeout, game: Pong) {
  player.webSocket.on("close", () => {
    clearInterval(gameInterval);
    // send message that the opponent disconected, coward
    if (!game.endGame()){
      console.log(`Player ${player.userName} disconnected. Game stopped.`);
      const msg = JSON.stringify({ type: "DISCONNECTED", username: player.userName});
      if (game.player1.webSocket.readyState === 1) {
        game.player1.webSocket.send(msg);
      }
      if (game.player2.webSocket.readyState === 1) {
        game.player2.webSocket.send(msg);
      }
    }
  });
}

  export function start_game(player1: Player, player2: Player){
    const game = new Pong(800, 600, player1, player2);
    player_controls(player1, game);
    player_controls(player2, game);

    const namesPayload = { 
      type: "ASSIGN_SIDE", 
      leftName: player1.userName, 
      rightName: player2.userName
    };
    
    player1.webSocket.send(JSON.stringify({...namesPayload, side: "LEFT"}));
    player2.webSocket.send(JSON.stringify({...namesPayload, side: "RIGHT"}));;
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

    close_game(player1, gameInterval, game);
    close_game(player2, gameInterval, game);
  }
  
export async function pongGame(fastify: FastifyInstance) {

  let players: any[] = [];
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
      //VERIFY IDENTITY using fastify/jwt
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
        //close the socket maybe redirect to main page?
        socket.close();
        return;
      }
      console.log(`✅ Verified User: ${decoded.username} (ID: ${userId})`);

      const player = new Player(decoded.id, socket, decoded.nickname, decoded.username, -1);
      players.push(player);
      close_socket_waiting(player, players);
      if (players.length >= 2){
        // shift first come first go and deletes the player from the array
        let player1 = players.shift()!;
        let player2 = players.shift()!;
        player2.side = 1;
        const state = JSON.stringify({
        type: "PLAY"
        });
      player1.webSocket.send(state);
      player2.webSocket.send(state);
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