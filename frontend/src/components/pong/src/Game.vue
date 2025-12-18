<script setup lang="ts"> 
    import { GameCanvas } from "./GameCanvas.vue"
    import { Pong } from "./Pong.ts"
    import { reactive } from 'vue'

    const game = new Pong(800, 600);

    const game_state = reactive(game.getGameState());

</script>

<template>
    <h1> "hey bitches kjdkfjfj" </h1>
    <GameCanvas :gameState="game_state"> </GameCanvas>
 </template>