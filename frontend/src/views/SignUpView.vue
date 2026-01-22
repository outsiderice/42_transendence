<script setup lang="ts">
import PongInput from '../components/PongInput.vue'
import PongButton from '../components/PongButton.vue'
import PongToggleButton from '../components/PongToggleButton.vue'
import { useAuthForm } from '../composables/useAuthForm'
import { useToggles } from '../composables/useToggles'

const { newsletter } = useToggles()

const {
  name,
  password,
  confirmPassword,
  touched,
  nameError,
  passwordError,
  confirmPasswordError,
  validate
} = useAuthForm()

const handleSubmit = async () => {
  if (!validate()) return

  try {
    const response = await fetch(
      import.meta.env.VITE_GATEWAY_URL + '/auth/login',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: name.value,
          password: password.value
        }),
        credentials: 'include'
      }
    )

    if (response.ok) {
      const data = await response.json()
      localStorage.setItem('token', data.token)
      console.log('Login correcto ✅')
    }
  } catch (error) {
    console.error('Error:', error)
  }
}
</script>

<template>
  <div class="max-w-md mx-auto mt-12 p-6 bg-white rounded-xl shadow-md">
    <h2 class="text-3xl font-bold mb-8 text-center">
      Formulario de Prueba
    </h2>

    <PongInput
      label="Name"
      v-model="name"
      :error="nameError"
      @blur="touched.name = true"
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
      :disabled="!name || !password || !confirmPassword"
      @click="handleSubmit"
    />

    <div class="mt-4">
      <PongToggleButton
        v-model="newsletter"
        label="Suscribirme al newsletter"
      />
    </div>

    <div class="mt-6 text-gray-700">
      <p><strong>Name:</strong> {{ name }}</p>
    </div>
  </div>
</template>

<style scoped>
body {
  background-color: #f3f4f6;
}
</style>
