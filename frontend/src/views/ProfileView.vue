<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import PongButton from '../components/PongButton.vue';
import UserCard from '@/components/UserCard.vue'
import ButtonComponent from '@/components/ButtonComponent.vue'
import DisabledButtonComponent from '@/components/DisabledButtonComponent.vue'
import { useSessionStore } from '@/state/user_session.ts'
import bookIcon from '@/assets/book_icon.svg';
import userIcon from '@/assets/user_icon.svg';
import GameHistoricStatisticsCard from '@/components/GameHistoricStatisticsCard.vue';
import GameStatisticsCard from '@/components/GameStatisticsCard.vue';

import { useOnlineUsersStore } from '@/state/online_users.ts'

const onlineUsers = useOnlineUsersStore();

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
>( { online: false } );

const friends = reactive<
{
	id: number,
	name: string, 
	nick: string, 
	online: boolean, 
	profilePic?: string
}[]
>([]);

const total_games = reactive<
{
	wins: number,
	loses: number,
}
>({wins: 0, loses: 0});

const games = reactive<
{
	id: number,
	name: string,
	nick: string,
	points_won: number,
	points_lost: number,
	won: boolean,
	date_of: string,
}[]
>([]);

const user_kind = ref<
	'oneself' | 
	'friend' | 
	'requested_friend' | 
	'requesting_friendship' | 
	'stranger'
>('stranger');

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
	if (result1.avatar === '') {
		user.profilePic = undefined;
	} else {
		user.profilePic = 'https://' + window.location.host + "/" + result1.avatar;
	}
	user.id = result1.id;
	
	//	know if the user is oneself.
	if (user.id == session.getUserId)
	{
		user_kind.value = 'oneself';
		user.online = true;
		load_status.value = 'loaded';
		return ;
	}
	if (onlineUsers.getUsersIds.indexOf(user.id) !== -1) {
		user.online = true;
	} else {
		user.online = false;
	}
	
	//	know if the user is a friend.
	const response2 = await fetch(
		"https://" + window.location.host + "/api/friends?user_1=" + user.id, 
		{ method: 'GET' }
	);
	const result2 = await response2.json();
	while (result2.length != 0)
	{
		const friendship = result2.pop();
		if (friendship.user_1 === session.getUserId || friendship.user_2 === session.getUserId)
		{
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
		const item = result3.pop();
		if (item.user_1 == session.getUserId)
		{
			user_kind.value = 'requested_friend';
			load_status.value = 'loaded';
			return ;
		}
	}
	//	know if the user has requested a friendship.
	const response4 = await fetch(
		"https://" + window.location.host + "/api/friendsPetitions?user_1=" + session.getUserId, 
		{ method: 'GET' }
	);
	const result4 = await response4.json();
	while (result4.length != 0)
	{
		const item = result4.pop();
		if (item.user_1 == user.id)
		{
			user_kind.value = 'requesting_friendship';
			load_status.value = 'loaded';
			return;
		}
	}
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
	if (user_kind.value === 'requesting_friendship')
	{
		buttonLabel.value = 'user has requested your friendship.';
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

async function set_game_history()
{
	const response = await fetch(
		"https://" + window.location.host + "/api/games?user_1=" + user.id,
		{
			method: 'GET',
			headers: 
			{
				'accept': '*/*',
			},
		},
	);
	const result = await response.json();
	while (result.length != 0)
	{
		const	item = result.pop();
		let		game = {};
		game.id = item.id;
		if (item.player1_id == user.id)
		{
			game.name = item.player2_username;
			game.nick = item.player2_nickname;
			game.points_won = item.player1_score;
			game.points_lost = item.player2_score;
		}
		else
		{
			game.name = item.player1_username;
			game.nick = item.player1_nickname;
			game.points_won = item.player2_score;
			game.points_lost = item.player1_score;
		}
		if (item.winner_id == user.id) {
			game.won = true;
		} else {
			game.won = false;
		}
		game.date_of = item.created_at;
		games.push(game);
	}
	let i = 0;
	while (games.length > i)
	{
		if (games[i].won) {
			total_games.wins++;
		} else {
			total_games.loses++;
		}
		i++;
	}
	return ;
}

function set_friends()
{
	fetch(
		"https://" + window.location.host + "/api/usersFriends/" + user.id, 
		{ method: 'GET' }
	).then((response) => {
		return response.json();
	}).then((result) => {
		while (result.length != 0)
		{
			const item = result.pop();
			let	user_item = {};
			user_item.id = item.id;
			user_item.nick = item.nickname;
			user_item.name = item.username;
			if (onlineUsers.getUsersIds.indexOf(item.id) !== -1) {
				user_item.online = true;
			} else {
				user_item.online = false;
			}
			if (item.avatar == '') {
				user_item.profilePic = undefined;
			} else {
				user_item.profilePic = item.avatar;
			}
			friends.push(user_item);
		}
	});
	
	return ;
}

load_user_info().then(() => {
		set_button_label();
		set_achievements();
		set_game_history();
		set_friends();
		});

async function send_friend_request()
{
	await fetch(
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
		load_user_info().then(() => {set_button_label()});
	});

	return ;
}

async function remove_friend()
{
	// get all the friendships for finding the friendship id.
	const response1 = await fetch(
		"https://" + window.location.host + "/api/friends?user_1=" + user.id, 
		{ method: 'GET' }
	);
	const result1 = await response1.json();
	let	friendShipId;
	while (result1.length != 0)
	{
		const item = result1.pop();
		if ((item.user_1 == session.getUserId && item.user_2 == user.id) || 
				(item.user_2 == session.getUserId && item.user_1 == user.id))
		{
			friendShipId = item.id;
		}
	}
	//	send the fetch for deleting this friendship.
	fetch(
			"https://" + window.location.host + "/api/friends?id=" + friendShipId, 
			{ method: 'DELETE' }
		 );
	return ;
}

async function action()
{
	if (load_status.value === 'loanding')
	{
		return ;
	}
	if (user_kind.value === 'oneself')
	{
		router.push({path: '/edit_profile'});
		load_user_info().then(() => {set_button_label()});
		return ;
	}
	if (user_kind.value === 'friend')
	{
		await remove_friend();
		load_user_info().then(() => {set_button_label()});
		return ;
	}
	if (user_kind.value === 'stranger')
	{
		await send_friend_request();
		load_user_info().then(() => {set_button_label()});
		return ;
	}
}


watch(onlineUsers.usersIds, () => {
	let i = 0;
	while (i < friends.length)
	{
		if (onlineUsers.getUsersIds.indexOf(Number (friends[i].id)) != -1) {
			friends[i].online = true;
		} else {
			friends[i].online = false;
		}
		i++;
	}
})

</script>

<template>
<section class="max-w-[30rem] p-[1rem] m-auto flex flex-col gap-[2rem]">
	<!-- Contenido principal -->
	<div v-if="load_status !== 'fail'" class="flex flex-col gap-[2rem]">
		<UserCard
			:nickName="user.nick" 
			:userName="user.name" 
			:online="user.online" 
				:profilePicture="user.profilePic" 
		/>
		<DisabledButtonComponent 
			v-if="
				load_status == 'loanding' || 
				user_kind == 'requested_friend' || 
				user_kind == 'requesting_friendship'
			" 
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
	<div class="w-full flex flex-row">
		<button 
			@click="currentTab = 'friends'"
			class="basis-64 rounded-md hover:bg-(--color_background_3) pt-[0.8rem] transition-all duration-200"
		>
		<div class='mx-auto inline-block' >
			<div class='inline-block px-[0.5rem]' >
			<svg viewBox="0 0 19 19" class="w-[1.2rem] mb-[-0.1rem] mx-auto">
				<defs>
					<mask id="userIconMask">
						<rect width="19" height="19" fill="black" />
						<image width="19" height="19" :href="userIcon"/>
					</mask>
				</defs>
				<rect 
					width='19' 
					height='19' 
					:fill="
						currentTab === 'friends' ? 
							'var(--color_accent_1)' 
						: 
							'var(--color_accent_3)'
					"
					mask="url(#userIconMask)"
				/>
			</svg>
			<span :class="'text-' + (
					currentTab === 'friends' ? 
						'(--color_accent_1)'
					:
						'(--color_accent_3)'
				)"
			>
				friends
			</span>
			</div>
			<div 
				v-if="currentTab === 'friends'" 
				class="h-[0.2rem] rounded-t-[200rem] mt-[0.3rem] w-full bg-(--color_accent_1)"
			/>
			<div 
				v-if="currentTab !== 'friends'" 
				class="h-[0.2rem] rounded-t-[200rem] mt-[0.3rem] w-full "
			/>
		</div>
		</button>

		<button 
			@click="currentTab = 'game_history'"
			class="basis-64 rounded-md hover:bg-(--color_background_3) pt-[0.8rem] transition-all duration-200"
		>
		<div class='mx-auto inline-block' >
			<div class='inline-block px-[0.5rem]' >
			<svg viewBox="0 0 19 19" class="w-[1.2rem] mb-[-0.1rem] mx-auto">
				<defs>
					<mask id="bookIconMask">
						<rect width="19" height="19" fill="black" />
						<image width="19" height="19" :href="bookIcon"/>
					</mask>
				</defs>
				<rect 
					width='19' 
					height='19' 
					:fill="
						currentTab === 'game_history' ? 
							'var(--color_accent_1)' 
						: 
							'var(--color_accent_3)'
					"
					mask="url(#bookIconMask)"
				/>
			</svg>
			<span :class="'text-' + (
					currentTab === 'game_history' ? 
						'(--color_accent_1)'
					:
						'(--color_accent_3)'
				)"
			>
				game history
			</span>
			</div>
			<div 
				v-if="currentTab === 'game_history'" 
				class="h-[0.2rem] rounded-t-[200rem] mt-[0.3rem] w-full bg-(--color_accent_1)"
			/>
			<div 
				v-if="currentTab !== 'game_history'" 
				class="h-[0.2rem] rounded-t-[200rem] mt-[0.3rem] w-full"
			/>
		</div>
		</button>
	</div>

	<!-- friends -->
	<section 
		v-if="currentTab === 'friends'" 
		class="max-w-[30rem] flex flex-col gap-[2rem]"
	>
		<p v-if='friends.length == 0'>{{user.nick}} has no friends</p>
		<UserCard v-for='friend in friends'
			:nickName="friend.nick" 
			:userName="friend.name" 
			:online="friend.online" 
			:profilePicture="friend.profilePic" 
			class=""
		/>
	</section>
	<!-- games -->
	<section 
		v-if="currentTab === 'game_history'" 
		class="max-w-[30rem] flex flex-col gap-[2rem]"
	>
		<GameHistoricStatisticsCard 
			class='mb-[2rem]'
			:gamesWon='total_games.wins' 
			:gamesLost='total_games.loses' 
		/>
		<GameStatisticsCard v-for='game in games'
			:player2='game.name'
			:dateStr='game.date_of'
			:pointsPlayer1='game.points_won'
			:pointsPlayer2='game.points_lost'
		/>
	</section>
</section>
</template>

<style scoped>
</style>
