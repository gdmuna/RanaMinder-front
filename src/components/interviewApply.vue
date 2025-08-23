<template>
    <div
        class="flex flex-col h-[80%] md:w-auto min-w-[36%] w-full rounded-xl overflow-hidden select-none dark:bg-[#E8E7E2]">
        <!-- 顶部装饰 -->
        <div class="w-full h-16 flex">
            <!-- 最小化按钮：仅在未打开弹窗时显示 -->
            <div v-show="!showDialog"
                class="dark:bg-[#A3A2A0] text-[#000000] px-6 py-5 cursor-pointer flex items-center "
                @click="deliverClose">
                <Minimize2 class="transition-transform duration-250 hover:scale-115 active:scale-95"/>
            </div>
            <!-- 返回按钮：仅在弹窗打开时显示 -->
            <div v-show="showDialog" class="dark:bg-[#A3A2A0] text-[#000000] px-6 py-5 cursor-pointer flex items-center"
                @click="closeDialog">
                <Undo2 class="transition-transform duration-250 hover:scale-115 active:scale-95"/>
            </div>
            <div class="flex-1 h-16 dark:bg-[#A3A2A0]"></div>
            <!-- 顶部按钮 -->
            <div class="dark:bg-[#A3A2A0] px-4 py-2 flex items-center">
                <Button v-show="!showDialog"
                    class="flex gap-1 text-sm tracking-wide dark:bg-[#7CA08C] dark:text-[#000000] font-bold xl:px-[5rem] px-[4rem] transition-transform duration-250 hover:scale-105 active:scale-95 hover:shadow-sm cursor-pointer"
                    @click="openDialog()">
                    <CirclePlus class="inline w-5 h-5" />
                    添加
                </Button>
            </div>
        </div>

        <!-- 中间内容 -->
        <div
            class="flex-1 overflow-auto will-change-transform rounded-none dark:bg-[#E8E7E2] dark:text-[#000000] scrollbar-hide">
            <div v-show="!showDialog" class="flex w-full h-full">
                <!-- 没有添加字段时的提示 -->
                <div v-if="fields.length === 0" class="flex items-center justify-center w-full">
                    <div class="dark:text-[#A3A2A0] transition-transform duration-400 hover:scale-102 active:scale-95 cursor-pointer flex items-center"
                        @click.stop="openDialog()">
                        <Smile class="inline w-[2.2rem] h-[2.2rem]" />
                        <span class="ml-[1.5rem] font-bold text-[1.2rem] tracking-wider">点击添加申请表字段</span>
                    </div>
                </div>
                <!-- 有字段时的列表 -->
                <ul v-else class="w-full">
                    <li v-for="(field, index) in fields" :key="field.id"
                        class="px-4 py-2 rounded dark:text-[#000000] cursor-pointer hover:bg-[#f5f5f5cb] flex items-center"
                        @click="openDialog(field)">
                        <span
                            class="w-20 mr-8 font-[优设标题黑] tracking-wide drop-shadow-lg text-transparent bg-clip-text text-[2.5rem]"
                            :style="{
                                background: gradients[index % gradients.length],
                                WebkitBackgroundClip: 'text',
                                backgroundClip: 'text',
                                color: 'transparent'
                            }">
                            {{ (index + 1).toString().padStart(2, '0') }}
                        </span>
                        <span class="dark:text-[#000000] tracking-wide font-bold ">{{ field.label }}</span>
                            <CircleX @click.stop="removeField(index)" class="ml-auto mr-[0.8rem] w-[1.5rem] h-[1.5rem] font-bold text-[#af0d0d] cursor-pointer transition-transform duration-200 hover:scale-120 active:scale-95" />
                    </li>
                </ul>
            </div>

            <!-- 添加字段弹窗 -->
            <div v-show="showDialog" class="py-[1rem] px-[2rem]">

                <span class="text-xl font-bold">
                    {{ editingField ? "编辑字段" : "添加字段" }}
                </span>

                <!-- 表单 -->
                <form @submit.prevent="saveField" class="mt-[1.5rem]">
                    <!-- 字段名 -->
                    <div class="mb-[1.5rem] ">
                        <div
                            class="mb-[0.5rem] flex items-center gap-1 text-sm font-bold tracking-wide bg-[#8FAFC4] rounded-[999px] px-[0.7rem] py-[0.3rem] w-[7.8rem]">
                            <span class="text-red-500 translate-y-[0.21rem]">*</span>
                            <label class="">字段显示名称</label>
                        </div>
                        <Input v-model="tempField.label" type="text"
                            class="border-none focus:border-none focus:ring-0 focus:outline-none focus-visible:ring-0 dark:bg-input/10" />
                    </div>

                    <!-- 字段存储名 -->
                    <div class="mb-[1.5rem]">
                        <div
                            class="mb-[0.5rem] flex items-center gap-1 text-sm font-bold tracking-wide bg-[#8EB38A] rounded-[999px] px-[0.7rem] py-[0.3rem] w-[10.8rem]">
                            <span class="text-red-500 translate-y-[0.21rem]">*</span>
                            <label class="">字段存储名称（英文）</label>
                        </div>
                        <Input v-model="tempField.fieldName" type="text"
                            class="border-none focus:border-none focus:ring-0 focus:outline-none focus-visible:ring-0 dark:bg-input/10" />
                    </div>

                    <!-- 字段描述/备注 -->
                    <div class="mb-[1.5rem]">
                        <label
                            class="mb-[0.5rem] flex items-center gap-2 text-sm font-bold tracking-wide bg-[#C490BD] rounded-[999px] px-[0.7rem] py-[0.3rem] w-[3.3rem]">备注</label>
                        <Input v-model="tempField.description" type="text"
                            class="border-none focus:border-none focus:ring-0 focus:outline-none focus-visible:ring-0 dark:bg-input/10" />
                    </div>

                    <!-- 是否必填 -->
                    <div class="mb-[1.5rem] flex flex-col items-start gap-[0.5rem]">
                        <span
                            class="text-sm font-bold tracking-wide bg-[#e2d55a] rounded-[999px] px-[0.7rem] py-[0.3rem] w-[6rem]">必填该字段</span>
                        <Switch v-model="tempField.required" :value="undefined"
                            class="data-[state=checked]:bg-[#50C878] ml-[0.1rem]" />
                    </div>

                    <!-- 字段类型 -->
                    <div class="mb-[1.5rem]">
                        <div
                            class="mb-[0.5rem] flex items-center gap-1 text-sm font-bold tracking-wide bg-[#b0d1c1] rounded-[999px] px-[0.7rem] py-[0.3rem] w-[7.8rem]">
                            <span class="text-red-500 translate-y-[0.21rem]">*</span>
                            <label class="">字段应用类型</label>
                        </div>
                        <Select v-model="tempField.type">
                            <SelectTrigger class="w-full dark:bg-[#D4D3CF] dark:text-[#000000] border-none">
                                <SelectValue placeholder="请选择" />
                            </SelectTrigger>
                            <SelectContent class="dark:bg-[#D4D3CF] dark:text-[#000000] border-none ">
                                <SelectItem value="input" class="focus:bg-[#777777]">
                                    输入框 input
                                </SelectItem>
                                <SelectItem value="textarea" class="focus:bg-[#777777]">
                                    多行文本 textarea
                                </SelectItem>
                                <SelectItem value="radioGroup" class="focus:bg-[#777777]">
                                    单选组 radioGroup
                                </SelectItem>
                                <SelectItem value="checkbox" class="focus:bg-[#777777]">
                                    多选组 checkbox
                                </SelectItem>
                                <SelectItem value="select" class="focus:bg-[#777777]">
                                    下拉选择框 select
                                </SelectItem>
                                <SelectItem value="upload" class="focus:bg-[#777777]">
                                    上传 upload
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <!-- 值类型 -->
                    <div class="mb-[1.5rem]">
                        <div
                            class="mb-[0.5rem] flex items-center gap-1 text-sm font-bold tracking-wide bg-[#e6c492] rounded-[999px] px-[0.7rem] py-[0.3rem] w-[6rem]">
                            <span class="text-red-500 translate-y-[0.21rem]">*</span>
                            <label class="">值的类型</label>
                        </div>
                        <Select v-model="tempField.value.type">
                            <SelectTrigger class="w-full dark:bg-[#D4D3CF] dark:text-[#000000] border-none">
                                <SelectValue placeholder="请选择" />
                            </SelectTrigger>
                            <SelectContent class="dark:bg-[#D4D3CF] dark:text-[#000000] border-none ">
                                <SelectItem value="string" class="focus:bg-[#777777]">
                                    字符串 string
                                </SelectItem>
                                <SelectItem value="number" class="focus:bg-[#777777]">
                                    数字 number
                                </SelectItem>
                                <SelectItem value="array" class="focus:bg-[#777777]">
                                    数组 array
                                </SelectItem>
                                <SelectItem value="boolean" class="focus:bg-[#777777]">
                                    布尔值 boolean
                                </SelectItem>
                                <SelectItem value="file" class="focus:bg-[#777777]">
                                    文件 file
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <!-- 输入框的显示样式 -->
                    <div class="mb-[1.5rem]" v-if="['input', 'textarea'].includes(tempField.type) && tempField.style">
                        <label
                            class="mb-[0.5rem] flex items-center gap-1 text-sm font-bold tracking-wide bg-[#8FAFC4] rounded-[999px] px-[0.7rem] py-[0.3rem] w-[9.7rem]">值的输入框显示样式</label>
                        <Select v-model="tempField.style.inputType">
                            <SelectTrigger class="w-full dark:bg-[#D4D3CF] dark:text-[#000000] border-none">
                                <SelectValue placeholder="请选择" />
                            </SelectTrigger>
                            <SelectContent class="dark:bg-[#D4D3CF] dark:text-[#000000] border-none ">
                                <SelectItem value="text" class="focus:bg-[#777777]">
                                    文本输入框
                                </SelectItem>
                                <SelectItem value="email" class="focus:bg-[#777777]">
                                    邮箱输入框
                                </SelectItem>
                                <SelectItem value="number" class="focus:bg-[#777777]">
                                    数字输入框
                                </SelectItem>
                                <SelectItem value="password" class="focus:bg-[#777777]">
                                    密码输入框
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <!-- 默认值 -->
                    <div class="mb-[1.5rem]"
                        v-if="tempField.value.type && tempField.type !== 'upload' && tempField.value.type !== 'array' && tempField.value.type !== 'file'">
                        <label
                            class="mb-[0.5rem] flex items-center gap-1 text-sm font-bold tracking-wide bg-[#83c067] rounded-[999px] px-[0.7rem] py-[0.3rem] w-[4.3rem]">默认值</label>
                        <Input v-if="tempField.value.type === 'string'" v-model="(tempField.value as any).default"
                            type="text"
                            class="border-none focus:border-none focus:ring-0 focus:outline-none focus-visible:ring-0 dark:bg-input/10" />
                        <Input v-else-if="tempField.value.type === 'number'"
                            v-model.number="(tempField.value as any).default" type="number"
                            class="border-none focus:border-none focus:ring-0 focus:outline-none focus-visible:ring-0 dark:bg-input/10" />
                        <Select v-else-if="tempField.value.type === 'boolean'"
                            v-model="(tempField.value as any).default">
                            <SelectTrigger class="w-full dark:bg-[#D4D3CF] dark:text-[#000000] border-none">
                                <SelectValue placeholder="请选择" />
                            </SelectTrigger>
                            <SelectContent class="dark:bg-[#D4D3CF] dark:text-[#000000] border-none ">
                                <SelectItem value="true" class="focus:bg-[#777777]">
                                    true
                                </SelectItem>
                                <SelectItem value="false" class="focus:bg-[#777777]">
                                    false
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <!-- 值的最大值/最小值，仅数字类型,且字段类型为输入框/多行文本 -->
                    <div class="mb-[1.5rem]"
                        v-if="['number'].includes(tempField.value.type) && ['input', 'textarea'].includes(tempField.type)">
                        <label
                            class="mb-[0.5rem] flex items-center gap-1 text-sm font-bold tracking-wide bg-[#706cad] rounded-[999px] px-[0.7rem] py-[0.3rem] w-[6rem]">值的最大值</label>
                        <Input v-model.number="tempField.value.maxCount" type="number" min="0"
                            class="border-none focus:border-none focus:ring-0 focus:outline-none focus-visible:ring-0 dark:bg-input/10" />
                    </div>
                    <div class="mb-[1.5rem]"
                        v-if="['number'].includes(tempField.value.type) && ['input', 'textarea'].includes(tempField.type)">
                        <label
                            class="mb-[0.5rem] flex items-center gap-1 text-sm font-bold tracking-wide bg-[#5ba8b6] rounded-[999px] px-[0.7rem] py-[0.3rem] w-[6rem]">值的最小值</label>
                        <Input v-model.number="tempField.value.minCount" type="number" min="0"
                            class="border-none focus:border-none focus:ring-0 focus:outline-none focus-visible:ring-0 dark:bg-input/10" />
                    </div>

                    <!-- 最大/最小长度，仅字符串/数组/数字，且字段类型为输入框/多行文本 -->
                    <div class="mb-[1.5rem]"
                        v-if="['string', 'array', 'number'].includes(tempField.value.type) && ['input', 'textarea'].includes(tempField.type)">
                        <label
                            class="mb-[0.5rem] flex items-center gap-1 text-sm font-bold tracking-wide bg-[#4ca373] rounded-[999px] px-[0.7rem] py-[0.3rem] w-[10rem]">值的最大长度（字节）</label>
                        <Input v-model.number="tempField.value.maxLength" type="number" min="0"
                            class="border-none focus:border-none focus:ring-0 focus:outline-none focus-visible:ring-0 dark:bg-input/10" />
                    </div>
                    <div class="mb-[1.5rem]"
                        v-if="['string', 'array', 'number'].includes(tempField.value.type) && ['input', 'textarea'].includes(tempField.type)">
                        <label
                            class="mb-[0.5rem] flex items-center gap-1 text-sm font-bold tracking-wide bg-[#d876a7] rounded-[999px] px-[0.7rem] py-[0.3rem] w-[10rem]">值的最小长度（字节）</label>
                        <Input v-model.number="tempField.value.minLength" type="number" min="0"
                            class="border-none focus:border-none focus:ring-0 focus:outline-none focus-visible:ring-0 dark:bg-input/10" />
                    </div>

                    <!-- 数组项类型配置，仅 array 类型 -->
                    <div class="mb-[1.5rem]" v-if="tempField.value.type === 'array' && tempField.value.arrayItem">
                        <div
                            class="mb-[0.5rem] flex items-center gap-1 text-sm font-bold tracking-wide bg-[#e6c492] rounded-[999px] px-[0.7rem] py-[0.3rem] w-[6.8rem]">
                            <span class="text-red-500 translate-y-[0.21rem]">*</span>
                            <label class="">数组项类型</label>
                        </div>
                        <Select v-model="tempField.value.arrayItem.type">
                            <SelectTrigger class="w-full dark:bg-[#D4D3CF] dark:text-[#000000] border-none">
                                <SelectValue placeholder="请选择" />
                            </SelectTrigger>
                            <SelectContent class="dark:bg-[#D4D3CF] dark:text-[#000000] border-none ">
                                <SelectItem value="string" class="focus:bg-[#777777]">
                                    字符串 string
                                </SelectItem>
                                <SelectItem value="number" class="focus:bg-[#777777]">
                                    数字 number
                                </SelectItem>
                                <SelectItem value="boolean" class="focus:bg-[#777777]">
                                    布尔值 boolean
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div class="mb-[1.5rem]" v-if="tempField.value.type === 'array' && tempField.value.arrayItem">
                        <label
                            class="mb-[0.5rem] flex items-center gap-1 text-sm font-bold tracking-wide bg-[#d17a64] rounded-[999px] px-[0.7rem] py-[0.3rem] w-[7.8rem]">数组项最小长度</label>
                        <Input v-model.number="tempField.value.arrayItem.minLength" type="number" min="0"
                            class="border-none focus:border-none focus:ring-0 focus:outline-none focus-visible:ring-0 dark:bg-input/10" />
                    </div>
                    <div class="mb-[1.5rem]" v-if="tempField.value.type === 'array' && tempField.value.arrayItem">
                        <label
                            class="mb-[0.5rem] flex items-center gap-1 text-sm font-bold tracking-wide bg-[#b2d178] rounded-[999px] px-[0.7rem] py-[0.3rem] w-[7.8rem]">数组项最大长度</label>
                        <Input v-model.number="tempField.value.arrayItem.maxLength" type="number" min="0"
                            class="border-none focus:border-none focus:ring-0 focus:outline-none focus-visible:ring-0 dark:bg-input/10" />
                    </div>
                    <!-- 数组项默认值，直接返回空数组，待优化 -->
                    <!-- <label class="block mb-1 mt-2">数组项默认值</label>
                            <input v-model="tempField.value.arrayItem.default" type="text"
                                class="border rounded w-full px-2 py-1" /> -->

                    <!-- 选项配置，仅 radioGroup/select/checkbox 类型 -->
                    <div v-if="['radioGroup', 'select', 'checkbox'].includes(tempField.type)" class="mb-[1.5rem]">
                        <div class="flex items-center justify-start gap-1">
                            <label
                                class="mb-[0.5rem] flex items-center gap-1 text-sm font-bold tracking-wide bg-[#a77fc2] rounded-[999px] px-[0.7rem] py-[0.3rem] w-[5.2rem]">选项列表</label>
                            <button type="button"
                                class="mb-[0.5rem] rounded-xl flex gap-1 text-sm dark:bg-[#a77fc2] dark:text-[#000000] p-[0.29rem] font-bold transition-transform duration-250 hover:scale-105 active:scale-95 cursor-pointer"
                                @click="addOption">
                                <CirclePlus class="inline w-5 h-5" />
                            </button>
                        </div>
                        <div v-for="(opt, idx) in tempField.value.options" :key="idx"
                            class="flex gap-2 mb-2 items-center">
                            <Input v-model="opt.label" type="text"
                                class="border-none focus:border-none focus:ring-0 focus:outline-none focus-visible:ring-0 dark:bg-input/10"
                                placeholder="选项显示文本" />
                            <Input v-model="(opt as any).value" type="text"
                                class="border-none focus:border-none focus:ring-0 focus:outline-none focus-visible:ring-0 dark:bg-input/10"
                                placeholder="选项值（中文）" />
                            <button type="button"
                                class="rounded-xl flex gap-1 text-sm dark:bg-[#a77fc2] dark:text-[#000000] p-[0.29rem] font-bold transition-transform duration-250 hover:scale-105 active:scale-95 cursor-pointer"
                                @click="removeOption(idx)">
                                <CircleX class="inline w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <!-- 允许文件类型，仅 upload 类型 -->
                    <div v-if="tempField.type === 'upload'" class="mb-[1.5rem]">
                        <label
                            class="mb-[0.5rem] flex items-center gap-1 text-sm font-bold tracking-wide bg-[#7db15b] rounded-[999px] px-[0.7rem] py-[0.3rem] w-[6.9rem]">允许文件类型</label>
                        <Input v-model="(tempField.value as any).accept" type="text"
                            class="border-none focus:border-none focus:ring-0 focus:outline-none focus-visible:ring-0 dark:bg-input/10"
                            placeholder="使用英文逗号分隔，如 img/png, img/jpeg" @blur="splitAccept" />
                    </div>
                    <div v-if="tempField.type === 'upload'" class="mb-[1.5rem]">
                        <label
                            class="mb-[0.5rem] flex items-center gap-1 text-sm font-bold tracking-wide bg-[#7d8cc9] rounded-[999px] px-[0.7rem] py-[0.3rem] w-[9.6rem]">最大文件大小（MB）</label>
                        <Input v-model.number="tempField.value.maxSize" type="number" min="0"
                            class="border-none focus:border-none focus:ring-0 focus:outline-none focus-visible:ring-0 dark:bg-input/10" />
                    </div>

                    <!-- 保存按钮 -->
                    <!-- <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded">保存</button> -->
                </form>

            </div>
        </div>
        <!-- 底部栏，固定在组件底部 -->
        <div class="h-18 flex px-[1.5rem] py-[0.5rem]">
            <div class="flex justify-start">
                <Button type="submit"
                    class="dark:bg-[#A3A2A0] dark:text-[#000000] font-bold text-bold xl:px-[5rem] px-[4rem] py-[1.5rem] transition-transform duration-250 hover:scale-105 active:scale-95 hover:shadow-md cursor-pointer"
                    @click="showDialog ? saveField() : submitFields()">
                    {{ showDialog ? '保存' : '提交' }}
                </Button>
            </div>
            <div class="flex-1 md:min-w-[5rem] w-auto"></div>
            <div class="flex justify-end">
                <Button v-show="!showDialog"
                    class="dark:bg-[#A3A2A0] dark:text-[#000000] font-bold text-bold xl:px-[5rem] px-[4rem] py-[1.5rem] transition-transform duration-250 hover:scale-105 active:scale-95 hover:shadow-md cursor-pointer"
                    @click="reset">
                    重置
                </Button>
                <Button v-show="showDialog"
                    class="dark:bg-[#A3A2A0] dark:text-[#000000] font-bold text-bold xl:px-[5rem] px-[4rem] py-[1.5rem] transition-transform duration-250 hover:scale-105 active:scale-95 hover:shadow-md cursor-pointer"
                    @click="closeDialog">
                    取消
                </Button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import { Minimize2, Smile, CirclePlus, CircleX, Undo2 } from 'lucide-vue-next';
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from '@/components/ui/switch'
import { z } from 'zod'
import { toast } from 'vue-sonner'
import { h, markRaw } from "vue"

// 已添加字段
const fields = ref<InterviewFormJSON[]>([])
// 控制弹层显示
const showDialog = ref(false)
// 当前正在编辑的字段
const editingField = ref<InterviewFormJSON | null>(null)
// 临时字段，用于弹窗编辑
const tempField = ref<InterviewFormJSON>(getDefaultField())

// 定义组件导出Props
const props = defineProps<{
    id: number;
    deliverClose: () => void;
}>()

const InterviewFormJSONSchema = z.object({
    id: z.string().min(1, '字段唯一标识符不能为空'),
    label: z.string().min(1, '字段显示名称不能为空'),
    description: z.string().optional(),
    fieldName: z.string().min(1, '字段存储名称不能为空'),
    required: z.boolean(),
    type: z.enum(['input', 'radioGroup', 'select', 'upload', 'checkbox', 'textarea']),
    value: z.object({
        type: z.enum(['string', 'number', 'boolean', 'array', 'file']),
        minLength: z.number().int().min(0).optional(),
        maxLength: z.number().int().min(0).optional(),
        minCount: z.number().optional(),
        maxCount: z.number().optional(),
        maxSize: z.number().optional(),
        accept: z.array(z.string()).optional(),
        arrayItem: z.object({
            type: z.enum(['string', 'number', 'boolean']),
            minLength: z.number().int().min(0).optional(),
            maxLength: z.number().int().min(0).optional(),
            default: z.union([
                z.string(),
                z.number(),
                z.boolean(),
                z.array(z.union([z.string(), z.number(), z.boolean()]))
            ]).optional(),
        }).optional(),
        options: z.array(z.object({
            label: z.string().min(1, '选项显示文本不能为空'),
            value: z.union([
                z.string(),
                z.number(),
                z.boolean()
            ])
        })).optional(),
        default: z.union([
            z.string(),
            z.number(),
            z.boolean(),
            z.array(z.union([z.string(), z.number(), z.boolean()]))
        ]).optional(),
    }),
    style: z.object({
        inputType: z.enum(['text', 'email', 'number', 'password']).optional()
    }).optional(),
})

// 监听类型变化
watch(() => tempField.value.value.type, (valueType) => {
    // 自动初始化 arrayItem
    if (valueType === 'array') {
        if (!tempField.value.value.arrayItem) {
            tempField.value.value.arrayItem = {
                type: "",
                minLength: undefined,
                maxLength: undefined,
                default: undefined,
            };
            // 数组默认值, 直接传空数组， 待优化
            tempField.value.value.default = [];
            (tempField.value.value.arrayItem as any).default = []
        }
    }
    // 清空选项
    if (!['radioGroup', 'select', 'checkbox'].includes(tempField.value.type)) {
        if (tempField.value.value && Array.isArray(tempField.value.value.options)) {
            tempField.value.value.options = []
        }
    }
})

watch(() => tempField.value.type, (type) => {
    // 清理选项
    if (!['radioGroup', 'select', 'checkbox'].includes(type)) {
        tempField.value.value.options = undefined
    }
    // 清理上传相关
    if (type !== 'upload') {
        tempField.value.value.accept = undefined
        tempField.value.value.maxSize = undefined
    }
    // 清理输入框样式
    if (!['input', 'textarea'].includes(type)) {
        tempField.value.style = undefined
        tempField.value.value.default = undefined
    }
})

watch(() => tempField.value.value.type, (valueType) => {
    // 数组类型初始化
    if (valueType === 'array') {
        tempField.value.value.arrayItem = { type: '', minLength: undefined, maxLength: undefined, default: undefined }
        tempField.value.value.default = []
    } else {
        tempField.value.value.arrayItem = undefined
        tempField.value.value.default = undefined
    }
    // 非 string/number/boolean 时清理默认值
    if (!['string', 'number', 'boolean', 'array', 'file'].includes(valueType)) {
        tempField.value.value.default = undefined
    }
})

/**
 * 面试表单字段配置项
 * 用于动态生成表单，每个字段描述了表单项的类型、校验规则、选项、样式等。
 * 参考 template.json 配置。
 */
interface InterviewFormJSON {
    /**
     * 字段唯一标识符
     * @example "studentNumber"
     */
    id: string
    /**
     * 字段显示名称
     * @example "学号"
     */
    label: string
    /**
     * 字段描述（可选），用于辅助说明
     * @example "范例：汉族"
     */
    description?: string
    /**
     * 字段名（唯一标识，提交时的 key）
     * @example "studentNumber"
     */
    fieldName: string
    /**
     * 是否为必填项
     * @example true
     */
    required: boolean
    /**
     * 字段类型
     * - input: 普通输入框
     * - radioGroup: 单选组
     * - select: 下拉选择
     * - upload: 文件上传
     * - checkbox: 多选框组
     * - textarea: 多行文本
     * @example "input"
     */
    type: 'input' | 'radioGroup' | 'select' | 'upload' | 'checkbox' | 'textarea' | ''
    /**
     * 字段值及校验规则
     */
    value: {
        /**
         * 值类型
         * - string: 字符串
         * - number: 数字
         * - boolean: 布尔
         * - array: 数组（多选）
         * - file: 文件
         * @example "string"
         */
        type: 'string' | 'number' | 'boolean' | 'array' | 'file' | ''
        /**
         * 最小长度（字符串/数组/数字位数）
         */
        minLength?: number
        /**
         * 最大长度（字符串/数组/数字位数）
         */
        maxLength?: number
        /**
         * 最小值（仅 number 类型）
         * @example 0
         */
        minCount?: number
        /**
         * 最大值（仅 number 类型）
         * @example 100
         */
        maxCount?: number
        /**
         * 文件最大字节数（仅 file 类型）
         * @example 10485760 // 10MB
         */
        maxSize?: number
        /**
         * 允许的文件类型（仅 file 类型）
         * @example ["image/png", "image/jpeg"]
         */
        accept?: string[]
        /**
         * 数组项类型及默认值（仅 array 类型）
         */
        arrayItem?: {
            /**
             * 数组项类型
             */
            type: 'string' | 'number' | 'boolean' | ''
            /**
             * 数组项最小长度
             */
            minLength?: number
            /**
             * 数组项最大长度
             */
            maxLength?: number
            /**
             * 数组项默认值
             */
            default?: string | number | boolean
        }
        /**
         * 选项列表（radioGroup/select/checkbox）
         * 每个选项包含 label（显示文本）和 value（实际值）
         */
        options?: Array<{
            /**
             * 选项显示文本
             */
            label: string
            /**
             * 选项实际值
             */
            value: string | number | boolean
        }>
        /**
         * 默认值
         * - input/textarea: string/number/boolean
         * - checkbox: 数组
         */
        default?: string | number | boolean | Array<string | number | boolean>
    },
    /**
     * 样式配置（如 inputType）
     */
    style?: {
        /**
         * 输入框类型
         */
        inputType?: 'text' | 'email' | 'number' | 'password' | undefined
    }
}

/**
 * 打开添加/编辑字段弹层
 * @param field 编辑时传入已有字段配置，新增时传入 undefined
 */
function openDialog(field?: InterviewFormJSON) {
    if (field) {
        tempField.value = { ...field }
        editingField.value = field
    } else {
        tempField.value = getDefaultField()
        editingField.value = null
    }
    showDialog.value = true
}

/**
 * 获取一个默认的字段配置对象
 * 用于初始化弹窗或重置字段
 */
function getDefaultField() {
    return {
        id: crypto.randomUUID(),
        label: "",
        fieldName: "",
        required: false,
        type: "",
        value: {
            type: "",
        },
        style: {
            inputType: undefined
        },
    } as InterviewFormJSON
}

// 保存字段
function saveField() {
    const result = InterviewFormJSONSchema.safeParse(tempField.value)
    if (!result.success) {
        // 拼接详细中文报错
        const errorMsg = result.error.errors.map(e => {
            // e.path 是字段路径数组
            const path = e.path.length ? e.path.join('.') : '字段'
            return `${path}：${e.message}`
        }).join('\n')
        toast(
            markRaw(
                h("pre", { class: "mt-2 w-[340px] rounded-md bg-red-100 p-4 text-red-700" },
                    h("code", {}, errorMsg)
                )
            )
        )
        console.error('zod校验错误详情：', JSON.stringify(result.error, null, 2))
        return
    }
    // 3. 校验通过，保存字段
    if (editingField.value) {
        const index = fields.value.findIndex(f => f.fieldName === editingField.value!.fieldName)
        if (index !== -1) {
            fields.value[index] = { ...tempField.value }
        }
    } else {
        fields.value.push({ ...tempField.value })
    }
    closeDialog()
}

// 添加选项
function addOption() {
    if (Array.isArray(tempField.value.value.options)) {
        tempField.value.value.options.push({ label: "", value: "" })
    } else {
        tempField.value.value.options = [{ label: "", value: "" }]
    }
}

// 删除选项
function removeOption(idx: number) {
    if (Array.isArray(tempField.value.value.options)) {
        tempField.value.value.options.splice(idx, 1)
    }
}

// 关闭弹层
function closeDialog() {
    showDialog.value = false
    editingField.value = null
}

// 重置
function reset() {
    fields.value = []
    tempField.value = getDefaultField()
    editingField.value = null
    showDialog.value = false
}

// 删除某个字段
function removeField(index: number) {
    fields.value.splice(index, 1)
}

// 处理 accept 格式
function splitAccept() {
    if (
        tempField.value.type === 'upload'
    ) {
        const acceptVal = tempField.value.value.accept as unknown as string
        if (typeof acceptVal === 'string') {
            tempField.value.value.accept = acceptVal
                .split(',')
                .map(s => s.trim())
                .filter(Boolean)
        }
    }
}

// 提交
function submitFields() {
    // 转换 maxSize 单位（MB → 字节）
    fields.value.forEach(field => {
        if (field.type === 'upload' && typeof field.value.maxSize === 'number') {
            field.value.maxSize = field.value.maxSize * 1024 * 1024
        }
    })
    toast(
        markRaw(
            h("pre", { class: "mt-2 w-[340px] rounded-md bg-slate-950 p-4" },
                h("code", { class: "text-white" }, JSON.stringify(fields.value, null, 2))
            )
        ),
    )
    console.log("提交的字段配置：", fields.value);
}

// 文字渐变色
const gradients = [
    'linear-gradient(270deg, #71B280 0%, #0A90B4 100%)',
    'linear-gradient(270deg, #FBC2EB 0%, #A6C1EE 100%)',
    'linear-gradient(270deg, #4CA1AF 0%, #C4E0E5 100%)',
    'linear-gradient(270deg, #FCB69F 0%, #FFECD2 100%)',
    'linear-gradient(270deg, #71B280 0%, #FBC2EB 100%)',
    'linear-gradient(270deg, #DECBA4 0%, #BDC3C7 100%)',
];

</script>

<style scoped>
.scrollbar-hide {
    scrollbar-width: none;
    /* Firefox */
    -ms-overflow-style: none;
    /* IE 10+ */
}

.scrollbar-hide::-webkit-scrollbar {
    display: none;
    /* Chrome/Safari/Opera */
}

.bg-clip-text {
    -webkit-background-clip: text;
    background-clip: text;
}

.text-transparent {
    color: transparent;
}
</style>
