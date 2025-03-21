<script setup="">
import { beautifyObjectName } from './utils.js'
import { Button } from '@/components/ui/button/index.js'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

defineOptions({
    inheritAttrs: false,
})

const { options, componentType, inputProps, field, disabled } = defineProps({
    options: {
        type: [Array, Object],
        required: true,
    },
    componentType: {
        type: String,
        validator(value) {
            return ['select', 'radio'].includes(value)
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
        <RadioGroup
            :disabled
            v-if="componentType === 'radio'"
            :model-value="field.value"
            @update-model-value="field.handleChange"
            :orientation="'vertical'"
        >
            <slot name="label" />
            <div
                v-for="option in options"
                class="flex items-center space-x-2"
            >
                <RadioGroupItem
                    :id="option"
                    :value="{ option }"
                />
                <Label :for="option">{{ beautifyObjectName(option) }}</Label>
            </div>
        </RadioGroup>

        <Select
            v-else
            :disabled
            :model-value="field.value"
            @update:model-value="field.handleChange"
        >
            <slot name="label" />
            <SelectTrigger>
                <SelectValue :placeholder="inputProps?.placeholder" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem
                    v-for="option in options"
                    :key="option"
                    :value="option"
                >
                    {{ beautifyObjectName(option) }}
                </SelectItem>
            </SelectContent>

            <slot name="description" />

            <slot name="error" />
        </Select>
    </div>
</template>

<style scoped></style>
