import { defineStore } from 'pinia';
import { ref, computed  } from 'vue';

export const useSessionStore = defineStore( 'session', () => {

	fetch('https://' + window.location.host + '/api/auth/refresh', {
		method:'POST',
	}).then(async (response) => {
		if (response.ok) {
			const result = await response.json();
			setSession(result.safeUser.id, result.safeUser.username);
		}
	});

	const isSignedIn = ref(false);
	const userName = ref('');
	const userId = ref(0);
	const refreshAccessTokenIntervalId = ref(0);
	const updateOnlineIntervalId = ref(0);

	const getIsSignedIn = computed(() => {return isSignedIn.value});
	const getUserName = computed(() => {return userName.value});
	const getUserId = computed(() => {return userId.value});

	function setSession(user_id: number, user_name: string) {
		console.log("refresh access token.");
		isSignedIn.value = true
		userId.value = user_id;
		userName.value = user_name;
		refreshAccessTokenIntervalId.value = setInterval(() => {
			console.log("refreshing the access token.");
			fetch('https://' + window.location.host + '/api/auth/refresh', {
				method: 'POST',
			});
		}, 600000);
		updateOnlineIntervalId.value = setInterval(() => {
			console.log("updating the user online status.");
			fetch('https://' + window.location.host + '/api/presence/heartbeat/' + getUserId.value, {
				method: 'POST',
			});
		}, 20000);
	};

	function $reset() {
		isSignedIn.value = false;
		userName.value = "";
		userId.value = 0;

		if (refreshAccessTokenIntervalId.value != 0) {
			clearInterval(refreshAccessTokenIntervalId.value);
		}
		if (updateOnlineIntervalId.value != 0) {
			clearInterval(updateOnlineIntervalId.value);
		}
		// future code cleaning any resourese that may be allocated.
	}
	return {
		isSignedIn, 
		userName, 
		userId, 
		
		getIsSignedIn, 
		getUserName, 
		getUserId, 
		setSession, 
		$reset 
	};
});

