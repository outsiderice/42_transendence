<script setup lang="ts">
import PongInput from '../components/PongInput.vue'
import PongButton from '../components/PongButton.vue'
import PongToggleButton from '../components/PongToggleButton.vue'

import { useAuthForm } from '../composables/useAuthForm'
import { useToggles } from '../composables/useToggles'
import { useSessionStore } from '@/state/user_session.ts'
import { useRouter } from 'vue-router'

// -------------------------
// Store / Router
// -------------------------
const session = useSessionStore()
const router = useRouter()

// -------------------------
// Toggles
// -------------------------
const { newsletter } = useToggles()

// -------------------------
// Formulario
// -------------------------
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

// -------------------------
// Registro (Sign Up)
// -------------------------
const handleSubmit = async () => {
  console.log('Submitting signup:', {
    username: name.value,
    email: email.value
  })

  // if (!validate()) return

  try {
    const response = await fetch(
      `https://${window.location.host}/api/auth/register`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: name.value,
          email: email.value,
          password: password.value
        })
      }
    )

    if (response.ok) {
      const data = await response.json()

      console.log('Sign up successful ✅', data)

      // Inicializar sesión igual que en Sign In
      session.setSession(data.user.id, data.user.username)

      // Redirección
      router.push({ name: 'home' })
    } else {
      const errorText = await response.text()
      console.error('Register error ❌', errorText)
    }
  } catch (error) {
    console.error('Network error signing up:', error)
  }
}

// -------------------------
// Logout
// -------------------------
const signOut = () => {
  session.logout()
}
</script>

<template>
  <div class="max-w-md mx-auto mt-12 p-6 bg-[var(--color_background_3)] rounded-xl shadow-md">

    <!-- DEBUG TEMPORAL 
    <pre class="mb-4 text-xs">
isAuthenticated: {{ session.isAuthenticated }}
username: {{ session.username }}
    </pre>-->

    <!-- USUARIO AUTENTICADO -->
    <div v-if="session.isAuthenticated">
      <h2 class="text-2xl font-bold mb-6 text-center">
        Hola, {{ session.username }}
      </h2>

      <PongButton
        label="Log out"
        :fullWidth="true"
        @click="signOut"
      />
    </div>

    <!-- USUARIO NO AUTENTICADO -->
    <div v-else>
      <h2 class="text-3xl font-bold mb-8 text-center text-[var(--color_accent_1)]">
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

    </div>
  </div>
</template>

<style scoped>
body {
  background-color: var(--color_background_1);
}
</style>
