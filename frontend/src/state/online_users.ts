import { defineStore } from 'pinia';
import { ref, computed, reactive } from 'vue';

export const useOnlineUsersStore = defineStore( 'online users', () => {

	setInterval(async () => {
		console.log("requesting online status of users.");
		const response = await fetch("https://" + window.location.host + "/api/presence", {
			method: 'GET',
		}).then( async (response) => {
			if (!response.ok)
			{
				return ;
			}
			const result = await response.json();
			while (usersIds.length != 0)
			{
				usersIds.pop();
			}
			while (result.length != 0)
			{
				usersIds.push(result.pop());
			}
			console.log("this is the user listing.");
			console.log(usersIds);
		});
	}, 2000);

	const usersIds = reactive<numbers[]>(Array());

	const getUsersIds = computed(() => {return userIds});

	return {
		usersIds, 
		getUsersIds, 
	};
});

