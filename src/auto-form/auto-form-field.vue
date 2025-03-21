<script setup>
import AutoFormDescription from '@/auto-form/auto-form-description.vue'
import AutoFormError from '@/auto-form/auto-form-error.vue'
import AutoFormLabel from '@/auto-form/auto-form-label.vue'
import { useDependencies } from '@/auto-form/use-dependencies'
import { Field } from 'vee-validate'
import { computed } from 'vue'

const {
    component,
    label,
    isRequired,
    description,
    hideLabel,
    hide: hideProp,
    path,
    defaultValue: defaultValueProp,
    disabled: disabledProp,
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
    hide: Object,
    disabled: Object,
    required: Object,
    schema: {
        type: Object,
        required: false,
    },
})

useDependencies(path)

const hide = computed(() => hideProp.value)
const disabled = computed(() => disabledProp.value)
const required = computed(() => requiredProp.value)
const schema = computed(() => schemaProp.value)
const options = computed(() => optionsProp.value)

const defaultValue = computed(() => (typeof defaultValueProp === 'function' ? defaultValueProp() : undefined))

const rules = computed(() => {
    if (disabled.value) return undefined
    if (!required.value) return undefined

    return schema.value
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
            v-bind="{ path, field: slotFieldProps, options, disabled, ...otherProps }"
        >
            <template #positionLeft>
                <slot name="positionLeft" />
            </template>
            <template #label>
                <AutoFormLabel
                    v-if="!hideLabel && label"
                    :is-error="!!slotFieldProps.errorMessage"
                    :isRequired="required"
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
