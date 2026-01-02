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
<!--<svg viewBox="0 0 60 60" class="w-[3.75rem] h-[3.75rem]"> -->
	<svg viewBox="0 0 60 60" class="w-[20rem] h-[20rem]">
		<def>
			<mask id="statusIndicatorHole">
				<rect width="60" height="60" fill="white"/>
				<circle r="10" cx="50" cy="50" fill="black"/>
			</mask>
			<mask id="profileMask" >
				<rect width="60" height="60" fill="black"/>
				<circle r="30" cx="30" cy="30" fill="white"mask="url(#statusIndicatorHole)"/>
			</mask>
		</def>
		<image width="100%" height="100%" :href="profilePicture" mask="url(#profileMask)" />
	</svg>
	<p> {{nickName}} </p>
	<p> {{userName}} </p>
	<p> {{online}} </p>
</div>
</template>

<style scoped>

</style>
