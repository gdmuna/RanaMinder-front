<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
import {
    Cloud,
    CreditCard,
    Github,
    Keyboard,
    LifeBuoy,
    LogOut,
    Award,
    Mail,
    MessageSquare,
    Plus,
    PlusCircle,
    Settings,
    User,
    UserPlus,
    Users,
} from "lucide-vue-next"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
</script>

<template>
    <DropdownMenu>
        <DropdownMenuTrigger as-child>
            <Avatar class="w-[2.25rem] h-[2.25rem] transition-transform duration-250 hover:scale-105 active:scale-95 hover:shadow-sm cursor-pointer">
                <AvatarImage src="https://github.com/unovue.png" alt="" />
                <AvatarFallback>AD</AvatarFallback>
            </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-[12rem] translate-y-2 -translate-x-2">
            <DropdownMenuLabel>菜单栏</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem class="cursor-pointer">
                <Award class="mr-2 h-4 w-4" />
                <span>返回主系统</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
                <DropdownMenuItem class="cursor-pointer" @click="authStore.logout">
                    <LogOut class="mr-2 h-4 w-4" />
                    <span>退出登录</span>
                </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
</template>