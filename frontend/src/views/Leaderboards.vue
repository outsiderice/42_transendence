<script setup lang="ts">
import LeaderboardCard from "@/components/LeaderboardCard.vue";
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
		nick: string, 
		name: string, 
		points: number,
		ranking: number, 
		online: boolean, 
		profilePic?: string
	}[]
> ([]);

async function get_user_info(id: number, rank: number, wins: number)
{
	const response = await fetch("https://" + window.location.host + "/api/users/" + id, {
		method: 'GET',
	});

	if (!response.ok)
	{
		return ;
	}
	const result = await response.json();
	let	user = {};

	user.id = id;
	user.rank = rank;
	user.points = wins * 0.1;
	user.nick = result.nickname;
	user.name = result.username;
	if (result.avatar === '') {
		user.profilePic = undefined;
	} else {
		user.profilePic = result.avatar;
	}
	if (onlineUsers.getUsersIds.indexOf(result.id) !== -1) {
		user.online = true;
	} else {
		user.online = false;
	}
	return (user);
}

fetch("https://" + window.location.host + "/api/ranking/users" , {
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
	let i = 0;

	while (i < result.length)
	{
		let	result_elem = result[i];
		let	user = await get_user_info(result_elem.id, i + 1, result_elem.wins);
		users.push(user);
		i++;
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
	console.log("users");
	console.log(users);
})

</script>

<template>
<section class="max-w-[40rem] p-[1rem] m-auto flex flex-col gap-[2rem]">
	<p>leaderboards.</p>
	<LeaderboardCard v-for='user in users'
		:ranking="user.rank"
		:profilePicture="user.profilePic" 
		:online="user.online" 
		:nickName="user.nick" 
		:userName="user.name" 
		:points="user.points" 
		class=""
	/>
</section>
</template>
