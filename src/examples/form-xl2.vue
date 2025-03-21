<script setup="">
import { AutoForm, DEPENDENCY_TYPE } from '@/auto-form'
import { Button } from '@/components/ui/button'
import { onSubmit } from '@/examples/on-submit'
import { z } from 'zod'

const additionalInfo = z.object({
    assignee: z.string().optional(), // Назначенный человек
    statusDependentInfo: z.string().optional(), // Дополнительная информация, зависящая от статуса
})

const schema = z.object({
    title: z.string().min(1, 'Title is required'), // Название задачи
    description: z.string().optional(), // Описание задачи
    status: z.enum(['todo', 'in-progress', 'completed']), // Статус задачи
    dueDate: z.coerce.date().optional(), // Дата выполнения задачи

    tags: z.array(z.string()).min(0).max(5), // Теги — динамический массив
    priority: z.enum(['low', 'medium', 'high']), // Приоритет задачи

    responsible: z.string().optional(), // Ответственный за задачу

    dependencies: z.array(z.string()).optional(), // Зависимости задачи, динамический массив

    additionalInfo: additionalInfo,

    comment: z.string().optional(), // Комментарий
})
</script>

<template>
    <h2 class="text-xl text-center">FORM XL 2</h2>

    <AutoForm
        :schema="schema"
        @submit="onSubmit"
        :field-config="{
            'tags[index]': {
                label: 'Tag',
            },
        }"
        :dependencies="[
            {
                sourceField: 'status',
                type: DEPENDENCY_TYPE.REQUIRES,
                targetField: 'dueDate',
                when: (status) => status !== 'completed',
                schema: z.coerce.date(),
            },
            {
                sourceField: 'status',
                type: DEPENDENCY_TYPE.REQUIRES,
                targetField: 'responsible',
                when: (status) => status === 'completed',
                schema: z.string(),
            },
            {
                sourceField: 'status',
                type: DEPENDENCY_TYPE.REQUIRES,
                targetField: 'additionalInfo',
                when: (status) => status === 'completed',
                schema: additionalInfo.required(),
            },
            {
                sourceField: 'priority',
                type: DEPENDENCY_TYPE.HIDES,
                targetField: 'comment',
                when: (priority) => priority === 'low',
            },
        ]"
    >
        <Button type="submit"> Send </Button>
    </AutoForm>
</template>

<style scoped></style>
