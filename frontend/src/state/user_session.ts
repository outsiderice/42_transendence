import { defineStore } from 'pinia';
import { ref, computed  } from 'vue';

export const useSessionStore = defineStore( 'session', () => {

	fetch('https' + import.meta.env.VITE_URL + '/api/auth/refresh', {
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

	const getIsSignedIn = computed(() => {return isSignedIn.value});
	const getUserName = computed(() => {return isUserName.value});
	const getUserId = computed(() => {return isUserId.value});

	function setSession(user_id: number, user_name: string) {
		console.log("seted a new user session ");
		isSignedIn.value = true
		userId.value = user_id;
		userName.value = user_name;
	};


	function $reset() {
		isSignedIn.value = false;
		userName.value = "";
		userId.value = 0;
		// future code cleaning any resourese that may be allocated.
	}
	return { isSignedIn, userName, userId, getIsSignedIn, getUserName, getUserId, setSession, $reset };
});

