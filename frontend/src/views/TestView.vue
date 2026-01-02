<script setup lang="ts">
import UserCard from "@/components/UserCard.vue";
</script>
<!--
	https://cdn.intra.42.fr/users/3652d353f132f5475c6b099ea0bdf1f2/tatahere.png
-->
<template>
	<h3>test page.</h3>
	<UserCard />
	<UserCard 
		nickName="pedro"
		userName="pedro escudero"
		:online=false
		profilePicture="https://cdn.intra.42.fr/users/3652d353f132f5475c6b099ea0bdf1f2/tatahere.png" 
	/>
	<UserCard 
		nickName="taha"
		userName="taha tahere"
		:online=true
		profilePicture="https://cdn.intra.42.fr/users/3652d353f132f5475c6b099ea0bdf1f2/tatahere.png" 
	/>
</template>
