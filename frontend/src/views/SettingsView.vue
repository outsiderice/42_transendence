<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSessionStore } from '@/state/user_session'

import PongInput from '../components/PongInput.vue'
import PongButton from '../components/PongButton.vue'
import defaultProfilePicture from '../assets/defaultProfilePicture.svg'

import VueMediaUpload from 'vue-media-upload'
import 'vue-media-upload/dist/style.css'

// --------------------
// State
// --------------------
const session = useSessionStore()
const router = useRouter()

const name = ref<string>()
const email = ref<string>()
const nickname = ref<string>()
const profilePicture = ref<string | undefined>()

const oldpassword = ref('')
const password = ref('')

const onlineIndicatorColor = 'var(--color_accent_success)'

// --------------------
// Fetch user
// --------------------
const fetchUserSettings = async () => {
  try {
    const res = await fetch(
      `https://${window.location.host}/api/users/${session.getUserId}`,
      {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      }
    )

    if (!res.ok) throw new Error('Unauthorized')

    const result = await res.json()

    name.value = result.username
    email.value = result.email
    nickname.value = result.nickname
    profilePicture.value = result.avatar
  } catch (err) {
    console.error(err)
    session.$reset()
    router.push({ name: 'signin' })
  }
}

// --------------------
// Save changes
// --------------------
const handleSubmit = async () => {
  try {
    const payload: any = {
      username: name.value,
      email: email.value,
      nickname: nickname.value,
      avatar: profilePicture.value
    }

    if (password.value) {
      payload.password = password.value
      payload.oldpassword = oldpassword.value
    }

    const res = await fetch(
      `https://${window.location.host}/api/users/${session.getUserId}`,
      {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }
    )

    if (!res.ok) throw new Error(await res.text())

    alert('Cambios guardados ✅')
    password.value = ''
    oldpassword.value = ''
  } catch (err) {
    console.error(err)
    alert('Error al guardar los cambios ❌')
  }
}

// --------------------
// Avatar upload handler
// --------------------
const onAvatarUploaded = async (files: File[]) => {
  if (!files.length) return

  const formData = new FormData()
  formData.append('avatar', files[0])

  try {
    const res = await fetch(
      `https://${window.location.host}/api/upload-avatar`,
      {
        method: 'POST',
        credentials: 'include',
        body: formData
      }
    )

    if (!res.ok) throw new Error('Upload failed')

    const data = await res.json()
    profilePicture.value = data.avatar
  } catch (err) {
    console.error(err)
    alert('Error subiendo avatar ❌')
  }
}

onMounted(fetchUserSettings)
</script>

<template>
  <div class="max-w-md mx-auto mt-12 p-6 bg-white rounded-xl shadow-md">

    <!-- Avatar -->
    <div class="flex justify-center mb-6">
      <svg
        viewBox="0 0 60 60"
        class="w-[7rem] h-[7rem]"
      >
        <defs>
          <mask id="hole">
            <rect width="60" height="60" fill="white" />
            <circle r="12" cx="50" cy="50" fill="black" />
          </mask>
          <mask id="avatarMask">
            <rect width="60" height="60" fill="black" />
            <circle r="30" cx="30" cy="30" fill="white" mask="url(#hole)" />
          </mask>
        </defs>

        <image
          v-if="profilePicture"
          width="60"
          height="60"
          :href="profilePicture"
          mask="url(#avatarMask)"
        />

        <image
          v-else
          width="60"
          height="60"
          :href="defaultProfilePicture"
          mask="url(#avatarMask)"
        />

        <circle r="8" cx="50" cy="50" :fill="onlineIndicatorColor" />
      </svg>
    </div>

    <!-- Upload -->
    <VueMediaUpload
      accept="image/*"
      :multiple="false"
      :max-files="1"
      @change="onAvatarUploaded"
    />

    <!-- Info -->
    <div class="mt-6 text-[var(--color_accent_2)]">
      <p><strong>Name:</strong> {{ name }}</p>
      <p><strong>Email:</strong> {{ email }}</p>

      <PongInput
        label="Change Nickname"
        v-model="nickname"
      />

      <PongInput
        label="Old Password"
        type="password"
        v-model="oldpassword"
      />

      <PongInput
        label="New Password"
        type="password"
        v-model="password"
      />
    </div>

    <!-- Actions -->
    <div class="flex flex-col gap-4 mt-4">
      <PongButton
        label="Save Changes"
        :fullWidth="true"
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
