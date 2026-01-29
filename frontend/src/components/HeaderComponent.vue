<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

function redirect_to_home_page() {
	console.log('it is doing the function.');
	router.push({name: 'home'});
}


</script>

<template>
	<header
		v-if="
			$route.path != '/online_game'
			&& $route.path != '/online_game/'
			&& $route.path != '/local_game'
			&& $route.path != '/local_game/'
		"
		class="block w-full"
	>
		<h1 class="inline-block m-auto w-full text-center text-[6rem] sm:text-[8rem]">
			<a @click="redirect_to_home_page" class="text-(--color_accent_1)! no-underline! decoration-4! hover:underline!" >PONG</a>
		</h1>
	</header>
</template>

<style scoped>

</style>
