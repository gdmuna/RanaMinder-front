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
            const newCampaigns = ((res as any).data.campaigns || []).map((item: any) => {
                // 时间加8小时
                const CHN = (dateStr: string) => {
                    const date = new Date(dateStr);
                    return new Date(date.getTime() + 8 * 60 * 60 * 1000);
                };
                return {
                    ...item,
                    startDate: CHN(item.start_date),
                    endDate: CHN(item.end_date)
                };
            });
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

    async function createCampaign(data: { title: string; description: string; startDate: Date; endDate: Date; isActive: boolean }) {
        interviewDataStatus.value = 'loading'
        // 时间格式化函数
        function formatDate(date: Date): string {
            const pad = (n: number) => n < 10 ? '0' + n : n;
            return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
        }
        const payload = {
            title: data.title,
            description: data.description,
            start_date: formatDate(data.startDate),
            end_date: formatDate(data.endDate),
            is_active: data.isActive
        }
        const { err, res } = await interviewApi.createCampaign(payload)
        if (res) {
            toast.success('创建面试成功')
            interviewDataStatus.value = 'loaded'
            return res
        } else {
            toast.error(err?.data?.message || '创建面试失败')
            interviewDataStatus.value = 'error'
            throw err
        }
    }

    async function createStage(data: { campaign_id: number; title: string; description: string; sort_order: number; is_required: boolean }) {
        interviewDataStatus.value = 'loading'
        const { err, res } = await interviewApi.createStage(data)
        console.log('创建环节',data);
        if (res) {
            toast.success('创建环节成功')
            interviewDataStatus.value = 'loaded'
            return res
        } else {
            toast.error(err?.data?.message || '创建环节失败')
            interviewDataStatus.value = 'error'
            throw err
        }
    }

    async function createSession(data: { stage_id: number; title: string; start_time: string; end_time: string; location: string }) {
        interviewDataStatus.value = 'loading'
        const { err, res } = await interviewApi.createSession(data)
        if (res) {
            toast.success('创建场次成功')
            interviewDataStatus.value = 'loaded'
            return res
        } else {
            toast.error(err?.data?.message || '创建场次失败')
            interviewDataStatus.value = 'error'
            throw err
        }
    }

async function createTimeSlot(data: { seesion_id: number; start_time: string; end_time: string; max_seats: number }) {
    interviewDataStatus.value = 'loading'
    const { err, res } = await interviewApi.createTimeSlot(data)
    if (res) {
        toast.success('创建时间段成功')
        interviewDataStatus.value = 'loaded'
        return res
    } else {
        toast.error(err?.data?.message || '创建时间段失败')
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
        createCampaign,
        createStage,
        createSession,
        createTimeSlot
    }
})