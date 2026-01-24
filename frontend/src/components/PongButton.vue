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

const handleClick = (e: MouseEvent) => {
  console.log('PongButton clicked')
  emit('click', e)
}
</script>

<template>
  <button
    :type="type || 'button'"
    :disabled="disabled"
    :class="[
      'pong-button transition-colors duration-200 py-2 px-4 rounded-2xl font-semibold',
      fullWidth ? 'w-full' : '',
      isDisabled ? 'bg-[var(--color_disabled)] text-[var(--color_accent_1)] cursor-not-allowed': 'bg-[var(--color_background_1)] text-[var(--color_accent_1)] hover:bg-[var(--color_accent_1)] hover:text-[var(--color_background_1)]'
    ]"
    @click="handleClick"
  >
    {{ label }}
  </button>
</template>

<style scoped>
.pong-button {
  outline: none;
  border: 1px solid var(--color_accent_1);
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  user-select: none;
  font:Oswald;
}

.pong-button:active {
  transform: scale(0.98);
  transition: transform 0.1s;
}
</style>
