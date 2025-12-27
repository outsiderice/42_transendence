<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
	<header class="block w-full">
		<h1 class="inline-block m-auto w-full text-center text-[6rem] sm:text-[8rem]">PONG</h1>
	</header>
	<RouterView />
	<footer class="absolute bottom-0 block w-full mb-[2rem] flex justify-center gap-[2rem]" >
		<a 
			href="/terms_of_service" 
			class="text-blue-600 underline decoration-1 hover:decoration-2 visited:text-indigo-700"
		>
			Trems of service
		</a>
		<a
			href="/privacy_policy"	
			class="text-blue-600 underline decoration-1 hover:decoration-2 visited:text-indigo-700"
		>
			Privacy policy
		</a>
	</footer>
</template>

<style scoped>

</style>
