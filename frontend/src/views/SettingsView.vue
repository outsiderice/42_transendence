<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PongInput from '../components/PongInput.vue'
import PongButton from '../components/PongButton.vue'
import { useAuthForm } from '../composables/useAuthForm'
import { useToggles } from '../composables/useToggles'
import defaultProfilePicture from "../assets/defaultProfilePicture.svg"
import { useRouter } from 'vue-router';
import { useSessionStore } from '@/state/user_session.ts'

const profilePicture = ref<string | undefined>(undefined)
const onlineIndicatorColor = "var(--color_accent_success)"

const session = useSessionStore();
const router = useRouter();

//const nickName = ref<string | undefined >(undefined);
//const userName = ref<string | undefined >(undefined);
const online = ref<boolean | undefined >(undefined);
//const profilePicture = ref<string | undefined>(undefined);
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
  confirmPasswordError,
  validate 
} = useAuthForm()

// --- GET: traer datos del usuario usando token ---
const fetchUserSettings = async () => {
  console.log("DEBUG: Starting fetchUserSettings");
  console.log("DEBUG: session object:", session);
  console.log("DEBUG: session.getUserId:", session.getUserId);

  try {
    const url = "https://" + window.location.host + "/api/users/" + session.getUserId;
    console.log("DEBUG: Fetch URL:", url);

    const res = await fetch(url, {
      method: 'GET',
      credentials: 'include', // 🔑 enviar cookies
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log("DEBUG: Response object:", res);
    console.log("DEBUG: Response status:", res.status);

    if (!res.ok) {
      console.warn("DEBUG: Usuario no autenticado o error backend, reseteando sesión");
      console.log("DEBUG: Resetting session");
      session.$reset();
      console.log("DEBUG: Redirecting to signin page");
      router.push({ name: 'signin' });
      return;
    }

    const result = await res.json();
    console.log("DEBUG: Parsed user data:", result);

    nickname.value = result.nickname || "no nickname";
    console.log("DEBUG: nickName.value set to:", nickname.value);

    name.value = result.username || "no username";
    console.log("DEBUG: userName.value set to:", name.value);

    email.value = result.email || "no email";
    console.log("DEBUG: email.value set to:", email.value);

    profilePicture.value = result.avatar || defaultProfilePicture;
    console.log("DEBUG: profilePicture.value set to:", profilePicture.value);

    online.value = true;
    console.log("DEBUG: online.value set to true");

  } catch (error) {
    console.error("DEBUG: Network error fetching user:", error);
    console.log("DEBUG: Resetting session due to error");
    session.$reset();
    console.log("DEBUG: Redirecting to signin page due to error");
    router.push({ name: 'signin' });
  }
};


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
        <image v-else width="60" height="60" fill="var(--color_accent_1)" :href="profilePicture" mask="url(#profileMask)" />

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
      <p><strong class="text-[var(--color_accent_1)]">Change Password:</strong></p>
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
