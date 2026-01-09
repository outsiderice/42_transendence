<script setup lang="ts">
import PongLink from '../components/PongLink.vue'
</script>

<template>
	<footer class="fixed bottom-0 block w-full mb-[2rem] flex justify-center gap-[2rem]">
	<PongLink href="/terms_of_service" class="underline decoration-1 hover:decoration-2">
		Terms of service
	</PongLink>
	<PongLink href="/privacy_policy" class="underline decoration-1 hover:decoration-2">
		Privacy policy
	</PongLink>
	<PongLink href="/test" class="underline decoration-1 hover:decoration-2">
		Components test
	</PongLink>
	<PongLink href="/test_2" class="underline decoration-1 hover:decoration-2">
		Components test 2
	</PongLink>
</footer>

</template>

<style>

.pong-link:visited {
  color: var(--color_accent_link_visited);
}

</style>
