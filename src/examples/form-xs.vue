<script setup="">
import { AutoForm } from '@/auto-form'
import { Button } from '@/components/ui/button'
import { onSubmit } from '@/examples/on-submit'
import { z } from 'zod'

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
})
</script>

<template>
    <h2 class="text-xl text-center">FORM XS</h2>

    <AutoForm
        :schema="schema"
        @submit="onSubmit"
    >
        <Button type="submit"> Send </Button>
    </AutoForm>
</template>

<style scoped></style>
