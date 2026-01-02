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

console.log(props);

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



//const statusColor = computed(
//	() => {
//		return 
//		userName.value == "loading user name..." ? var(--color_accent_3) 
//		: online.value == true ? var(--color_accent_success) 
//		: var(--color_accent_danger)
//});

</script>

<template>
<div class="bg-(--color_background_2)">
<!--<svg viewBox="0 0 60 60" class="w-[20rem] h-[20rem]">-->
	<svg viewBox="0 0 60 60" class="w-[3.75rem] h-[3.75rem]">
		<defs>
			<mask id="statusIndicatorHole">
				<rect width="60" height="60" fill="white"/>
				<circle r="10" cx="50" cy="50" fill="black"/>
			</mask>
			<mask id="profileMask" >
				<rect width="60" height="60" fill="black"/>
				<circle r="30" cx="30" cy="30" fill="white"mask="url(#statusIndicatorHole)"/>
			</mask>
		</defs>
		<image width="60" height="60" :href="profilePicture" mask="url(#profileMask)" />
		<circle r="8" cx="50" cy="50" :fill="onlineIndicatorColor"/>
	</svg>
	<p> {{nickName}} </p>
	<p> {{userName}} </p>
	<p> {{onlineStatus}} </p>
</div>
</template>

<style scoped>

</style>
