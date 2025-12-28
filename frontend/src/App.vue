<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HomeTitle from './components/HomeTitle.vue'
</script>

<template>
	<HomeTitle />
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
		<a
			href="/test"	
			class="text-blue-600 underline decoration-1 hover:decoration-2 visited:text-indigo-700"
		>
			components tests
		</a>
	</footer>
</template>

<style scoped>

</style>
