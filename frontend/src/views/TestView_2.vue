<script setup lang="ts">
import UserCard from "@/components/UserCard.vue";
import DonutChart from "@/components/DonutChart.vue";
</script>
<!--
	https://cdn.intra.42.fr/users/3652d353f132f5475c6b099ea0bdf1f2/tatahere.png
-->
<template>
<section class="max-w-[80rem] p-[1rem] m-auto flex flex-col gap-[2rem]">
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
	<div />
</section>
</template>

<style scoped>
</style>
