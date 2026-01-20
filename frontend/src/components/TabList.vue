<script setup lang="ts">
import {ref, computed} from 'vue';

interface tabListInfo {
	tabs:{name: string, logo?: string}[];
};

const props = defineProps<tabListInfo>();

console.log(props);

</script>

<template>

<p v-for="item in props.tabs"> {{item.name}} </p>

</template>

<style scoped >
</style>
