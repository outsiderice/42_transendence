<script setup lang="ts">
import LinkComponent from '../components/LinkComponent.vue'
</script>

<template>
	<footer class="
   		w-full
        mt-20
        mb-8
        flex
        justify-center
        gap-8
        font-['Oswald']
        tracking-widest">
	<LinkComponent href="/terms_of_service" label="Terms of service" class="text-(--color_accent_)"/>
	<LinkComponent href="/privacy_policy" label="Privacy policy" class="text-(--color_accent_1)" />
        <LinkComponent href="/sign_up" label="sign up" class="text-(--color_accent_1)"/>
</footer>

</template>

<style>

</style>
