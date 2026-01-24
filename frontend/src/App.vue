<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import HeaderComponent from './components/HeaderComponent.vue';
import FooterComponent from './components/FooterComponent.vue';
import {useRouter} from 'vue-router';
import {onMounted } from 'vue';
import {onUpdated } from 'vue';

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
	console.log("trying to access local storage");
	const jwt = localStorage.getItem('token');
	console.log(jwt);
	if (typeof jwt === "object" && !is_on_login_screan())
	{
		// redirect to login.
		const router = useRouter();
		router.push({ path: 'sign_in' })
	}
}

onMounted(() => {
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
