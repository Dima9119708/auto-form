<script lang="ts" setup="">
import { AutoForm, AutoFormField } from '@/auto-form'
import { Button } from '@/components/ui/button'
import { onSubmit } from '@/examples/on-submit'
import { z } from 'zod'

enum Sports {
    Football = 'Football/Soccer',
    Basketball = 'Basketball',
    Baseball = 'Baseball',
    Hockey = 'Hockey (Ice)',
    None = "I don't like sports",
}

const schema = z.object({
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

    color: z.enum(['red', 'green', 'blue']).optional(),

    // Another enum example
    marshmallows: z.enum(['not many', 'a few', 'a lot', 'too many']),

    // Native enum example
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
})
</script>

<template>
    <h2 class="text-xl text-center">FORM XL 3</h2>

    <AutoForm
        :schema="schema"
        @submit="onSubmit"
        :field-config="{
            password: {
                label: 'Your secure password',
                inputProps: {
                    type: 'password',
                    placeholder: '••••••••',
                },
            },
            favouriteNumber: {
                description: 'Your favourite number between 1 and 10.',
            },
            acceptTerms: {
                label: 'Accept terms and conditions.',
            },

            birthday: {
                description: 'We need your birthday to send you a gift.',
            },

            sendMeMails: {
                component: 'switch',
            },

            bio: {
                component: 'textarea',
            },

            marshmallows: {
                label: 'How many marshmallows fit in your mouth?',
                component: 'radio',
            },
        }"
    >
        <template #acceptTerms="slotProps">
            <div>
                <AutoFormField v-bind="slotProps" />
                <div class="!mt-2 text-sm">I agree to the <button class="text-primary underline">terms and conditions</button>.</div>
            </div>
        </template>

        <template #customParent="slotProps">
            <div class="flex items-end w-full space-x-2">
                <AutoFormField
                    v-bind="slotProps"
                    class="w-full"
                />
                <Button type="button"> Check </Button>
            </div>
        </template>

        <Button type="submit"> Submit </Button>
    </AutoForm>
</template>

<style scoped></style>
