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
                                <textarea type="text" placeholder="请输入邮件标题..." v-bind="componentField"
                                    class="border-0 shadow-0 rounded-lg w-full h-15 p-2 resize-none dark:bg-[#121212]" />
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
    checkedIds: string[],
    campaignId: number
}>()

const emit = defineEmits(['update:open'])
const dialogOpen = ref(props.open)
const isSubmitting = ref(false)
const interviewStore = useInterviewStore()

// 邮件标题
const initialValues = { 
    subject: ''
}

watch(() => props.open, val => dialogOpen.value = val)
watch(dialogOpen, val => {
    emit('update:open', val)
})

// 表单验证规则
const formSchema = toTypedSchema(z.object({
    subject: z.string({ required_error: "请输入邮件标题" })
        .min(1, "请输入邮件标题")
        .max(50, "标题不能超过50个字符")
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
        const campaignId = props.campaignId;
        if (!campaignId) {
            toast.error('未传递活动ID');
            isSubmitting.value = false;
            return;
        }
        
        console.log('发送邮件前的值:', values);
        
        // 收集所有用户的 resultId
        const resultIds: string[] = [];
        const userErrors: string[] = [];
        
        // 为每个选中的用户ID获取对应的resultId
        for (const userId of props.checkedIds) {
            try {
                // 获取 resultId
                const res = await interviewStore.getInterviewResult(userId, campaignId);
                const r = res as any;
                
                if (r && r.data && Array.isArray(r.data.results) && r.data.results.length > 0) {
                    const resultId = r.data.results[0].id;
                    if (resultId) {
                        resultIds.push(resultId);
                    } else {
                        userErrors.push(userId);
                    }
                } else {
                    userErrors.push(userId);
                }
            } catch (error) {
                console.error(`获取用户 ${userId} 的面试结果失败:`, error);
                userErrors.push(userId);
            }
        }
        
        // 检查是否有找到有效的 resultId
        if (resultIds.length === 0) {
            toast.error('未找到任何有效的面试结果ID');
            isSubmitting.value = false;
            return;
        }
        
        // 使用数组格式一次性发送邮件
        console.log('正在使用resultIds数组发送邮件:', resultIds);
        await interviewStore.sendResultEmail({
            resultId: resultIds,
            subject: values.subject
        });
        
        // 显示成功和失败的统计
        if (userErrors.length > 0) {
            toast.warning(`成功向 ${resultIds.length} 位面试者发送邮件，${userErrors.length} 位面试者未找到结果`);
        } else {
            toast.success(`已成功向 ${resultIds.length} 位面试者发送邮件`);
        }
        
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