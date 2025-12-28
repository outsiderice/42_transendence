<script setup lang="ts">
    interface Props {
        href: string
    }

    defineProps<Props>()
</script>

<template>
    <a 
            :href= "href"
            class="pong-link text-blue-600 underline decoration-1 hover:decoration-2 visited:text-indigo-700"
    >
            <slot />   
    </a>
</template>

<style scoped>
    .pong-link {
        text-decoration-thickness: 1.5px; 
    }


    .pong-link:hover {
        text-decoration-thickness: 4px;
    }
</style>