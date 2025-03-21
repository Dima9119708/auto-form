import { DEPENDENCY_TYPE } from '@/auto-form/constants.js'
import { findByNestedFullPath, getFromPath } from '@/auto-form/utils.js'
import { toTypedSchema } from '@vee-validate/zod'
import { useFieldValue, useFormValues } from 'vee-validate'
import { computed, inject, watch } from 'vue'

export const useDependencies = (path) => {
    const dependencies = inject('DEPENDENCIES')
    const normalizeSchema = inject('NORMALIZE_SCHEMA')

    const currentField = useFieldValue(() => path)
    const values = useFormValues()

    const filteredDependencies = computed(() => dependencies.filter((dep) => dep.sourceField === path))

    const normalizeFields = computed(() =>
        filteredDependencies.value.reduce((acc, dep) => {
            acc[dep.targetField] = findByNestedFullPath(normalizeSchema.value, dep.targetField)

            return acc
        }, {})
    )

    const dependencyConditions = computed(() => {
        const sourceValue = currentField.value

        if (sourceValue === undefined) {
            return {
                [DEPENDENCY_TYPE.HIDES]: false,
                [DEPENDENCY_TYPE.DISABLES]: false,
                [DEPENDENCY_TYPE.REQUIRES]: false,
                [DEPENDENCY_TYPE.SETS_OPTIONS]: false,
            }
        }

        return filteredDependencies.value.reduce((acc, dep) => {
            switch (dep.type) {
                case DEPENDENCY_TYPE.HIDES:
                    acc[DEPENDENCY_TYPE.HIDES] = dep.when(sourceValue)
                    break
                case DEPENDENCY_TYPE.DISABLES:
                    acc[DEPENDENCY_TYPE.DISABLES] = dep.when(sourceValue)
                    break
                case DEPENDENCY_TYPE.REQUIRES:
                    acc[DEPENDENCY_TYPE.REQUIRES] = dep.when(sourceValue)
                    break
                case DEPENDENCY_TYPE.SETS_OPTIONS:
                    const targetValue = getFromPath(values.value, dep.targetField)
                    acc[DEPENDENCY_TYPE.SETS_OPTIONS] = dep.when(sourceValue, targetValue)
                    break
            }

            return acc
        }, {})
    })

    watch(
        () => dependencyConditions.value[DEPENDENCY_TYPE.HIDES],
        (when) => {
            filteredDependencies.value
                .filter((dep) => dep.type === DEPENDENCY_TYPE.HIDES)
                .forEach((dep) => {
                    const findNormalizedField = normalizeFields.value[dep.targetField]

                    findNormalizedField.hide.value = when
                })
        },
        {
            immediate: true,
        }
    )

    watch(
        () => dependencyConditions.value[DEPENDENCY_TYPE.DISABLES],
        (when) => {
            filteredDependencies.value
                .filter((dep) => dep.type === DEPENDENCY_TYPE.DISABLES)
                .forEach((dep) => {
                    const findNormalizedField = normalizeFields.value[dep.targetField]

                    findNormalizedField.disabled.value = when
                    findNormalizedField.required.value = !when
                })
        },
        {
            immediate: true,
        }
    )

    watch(
        () => dependencyConditions.value[DEPENDENCY_TYPE.REQUIRES],
        (when) => {
            filteredDependencies.value
                .filter((dep) => dep.type === DEPENDENCY_TYPE.REQUIRES)
                .forEach((dep) => {
                    const findNormalizedField = normalizeFields.value[dep.targetField]

                    findNormalizedField.required.value = when

                    if (!('schema' in dep)) {
                        console.error("The 'schema' field in the 'DEPENDENCIES' array must contain a validation schema.")
                    } else {
                        if (when) {
                            findNormalizedField.schema.value = toTypedSchema(dep.schema)
                        } else {
                            findNormalizedField.schema.value = findNormalizedField.defaultSchema
                        }
                    }
                })
        },
        {
            immediate: true,
        }
    )

    watch(
        () => dependencyConditions.value[DEPENDENCY_TYPE.SETS_OPTIONS],
        (when) => {
            filteredDependencies.value
                .filter((dep) => dep.type === DEPENDENCY_TYPE.SETS_OPTIONS)
                .forEach((dep) => {
                    const findNormalizedField = normalizeFields.value[dep.targetField]

                    if (when) {
                        findNormalizedField.options.value = dep.options
                    } else {
                        findNormalizedField.options.value = findNormalizedField.defaultOptions
                    }
                })
        },
        {
            immediate: true,
        }
    )
}
