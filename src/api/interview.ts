import { ranaMinder } from './index';

import { ref } from 'vue';

export const interviews = ref<any[]>([]);
export const currentPage = ref(1);
export const pageSize = ref(2);
export const totalPages = ref(1);
export const loading = ref(false);

// export async function fetchInterviews(page = 1) {
//     if (loading.value) return;
//     loading.value = true;
//     try {
//         const response = await ranaMinder.Get('/campaign/user', {
//             params: {
//                 currentPage: page,
//                 pageSize: pageSize.value,
//             }
//         });
//         const res = response as any;
//         if (page === 1) {
//             interviews.value = [];
//         }
//         interviews.value.push(...res.data.campaigns.map((item: any) => ({
//             id: item.id,
//             title: item.title,
//             time: new Date(item.start_date),
//         })));
//         totalPages.value = res.data.pagination.totalPages;
//         currentPage.value = res.data.pagination.currentPage;
//     } catch (error) {
//         console.error('获取面试列表失败:', error);
//     }
//     loading.value = false;
// }

export async function interviewApi (page = 1) {
    if (loading.value) return;
    loading.value = true;
    try {
        const response = await ranaMinder.Get('/campaign/user', {
            params: {
                currentPage: page,
                pageSize: pageSize.value,
            }
        });
        const res = response as any;
        if (page === 1) {
            interviews.value = [];
        }
        interviews.value.push(...res.data.campaigns.map((item: any) => ({
            id: item.id,
            title: item.title,
            time: new Date(item.start_date),
        })));
        totalPages.value = res.data.pagination.totalPages;
        currentPage.value = res.data.pagination.currentPage;
    } catch (error) {
        console.error('获取面试列表失败:', error);
    }
    loading.value = false;
}