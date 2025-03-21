<script setup="">
import { AutoForm } from '@/auto-form/index.js'
import { Button } from '@/components/ui/button/index.js'
import { onSubmit } from '@/examples/on-submit.js'
import { z } from 'zod'

const smFormSchema = z.object({
    name: z.string().min(1, { message: 'Name is required' }), // String field, required
    age: z.number().min(18, { message: 'Age must be at least 18' }).optional(), // Number field, optional, if provided, must be at least 18
    isAdmin: z.boolean(), // Boolean field, indicates if user is an admin
    registrationDate: z.coerce.date().optional(), // Date field, optional
    additionalInfo: z.string().max(500).optional(), // String field, optional, with max length of 500
})
</script>

<template>
    <h2 class="text-xl text-center">FORM SM</h2>

    <AutoForm
        :schema="smFormSchema"
        @submit="onSubmit"
        :field-config="{
            isAdmin: {
                label: 'Admin',
            },
        }"
    >
        <Button type="submit"> Send </Button>
    </AutoForm>
</template>

<style scoped></style>
