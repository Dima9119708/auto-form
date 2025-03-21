<script lang="ts" setup="">
import { AutoForm, DEPENDENCY_TYPE } from '@/auto-form'
import { Button } from '@/components/ui/button'
import { onSubmit } from '@/examples/on-submit'
import { z } from 'zod'

const schema = z.object({
    region: z.enum(['all', 'UK', 'Germany']).describe('Region').default('all'),
    pool: z.enum(['all', 'SPB-2', 'SPB-3', 'SPB-4']).describe('Pool').default('all'),
    gpu: z.enum(['RTX-3060', 'RTX-3070', 'RTX-3080']).describe('GPU'),
    cpu: z.enum(['Intel Core i9', 'Intel Core i7', 'Intel Core i5']).describe('CPU'),
    ram: z.enum(['32 GB', '16 GB', '8 GB']).describe('RAM'),
    disks: z.enum(['1 TB', '2 TB', '4 TB']).describe('Disks'),
    additionalNetworkInterfaceCards: z.array(
        z.enum([
            '2 × 1 GE + port to Internet 1 Gbit/s',
            '2 × 1 GE + port to Internet 10 Gbit/s',
            '4 × 1 GE + port to Internet 10 Gbit/s',
            '4 × 1 GE + port to Internet 100 Gbit/s',
        ])
    ),
    pciECards: z.array(z.enum(['Dallas Lock PCI-E Trusted Boot Module', 'Sobol PCI-E Trusted Boot Module'])),
    motherboard: z.enum(['Asus RS700A-E11-RS4U MB', 'Asus RS720A-E11-RS12 MB']).describe('Motherboard'),
    case: z.enum(['1U, 2 power supplies', '2U, 4 power supplies', '4U, 8 power supplies']).describe('Case'),
})
</script>

<template>
    <h2 class="text-xl text-center">FORM XL 4</h2>

    <AutoForm
        :schema="schema"
        @submit="onSubmit"
        :field-config="{}"
        :dependencies="[
            {
                sourceField: 'region',
                type: DEPENDENCY_TYPE.DISABLES,
                targetField: 'pool',
                when: (region) => region === 'all',
            },
            {
                sourceField: 'gpu',
                immediate: true,
                type: DEPENDENCY_TYPE.DISABLES,
                targetField: 'cpu',
                when: (gpu) => !gpu,
            },
            {
                sourceField: 'cpu',
                immediate: true,
                type: DEPENDENCY_TYPE.DISABLES,
                targetField: 'ram',
                when: (cpu) => !cpu,
            },
            {
                sourceField: 'ram',
                immediate: true,
                type: DEPENDENCY_TYPE.DISABLES,
                targetField: 'pciECards',
                when: (value) => !value,
            },
            {
                sourceField: 'ram',
                immediate: true,
                type: DEPENDENCY_TYPE.DISABLES,
                targetField: 'disks',
                when: (value) => !value,
            },
            {
                sourceField: 'ram',
                immediate: true,
                type: DEPENDENCY_TYPE.DISABLES,
                targetField: 'additionalNetworkInterfaceCards',
                when: (value) => !value,
            },
            {
                sourceField: 'ram',
                immediate: true,
                type: DEPENDENCY_TYPE.DISABLES,
                targetField: 'motherboard',
                when: (value) => !value,
            },
            {
                sourceField: 'motherboard',
                immediate: true,
                type: DEPENDENCY_TYPE.DISABLES,
                targetField: 'case',
                when: (value) => !value,
            },
        ]"
    >
        <Button type="submit"> Submit </Button>
    </AutoForm>
</template>

<style scoped></style>
