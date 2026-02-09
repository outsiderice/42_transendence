<script setup lang="ts">
import { computed } from 'vue';
import ButtonComponent from "@/components/ButtonComponent.vue"; // Importing existing button
import  DefaultPic from "@/assets/defaultProfilePicture.svg"

// Re-using the Interface from UserCard
interface UserRequestProps {
    profilePicture?: string;
    nickName: string;
    online: boolean;
}

const props = defineProps<UserRequestProps>();
const emit = defineEmits(['reject', 'accept']);

//rellenamos la info
const profilePicture = computed(() => props.profilePicture ?? DefaultPic);

const onlineIndicatorColor = computed(() => {
    return props.nickName === undefined ? "var(--color_accent_3)" :
           props.online ? "var(--color_accent_success)" : "var(--color_accent_danger)";
});

function redirectToUserProfilePage(): void {
    if (!props.nickName) return;
    window.location.href = window.location.origin + "/users/" + props.userName;
}
</script>

<template>
  <div class="
      userRequestCard 
      bg-(--color_background_2) 
      hover:bg-(--color_background_3)
      transition duration-200 
      p-[0.62rem] 
      rounded-[1.25rem] 
      border border-(--color_accent_3)
      w-full
  ">
    <div class="flex flex-row items-center justify-between gap-[1rem]">
      
      <div class="flex flex-row gap-[1.5rem] items-center cursor-pointer min-w-0" @click="redirectToUserProfilePage">
        <svg viewBox="0 0 60 60" class="w-[4.5rem] h-[4.5rem] flex-none hover:scale-110 transition duration-200">
          <defs>
            <mask id="reqHole"><rect width="60" height="60" fill="white"/><circle r="12" cx="50" cy="50" fill="black"/></mask>
            <mask id="reqMask"><rect width="60" height="60" fill="black"/><circle r="30" cx="30" cy="30" fill="white" mask="url(#reqHole)"/></mask>
          </defs>
          <image width="60" height="60" :href="profilePicture" mask="url(#reqMask)" />
          <circle r="8" cx="50" cy="50" :fill="onlineIndicatorColor"/>
        </svg>

        <div class="flex flex-col gap-[0.3rem]">
          <p class="text-[1.25rem] font-medium text-nowrap">{{ nickName }}</p>
          <p class="text-[0.9rem] opacity-70">{{ userName }}</p>
        </div>
      </div>

      <div class="flex flex-row gap-[0.5rem] shrink-0">
        <ButtonComponent 
          label="reject" 
          @click.stop="emit('reject', props.nickName)" 
          class="reject-btn"
        />
        <ButtonComponent 
          label="accept" 
          @click.stop="emit('accept', props.nickName)"
        />
      </div>

    </div>
  </div>
</template>

<style scoped>
.userRequestCard {
    font-family: 'Oswald', sans-serif;
}

.reject-btn {
    border-color: var(--color_accent_danger) !important;
    color: var(--color_accent_danger) !important;
}
.reject-btn:hover {
    background-color: var(--color_accent_danger) !important;
    color: white !important;
}
</style>