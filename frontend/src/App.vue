<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import HeaderComponent from './components/HeaderComponent.vue';
import FooterComponent from './components/FooterComponent.vue';
import {useRouter} from 'vue-router';
import { useRoute } from 'vue-router';
import {onMounted } from 'vue';
import {onUpdated } from 'vue';
import { useSessionStore } from '@/state/user_session.ts'

const session = useSessionStore();
const route = useRoute();

import { useOnlineUsersStore } from '@/state/online_users.ts'

const onlineUsers = useOnlineUsersStore();

</script>

<template>
	<div class="flex flex-col min-h-screen">
		<HeaderComponent v-if="!route.meta?.hideHeader"/>
		<main class="flex-grow">
			<RouterView />
		</main>
		<FooterComponent v-if="!route.meta?.hideFooter"/>
	</div>
</template>

<style scoped>

</style>
