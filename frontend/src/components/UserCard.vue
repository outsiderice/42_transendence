<script setup lang="ts">

import defaultProfilePicture from "@/assets/defaultProfilePicture.svg";

const {
	profilePicture = defaultProfilePicture,
	nickName = "loading nick name...",
	userName = "loading user name...",
	online = false,
} = defineProps<{
	profilePicture?: string,
	nickName?: string,
	userName?: string,
	online?: boolean
}>();

</script>

<template>
<div class="bg-(--color_background_2)">
	<p>
		hello this is the usre card component.
	</p>
	<img class="w-[3.75rem] h-[3.75rem] rounded-full" :src="profilePicture">
	<p> {{nickName}} </p>
	<p> {{userName}} </p>
	<p> {{online}} </p>
</div>
</template>

<style scoped>

</style>
