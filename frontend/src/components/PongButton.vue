<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

interface Props {
  label: string            // Texto del botón
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean       // Para deshabilitar el botón
  fullWidth?: boolean      // Para que ocupe todo el ancho
}

const { label, type, disabled, fullWidth } = defineProps<Props>()
const emit = defineEmits(['click'])

const handleClick = (e: Event) => {
  if (!disabled) {
    emit('click', e)
  }
}
</script>

<template>
  <button
    :type="type || 'button'"
    :disabled="disabled"
    :class="[
      'pong-button transition-colors duration-200 py-2 px-4 rounded-2xl font-semibold',
      fullWidth ? 'w-full' : '',
      disabled ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
    ]"
    @click="handleClick"
  >
    {{ label }}
  </button>
</template>

<style scoped>
.pong-button {
  outline: none;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  user-select: none;
}

.pong-button:active {
  transform: scale(0.98);
  transition: transform 0.1s;
}
</style>
