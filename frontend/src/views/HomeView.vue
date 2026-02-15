<script setup lang="ts">
import UserCard from "@/components/UserCard.vue";
import { useSessionStore } from '@/state/user_session.ts'
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import ButtonComponent from "@/components/ButtonComponent.vue";

const session = useSessionStore();
const router = useRouter();

//	 the information of the currently loged in user.
const nickName = ref<string | undefined >(undefined);
const userName = ref<string | undefined >(undefined);
const online = ref<boolean | undefined >(undefined);
const profilePicture = ref<string | undefined>(undefined);


fetch("https://" + window.location.host + "/api/users/" + session.getUserId , {
	method: 'GET',
	headers: {
//		'If-None-Match': ""
	},
}).then(async (response) => {
	if (!response.ok)
	{
		session.$reset();
		router.push({name: 'signin'});
		return ;
	}
	const result = await response.json();
	if (result.nickname !== "") {
		nickName.value = result.nickname;
	} else {
		nickName.value = "no nickname";
	}
	userName.value = result.username;
	if (result.avatar !== '') {
		profilePicture.value = result.avatar;
	}
	online.value = true;
});

function sign_out()
{
	session.$reset();
	router.push({name: 'signin'});
}

</script>

<template>
<section class="max-w-[25rem] p-[1rem] m-auto flex flex-col gap-[2rem]">
	<UserCard 
		:nickName="nickName === undefined ? 'undefined' : nickName" 
		:userName="userName === undefined ? 'undefined' : userName" 
		:online="true" 
		:profilePicture="profilePicture" 
		class="my-[4rem]"
	/>
	<ButtonComponent label="play" @click="$router.push({name: 'game'})"/>
	<ButtonComponent label="profile" @click="$router.push({path: '/users/' + userName})"/>
	<ButtonComponent label="users" @click="$router.push({name: 'users'})"/>
	<ButtonComponent label="friendship requests" @click="$router.push({name: 'friendship_requests'})"/>
	<ButtonComponent label="leaderboards" @click="$router.push({name: 'leaderboards'})"/>
	<ButtonComponent label="sign out" @click="sign_out()"/>
</section>
</template>
