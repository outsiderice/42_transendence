<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
	<header class="block w-full mt-[2em] flex items-center">
		<h1 class="inline-block m-auto w-full text-center text-[6rem] sm:text-[8rem]">PONG</h1>
	</header>
	
	<RouterView />
</template>

<style scoped>



</style>
