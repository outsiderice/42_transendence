<script setup lang="ts">
import UserCard from "@/components/UserCard.vue";
import { useSessionStore } from '@/state/user_session.ts'
import { ref, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';
import ButtonComponent from "@/components/ButtonComponent.vue";

const session = useSessionStore();
const router = useRouter();

import { useOnlineUsersStore } from '@/state/online_users.ts'

const onlineUsers = useOnlineUsersStore();

//	 the information of the currently loged in user.

const users = reactive
<
	{
		id: number,
		name: string, 
		nick: string, 
		online: boolean, 
		profilePic?: string
	}[]
> ([]);


fetch("https://" + window.location.host + "/api/users" , {
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
	console.log('result');
	console.log(result[2]);
	let		result_elem : any;
	while (result.length != 0)
	{
		let		user : any = {};
		result_elem = result.pop();
		user.id = result_elem.id;
		user.name = result_elem.username;
		if (result_elem.nickname !== "") {
			user.nick = result_elem.nickname;
		} else {
			user.nick = "unamed";
		}
		if (result_elem.avatar !== '') {
			user.profilePic = 'https://' + window.location.host + "/" + result_elem.avatar;
			console.log(user.profilePic);
//			user.profilePic = result_elem.avatar;
		} else {
			user.profilePic = undefined;
		}
		if (onlineUsers.getUsersIds.indexOf(result_elem.id) !== -1) {
			user.online = true;
		} else {
			user.online = false;
		}
		users.push(user);
	}
});

watch(onlineUsers.usersIds, () => {
	let i = 0;
	while (i < users.length)
	{
		if (onlineUsers.getUsersIds.indexOf(Number (users[i].id)) != -1) {
			users[i].online = true;
		} else {
			users[i].online = false;
		}
		i++;
	}
})

</script>

<template>
<section class="max-w-[25rem] p-[1rem] m-auto flex flex-col gap-[2rem]">
	<p>user listing.</p>
	<UserCard v-for='user in users'
		:nickName="user.nick" 
		:userName="user.name" 
		:online="user.online" 
		:profilePicture="user.profilePic" 
		class=""
	/>
</section>
</template>
