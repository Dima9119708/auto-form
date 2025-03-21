<script setup="">
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
    <div class="w-full">
        <slot name="label" />
        <div
            v-if="componentType === 'input'"
            class="flex gap-4"
        >
            <Input
                :disabled
                v-bind="{ ...field.field, ...inputProps }"
            />
            <slot name="positionLeft" />
        </div>

        <div
            v-else
            class="flex gap-4"
        >
            <Textarea
                :disabled
                v-bind="{ ...field.field, ...inputProps }"
                :model-value="field.value"
            />
            <slot name="positionLeft" />
        </div>

        <slot name="description" />

        <slot name="error" />
    </div>
</template>

<style scoped></style>
