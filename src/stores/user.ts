// import { defineStore } from 'pinia';

// import { ref, reactive, computed, watch, toRaw } from 'vue';

// import { useAuthStore } from '@/stores/auth';

// import { userApi } from '@/api';

// import { toast } from 'vue-sonner';

// import type {
//     UserInfo,
//     InterviewFormJSON,
//     InterviewReservation,
//     InterviewResult,
//     Step
// } from '@/types/user';

// import { useRoute } from 'vue-router';

// import { isAfterNow, isBeforeOrBetweenNow } from '@/lib/utils';

// export const useUserStore = defineStore('user', () => {
//     const route = useRoute();
//     async function getUserInfo() {
//         const { err, res } = await userApi.getUserInfo()
//         if (res) {
//             const info = res.data.data
//             handleUserInfo(info)
//             return Promise.resolve()
//         } else {
//             toast.error(err.data.message || '获取用户信息失败')
//             return Promise.reject()
//         }
//     }

//     async function initUserInfo() {
//         try {
//             const authStore = useAuthStore()
//             await authStore.refresh();
//             await getUserInfo();
//             await loadInterviewFormJSON();
//             return true;
//         } catch (e) {
//             if (e) {
//                 toast.error(e);
//             }
//             return false;
//         }
//     }

//     const userInfo = reactive<UserInfo>({
//         studentNumber: 0,
//         username: '',
//         nickname: '',
//         bio: '',
//         email: '',
//         avatar: '',
//         affiliation: '',
//         createdAt: new Date(),
//         lastLogin: new Date(),
//         groups: [] as string[],
//         links: [] as string[]
//     })

//     function handleUserInfo(info: any) {
//         userInfo.studentNumber = info.name
//         userInfo.username = info.displayName
//         userInfo.nickname = info.nickname || '千早爱音'
//         userInfo.bio = info.bio || '千早爱音美貌盖世无双'
//         userInfo.email = info.email
//         userInfo.avatar = info.avatar
//         userInfo.affiliation = info.affiliation
//         userInfo.createdAt = new Date(info.createdTime)
//         userInfo.lastLogin = new Date(info.lastSigninTime)
//         userInfo.groups = info.groups
//         userInfo.links = info.links || ['https://fov-rgt.cn']
//     }

//     function cleanUserInfo() {
//         userInfo.studentNumber = 0
//         userInfo.username = ''
//         userInfo.nickname = ''
//         userInfo.bio = ''
//         userInfo.email = ''
//         userInfo.avatar = ''
//         userInfo.affiliation = ''
//         userInfo.createdAt = new Date()
//         userInfo.lastLogin = new Date()
//         userInfo.groups = []
//         userInfo.links = []
//     }

//     async function updateUserInfo(info: any) {
//         return new Promise(resolve => {
//             setTimeout(() => {
//                 userInfo.nickname = info.nickname
//                 userInfo.bio = info.bio
//                 userInfo.email = info.email
//                 userInfo.links = info.links
//                 const random = Math.random()
//                 random < 0.5 ? resolve(true) : resolve(false)
//             }, 1000);
//         })
//     }

//     const hasInterviews = computed(() => {
//         const result = [] as number[]
//         restructuredData.value.forEach((item) => {
//             result.push(item.campaign.id)
//         })
//         return result
//     })

//     const interviews = ref([
//         {
//             id: 1,
//             title: "2025年网络协会招新面试",
//             description: "网络协会招新，欢迎各位同学加入我们的大家庭！",
//             startDate: "2025-09-01",
//             endDate: "2025-09-30",
//             isActive: true
//         },
//         {
//             id: 2,
//             title: "2025年ACM协会招新面试",
//             description: "ACM协会招新，欢迎各位同学加入我们的大家庭！",
//             startDate: "2025-09-01",
//             endDate: "2025-09-30",
//             isActive: true
//         }
//     ])
//     function checkHasInterview(nodeId: number) {
//         return hasInterviews.value.includes(nodeId)
//     }

//     const currentTitle = ref('面试节点')
//     const currentInterviewId = ref<number | null>(null)

//     const isUnderWay = computed(() => {
//         return currentInterviewResult.value?.status === 'pending'
//     })

//     const waitingInterview = computed(() => {
//         // 没有面试数据直接返回 false
//         if (!currentInterview.value || currentInterview.value.length === 0) return false
//         // 遍历所有 session，判断是否有等待中的
//         return currentInterview.value.some(item => {
//             const session = item.campaign.stage.session
//             if (!session) return false
//             // 当前时间在 start_time 之前，或者在 start_time 和 end_time 之间
//             return isBeforeOrBetweenNow(session.start_time, session.end_time)
//         })
//     })

//     const currentInterview = computed(() => {
//         if (currentInterviewId.value === null) return null
//         const result = restructuredData.value.filter(item =>
//             item.campaign.id === currentInterviewId.value
//         )
//         if (result.length === 0) return null
//         return result
//     })

//     watch(
//         () => route.params.nodeId,
//         (nodeId) => {
//             if (nodeId === undefined || route.name !== 'interviewNode') return
//             const item = interviews.value.find(item => item.id === Number(nodeId))
//             const id = item ? item.id : null
//             const title = item ? item.title : '面试节点'
//             currentTitle.value = title
//             currentInterviewId.value = id
//         },
//         { immediate: true }
//     )

//     async function loadInterviewFormJSON() {
//         const res = await fetch('/template.json');
//         if (!res.ok) {
//             throw new Error('加载表单配置失败');
//         }
//         const data = await res.json();
//         interviewFormJSON.value = data;
//     }
//     loadInterviewFormJSON();

//     const interviewFormJSON = ref<InterviewFormJSON[]>([])
//     // 示例面试数据
//     const originalData = ref<InterviewReservation[]>([
//         {
//             id: 1,
//             user_id: 1,
//             campaign: {
//                 id: 1,
//                 title: "2025社团招新",
//                 description: "2025年社团招新，欢迎各位同学加入我们的大家庭！",
//                 start_date: "2025-08-31T16:00:00.000Z",
//                 end_date: "2025-09-29T16:00:00.000Z",
//                 is_active: true,
//                 stage: {
//                     id: 1,
//                     title: "一面",
//                     description: "第一次面试",
//                     campaign_id: 1,
//                     session: {
//                         id: 1,
//                         title: "一面10号场",
//                         start_time: "2025-08-10T00:00:00.000Z",
//                         end_time: "2025-08-10T23:59:59.000Z",
//                         location: "会议室A",
//                         time_slot: {
//                             id: 1,
//                             start_time: "2025-09-10T09:00:00.000Z",
//                             end_time: "2025-09-10T12:00:00.000Z",
//                             max_seats: 10,
//                             booked_seats: 2,
//                             is_available: true
//                         }
//                     }
//                 }
//             },
//             selection_status: "confirmed",
//             createdAt: "2025-08-14T13:16:59.000Z",
//             updatedAt: "2025-08-14T13:16:59.000Z"
//         },
//         {
//             id: 1,
//             user_id: 1,
//             campaign: {
//                 id: 1,
//                 title: "2025社团招新",
//                 description: "2025年社团招新，欢迎各位同学加入我们的大家庭！",
//                 start_date: "2025-08-31T16:00:00.000Z",
//                 end_date: "2025-09-29T16:00:00.000Z",
//                 is_active: true,
//                 stage: {
//                     id: 1,
//                     title: "二面",
//                     description: "第二次面试",
//                     campaign_id: 1,
//                     session: {
//                         id: 1,
//                         title: "二面10号场",
//                         start_time: "2025-08-12T00:00:00.000Z",
//                         end_time: "2025-08-12T23:59:59.000Z",
//                         location: "会议室B",
//                         time_slot: {
//                             id: 1,
//                             start_time: "2025-09-12T09:00:00.000Z",
//                             end_time: "2025-09-12T12:00:00.000Z",
//                             max_seats: 10,
//                             booked_seats: 2,
//                             is_available: true
//                         }
//                     }
//                 }
//             },
//             selection_status: "confirmed",
//             createdAt: "2025-08-14T13:16:59.000Z",
//             updatedAt: "2025-08-14T13:16:59.000Z"
//         }
//     ]);

//     const restructuredData = ref<InterviewReservation[]>([]);
//     function restructure(data: any) {
//         // 深拷贝
//         const deepClone = data.map((item: any) => structuredClone(item));
//         return deepClone
//     }
//     const rawData = toRaw(originalData.value);
//     restructuredData.value = restructure(rawData);

//     const interviewResult = reactive<InterviewResult[]>([
//         {
//             id: 0,
//             application_id: 0,
//             campaign_id: 1,
//             user_id: 0,
//             association: null,
//             department: null,
//             role: null,
//             status: 'rejected',
//             createdAt: '2025-08-14T13:16:59.000Z',
//             updatedAt: '2025-08-14T13:16:59.000Z'
//         }
//     ])

//     const currentInterviewResult = computed(() => {
//         if (currentInterviewId.value === null) return null
//         return interviewResult.find(item => item.campaign_id === currentInterviewId.value) ?? null
//     })

//     const steps = computed(() => {
//         let Steps: Step[] = [
//             {
//                 step: 1,
//                 title: "提交面试报名表",
//                 description:
//                     "于此网站中填写并提交面试报名表",
//                 state: 'completed',
//                 result: 'approved',
//                 type: 'event',
//                 details: [
//                     {
//                         tag: 'section',
//                         style: 'flex flex-col items-center justify-center md:space-y-4 space-y-2 md:col-span-3 md:mt-0 mt-2',
//                         children: [
//                             {
//                                 tag: 'h1',
//                                 content: '面试报名表已提交',
//                                 style: 'text-emerald-500 md:text-3xl text-2xl font-bold',
//                                 children: [
//                                     {
//                                         tag: 'span',
//                                         content: '🎉'
//                                     }
//                                 ]
//                             },
//                             {
//                                 tag: 'p',
//                                 content: '您已成功提交面试报名表，请进行下一步，或等待后续通知。',
//                                 style: 'text-green-100 text-lg text-center'
//                             }
//                         ]
//                     },
//                 ]
//             }
//         ]
//         if (currentInterview.value) {
//             currentInterview.value.forEach((item) => {
//                 Steps.push({
//                     step: Steps.length + 1,
//                     title: `进行流程 ${item.campaign.stage.title}`,
//                     description: `${item.campaign.stage.description}`,
//                     ...(item.campaign.stage.session ? { session: item.campaign.stage.session } : {}),
//                     state: function () {
//                         const session = item.campaign.stage.session
//                         if (isUnderWay.value && isBeforeOrBetweenNow(session.start_time, session.end_time)) return 'active'
//                         if (isAfterNow(session.end_time) || !isUnderWay.value) return 'completed'
//                         return 'inactive'
//                     }(),
//                     result: 'pending',
//                     type: 'process'
//                 })
//             })
//         }
//         Steps = [...Steps, {
//             step: Steps.length + 1,
//             title: "等待后续通知",
//             description:
//                 "根据实际情况，可能会进行加面。您可以在此网站中查看面试状态，也可以通过邮件或其他方式获取通知。",
//             state: function () {
//                 if (isUnderWay.value && (!waitingInterview.value || !currentInterview.value)) return 'active'
//                 if (!isUnderWay.value) return 'completed'
//                 return 'inactive'
//             }(),
//             result: 'pending',
//             type: 'event',
//             details: [
//                 {
//                     tag: 'section',
//                     style: 'flex flex-col items-center justify-center md:space-y-4 space-y-2 md:col-span-3 md:mt-0 mt-2',
//                     children: [
//                         {
//                             tag: 'h1',
//                             content: '静候佳音 ✨',
//                             style: 'text-emerald-500 md:text-6xl text-4xl font-bold'
//                         }
//                     ]
//                 }
//             ]
//         },
//         {
//             step: Steps.length + 2,
//             title: "面试结束",
//             description:
//                 "面试结束后，您可以在此网站中查看面试结果，也可以通过邮件或其他方式获取通知。",
//             state: isUnderWay.value ? 'inactive' : 'completed',
//             result: currentInterviewResult.value?.status || 'pending',
//             type: 'result'
//         }]
//         return Steps
//     })


//     return {
//         getUserInfo,
//         initUserInfo,
//         userInfo,
//         handleUserInfo,
//         cleanUserInfo,
//         updateUserInfo,
//         checkHasInterview,
//         interviews,
//         currentTitle,
//         interviewFormJSON,
//         originalData,
//         restructuredData,
//         steps,
//         currentInterviewResult
//     }
// })