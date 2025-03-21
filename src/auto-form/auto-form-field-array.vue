<script setup="">
import AutoFormField from '@/auto-form/auto-form-field.vue'
import { Button } from '@/components/ui/button'
import { FieldArray } from 'vee-validate'
import { computed } from 'vue'

defineOptions({
    inheritAttrs: false,
})

const { path, children, field, disabled } = defineProps({
    path: String,
    children: Array,
    field: Object,
    disabled: Boolean,
})

const isChildrenPrimitive = computed(() => children[0].path === null)
</script>

<template>
    <FieldArray
        :name="path"
        v-slot="{ fields, push, remove }"
    >
        <div class="grid gap-2.5 relative">
            <div
                v-if="disabled"
                class="absolute inset-0 cursor-not-allowed bg-[hsl(var(--muted-foreground)/0.1)] rounded-sm"
            />
            <slot name="label" />

            <div
                v-if="!fields.length"
                class="text-center bg-muted p-2 rounded-md"
            >
                The list is empty
            </div>
            <div
                v-for="(field, idx) in fields"
                :key="field.key"
                class="grid gap-3"
            >
                <AutoFormField
                    v-for="(child, childIdx) in children"
                    :key="isChildrenPrimitive ? child.path : childIdx"
                    v-bind="child"
                    :path="isChildrenPrimitive ? `${path}[${idx}]` : `${path}[${idx}].${child.path}`"
                />
                <div class="flex justify-end">
                    <Button
                        :disabled
                        type="button"
                        variant="destructive"
                        @click="remove(idx)"
                    >
                        Remove
                    </Button>
                </div>
            </div>
            <div class="flex items-center gap-3 justify-start">
                <Button
                    type="button"
                    variant="secondary"
                    @click="push(isChildrenPrimitive ? undefined : {})"
                >
                    Add
                </Button>
                <slot name="error" />
            </div>
        </div>
    </FieldArray>
</template>

<style scoped></style>
