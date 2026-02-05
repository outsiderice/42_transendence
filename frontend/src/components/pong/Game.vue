<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import GameCanvas from './GameCanvas.vue';
import type { GameState } from './GameState';
import { useRouter } from 'vue-router';

const router = useRouter();
const currentGameState = ref<GameState | null>(null);
const msgPong = ref<string | null>(null);
const leftPlayerName = ref<string>("Loading...");
const rightPlayerName = ref<string>("Loading...");
const mySide = ref<string | null>(null);
let   socket: WebSocket | null = null;
//timer variables
const gameEnded = ref(false);
let   postWinTimer = null;

// timer for redirection to main after endGame is reached
const startPostGameRoutine = () => {
  // clear time just in case
  if (postWinTimer) clearInterval(postWinTimer);

  console.log("Win signal received. Starting 15s interval..."); // delete later
  
  postWinTimer = setInterval(() => {
    console.log("15 seconds passed: Refreshing leaderboard or rewards..."); // delete later
    router.push({name: 'home'}); //redirection to home
    
  }, 15000);
};

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

// to check if it is tactile device
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

const handleTouch = (e: TouchEvent, pressed: boolean) => {
  if (!isTouchDevice || !socket || !currentGameState.value || !mySide.value) return;
  if (e.cancelable) e.preventDefault();

  if (!pressed) {
    const upKey = mySide.value === "LEFT" ? "w" : "ArrowUp";
    const downKey = mySide.value === "LEFT" ? "s" : "ArrowDown";
    sendInput(upKey, false);
    sendInput(downKey, false);
    return;
  }

  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
  
  /* Because the wrapper is rotated 90 degrees:
     Physical Right/Left (clientX) = Visual Up/Down
  */
  const touchX = e.touches[0].clientX - rect.left;
  const middle = rect.width / 2;

  if (mySide.value === "LEFT") {
    // If touch is on the left side of the physical phone (Visual T
    sendInput(touchX > middle ? "w" : "s", true);
  } else {
    sendInput(touchX > middle ? "ArrowUp" : "ArrowDown", true);
  }
};

onMounted(() => {
  // Connect to the Fastify backend WebSocket route
  //socket = new WebSocket("ws://0.0.0.0:3000/ws/pong");
  //Game.vue SI NO FUNCIONA CAMBIAR DIRECCION DE BACKEND, PONER LUEGO ENV VAR
  const token = localStorage.getItem('token');
  //console.log(token);
  socket = new WebSocket(`wss://symmetrical-carnival-x79xwxwvxqv26v97-3000.app.github.dev/ws/pong?token=${token}`);

 //socket = new WebSocket("ws://localhost:3000/ws/pong?token=${token}");

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
        startPostGameRoutine();
      }
      else if (data.type === "ASSIGN_SIDE") {
        leftPlayerName.value = data.leftName;
        rightPlayerName.value = data.rightName;
        mySide.value = data.side;
      }
    } catch (err) {
      console.error("Error parsing WebSocket message:", err);
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);
  // check this for status offline
  //window.addEventListener('online', () => console.log('Became online'));
  //window.addEventListener('offline', () => console.log('Became offline'));
});

onUnmounted(() => {
  if (socket) socket.close();
  window.removeEventListener("keydown", handleKeyDown);
  window.removeEventListener("keyup", handleKeyUp);
  //clear timer
  clearInterval(postWinTimer);
});
</script>

<template>
  <div class="game-wrapper"
    @touchstart="handleTouch($event, true)"
    @touchend="handleTouch($event, false)">
  
    <h2>Pong Online</h2>
    
    <h1 v-if="msgPong" class="winner-announcement status-msg">
      {{ msgPong }}
    </h1>

    <GameCanvas 
      :gameState="currentGameState"
      :leftName="leftPlayerName" 
      :rightName="rightPlayerName"
    />

    <div v-if="!currentGameState" class="overlay status-msg">
      Connecting to Game Server...
    </div>
  </div>
</template>

<style scoped>
/* PC VERSION - REMAINING UNTOUCHED */
.game-wrapper {
  text-align: center;
  color: white;
  font-family: Arial, sans-serif;
}
.overlay {
  margin-top: 20px;
  color: #888;
}

/* MOBILE VERSION - TARGETED IMPROVEMENTS */
@media (pointer: coarse) and (orientation: portrait) {
  .game-wrapper {
    position: fixed;
    top: 0; left: 0;
    width: 100svw;
    height: 100svh;
    background-color: #000;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    touch-action: none;
    z-index: 9999;
  }

  /* Your successful generous sizing */
  .game-wrapper > div:not(.status-msg) {
    transform: rotate(90deg);
    width: 100svh; 
    height: 75svh; 
    max-width: 133.33svw; 
    max-height: 100svw;
    aspect-ratio: 4 / 3;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* This fixes the cropping: messages float OVER the canvas */
  .status-msg {
    position: absolute;
    z-index: 100;
    transform: rotate(90deg); /* Rotate text to match game */
    background: rgba(0, 0, 0, 0.7);
    padding: 10px;
    border: 1px solid white;
    margin: 0; /* Reset margins that push layout */
    pointer-events: none;
  }

  :deep(canvas) {
    width: 100% !important;
    height: 100% !important;
    display: block;
    object-fit: contain;
  }

  h2 { display: none; }
}
</style>