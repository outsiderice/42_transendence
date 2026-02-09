<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PongInput from '../components/PongInput.vue'
import PongButton from '../components/PongButton.vue'
import defaultProfilePicture from "../assets/defaultProfilePicture.svg"
import { useRouter } from 'vue-router';
import { useSessionStore } from '@/state/user_session.ts'

const session = useSessionStore();
const router = useRouter();

const profilePicture = ref<string | undefined>(undefined)
const avatarFile = ref<File | null>(null)

const onlineIndicatorColor = "var(--color_accent_success)"
const oldpassword = ref<string | undefined>(undefined)
const password = ref<string | undefined>(undefined)
const name = ref<string | undefined>(undefined)
const email = ref<string | undefined>(undefined)
const nickname = ref<string | undefined>(undefined)
const online = ref<boolean | undefined >(undefined);

const fileInputRef = ref<HTMLInputElement | null>(null)

// --- Abrir selector de archivos al clickear el avatar ---
const triggerFilePicker = () => {
  fileInputRef.value?.click()
}

// --- Cuando el usuario selecciona una imagen ---
const onAvatarSelected = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (!target.files || !target.files.length) return

  avatarFile.value = target.files[0]

  // Preview inmediato
  profilePicture.value = URL.createObjectURL(avatarFile.value)
}

// --- POST avatar ---
const uploadAvatar = async () => {
  if (!avatarFile.value) return

  const formData = new FormData()
  formData.append("avatar", avatarFile.value)

  const url = "https://" + window.location.host + "/api/avatar/" + session.getUserId

  const res = await fetch(url, {
    method: "POST",
    credentials: "include",
    body: formData,
  })

  if (!res.ok) {
    alert("Error subiendo avatar ❌")
    return
  }

  const data = await res.json()
  profilePicture.value = data.avatar + '?t=' + Date.now()

}

// --- GET usuario ---
const fetchUserSettings = async () => {
  try {
    const url = "https://" + window.location.host + "/api/users/" + session.getUserId;

    const res = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      session.$reset();
      router.push({ name: 'signin' });
      return;
    }

    const result = await res.json();

    nickname.value = result.nickname;
    name.value = result.username;
    email.value = result.email;
    profilePicture.value = result.avatar + '?t=' + Date.now();
    online.value = true;

  } catch (error) {
    session.$reset();
    router.push({ name: 'signin' });
  }
};

// --- PUT usuario ---
const handleSubmit = async () => {
  try {
    // 1️⃣ Subir avatar si cambió
    if (avatarFile.value) {
      await uploadAvatar()
    }

    // 2️⃣ Actualizar datos
    const url = "https://" + window.location.host + "/api/users/" + session.getUserId;

    const payload = {
      username: name.value,
      email: email.value,
      password: password.value || undefined,
      oldpassword: oldpassword.value,
      nickname: nickname.value,
    };

    const res = await fetch(url, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      alert('Cambios guardados ✅');
      password.value = '';
      oldpassword.value = '';
      avatarFile.value = null
    } else {
      alert('Error al guardar los cambios ❌');
    }

  } catch (error) {
    alert('Error de red ❌');
  }
};

onMounted(fetchUserSettings)
</script>

<template>
  <div class="max-w-md mx-auto mt-12 p-6 bg-white rounded-xl shadow-md">

    <!-- AVATAR -->
    <div class="flex justify-center mb-6 cursor-pointer" @click="triggerFilePicker">
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

        <g v-if="profilePicture === undefined" mask="url(#profileMask)">
          <rect width="60" height="60" fill="var(--color_accent_1)" mask="url(#defaultProfileMask)" />
        </g>

        <image
          v-else
          width="60"
          height="60"
          :href="profilePicture"
          mask="url(#profileMask)"
        />

        <circle r="8" cx="50" cy="50" :fill="onlineIndicatorColor" />
      </svg>
    </div>

    <!-- input oculto -->
    <input
      ref="fileInputRef"
      type="file"
      accept="image/*"
      class="hidden"
      @change="onAvatarSelected"
    />

    <!-- INFO -->
    <div class="mt-6 text-[var(--color_accent_2)]">
      <p><strong>Name:</strong> {{ name }}</p>
      <p><strong>Nickname:</strong> {{ nickname }}</p>

      <PongInput
        label="Change Nickname"
        v-model="nickname"
      />

      <p><strong>Email:</strong> {{ email }}</p>

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

    <!-- BOTONES -->
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
