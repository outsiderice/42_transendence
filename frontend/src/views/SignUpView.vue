<script setup lang="ts">
import PongInput from '../components/PongInput.vue'
import PongButton from '../components/PongButton.vue'
import { useAuthForm } from '../composables/useAuthForm'
import { useToggles } from '../composables/useToggles'
import { useSessionStore } from '@/state/user_session.ts'
import { useRouter } from 'vue-router'
import LinkComponent from '../components/LinkComponent.vue'

// -------------------------
// Store / Router
// -------------------------
const session = useSessionStore()
const router = useRouter()

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
      session.setSession(data.safeUser.id, data.safeUser.username)

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
// Registro mediante Github
// -------------------------
const handleGithubOauth = async () => {
	try {
		window.location.href = 
		`https://${window.location.host}/api/login/github`;
    
	} catch (error){
		console.error('Error during Github OAuth:', error)
	}
}
// -------------------------
// Logout
// -------------------------
function sign_out()
{
	session.$reset();
	router.push({name: 'signin'});
}
</script>

<template>
  <div class="max-w-md mx-auto mt-12 p-6 bg-[var(--color_background_3)] rounded-xl shadow-md">

    <!-- DEBUG TEMPORAL 
    <pre class="mb-4 text-xs">
      isAuthenticated: {{ session.isAuthenticated }}
      username: {{ session.userName }}
    </pre>-->

    <!-- USUARIO AUTENTICADO -->
    <div  v-if="session.userName">
      <h2 class="text-2xl font-bold mb-6 text-center">
        Hola, {{ session.userName }}
      </h2>

      <PongButton
        label="Log out"
        :fullWidth="true"
        @click="sign_out()"
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

      <PongButton class="mb-6"
        label="SEND"
        type="submit"
        :fullWidth="true"
        :disabled="!name || !email || !password || !confirmPassword"
        @click="handleSubmit"
      />
      <div class="mt-2">
      <PongButton
        label="Sign up with Github"
        type="submit"
        :fullWidth="true"
        @click="handleGithubOauth"
      />
      </div>
      <div class="flex justify-center mb-6">
          <LinkComponent
            href="/sign_in"
            label="sign in"
            class="text-(--color_accent_1)"
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