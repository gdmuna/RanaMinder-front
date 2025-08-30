<template>
    <teleport to="body">
        <Transition name="fade">
            <div v-if="props.open"
                class="fixed inset-0 dark:bg-black/50 backdrop-blur-xs z-10 flex items-center justify-center flex-col"
                @click.self="closeTabs">
                <Tabs default-value="period1" class="w-[22rem] h-[20rem]">
                    <TabsList class="grid w-full grid-cols-3">
                        <TabsTrigger v-for="tab in tabData" :key="tab.value" :value="tab.value"
                            class="data-[state=active]:text-white cursor-pointer">
                            {{ tab.label }}
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent v-for="tab in tabData" :key="tab.value" :value="tab.value">
                        <Card>
                            <CardHeader>
                                <CardTitle>{{ tab.label }}</CardTitle>
                                <CardDescription class="mt-[0.3rem]">
                                    这里可以设置 {{ tab.label }} 的相关信息。
                                </CardDescription>
                            </CardHeader>
                            <CardContent class="flex flex-col items-start gap-3">
                                <Button v-for="(item, idx) in tab.content" :key="idx" variant="link"
                                    class="cursor-pointer p-2 text-lg">
                                    {{ item }}
                                </Button>
                            </CardContent>
                            <CardFooter class="flex justify-end">
                                <Button class="transition-transform duration-250 hover:scale-105 active:scale-95 hover:shadow-md cursor-pointer" @click="closeTabs">取消</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </Transition>
    </teleport>
</template>

<script setup lang="ts">
import { watch, ref } from "vue"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

const props = defineProps<{ open: boolean }>()
const emit = defineEmits(['update:open'])

function closeTabs() {
    emit('update:open', false)
}

watch(
    () => props.open,
    (val) => {
        if (val) {
            document.body.style.overflow = "hidden"
            document.documentElement.style.overflow = "hidden"
        } else {
            document.body.style.overflow = ""
            document.documentElement.style.overflow = ""
        }
    }
)

// 假数据
const tabData = [
    {
        value: "period1",
        label: "时间段1",
        content: [
            "19:00 - 19:30",
            "20:00 - 20:30",
            "21:00 - 21:30",
        ]
    },
    {
        value: "period2",
        label: "时间段2",
        content: [
            "18:00 - 18:30",
            "22:00 - 22:30"
        ]
    },
    {
        value: "period3",
        label: "时间段3",
        content: [
            "20:00 - 20:30",
            "21:00 - 21:30",
            "22:00 - 22:30",
            "19:00 - 19:30",
        ]
    }
]

</script>