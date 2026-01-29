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

console.log("DEBUG:");
console.log(session);
console.log(session.getUserId);

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
	console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA!");
}

</script>

<template>
<section class="max-w-[25rem] p-[1rem] m-auto flex flex-col gap-[2rem]">
	<UserCard 
		:nickName="nickName" 
		:userName="userName" 
		:online="online" 
		:profilePicture="profilePicture" 
		class="my-[4rem]"
	/>
	<ButtonComponent label="play" @click="$router.push({name: 'game'})"/>
	<ButtonComponent label="profile" @click="$router.push({name: 'profile'})"/>
	<ButtonComponent label="users" @click="$router.push({name: 'users'})"/>
	<ButtonComponent label="sign out" @click="sign_out()"/>
</section>
</template>
