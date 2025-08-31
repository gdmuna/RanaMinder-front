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

    // 获取面试列表
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

    // 创建面试活动
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

    // 创建面试环节
    async function createStage(data: { campaign_id: number; title: string; description: string; sort_order: number; is_required: boolean }) {
        interviewDataStatus.value = 'loading'
        const { err, res } = await interviewApi.createStage(data)
        console.log('创建环节', data);
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

    // 创建会话
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

    // 创建时间段
    async function createTimeSlot(data: { session_id: number; start_time: string; end_time: string; max_seats: number }) {
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

    // 删除面试活动
    async function deleteCampaign(id: number, force: boolean = false) {
        interviewDataStatus.value = 'loading'
        const { err, res } = await interviewApi.deleteCampaign(id, force)
        if (res) {
            toast.success('删除面试成功')
            interviewDataStatus.value = 'loaded'
            return res
        } else {
            toast.error(err?.data?.message || '删除面试失败')
            interviewDataStatus.value = 'error'
            throw err
        }
    }

    // 查询环节
    async function getStage(id: number, force: boolean = false) {
        interviewDataStatus.value = 'loading'
        const { err, res } = await interviewApi.getStage({ campaign_id: id }, force)
        if (res) {
            toast.success('查询环节成功')
            interviewDataStatus.value = 'loaded'
            return res
        } else {
            toast.error(err?.data?.message || '查询环节失败')
            interviewDataStatus.value = 'error'
            throw err
        }
    }

    // 查询场次
    async function getSession(id: number, force: boolean = false) {
        interviewDataStatus.value = 'loading'
        const { err, res } = await interviewApi.getSession({ stage_id: id }, force)
        if (res) {
            toast.success('查询场次成功')
            interviewDataStatus.value = 'loaded'
            return res
        } else {
            toast.error(err?.data?.message || '查询场次失败')
            interviewDataStatus.value = 'error'
            throw err
        }
    }

    // 查询时间段
    async function getTimeSlot(id: number, force: boolean = false) {
        interviewDataStatus.value = 'loading'
        const { err, res } = await interviewApi.getTimeSlot({ session_id: id }, force)
        if (res) {
            toast.success('查询时间段成功')
            interviewDataStatus.value = 'loaded'
            return res
        } else {
            toast.error(err?.data?.message || '查询时间段失败')
            interviewDataStatus.value = 'error'
            throw err
        }
    }

    // 更新面试活动
    async function updateCampaign(data: { id: number; title: string; description: string; startDate: Date; endDate: Date; isActive: boolean }) {
        interviewDataStatus.value = 'loading'
        
        // 时间格式化函数
        function formatDate(date: Date): string {
            const pad = (n: number) => n < 10 ? '0' + n : n;
            return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
        }
        
        const payload = {
            title: data.title,
            description: data.description,
            is_active: data.isActive,
            start_date: formatDate(data.startDate),
            end_date: formatDate(data.endDate),
        }
        
        const { err, res } = await interviewApi.updateCampaign(data.id, payload)
        if (res) {
            toast.success('更新面试成功')
            interviewDataStatus.value = 'loaded'
            return res
        } else {
            toast.error(err?.data?.message || '更新面试失败')
            interviewDataStatus.value = 'error'
            throw err
        }
    }

    // 更新面试环节
    async function updateStage(data: { id: number; title: string; description: string; sort_order: number; is_required: boolean }) {
        interviewDataStatus.value = 'loading'
        const { id, title, description, sort_order, is_required } = data;
        const payload = { title, description, sort_order, is_required };
        const { err, res } = await interviewApi.updateStage(id, payload);
        if (res) {
            toast.success('更新环节成功')
            interviewDataStatus.value = 'loaded'
            return res
        } else {
            toast.error(err?.data?.message || '更新环节失败')
            interviewDataStatus.value = 'error'
            throw err
        }
    }

    // 更新面试场次 
    async function updateSession(data: { id: number; title: string; start_time: string; end_time: string; location: string }) {
        interviewDataStatus.value = 'loading'
        const { id, title, start_time, end_time, location } = data;
        const payload = { title, start_time, end_time, location };
        const { err, res } = await interviewApi.updateSession(id, payload);
        if (res) {
            toast.success('更新场次成功')
            interviewDataStatus.value = 'loaded'
            return res
        } else {
            toast.error(err?.data?.message || '更新场次失败')
            interviewDataStatus.value = 'error'
            throw err
        }
    }

    // 更新面试时间段
    async function updateTimeSlot(data: { id: number; start_time: string; end_time: string; max_seats: number }) {
        interviewDataStatus.value = 'loading'
        const { id, start_time, end_time, max_seats } = data;
        const payload = { start_time, end_time, max_seats };
        const { err, res } = await interviewApi.updateTimeSlot(id, payload);
        if (res) {
            toast.success('更新时间段成功')
            interviewDataStatus.value = 'loaded'
            return res
        } else {
            toast.error(err?.data?.message || '更新时间段失败')
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
        createTimeSlot,
        deleteCampaign,
        getStage,
        getSession,
        getTimeSlot,
        updateCampaign,
        updateStage,
        updateSession,
        updateTimeSlot,
    }
})