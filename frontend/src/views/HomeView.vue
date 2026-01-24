<script setup lang="ts">
import { jwtDecode } from 'jwt-decode'

const jwt = localStorage.getItem('accessToken');

console.log(jwt);

const decodedHeader = jwtDecode(jwt);
console.log(decodedHeader);

</script>

<template>
	<h3>home page </h3>
	<RouterLink to="/sign_in">Sign In</RouterLink>
	<RouterLink to="/game">Play Game</RouterLink>
	<RouterLink to="/sign_up">Sign Up</RouterLink>
</template>
