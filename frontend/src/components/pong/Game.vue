<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import GameCanvas from './GameCanvas.vue';
import type { GameState } from './GameState';

const currentGameState = ref<GameState | null>(null);
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
  //socket = new WebSocket("ws://0.0.0.0:3000/ws/pong");
// Game.vue SI NO FUNCIONA CAMBIAR DIRECCION DE BACKEND, PONER LUEGO ENV VAR
  const token = localStorage.getItem('token');
  console.log(token);
  socket = new WebSocket(`wss://symmetrical-carnival-x79xwxwvxqv26v97-3000.app.github.dev/ws/pong?token=${token}`);
  //socket = new WebSocket("ws://localhost:3000/ws/pong");

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === "STATE_UPDATE") {
        currentGameState.value = data.state;
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
    <GameCanvas :gameState="currentGameState" />
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