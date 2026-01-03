// src/composables/useToggles.ts
import { ref, computed } from 'vue'

export function useToggles() {
  // Definimos los toggles que queremos
  const newsletter = ref(false)
  const notifications = ref(false)
  const darkMode = ref(false)

  // Validaciones opcionales
  const newsletterError = computed(() => {
    // ejemplo: obligar a marcar newsletter
    return newsletter.value ? '' : ''
  })

  const notificationsError = computed(() => '')
  const darkModeError = computed(() => '')

  // Función para resetear todos los toggles
  const resetToggles = () => {
    newsletter.value = false
    notifications.value = false
    darkMode.value = false
  }

  return {
    newsletter,
    notifications,
    darkMode,
    newsletterError,
    notificationsError,
    darkModeError,
    resetToggles,
  }
}
