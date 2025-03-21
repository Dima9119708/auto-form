<script setup>
import AutoFormDescription from '@/auto-form/auto-form-description.vue'
import AutoFormError from '@/auto-form/auto-form-error.vue'
import AutoFormLabel from '@/auto-form/auto-form-label.vue'
import { DEPENDENCY_TYPE } from '@/auto-form/constants.js'
import { useDependencies } from '@/auto-form/use-dependencies.js'
import { findByNestedFullPath, getFromPath } from '@/auto-form/utils.js'
import { toTypedSchema } from '@vee-validate/zod'
import { Field, useFieldValue, useFormValues } from 'vee-validate'
import { computed, inject, ref, shallowRef, watch } from 'vue'

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

const hide = ref(hideProp)
const disabled = ref(disabledProp)
const required = ref(requiredProp)
const schema = shallowRef(schemaProp)
const options = ref(optionsProp)

useDependencies(path)

watch(
    () => hideProp,
    (value) => {
        hide.value = value.value
    },
    {
        deep: true,
        immediate: true,
    }
)

watch(
    () => disabledProp,
    (value) => {
        disabled.value = value.value
    },
    {
        deep: true,
        immediate: true,
    }
)

watch(
    () => requiredProp,
    (value) => {
        required.value = value.value
    },
    {
        deep: true,
        immediate: true,
    }
)

watch(
    () => optionsProp,
    (value) => {
        options.value = value.value
    },
    {
        deep: true,
        immediate: true,
    }
)

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
