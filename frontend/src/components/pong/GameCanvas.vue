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
  if (!canvasRef.value || !containerRef.value) return;

  const container = containerRef.value;
  const canvas = canvasRef.value;

  // measuring header and message to extract their height
  const header = document.querySelector('header') || document.querySelector('.header');
  const statusMsg = document.querySelector('.status-msg');

  const headerHeight = header?.offsetHeight || 0;
  const msgHeight = statusMsg?.offsetHeight || 0;

  const padding = 70; // to prevent game touching the message
  const maxAvailableHeight = window.innerHeight - headerHeight - msgHeight - padding;
  const maxAvailableWidth = container.clientWidth;

  // ratio (4:3)
  const widthByHeight = (maxAvailableHeight * 800) / 600;

  // We pick the smallest width that fits both constraints (and stays under 1000px)
  const targetWidth = Math.min(maxAvailableWidth, widthByHeight, 1000);
  const targetHeight = (targetWidth * 600) / 800;

  // apply to DOM
  canvas.style.width = `${targetWidth}px`;
  canvas.style.height = `${targetHeight}px`;

  // internal resolution stays fixed for renderer
  canvas.width = 800;
  canvas.height = 600;
};

let animationFrame: number;
const renderLoop = () => {
  if (props.gameState && renderer) {
    renderer.draw(props.gameState, props.leftName, props.rightName);
  }
  animationFrame = requestAnimationFrame(renderLoop);
};

onMounted(() => {
  if (canvasRef.value) {
    renderer = new Renderer(canvasRef.value);
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    renderLoop(); //starts the loop
  }
});

onUnmounted(() => {
  cancelAnimationFrame(animationFrame);
  window.removeEventListener('resize', resizeCanvas);
});

// Every time the parent gets a new state from the server, this watcher triggers the draw function. Works but not the best for mobile

/*watch(() => props.gameState, (newState) => {
  if (newState && renderer) {
    renderer.draw(newState, props.leftName, props.rightName);
  }
}); */
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
  display: flex;
  justify-content: center;
  align-items: center;
}
.pong-canvas {
  background: black;
  border: 4px solid #333;
  display: block;
}
</style>