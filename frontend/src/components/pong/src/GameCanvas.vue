<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { Renderer } from "./Renderer";
import type { GameState } from "./GameState";

const props = defineProps<{
  gameState: GameState
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
let renderer: Renderer | null = null;

onMounted(() => {
  if (canvasRef.value) {
    renderer = new Renderer(canvasRef.value);
    renderer.draw(props.gameState);
  }
});

// Watch for changes in the game state sent by the parent and re-draw
watch(() => props.gameState, (newState) => {
  if (renderer) renderer.draw(newState);
}, { deep: true });
</script>

<template>
  <div class="canvas-container">
    <canvas ref="canvasRef" width="800" height="600"></canvas>
  </div>
</template>

<style scoped>
.canvas-container {
  display: flex;
  justify-content: center;
  background: #1a1a1a;
  padding: 20px;
}
canvas {
  border: 2px solid white;
  background: black;
}
</style>