<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { Renderer } from './Renderer';
import type { GameState } from './GameState';

const props = defineProps<{
  gameState: GameState | null
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
let renderer: Renderer | null = null;

onMounted(() => {
  if (canvasRef.value) {
    renderer = new Renderer(canvasRef.value);
  }
});

// Every time the parent (Game.vue) gets a new state from the server, 
// this watcher triggers the draw function.
watch(() => props.gameState, (newState) => {
  if (newState && renderer) {
    renderer.draw(newState);
  }
});
</script>

<template>
  <canvas 
    ref="canvasRef" 
    width="800" 
    height="600" 
    class="pong-canvas"
  ></canvas>
</template>

<style scoped>
.pong-canvas {
  background: black;
  border: 4px solid #333;
  display: block;
  margin: 0 auto;
}
</style>