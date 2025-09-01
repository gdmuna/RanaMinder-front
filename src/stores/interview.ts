import { defineStore } from 'pinia';
import { ref, reactive, computed, watch, toRaw } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { interviewApi } from '@/api/interview';
import { toast } from 'vue-sonner';
import type { UserInfo } from '@/types/user';
import type { Campaign, Campaigns, CampaignRes } from '@/types/interview';
import type { DataStatus } from '@/types/api';
import { useRoute } from 'vue-router';
import { 
    isAfterNow, 
    isBeforeOrBetweenNow, 
    decodeJWT, 
    handleApiRequest,
    formatDateTime
} from '@/lib/utils';

export const useInterviewStore = defineStore('interview', () => {

    const interviewDataStatus = ref<DataStatus>('idle')
    const campaigns = ref<Campaign[]>([]);
    const currentPage = ref(1);
    const pageSize = ref(10);
    const totalPages = ref(1);

    // 获取面试列表
    async function getCampaignList(page = 1, force: boolean = false) {
        interviewDataStatus.value = 'loading';
        try {
            const res = await handleApiRequest(
                () => interviewApi.getCampaignList({ currentPage: page, pageSize: pageSize.value }, force),
                '', // 不显示成功消息
                '获取面试列表失败',
                interviewDataStatus,
                false // 不显示成功提示
            );
            
            // 处理返回数据
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
            
            // 更新状态
            if (page === 1) {
                campaigns.value = newCampaigns;
            } else {
                campaigns.value = [...campaigns.value, ...newCampaigns];
            }
            currentPage.value = (res as any).data.pagination.currentPage || page;
            totalPages.value = (res as any).data.pagination.totalPages || 1;
            
            return res;
        } catch (error: any) {
            toast.error(error?.data?.message || '获取面试列表失败');
            throw error;
        }
    }

    // 创建面试活动
    async function createCampaign(data: { title: string; description: string; startDate: Date; endDate: Date; isActive: boolean }) {
        const payload = {
            title: data.title,
            description: data.description,
            start_date: formatDateTime(data.startDate),
            end_date: formatDateTime(data.endDate),
            is_active: data.isActive
        };
        
        return handleApiRequest(
            () => interviewApi.createCampaign(payload),
            '创建面试成功',
            '创建面试失败',
            interviewDataStatus
        );
    }

    // 创建面试环节
    async function createStage(data: { campaign_id: number; title: string; description: string; sort_order: number; is_required: boolean }) {
        return handleApiRequest(
            () => interviewApi.createStage(data),
            '创建环节成功',
            '创建环节失败',
            interviewDataStatus
        );
    }

    // 创建会话
    async function createSession(data: { stage_id: number; title: string; start_time: string; end_time: string; location: string }) {
        return handleApiRequest(
            () => interviewApi.createSession(data),
            '创建场次成功',
            '创建场次失败',
            interviewDataStatus
        );
    }

    // 创建时间段
    async function createTimeSlot(data: { session_id: number; start_time: string; end_time: string; max_seats: number }) {
        return handleApiRequest(
            () => interviewApi.createTimeSlot(data),
            '创建时间段成功',
            '创建时间段失败',
            interviewDataStatus
        );
    }

    // 删除面试活动
    async function deleteCampaign(id: number, force: boolean = false) {
        return handleApiRequest(
            () => interviewApi.deleteCampaign(id, force),
            '删除面试成功',
            '删除面试失败',
            interviewDataStatus
        );
    }

    // 查询环节
    async function getStage(id: number, force: boolean = false) {
        return handleApiRequest(
            () => interviewApi.getStage({ campaign_id: id }, force),
            '查询环节成功',
            '查询环节失败',
            interviewDataStatus
        );
    }

    // 查询场次
    async function getSession(id: number, force: boolean = false) {
        return handleApiRequest(
            () => interviewApi.getSession({ stage_id: id }, force),
            '查询场次成功',
            '查询场次失败',
            interviewDataStatus
        );
    }

    // 查询时间段
    async function getTimeSlot(id: number, force: boolean = false) {
        return handleApiRequest(
            () => interviewApi.getTimeSlot({ session_id: id }, force),
            '查询时间段成功',
            '查询时间段失败',
            interviewDataStatus
        );
    }

    // 更新面试活动
    async function updateCampaign(data: { id: number; title: string; description: string; startDate: Date; endDate: Date; isActive: boolean }) {
        const payload = {
            title: data.title,
            description: data.description,
            is_active: data.isActive,
            start_date: formatDateTime(data.startDate),
            end_date: formatDateTime(data.endDate),
        };
        
        return handleApiRequest(
            () => interviewApi.updateCampaign(data.id, payload),
            '更新面试成功',
            '更新面试失败',
            interviewDataStatus
        );
    }

    // 更新面试环节
    async function updateStage(data: { id: number; title: string; description: string; sort_order: number; is_required: boolean }) {
        const { id, title, description, sort_order, is_required } = data;
        const payload = { title, description, sort_order, is_required };
        
        return handleApiRequest(
            () => interviewApi.updateStage(id, payload),
            '更新环节成功',
            '更新环节失败',
            interviewDataStatus
        );
    }

    // 更新面试场次 
    async function updateSession(data: { id: number; title: string; start_time: string; end_time: string; location: string }) {
        const { id, title, start_time, end_time, location } = data;
        const payload = { title, start_time, end_time, location };
        
        return handleApiRequest(
            () => interviewApi.updateSession(id, payload),
            '更新场次成功',
            '更新场次失败',
            interviewDataStatus
        );
    }

    // 更新面试时间段
    async function updateTimeSlot(data: { id: number; start_time: string; end_time: string; max_seats: number }) {
        const { id, start_time, end_time, max_seats } = data;
        const payload = { start_time, end_time, max_seats };
        
        return handleApiRequest(
            () => interviewApi.updateTimeSlot(id, payload),
            '更新时间段成功',
            '更新时间段失败',
            interviewDataStatus
        );
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