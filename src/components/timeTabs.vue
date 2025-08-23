<script setup lang="ts">
import { watch, ref, defineEmits } from "vue"

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

</script>

<template>
    <teleport to="body">
        <Transition name="fade">
            <div v-if="props.open"
                class="fixed inset-0 dark:bg-black/50 backdrop-blur-xs z-10 flex items-center justify-center flex-col"
                @click.self="closeTabs">
                <Tabs default-value="account" class="w-[400px]">
                    <TabsList class="grid w-full grid-cols-2">
                        <TabsTrigger value="account">
                            Account
                        </TabsTrigger>
                        <TabsTrigger value="password">
                            Password
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="account">
                        <Card>
                            <CardHeader>
                                <CardTitle>Account</CardTitle>
                                <CardDescription>
                                    Make changes to your account here. Click save when you're done.
                                </CardDescription>
                            </CardHeader>
                            <CardContent class="space-y-2">
                                <div class="space-y-1">
                                    <Label for="name">Name</Label>
                                    <Input id="name" default-value="Pedro Duarte" />
                                </div>
                                <div class="space-y-1">
                                    <Label for="username">Username</Label>
                                    <Input id="username" default-value="@peduarte" />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button>Save changes</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                    <TabsContent value="password">
                        <Card>
                            <CardHeader>
                                <CardTitle>Password</CardTitle>
                                <CardDescription>
                                    Change your password here. After saving, you'll be logged out.
                                </CardDescription>
                            </CardHeader>
                            <CardContent class="space-y-2">
                                <div class="space-y-1">
                                    <Label for="current">Current password</Label>
                                    <Input id="current" type="password" />
                                </div>
                                <div class="space-y-1">
                                    <Label for="new">New password</Label>
                                    <Input id="new" type="password" />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button>Save password</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </Transition>
    </teleport>
</template>