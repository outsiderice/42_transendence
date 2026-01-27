<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import GameCanvas from './GameCanvas.vue';
import type { GameState } from './GameState';
const currentGameState = ref<GameState | null>(null);
const msgPong = ref<string | null>(null);
const leftPlayerName = ref<string>("Loading...");
const rightPlayerName = ref<string>("Loading...");
let socket: WebSocket | null = null;

// Send input to backend
const sendInput = (key: string, pressed: boolean) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({
      type: "KEY_EVENT",
      key: key,
      pressed: pressed
    }));
  }
};

const handleKeyDown = (e: KeyboardEvent) => {
  // Prevent page scrolling with arrows/space
  if (["ArrowUp", "ArrowDown", "w", "s", "W", "S"].includes(e.key)) {
    e.preventDefault();
    sendInput(e.key, true);
  }
};

const handleKeyUp = (e: KeyboardEvent) => sendInput(e.key, false);

onMounted(() => {
  // Connect to the Fastify backend WebSocket route
// Game.vue SI NO FUNCIONA CAMBIAR DIRECCION DE BACKEND, PONER LUEGO ENV VAR

//  socket = new WebSocket(`wss://symmetrical-carnival-x79xwxwvxqv26v97-3000.app.github.dev/ws/pong?token=${token}`);
// socket = new WebSocket("ws://localhost:3000/ws/pong?token=${token}");
socket = new WebSocket("wss" + import.meta.env.VITE_URL + "/api/ws/play");

/*
const checkPrehandler = async () => {
  try {
    const response = await fetch('http://localhost:3000/users/by-username/local0', {
      method: 'GET',
      credentials: 'include', // send cookies
    });

    if (response.ok) {
      console.log('You can see local0, but should you?');
    } else {
      console.warn('Failed to fetch user:', response.status);
    }
  } catch (err) {
    console.error('Error fetching user:', err);
  }
};

checkPrehandler();
*/
  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === "STATE_UPDATE") {
        currentGameState.value = data.state;
      }
      else if (data.type === "PLAY") {
        msgPong.value = "";
      }
      else if (data.type === "INFO") {
        msgPong.value = data.msg;
      }
      else if (data.type === "DISCONNECTED") {
        msgPong.value = `${data.username} has left the game. What a coward!`;
      }
      else if (data.type === "GAME_OVER") {
        msgPong.value = `${data.winnerName} wins!`;
      }
      else if (data.type === "ASSIGN_SIDE") {
        leftPlayerName.value = data.leftName;
        rightPlayerName.value = data.rightName;
      }
    } catch (err) {
      console.error("Error parsing WebSocket message:", err);
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);
});

onUnmounted(() => {
  if (socket) socket.close();
  window.removeEventListener("keydown", handleKeyDown);
  window.removeEventListener("keyup", handleKeyUp);
});
</script>

<template>
  <div class="game-wrapper">
    <h2>Pong Online</h2>
      <h1 v-if="msgPong" class="winner-announcement">
        {{ msgPong }}
      </h1>
    <GameCanvas 
    :gameState="currentGameState"
    :leftName="leftPlayerName" 
    :rightName="rightPlayerName"
    />
    <div v-if="!currentGameState" class="overlay">
      Connecting to Game Server...
    </div>
  </div>
</template>

<style scoped>
.game-wrapper {
  text-align: center;
  color: white;
  font-family: Arial, sans-serif;
}
.overlay {
  margin-top: 20px;
  color: #888;
}
</style>
