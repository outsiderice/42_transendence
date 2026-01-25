<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import HeaderComponent from './components/HeaderComponent.vue';
import FooterComponent from './components/FooterComponent.vue';
import {useRouter} from 'vue-router';
import {onMounted } from 'vue';
import {onUpdated } from 'vue';

//call to refresh token in case auth has expired
const refreshAuth = async () => {
	console.log("refresh called");
	try {
		const response = await fetch("https://localhost:8443/api/auth/refresh", {
			method:	'POST',
			credentials: 'include',
		})
		if (response.ok ){ 
			console.log("refreshed successfully")
		}
	} catch (err) {
		console.error("Error refreshing auth: ", err);
	}
}

//
//	redirecting the user to the log in screen if it is not loged in.
//

function remove_traling_slash(path: string): string
{
	if (path[path.len - 1] === '/')
	{
		return path.slice(0, path.len - 1);
	}
	return path;
}

//	returns true if the path is both the signin one or the signup
function is_on_login_screan(): boolean
{
	const path = remove_traling_slash(window.location.pathname);
	if (path === "/sign_in" || path === '/sign_up')
	{
		return true;
	}
	return false;
}

function redirect_if_not_loged_in()
{
//	console.log("trying to access local storage");
//	const jwt = localStorage.getItem('token');
//	console.log(jwt);
//	if (typeof jwt === "object" && !is_on_login_screan())
	{
		// redirect to login.
		const router = useRouter();
//		router.push({ path: 'sign_in' })
	}
}

onMounted(() => {
	refreshAuth();
	redirect_if_not_loged_in();
})

</script>

<template>
	<HeaderComponent />
	<RouterView />
	<FooterComponent />
</template>

<style scoped>

</style>
