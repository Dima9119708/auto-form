<script lang="ts" setup="">
import { AutoForm, DEPENDENCY_TYPE } from '@/auto-form'
import { Button } from '@/components/ui/button'
import { onSubmit } from '@/examples/on-submit'
import { z } from 'zod'

const schema = z.object({
    age: z.number(),
    parentsAllowed: z.boolean().optional(),
    vegetarian: z.boolean().optional(),
    mealOptions: z.enum(['Pasta', 'Salad', 'Beef Wellington']).optional(),
})
</script>

<template>
    <h2 class="text-xl text-center">FORM XL 4</h2>

    <AutoForm
        :schema="schema"
        @submit="onSubmit"
        :field-config="{
            age: {
                description: 'Setting this below 18 will require parents consent.',
            },
            parentsAllowed: {
                label: 'Did your parents allow you to register?',
            },
            vegetarian: {
                label: 'Are you a vegetarian?',
                description: 'Setting this to true will remove non-vegetarian food options.',
            },
            mealOptions: {
                component: 'radio',
            },
        }"
        :dependencies="[
            {
                sourceField: 'age',
                type: DEPENDENCY_TYPE.HIDES,
                targetField: 'parentsAllowed',
                when: (age) => age >= 18,
            },
            {
                sourceField: 'age',
                type: DEPENDENCY_TYPE.REQUIRES,
                targetField: 'parentsAllowed',
                when: (age) => age < 18,
                schema: z.boolean(),
            },
            {
                sourceField: 'vegetarian',
                type: DEPENDENCY_TYPE.SETS_OPTIONS,
                targetField: 'mealOptions',
                when: (vegetarian) => vegetarian,
                options: ['Pasta', 'Salad'],
            },
        ]"
    >
        <Button type="submit"> Submit </Button>
    </AutoForm>
</template>

<style scoped></style>
