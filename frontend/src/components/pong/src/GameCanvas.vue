
<script setup lang="ts">
    import { GameState } from "./GameState.ts";
    const   props = defineProps({
        gameState: GameState,

    });
    const   canvas = document.getElementById("myCanvas");
    const   renderer = new Renderer(canvas);
    renderer.draw(props);

</script>


<template>

    <canvas id="myCanvas" width="800" height="600"></canvas>

 </template>