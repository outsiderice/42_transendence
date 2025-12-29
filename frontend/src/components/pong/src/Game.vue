<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import GameCanvas from "./GameCanvas.vue";
import { Pong } from "./Pong";
import type { GameState } from "./GameState";

const game = new Pong(800, 600);
// ref for the state so Vue knows when to update the child
const gameState = ref<GameState>(game.getGameState());
let animationFrameId: number;

const gameLoop = () => {
  game.update();
  gameState.value = game.getGameState(); // Push new data to the Canvas
  animationFrameId = requestAnimationFrame(gameLoop);
};

onMounted(() => {
  game.setupControls();
  gameLoop();
});

onUnmounted(() => {
  game.cleanup(); //stops listening the keys
  cancelAnimationFrame(animationFrameId); // stops the animation loop
});
</script>

<template>
  <div class="game-page">
    <h1>Pong Arena</h1>
    <GameCanvas :gameState="gameState" />
    <p>Use W/S and Arrow Keys to move</p>
  </div>
</template>

<style scoped>
.game-page {
  text-align: center;
  color: white;
}
</style>