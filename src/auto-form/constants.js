import AutoFormFieldArray from './auto-form-field-array.vue'
import AutoFormFieldBoolean from './auto-form-field-boolean.vue'
import AutoFormFieldDate from './auto-form-field-date.vue'
import AutoFormFieldEnum from './auto-form-field-enum.vue'
import AutoFormFieldInput from './auto-form-field-input.vue'
import AutoFormFieldNumber from './auto-form-field-number.vue'
import AutoFormFieldObject from './auto-form-field-object.vue'

export const ZOD_TYPES = {
    ZodString: 'ZodString',
    ZodBoolean: 'ZodBoolean',
    ZodDate: 'ZodDate',
    ZodEnum: 'ZodEnum',
    ZodNativeEnum: 'ZodNativeEnum',
    ZodNumber: 'ZodNumber',
    ZodArray: 'ZodArray',
    ZodObject: 'ZodObject',
    ZodDefault: 'ZodDefault',
    ZodOptional: 'ZodOptional',
}

export const FIELD_COMPONENTS_MAP = {
    date: AutoFormFieldDate,
    select: AutoFormFieldEnum,
    radio: AutoFormFieldEnum,
    checkbox: AutoFormFieldBoolean,
    switch: AutoFormFieldBoolean,
    textarea: AutoFormFieldInput,
    number: AutoFormFieldNumber,
    input: AutoFormFieldInput,
    array: AutoFormFieldArray,
    object: AutoFormFieldObject,
}

export const ZOD_TYPE_TO_FIELD = {
    [ZOD_TYPES.ZodString]: 'input',
    [ZOD_TYPES.ZodBoolean]: 'checkbox',
    [ZOD_TYPES.ZodDate]: 'date',
    [ZOD_TYPES.ZodEnum]: 'select',
    [ZOD_TYPES.ZodNativeEnum]: 'select',
    [ZOD_TYPES.ZodNumber]: 'number',
    [ZOD_TYPES.ZodArray]: 'array',
    [ZOD_TYPES.ZodObject]: 'object',
}

export const DEPENDENCY_TYPE = {
    DISABLES: 'DISABLES',
    REQUIRES: 'REQUIRES',
    HIDES: 'HIDES',
    SETS_OPTIONS: 'SETS_OPTIONS',
}
