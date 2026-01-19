<script setup lang="ts">
import {ref, computed} from 'vue';
import DonutChart from "@/components/DonutChart.vue";

//	prop handeling. 
interface gameStatsCardInfo {
	gamesWon: number,
	gamesLost: number,
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
			total games: {{props.gamesWon + props.gamesLost}}
		</p>
	</div>
	<DonutChart class="min-w-[3.75rem] w-[3.75rem]"
		:greenValue="props.gamesWon"
		:redValue="props.gamesLost"
		:dropDownText="'won: ' + props.gamesWon + ', lost: ' + props.gamesLost"
	/>
</div>
</template>

<style scoped>

p {
	display: inline;
}

</style>
