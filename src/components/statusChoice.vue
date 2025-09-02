<template>
    <Form v-slot="{ handleSubmit, resetForm }" :initial-values="initialValues" keep-values
        :validation-schema="formSchema">
        <Dialog v-model:open="dialogOpen">
            <DialogContent class="sm:max-w-[425px] select-none">
                <DialogHeader>
                    <DialogTitle class="text-2xl font-bold mb-[1rem]">修改面试状态</DialogTitle>
                    <DialogDescription>将为 {{ checkedIds.length }} 位面试者修改状态</DialogDescription>
                </DialogHeader>
                <form id="dialogForm" @submit="handleSubmit($event, (vals) => onSubmit(vals, resetForm))">
                    <!-- 状态选择 -->
                    <FormField v-slot="{ componentField }" name="status">
                        <FormItem>
                            <FormLabel>面试状态</FormLabel>
                            <FormControl class="mt-[0.2rem]">
                                <select v-bind="componentField"
                                    class="border rounded-lg w-full h-10 p-2 dark:bg-[#121212]">
                                    <option value="pending">待定</option>
                                    <option value="approved">通过</option>
                                    <option value="rejected">未通过</option>
                                </select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>


                    <!-- 协会选择 -->
                    <FormField v-slot="{ componentField }" name="association">
                        <FormItem class="mt-4">
                            <FormLabel>协会</FormLabel>
                            <FormControl class="mt-[0.2rem]">
                                <select v-bind="componentField"
                                    class="border rounded-lg w-full h-10 p-2 dark:bg-[#121212]">
                                    <option value="">请选择协会</option>
                                    <option value="网络协会">网络协会</option>
                                    <option value="ACM协会">ACM协会</option>
                                </select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>

                    <!-- 部门选择 -->
                    <FormField v-slot="{ componentField }" name="department">
                        <FormItem class="mt-4">
                            <FormLabel>部门</FormLabel>
                            <FormControl class="mt-[0.2rem]">
                                <select v-bind="componentField"
                                    class="border rounded-lg w-full h-10 p-2 dark:bg-[#121212]">
                                    <option value="">请选择部门</option>
                                    <option value="宣传部">宣传部</option>
                                    <option value="BI部">BI部</option>
                                    <option value="教研部">教研部</option>
                                    <option value="学术部">学术部</option>
                                    <option value="科研部">科研部</option>
                                    <option value="技术维护小组">技术维护小组</option>
                                </select>
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
                            {{ isSubmitting ? '提交中...' : '提交' }}
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

// 初始值包含状态、协会和部门
const initialValues = {
    status: 'pending',
    association: '',
    department: '',
}

watch(() => props.open, val => dialogOpen.value = val)
watch(dialogOpen, val => {
    emit('update:open', val)
})

// 表单验证规则
const formSchema = toTypedSchema(z.object({
    status: z.enum(["pending", "approved", "rejected"], {
        required_error: "请选择面试状态"
    }),
    association: z.string()
        .max(50, "协会名称不能超过50个字符")
        .optional(),
    department: z.string()
        .max(50, "部门名称不能超过50个字符")
        .optional(),
}))

// 修改面试状态
async function onSubmit(values: any, resetForm: Function) {
    console.log('修改状态表单提交，值:', values);
    console.log('当前选中的ID列表:', props.checkedIds);

    if (props.checkedIds.length === 0) {
        toast.error("请先选择至少一位面试者");
        return;
    }

    try {
        isSubmitting.value = true;

        // 需要父组件传递 campaignId
        const campaignId = props.campaignId;
        if (!campaignId) {
            toast.error('未传递活动ID');
            isSubmitting.value = false;
            return;
        }

        // 先通过 campaignId 和 userId 获取 resultId，再更新状态
        for (const userId of props.checkedIds) {
            // 获取 resultId
            const res = await interviewStore.getInterviewResult(userId, campaignId);
            const r = res as any;
            let resultId = '';
            if (r && r.data && Array.isArray(r.data.results) && r.data.results.length > 0) {
                resultId = r.data.results[0].id;
            }
            console.log('后端返回数据:', r);
            console.log('data内容:', r.data);
            console.log('解析得到的resultId:', resultId);
            if (!resultId) {
                console.warn('未找到 resultId，data.results 结构:', r.data?.results);
                toast.error(`未找到用户 ${userId} 的面试结果ID`);
                continue;
            }
            // 更新状态
            const res2 = await interviewStore.updateInterviewResult({
                resultId,
                status: values.status,
                association: values.association,
                department: values.department,
            });
            console.log('提交的表单数据:', values);
            console.log('状态更新成功:', res2);
        }

        toast.success(`已成功更新 ${props.checkedIds.length} 位面试者的状态`);
        dialogOpen.value = false;
        resetForm();
    } catch (error: any) {
        console.error('更新状态失败详情:', error);
        toast.error(error?.data?.message || '更新状态失败');
    } finally {
        isSubmitting.value = false;
    }
}
</script>