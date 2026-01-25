<script setup lang="ts">
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

const handleSubmit = async () => {
  console.log('Submitting signup:', {
    username: name.value,
    email: email.value,
    password: password.value
  })

  // if (!validate()) return

  try {
    const response = await fetch(
      'http://localhost:3000/auth/register',
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
      console.log('Registered successfully ✅')
      const data = await response.json()
      console.log(data)
    } else {
      const errorText = await response.text()
      console.error('Register error ❌', errorText)
    }
  } catch (error) {
    console.error('Network error:', error)
  }
}
</script>

<template>
  <div class="max-w-md mx-auto mt-12 p-6 bg-white rounded-xl shadow-md">
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
</template>

<style scoped>
body {
  background-color: var(--color_background_1);
}
</style>
