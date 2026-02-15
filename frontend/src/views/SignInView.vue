<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import PongInput from '../components/PongInput.vue'
import PongButton from '../components/PongButton.vue'
import PongToggleButton from '../components/PongToggleButton.vue'
import { useAuthForm } from '../composables/useAuthForm'
import { useToggles } from '../composables/useToggles'
import { useSessionStore } from '@/state/user_session.ts'
import { useRouter } from 'vue-router'
import LinkComponent from '../components/LinkComponent.vue'

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
    
	} catch (error){
		console.error('Error during Github OAuth:', error)
	}
}

function sign_out()
{
	session.$reset();
	router.push({name: 'signin'});
}

</script>

<template>
  <div class="max-w-md mx-auto mt-12 p-6 bg-[var(--color_background_3)] rounded-xl shadow-md">

    <!-- USUARIO AUTENTICADO -->
    <div v-if="session.userName">
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
      <h2 class="text-3xl font-bold mb-8 text-center text-[var(--color_accent_1)]">Sign In</h2>

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
        class = "mb-6"
        label="SEND"
        type="submit"
        :fullWidth="true"
        :disabled="!name || !password"
        @click="handleSubmit"
      />
<<<<<<< HEAD
      <div class="flex justify-center mt-6">
        <LinkComponent
          href="/sign_up"
          label="sign up"
          class="text-(--color_accent_1)"
        />
=======
      <div class="mt-2">
      <PongButton
        label="Sign in with Github"
        type="submit"
        :fullWidth="true"
        @click="handleGithubOauth"
      />
      </div>

      <div class="mt-4">
        <PongToggleButton v-model="newsletter" label="Remember me" />
      <div class="flex justify-center mb-6">
          <LinkComponent
            href="/sign_up"
            label="sign up"
            class="text-(--color_accent_1)"
          />
     	</div>
>>>>>>> d234f22980c93f05e27f7eee44da3bc6f3219513
      </div>
    </div>
  </div>
</template>

<style scoped>
body {
  background-color: var(--color_background_1);
}
</style>
