import { defineStore } from 'pinia';

import { ref, reactive, computed, watch, toRaw } from 'vue';

import { useAuthStore } from '@/stores/auth';

import { interviewApi } from '@/api/interview';

import { toast } from 'vue-sonner';

import type {
    UserInfo
} from '@/types/user';

import type {
    Campaign,
    Campaigns,
    CampaignRes
} from '@/types/interview';

import type {
    DataStatus
} from '@/types/api';

import { useRoute } from 'vue-router';

import { isAfterNow, isBeforeOrBetweenNow, decodeJWT } from '@/lib/utils';

export const useInterviewStore = defineStore('interview', () => {

    const interviewDataStatus = ref<DataStatus>('idle')
    const campaigns = ref<Campaign[]>([]);
    const currentPage = ref(1);
    const pageSize = ref(10);
    const totalPages = ref(1);

    async function getCampaignList(page = 1, force: boolean = false) {
        interviewDataStatus.value = 'loading'
        const { err, res } = await interviewApi.getCampaignList({ currentPage: page, pageSize: pageSize.value }, force)
        if (res) {
            const newCampaigns = ((res as any).data.campaigns || []).map((item: any) => ({
                ...item,
                startDate: new Date(item.start_date),
                endDate: new Date(item.end_date)
            }));
            if (page === 1) {
                campaigns.value = newCampaigns;
            } else {
                campaigns.value = [...campaigns.value, ...newCampaigns];
            }
            currentPage.value = (res as any).data.pagination.currentPage || page;
            totalPages.value = (res as any).data.pagination.totalPages || 1;
            interviewDataStatus.value = 'loaded'
            return res
        } else {
            toast.error(err?.data?.message || '获取面试列表失败')
            interviewDataStatus.value = 'error'
            throw err
        }
    }

    return {
        campaigns,
        interviewDataStatus,
        getCampaignList,
        currentPage,
        pageSize,
        totalPages,
    }
})