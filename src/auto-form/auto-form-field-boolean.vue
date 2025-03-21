<script setup="">
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch/index'
import { useId } from 'reka-ui'

defineOptions({
    inheritAttrs: false,
})

const { path, componentType, field, disabled } = defineProps({
    path: String,
    componentType: {
        type: String,
        validator(value) {
            return ['checkbox', 'switch'].includes(value)
        },
    },
    field: Object,
    disabled: Boolean,
})

const id = useId()
</script>

<template>
    <div>
        <div
            v-if="componentType === 'switch'"
            class="flex items-center space-x-2"
        >
            <Switch
                :disabled
                :id="id"
                :model-value="field.value"
                @update:model-value="field.handleChange"
            />
            <slot name="label" />
        </div>

        <div
            v-else
            class="flex items-center space-x-2"
        >
            <Checkbox
                :disabled
                :id="id"
                :model-value="field.value"
                @update:model-value="field.handleChange"
            />
            <slot name="label" />
        </div>

        <slot name="description" />

        <slot name="error" />
    </div>
</template>

<style scoped></style>
