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
        modelValue ? 'bg-blue-600' : 'bg-gray-300',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      ]"
      @click="toggle"
      :disabled="disabled"
    >
      <span
        class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200"
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
