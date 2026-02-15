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

fetch ("https://" + window.location.host + "/api/friendsNick?user1_id=" + session.getUserId, {
	method: 'GET',
	}).then(async (response) => {
	const result =  await response.json();
	while (result.length != 0)
	{
		const item = result.pop();
		let petitioner = {};
		petitioner.id = item.id;
		petitioner.name = item.user1_name;
		petitioner.nick = item.user1_nickname;
		if (onlineUsers.getUsersIds.indexOf(item.id) !== -1) {
			petitioner.online = true;
		} else {
			petitioner.online = false;
		}
		if (item.user1_avatar == '') {
			petitioner.profilePic = undefined;
		} else {
			petitioner.profilePic = 'https://' + window.location.host + "/" + item.user1_avatar;
//			petitioner.profilePic = item.user1_avatar;
		}
		petitioners.push(petitioner);
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

function remove_petition(id: number)
{
	const index = petitioners.find((item) => item.id == id);
	petitioners.splice(index, 1);
}

</script>

<template>
<section class="max-w-[40rem] p-[1rem] m-auto flex flex-col gap-[2rem]">
	<p>friendship requests.</p>
	<UserRequestCard v-for='petitioner in petitioners'
		@status-updated="(id) => {remove_petition(id)}"
		:relationshipId="petitioner.id"
		:profilePicture="petitioner.profilePic" 
		:online="petitioner.online" 
		:nickName="petitioner.nick" 
		:userName="petitioner.name" 
		class=""
	/>
</section>
</template>
