<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

interface buttonComponentProps {
	label: string,
}

const props = defineProps<buttonComponentProps>();

</script>

<template>
	<button 
		type="button" 
		class="
			text-(--color_accent_3) 
			border 
			border-(--color_accent_3) 
			px-[0.5rem]
			py-[0.25rem]
			rounded-[0.5rem] 
			transition-all
			delay-100
		"
		disabled
	>
		<p class="text-nowrap">{{ props.label }}</p>
	</button>
</template>

<style scoped>

</style>
