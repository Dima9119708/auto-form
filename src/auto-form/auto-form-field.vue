<script setup>
import AutoFormDescription from '@/auto-form/auto-form-description.vue'
import AutoFormError from '@/auto-form/auto-form-error.vue'
import AutoFormLabel from '@/auto-form/auto-form-label.vue'
import { useDependencies } from '@/auto-form/use-dependencies'
import { toTypedSchema } from '@vee-validate/zod'
import { Field } from 'vee-validate'
import { computed } from 'vue'

const {
    component,
    label,
    isRequired,
    description,
    hideLabel,
    path,
    defaultValue: defaultValueProp,
    required: requiredProp,
    schema: schemaProp,
    options: optionsProp,
    ...otherProps
} = defineProps({
    path: String,
    label: String,
    hideLabel: {
        type: Boolean,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    componentType: {
        type: String,
        required: false,
    },
    inputProps: {
        type: Object,
        required: false,
    },
    component: Object,
    children: {
        type: Array,
        required: false,
    },
    defaultValue: {
        type: Function,
        required: false,
    },
    options: {
        type: Object,
        required: false,
    },
    required: Boolean,
    schema: {
        type: Object,
        required: false,
    },
})

const { disabled, hide, overrideOptions, overrideRequiredAndSchema } = useDependencies(path, requiredProp, schemaProp, optionsProp)

const defaultValue = computed(() => (typeof defaultValueProp === 'function' ? defaultValueProp() : undefined))

const rules = computed(() => {
    if (disabled.value) return undefined
    if (!overrideRequiredAndSchema.value.required) return undefined

    return toTypedSchema(overrideRequiredAndSchema.value.schema)
})
</script>

<template>
    <Field
        v-if="!hide"
        :model-value="defaultValue"
        :name="path"
        :rules="rules"
        v-slot="slotFieldProps"
    >
        <component
            :is="component"
            v-bind="{ path, field: slotFieldProps, options: overrideOptions, disabled, ...otherProps }"
        >
            <template #positionLeft>
                <slot name="positionLeft" />
            </template>
            <template #label>
                <AutoFormLabel
                    v-if="!hideLabel && label"
                    :is-error="!!slotFieldProps.errorMessage"
                    :isRequired="!disabled && overrideRequiredAndSchema.required"
                    :disabled
                >
                    {{ label }}
                </AutoFormLabel>
            </template>
            <template #error>
                <AutoFormError :message="slotFieldProps.errorMessage" />
            </template>
            <template #description>
                <AutoFormDescription :description="description" />
            </template>
        </component>
    </Field>
</template>

<style scoped></style>
