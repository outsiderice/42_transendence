<script setup lang="ts">
import {ref, computed} from 'vue';
import defaultProfilePicture from "@/assets/defaultProfilePicture.svg";
import DonutChart from "@/components/DonutChart.vue";

//	prop handeling. 
interface gameStatsCardInfo {
	player2: string,
	dateStr: string,
	pointsPlayer1: number,
	pointsPlayer2: number,
};

const props = defineProps<gameStatsCardInfo>();

function redirectToUserProfilePage(): void{
	if (props.userName === undefined)
		return;
	window.location.href = window.location.origin + "/users/" + userName._value;
}

</script>

<template>
<div 
	class="
		gameCard 
		flex 
		flex-row
		gap-[1rem]
		bg-(--color_background_2)
		block
		p-[0.62rem]
		px-[1rem]
		rounded-[1.25rem]
		border
		border-(--color_accent_3)
		items-center
		justify-between
	"
>
	<div class="gameCardText flex flex-col gap-[0.65rem]" >
		<p class="text-[1.5rem] block font-medium" >
			game
			<p class="text-(--color_accent_success)" v-if="pointsPlayer1 > pointsPlayer2"> won </p>
			<p class="text-(--color_accent_danger)" v-else > lost </p>
			against <a :href="'/users/' + props.player2" >{{props.player2}}</a>
		</p>
		<p class="font-light" >played on: {{dateStr}}</p>
	</div>
	<DonutChart class="min-w-[3.75rem] w-[3.75rem]"
		:greenValue="props.pointsPlayer1"
		:redValue="props.pointsPlayer2"
		:dropDownText="props.pointsPlayer1 + ' points to ' + props.pointsPlayer2"
	/>
</div>
</template>

<style scoped>

p {
	display: inline;
}

</style>
