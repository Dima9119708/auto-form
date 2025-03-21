<script setup="">
import { Input } from '@/components/ui/input/index.js'
import { Field } from 'vee-validate'

const props = defineProps({
    path: String,
})
</script>

<template>
    <Field :name="path">
        <slot name="label" />

        <Input />
        <slot name="error" />
        <slot name="description" />
    </Field>
</template>

<style scoped></style>
