<script setup lang="ts">
import {ref, computed} from 'vue';
import defaultProfilePicture from "@/assets/defaultProfilePicture.svg";
 
interface userCardInfo {
	profilePicture?: string,
	nickName?: string,
	userName?: string,
	online?: boolean,
};

const props = defineProps<userCardInfo>();

const profilePicture = computed(() => {
	return props.profilePicture === undefined ? defaultProfilePicture : props.profilePicture;
});

const nickName = computed(() => {
	return props.nickName === undefined ? "loanding nick name...": props.nickName;
});

const userName = computed(() => {
	return props.userName === undefined ? "loanding user name...": props.userName;
});

const onlineStatus = computed(() => {
	return	props.userName === undefined ? "loanding online status...": 
			props.online ? "online" : "offline";
});

const onlineIndicatorColor = computed(() => {
	return	props.userName === undefined ? "var(--color_accent_3)" :
			props.online ? "var(--color_accent_success)" : "var(--color_accent_danger)";
});


</script>

<template>
<div 
	class="
		userCardContainer 
		bg-(--color_background_2) 
		hover:bg-(--color_background_3) 
		block 
		w-[30rem]
		p-[0.62rem]
		rounded-[1.25rem]
		border
		border-(--color_accent_3)
		m-[1rem]">
<div class="flex flex-row gap-[1rem]">
	<svg viewBox="0 0 60 60" class="profilePictureContainer w-[3.75rem] h-[3.75rem] flex-none">
		<defs>
			<mask id="statusIndicatorHole">
				<rect width="60" height="60" fill="white"/>
				<circle r="10" cx="50" cy="50" fill="black"/>
			</mask>
			<mask id="profileMask" >
				<rect width="60" height="60" fill="black"/>
				<circle r="30" cx="30" cy="30" fill="white"mask="url(#statusIndicatorHole)"/>
			</mask>
			<mask id="defaultProfileMask" >
				<rect width="60" height="60" fill="black"/>
				<image width="60" height="60" :href="defaultProfilePicture" />
			</mask>
		</defs>
		<g v-if="props.profilePicture === undefined" mask="url(#profileMask)" >
			<rect width="60" height="60" fill="var(--color_accent_1)" mask="url(#defaultProfileMask)" />
		</g>
		<image v-else width="60" height="60" :href="profilePicture" mask="url(#profileMask)" />
		<circle r="8" cx="50" cy="50" :fill="onlineIndicatorColor"/>
	</svg>
	<div class="panelUserCardText flex flex-col gap-[0.3rem] w-full">
		<div class="panelTitleContainer" >
			<p class="text-[1.5rem] font-medium text-nowrap"> {{nickName}} </p>
		</div>
		<div class="panelSubtextContainer text-nowrap w-full h-[1rlh] overflow-hidden relative" >
			<p class="userNameText absolute left-0" > {{userName}} </p>
			<p class="onlineStatusText absolute left-0" > {{onlineStatus}} </p>
		</div>
	</div>
</div>
</div>
</template>

<style scoped>


.userNameText {
	top: -1rlh;
	transition: 0.25s;
}

.userCardContainer:hover .userNameText {
	top: 0rlh;
}

.onlineStatusText {
	top: 0rlh;
	transition: 0.25s;
}

.userCardContainer:hover .onlineStatusText {
	top: 1rlh;
}

</style>
