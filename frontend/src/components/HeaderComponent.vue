<script setup lang="ts">
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
			<a href="/" class="hover:underline" >PONG</a>
		</h1>
	</header>
</template>

<style scoped>

</style>
