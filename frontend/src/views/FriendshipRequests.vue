<script setup lang="ts">
import UserRequestCard from "@/components/UserRequestCard.vue";
import { useSessionStore } from '@/state/user_session.ts'
import { ref, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useOnlineUsersStore } from '@/state/online_users.ts'

const session = useSessionStore();
const router = useRouter();


const onlineUsers = useOnlineUsersStore();

const users = reactive
<
	{
		id: number,
		name: string, 
		nick: string, 
		online: boolean, 
		profilePic?: string
	}[]
> ([]);

</script>

<template>
<section class="max-w-[40rem] p-[1rem] m-auto flex flex-col gap-[2rem]">
	<p>friendship requests.</p>
</section>
</template>
