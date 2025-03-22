import { DEPENDENCY_TYPE } from '@/auto-form/constants'
import { getFromPath } from '@/auto-form/utils'
import { useFormValues } from 'vee-validate'
import { computed, inject } from 'vue'

export const useDependencies = (path, defaultRequired, defaultSchema, defaultOptions) => {
    const dependencies = inject('DEPENDENCIES')

    const values = useFormValues()

    const targetDependencies = computed(() => dependencies.filter((dep) => dep.targetField === path))

    const evaluatedConditions = computed(() => {
        return targetDependencies.value.reduce(
            (acc, dep) => {
                const sourceValue = getFromPath(values.value, dep.sourceField)

                if (!dep.immediate && sourceValue === undefined) {
                    return acc
                }

                if (dep.type === DEPENDENCY_TYPE.HIDES) {
                    acc[dep.type] = acc[dep.type] || dep.when(sourceValue)
                } else if (dep.type === DEPENDENCY_TYPE.DISABLES) {
                    acc[dep.type] = acc[dep.type] || dep.when(sourceValue)
                } else if (dep.type === DEPENDENCY_TYPE.REQUIRES) {
                    acc[dep.type].push({ when: dep.when(sourceValue), schema: dep.schema })
                } else if (dep.type === DEPENDENCY_TYPE.SETS_OPTIONS) {
                    acc[dep.type].push({ when: dep.when(sourceValue), options: dep.options })
                }

                return acc
            },
            {
                [DEPENDENCY_TYPE.HIDES]: false,
                [DEPENDENCY_TYPE.DISABLES]: false,
                [DEPENDENCY_TYPE.REQUIRES]: [],
                [DEPENDENCY_TYPE.SETS_OPTIONS]: [],
            }
        )
    })

    const hide = computed(() => evaluatedConditions.value[DEPENDENCY_TYPE.HIDES])
    const disabled = computed(() => evaluatedConditions.value[DEPENDENCY_TYPE.DISABLES])

    const overrideRequiredAndSchema = computed(() => {
        const requires = evaluatedConditions.value[DEPENDENCY_TYPE.REQUIRES]

        const activeRequire = requires.find((req) => req.when)

        if (activeRequire) {
            console.log('activeRequire =>', activeRequire)
            return {
                required: true,
                schema: activeRequire.schema,
            }
        } else {
            return {
                required: defaultRequired,
                schema: defaultSchema,
            }
        }
    })

    const overrideOptions = computed(() => {
        const setsOptions = evaluatedConditions.value[DEPENDENCY_TYPE.SETS_OPTIONS]

        const activeSetsOptions = setsOptions.find((so) => so.when)

        if (activeSetsOptions) {
            return activeSetsOptions.options
        } else {
            return defaultOptions
        }
    })

    return {
        hide,
        disabled,
        overrideRequiredAndSchema,
        overrideOptions,
    }
}
