<script setup lang="ts">
import UserRequestCard from "@/components/UserRequestCard.vue"; 

// This handles the alert when you click a button
const onAction = (type: string, user: string) => {
  alert(`${type} clicked for ${user}`);
};
</script>

<template>
  <div class="min-h-screen p-10 bg-gray-100">
    <div class="max-w-[30rem] flex flex-col gap-4">
      <h2 class="text-sm text-gray-500 uppercase font-bold">User Request Card (New Component)</h2>
      
      <UserRequestCard 
        nickName="Polly" 
        :online="true"
        @accept="onAction('Accept', 'Polly')"
        @reject="onAction('Reject', 'Polly')"
      />
      <UserRequestCard 
        nickName="Jenny"
        :online="false"
        @accept="onAction('Accept', 'Jenny')"
        @reject="onAction('Reject', 'Jenny')"
      />
    </div>
  </div>
</template>

<style scoped>
div {
    font-family: 'Oswald', sans-serif;
}
body, html {
    background-color: var(--color_background_1) !important;
    margin: 0;
    padding: 0;
}
</style>