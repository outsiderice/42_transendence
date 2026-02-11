<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

interface buttonComponentProps {
	label: string,
	isDanger?: boolean //when given true makes the button red for striking msg
}


const props = withDefaults(defineProps<buttonComponentProps>(), {
	isDanger: false
});

</script>

<template>
	<button 
		type="button" 
		:class="[
            'border px-[0.5rem] py-[0.25rem] rounded-[0.5rem] hover:text-(--color_background_3) transition-all delay-100',
            props.isDanger 
                ? 'text-(--color_accent_danger) border-(--color_accent_danger) hover:bg-(--color_accent_danger)' 
                : 'text-(--color_accent_1) border-(--color_accent_1) hover:bg-(--color_accent_1)'
        ]"
    >
		<p class="text-nowrap">{{ props.label }}</p>
	</button>
</template>

<style scoped>

</style>
