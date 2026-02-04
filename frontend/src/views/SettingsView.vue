<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PongInput from '../components/PongInput.vue'
import PongButton from '../components/PongButton.vue'
import { useAuthForm } from '../composables/useAuthForm'
import { useToggles } from '../composables/useToggles'
import defaultProfilePicture from "../assets/defaultProfilePicture.svg"

// Toggle del newsletter
const { newsletter } = useToggles()

// Avatar y status
const profilePicture = ref<string | undefined>(undefined)
const onlineIndicatorColor = "var(--color_accent_success)"

// Token del usuario
const token = localStorage.getItem('token')
const userId = ref<number | null>(null)

// Campos del formulario
const { 
  name, 
  email, 
  password, 
  confirmPassword,
  nickname,
  touched, 
  nameError, 
  emailError, 
  passwordError,
  nicknameError, 
  confirmPasswordError,
  validate 
} = useAuthForm()

// --- GET: traer datos del usuario usando token ---
const fetchUserSettings = async () => {
  if (!token) return

  try {
    const res = await fetch('http://' + window.location.host + '/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (res.ok) {
      const data = await res.json()
      userId.value = data.id
      name.value = data.username
      email.value = data.email
      nickname.value = data.nickname
      profilePicture.value = data.avatar || undefined
      console.log('User settings loaded:', data)
    } else {
      console.error('Error fetching user settings:', await res.text())
    }
  } catch (error) {
    console.error('Network error fetching settings:', error)
  }
}

// --- PUT: actualizar usuario ---
const handleSubmit = async () => {
  if (!validate()) return
  if (!token || !userId.value) return alert('No estás autenticado')

  try {
    const res = await fetch(`https://` + window.location.host + `/users/${userId.value}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: name.value,
        email: email.value,
        password: password.value || undefined,
        nickname: nickname.value,
        avatar: profilePicture.value
      })
    })

    if (res.ok) {
      const data = await res.json()
      console.log('User settings updated:', data)
      alert('Cambios guardados ✅')
      // Limpiar passwords
      password.value = ''
      confirmPassword.value = ''
    } else {
      const errorText = await res.text()
      console.error('Error updating settings:', errorText)
      alert('Error al guardar los cambios ❌')
    }
  } catch (error) {
    console.error('Network error updating settings:', error)
    alert('Error de red al guardar cambios ❌')
  }
}

// Cargar datos al montar
onMounted(fetchUserSettings)
</script>

<template>
  <div class="max-w-md mx-auto mt-12 p-6 bg-white rounded-xl shadow-md">
    <!-- Avatar y status -->
    <div class="flex justify-center mb-6">
      <svg
        viewBox="0 0 60 60"
        class="profilePictureContainer w-[7rem] h-[7rem] flex-none hover:scale-110 transition duration-200"
      >
        <defs>
          <mask id="statusIndicatorHole">
            <rect width="60" height="60" fill="white" />
            <circle r="12" cx="50" cy="50" fill="black" />
          </mask>
          <mask id="profileMask">
            <rect width="60" height="60" fill="black" />
            <circle r="30" cx="30" cy="30" fill="white" mask="url(#statusIndicatorHole)" />
          </mask>
          <mask id="defaultProfileMask">
            <rect width="60" height="60" fill="black" />
            <image width="60" height="60" :href="defaultProfilePicture" />
          </mask>
        </defs>

        <!-- default avatar -->
        <g v-if="profilePicture === undefined" mask="url(#profileMask)">
          <rect width="60" height="60" fill="var(--color_accent_1)" mask="url(#defaultProfileMask)" />
        </g>

        <!-- user avatar -->
        <image v-else width="60" height="60" :href="profilePicture" mask="url(#profileMask)" />

        <!-- status -->
        <circle r="8" cx="50" cy="50" :fill="onlineIndicatorColor" />
      </svg>
    </div>

    <!-- Info actual -->
    <div class="mt-6 text-[var(--color_accent_2)]">
      <p><strong class="text-[var(--color_accent_1)]">Name:</strong> {{ name }}</p>
      <p><strong class="text-[var(--color_accent_1)]">Nickname:</strong> {{ nickname }}</p>
      <PongInput
      label="Change Nickname"
      v-model="nickname"
      :error="nicknameError"
      @blur="touched.nickname = true"
      />
      <p><strong class="text-[var(--color_accent_1)]">Email:</strong> {{ email }}</p>
      <p><strong class="text-[var(--color_accent_1)]">Change Password:</strong> {{ email }}</p>
      <PongInput
        label="Type Old Password"
        type="password"
        v-model="password"
        :error="passwordError"
        @blur="touched.password = true"
      />

      <PongInput
        label="Type New Password"
        type="password"
        v-model="confirmPassword"
        :error="confirmPasswordError"
        @blur="touched.confirmPassword = true"
      />

    </div>

    <!-- Formulario -->
    

    

    <div class="flex flex-col gap-4 mt-4">
      <PongButton
        label="Save Changes"
        :fullWidth="true"
        :disabled="!name || !email"
        @click="handleSubmit"
      />

      <PongButton
        label="Discard Changes"
        :fullWidth="true"
        @click="fetchUserSettings"
      />
    </div>
  </div>
</template>

<style scoped>
body {
  background-color: var(--color_background_1);
}
</style>
