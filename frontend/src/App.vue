<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import HeaderComponent from './components/HeaderComponent.vue';
import FooterComponent from './components/FooterComponent.vue';
import {useRouter} from 'vue-router';

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
	if (path === "/")
	{
		return true;
	}
	return false;
}

	 



</script>

<template>
	<HeaderComponent />
	<RouterView />
	<FooterComponent />
</template>

<style scoped>

</style>
