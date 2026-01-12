<script setup lang="ts">
import { onMounted } from "vue";

interface donutChartInfo {
	greenValue: number,
	redValue: number,
	dropDownText?: string,
};

const props = defineProps<donutChartInfo>();
//
//const greenProgressRad = computed(() => {
//	return (props.greenValue * 100 / props.redValue) * (2 * Math.PI) / 100;
//})
//
//const midPointX = computed(() => {
////	return props.
//	return 12
//})
//
</script>

<template>
	<svg viewBox="0 0 100 100" class="donutChart transition-all duration-200">
		<defs>
			<mask id="circle_mask">
				<rect width="100" height="100" fill="black"/>
				<circle r="50" cx="50" cy="50" fill="white"/>
			</mask>
		</defs>
		<path 
			class="donutChartPath transition-all duration-200"
			fill="none"
			stroke="var(--color_accent_success)"
			stroke-width="20"

			d="	M 50,0
				A 50 50 0 1 0 100,50
			"
			mask="url(#circle_mask)"
		/>
	</svg>
</template>

<style scoped>

.donutChart:hover .donutChartPath {
	stroke-width: 30;
}

</style>
