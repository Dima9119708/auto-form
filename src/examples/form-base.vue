<script setup>
import { AutoForm, DEPENDENCY_TYPE } from '@/auto-form'
import { Button } from '@/components/ui/button'
import { onSubmit } from '@/examples/on-submit'
import { z } from 'zod'

const countriesRequiringRegion = ['USA', 'Canada', 'Germany', 'Australia']

const baseFormSchema = z.object({
    userInfo: z.object({
        name: z.string().min(1, { message: 'Name is required' }),
        age: z.number().min(18, { message: 'Age must be at least 18' }),
    }),
    address: z.object({
        country: z.enum(['USA', 'Canada', 'Germany', 'France', 'UK', 'Australia', 'Japan'], { required_error: 'Country is required' }),
        region: z.string().optional(),
    }),
})
</script>

<template>
    <h2 class="text-xl text-center">FORM BASE</h2>

    <AutoForm
        :schema="baseFormSchema"
        @submit="onSubmit"
        :field-config="{
            'userInfo.name': { label: 'Full Name', description: 'Enter your full name' },
            'userInfo.age': { label: 'Age', description: 'Enter your age' },
            'address.country': { label: 'Country', description: 'Select your country' },
            'address.region': { label: 'Region', description: 'Select your region' },
        }"
        :dependencies="[
            {
                sourceField: 'address.country',
                type: DEPENDENCY_TYPE.REQUIRES,
                targetField: 'address.region',
                when: (country) => countriesRequiringRegion.includes(country),
                schema: z.string(),
            },
        ]"
    >
        <Button type="submit"> Send </Button>
    </AutoForm>
</template>

<style scoped></style>
