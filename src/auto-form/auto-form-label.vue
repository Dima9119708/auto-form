<script setup="">
defineProps(['isRequired', 'isError', 'disabled'])
</script>

<template>
    <label
        class="text-sm font-medium"
        :class="{ 'text-destructive': isError, 'text-muted-foreground': disabled }"
    >
        <slot />
        <span
            v-if="isRequired"
            class="text-destructive"
        >
            *
        </span>
    </label>
</template>

<style scoped></style>
