<script setup lang="ts">
import { AutoForm, DEPENDENCY_TYPE } from '@/auto-form'
import { Button } from '@/components/ui/button'
import { onSubmit } from '@/examples/on-submit'
import { z } from 'zod'

enum DeliveryMethod {
    Standard = 'Standard',
    Express = 'Express',
}

const countriesRequiringRegion = ['USA', 'Canada']

const formSchema = z.object({
    userInfo: z.object({
        firstName: z.string().min(1, { message: 'First name is required' }),
        lastName: z.string().min(1, { message: 'Last name is required' }),
        dateOfBirth: z.coerce.date().min(new Date('1900-01-01'), { message: 'Invalid date of birth' }),
    }),

    address: z.object({
        country: z.enum(['USA', 'Canada', 'Germany', 'France', 'UK', 'Australia', 'Japan'], { required_error: 'Country is required' }),
        region: z.string().min(1, { message: 'Region is required if country is USA or Canada' }).optional(),
        streetAddress: z.string().min(1, { message: 'Street address is required' }),
    }),

    contactInfo: z.object({
        phoneNumber: z.string().regex(/^[0-9]{10}$/, { message: 'Phone number must be 10 digits' }),
        email: z.string().email({ message: 'Invalid email format' }),
    }),

    deliveryMethod: z.nativeEnum(DeliveryMethod, { required_error: 'Delivery method is required' }),

    orderDate: z.coerce.date().min(new Date(), { message: 'Order date cannot be in the past' }),

    giftOption: z.boolean().optional(),

    deliveryDate: z.coerce.date().optional(),
})
</script>

<template>
    <h2 class="text-xl text-center">FORM LARGE</h2>

    <AutoForm
        :schema="formSchema"
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
            {
                sourceField: 'deliveryMethod',
                type: DEPENDENCY_TYPE.REQUIRES,
                targetField: 'deliveryDate',
                when: (deliveryMethod) => deliveryMethod === 'Express',
                schema: z.coerce.date(),
            },
        ]"
    >
        <Button type="submit"> Send </Button>
    </AutoForm>
</template>

<style scoped></style>
