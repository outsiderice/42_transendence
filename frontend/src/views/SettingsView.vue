<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PongInput from '../components/PongInput.vue'
import PongButton from '../components/PongButton.vue'
import defaultProfilePicture from "../assets/defaultProfilePicture.svg"
import { useRouter } from 'vue-router'
import { useSessionStore } from '@/state/user_session.ts'

const profilePicture = ref<string | undefined>(undefined)
const onlineIndicatorColor = "var(--color_accent_success)"
const oldpassword = ref<string | undefined>(undefined)
const password = ref<string | undefined>(undefined)
const session = useSessionStore()
const router = useRouter()
const name = ref<string | undefined>(undefined)
const email = ref<string | undefined>(undefined)
const nickname = ref<string | undefined>(undefined)
const online = ref<boolean>(false)
const userId = ref<number | null>(null)

// --- GET: traer datos del usuario usando token ---
const fetchUserSettings = async () => {
  console.log("DEBUG: fetchUserSettings START")

  try {
    // 1️⃣ Obtener datos del usuario
    const url = `https://${window.location.host}/api/users/${session.getUserId}`
    console.log("DEBUG: Fetch URL:", url)

    const res = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })

    if (!res.ok) {
      console.warn("DEBUG: Usuario no autenticado o error backend, reseteando sesión")
      session.$reset()
      router.push({ name: 'signin' })
      return
    }

    const result = await res.json()
    console.log("DEBUG: Full user object:", result)

    nickname.value = result.nickname || "no nickname"
    name.value = result.username || "no username"
    email.value = result.email || "no email"
    online.value = true

    // 2️⃣ Obtener avatar como blob
    const avatarRes = await fetch(`https://${window.location.host}/avatar/${result.id}`, {
      method: 'GET',
      credentials: 'include',
    })

    if (!avatarRes.ok) {
      console.warn("DEBUG: No se pudo obtener avatar, usando default")
      profilePicture.value = undefined
    } else {
      const blob = await avatarRes.blob()
      profilePicture.value = URL.createObjectURL(blob)
      console.log("DEBUG: profilePicture blob URL:", profilePicture.value)
    }

  } catch (error) {
    console.error("DEBUG: Network error fetching user:", error)
    session.$reset()
    router.push({ name: 'signin' })
  }
}


// --- PUT: actualizar usuario ---
const handleSubmit = async () => {
  console.log("DEBUG: handleSubmit START")

  const payload = {
    username: name.value,
    email: email.value,
    password: password.value || undefined,
    oldpassword: oldpassword.value,
    nickname: nickname.value,
    avatar: profilePicture.value
  }

  try {
    const url = `https://${window.location.host}/api/users/${session.getUserId}`
    console.log("DEBUG: PUT URL:", url)
    console.log("DEBUG: Payload:", payload)

    const res = await fetch(url, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (res.ok) {
      const data = await res.json()
      console.log("DEBUG: Response OK:", data)
      alert('Cambios guardados ✅')
      password.value = ''
      oldpassword.value = ''
    } else {
      const errorText = await res.text()
      console.error("DEBUG: Error response:", errorText)
      alert('Error al guardar los cambios ❌')
    }

  } catch (error) {
    console.error('DEBUG: Network error updating settings:', error)
    alert('Error de red al guardar cambios ❌')
  }
}

// Cargar datos al montar
onMounted(fetchUserSettings)
</script>

<template>
  <div class="max-w-md mx-auto mt-12 p-6 bg-[var(--color_background_1)] rounded-xl shadow-md">
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
        </defs>

        <!-- default avatar -->
        <image
          v-if="!profilePicture"
          width="60"
          height="60"
          :href="defaultProfilePicture"
          mask="url(#profileMask)"
        />

        <!-- user avatar -->
        <image
          v-else
          width="60"
          height="60"
          :href="profilePicture"
          mask="url(#profileMask)"
        />

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
      />
      <p><strong class="text-[var(--color_accent_1)]">Email:</strong> {{ email }}</p>
      <p><strong class="text-[var(--color_accent_1)]">Change Password:</strong></p>
      <PongInput
        label="Type Old Password"
        type="password"
        v-model="oldpassword"
      />
      <PongInput
        label="Type New Password"
        type="password"
        v-model="password"
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
