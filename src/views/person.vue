<template>
    <div class="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 md:gap-14 gap-5 md:px-15 px-5 py-5 mt-[3.5rem]">
        <PersonCard v-for="person in personList" :key="person.stuId" :name="person.name" :groups="person.groups"
            :grade="person.grade" :major="person.major" :stuId="person.stuId" @click="showDetail(person)" />
    </div>
    <!-- 人员详细卡片弹窗 -->
    <teleport to="body">
        <Transition name="fade">
            <div v-if="showPersonDetail"
                class="fixed inset-0 dark:bg-black/50 backdrop-blur-xs z-10 flex items-center md:justify-center flex-col justify-end"
                @click.self="closeDetail">
                <PersonDetail :person="selectedPerson" :deliverCloseDetail="closeDetail" />
            </div>
        </Transition>
    </teleport>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import PersonCard from '@/components/personCard.vue'
import PersonDetail from '@/components/personDetail.vue'
import { usePersonStore } from '@/stores/person'
import { storeToRefs } from 'pinia'

// 使用Pinia store
const personStore = usePersonStore()
const { appUsers, personDataStatus } = storeToRefs(personStore)

// 获取用户数据
onMounted(async () => {
    try {
        await personStore.getUserList();
        
        // 在控制台打印转换后的用户数据
        console.log('人员页面获取到的AppUser列表:', appUsers.value);
        console.log('转换后的显示列表:', personList.value);
    } catch (error) {
        console.error('Failed to load user list:', error);
        // 可以在这里添加错误处理，例如显示错误提示等
    }
})

// 将appUsers转换为页面需要的格式
const personList = computed(() => {
    return appUsers.value.map(user => ({
        id: user.id,
        stuId: user.stuId || '未填写',
        name: user.displayName || user.nickname || user.stuId || '未填写',
        grade: getUserGrade(user),
        major: user.properties?.major || '未填写',
        links: user.properties?.links || '未填写',
        nickName: user.properties?.nickname || '未填写',
        email: user.email || '未填写',
        phoneNum: user.phone || '未填写',
        gender: user.gender || '未填写',
        avatar: user.avatar || '',
        groups: getGroups(user)
    }))
})

// 提取权限信息
function getGroups(user: any): string[] {
    if (user.groups && user.groups.length > 0) {
        return user.groups.map((group: string) => {
            // 提取组织名称，忽略owner前缀
            const parts = group.split('/');
            if (parts.length > 1) {
                return parts[1];
            } else {
                return group;
            }
        });
    }
    return ['未分配']
}

// 从用户属性中提取年级信息
function getUserGrade(user: any): string {
    // 从学号提取年级
    if (user.stuId && user.stuId.length >= 4) {
        return '20' + user.stuId.substring(0, 2) + '级'
    }

    return '未填写'
}

const showPersonDetail = ref(false)
const selectedPerson = ref<{
    stuId: string;
    name: string;
    grade: string;
    major: string;
    email: string;
    phoneNum: string;
    gender: string;
    avatar: string;
    groups: string[];
} | undefined>(undefined);

function showDetail(person: {
    stuId: string;
    name: string;
    grade: string;
    major: string;
    email: string;
    phoneNum: string;
    gender: string;
    avatar: string;
    groups: string[];
}) {
    selectedPerson.value = person
    showPersonDetail.value = true
}

function closeDetail() {
    showPersonDetail.value = false
    selectedPerson.value = undefined
}

watch(showPersonDetail, (Val) => {
    if (Val) {
        document.body.style.overflow = 'hidden'
    } else {
        document.body.style.overflow = ''
    }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition:
        opacity 0.30s cubic-bezier(.4, 0, .2, 1),
        transform 0.30s cubic-bezier(.4, 0, .2, 1);
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(40px);
}

.fade-enter-to,
.fade-leave-from {
    opacity: 1;
    transform: translateY(0);
}
</style>