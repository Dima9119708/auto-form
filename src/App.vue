<script setup lang="ts">
import Toaster from '@/components/ui/toast/Toaster.vue'
import FormBASE from '@/examples/form-base.vue'
import FormLARGE from '@/examples/form-lg.vue'
import FormSM from '@/examples/form-sm.vue'
import FormXL2 from '@/examples/form-xl2.vue'
import FormXL3 from '@/examples/form-xl3.vue'
import FormXL4 from '@/examples/form-xl4.vue'
import FormXL from '@/examples/form-xl.vue'
import FormXS from '@/examples/form-xs.vue'

const examples = [FormXS, FormSM, FormBASE, FormLARGE, FormXL, FormXL2, FormXL3, FormXL4]
</script>

<template>
    <Toaster />
    <div
        v-for="example in examples"
        class="mb-5 border-2 p-6 rounded-md min-w-[500px]"
    >
        <component :is="example" />
    </div>
</template>

<style scoped></style>
