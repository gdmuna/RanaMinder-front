<template>
    <Form v-slot="{ handleSubmit, resetForm }" :initial-values="initialValues" keep-values
        :validation-schema="formSchema">
        <Dialog v-model:open="dialogOpen">
            <DialogContent class="sm:max-w-[425px] select-none">
                <DialogHeader>
                    <DialogTitle>发送结果邮件</DialogTitle>
                    <DialogDescription>将向 {{ checkedIds.length }} 位面试者发送邮件</DialogDescription>
                </DialogHeader>
                <form id="dialogForm" @submit="handleSubmit($event, (vals) => onSubmit(vals, resetForm))">
                    <FormField v-slot="{ componentField }" name="subject">
                        <FormItem>
                            <FormLabel>邮件标题</FormLabel>
                            <FormControl class="mt-[0.2rem]">
                                <textarea type="text" placeholder="点击输入邮件标题..." v-bind="componentField"
                                    class="border-0 shadow-0 rounded-lg w-full h-15 p-2 resize-none dark:bg-[#121212]" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                    <FormField v-slot="{ componentField }" name="content">
                        <FormItem class="mt-4">
                            <FormLabel>邮件内容</FormLabel>
                            <FormControl class="mt-[0.2rem]">
                                <textarea placeholder="点击输入邮件内容..." v-bind="componentField"
                                    class="border-0 shadow-0 rounded-lg w-full h-30 p-2 resize-none dark:bg-[#121212]"></textarea>
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
                        <Button type="submit" form="dialogForm" class="cursor-pointer" :disabled="isSubmitting">
                            {{ isSubmitting ? '发送中...' : '发送' }}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </Form>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
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
import { useInterviewStore } from "@/stores/interview"

const props = defineProps<{ 
    open: boolean,
    checkedIds: string[]
}>()

const emit = defineEmits(['update:open'])
const dialogOpen = ref(props.open)
const isSubmitting = ref(false)
const interviewStore = useInterviewStore()

// 初始值包含邮件标题和内容
const initialValues = { 
    subject: '', 
    content: ''
}

watch(() => props.open, val => dialogOpen.value = val)
watch(dialogOpen, val => {
    emit('update:open', val)
})

// 表单验证规则
const formSchema = toTypedSchema(z.object({
    subject: z.string({ required_error: "请输入邮件标题" })
        .min(1, "请输入邮件标题")
        .max(50, "标题不能超过50个字符"),
    content: z.string({ required_error: "请输入邮件内容" })
        .min(1, "请输入邮件内容")
}))

// 发送邮件
async function onSubmit(values: any, resetForm: Function) {
    console.log('发送邮件表单提交，值:', values);
    console.log('当前选中的ID列表:', props.checkedIds);
    
    if (props.checkedIds.length === 0) {
        toast.error("请先选择至少一位面试者");
        return;
    }

    try {
        isSubmitting.value = true;
        
        // 为每个选中的ID发送邮件
        for (const resultId of props.checkedIds) {
            console.log('正在发送邮件到ID:', resultId);
            await interviewStore.sendResultEmail({
                resultId,
                subject: values.subject,
                content: values.content
            });
            console.log('邮件发送成功:', resultId);
        }
        
        toast.success(`已成功向 ${props.checkedIds.length} 位面试者发送邮件`);
        dialogOpen.value = false;
        resetForm();
    } catch (error: any) {
        console.error('发送邮件失败详情:', error);
        toast.error(error?.data?.message || '发送邮件失败');
    } finally {
        isSubmitting.value = false;
    }
}
</script>