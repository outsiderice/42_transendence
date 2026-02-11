<script setup lang="ts">
import UserRequestCard from "@/components/UserRequestCard.vue";
import { useSessionStore } from '@/state/user_session.ts'
import { ref, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useOnlineUsersStore } from '@/state/online_users.ts'

const session = useSessionStore();
const router = useRouter();


const onlineUsers = useOnlineUsersStore();

const petitioners = reactive
<
	{
		id: number,
		name: string, 
		nick: string, 
		online: boolean, 
		profilePic?: string
	}[]
> ([]);

async function petitioner_info(id: number, petition: object)
{
	let petitioner;
	if (id === petition.user_1){
		//petitioner is user_2
		petitioner = {
			id: petition.user_2,
			name: petition.user_2_username,
			nick: petition.user_2_nickname,
			profilePic: petition.user_2_avatar || undefined,
			online: false
		};
	} else {
		petitioner = {
			id: petition.user_1,
			name: petition.user_1_username,
			nick: petition.user_1_nickname,
			profilePic: petition.user_1_avatar || undefined,
			online: false
		};
	}
	if (onlineUsers.getUsersIds.indexOf(petitioner.id) !== -1) {
		petitioner.online = true;
	}
	return (petitioner);
}

fetch ("https://" + window.location.host + "/api/usersPetitions/" + session.getUserId, {
	method: 'GET',
	}).then(async (response) => {
	if (!response.ok)
	{
		session.$reset();
		router.push({name: 'signin'});
		return ;
	}
	const result =  await response.json();
	let i = 0;
	while (i < result.length)
	{
		let result_element = result[i];
		let petitioner = petitioner_info(session.getUserid, result_element);
		petitioners.push(petitioner);
		i++; 
	}
});

watch(onlineUsers.usersIds, () => {
	let i = 0;
	while (i < petitioners.length)
	{
		if (onlineUsers.getUsersIds.indexOf(Number (petitioners[i].id)) != -1) {
			petitioners[i].online = true;
		} else {
			petitioners[i].online = false;
		}
		i++;
	}
})

</script>

<template>
<section class="max-w-[40rem] p-[1rem] m-auto flex flex-col gap-[2rem]">
	<p>friendship requests.</p>
	<UserRequestCard v-for='petitioner in petitioners'
		:relationshipId="petitioner.id"
		:profilePicture="petitioner.profilePic" 
		:online="petitioner.online" 
		:nickName="petitioner.nick" 
		class=""
	/>
</section>
</template>
