<script setup="">
const { message } = defineProps({
    message: String,
})
</script>

<template>
    <p
        v-if="message"
        class="text-destructive font-medium text-sm"
    >
        {{ message }}
    </p>
</template>

<style scoped></style>
