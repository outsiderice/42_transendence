import { defineStore } from 'pinia';
import { ref, computed, reactive } from 'vue';

export const useOnlineUsersStore = defineStore( 'online users', () => {

	setInterval(async () => {
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
		});
	}, 5000);

	const usersIds = reactive<numbers[]>(Array());

	const getUsersIds = computed(() => {return usersIds});

	return {
		usersIds, 
		getUsersIds, 
	};
});

