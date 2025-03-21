<script setup="">
import { Button } from '@/components/ui/button/index.js'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

defineOptions({
    inheritAttrs: false,
})

const { inputProps, componentType, field, disabled } = defineProps({
    componentType: {
        type: String,
        validator(value) {
            return ['input', 'textarea'].includes(value)
        },
    },
    inputProps: {
        type: Object,
        required: false,
    },
    field: Object,
    disabled: Boolean,
})
</script>

<template>
    <div>
        <slot name="label" />
        <Input
            :disabled
            v-if="componentType === 'input'"
            v-bind="{ ...field.field, ...inputProps }"
        />
        <Textarea
            v-else
            :disabled
            v-bind="{ ...field.field, ...inputProps }"
            :model-value="field.value"
        />

        <slot name="description" />

        <slot name="error" />
    </div>
</template>

<style scoped></style>
