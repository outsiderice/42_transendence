<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HeaderComponent from './components/HeaderComponent.vue'
import FooterComponent from './components/FooterComponent.vue'
</script>

<template>
	<HeaderComponent />
	<RouterView />
	<RouterLink to="/game">Game</RouterLink>
	<FooterComponent />
</template>

<style scoped>

</style>
