import { DEPENDENCY_TYPE } from '@/auto-form/constants.js'
import { findByNestedFullPath, getFromPath } from '@/auto-form/utils.js'
import { toTypedSchema } from '@vee-validate/zod'
import { useFormValues } from 'vee-validate'
import { computed, inject, watch } from 'vue'

export const useDependencies = (path) => {
    const dependencies = inject('DEPENDENCIES')
    const normalizeSchema = inject('NORMALIZE_SCHEMA')

    const values = useFormValues()

    const sourceDependencies = computed(() => dependencies.filter((dep) => dep.sourceField === path))

    const targetDependencies = computed(() => {
        const groupedDependencies = dependencies.reduce((acc, dep) => {
            if (acc[dep.targetField]) {
                acc[dep.targetField] = [...acc[dep.targetField], dep]
            } else {
                acc[dep.targetField] = [dep]
            }
            return acc
        }, {})

        return sourceDependencies.value.map((dep) => groupedDependencies[dep.targetField]).flat()
    })

    const normalizedTargetFields = computed(() =>
        sourceDependencies.value.reduce((acc, dep) => {
            acc[dep.targetField] = findByNestedFullPath(normalizeSchema.value, dep.targetField)

            return acc
        }, {})
    )

    const evaluatedConditions = computed(() => {
        return targetDependencies.value.reduce(
            (acc, dep) => {
                const sourceValue = getFromPath(values.value, dep.sourceField)

                if (!dep.immediate) {
                    if (sourceValue === undefined) {
                        return acc
                    }
                }

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
            },
            {
                [DEPENDENCY_TYPE.HIDES]: false,
                [DEPENDENCY_TYPE.DISABLES]: false,
                [DEPENDENCY_TYPE.REQUIRES]: false,
                [DEPENDENCY_TYPE.SETS_OPTIONS]: false,
            }
        )
    })

    watch(
        () => evaluatedConditions.value[DEPENDENCY_TYPE.HIDES],
        (when) => {
            sourceDependencies.value
                .filter((dep) => dep.type === DEPENDENCY_TYPE.HIDES)
                .forEach((dep) => {
                    const findNormalizedField = normalizedTargetFields.value[dep.targetField]

                    findNormalizedField.hide.value = when
                })
        },
        {
            immediate: true,
        }
    )

    watch(
        () => evaluatedConditions.value[DEPENDENCY_TYPE.DISABLES],
        (when) => {
            sourceDependencies.value
                .filter((dep) => dep.type === DEPENDENCY_TYPE.DISABLES)
                .forEach((dep) => {
                    const findNormalizedField = normalizedTargetFields.value[dep.targetField]

                    findNormalizedField.disabled.value = when
                    findNormalizedField.required.value = !when
                })
        },
        {
            immediate: true,
        }
    )

    watch(
        () => evaluatedConditions.value[DEPENDENCY_TYPE.REQUIRES],
        (when) => {
            sourceDependencies.value
                .filter((dep) => dep.type === DEPENDENCY_TYPE.REQUIRES)
                .forEach((dep) => {
                    const findNormalizedField = normalizedTargetFields.value[dep.targetField]

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
        () => evaluatedConditions.value[DEPENDENCY_TYPE.SETS_OPTIONS],
        (when) => {
            sourceDependencies.value
                .filter((dep) => dep.type === DEPENDENCY_TYPE.SETS_OPTIONS)
                .forEach((dep) => {
                    const findNormalizedField = normalizedTargetFields.value[dep.targetField]

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
