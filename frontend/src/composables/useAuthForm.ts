import { ref, computed, watch } from 'vue'

export function useAuthForm() {
  const name = ref('')
  const email = ref('')
  const password = ref('')
  const confirmPassword = ref('')
  const nickname = ref(' ') 
  const touched = ref({
    name: false,
    email: false,
    password: false,
    confirmPassword: false
  })

  const nameError = computed(() => {
    if (!touched.value.name) return ''
    if (!name.value) return 'El nombre es obligatorio'
    return ''
  })

  const emailError = computed(() => {
    if (!touched.value.email) return ''
    if (!email.value) return 'El correo es obligatorio'
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!regex.test(email.value)) return 'Correo electrónico inválido'
    return ''
  })

  const passwordError = computed(() => {
    if (!touched.value.password) return ''
    if (!password.value) return 'La contraseña es obligatoria'
    if (password.value.length < 8) return 'Mínimo 8 caracteres'
    return ''
  })

  const confirmPasswordError = computed(() => {
    if (!touched.value.confirmPassword) return ''
    if (!confirmPassword.value) return 'Confirma la contraseña'
    if (confirmPassword.value !== password.value)
      return 'Las contraseñas no coinciden'
    return ''
  })

  const validate = () => {
    touched.value.name = true
    touched.value.email = true
    touched.value.password = true
    touched.value.confirmPassword = true

    return (
      !nameError.value &&
      !emailError.value &&
      !passwordError.value &&
      !confirmPasswordError.value
    )
  }

  // Opcional: revalidar confirmPassword si cambia password
  watch(password, () => {
    if (touched.value.confirmPassword) {
      touched.value.confirmPassword = true
    }
  })

  return {
    name,
    email,
    password,
    confirmPassword,
    touched,
    nameError,
    emailError,
    passwordError,
    confirmPasswordError,
    nickname,
    validate
  }
}
