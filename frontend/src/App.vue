<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HomeTitle from './components/HomeTitle.vue'
import PongLink from './components/PongLink.vue'
</script>

<template>
	<HomeTitle />
	<RouterView />
	<footer class="absolute bottom-0 block w-full mb-[2rem] flex justify-center gap-[2rem]" >
		<PongLink to="/terms_of_service">
      		Terms of service
    	</PongLink>
		<PongLink to="/privacy_policy">
			Privacy policy
    	</PongLink>
		<PongLink to="/test">
			Test
    	</PongLink>
	</footer>
</template>

<style scoped>

</style>
