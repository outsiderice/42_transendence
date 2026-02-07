<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PongInput from '../components/PongInput.vue'
import PongButton from '../components/PongButton.vue'
import defaultProfilePicture from "../assets/defaultProfilePicture.svg"
import { useRouter } from 'vue-router'
import { useSessionStore } from '@/state/user_session.ts'
import { Cropper, CircleStencil } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'

// --- Datos del usuario ---
const profilePicture = ref<string | undefined>(undefined)
const onlineIndicatorColor = "var(--color_accent_success)"
const oldpassword = ref<string | undefined>(undefined)
const password = ref<string | undefined>(undefined)
const session = useSessionStore()
const router = useRouter()
const name = ref<string | undefined>(undefined)
const email = ref<string | undefined>(undefined)
const nickname = ref<string | undefined>(undefined)
const online = ref<boolean | undefined >(undefined)
const userId = ref<number | null>(null)

// --- Avatar upload state ---
const imageToCrop = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const cropper = ref<any>(null)

// --- GET: traer datos del usuario usando token ---
const fetchUserSettings = async () => {
  try {
    const url = "https://" + window.location.host + "/api/users/" + session.getUserId
    const res = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    })

    if (!res.ok) {
      session.$reset()
      router.push({ name: 'signin' })
      return
    }

    const result = await res.json()
    nickname.value = result.nickname || "no nickname"
    name.value = result.username || "no username"
    email.value = result.email || "no email"
    profilePicture.value = result.avatar || undefined
    online.value = true
  } catch (error) {
    console.error(error)
    session.$reset()
    router.push({ name: 'signin' })
  }
}

// --- PUT: actualizar usuario ---
const handleSubmit = async () => {
  try {
    const url = "https://" + window.location.host + "/api/users/" + session.getUserId
    const payload = {
      username: name.value,
      email: email.value,
      password: password.value || undefined,
      oldpassword: oldpassword.value,
      nickname: nickname.value,
      avatar: profilePicture.value
    }

    const res = await fetch(url, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (res.ok) {
      const data = await res.json()
      alert('Cambios guardados ✅')
      password.value = ''
      oldpassword.value = ''
    } else {
      const errorText = await res.text()
      alert('Error al guardar los cambios ❌')
      console.error(errorText)
    }
  } catch (error) {
    alert('Error de red al guardar cambios ❌')
    console.error(error)
  }
}

// --- Avatar upload functions ---
const openPicker = () => {
  fileInput.value?.click()
}

const onFileSelected = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  imageToCrop.value = URL.createObjectURL(file)
}

const cancelCrop = () => {
  imageToCrop.value = null
}

const cropAndUpload = async () => {
  const { canvas } = cropper.value.getResult()

  canvas.toBlob(async (blob: Blob) => {
    const formData = new FormData()
    formData.append('avatar', blob, 'avatar.jpg')

    const res = await fetch('https://' + window.location.host + '/api/upload-avatar', {
      method: 'POST',
      credentials: 'include',
      body: formData
    })

    const data = await res.json()
    profilePicture.value = data.avatar
    imageToCrop.value = null
  }, 'image/jpeg')
}

// --- Montaje ---
onMounted(fetchUserSettings)
</script>

<template>
  <div class="max-w-md mx-auto mt-12 p-6 bg-white rounded-xl shadow-md">

    <!-- Avatar y status -->
    <div class="flex justify-center mb-6 relative">
      <svg
        viewBox="0 0 60 60"
        class="profilePictureContainer w-[7rem] h-[7rem] flex-none hover:scale-110 transition duration-200 cursor-pointer"
        @click="openPicker"
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
        <image v-else width="60" height="60" fill="var(--color_accent_1)" :href="profilePicture" mask="url(#profileMask)" />

        <!-- status -->
        <circle r="8" cx="50" cy="50" :fill="onlineIndicatorColor" />
      </svg>

      <!-- input oculto -->
      <input ref="fileInput" type="file" accept="image/*" hidden @change="onFileSelected" />
    </div>

    <!-- Cropper Modal -->
    <div
      v-if="imageToCrop"
      class="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
    >
      <div class="bg-white p-4 rounded">
        <Cropper
          :src="imageToCrop"
          :stencil-component="CircleStencil"
          :stencil-props="{ aspectRatio: 1 }"
          :ref="cropper"
          class="w-[300px] h-[300px]"
        />

        <div class="flex gap-2 mt-4 justify-end">
          <button @click="cancelCrop">Cancelar</button>
          <button @click="cropAndUpload">Guardar</button>
        </div>
      </div>
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
