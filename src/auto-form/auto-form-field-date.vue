<script setup>
import { cn } from '../lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { DateFormatter, getLocalTimeZone } from '@internationalized/date'
import { CalendarIcon } from 'lucide-vue-next'
import { Field } from 'vee-validate'

defineOptions({
    inheritAttrs: false,
})
const { path, inputProps, disabled, field } = defineProps({
    path: String,
    inputProps: {
        type: Object,
        required: false,
    },
    defaultValue: {
        type: Function,
        required: false,
    },
    ruleSchema: {
        type: Object,
        required: false,
    },
    field: Object,
    disabled: Boolean,
})

const df = new DateFormatter('en-US', {
    dateStyle: 'long',
})
</script>

<template>
    <div class="flex flex-col">
        <slot name="label" />
        <Popover>
            <PopoverTrigger as-child>
                <Button
                    :disabled
                    variant="outline"
                    :class="cn('justify-start text-left font-normal', !field.value && 'text-muted-foreground')"
                >
                    <CalendarIcon class="mr-2 h-4 w-4" />
                    {{ field.value ? df.format(field.value?.toDate(getLocalTimeZone())) : inputProps?.placeholder }}
                </Button>
            </PopoverTrigger>
            <PopoverContent class="w-auto p-0">
                <Calendar
                    :model-value="field.value"
                    @update:model-value="field.handleChange"
                />
            </PopoverContent>
        </Popover>

        <slot name="description" />

        <slot name="error" />
    </div>
</template>
