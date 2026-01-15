<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

interface Props {
  modelValue: boolean      // estado actual del toggle
  label?: string           // texto opcional al lado
  disabled?: boolean
}

const { modelValue, label, disabled } = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const toggle = () => {
  if (!disabled) {
    emit('update:modelValue', !modelValue)
  }
}
</script>

<template>
  <div class="flex items-center space-x-3">
    <!-- Toggle -->
   <button
  :class="[
    'relative w-12 h-6 rounded-full transition-colors duration-200',
    'bg-[var(--color_background_1)] border border-[var(--color_accent_1)]',
    disabled ? 'bg-[var(--color_disabled)] opacity-50 cursor-not-allowed' : 'cursor-pointer'
  ]"
  @click="toggle"
  :disabled="disabled"
>
  <span
    class="absolute left-0.5 w-5 h-5 bg-[var(--color_accent_1)] rounded-full shadow transform transition-transform duration-200 top-1/2 -translate-y-1/2"
    :class="modelValue ? 'translate-x-6' : ''"
  ></span>
</button>



    <!-- Label opcional -->
    <span v-if="label" class="select-none text-gray-700">{{ label }}</span>
  </div>
</template>

<style scoped>
/* nada extra por ahora, todo con tailwind y clases dinámicas */
</style>
