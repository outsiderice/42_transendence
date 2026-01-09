<script setup lang="ts">
import PongInput from '../components/PongInput.vue'
import PongButton from '../components/PongButton.vue'
import PongToggleButton from '../components/PongToggleButton.vue'
import { useAuthForm } from '../composables/useAuthForm'
import { useToggles } from '../composables/useToggles'

const { newsletter } = useToggles()

// Usamos el composable extendido que maneja name, email y password
const { 
  name, 
  email, 
  password, 
  touched, 
  nameError, 
  emailError, 
  passwordError, 
  validate 
} = useAuthForm()

// Función para gestionar envío
const handleSubmit = () => {
  if (validate()) {
    alert(`¡Formulario enviado!\nName: ${name.value}\nEmail: ${email.value}`)
  }
}
</script>
<!--
	https://cdn.intra.42.fr/users/3652d353f132f5475c6b099ea0bdf1f2/tatahere.png
-->
<template>
  <div class="max-w-md mx-auto mt-12 p-6 bg-white rounded-xl shadow-md">
    <h2 class="text-3xl font-bold mb-8 text-center">Formulario de Prueba</h2>

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

    <PongButton
		label="Enviar"
  		type="submit"
  		:fullWidth="true"
  		:disabled="!name || !email || !password"
  		@click="handleSubmit"
	/>
	<div class="mt-4">
      <PongToggleButton v-model="newsletter" label="Suscribirme al newsletter" />
    </div>
	
    <div class="mt-6 text-gray-700">
      <p><strong>Name:</strong> {{ name }}</p>
      <p><strong>Email:</strong> {{ email }}</p>
    </div>
  </div>
</template>

<style scoped>
/* Opcional: centramos el formulario y ponemos un fondo */
body {
  background-color: #f3f4f6;
}
</style>
