<script setup lang="ts">
import {ref, computed} from 'vue';
//import defaultProfilePicture from "@/assets/defaultProfilePicture.svg";
import UserAvatar from '@/components/UserAvatar.vue';
import { useRouter } from 'vue-router';

//	prop handeling. 
interface leaderboardCardInfo {
	ranking: number,
	profilePicture?: string,
	online: boolean,
	nickName: string,
	points: number,
};

const props = defineProps<leaderboardCardInfo>();

const ranking_ordinal_num = computed(() => {
	if (props.ranking === 1) { return ('1st#'); }
	if (props.ranking === 2) { return ('2nd#'); }
	if (props.ranking === 3) { return ('3rd#'); }
});

//	user actions.

function redirectToUserProfilePage(): void{
	if (props.userName === undefined)
		return;
	router.push({'path': window.location.origin + "/users/" + userName._value});
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
	
	<!-- the rank of the player -->
	<div class="ml-[1.25rem] w-[3rem]">
		<p class="text-[2rem] text-(--color_accent_1)">{{ranking_ordinal_num}}</p>
	</div>
	<UserAvatar 
		:profilePicture="props.profilePicture"
		:onlineStatus="props.online"
	/>
	<div class="panelUserCardText flex flex-col gap-[0.3rem] w-full">
		<p 
			class="text-[1.5rem] font-medium text-nowrap"
		> 
			{{props.nickName}} 
		</p>
		<div 
			class="text-nowrap w-full h-[1rlh] overflow-hidden"
		>
			<p class="" > {{props.points}}k points </p>
		</div>
	</div>
</div>
</div>
</template>

<style scoped>

</style>
