<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import PongButton from '../components/PongButton.vue';
import UserCard from '@/components/UserCard.vue'
import ButtonComponent from '@/components/ButtonComponent.vue'
import DisabledButtonComponent from '@/components/DisabledButtonComponent.vue'
import { useSessionStore } from '@/state/user_session.ts'

const session = useSessionStore();
const route = useRoute();
const router = useRouter();

const currentTab = ref<'friends' | 'game_history'>('friends');

const load_status = ref<'loanding' | 'loaded' | 'fail'>('loanding');

const user = reactive<
{
	id?: number,
		nick?: string,
		name?: string,
		online: boolean,
		profilePic?: string,
}
>(
		{
online: false,
}
);

const user_kind = ref<'oneself' | 'friend' | 'requested_friend' | 'stranger'>('stranger');

const buttonLabel = ref<string>('something');

async function load_user_info()
{
	//	get basic info on the user.
	const response1 = await fetch(
			"https://" + window.location.host + "/api/users/by-username/" + route.params.id, {
method:'GET',
});
if (!response1.ok)
{
	load_status.value = 'fail';
	return ;
}
const result1 = await response1.json();
user.name = result1.username;
user.nick = result1.nickname;
user.nick = result1.username;
if (result1.avatar === '') {
	user.profilePic = undefined;
} else {
	user.profilePic = result1.avatar;
}
user.id = result1.id;
console.log("user.");
console.log(user.id);
console.log(session.getUserId);

//	know if the user is oneself.
if (user.id == session.getUserId)
{
	console.log("this is oneself");
	user_kind.value = 'oneself';
	user.online = true;
	load_status.value = 'loaded';
	return ;
}

//	know if the user is a friend.
const response2 = await fetch(
		"https://" + window.location.host + "/api/friends?user_1=" + user.id, 
		{ method: 'GET' }
		);
const result2 = await response2.json();
console.log(result2);
while (result2.length != 0)
{
	const friendship = result2.pop();
	if (friendship.user_1 === session.getUserId || friendship.user_2 === session.getUserId)
	{
		console.log("this is a friend");
		user_kind.value = 'friend';
		load_status.value = 'loaded';
		return ;
	}
}
//	know if the user is pending as a friend.
const response3 = await fetch(
		"https://" + window.location.host + "/api/friendsPetitions?user_1=" + user.id, 
		{ method: 'GET' }
		);
const result3 = await response3.json();
while (result3.length != 0)
{
	if (result3.pop().user_1 === session.getUserId)
	{
		console.log("will be a friend in the way.");
		user_kind.value = 'requested_friend';
		load_status.value = 'loaded';
		return ;
	}
}
console.log("will be a stranger.");
user_kind.value = 'stranger';
load_status.value = 'loaded';
return ;
}

function set_button_label()
{
	if (load_status.value === 'loanding')
	{
		buttonLabel.value = 'wait for the page to load.';
		return ;
	}
	if (user_kind.value === 'oneself')
	{
		buttonLabel.value = 'edit profile';
		return ;
	}
	if (user_kind.value === 'friend')
	{
		buttonLabel.value = 'remove friendship';
		return ;
	}
	if (user_kind.value === 'requested_friend')
	{
		buttonLabel.value = 'friend request ongoing.';
		return ;
	}
	if (user_kind.value === 'stranger')
	{
		buttonLabel.value = 'send friend request.';
		return ;
	}
	return ;
}

function set_achievements()
{
	return ;
}

function set_game_history()
{
	return ;
}

function set_friends()
{
	return ;
}

load_user_info().then(() => {
		console.log(user_kind.value);
		set_button_label();
		set_achievements();
		set_game_history();
		set_friends();
		});

function send_friend_request()
{
	console.log('sending a friend request.');
	fetch(
		"https://" + window.location.host + "/api/friends", 
		{
			method: 'POST',
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				"user_1": session.getUserId,
				"user_2": user.id,
				"petition_status": 3,
			}),
		}
	).then(() => {
		window.location.reload();
	});

	return ;
}

async function remove_friend()
{
	console.log('removing a friend.');
	// get all the friendships for finding the friendship id.
	const response1 = await fetch(
		"https://" + window.location.host + "/api/friends?user_1" + user.id, 
		{ method: 'GET' }
	);
	const result1 = await response1.json();
	console.log(result1);
	console.log(user.id);
	console.log(session.getUserId);
	let	friendShipId;
	while (result1.length != 0)
	{
		const item = result1.pop();
		console.log(item);
		if ((item.user_1 == session.getUserId && item.user_2 == user.id) || 
				(item.user_2 == session.getUserId && item.user_1 == user.id))
		{
			friendShipId = item.id;
		}
	}
	console.log(friendShipId);
	//	send the fetch for deleting this friendship.
	fetch(
			"https://" + window.location.host + "/api/friends?id=" + friendShipId, 
			{ method: 'DELETE' }
		 );
	return ;
}

function action()
{
	if (load_status.value === 'loanding')
	{
		console.log("esperate a que carge la pagina.");
		return ;
	}
	if (user_kind.value === 'oneself')
	{
		router.push({path: '/edit_profile'});
		return ;
	}
	if (user_kind.value === 'friend')
	{
		remove_friend();
		return ;
	}
	if (user_kind.value === 'stranger')
	{
		send_friend_request();
		return ;
	}
}

</script>

<template>

<section class="max-w-[25rem] p-[1rem] m-auto flex flex-col gap-[2rem]">
	<!-- Contenido principal -->
	<div v-if="load_status !== 'fail'" class="flex flex-col gap-[2rem]">
		<UserCard
			:nickName="user.nick" 
			:userName="user.name" 
			:online="user.online" 
			:profilePicture="user.profilePic" 
		/>
		<DisabledButtonComponent 
			v-if="load_status == 'loanding' || user_kind == 'requested_friend'" 
			:label="buttonLabel" 
		/>
		<ButtonComponent 
			v-else
			:label="buttonLabel" 
			@click="action()" 
		/>
	</div>

	<div v-else>
		<p>Unable to load user.</p>
	</div>

	<!-- Tabs -->
	<div class="w-full bg-[var(--color_background_2)] rounded-lg flex p-1">
		<button 
			@click="currentTab = 'friends'"
			:class="
				[
					'flex-1 flex flex-col items-center py-2 transition rounded-md', 
					currentTab === 'friends' ? 
						'bg-[var(--color_background_3)] shadow-sm' 
					: 
						'opacity-60'
				]
			"
		>
			<div 
				class="
					w-5 
					h-5 
					mb-1 
					bg-[var(--color_accent_3)] 
					rounded-full 
					flex 
					items-center 
					justify-center
				"
			>
				<span class="text-[10px] text-[var(--color_background_3)]">★</span>
			</div>
			<span class="text-[10px] font-bold uppercase">friends</span>
		</button>

		<button 
			@click="currentTab = 'game_history'"
			:class="
				[
					'flex-1 flex flex-col items-center py-2 transition rounded-md', 
					currentTab === 'game_history' ? 
						'bg-[var(--color_background_3)] shadow-sm' 
					: 
						'opacity-60'
				]
			"
		>
			<div 
				class="
					w-5 
					h-5 
					mb-1 
					border-2 
					border-[var(--color_accent_3)] 
					rounded-full 
					flex 
					items-center 
					justify-center
				"
			>
				<span class="text-[10px] text-[var(--color_accent_3)]">🕒</span>
			</div>
			<span class="text-[10px] font-bold uppercase">game history</span>
		</button>
	</div>

	<!-- Achievements -->
	<div v-if="currentTab === 'friends'" class="w-full flex flex-col items-center">
		<p>this is the friends.</p>
	</div>
	
	<div v-if="currentTab === 'game_history'" class="w-full flex flex-col items-center">
		<p>this is the game history.</p>
	</div>
</section>
</template>

<style scoped>
</style>
