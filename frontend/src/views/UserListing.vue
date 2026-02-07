<script setup lang="ts">
import UserCard from "@/components/UserCard.vue";
import { useSessionStore } from '@/state/user_session.ts'
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import ButtonComponent from "@/components/ButtonComponent.vue";

const session = useSessionStore();
const router = useRouter();

//	 the information of the currently loged in user.

const user = reactive
<
	{
		set: boolean,
		name?: string, 
		nick?: string, 
		online?: boolean, 
		profilePic?: string
	}
> ({set: false});

console.log("DEBUG:");
console.log(session);
console.log(session.getUserId);

fetch("https://" + window.location.host + "/api/users/" + session.getUserId , {
	method: 'GET',
	headers: {
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
		user.nick = result.nickname;
	} else {
		user.nick = "unamed";
	}
	user.name = result.username;
	if (result.avatar !== '') {
		user.profilePic = result.avatar;
	}
	user.set = true;
});

</script>

<template>
<section class="max-w-[25rem] p-[1rem] m-auto flex flex-col gap-[2rem]">
	<UserCard v-if='user.set'
		:nickName="user.nick" 
		:userName="user.name" 
		:online="user.online" 
		:profilePicture="user.profilePic" 
		class="my-[4rem]"
	/>
	<p>hola soy el listado de usuarios.</p>
</section>
</template>
