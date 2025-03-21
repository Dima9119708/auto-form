import { ZOD_TYPES } from '@/auto-form/constants'

export function beautifyObjectName(string) {
    let output = string.replace(/\[\d+\]/g, '').replace(/([A-Z])/g, ' $1')
    output = output.charAt(0).toUpperCase() + output.slice(1)
    return output
}

export function getBaseSchema(schema) {
    if ('innerType' in schema._def) return getBaseSchema(schema._def.innerType)

    if ('schema' in schema._def) return getBaseSchema(schema._def.schema)

    return schema
}

export function getDefaultValueInZodStack(schema) {
    const typedSchema = schema

    if (typedSchema._def.typeName === ZOD_TYPES.ZodDefault) return typedSchema._def.defaultValue

    if ('innerType' in typedSchema._def) {
        return getDefaultValueInZodStack(typedSchema._def.innerType)
    }

    if ('schema' in typedSchema._def) {
        return getDefaultValueInZodStack(typedSchema._def.schema)
    }

    return undefined
}

export function getOptionalInZodStack(schema) {
    const typedSchema = schema

    if (typedSchema._def.typeName === ZOD_TYPES.ZodOptional) return true

    if ('innerType' in typedSchema._def) {
        return getOptionalInZodStack(typedSchema._def.innerType)
    }

    if ('schema' in typedSchema._def) {
        return getOptionalInZodStack(typedSchema._def.schema)
    }

    return false
}

export function isObject(obj) {
    return obj !== null && !!obj && typeof obj === 'object' && !Array.isArray(obj)
}

export function isArrayOfObjects(schema) {
    return schema._def?.type?._def?.typeName === ZOD_TYPES.ZodObject
}

export function findByNestedFullPath(array, path) {
    const pathParts = path.split('.')

    function traverse(currentArray, parts, index = 0) {
        if (index >= parts.length || !currentArray) {
            return undefined
        }

        const expectedFullPath = pathParts.slice(0, index + 1).join('.')

        const target = currentArray.find(
            (item) => item && typeof item === 'object' && 'fullPath' in item && item.fullPath === expectedFullPath
        )

        if (!target) {
            return undefined
        }

        if (index === parts.length - 1) {
            return target
        }

        if (Array.isArray(target.children)) {
            return traverse(target.children, parts, index + 1)
        }

        return undefined
    }

    return traverse(array, pathParts)
}

function isNotNestedPath(path) {
    return /^\[.+\]$/.test(path)
}

function isContainerValue(value) {
    return isObject(value) || Array.isArray(value)
}

function cleanupNonNestedPath(path) {
    if (isNotNestedPath(path)) return path.replace(/\[|\]/g, '')
    return path
}

export function getFromPath(object, path, fallback) {
    if (!object) return fallback

    if (isNotNestedPath(path)) {
        return object[cleanupNonNestedPath(path)] ?? fallback
    }

    return (path || '')
        .split(/\.|\[(\d+)\]/)
        .filter(Boolean)
        .reduce((acc, propKey) => {
            if (isContainerValue(acc) && propKey in acc) {
                return acc[propKey]
            }
            return fallback
        }, object)
}
