<script setup lang="ts">
import {ref, computed} from 'vue';
//import defaultProfilePicture from "@/assets/defaultProfilePicture.svg";
import UserAvatar from '@/components/UserAvatar.vue';

//	prop handeling. 
interface userCardInfo {
	profilePicture?: string,
	nickName: string,
	userName: string,
	online: boolean,
};

const props = defineProps<userCardInfo>();

console.log(props.online);

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
	return props.online ? "var(--color_accent_success)" : "var(--color_accent_danger)";
});

//	user actions.

function redirectToUserProfilePage(): void{
	if (props.userName === undefined)
		return;
	window.location.href = window.location.origin + "/users/" + userName._value;
}

</script>

<template>
<div class="
		userCardContainer 
		bg-(--color_background_2) 
		hover:bg-(--color_background_3)
		transition
		duration-200
		block 
		p-[0.62rem]
		rounded-[1.25rem]
		border
		border-(--color_accent_3)
">
<div class="flex flex-row gap-[1rem] items-center" v-on:click="redirectToUserProfilePage">
	
	<UserAvatar 
		:profilePicture="props.profilePicture"
		:online="props.online"
	/>
	<div class="panelUserCardText flex flex-col gap-[0.3rem] w-full">
		<p 
			v-if="props.userName !== undefined" 
			class="text-[1.5rem] font-medium text-nowrap"
		> 
			{{nickName}} 
		</p>
		<div 
			v-else 
			class="max-w-[8rem] h-[1.5rlh] bg-(--color_loading_content) animate-pulse rounded-full"
		>
			<div></div>
		</div>
		<div 
			v-if="props.userName !== undefined"
			class="panelSubtextContainer text-nowrap w-full h-[1rlh] overflow-hidden relative"
		>
			<p class="userNameText absolute left-0" > {{userName}} </p>
			<p class="onlineStatusText absolute left-0" > {{onlineStatus}} </p>
		</div>
		<div v-else class="max-w-[20rem] h-[1rlh] bg-(--color_loading_content) animate-pulse rounded-full"></div>
	</div>
</div>
</div>
</template>

<style scoped>

.userNameText {
	top: -1rlh;
	transition: 0.2s;
}

.userCardContainer:hover .userNameText {
	top: 0rlh;
}

.onlineStatusText {
	top: 0rlh;
	transition: 0.2s;
}

.userCardContainer:hover .onlineStatusText {
	top: 1rlh;
}

</style>
