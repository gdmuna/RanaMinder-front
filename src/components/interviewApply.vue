<template>
    <div
        class="flex flex-col h-[80%] md:w-auto min-w-[36%] w-full rounded-xl overflow-hidden select-none dark:bg-[#E8E7E2]">
        <!-- 顶部装饰 -->
        <div class="w-full h-16 flex">
            <div class="dark:bg-[#A3A2A0] text-[#000000] px-6 py-5 cursor-pointer flex items-center" @click="deliverClose">
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
        </div>

        <!-- 中间内容 -->
        <div
            class="flex-1 overflow-auto will-change-transform rounded-none dark:bg-[#E8E7E2] dark:text-[#000000] scrollbar-hide">

            <!-- 已添加字段列表 -->
            <div v-show="!showDialog" class="">
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

            <!-- 添加字段弹窗 -->
            <div v-show="showDialog"
                class="px-4 py-2 rounded dark:text-[#000000] cursor-pointer hover:bg-gray-100 flex items-center">
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
                            <div class="flex items-center gap-2">
                                <span class="text-red-500 mt-[0.25rem]">*</span>
                                <label class="block mb-1">字段名</label>
                            </div>
                            <input v-model="tempField.label" type="text" class="border rounded w-full px-2 py-1"
                                required />
                        </div>

                        <!-- 字段描述 -->
                        <div class="mb-3">
                            <label class="block mb-1">备注</label>
                            <input v-model="tempField.description" type="text"
                                class="border rounded w-full px-2 py-1" />
                        </div>

                        <!-- 字段存储名 -->
                        <div class="mb-3">
                            <div class="flex items-center gap-2">
                                <span class="text-red-500 mt-[0.25rem]">*</span>
                                <label class="block mb-1">数据库存储名(英文)</label>
                            </div>
                            <input v-model="tempField.fieldName" type="text" class="border rounded w-full px-2 py-1"
                                required />
                        </div>

                        <!-- 字段类型 -->
                        <div class="mb-3">
                            <div class="flex items-center gap-2">
                                <span class="text-red-500 mt-[0.25rem]">*</span>
                                <label class="block mb-1">字段类型</label>
                            </div>
                            <select v-model="tempField.type" class="border rounded w-full px-2 py-1" required>
                                <option value="input">输入框 input</option>
                                <option value="textarea">多行文本textarea</option>
                                <option value="radioGroup">单选组radioGroup</option>
                                <option value="checkbox">多选组checkbox</option>
                                <option value="select">下拉选择框select</option>
                                <option value="upload">上传upload</option>
                            </select>
                        </div>

                        <!-- 值类型 -->
                        <div class="mb-3" v-if="tempField.type !== 'upload'">
                            <div class="flex items-center gap-2">
                                <span class="text-red-500 mt-[0.25rem]">*</span>
                                <label class="block mb-1">值类型</label>
                            </div>
                            <select v-model="tempField.value.type" class="border rounded w-full px-2 py-1" required>
                                <option value="string">字符串string</option>
                                <option value="number">数字number</option>
                                <option value="boolean">布尔值boolean</option>
                                <option value="array">数组array</option>
                            </select>
                        </div>

                        <!-- 值的最大值/最小值，仅数字类型,且字段类型为输入框/多行文本 -->
                        <div class="mb-3"
                            v-if="['number'].includes(tempField.value.type) && ['input', 'textarea'].includes(tempField.type)">
                            <label class="block mb-1">值的最小值</label>
                            <input v-model.number="tempField.value.minCount" type="number"
                                class="border rounded w-full px-2 py-1" />
                            <label class="block mb-1 mt-2">值的最大值</label>
                            <input v-model.number="tempField.value.maxCount" type="number"
                                class="border rounded w-full px-2 py-1" />
                        </div>

                        <!-- 最大/最小长度，仅字符串/数组/数字，且字段类型为输入框/多行文本 -->
                        <div class="mb-3"
                            v-if="['string', 'array', 'number'].includes(tempField.value.type) && ['input', 'textarea'].includes(tempField.type)">
                            <label class="block mb-1">最小长度</label>
                            <input v-model.number="tempField.value.minLength" type="number" min="0"
                                class="border rounded w-full px-2 py-1" />
                            <label class="block mb-1 mt-2">最大长度</label>
                            <input v-model.number="tempField.value.maxLength" type="number" min="1"
                                class="border rounded w-full px-2 py-1" />
                        </div>

                        <!-- 数组项类型配置，仅 array 类型 -->
                        <div class="mb-3" v-if="tempField.value.type === 'array' && tempField.value.arrayItem">
                            <div class="flex items-center gap-2">
                                <span class="text-red-500 mt-[0.25rem]">*</span>
                                <label class="block mb-1">数组项类型</label>
                            </div>
                            <select v-model="tempField.value.arrayItem.type" class="border rounded w-full px-2 py-1"
                                required>
                                <option value="string">字符串string</option>
                                <option value="number">数字number</option>
                                <option value="boolean">布尔值boolean</option>
                            </select>
                            <label class="block mb-1 mt-2">数组项最小长度</label>
                            <input v-model.number="tempField.value.arrayItem.minLength" type="number"
                                class="border rounded w-full px-2 py-1" />
                            <label class="block mb-1 mt-2">数组项最大长度</label>
                            <input v-model.number="tempField.value.arrayItem.maxLength" type="number"
                                class="border rounded w-full px-2 py-1" />
                            <!-- 数组项默认值，直接返回空数组，待优化 -->
                            <!-- <label class="block mb-1 mt-2">数组项默认值</label>
                            <input v-model="tempField.value.arrayItem.default" type="text"
                                class="border rounded w-full px-2 py-1" /> -->
                        </div>

                        <!-- 选项配置，仅 radioGroup/select/checkbox 类型 -->
                        <div v-if="['radioGroup', 'select', 'checkbox'].includes(tempField.type)" class="mb-3">
                            <label class="block mb-1">选项列表</label>
                            <div v-for="(opt, idx) in tempField.value.options" :key="idx" class="flex gap-2 mb-2">
                                <input v-model="opt.label" type="text" class="border rounded px-2 py-1"
                                    placeholder="选项显示文本" required />
                                <input v-model="opt.value" type="text" class="border rounded px-2 py-1"
                                    placeholder="选项值" required />
                                <button type="button" class="bg-red-500 text-white px-2 rounded"
                                    @click="removeOption(idx)">删除</button>
                            </div>
                            <button type="button" class="bg-blue-500 text-white px-3 py-1 rounded"
                                @click="addOption">添加选项</button>
                        </div>

                        <!-- 允许文件类型，仅 upload 类型 -->
                        <div v-if="tempField.type === 'upload'" class="mb-3">
                            <label class="block mb-1">允许文件类型</label>
                            <input v-model="tempField.value.accept" type="text" class="border rounded w-full px-2 py-1"
                                placeholder="如 image/png,image/jpeg" @blur="splitAccept" />
                            <label class="block mb-1 mt-2">最大文件大小(MB)</label>
                            <input v-model.number="tempField.value.maxSize" type="number"
                                class="border rounded w-full px-2 py-1" />
                        </div>

                        <!-- 输入框的显示样式 -->
                        <div class="mb-3" v-if="['input', 'textarea'].includes(tempField.type) && tempField.style">
                            <label class="block mb-1">值输入框显示样式</label>
                            <select v-model="tempField.style.inputType" class="border rounded w-full px-2 py-1">
                                <option value="text">文本输入框</option>
                                <option value="email">邮箱输入框</option>
                                <option value="number">数字输入框</option>
                                <option value="password">密码输入框</option>
                            </select>
                        </div>

                        <!-- 默认值 -->
                        <div class="mb-3">
                            <label
                                v-if="tempField.value.type && tempField.type !== 'upload' && tempField.value.type !== 'array'"
                                class="block mb-1">默认值</label>
                            <input v-if="tempField.value.type === 'string'" v-model="tempField.value.default"
                                type="text" class="border rounded w-full px-2 py-1" />
                            <input v-else-if="tempField.value.type === 'number'"
                                v-model.number="tempField.value.default" type="number"
                                class="border rounded w-full px-2 py-1" />
                            <select v-else-if="tempField.value.type === 'boolean'" v-model="tempField.value.default"
                                class="border rounded w-full px-2 py-1">
                                <option :value="true">true</option>
                                <option :value="false">false</option>
                            </select>
                        </div>

                        <!-- 是否必填 -->
                        <div class="mb-3 flex items-center gap-2">
                            <input type="checkbox" v-model="tempField.required" />
                            <span>必填</span>
                        </div>

                        <!-- 保存按钮 -->
                        <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded">保存</button>
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
    if (editingField.value) {
        // 修改已有字段
        const index = fields.value.findIndex(f => f.fieldName === editingField.value!.fieldName)
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
