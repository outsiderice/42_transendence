<script setup lang="ts">
import UserRequestCard from "@/components/UserRequestCard.vue";
import { useSessionStore } from '@/state/user_session.ts'
import { ref, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useOnlineUsersStore } from '@/state/online_users.ts'

const session = useSessionStore();
const router = useRouter();


const onlineUsers = useOnlineUsersStore();

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

async function user_info(user: object)
{
	if (user.avatar === '') {
		user.profilePic = undefined;
	}
	if (onlineUsers.getUsersIds.indexOf(result.id) !== -1) {
		user.online = true;
	} else {
		user.online = false;
	}
	return (user);
}

fetch ("https://" + window.location.host + "/api/usersPetitions", {
	method: 'GET',
	}).then(async (response) => {
	if (!response.ok)
	{
		session.$reset();
		router.push({name: 'home'});
		return ;
	}
	const result =  await response.json();
	let i = 0;
	while (i < length)
	{
		let result_element = result[i];
		let user = user_info(result_element);
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
	<p>friendship requests.</p>
	<UserRequestCard v-for='user in users'
		:relationshipId="user.rank"
		:profilePicture="user.profilePic" 
		:online="user.online" 
		:nickName="user.nick" 
		:points="user.points" 
		class=""
	/>
</section>
</template>
