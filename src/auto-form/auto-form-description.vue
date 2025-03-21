<script lang="ts" setup="">
defineProps({
    description: {
        type: String,
        required: false,
    },
})
</script>

<template>
    <p
        v-if="description"
        class="text-sm text-muted-foreground"
    >
        {{ description }}
    </p>
</template>

<style scoped></style>
