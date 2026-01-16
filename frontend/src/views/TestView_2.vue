<script setup lang="ts">
import UserCard from "@/components/UserCard.vue";
import DonutChart from "@/components/DonutChart.vue";
import GameStatisticsCard from "@/components/GameStatisticsCard.vue";
import GameHistoricStatisticsCard from "@/components/GameHistoricStatisticsCard.vue";
</script>
<!--
	https://cdn.intra.42.fr/users/3652d353f132f5475c6b099ea0bdf1f2/tatahere.png
-->
<template>
<section class="max-w-[60rem] p-[1rem] m-auto flex flex-col gap-[2rem]">
	<h3 class="text-center mb-[4rem] text-[2rem]" >test page.</h3>
	<h4>testing the user cards</h4>
	<UserCard />
	<UserCard 
		nickName="pedro"
		userName="pedro_escudero"
		:online=false
		profilePicture="https://cdn.intra.42.fr/users/3652d353f132f5475c6b099ea0bdf1f2/tatahere.png" 
	/>
	<UserCard 
		nickName="taha"
		userName="taha_tahere"
		:online=true
		profilePicture="https://cdn.intra.42.fr/users/3652d353f132f5475c6b099ea0bdf1f2/tatahere.png" 
	/>
	<UserCard 
		nickName="migel"
		userName="migel_smith"
		:online=true
	/>
	<h4>testing the donut chars</h4>
	<DonutChart class="w-[60px]" :greenValue="12" :redValue="24" dropDownText="this is my drop down text"/>
	<DonutChart class="w-[60px]" :greenValue="17" :redValue="24" dropDownText="17 points to 24"/>
	<DonutChart class="w-[60px]" :greenValue="8" :redValue="3" dropDownText="8 points to 3"/>
	<DonutChart class="w-[60px]" :greenValue="12" :redValue="7" dropDownText="12 points to 7"/>
	<GameStatisticsCard player2="taha" dateStr="31/10/2003" :pointsPlayer1="12" :pointsPlayer2="4" />
	<GameStatisticsCard player2="pedro" dateStr="31/10/2003" :pointsPlayer1="11" :pointsPlayer2="12" />
	<GameStatisticsCard player2="mark" dateStr="31/10/2003" :pointsPlayer1="11" :pointsPlayer2="12" />
	<GameHistoricStatisticsCard 
		:gamesWon="13" 
		:gamesLost="3" 
	/>
	<GameHistoricStatisticsCard 
		:gamesWon="7" 
		:gamesLost="10" 
	/>
	<div />
</section>
</template>

<style scoped>
</style>
