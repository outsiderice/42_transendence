<script setup lang="ts">
    interface Props {
        href: string
    }

    defineProps<Props>()
</script>

<template>
    <a 
            :href="href"
            class="pong-link underline decoration-1 hover:decoration-2"
    >
            <slot />   
    </a>
</template>

<style>
    .pong-link {
        text-decoration-thickness: 1.5px;
        color: var(--color_accent_link_unvisited); 
    }   

    .pong-link:hover {
        text-decoration-thickness: 4px;
    }

    .pong-link:visited {
        color: var(--color_accent_link_visited); 
    }
</style>