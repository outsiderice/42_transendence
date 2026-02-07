<script setup lang="ts">
import {ref, computed} from 'vue'; 
import defaultProfilePicture from "@/assets/defaultProfilePicture.svg";

interface userAvatarInfo {
	profilePicture?: string,
	online: boolean,
};

const props = defineProps<userAvatarInfo>();

const profilePicture = computed(() => {
	return props.profilePicture === undefined ? defaultProfilePicture : props.profilePicture;
});

const onlineIndicatorColor = computed(() => {
	return	props.online ? "var(--color_accent_success)" : "var(--color_accent_danger)";
});

</script>

<template>
	<svg viewBox="0 0 60 60" v-on:click="" class="
			profilePictureContainer 
			w-[3.75rem] 
			h-[3.75rem] 
			flex-none 
			hover:scale-110 
			transition
			diration-200
	">
		<defs>
			<mask id="statusIndicatorHole">
				<rect width="60" height="60" fill="white"/>
				<circle r="12" cx="50" cy="50" fill="black"/>
			</mask>
			<mask id="profileMask" >
				<rect width="60" height="60" fill="black"/>
				<circle r="30" cx="30" cy="30" fill="white" mask="url(#statusIndicatorHole)"/>
			</mask>
			<mask id="defaultProfileMask" >
				<rect width="60" height="60" fill="black"/>
				<image width="60" height="60" :href="defaultProfilePicture" />
			</mask>
		</defs>
		<!-- default profile picture for users without a profile picture -->
		<g v-if="props.profilePicture === undefined" mask="url(#profileMask)" >
			<rect 
				width="60" 
				height="60" 
				fill="var(--color_accent_1)" 
				mask="url(#defaultProfileMask)" 
			/>
		</g>
		<!-- user profile picture -->
		<image v-else width="60" height="60" :href="profilePicture" mask="url(#profileMask)" />
		<circle r="8" cx="50" cy="50" :fill="onlineIndicatorColor"/>
	</svg>
</template>

