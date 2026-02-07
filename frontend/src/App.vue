<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import HeaderComponent from './components/HeaderComponent.vue';
import FooterComponent from './components/FooterComponent.vue';
import {useRouter} from 'vue-router';
import {onMounted } from 'vue';
import {onUpdated } from 'vue';
import { useSessionStore } from '@/state/user_session.ts'

const session = useSessionStore();

import { useOnlineUsersStore } from '@/state/online_users.ts'

const onlineUsers = useOnlineUsersStore();
</script>

<template>
	<HeaderComponent />
	<RouterView />
	<FooterComponent />
</template>

<style scoped>

</style>
