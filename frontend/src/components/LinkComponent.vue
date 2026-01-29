<script setup lang="ts">
interface linkComponentProps {
	href: string,
	label: string
}

const props = defineProps<linkComponentProps>();

</script>

<template>
<a 
	@click="$router.push({path: props.href})" 
>
	{{props.label}}
</a>
</template>

<style>
</style>
