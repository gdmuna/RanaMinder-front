<template>
    <div
        class="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 md:gap-14 gap-5 md:px-15 px-5 py-5 mt-[3.5rem] mb-[2.5rem] md:max-w-full max-w-[30rem] mx-auto">
        <InterviewCard v-for="person in personList" :key="person.stuId" 
            :application="personToApplication(person)"
            :intention="person.intention"
            :checkedIds="checkedIds" 
            @check="handleCheck" 
            @click="handleOpen(person)" />
    </div>
    <!-- 底部导航栏 -->
    <teleport to="body">
        <BottomBar :checkedIds="checkedIds" />
    </teleport>
    <!-- 面试者详细卡片弹窗 -->
    <teleport to="body">
        <Transition name="fade">
            <div v-if="showPersonDetail"
                class="fixed inset-0 dark:bg-black/50 backdrop-blur-[2px] z-10 flex items-center md:justify-center flex-col justify-end"
                @click.self="closeDetail">
                <InterviewDetail :person="selectedPerson" :deliverCloseDetail="closeDetail" />
            </div>
        </Transition>
    </teleport>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import InterviewCard from '@/components/interviewCard.vue';
import InterviewDetail from '@/components/interviewDetail.vue'
import BottomBar from '@/components/bottomBar.vue'
import { interviewApi } from '@/api/interview'

// 处理后的人员数据类型
interface PersonData {
    id: number;
    stuId: string;
    name: string;
    intention: string[];
    grade: string;
    major: string;
    email: string;
    phoneNum: string;
    photo?: string; // 添加照片URL字段
    information: Record<string, any>;
}

// 将处理后的人员数据转换回application格式（供InterviewCard使用）
function personToApplication(person: PersonData) {
    return {
        id: person.id,
        stu_id: person.stuId,
        photo: person.photo, // 添加photo字段，与information同级
        information: {
            ...person.information,
            name: person.name,
            intention: person.intention,
            grade: person.grade,
            major: person.major,
            email: person.email,
            phone: person.phoneNum
        }
    };
}

// 展示/关闭详情相关
const showPersonDetail = ref(false)
const selectedPerson = ref<PersonData | undefined>(undefined);
const route = useRoute()
const campaignId = ref<number | null>(null)
const personList = ref<PersonData[]>([])
const loading = ref(true)

function showDetail(person: PersonData) {
    selectedPerson.value = person
    showPersonDetail.value = true
}

function closeDetail() {
    showPersonDetail.value = false
    selectedPerson.value = undefined
}

function handleOpen(person: PersonData) {
    showDetail(person);
}

// 卡片勾选相关
const checkedIds = ref<string[]>([]);

function handleCheck(stuId: string) {
    if (!checkedIds.value.includes(stuId)) {
        checkedIds.value.push(stuId);
    } else {
        checkedIds.value = checkedIds.value.filter(id => id !== stuId);
    }
    console.log('已选择卡片id:', [...checkedIds.value]);
}

// 获取应用列表
async function fetchApplications() {
    loading.value = true
    try {
        // 从路由参数中获取campaignId
        const id = route.params.id ? parseInt(route.params.id as string) : null
        if (!id) {
            console.error('未找到活动ID')
            loading.value = false
            return
        }
        
        campaignId.value = id
        const response = await interviewApi.getApplications({ campaign_id: id })
        
        console.log('API响应:', response)
        
        // 处理多种可能的响应结构
        let applicationsData = null
        
        if (response && response.res) {
            // 结构1: response.res.applications (ReturnTemplate 结构)
            if (response.res.applications) {
                applicationsData = response.res.applications
            } 
            // 结构2: response.res.data.applications (通过 data 包装)
            else if ((response.res as any).data && (response.res as any).data.applications) {
                applicationsData = (response.res as any).data.applications
            }
            // 结构3: response.res 本身就是 applications 数组
            else if (Array.isArray(response.res)) {
                applicationsData = response.res
            }
        } 
        // 结构4: response 本身就是带有 success 和 data 的格式
        else if ((response as any).success && (response as any).data && (response as any).data.applications) {
            applicationsData = (response as any).data.applications
        }
        
        if (applicationsData) {
            // 转换API数据为组件所需格式
            personList.value = applicationsData.map((app: any) => {
                const info = app.information || {}
                return {
                    id: app.id,
                    stuId: app.stu_id,
                    name: info.name || '未填写',
                    intention: Array.isArray(info.intention) ? info.intention : info.intention ? [info.intention] : ['未填写'],
                    grade: info.grade || '未填写',
                    major: info.major || '未填写',
                    email: info.email || info.mail || '未填写',
                    phoneNum: info.phone || info.phoneNum || info.phoneNumber || '未填写',
                    photo: app.photo || null, // 从application根级别获取photo字段
                    information: info // 保存完整的information对象
                }
            })
            console.log('处理后的人员列表:', personList.value)
        } else {
            console.error('无法解析API响应中的applications数据:', response)
        }
    } catch (error) {
        console.error('获取应用列表失败:', error)
    } finally {
        loading.value = false
    }
}

// 监听器
watch(showPersonDetail, (Val) => {
    if (Val) {
        document.body.style.overflow = 'hidden'
    } else {
        document.body.style.overflow = ''
    }
})

onMounted(() => {
    fetchApplications()
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

.overflow-hidden {
    overflow: hidden;
}
</style>