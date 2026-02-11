<script setup lang="ts">
import      { ref, onMounted, onUnmounted } from 'vue';
import      GameCanvas from './GameCanvas.vue';
import type { GameState } from './GameState';
import      ButtonComponent from "@/components/ButtonComponent.vue";
import      { useRouter } from 'vue-router';

const router = useRouter();
let   socket: WebSocket | null = null;
const currentGameState = ref<GameState | null>(null);
const msgPong = ref<string | null>(null);
const leftPlayerName = ref<string>("Loading...");
const rightPlayerName = ref<string>("Loading...");
const mySide = ref<string | null>(null);

// to control cancel button
let isMatchmaking = ref(true);

//timer variables
const gameEnded = ref(false);
let postWinTimer: ReturnType<typeof setTimeout> | null = null;


const handleCancel = () => {
  if (socket) {
    socket.close();
  }
  router.push({name: 'home'});
};

// timer for redirection to main after endGame is reached
const startPostGameRoutine = () => {
  if (postWinTimer)
    return;
  //console.log("Win signal received. Starting 5s interval...");
  postWinTimer = setTimeout(() => {
    router.push({name: 'home'});
  }, 5000);
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
    // If touch is on the left side of the physical phone
    sendInput(touchX > middle ? "w" : "s", true);
  } else {
    sendInput(touchX > middle ? "ArrowUp" : "ArrowDown", true);
  }
};

const handleOffline = () => {
  msgPong.value = "Connection lost. You are offline.";
  if (socket) {
    socket.close();
  }
  //startPostGameRoutine();
};

const handleOnline = () => {
  msgPong.value = "You are online again! Returning to menu..."
  setTimeout(() => {
    router.push({ name: 'home' });
  }, 2000);
};

onMounted(() => {
// Connect to the Fastify backend WebSocket route
socket = new WebSocket("wss://" + window.location.host + "/api/ws/play");

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === "STATE_UPDATE") {
        currentGameState.value = data.state;
      }
      else if (data.type === "PLAY") {
        msgPong.value = "";
        isMatchmaking = false; // bye bye Cancel button
      }
      else if (data.type === "INFO") {
        msgPong.value = data.msg;
      }
      else if (data.type === "DISCONNECTED") {
        msgPong.value = `${data.username} has left the game. What a coward!`;
        isMatchmaking = false;
        startPostGameRoutine();
      }
      else if (data.type === "GAME_OVER") {
        msgPong.value = `${data.winnerName} wins!`;
        isMatchmaking = false;
        startPostGameRoutine();
      }
      else if (data.type === "ASSIGN_SIDE") {
        leftPlayerName.value = data.leftName;
        rightPlayerName.value = data.rightName;
        mySide.value = data.side;
      }
    } catch (err) {
      //console.error("Error parsing WebSocket message:", err); // should be logger in future
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);
  window.addEventListener('offline', handleOffline);
  window.addEventListener('online', handleOnline);
});

onUnmounted(() => {
  window.removeEventListener('offline', handleOffline);
  window.removeEventListener('online', handleOnline);
  window.removeEventListener("keydown", handleKeyDown);
  window.removeEventListener("keyup", handleKeyUp);

  if (socket) {
    socket.onmessage = null;
    socket.close();
    socket = null;
  }

  //clear timeout
  if (postWinTimer) {
    clearTimeout(postWinTimer);
    postWinTimer = null;
  }
});
</script>

<template>
  <div class="game-wrapper"
    @touchstart="handleTouch($event, true)"
    @touchend="handleTouch($event, false)">
    
    <div v-if="msgPong" class="status-msg flex items-center justify-center gap-4">
      <h1 class="winner-announcement">{{ msgPong }}</h1>
      <ButtonComponent 
        v-if="isMatchmaking" 
        label="Cancel"
        :is-danger="true"
        @click="handleCancel"
      />
    </div>

    <GameCanvas 
      :gameState="currentGameState"
      :leftName="leftPlayerName" 
      :rightName="rightPlayerName"
    />
  </div>
</template>

<style scoped>
/* PC VERSION */
.game-wrapper {
  text-align: center;
  color: var(--color_accent_1);
  font-family: 'Oswald', sans-serif;
}

@media (min-width: 1024px) {
  .status-msg {
    margin-bottom: 2rem;
  }
}

.winner-announcement {
  font-size: 1rem;
  font-weight: bold;
  text-transform: uppercase;
  color: var(--color_accent_1); 
  text-shadow: 2px 2px 0px var(--color_background_1);
  /*margin-bottom: 20px;*/
}

/*.overlay {
  margin-top: 20px;
  color: #888;
}*/

/* MOBILE VERSION */
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
    padding: 15px 25px;
    border: 1px solid white;
    margin: 0;
    pointer-events: auto; /*for cancel button to work but then block the screen */
    border-radius: 8px; 
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
