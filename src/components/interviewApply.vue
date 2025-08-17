<template>
    <div
        class="flex flex-col h-[80%] md:w-auto min-w-[36%] w-full rounded-xl overflow-hidden select-none dark:bg-[#E8E7E2]">
        <!-- 顶部装饰 -->
        <div class="w-full h-16 flex">
            <div class="dark:bg-[#A3A2A0] text-[#000000] px-6 py-5 cursor-pointer flex items-center" @click="">
                <Minimize2 />
            </div>
            <div class="flex-1 h-16 dark:bg-[#A3A2A0]"></div>
            <!-- 顶部按钮 -->
            <div class="dark:bg-[#A3A2A0] px-4 py-2 flex items-center">
                <Button
                    class="flex gap-1 text-sm tracking-wide dark:bg-[#7CA08C] dark:text-[#000000] font-bold xl:px-[5rem] px-[4rem] transition-transform duration-250 hover:scale-105 active:scale-95 hover:shadow-md cursor-pointer"
                    @click="openDialog()">
                    <CirclePlus class="inline w-5 h-5" />
                    添加
                </Button>
            </div>
            <Popover>
                <PopoverTrigger>
                    Open popover
                </PopoverTrigger>
                <PopoverContent>
                    Some popover content
                </PopoverContent>
            </Popover>
        </div>

        <!-- 中间内容 -->
        <div
            class="flex-1 overflow-auto will-change-transform rounded-none dark:bg-[#E8E7E2] dark:text-[#000000] scrollbar-hide">
            <!-- 已添加字段列表 -->
            <div class="">
                <ul class="">
                    <li v-for="(field, index) in fields" :key="field.id"
                        class="px-4 py-2 rounded dark:text-[#000000] cursor-pointer hover:bg-gray-100 flex items-center"
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
                    </li>
                </ul>
            </div>

            <!-- 弹层 -->
            <div v-if="showDialog"
                class="fixed inset-0 dark:text-[#000000] bg-black/40 flex items-center justify-center">
                <div class="bg-white rounded-lg shadow-lg w-96 p-6 relative">
                    <!-- 关闭按钮 -->
                    <button class="absolute right-3 top-3 text-gray-500 hover:text-black" @click="closeDialog">
                        ✕
                    </button>

                    <h2 class="text-lg font-bold mb-4">
                        {{ editingField ? "编辑字段" : "添加字段" }}
                    </h2>

                    <!-- 表单 -->
                    <form @submit.prevent="saveField">
                        <!-- 字段名 -->
                        <div class="mb-3">
                            <label class="block mb-1">字段名</label>
                            <input v-model="tempField.label" type="text" class="border rounded w-full px-2 py-1"
                                required />
                        </div>


                        <!-- 字段存储名 -->
                        <div class="mb-3">
                            <label class="block mb-1">字段存储名</label>
                            <input v-model="tempField.fieldName" type="text" class="border rounded w-full px-2 py-1"
                                required />
                        </div>

                        <!-- 字段类型 -->
                        <div class="mb-3">
                            <label class="block mb-1">字段类型</label>
                            <select v-model="tempField.type" class="border rounded w-full px-2 py-1" required>
                                <option value="text">文本</option>
                                <option value="number">数字</option>
                                <option value="select">选择框</option>
                                <option value="date">日期</option>
                            </select>
                        </div>

                        <!-- 选择器选项 -->
                        <div v-if="tempField.type === 'select'" class="mb-3">
                            <label class="block mb-1">选择框选项</label>
                            <div v-for="(opt, idx) in tempField.options" :key="idx" class="flex gap-2 mb-2">
                                <input v-model="tempField.options[idx]" type="text"
                                    class="border rounded flex-1 px-2 py-1" placeholder="请输入选项值" required />
                                <button type="button" class="bg-red-500 text-white px-2 rounded"
                                    @click="removeOption(idx)">
                                    删除
                                </button>
                            </div>
                            <button type="button" class="bg-blue-500 text-white px-3 py-1 rounded" @click="addOption">
                                添加选项
                            </button>
                        </div>

                        <!-- 是否必填 -->
                        <div class="mb-3 flex items-center gap-2">
                            <input type="checkbox" v-model="tempField.required" />
                            <span>必填</span>
                        </div>

                        <!-- 保存按钮 -->
                        <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded">
                            保存
                        </button>
                    </form>
                </div>
            </div>
        </div>
        <!-- 底部栏，固定在组件底部 -->
        <div class="h-18 flex px-[1.5rem] py-[0.5rem]">
            <div class="flex justify-start">
                <Button type="submit"
                    class="dark:bg-[#A3A2A0] dark:text-[#000000] font-bold text-bold xl:px-[5rem] px-[4rem] py-[1.5rem] transition-transform duration-250 hover:scale-105 active:scale-95 hover:shadow-md cursor-pointer"
                    @click="submitFields">
                    保存
                </Button>
            </div>
            <div class="flex-1 md:min-w-[5rem] w-auto"></div>
            <div class="flex justify-end">
                <Button
                    class="dark:bg-[#A3A2A0] dark:text-[#000000] font-bold text-bold xl:px-[5rem] px-[4rem] py-[1.5rem] transition-transform duration-250 hover:scale-105 active:scale-95 hover:shadow-md cursor-pointer"
                    @click="reset">
                    重置
                </Button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import { Minimize2 } from 'lucide-vue-next';
import { CirclePlus } from 'lucide-vue-next';
import { Button } from '@/components/ui/button'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from 'vue-sonner'
import { h, markRaw } from "vue"

interface FormField {
    id: string
    label: string
    fieldName: string
    type: string
    required: boolean
    options: string[]
}

const fields = ref<FormField[]>([]) // 已添加字段
const showDialog = ref(false)       // 控制弹层显示
const editingField = ref<FormField | null>(null) // 当前正在编辑的字段
const tempField = ref<FormField>({
    id: "",
    label: "",
    fieldName: "",
    type: "text",
    required: false,
    options: [],
})

// 打开弹层
function openDialog(field?: FormField) {
    if (field) {
        // 编辑模式
        editingField.value = field
        tempField.value = { ...field, options: [...field.options] }
    } else {
        // 新增模式
        editingField.value = null
        tempField.value = {
            id: crypto.randomUUID(),
            label: "",
            fieldName: "",
            type: "text",
            required: false,
            options: [],
        }
    }
    showDialog.value = true
}

// 保存字段
function saveField() {
    if (editingField.value) {
        // 修改已有字段
        const index = fields.value.findIndex(f => f.id === editingField.value!.id)
        if (index !== -1) {
            fields.value[index] = { ...tempField.value }
        }
    } else {
        // 新增字段
        fields.value.push({ ...tempField.value })
    }
    closeDialog()
}

// 添加选项
function addOption() {
    tempField.value.options.push("")
}

// 删除选项
function removeOption(idx: number) {
    tempField.value.options.splice(idx, 1)
}

// 关闭弹层
function closeDialog() {
    showDialog.value = false
}

function reset() {
    fields.value = []
    tempField.value = {
        id: "",
        label: "",
        fieldName: "",
        type: "text",
        required: false,
        options: [],
    }
    editingField.value = null
    showDialog.value = false
}

watch(() => tempField.value.type, (t) => {
    if (t !== "select") tempField.value.options = []
})

function submitFields() {
    toast(
        markRaw(
            h("pre", { class: "mt-2 w-[340px] rounded-md bg-slate-950 p-4" },
                h("code", { class: "text-white" }, JSON.stringify(fields.value, null, 2))
            )
        ),
        {
            description: "已提交字段内容",
            duration: 4000,
        }
    )
}

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
