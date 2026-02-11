<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import PongInput from '../components/PongInput.vue'
import PongButton from '../components/PongButton.vue'
import { useRouter } from 'vue-router';
import { useSessionStore } from '@/state/user_session.ts'
import UserAvatar from '@/components/UserAvatar.vue';

const session = useSessionStore();
const router = useRouter();

const profilePicture = ref<string | undefined>(undefined)
const avatarFile = ref<File | null>(null)

const oldpassword = ref<string | undefined>(undefined)
const password = ref<string | undefined>(undefined)
const name = ref<string | undefined>(undefined)
const email = ref<string | undefined>(undefined)
const nickname = ref<string | undefined>(undefined)
const online = ref<boolean | undefined >(undefined);

const fileInputRef = ref<HTMLInputElement | null>(null)

const myprofilevalue = computed(() =>
  profilePicture.value ? profilePicture.value : undefined
)

// -------------------- AVATAR RESET 🔥 --------------------
const resetAvatarState = () => {
  if (profilePicture.value?.startsWith('blob:')) {
    URL.revokeObjectURL(profilePicture.value)
  }

  profilePicture.value = undefined
  avatarFile.value = null

  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

// -------------------- FILE PICKER --------------------
const triggerFilePicker = () => {
  fileInputRef.value?.click()
}

const onAvatarSelected = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (!target.files || !target.files.length) return

  avatarFile.value = target.files[0]

  // Preview inmediato (blob)
  profilePicture.value = URL.createObjectURL(avatarFile.value)
}

// -------------------- UPLOAD AVATAR --------------------
const uploadAvatar = async () => {
  if (!avatarFile.value) return

  const formData = new FormData()
  formData.append("avatar", avatarFile.value)

  const url = `https://${window.location.host}/api/avatar/${session.getUserId}`

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
  profilePicture.value = data.avatar
}

// -------------------- FETCH USER (también para DISCARD) --------------------
const fetchUserSettings = async () => {
  try {
    resetAvatarState() // 🔥 la clave del discard

    const url = `https://${window.location.host}/api/users/${session.getUserId}`

    const res = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })

    if (!res.ok) {
      session.$reset();
      router.push({ name: 'signin' });
      return;
    }

    const result = await res.json();

    nickname.value = result.nickname;
    name.value = result.username;
    email.value = result.email;
    profilePicture.value = result.avatar;
    online.value = true;

    // 🔥 limpiar passwords visualmente también
    password.value = ''
    oldpassword.value = ''

  } catch (error) {
    session.$reset();
    router.push({ name: 'signin' });
  }
};

// -------------------- SAVE --------------------
const handleSubmit = async () => {
  try {
    // 1️⃣ subir avatar si cambió
    if (avatarFile.value) {
      await uploadAvatar()
    }

    // 2️⃣ actualizar datos
    const url = `https://${window.location.host}/api/users/${session.getUserId}`

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

      resetAvatarState() // 🔥 importantísimo después de guardar

      // refrescar datos reales del backend
      await fetchUserSettings()

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
  <div class="max-w-md mx-auto mt-12 p-6 bg-[var(--color_background_3)] rounded-xl shadow-md">
    <UserAvatar
      class="mx-auto w-[8rem] h-[8rem]"
      @click="triggerFilePicker"
      :profilePicture="myprofilevalue"
      :online="online"
    />

    <input
      ref="fileInputRef"
      type="file"
      accept="image/*"
      class="hidden"
      @change="onAvatarSelected"
    />

    <div class="mt-6 text-[var(--color_accent_2)] text-center">
      <p><strong>Name:</strong> {{ name }}</p>
      <p><strong>Nickname:</strong> {{ nickname }}</p>
      <p class="mb-6"><strong>Email:</strong> {{ email }}</p>

      <PongInput label="Change Nickname" v-model="nickname" />
      <PongInput label="Old Password" type="password" v-model="oldpassword" />
      <PongInput label="New Password" type="password" v-model="password" />
    </div>

    <div class="flex flex-col gap-4 mt-4">
      <PongButton label="Save Changes" :fullWidth="true" @click="handleSubmit" />
      <PongButton label="Discard Changes" :fullWidth="true" @click="fetchUserSettings" />
    </div>
  </div>
</template>

<style scoped>
body {
  background-color: var(--color_background_1);
}
</style>
