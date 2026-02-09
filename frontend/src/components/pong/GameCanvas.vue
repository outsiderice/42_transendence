<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue';
import { Renderer } from './Renderer';
import type { GameState } from './GameState';

const props = defineProps<{
  gameState: GameState | null,
  leftName: string,
  rightName: string
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
const containerRef = ref<HTMLDivElement | null>(null);
let renderer: Renderer | null = null;

const resizeCanvas = () => {
  if (!canvasRef.value || !containerRef.value)
    return;
  const container = containerRef.value;
  const canvas = canvasRef.value;
  
  // to mantain the ratio 4:3
  const targetWidth = container.clientWidth;
  const targetHeight = (targetWidth * 600) / 800;

  canvas.style.width = `${targetWidth}px`;
  canvas.style.height = `${targetHeight}px`;
  canvas.width = 800;
  canvas.height = 600;
}

onMounted(() => {
  if (canvasRef.value) {
    renderer = new Renderer(canvasRef.value);
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', resizeCanvas);
});

// Every time the parent (Game.vue) gets a new state from the server, 
// this watcher triggers the draw function.
watch(() => props.gameState, (newState) => {
  if (newState && renderer) {
    renderer.draw(newState, props.leftName, props.rightName);
  }
});
</script>

<template>
  <div ref="containerRef" class="canvas-container">
    <canvas 
      ref="canvasRef" 
      class="pong-canvas"
    ></canvas>
  </div>
</template>

<style scoped>
.canvas-container {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
}
.pong-canvas {
  background: black;
  border: 4px solid #333;
  display: block;
}
</style>