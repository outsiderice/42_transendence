<script setup lang="ts">
import { ref, watchEffect, onMounted } from 'vue'
import PongInput from '../components/PongInput.vue'
import PongButton from '../components/PongButton.vue'
import PongToggleButton from '../components/PongToggleButton.vue'
import { useAuthForm } from '../composables/useAuthForm'
import { useToggles } from '../composables/useToggles'

const { newsletter } = useToggles()

const {
  name,
  email,
  password,
  confirmPassword,
  touched,
  nameError,
  emailError,
  passwordError,
  confirmPasswordError,
  validate
} = useAuthForm()

// Estado reactivo
const isAuthenticated = ref(false)
const username = ref('')

// --- DEBUG inicial ---
console.log('Inicial username:', username.value)
console.log('Inicial isAuthenticated:', isAuthenticated.value)

// watchEffect para mantener username e isAuthenticated reactivos
watchEffect(() => {
  const token = localStorage.getItem('token')
  const storedUsername = localStorage.getItem('username') || ''
  isAuthenticated.value = !!token
  username.value = storedUsername

  console.log('watchEffect token:', token)
  console.log('watchEffect storedUsername:', storedUsername)
  console.log('watchEffect isAuthenticated:', isAuthenticated.value)
  console.log('watchEffect username:', username.value)
})

// Función para registrarse
const handleSubmit = async () => {
  console.log('Submitting signup:', {
    username: name.value,
    email: email.value,
    password: password.value
  })

  // if (!validate()) return

  try {
    const response = await fetch(
      'https://' + window.location.host + '/api/auth/register',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: name.value,
          email: email.value,
          password: password.value
        })
      }
    )

    if (response.ok) {
      const data = await response.json()
      console.log('Registered successfully ✅', data)

      // Guardar token y username en localStorage
      const token = data.accessToken ?? 'dummy-token'
      localStorage.setItem('token', token)
      localStorage.setItem('username', name.value)

      // Actualizar reactive state
      isAuthenticated.value = true
      username.value = name.value

      console.log('Post register - username.value:', username.value)
      console.log('Post register - isAuthenticated.value:', isAuthenticated.value)
    } else {
      const errorText = await response.text()
      console.error('Register error ❌', errorText)
    }
  } catch (error) {
    console.error('Network error:', error)
  }
}

// Función para cerrar sesión
const signOut = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('username')

  isAuthenticated.value = false
  username.value = ''

  console.log('After logout - username.value:', username.value)
  console.log('After logout - isAuthenticated.value:', isAuthenticated.value)
}

// Opcional: al montar, podrías hacer un fetch al backend para validar token
// onMounted(() => {
//   fetchUser()
// })
</script>

<template>
  <div class="max-w-md mx-auto mt-12 p-6 bg-white rounded-xl shadow-md">
    <!-- DEBUG TEMPORAL -->
    <pre>
isAuthenticated: {{ isAuthenticated }}
username: {{ username }}
    </pre>

    <!-- USUARIO AUTENTICADO -->
    <div v-if="isAuthenticated">
      <h2 class="text-2xl font-bold mb-6 text-center">
        Hola, {{ username }}
      </h2>

      <PongButton
        label="Log out"
        :fullWidth="true"
        @click="signOut"
      />
    </div>

    <!-- USUARIO NO AUTENTICADO -->
    <div v-else>
      <h2 class="text-3xl font-bold mb-8 text-center">
        Sign Up
      </h2>

      <PongInput
        label="Name"
        v-model="name"
        :error="nameError"
        @blur="touched.name = true"
      />

      <PongInput
        label="Email"
        type="email"
        v-model="email"
        :error="emailError"
        @blur="touched.email = true"
      />

      <PongInput
        label="Password"
        type="password"
        v-model="password"
        :error="passwordError"
        @blur="touched.password = true"
      />

      <PongInput
        label="Confirm Password"
        type="password"
        v-model="confirmPassword"
        :error="confirmPasswordError"
        @blur="touched.confirmPassword = true"
      />

      <PongButton
        label="SEND"
        type="submit"
        :fullWidth="true"
        :disabled="!name || !email || !password || !confirmPassword"
        @click="handleSubmit"
      />

      <div class="mt-4">
        <PongToggleButton
          v-model="newsletter"
          label="Suscribirme al newsletter"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
body {
  background-color: var(--color_background_1);
}
</style>
