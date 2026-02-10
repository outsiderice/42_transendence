<script setup lang="ts">
import { ref } from 'vue';
import PongButton from '../components/PongButton.vue';

// State
const currentTab = ref<'achievements' | 'history'>('achievements');
const unlockedCount = 3;
const totalCount = 42;

// Placeholder for the 20 stars (5 columns x 4 rows)
const achievements = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  unlocked: i < unlockedCount
}));
</script>

<template>
  <div class="flex flex-col items-center w-full max-w-[450px] mx-auto px-4 py-8 gap-6 font-['Oswald']">
    
    <section class="w-full flex items-center gap-6 p-4 border border-[var(--color_accent_3)] rounded-xl md:border-none md:p-0">
      <div class="w-24 h-24 md:w-28 md:h-28 bg-[var(--color_background_3)] rounded-full flex items-center justify-center overflow-hidden shrink-0">
        <svg class="w-16 h-16 text-[var(--color_accent_2)]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      </div>

      <div class="flex flex-col text-sm md:text-base">
        <p class="italic text-[var(--color_accent_3)]">user name: 
          <span class="block not-italic font-bold text-[var(--color_accent_1)] break-all">XXXXXXXXXX</span>
        </p>
        <p class="italic text-[var(--color_accent_3)] mt-2">nick name: 
          <span class="block not-italic font-bold text-[var(--color_accent_1)] break-all">XXXXXXXXXX</span>
        </p>
      </div>
    </section>

    <PongButton 
      label="unfriend" 
      :fullWidth="true"
      class="!bg-[var(--color_accent_1)] !text-[var(--color_background_3)] !rounded-lg h-10 flex items-center justify-center uppercase tracking-widest" 
    />

    <div class="w-full bg-[var(--color_background_2)] rounded-lg flex p-1">
      <button 
        @click="currentTab = 'achievements'"
        :class="['flex-1 flex flex-col items-center py-2 transition rounded-md', 
                 currentTab === 'achievements' ? 'bg-[var(--color_background_3)] shadow-sm' : 'opacity-60']"
      >
        <div class="w-5 h-5 mb-1 bg-[var(--color_accent_3)] rounded-full flex items-center justify-center">
            <span class="text-[10px] text-[var(--color_background_3)]">★</span>
        </div>
        <span class="text-[10px] font-bold uppercase">achievements</span>
      </button>

      <button 
        @click="currentTab = 'history'"
        :class="['flex-1 flex flex-col items-center py-2 transition rounded-md', 
                 currentTab === 'history' ? 'bg-[var(--color_background_3)] shadow-sm' : 'opacity-60']"
      >
        <div class="w-5 h-5 mb-1 border-2 border-[var(--color_accent_3)] rounded-full flex items-center justify-center">
            <span class="text-[10px] text-[var(--color_accent_3)]">🕒</span>
        </div>
        <span class="text-[10px] font-bold uppercase">game history</span>
      </button>
    </div>

    <div v-if="currentTab === 'achievements'" class="w-full flex flex-col items-center">
      <p class="italic text-sm mb-6">Your achievements: {{ unlockedCount }} / {{ totalCount }}</p>
      
      <div class="grid grid-cols-5 gap-4 md:gap-6">
        <div v-for="star in achievements" :key="star.id" class="w-8 h-8 md:w-10 md:h-10">
          <div 
            :class="['w-full h-full rounded-full border-2 flex items-center justify-center text-lg', 
                     star.unlocked ? 'border-[var(--color_accent_3)] bg-[var(--color_background_3)] text-[var(--color_accent_2)]' 
                                   : 'border-[var(--color_background_2)] text-[var(--color_background_2)]']"
          >
            ★
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
:deep(.pong-button) {
  text-transform: lowercase;
}
</style>