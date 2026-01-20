<script setup lang="ts">
import { computed } from 'vue'
import greenCheck from '../assets/Green.svg'
import greyCheck from '../assets/Grey.svg'

interface PongAchievementCardInfo {
  icon?: string
  title?: string
  description?: string
  completed?: boolean
}

const props = defineProps<PongAchievementCardInfo>()

const isLoading = computed(() => props.title === undefined)

const statusText = computed(() => {
  if (isLoading.value) return 'loading achievement...'
  return props.completed ? 'Completed' : 'Uncompleted'
})

const statusColor = computed(() => {
  if (isLoading.value) return 'var(--color_accent_3)'
  return props.completed
    ? 'var(--color_accent_success)'
    : 'var(--color_accent_danger)'
})

const iconToShow = computed(() => {
  if (isLoading.value) return greyCheck
  return props.completed ? greenCheck : greyCheck
})
</script>

<template>
  <div
    class="
      pongAchievementCard
      bg-(--color_background_2)
      hover:bg-(--color_background_3)
      transition
      duration-200
      block
      p-[0.75rem]
      rounded-[1.25rem]
      border
      border-(--color_accent_3)
    "
  >
    <div class="flex flex-row gap-[1rem] items-center">

      <!-- ICON -->
      <div
        class="
          w-[3.75rem]
          h-[3.75rem]
          flex-none
          rounded-full
          flex
          items-center
          justify-center
          overflow-hidden
        "
      >
        <!-- skeleton -->
        <div
          v-if="isLoading"
          class="w-full h-full bg-(--color_loading_content) animate-pulse"
        />

        <!-- icon -->
        <img
          v-else
          :src="iconToShow"
          class="w-full h-full object-contain"
          draggable="false"
        />
      </div>

      <!-- TEXT -->
      <div class="flex flex-col gap-[0.3rem] w-full overflow-hidden">

        <!-- title -->
        <p
          v-if="!isLoading"
          class="text-[1.3rem] font-medium text-nowrap"
        >
          {{ props.title }}
        </p>

        <!-- title skeleton -->
        <div
          v-else
          class="max-w-[10rem] h-[1.3rlh] bg-(--color_loading_content) animate-pulse rounded-full"
        />

        <!-- description / status -->
        <p
          class="text-sm transition"
          :style="{ color: statusColor }"
        >
          {{ props.description }}
        </p>

      </div>

    </div>
  </div>
</template>

<style scoped>
.pongAchievementCard {
  user-select: none;
}

.pongAchievementCard:hover {
  transform: translateY(-1px);
}

.pongAchievementCard[locked] {
  opacity: 0.5;
}
</style>
