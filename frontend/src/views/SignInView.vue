<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import PongInput from '../components/PongInput.vue'
import PongButton from '../components/PongButton.vue'
import PongToggleButton from '../components/PongToggleButton.vue'
import { useAuthForm } from '../composables/useAuthForm'
import { useToggles } from '../composables/useToggles'
import { useSessionStore } from '@/state/user_session.ts'
import { useRouter } from 'vue-router';

const { newsletter } = useToggles()

const { 
  name, 
  password, 
  touched, 
  nameError, 
  passwordError, 
  validate 
} = useAuthForm()

const session = useSessionStore();

// Inicializa desde localStorage
//watchEffect(() => {
//  const token = localStorage.getItem('token')
//  const storedUsername = localStorage.getItem('username') || ''
//  isAuthenticated.value = !!token
//  username.value = storedUsername

  //console.log('watchEffect token:', token)
//  console.log('watchEffect storedUsername:', storedUsername)
//  console.log('watchEffect isAuthenticated:', isAuthenticated.value)
//  console.log('watchEffect username:', username.value)
//})

const router = useRouter();
// Función para iniciar sesión
const handleSubmit = async () => {
  console.log('Submitting login:', { username: name.value, password: password.value })
  console.log(window.location);
  try {
    const response = await fetch('https://' + window.location.host + '/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: name.value,
        password: password.value
      })
    })

    if (response.ok) {
      const data = await response.json()
      // inicializar la sesion del usuario.
		console.log("done the sign in succesfully");
		session.setSession(data.user.id, data.user.username);
		console.log("trying to redirect: ");
		router.push({name: 'home'});
    } else {
      const errorText = await response.text()
      console.error('Login error ❌', errorText)
    }
  } catch (error) {
    console.error('Network error signing in:', error)
	}
}
//github signin
const handleGithubOauth = async () => {
	try {
		window.location.href = 
		`https://${window.location.host}/api/login/github`;
    
    router.push({ name: 'home' })
	} catch (error){
		console.error('Error during Github OAuth:', error)
	}
}

// Función para cerrar sesión
const signOut = async () => {
	localStorage.removeItem('username')
	isAuthenticated.values = false
	username.value = ''
	try{
		const response = await fetch("https://" + window.location.host + "/api/auth/logout", {
			method: 'POST',
			credentials: 'include',
		})
		if (response.ok){
			console.log("User logged out");
		}
	} catch (err){
		console.error("Error logging out: ", err);
	}
	console.log('After logout - username.value:', username.value)
	console.log('After logout - isAuthenticated.value:', isAuthenticated.value)
}
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
      <h2 class="text-3xl font-bold mb-8 text-center">Sign In</h2>

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

      <PongButton
        label="SEND"
        type="submit"
        :fullWidth="true"
        :disabled="!name || !password"
        @click="handleSubmit"
      />
      <div class="mt-2">
      <PongButton
        label="Sign in with Github"
        type="submit"
        :fullWidth="true"
        @click="handleGithubOauth"
      />
      </div>

      <div class="mt-4">
        <PongToggleButton v-model="newsletter" label="Suscribirme al newsletter" />
      </div>
    </div>
  </div>
</template>

<style scoped>
body {
  background-color: var(--color_background_1);
}
</style>
