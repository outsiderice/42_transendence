<script setup lang="ts">
import LinkComponent from '../components/LinkComponent.vue'
</script>

<template>
	<footer class="fixed bottom-0 block w-full mb-[2rem] flex justify-center gap-[2rem]">
	<LinkComponent href="/terms_of_service" label="Terms of service" />
	<LinkComponent href="/privacy_policy" label="privacy_policy" />
	<LinkComponent href="/test" label="test" />
	<LinkComponent href="/test_2" label="test 2" />
	<LinkComponent href="/sign_up" label="sign up" />
	<LinkComponent href="/edit_profile" label="edit profile" />
</footer>

</template>

<style>

</style>
