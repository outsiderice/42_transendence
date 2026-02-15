<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import PongInput from '../components/PongInput.vue'
import PongButton from '../components/PongButton.vue'
import defaultProfilePicture from "../assets/defaultProfilePicture.svg"
import { useRouter } from 'vue-router';
import { useSessionStore } from '@/state/user_session.ts'
import UserAvatar from '@/components/UserAvatar.vue';

const session = useSessionStore();
const router = useRouter();

const profilePicture = ref<string | undefined>(undefined)
const onlineIndicatorColor = "var(--color_accent_success)"
const oldpassword = ref<string | undefined>(undefined)
const password = ref<string | undefined>(undefined)
const name = ref<string | undefined>(undefined)
const email = ref<string | undefined>(undefined)
const nickname = ref<string | undefined>(undefined)
const online = ref<boolean | undefined>(false)
const fileInputRef = ref<HTMLInputElement | null>(null)

const myprofilevalue = computed(() =>
  profilePicture.value ? profilePicture.value : undefined
)

// -------------------- AVATAR --------------------
const triggerFilePicker = () => {
  fileInputRef.value?.click()
}

const onAvatarSelected = async (e: Event) => {
  const target = e.target as HTMLInputElement
  if (!target.files?.length) return

  const file = target.files[0]

  // Guardamos avatar anterior por si hay error
  const previousAvatar = profilePicture.value

  // Preview inmediato con blob
  profilePicture.value = URL.createObjectURL(file)

  // Subida al backend
  const formData = new FormData()
  formData.append("avatar", file)

  try {
    const res = await fetch(`https://${window.location.host}/api/avatar/${session.getUserId}`, {
      method: "POST",
      credentials: "include",
      body: formData,
    })

    if (!res.ok) {
      alert("Error subiendo avatar ❌")
      // 🔹 Restaurar avatar anterior inmediatamente
      profilePicture.value = previousAvatar
      return
    }

    await res.json() // data del upload no necesaria

    // 🔹 Refrescar avatar desde backend para evitar imagen rota
    const refreshRes = await fetch(`https://${window.location.host}/api/users/${session.getUserId}`, {
      method: 'GET',
      credentials: 'include',
    })

    if (!refreshRes.ok) {
      alert("Error refrescando avatar ❌")
      profilePicture.value = previousAvatar
      return
    }

    const userData = await refreshRes.json()
    profilePicture.value = userData.avatar + `?t=${Date.now()}`

  } catch (error) {
    alert("Error de red al subir avatar ❌")
    profilePicture.value = previousAvatar
  }
}




// -------------------- FETCH USER --------------------
const fetchUserSettings = async () => {
  try {
    const url = `https://${window.location.host}/api/users/${session.getUserId}`;

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
    profilePicture.value = result.avatar;
    online.value = true;

    // limpiar passwords
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
    const url = `https://${window.location.host}/api/users/${session.getUserId}`;

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
      password.value = ''
      oldpassword.value = ''
      await fetchUserSettings() // refrescar datos
    } else {
      alert('Error al guardar los cambios ❌');
      password.value = ''
      oldpassword.value = ''
      await fetchUserSettings()
    }

  } catch (error) {
    alert('Error de red ❌');
  }
};

// -------------------- CANCEL --------------------
const handleCancel = () => {
  router.back() // vuelve a la página anterior
}

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

    <!-- INFO -->
    <div class="mt-6 text-[var(--color_accent_2)] text-center">
      <p><strong>Name:</strong> {{ name }}</p>
      <p><strong>Nickname:</strong> {{ nickname }}</p>
      <p class="mb-6"><strong>Email:</strong> {{ email }}</p>

      <PongInput label="Change Nickname" v-model="nickname" />
      <PongInput label="Old Password" type="password" v-model="oldpassword" />
      <PongInput label="New Password" type="password" v-model="password" />
    </div>

    <!-- BOTONES -->
    <div class="flex flex-col gap-4 mt-4">
      <PongButton label="Save Changes" :fullWidth="true" @click="handleSubmit" />
      <PongButton label="Cancel" :fullWidth="true" @click="handleCancel" />
    </div>
  </div>
</template>

<style scoped>
body {
  background-color: var(--color_background_1);
}
</style>
