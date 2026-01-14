<script setup lang="ts">
import { computed,  onMounted } from "vue";

interface donutChartInfo {
	greenValue: number,
	redValue: number,
	dropDownText?: string,
};

const props = defineProps<donutChartInfo>();

const greenProgressRad = (props.greenValue * 100 / (props.greenValue + props.redValue)) * (2 * Math.PI) / 100;

let green_long_part = greenProgressRad > Math.PI ? '1': '0';
let red_long_part = greenProgressRad <= Math.PI ? '1': '0';
let x = 50 - (Math.sin(greenProgressRad) * 50);
let y = 50 - (Math.cos(greenProgressRad) * 50);

let greenPath = `M 50,0 A 50 50 0 ${green_long_part} 0 ${x},${y}`;
let redPath = `M ${x},${y} A 50 50 0 ${red_long_part} 0 50,0`;


</script>

<template>
<div class="donutChartContainer relative">
	<svg viewBox="0 0 100 100" class="donutChart transition-all duration-200 w-full">
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

			:d="greenPath"
			
			mask="url(#circle_mask)"
		/>
		<path
			class="donutChartPath transition-all duration-200"
			fill="none"
			stroke="var(--color_accent_danger)"
			stroke-width="20"

			:d="redPath"
			
			mask="url(#circle_mask)"
		/>
	</svg>
	<p 
		v-if="props.dropDownText !== undefined" 
		class="
			toolTipText 
			text-nowrap 
			invisible 
			absolute
			left-[50%]
			-translate-x-1/2
			top-0
			-translate-y-3/2
			bg-(--color_background_1)
			px-[0.5rem]
			rounded-[0.5rem]
			z-2
			drop-shadow-md
			drop-shadow-zinc-100/10
		"
	>
		{{props.dropDownText}}
	</p>
</div>
</template>

<style scoped>

.donutChart:hover .donutChartPath {
	stroke-width: 30;
}

.donutChartContainer:hover .toolTipText {
	visibility: visible;
}

.donutChartContainer:hover .toolTipText::after {
	content: "";
	width: 0.7rem;
	height: 0.7rem;
	position: absolute;
	display: block;
	bottom: 0;
	left: 50%;
	transform-origin: 50% 50%;
	transform: translateY(50%) translateX(-50%) rotate(45deg);
	background-color: var(--color_background_1);
	z-index: -1;
}

</style>
