<script setup lang="ts">
import PongInput from '../components/PongInput.vue'
import PongButton from '../components/PongButton.vue'
import { useAuthForm } from '../composables/useAuthForm'
import { useToggles } from '../composables/useToggles'
import defaultProfilePicture from "../assets/defaultProfilePicture.svg"

const { newsletter } = useToggles()
const profilePicture = undefined; // o URL real

const onlineIndicatorColor = "var(--color_accent_success)";
// Usamos el composable extendido que maneja name, email y password
const { 
  name, 
  email, 
  password, 
  touched, 
  nameError, 
  emailError, 
  passwordError,
  nicknameError, 
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
    <div class="flex justify-center mb-6">
      <svg
        viewBox="0 0 60 60"
        class="
          profilePictureContainer
          w-[7rem]
          h-[7rem]
          flex-none
          hover:scale-110
          transition
          duration-200
        "
      >
        <defs>
          <mask id="statusIndicatorHole">
            <rect width="60" height="60" fill="white" />
            <circle r="12" cx="50" cy="50" fill="black" />
          </mask>

          <mask id="profileMask">
            <rect width="60" height="60" fill="black" />
            <circle
              r="30"
              cx="30"
              cy="30"
              fill="white"
              mask="url(#statusIndicatorHole)"
            />
          </mask>

          <mask id="defaultProfileMask">
            <rect width="60" height="60" fill="black" />
            <image width="60" height="60" :href="defaultProfilePicture" />
          </mask>
        </defs>

        <!-- loading -->
        <rect
          v-if="name === undefined"
          width="60"
          height="60"
          fill="var(--color_loading_content)"
          mask="url(#profileMask)"
          class="animate-pulse"
        />

        <!-- default avatar -->
        <g v-else-if="profilePicture === undefined" mask="url(#profileMask)">
          <rect
            width="60"
            height="60"
            fill="var(--color_accent_1)"
            mask="url(#defaultProfileMask)"
          />
        </g>

        <!-- user avatar -->
        <image
          v-else
          width="60"
          height="60"
          :href="profilePicture"
          mask="url(#profileMask)"
        />

        <!-- status -->
        <circle
          r="8"
          cx="50"
          cy="50"
          :fill="onlineIndicatorColor"
        />
      </svg>
    </div>
    <div class="mt-6 text-[var(--color_accent_2)]">
        <p><strong class="text-[var(--color_accent_1)]">Name:</strong> {{ name }}</p>
        <p><strong class="text-[var(--color_accent_1)]">Nickname:</strong> {{ nickname }}</p>
        <p><strong class="text-[var(--color_accent_1)]">Email:</strong> {{ email }}</p>
    </div>
    <PongInput
      label="Change Nickname"
      v-model="nickname"
      :error="nicknameError"
      @blur="touched.nicknamename = true"
    />
    
    <PongInput
      label="Change Email"
      type="email"
      v-model="email"
      :error="emailError"
      @blur="touched.email = true"
    />

    <PongInput
      label="Change Password"
      type="password"
      v-model="password"
      :error="passwordError"
      @blur="touched.password = true"
    />

    <PongInput
      label="Confirm New Password"
      type="password"
      v-model="confirmPassword"
      :error="confirmPasswordError"
      @blur="touched.confirmPassword = true"
    />
    <div class="flex flex-col gap-4">
    <PongButton
		label="save"
  		type="submit"
  		:fullWidth="true"
  		:disabled="!name || !email || !password"
  		@click="handleSubmit"
	/>

	<PongButton
		label="discard changes"
  		type="submit"
  		:fullWidth="true"
  		:disabled="!name || !email || !password"
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
