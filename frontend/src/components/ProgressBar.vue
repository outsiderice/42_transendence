<script setup lang="ts">
import { computed,  onMounted } from "vue";

interface ProgressBarInfo {
	progress: number,
	total: number,
	label?: string,
};

const props = defineProps<ProgressBarInfo>();

const progressPercent = computed(() => {
	return ((props.progress / props.total) * 100) + "%";
});

</script>

<template>
<div class="progressBarContainer flex flex-col gap-[0.33rem] items-center">
	<p v-if="label !== undefined" class="inline">{{label}}</p>
	<div class="border border-(--color_accent_3) w-full rounded-full">
		<div 
			:style="'width: ' + progressPercent + ';'" 
			class="bg-(--color_accent_success) h-[1rem] rounded-full"/>
	</div>
</div>
</template>

<style scoped>

</style>
