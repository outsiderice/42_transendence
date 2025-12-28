<script setup lang="ts">
	import PongInput from '../components/PongInput.vue'
	import { ref } from 'vue'
	
	// Variables para los inputs
	const name = ref('')
	const email = ref('')
	const password = ref('')
	
	// Variables de error simples
	const nameError = ref('')
	const emailError = ref('')
	const passwordError = ref('')
	
	// Función para validar al enviar
	function handleSubmit() {
	  // Limpiar errores
	  nameError.value = ''
	  emailError.value = ''
	  passwordError.value = ''
	
	  let valid = true
	
	  if (!name.value) {
		nameError.value = 'Name is mandatory'
		valid = false
	  }
	  if (!email.value || !/^\S+@\S+\.\S+$/.test(email.value)) {
		emailError.value = 'Email valid necessary'
		valid = false
	  }
	  if (!password.value || password.value.length < 6) {
		passwordError.value = 'Password at least 6 characters'
		valid = false
	  }
	
	  if (valid) {
		alert(`Sent!\nName: ${name.value}\nEmail: ${email.value}`)
	  }
	}
	</script>
	
	<template>

		<h2 class="text-3xl font-bold mb-8">Formulario de Prueba</h2>
	
		  <PongInput
			label="Name"
			v-model="name"
			:error="nameError"
		  />
	
		  <PongInput
			label="Email"
			type="email"
			v-model="email"
			:error="emailError"
		  />
	
		  <PongInput
			label="Password"
			type="password"
			v-model="password"
			:error="passwordError"
		  />
	
		  <button
			@click="handleSubmit"
			class="mt-4 w-1/2 mx-auto block bg-blue-600 text-white py-2 rounded-2xl hover:bg-blue-700 transition-colors"
		  >
			Enviar
		  </button>
		
	
		<div class="mt-6 w-full max-w-md text-gray-700">
		  <p><strong>Name:</strong> {{ name }}</p>
		  <p><strong>Email:</strong> {{ email }}</p>
		</div>

	</template>
	
