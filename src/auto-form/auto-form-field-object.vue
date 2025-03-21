<script setup>
import AutoFormField from '@/auto-form/auto-form-field.vue'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

const { path, children, schema, field, disabled } = defineProps({
    path: String,
    children: Array,
    field: Object,
    disabled: Boolean,
})
</script>

<template>
    <div>
        <Accordion
            type="single"
            class="w-full"
            collapsible
            :disabled
        >
            <AccordionItem
                :value="path"
                class="border-none"
            >
                <AccordionTrigger>
                    <div class="flex flex-col items-start">
                        <slot name="label" />

                        <slot name="description" />
                    </div>
                </AccordionTrigger>

                <AccordionContent class="grid gap-4 p-0">
                    <AutoFormField
                        v-for="child in children"
                        :key="`${path}.${child.path}`"
                        v-bind="child"
                        :path="`${path}.${child.path}`"
                    />
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    </div>
</template>

<style scoped></style>
