<template>
    <div class="flex">
        <!-- 标签展示 -->
        <TagsInput v-model="tags" class="w-auto">
            <div class="flex flex-wrap gap-2">
                <TagsInputItem v-for="tag in tags" :key="tag" :value="tag">
                    <TagsInputItemText>{{ tag }}</TagsInputItemText>
                    <TagsInputItemDelete />
                </TagsInputItem>
            </div>
        </TagsInput>
        <!-- 下拉选择 -->
        <Select v-model="selectedValue">
            <SelectTrigger />
            <SelectContent>
                <!--网络协会 -->
                <SelectGroup>
                    <SelectLabel>网络协会</SelectLabel>
                    <template v-for="group in NAoptions" :key="group.group">
                        <SelectLabel class="font-bold text-gray-600">{{ group.group }}</SelectLabel>
                        <SelectItem v-for="item in group.children" :key="item.value" :value="item.value">
                            {{ item.label }}
                        </SelectItem>
                    </template>
                </SelectGroup>
                <!-- ACM协会 -->
                <SelectGroup>
                    <SelectLabel>ACM协会</SelectLabel>
                    <template v-for="group in ACMoptions" :key="group.group">
                        <SelectLabel class="font-bold text-gray-600">{{ group.group }}</SelectLabel>
                        <SelectItem v-for="item in group.children" :key="item.value" :value="item.value">
                            {{ item.label }}
                        </SelectItem>
                    </template>
                </SelectGroup>
            </SelectContent>
        </Select>
    </div>
</template>

<script setup lang="ts">
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    TagsInput,
    TagsInputItem,
    TagsInputItemDelete,
    TagsInputItemText,
} from "@/components/ui/tags-input";

import { ref, watch } from "vue";

// 下拉选项
const NAoptions = ref([
    {
        group: "会长团",
        children: [
            { label: "会长", value: "网络协会 - 会长团 - 会长" },
            { label: "副会长", value: "网络协会 - 会长团 - 副会长" }
        ]
    },
    {
        group: "宣传部",
        children: [
            { label: "部长", value: "网络协会 - 宣传部 - 部长" },
            { label: "干部", value: "网络协会 - 宣传部 - 干部" },
            { label: "干事", value: "网络协会 - 宣传部 - 干事" }
        ]
    },
    {
        group: "学术部",
        children: [
            { label: "部长", value: "网络协会 - 学术部 - 部长" },
            { label: "干部", value: "网络协会 - 学术部 - 干部" },
            { label: "干事", value: "网络协会 - 学术部 - 干事" }
        ]
    },
    {
        group: "BI部",
        children: [
            { label: "部长", value: "网络协会 - BI部 - 部长" },
            { label: "干部", value: "网络协会 - BI部 - 干部" },
            { label: "干事", value: "网络协会 - BI部 - 干事" }
        ]
    },
    {
        group: "科研部",
        children: [
            { label: "部长", value: "网络协会 - 科研部 - 部长" },
            { label: "干部", value: "网络协会 - 科研部 - 干部" },
            { label: "干事", value: "网络协会 - 科研部 - 干事" }
        ]
    }
]);

const ACMoptions = ref([
    {
        group: "会长团",
        children: [
            { label: "会长", value: "ACM协会 - 会长团 - 会长" },
            { label: "副会长", value: "ACM协会 - 会长团 - 副会长" }
        ]
    },
    {
        group: "宣传部",
        children: [
            { label: "部长", value: "ACM协会 - 宣传部 - 部长" },
            { label: "干部", value: "ACM协会 - 宣传部 - 干部" },
            { label: "干事", value: "ACM协会 - 宣传部 - 干事" }
        ]
    },
    {
        group: "教研部",
        children: [
            { label: "部长", value: "ACM协会 - 教研部 - 部长" },
            { label: "干部", value: "ACM协会 - 教研部 - 干部" },
            { label: "干事", value: "ACM协会 - 教研部 - 干事" }
        ]
    },
    {
        group: "技术运维小组",
        children: [
            { label: "部长", value: "ACM协会 - 技术运维小组 - 部长" },
            { label: "干部", value: "ACM协会 - 技术运维小组 - 干部" },
            { label: "干事", value: "ACM协会 - 技术运维小组 - 干事" }
        ]
    }
]);


// Select 选中的值
const selectedValue = ref<string | null>(null);

// 标签数组
const tags = ref<string[]>([]);

// 监听选择变化 -> 添加到 tags
watch(selectedValue, (val) => {
    if (val && !tags.value.includes(val)) {
        tags.value.push(val);
    }
    // 选择后清空 Select
    selectedValue.value = null;
});
</script>
