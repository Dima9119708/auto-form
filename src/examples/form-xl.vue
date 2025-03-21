<script setup lang="ts">
import { AutoForm, DEPENDENCY_TYPE } from '@/auto-form'
import { Button } from '@/components/ui/button'
import { onSubmit } from '@/examples/on-submit'
import { z } from 'zod'

enum accountingMethodEnum {
    Cash = 'Cash',
    Credit = 'Credit',
    BankTransfer = 'BankTransfer',
}

const formSchema = z.object({
    firstName: z.string().min(1, 'First name is required.'),
    lastName: z.string().min(1, 'Last name is required.'),
    address: z.string(),
    country: z.enum(['USA', 'Canada', 'Germany', 'UK']).optional(),
    paymentMethod: z.nativeEnum(accountingMethodEnum).optional(),
    creditDetails: z.string().optional(),
    accountingMethod: z.nativeEnum(accountingMethodEnum).optional(),
    taxId: z.string().optional(),
})
</script>

<template>
    <h2 class="text-xl text-center">FORM XL</h2>

    <AutoForm
        :schema="formSchema"
        @submit="onSubmit"
        :field-config="{
            firstName: {
                label: 'First Name',
                description: 'Enter your first name.',
            },
            lastName: {
                label: 'Last Name',
                description: 'Enter your last name.',
            },
            address: {
                label: 'Billing Address',
                description: 'Enter your billing address.',
            },
            country: {
                label: 'Country',
                description: 'Select your country.',
            },
            paymentMethod: {
                label: 'Payment Method',
                description: 'Select your payment method.',
            },
            creditDetails: {
                label: 'Credit Card Details',
                description: 'Enter your credit card details (if selected).',
            },
            accountingMethod: {
                label: 'Accounting Method',
                description: 'Select your preferred accounting method.',
            },
            taxId: {
                label: 'Tax Identification Number',
                description: 'Enter your Tax ID (if applicable).',
            },
        }"
        :dependencies="[
            {
                sourceField: 'country',
                type: DEPENDENCY_TYPE.REQUIRES,
                targetField: 'taxId',
                when: (country) => country === 'Canada',
                schema: z.string(),
            },
            {
                sourceField: 'accountingMethod',
                type: DEPENDENCY_TYPE.REQUIRES,
                targetField: 'taxId',
                when: (accountingMethod) => accountingMethod === accountingMethodEnum.BankTransfer,
                schema: z.string(),
            },
        ]"
    >
        <Button type="submit"> Send </Button>
    </AutoForm>
</template>

<style scoped></style>
