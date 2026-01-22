<script setup lang="ts">
import { jwtDecode } from 'jwt-decode'

const jwt = localStorage.getItem('accessToken');

console.log(jwt);

const decodedHeader = jwtDecode(jwt);
console.log(decodedHeader);

</script>

<template>
	<h3>home page </h3>
</template>
