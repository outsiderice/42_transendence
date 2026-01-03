import { ref, computed } from 'vue'

export function useAuthForm() {
  const name = ref('')
  const email = ref('')
  const password = ref('')

  const touched = ref({ name: false, email: false, password: false })

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

  const validate = () => {
    touched.value.name = true
    touched.value.email = true
    touched.value.password = true
    return !nameError.value && !emailError.value && !passwordError.value
  }

  return {
    name,
    email,
    password,
    touched,
    nameError,
    emailError,
    passwordError,
    validate
  }
}
