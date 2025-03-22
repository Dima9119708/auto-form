<script setup>
import AutoFormField from './auto-form-field.vue'
import { FIELD_COMPONENTS_MAP, ZOD_TYPES, ZOD_TYPE_TO_FIELD } from '@/auto-form/constants'
import {
    beautifyObjectName,
    getBaseSchema,
    getDefaultValueInZodStack,
    getOptionalInZodStack,
    isArrayOfObjects,
    isObject,
} from '@/auto-form/utils'
import { toTypedSchema } from '@vee-validate/zod'
import { Form } from 'vee-validate'
import { computed, provide, ref, shallowRef } from 'vue'

const props = defineProps({
    schema: {
        type: Object,
        required: true,
    },
    fieldConfig: {
        type: Object,
        default: () => ({}),
    },
    dependencies: { type: Array, required: false, default: () => [] },
})

const emit = defineEmits(['submit'])

const normalizeSchema = computed(() => {
    const rootElement = getBaseSchema(props.schema)

    function mapShape(path, currentShape, fullPath = path) {
        const field = path ? currentShape[path] : currentShape
        const fieldConfig = props.fieldConfig[fullPath]

        const baseSchema = getBaseSchema(field)

        const zodType = baseSchema._def.typeName
        const inputComponent = fieldConfig?.component ?? ZOD_TYPE_TO_FIELD[zodType]
        const resolvedComponent = isObject(inputComponent) ? inputComponent : FIELD_COMPONENTS_MAP[inputComponent]

        const isOptional = getOptionalInZodStack(field)

        const node = {
            path: path,
            fullPath: fullPath,
            label: fieldConfig?.label ?? field.description ?? (path && beautifyObjectName(path)),
            hideLabel: typeof fieldConfig?.hideLabel === 'boolean' ? fieldConfig.hideLabel : false,
            description: fieldConfig?.description,
            defaultValue: getDefaultValueInZodStack(field),
            required: !isOptional,
            componentType: isObject(inputComponent) ? '' : inputComponent,
            component: resolvedComponent,
            schema: baseSchema,
            ...(baseSchema._def && 'values' && { options: baseSchema._def.values }),
            ...(fieldConfig && 'inputProps' in fieldConfig && { inputProps: fieldConfig.inputProps }),
        }

        if (zodType === ZOD_TYPES.ZodObject) {
            node.children = Object.keys(baseSchema.shape).map((childKey) =>
                mapShape(childKey, baseSchema.shape, `${node.fullPath}.${childKey}`)
            )
        }

        if (zodType === ZOD_TYPES.ZodArray) {
            if (isArrayOfObjects(baseSchema)) {
                node.children = Object.keys(baseSchema.element.shape).map((childKey) =>
                    mapShape(childKey, baseSchema.element.shape, `${node.fullPath}[index].${childKey}`)
                )
            } else {
                node.children = [mapShape(null, baseSchema.element, `${node.fullPath}[index]`)]
            }
        }

        return node
    }

    if (rootElement._def.typeName !== ZOD_TYPES.ZodObject) {
        console.error('Error: Only an object is supported as the root element.')
        return []
    }

    return Object.keys(rootElement.shape).map((key) => mapShape(key, rootElement.shape))
})

provide('DEPENDENCIES', props.dependencies)
provide('NORMALIZE_SCHEMA', normalizeSchema)

const submit = (values) => {
    emit('submit', values)
}
</script>

<template>
    <Form
        class="grid gap-4 text-left"
        @submit="submit"
        v-slot="slotProps"
    >
        <template
            v-for="field in normalizeSchema"
            :key="field.path"
        >
            <slot
                v-if="field.path in $slots"
                :name="field.path"
                v-bind="field"
            />
            <AutoFormField
                v-else
                v-bind="field"
            />
        </template>

        <slot />
    </Form>
</template>

<style scoped></style>
