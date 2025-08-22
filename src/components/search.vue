<script setup lang="ts">
import { useFilter } from "reka-ui"
import { computed, ref } from "vue"
import { Combobox, ComboboxAnchor, ComboboxEmpty, ComboboxGroup, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox"
import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText } from "@/components/ui/tags-input"

const frameworks = [
    { value: "网络协会", label: "网络协会" },
    { value: "ACM协会", label: "ACM协会" },
    { value: "2023级", label: "2023级" },
    { value: "2024级", label: "2024级" },
    { value: "2025级", label: "2025级" },
]

const modelValue = ref<string[]>([])
const open = ref(false)
const searchTerm = ref("")

const { contains } = useFilter({ sensitivity: "base" })
const filteredFrameworks = computed(() => {
    const options = frameworks.filter(i => !modelValue.value.includes(i.label))
    return searchTerm.value ? options.filter(option => contains(option.label, searchTerm.value)) : options
})
</script>

<template>
    <Combobox v-model="modelValue" v-model:open="open" :ignore-filter="true">
        <ComboboxAnchor as-child>
            <TagsInput v-model="modelValue" class="px-2 gap-2 w-auto h-[2.25rem] bg-[#18181A] border-[1.3px]">
                <div class="flex gap-2 flex-wrap items-center">
                    <TagsInputItem v-for="item in modelValue" :key="item" :value="item">
                        <TagsInputItemText class="text-[#FEFCE4] font-bold text-xs"/>
                        <TagsInputItemDelete class="text-[#FEFCE4] cursor-pointer"/>
                    </TagsInputItem>
                </div>  
                <ComboboxInput v-model="searchTerm" as-child>
                    <TagsInputInput placeholder="点击搜索 ..."
                        class="min-w-[120px] p-0 border-none focus-visible:ring-0"
                        @keydown.enter.prevent />
                </ComboboxInput>
            </TagsInput>

            <ComboboxList class="w-[--reka-popper-anchor-width] bg-[#18181A] border-[1.3px]">
                <ComboboxEmpty class="px-8 py-2 font-bold text-[#FEFCE4] flex translate-y-1">暂无选项</ComboboxEmpty>
                <ComboboxGroup class="text-[#FEFCE4] font-bold">
                    <ComboboxItem v-for="framework in filteredFrameworks" :key="framework.value" class="data-[highlighted]:text-[#FEFCE4]"
                        :value="framework.label" @select.prevent="(ev) => {

                            if (typeof ev.detail.value === 'string') {
                                searchTerm = ''
                                modelValue.push(ev.detail.value)
                            }

                            if (filteredFrameworks.length === 0) {
                                open = false
                            }
                        }">
                        {{ framework.label }}
                    </ComboboxItem>
                </ComboboxGroup>
            </ComboboxList>
        </ComboboxAnchor>
    </Combobox>
</template>