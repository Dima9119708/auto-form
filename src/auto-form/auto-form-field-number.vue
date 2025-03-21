<script setup="">
import { Button } from '@/components/ui/button/index.js'
import { Input } from '@/components/ui/input/index'

defineOptions({
    inheritAttrs: false,
})
const { path, isRequired, inputProps, disabled, field } = defineProps({
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

        <div class="flex gap-4">
            <Input
                :disabled
                v-bind="{ ...field.field, ...inputProps }"
                :model-value="field.value"
                type="number"
            />
            <slot name="positionLeft" />
        </div>

        <slot name="description" />

        <slot name="error" />
    </div>
</template>

<style scoped></style>
