<script setup lang="ts">
import AutoFormField from '@/auto-form/auto-form-field.vue'
import CustomAutoForm from '@/auto-form/auto-form.vue'
import { Button } from '@/components/ui/button'
import { z } from 'zod'

enum Sports {
    Football = 'Football/Soccer',
    Basketball = 'Basketball',
    Baseball = 'Baseball',
    Hockey = 'Hockey (Ice)',
    None = "I don't like sports",
}

const formSchema = z.object({
    username: z
        .string({
            required_error: 'Username is required.',
        })
        .min(2, {
            message: 'Username must be at least 2 characters.',
        }),

    password: z
        .string({
            required_error: 'Password is required.',
        })
        .min(8, {
            message: 'Password must be at least 8 characters.',
        }),

    favouriteNumber: z.coerce
        .number({
            invalid_type_error: 'Favourite number must be a number.',
        })
        .min(1, {
            message: 'Favourite number must be at least 1.',
        })
        .max(10, {
            message: 'Favourite number must be at most 10.',
        })
        .default(1)
        .optional(),

    acceptTerms: z.boolean().refine((value) => value, {
        message: 'You must accept the terms and conditions.',
        path: ['acceptTerms'],
    }),

    sendMeMails: z.boolean().optional(),

    birthday: z.coerce.date().optional(),

    color: z.enum(['red', 'green', 'blue']).optional().default('blue'),

    marshmallows: z.enum(['not many', 'a few', 'a lot', 'too many']),

    sports: z.nativeEnum(Sports).describe('What is your favourite sport?'),

    bio: z
        .string()
        .min(10, {
            message: 'Bio must be at least 10 characters.',
        })
        .max(160, {
            message: 'Bio must not be longer than 30 characters.',
        })
        .optional(),

    customParent: z.string().optional(),

    invitedGuests: z
        .array(z.object({ name: z.string() }))
        .describe('Guests invited to the party')
        .optional(),

    subObject: z.object({
        subField: z.string(),
        numberField: z.number().default(1),

        subSubObject: z
            .object({
                subSubField: z.string(),
                aaa: z
                    .array(
                        z.object({
                            name1: z.string(),
                            name2: z.number(),
                        })
                    )
                    .nonempty(),
            })
            .describe('Sub Sub Object Description'),
    }),
    optionalSubObject: z
        .object({
            optionalSubField: z.string(),
            otherOptionalSubField: z.string(),
        })
        .optional(),
    age: z.number(),
    parentsAllowed: z.boolean().optional(),
    vegetarian: z.boolean().optional(),
    mealOptions: z.enum(['Pasta', 'Salad', 'Beef Wellington']).optional(),
})
</script>

<template>
    <CustomAutoForm
        :field-config="{
            ['invitedGuests[index]']: {},
            'subObject.subSubObject.aaa[index].name1': {
                label: 'subObject.subSubObject.aaa[index].name1',
            },
        }"
        :schema="formSchema"
        :dependencies="[
            {
                sourceField: 'sendMeMails',
                type: 'HIDES',
                targetField: 'subObject',
                when: (sendMeMails) => sendMeMails === true,
            },
            {
                sourceField: 'sendMeMails',
                type: 'DISABLES',
                targetField: 'acceptTerms',
                when: (sendMeMails) => sendMeMails === true,
            },
            {
                sourceField: 'sendMeMails',
                type: 'DISABLES',
                targetField: 'invitedGuests',
                when: (sendMeMails) => sendMeMails === true,
            },
            {
                sourceField: 'vegetarian',
                type: 'SETS_OPTIONS',
                targetField: 'mealOptions',
                when: (vegetarian, mealOption) => vegetarian && mealOption !== 'Beef Wellington',
                options: ['Pasta', 'Salad'],
            },
            {
                sourceField: 'age',
                type: 'HIDES',
                targetField: 'parentsAllowed',
                when: (age) => age >= 18,
            },
            {
                sourceField: 'age',
                type: 'REQUIRES',
                targetField: 'parentsAllowed',
                schema: z.boolean(),
                when: (age) => age < 18,
            },
        ]"
    >
        <template #acceptTerms="slotProps">
            <div>
                <AutoFormField v-bind="slotProps" />
                <div class="!mt-2 text-sm">I agree to the <button class="text-primary underline">terms and conditions</button>.</div>
            </div>
        </template>

        <template #customParent="slotProps">
            <div class="flex items-end space-x-2">
                <AutoFormField
                    v-bind="slotProps"
                    class="w-full"
                />
                <Button type="button"> Check </Button>
            </div>
        </template>

        <Button type="submit"> Send </Button>
    </CustomAutoForm>
</template>

<style scoped></style>
