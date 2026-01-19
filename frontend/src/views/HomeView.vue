<script setup lang="ts">
import { ref, onMounted } from 'vue';
import PongButton from '../components/PongButton.vue';

function contains_user(result_body: {username: string}[], name: string ) : boolean
{
	for (let i = 0; i < result_body.length; i++)
	{
		if (result_body[i].username == name)
		{
			return true;
		}
	}
	return false;
}

//	if the user is alredy created it dose nothing.
async function	create_user(name: string)
{
	//	check if the user exists.
	{
		const response = await fetch("http://127.0.0.1:3001/api/users");
		if (!response.ok)
		{
			throw new Error(`Response status: ${response.status}`);
		}

		const result = await response.json();
		console.log(result);
		if (contains_user(result, name))
		{
			return ;
		}
	}
	//	create the user.
	{
		// not able to figure out how to register a user.
		const response = await fetch("http://127.0.0.1:3001/api/auth/register", {
			method: 'POST',
		});
		console.log(response);
	}
}

async function log_in_with_pedro()
{
	create_user("pedro");
	
}

</script>

<template>
<section class="max-w-[60rem] p-[1rem] m-auto flex flex-col gap-[2rem]">
	<PongButton label="login with pedro"  @click="log_in_with_pedro"/>
<!--	<PongButton label="login with juan"  @click="log_in_with_juan"/> -->
</section>
</template>
