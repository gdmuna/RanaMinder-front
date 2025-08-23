<template>
    <Form v-slot="{ handleSubmit, resetForm }" :initial-values="initialValues" keep-values
        :validation-schema="formSchema">
        <Dialog v-model:open="dialogOpen">
            <DialogContent class="sm:max-w-[425px] select-none">
                <DialogHeader>
                    <DialogTitle>发送结果邮件</DialogTitle>
                    <DialogDescription>请输入邮件标题</DialogDescription>
                </DialogHeader>
                <form id="dialogForm" @submit="handleSubmit($event, (vals) => onSubmit(vals, resetForm))">
                    <FormField v-slot="{ componentField }" name="title">
                        <FormItem>
                            <FormLabel>邮件标题</FormLabel>
                            <FormControl class="mt-[0.2rem]">
                                <Input type="text" placeholder="点击输入 ..." v-bind="componentField"
                                    class="border-0 shadow-0 rounded-lg" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                </form>
                <DialogFooter>
                    <div class="gap-2 flex items-center w-full justify-between md:justify-end">
                        <Button type="button" variant="secondary" class="cursor-pointer"
                            @click="dialogOpen = false; resetForm()">
                            取消
                        </Button>
                        <Button type="submit" form="dialogForm" class="cursor-pointer">发送</Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </Form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { toTypedSchema } from "@vee-validate/zod"
import * as z from "zod"
import { h } from "vue"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "vue-sonner"

const props = defineProps<{ open: boolean }>()
const emit = defineEmits(['update:open'])
const dialogOpen = ref(props.open)
const initialValues = { title: '' }

watch(() => props.open, val => dialogOpen.value = val)
watch(dialogOpen, val => {
    emit('update:open', val)
})

const formSchema = toTypedSchema(z.object({
    title: z.string({ required_error: "请输入邮件标题" })
        .min(1, "请输入邮件标题")
        .max(50, "标题不能超过50个字符"),
}))

function onSubmit(values: any, resetForm: Function) {
    toast({
        title: "你提交的信息：",
        description: h("pre", { class: "mt-2 w-[340px] rounded-md bg-slate-950 p-4" }, h("code", { class: "text-black" }, JSON.stringify(values, null, 2))),
    })
    console.log(values);

    dialogOpen.value = false
    resetForm()
}
</script>